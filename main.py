import os
import requests
import pandas as pd
from io import BytesIO
import re
from google.cloud import firestore

db = firestore.Client()

def get_fund_data_from_url(url):
    """Fetches and reads fund data from a specific Triodos URL."""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        print(f"Fetching data from {url}...")
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        isin_code = "UNKNOWN"
        content_disposition = response.headers.get('content-disposition')
        if content_disposition:
            fname_match = re.findall('filename="(.+)"', content_disposition)
            if fname_match:
                full_filename = fname_match[0]
                isin_code = full_filename[-17:][:12]
        
        print(f"Parsing Excel file for ISIN: {isin_code}...")
        data = pd.read_excel(BytesIO(response.content), header=10)
        data.dropna(how='all', inplace=True)
        data['ISIN'] = isin_code
        return data

    except Exception as e:
        print(f"An error occurred for {url}: {e}")
        return None

def write_new_data_to_firestore(df, collection_name='triodos_fund_data'):
    """Writes new rows from a DataFrame to a Firestore collection."""
    records_written = 0
    for index, row in df.iterrows():
        date_str = row['Datum'].strftime('%Y-%m-%d')
        doc_id = f"{row['ISIN']}_{date_str}"
        
        doc_ref = db.collection(collection_name).document(doc_id)
        
        if not doc_ref.get().exists:
            # This dictionary now uses the simple, renamed columns
            # and hard-codes the currency.
            data_dict = {
                'ISIN': row['ISIN'],
                'FundName': row['FundName'],
                'Date': row['Datum'],
                'Price': float(row['Koers']),
                'Currency': 'EUR' 
            }
            doc_ref.set(data_dict)
            print(f"✅ Successfully wrote document: {doc_id}")
            records_written += 1
        else:
            print(f"ℹ️ Document already exists, skipping: {doc_id}")
            
    return records_written

def main_handler(event=None, context=None):
    """Main script entry point."""
    urls_to_fetch = [
        "https://www.triodos.nl/fund-data-download?fund=TPIF&isin=LU0785618744&price=TRADING_SHARE_PRICE",
        "https://www.triodos.nl/fund-data-download?fund=TFSF&isin=NL0013087968&price=TRADING_SHARE_PRICE"
    ]

    all_dataframes = []
    for url in urls_to_fetch:
        fund_df = get_fund_data_from_url(url)
        if fund_df is not None:
            all_dataframes.append(fund_df)
    
    if all_dataframes:
        combined_dataframe = pd.concat(all_dataframes, ignore_index=True)
        
        # CORRECTED RENAMING: Use the actual column names you provided.
        combined_dataframe.rename(columns={
            'As Of Date': 'Datum',
            'Trading Share Price (EUR)': 'Koers',
            'Fund Name': 'FundName'
        }, inplace=True)
        
        # Convert 'Datum' column to datetime objects
        combined_dataframe['Datum'] = pd.to_datetime(combined_dataframe['Datum'])

        print("\n--- Writing new data to Firestore ---")
        count = write_new_data_to_firestore(combined_dataframe)
        print(f"\n--- Process Complete. Wrote {count} new record(s). ---")
    else:
        print("\nCould not fetch data from any of the URLs.")

if __name__ == "__main__":
    main_handler()
