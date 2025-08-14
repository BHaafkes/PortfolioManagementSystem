import os
import requests
import pandas as pd
from io import BytesIO
import re
from google.cloud import firestore

# --- It's best practice to initialize clients outside the main function ---
# This allows for connection reuse in serverless environments.
db = firestore.Client()

def get_fund_data_from_url(url):
    """
    Fetches and reads fund data from a specific Triodos URL.
    This function downloads an Excel file, extracts its filename from the
    response headers, and then uses pandas to parse the data, adding the
    ISIN as a new column.
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        print(f"Fetching data from {url}...")
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        print("Data fetched successfully.")

        isin_code = "UNKNOWN"
        content_disposition = response.headers.get('content-disposition')
        if content_disposition:
            fname_match = re.findall('filename="(.+)"', content_disposition)
            if fname_match:
                full_filename = fname_match[0]
                isin_code = full_filename[-17:][:12]
        print(f"Source ISIN identified as: {isin_code}")

        print("Parsing Excel file...")
        data = pd.read_excel(BytesIO(response.content), header=10)
        data.dropna(how='all', inplace=True)
        data['ISIN'] = isin_code
        return data

    except requests.exceptions.RequestException as e:
        print(f"An error occurred during the HTTP request for {url}: {e}")
        return None
    except Exception as e:
        print(f"An error occurred while parsing the data for {url}: {e}")
        return None

def write_new_data_to_firestore(df, collection_name='triodos_fund_data'):
    """
    Writes new rows from a DataFrame to a Firestore collection.
    It checks for existence using a document ID composed of ISIN and Date.
    """
    # Ensure 'Datum' column is in datetime format to standardize it
    df['Datum'] = pd.to_datetime(df['Datum'])
    
    records_written = 0
    for index, row in df.iterrows():
        # Create a unique document ID from the ISIN and date (YYYY-MM-DD format)
        date_str = row['Datum'].strftime('%Y-%m-%d')
        doc_id = f"{row['ISIN']}_{date_str}"
        
        doc_ref = db.collection(collection_name).document(doc_id)
        
        # Check if the document already exists
        if not doc_ref.get().exists:
            # Convert the row to a dictionary for Firestore
            # We must convert numpy types (like numpy.float64) to native Python types
            data_dict = {
                'ISIN': row['ISIN'],
                'Date': row['Datum'], # Firestore handles Python datetime objects well
                'Price': float(row['Koers']),
                'Currency': row['Valuta']
            }
            
            # Set the data in Firestore
            doc_ref.set(data_dict)
            print(f"✅ Successfully wrote document: {doc_id}")
            records_written += 1
        else:
            print(f"ℹ️ Document already exists, skipping: {doc_id}")
            
    return records_written


def main_handler(event=None, context=None):
    """
    Main entry point for the script. Cloud Functions and Run can call this.
    """
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
        
        # Rename columns to be more database-friendly (no special characters)
        combined_dataframe.rename(columns={'Handelskoers': 'Koers'}, inplace=True)
        
        print("\n--- Writing new data to Firestore ---")
        count = write_new_data_to_firestore(combined_dataframe)
        print(f"\n--- Process Complete. Wrote {count} new record(s). ---")
    else:
        print("\nCould not fetch data from any of the URLs.")


# This allows the script to be run locally for testing
if __name__ == "__main__":
    main_handler()
