import React, { useState, useMemo, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

// --- ICONS (using inline SVGs for simplicity) ---
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);
const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
const ChevronLeft = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
const Briefcase = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);
const UploadCloud = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
);
const Download = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const ArrowUpDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
);
const PanelRightClose = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/></svg>
);
const PanelRightOpen = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/><path d="m8 9 3 3-3 3"/></svg>
);
const HomeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
);
const PlusCircle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
);
const XCircle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);
const ArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const Trash2 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);
const PieChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
);
const LineChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
);
const Edit = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);
const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
const RestoreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6"/><path d="M22 11.5A10 10 0 0 0 3.5 12.5"/><path d="M2 12.5a10 10 0 0 0 18.5-1"/></svg>
);
const CheckCircle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);


// --- Placeholder for your portfolio.json data ---
const dummyPortfolioData = {
  "Asset master table": [{"Asset Number":"A0001","Asset Description":"Triodos Pioneer Impact Fund","Asset Type":"Aandelen","Asset Group":"Aandelen","Broker":"Triodos","Waarderingsmethode":"Fair Value PL", "Status": "Active"}, {"Asset Number":"D0001","Asset Description":"Triodos Fare Share Fund","Asset Type":"Debt","Asset Group":"Obligaties","Broker":"Triodos","Waarderingsmethode":"Fair Value PL", "Status": "Active"}, {"Asset Number":"E0001","Asset Description":"Invesco Bloomberg Commodity UCITS ETF","Asset Type":"ETF","Asset Group":"Commodities","Broker":"DeGiro","Waarderingsmethode":"Fair Value PL", "Status": "Active"}],
  "Asset Group master table": [{"Asset Group":"Aandelen","GL Account":10010,"GL Account Waardeverandering":800010,"GL Account Dividend/Interest":null}, {"Asset Group":"Obligaties","GL Account":10050,"GL Account Waardeverandering":800050,"GL Account Dividend/Interest":null}, {"Asset Group":"Commodities","GL Account":10030,"GL Account Waardeverandering":800030,"GL Account Dividend/Interest":null}],
  "Subadministration": [{"Asset Number":"A0001","Asset Description":"Triodos Pioneer Impact Fund","Broker":"Triodos","GL Account":10010,"GL Account Waardeverandering":800010,"Waarderingsmethode":"Fair Value PL","Waarde bijgewerkt":"2024-12-27","Aantal stukken":138.443,"Meest recente prijs":71.39,"Meest recente waarde":9883.44577,"Couponrente":null,"Effectieve rente":null}, {"Asset Number":"D0001","Asset Description":"Triodos Fare Share Fund","Broker":"Triodos","GL Account":10050,"GL Account Waardeverandering":800050,"Waarderingsmethode":"Fair Value PL","Waarde bijgewerkt":"2024-12-27","Aantal stukken":55.737,"Meest recente prijs":37.87,"Meest recente waarde":2110.76019,"Couponrente":null,"Effectieve rente":null}, {"Asset Number":"E0001","Asset Description":"Invesco Bloomberg Commodity UCITS ETF","Broker":"DeGiro","GL Account":10030,"GL Account Waardeverandering":800030,"Waarderingsmethode":"Fair Value PL","Waarde bijgewerkt":"2024-12-27","Aantal stukken":23,"Meest recente prijs":47.28,"Meest recente waarde":1087.44,"Couponrente":null,"Effectieve rente":null}],
  "General Ledger": [{"Journaalpostnummer":2200000001,"GL Account":500000,"Asset Number":null,"Description":"Aankoop eerste aandelen","Line Description":"Crediteren Cash","Amount":-10000,"Quantity":null,"Entry Date":"2022-02-11","Effective Date":"2022-01-01","Source":"TA","Period":"2022-01"}, {"Journaalpostnummer":2200000001,"GL Account":10010,"Asset Number":"A0001","Description":"Aankoop eerste aandelen","Line Description":"Debiteren Activa","Amount":10000,"Quantity":138.443,"Entry Date":"2022-02-11","Effective Date":"2022-01-01","Source":"TA","Period":"2022-01"}, {"Journaalpostnummer":2200000002,"GL Account":10050,"Asset Number":"D0001","Description":"Aankoop eerste social impact fund","Line Description":"Activering aankoop","Amount":2000,"Quantity":55.737,"Entry Date":"2022-02-11","Effective Date":"2022-01-01","Source":"TA","Period":"2022-01"}, {"Journaalpostnummer":2200000231,"GL Account":701050,"Asset Number":null,"Description":"Kosten van beleggen","Line Description":"Beheerskosten","Amount":5,"Quantity":null,"Entry Date":"2024-12-30","Effective Date":"2024-02-05","Source":"TK","Period":"2024-02"}, {"Journaalpostnummer":2200000230,"GL Account":800010,"Asset Number":null,"Description":"Fair value adjustment December","Line Description":"Ongerealiseerde waardeverandering","Amount":-21.24,"Quantity":null,"Entry Date":"2024-12-30","Effective Date":"2024-12-27","Source":"GW","Period":"2024-12"}],
  "Chart of accounts - General Ledger Account Master table": [{"GL Account Code":10010,"GL Account Name":"Beleggingen in aandelen","Account Type":"Assets","Account Class":"Beleggingen"}, {"GL Account Code":500000,"GL Account Name":"Ingelegd geld Bart","Account Type":"Equity","Account Class":"Ingebracht kapitaal"}, {"GL Account Code":10050,"GL Account Name":"Beleggingen in Long term obligaties","Account Type":"Assets","Account Class":"Beleggingen"}, {"GL Account Code":701050,"GL Account Name":"Beheerkosten Triodos","Account Type":"Expenses","Account Class":"Transactiekosten"}, {"GL Account Code":800010,"GL Account Name":"Resultaat waardeverandering op aandelen","Account Type":"Revenue","Account Class":"Opbrengst uit aandelen"}]
};

// --- DATA PROCESSING HOOK ---
const usePortfolioData = (data) => {
    const holdingsSummary = useMemo(() => {
        if (!data) return [];
        const assetMaster = data['Asset master table'] || [];
        const subadmin = data['Subadministration'] || [];
        const subadminLookup = subadmin.reduce((acc, item) => {
            acc[item['Asset Number']] = item;
            return acc;
        }, {});

        return assetMaster.map(asset => {
            const details = subadminLookup[asset['Asset Number']];
            if (!details) return null;
            const quantity = parseFloat(details['Aantal stukken'] || 0);
            const price = parseFloat(details['Meest recente prijs'] || 0);
            return {
                name: asset['Asset Description'] || 'N/A',
                ticker: asset['Ticker'] || 'N/A',
                broker: asset['Broker'] || 'N/A',
                asset_type: asset['Asset Type'] || 'N/A',
                asset_group: asset['Asset Group'] || 'N/A',
                quantity,
                price,
                current_value: quantity * price,
            };
        }).filter(Boolean);
    }, [data]);

    const generalLedger = useMemo(() => {
        if (!data) return [];
        const glEntries = data['General Ledger'] || [];
        const coa = (data['Chart of accounts - General Ledger Account Master table'] || []).reduce((acc, item) => {
            acc[item['GL Account Code']] = item;
            return acc;
        }, {});
        return glEntries.map(entry => ({
            ...entry,
            'GL Account Name': coa[entry['GL Account']]?.['GL Account Name'] || 'N/A',
            'Account Type': coa[entry['GL Account']]?.['Account Type'] || 'N/A',
            'Account Class': coa[entry['GL Account']]?.['Account Class'] || 'N/A',
        }));
    }, [data]);
    
    const chartOfAccounts = useMemo(() => data ? data['Chart of accounts - General Ledger Account Master table'] : [], [data]);
    const assetMaster = useMemo(() => data ? data['Asset master table'] : [], [data]);
    const assetGroupMaster = useMemo(() => data ? data['Asset Group master table'] : [], [data]);

    const uniqueValues = (key, subKey) => {
        if (!data || !data[key]) return [];
        return [...new Set(data[key].map(item => item[subKey]).filter(Boolean))].sort();
    };
    
    const uniqueGLValues = (subKey) => {
        if (!generalLedger) return [];
        return [...new Set(generalLedger.map(item => item[subKey]).filter(Boolean))].sort();
    };

    return { holdingsSummary, generalLedger, uniqueValues, uniqueGLValues, chartOfAccounts, assetMaster, assetGroupMaster };
};


// --- UI COMPONENTS ---

const SearchableDropdown = ({ options, value, onChange, placeholder, disabled=false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <button type="button" onClick={() => !disabled && setIsOpen(!isOpen)} disabled={disabled} className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-left flex justify-between items-center disabled:bg-gray-200 disabled:text-gray-500">
                <span className="truncate">{selectedLabel}</span>
                <ChevronDown />
            </button>
            {isOpen && (
                <div className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                            autoFocus
                        />
                    </div>
                    <ul className="max-h-60 overflow-y-auto">
                        {filteredOptions.map(option => (
                            <li key={option.value} onClick={() => { onChange(option.value); setIsOpen(false); setSearchTerm(''); }} className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const Sidebar = ({ setPage, onFileLoad, onFileSave, isCollapsed, setIsCollapsed, goBack, canGoBack }) => {
    const fileInputRef = useRef(null);
    const handleLoadClick = () => fileInputRef.current.click();

    return (
        <div className={`bg-gray-50 border-r border-gray-200 flex flex-col h-full transition-all duration-300 relative ${isCollapsed ? 'w-20' : 'w-60'}`}>
            {canGoBack && (
                <button
                    onClick={goBack}
                    className="absolute top-4 -right-4 z-20 p-1 bg-white rounded-full shadow-md border-2 border-gray-200 hover:bg-gray-100 scale-150 transform transition hover:scale-125"
                >
                    <ArrowLeft />
                </button>
            )}

            {!isCollapsed && (
                <button
                    onClick={() => setIsCollapsed(true)}
                    className="absolute top-36 -right-4 z-10 p-1 bg-white rounded-full shadow-md border-2 border-gray-200 hover:bg-gray-100 scale-150 transform transition hover:scale-125"
                >
                    <ChevronLeft />
                </button>
            )}

            <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                    <Briefcase />
                </div>
                {!isCollapsed && <h1 className="text-xl font-bold text-gray-800">P M S</h1>}
            </div>

            <div className={`p-4 border-b border-gray-200 ${isCollapsed ? 'flex justify-center flex-col space-y-2' : 'space-y-2'}`}>
                <input type="file" ref={fileInputRef} onChange={onFileLoad} className="hidden" accept=".json" />
                <button onClick={handleLoadClick} className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors ${isCollapsed ? 'w-auto' : 'w-full'}`}>
                    <UploadCloud width={16} height={16} />
                    {!isCollapsed && <span>Load portfolio.json</span>}
                </button>
                <button onClick={onFileSave} className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors ${isCollapsed ? 'w-auto' : 'w-full'}`}>
                    <Download width={16} height={16} />
                    {!isCollapsed && <span>Save portfolio.json</span>}
                </button>
            </div>

            <nav className="flex-grow p-4 space-y-2">
                <button onClick={() => setPage('Home')} className={`w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ${isCollapsed ? 'flex justify-center' : ''}`}>
                    {isCollapsed ? <HomeIcon /> : 'Home'}
                </button>
                <button onClick={() => setPage('AnalyzePortfolio')} className={`w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ${isCollapsed ? 'flex justify-center' : ''}`}>
                    {isCollapsed ? <PieChartIcon/> : 'Analyze Portfolio'}
                </button>
                <button onClick={() => setPage('AnalyzePerformance')} className={`w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ${isCollapsed ? 'flex justify-center' : ''}`}>
                     {isCollapsed ? <LineChartIcon/> : 'Analyze Performance'}
                </button>
                <button onClick={() => setPage('GeneralLedger')} className={`w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ${isCollapsed ? 'flex justify-center' : ''}`}>
                    {isCollapsed ? <Briefcase/> : 'View General Ledger'}
                </button>
                <button onClick={() => setPage('ManualJournalEntry')} className={`w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ${isCollapsed ? 'flex justify-center' : ''}`}>
                     {isCollapsed ? <PlusCircle/> : 'Manual Journal Entry'}
                </button>
                <button onClick={() => setPage('DeleteJournalEntries')} className={`w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ${isCollapsed ? 'flex justify-center' : ''}`}>
                     {isCollapsed ? <XCircle/> : 'Delete Journal Entries'}
                </button>
            </nav>

            {isCollapsed && (
                <div className="mt-auto p-4 flex justify-center">
                    <button onClick={() => setIsCollapsed(false)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-md">
                        <MenuIcon />
                    </button>
                </div>
            )}
        </div>
    );
};

const HomePage = ({ setPage }) => {
    const Card = ({ title, children }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
            <div className="space-y-3 flex-grow flex flex-col">{children}</div>
        </div>
    );
    const ActionButton = ({ children, onClick, disabled }) => (
        <button onClick={onClick} disabled={disabled} className="w-full text-left px-4 py-2 bg-gray-50 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
            {children}
        </button>
    );

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Welcome to your Portfolio Management System</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-6">
                    <Card title="Portfolio Analysis">
                        <ActionButton onClick={() => setPage('AnalyzePortfolio')}>Analyze Portfolio</ActionButton>
                        <ActionButton onClick={() => setPage('AnalyzePerformance')}>Analyze Performance</ActionButton>
                    </Card>
                    <Card title="Journal Entry Management">
                        <ActionButton onClick={() => setPage('GeneralLedger')}>View General Ledger</ActionButton>
                        <ActionButton onClick={() => setPage('ManualJournalEntry')}>Manual Journal Entry</ActionButton>
                        <ActionButton onClick={() => setPage('DeleteJournalEntries')}>Delete Journal Entries</ActionButton>
                    </Card>
                </div>
                <Card title="Change in Quantity">
                    <ActionButton onClick={() => setPage('PurchaseAssets')}>Purchase assets</ActionButton>
					{["Buy assets", "Triodos Sell for Expenses", "Triodos Dividend Re-investing", "Triodos Aansluitkosten", "Giro iDeal"].map(text => <ActionButton key={text} disabled>{text}</ActionButton>)}

                </Card>
                <Card title="Update Portfolio Value">
                    {["Triodos Value", "Triodos Expenses", "Giro Value", "Giro Dividend", "Giro Interest", "Giro Interest Vrije Ruimte"].map(text => <ActionButton key={text} disabled>{text}</ActionButton>)}
                </Card>
            </div>
        </div>
    );
};

// --- HELPER for CHART COLORS ---
const generatePastelColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        const hue = (i * (360 / numColors) + 200) % 360;
        colors.push(`hsl(${hue}, 70%, 75%)`);
    }
    return colors;
};

// --- HELPER for DATE FORMATTING ---
const formatDateEuropean = (dateStr) => {
    if (!dateStr) return '';
    try {
        const date = new Date(dateStr);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    } catch (error) {
        return dateStr; // Return original string if format fails
    }
};


const AnalyzePortfolioPage = ({ holdingsSummary, uniqueValues }) => {
    const [filters, setFilters] = useState({ broker: 'All', asset_type: 'All', asset_group: 'All' });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'current_value', direction: 'desc' });
    const [groupBy, setGroupBy] = useState('None');
    const [expandedGroups, setExpandedGroups] = useState({});
    const [view, setView] = useState('both');
    const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);

    const filteredData = useMemo(() => {
        return holdingsSummary.filter(h => 
            (filters.broker === 'All' || h.broker === filters.broker) &&
            (filters.asset_type === 'All' || h.asset_type === filters.asset_type) &&
            (filters.asset_group === 'All' || h.asset_group === filters.asset_group) &&
            (h.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [holdingsSummary, filters, searchTerm]);
    
    const totalPortfolioValue = useMemo(() => {
        return holdingsSummary.reduce((sum, item) => sum + item.current_value, 0);
    }, [holdingsSummary]);

    const sortedAndGroupedData = useMemo(() => {
        let data = [...filteredData];
        
        data.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        if (groupBy === 'None') {
            return data.filter(item => item.current_value > 0);
        }

        const grouped = data.reduce((acc, item) => {
            const key = item[groupBy] || 'N/A';
            if (!acc[key]) {
                acc[key] = { items: [], total_value: 0 };
            }
            acc[key].items.push(item);
            acc[key].total_value += item.current_value;
            return acc;
        }, {});

        return Object.entries(grouped)
            .map(([key, value]) => ({
                isGroup: true,
                name: key,
                items: value.items,
                current_value: value.total_value,
            }))
            .filter(group => group.current_value > 0)
            .sort((a, b) => b.current_value - a.current_value);

    }, [filteredData, sortConfig, groupBy]);
    
    const kpis = useMemo(() => {
        const topAsset = holdingsSummary.reduce((max, item) => item.current_value > max.current_value ? item : max, { name: 'N/A', current_value: 0 });
        return {
            totalValue: totalPortfolioValue,
            uniqueAssets: holdingsSummary.filter(h => h.current_value > 0).length,
            topAsset: topAsset.name,
            topAssetPercentage: totalPortfolioValue > 0 ? (topAsset.current_value / totalPortfolioValue) * 100 : 0,
        };
    }, [holdingsSummary, totalPortfolioValue]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    
    const toggleGroup = (groupName) => {
        setExpandedGroups(prev => ({...prev, [groupName]: !prev[groupName]}));
    };

    const pieChartData = useMemo(() => {
        if (groupBy === 'None') {
            return sortedAndGroupedData.map(item => ({ name: item.name, value: item.current_value }));
        }
        return sortedAndGroupedData.map(group => ({ name: group.name, value: group.current_value }));
    }, [sortedAndGroupedData, groupBy]);

    const COLORS = useMemo(() => generatePastelColors(pieChartData.length), [pieChartData.length]);
    
    const KpiCard = ({ title, children }) => (
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex-1">
            <h3 className="text-sm text-gray-500">{title}</h3>
            {children}
        </div>
    );

    const ControlCard = ({ title, children }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-semibold text-gray-700 mb-3">{title}</h3>
            <div className="space-y-3">{children}</div>
        </div>
    );
    
    const renderTable = () => (
        <div className="flex-grow overflow-auto border rounded-lg bg-white">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                    <tr>
                        {[{key: 'name', label: 'Description'}, {key: 'current_value', label: 'Value'}, {key: 'percentage', label: '% of Total'}, {key: 'broker', label: 'Broker'}, {key: 'quantity', label: 'Quantity'}, {key: 'price', label: 'Price'}].map(h => 
                            <th key={h.key} scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort(h.key)}>
                                <div className="flex items-center space-x-1">
                                    <span>{h.label}</span>
                                    {h.key !== 'percentage' && <ArrowUpDown />}
                                </div>
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {sortedAndGroupedData.map((item) => {
                        const percentage = totalPortfolioValue > 0 ? (item.current_value / totalPortfolioValue) * 100 : 0;
                        if (item.isGroup) {
                            const isExpanded = expandedGroups[item.name];
                            return (
                                <React.Fragment key={item.name}>
                                    <tr className="bg-gray-50 border-b font-semibold">
                                        <td className="px-6 py-3">
                                            <button onClick={() => toggleGroup(item.name)} className="flex items-center space-x-2">
                                                {isExpanded ? <ChevronDown /> : <ChevronRight />}
                                                <span>{item.name}</span>
                                            </button>
                                        </td>
                                        <td className="px-6 py-3 text-right">€{item.current_value.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}</td>
                                        <td className="px-6 py-3 text-right">{percentage.toFixed(1)}%</td>
                                        <td colSpan="3"></td>
                                    </tr>
                                    {isExpanded && item.items.filter(sub => sub.current_value > 0).map((subItem, subIndex) => {
                                        const subPercentage = totalPortfolioValue > 0 ? (subItem.current_value / totalPortfolioValue) * 100 : 0;
                                        return (
                                            <tr key={`${item.name}-${subIndex}`} className="bg-white border-b hover:bg-gray-50">
                                                <td className="pl-12 pr-6 py-3 font-medium text-gray-900 whitespace-nowrap">{subItem.name}</td>
                                                <td className="px-6 py-3 text-right font-semibold">€{subItem.current_value.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}</td>
                                                <td className="px-6 py-3 text-right">{subPercentage.toFixed(1)}%</td>
                                                <td className="px-6 py-3">{subItem.broker}</td>
                                                <td className="px-6 py-3 text-right">{subItem.quantity.toFixed(4)}</td>
                                                <td className="px-6 py-3 text-right">€{subItem.price.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}</td>
                                            </tr>
                                        );
                                    })}
                                </React.Fragment>
                            );
                        }
                        return (
                            <tr key={item.name} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.name}</td>
                                <td className="px-6 py-4 text-right font-semibold">€{item.current_value.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}</td>
                                <td className="px-6 py-4 text-right">{percentage.toFixed(1)}%</td>
                                <td className="px-6 py-4">{item.broker}</td>
                                <td className="px-6 py-4 text-right">{item.quantity.toFixed(4)}</td>
                                <td className="px-6 py-4 text-right">€{item.price.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
    
    const CustomPieLabel = ({ name, percent }) => {
        if (percent < 0.05) return null; // Don't render label for small slices
        return `${name} (${(percent * 100).toFixed(0)}%)`;
    };

    const renderChart = () => (
        <div className="w-full h-full flex items-center justify-center bg-white border rounded-lg">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie 
                        data={pieChartData} 
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius="70%" 
                        labelLine={false}
                        label={<CustomPieLabel />}
                    >
                        {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`€${value.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}`, name]} />
                    <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );

    return (
        <div className="p-6 h-full flex flex-col bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <KpiCard title="Total Portfolio Value"><p className="text-2xl font-bold text-gray-800">€{kpis.totalValue.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}</p></KpiCard>
                <KpiCard title="Unique Assets"><p className="text-2xl font-bold text-gray-800">{kpis.uniqueAssets}</p></KpiCard>
                <KpiCard title="Top Asset"><p className="text-2xl font-bold text-gray-800">{`${kpis.topAssetPercentage.toFixed(1)}%`}</p><p className="text-xs text-gray-400 truncate">{kpis.topAsset}</p></KpiCard>
                <KpiCard title="View Selections">
                    <div className="text-xs space-y-1">
                        <p><span className="font-semibold">Grouping:</span> {groupBy.replace(/_/g, ' ')}</p>
                        <p><span className="font-semibold">Filters:</span> {Object.entries(filters).filter(([,v]) => v !== 'All').map(([k,v]) => `${k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${v}`).join(', ') || 'None'}</p>
                    </div>
                </KpiCard>
            </div>
            <div className="flex-grow flex gap-4 overflow-hidden">
                <div className="flex-grow flex flex-col">
                    <div className="flex-grow grid grid-rows-1">
                        {view === 'table' && <div className="h-full">{renderTable()}</div>}
                        {view === 'chart' && <div className="h-full">{renderChart()}</div>}
                        {view === 'both' && (
                            <div className="h-full grid grid-rows-2 gap-4">
                                <div className="row-span-1 overflow-hidden">{renderTable()}</div>
                                <div className="row-span-1 overflow-hidden">{renderChart()}</div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={`relative transition-all duration-300 flex-shrink-0 ${isControlPanelOpen ? 'w-72' : 'w-10'}`}>
                    <div className={`h-full ${isControlPanelOpen ? 'opacity-100' : 'opacity-0 invisible'}`}>
                        <ControlCard title="View & Filter Options">
                             <input type="text" placeholder="Search assets..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm"/>
                            <div className="flex justify-around bg-gray-100 p-1 rounded-md">
                               {['Table', 'Chart', 'Both'].map(v => (
                                   <button key={v} onClick={() => setView(v.toLowerCase())} className={`px-3 py-1 text-sm rounded-md w-full ${view === v.toLowerCase() ? 'bg-white shadow' : 'hover:bg-gray-200'}`}>{v}</button>
                               ))}
                            </div>
                            <hr/>
                            <p className="text-sm font-semibold text-gray-600">Group By</p>
                            <select value={groupBy} onChange={e => setGroupBy(e.target.value)} className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                                <option value="None">None</option>
                                <option value="asset_type">Asset Type</option>
                                <option value="asset_group">Asset Group</option>
                                <option value="broker">Broker</option>
                            </select>
                            <hr/>
                            <p className="text-sm font-semibold text-gray-600">Filters</p>
                            <select value={filters.broker} onChange={e => setFilters({...filters, broker: e.target.value})} className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                                <option value="All">All Brokers</option>
                                {uniqueValues('Asset master table', 'Broker').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                             <select value={filters.asset_type} onChange={e => setFilters({...filters, asset_type: e.target.value})} className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                                <option value="All">All Asset Types</option>
                                {uniqueValues('Asset master table', 'Asset Type').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                             <select value={filters.asset_group} onChange={e => setFilters({...filters, asset_group: e.target.value})} className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                                <option value="All">All Asset Groups</option>
                                {uniqueValues('Asset master table', 'Asset Group').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </ControlCard>
                    </div>
                    <button onClick={() => setIsControlPanelOpen(!isControlPanelOpen)} className="absolute top-0 -left-4 bg-white border rounded-full p-2 shadow hover:bg-gray-100">
                        {isControlPanelOpen ? <PanelRightClose /> : <PanelRightOpen />}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- REUSABLE COMPONENTS ---
const MultiSelectDropdown = ({ label, options, selectedOptions, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleToggleAll = (e) => {
        e.stopPropagation();
        if (selectedOptions.length === options.length) {
            onChange([]);
        } else {
            onChange(options.map(opt => opt));
        }
    };

    const handleOptionClick = (e, option) => {
        e.stopPropagation();
        const newSelected = selectedOptions.includes(option)
            ? selectedOptions.filter(item => item !== option)
            : [...selectedOptions, option];
        onChange(newSelected);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getButtonLabel = () => {
        if (selectedOptions.length === 0) return `Select ${label}...`;
        if (selectedOptions.length === 1) return selectedOptions[0];
        if (selectedOptions.length === options.length) return `All ${label}s`;
        return `${selectedOptions.length} ${label}s Selected`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm text-left flex justify-between items-center">
                <span>{getButtonLabel()}</span>
                <ChevronDown />
            </button>
            {isOpen && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2 border-b">
                         <button onClick={handleToggleAll} className="w-full text-left px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                            {selectedOptions.length === options.length ? 'Deselect All' : 'Select All'}
                         </button>
                    </div>
                    <div className="p-1">
                        {options.map(option => (
                            <div key={option} onClick={(e) => handleOptionClick(e, option)} className="flex items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer">
                                <input type="checkbox" readOnly checked={selectedOptions.includes(option)} className="mr-2" />
                                <span className="text-sm">{option}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const ToggleSwitch = ({ label, isEnabled, onToggle }) => (
    <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">{label}</span>
        <button onClick={() => onToggle(!isEnabled)} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${isEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);


// --- UPDATED AnalyzePerformancePage ---
const AnalyzePerformancePage = ({ generalLedger, holdingsSummary, uniqueGLValues }) => {
    // --- STATE MANAGEMENT ---
    const allYears = useMemo(() => [...new Set(generalLedger.filter(e => e.Period).map(e => e.Period.substring(0, 4)))].sort((a,b) => b-a), [generalLedger]);
    const [selectedYears, setSelectedYears] = useState(allYears);
    const [filters, setFilters] = useState({ accountType: 'All', accountClass: 'All', glAccountName: 'All' });
    const [view, setView] = useState('both');
    const [analysisLevel, setAnalysisLevel] = useState('monthly');
    const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);
    const [expandedRows, setExpandedRows] = useState({});
    const [chartType, setChartType] = useState('stacked'); // 'stacked' or 'individual'
    const [chartView, setChartView] = useState('datapoint'); // 'datapoint' or 'cumulative'

    // --- DATA FILTERING & DERIVATION ---
    const filteredLedger = useMemo(() => {
        return generalLedger.filter(entry =>
            (selectedYears.length === 0 || (entry.Period && selectedYears.includes(entry.Period.substring(0, 4)))) &&
            (filters.accountType === 'All' || entry['Account Type'] === filters.accountType) &&
            (filters.accountClass === 'All' || entry['Account Class'] === filters.accountClass) &&
            (filters.glAccountName === 'All' || entry['GL Account Name'] === filters.glAccountName) &&
            (['Revenue', 'Expenses'].includes(entry['Account Type']))
        );
    }, [generalLedger, selectedYears, filters]);

    const totalPortfolioValue = useMemo(() => holdingsSummary.reduce((sum, item) => sum + item.current_value, 0), [holdingsSummary]);

    const kpis = useMemo(() => {
        const mostRecentYear = selectedYears.length > 0 ? String(Math.max(...selectedYears.map(Number))) : null;
        const perfEntries = generalLedger.filter(e => ['Revenue', 'Expenses'].includes(e['Account Type']) && e.Period && selectedYears.includes(e.Period.substring(0,4)));
        const periodDevelopment = -perfEntries.reduce((sum, e) => sum + e.Amount, 0);
        const beginningValue = totalPortfolioValue - periodDevelopment;
        const performancePerc = beginningValue !== 0 ? (periodDevelopment / beginningValue) * 100 : 0;
        const allTimePerfEntries = generalLedger.filter(e => ['Revenue', 'Expenses'].includes(e['Account Type']));
        const allTimeDevelopment = -allTimePerfEntries.reduce((sum, e) => sum + e.Amount, 0);
        const allTimeBeginningValue = totalPortfolioValue - allTimeDevelopment;
        const allTimePerformancePerc = allTimeBeginningValue !== 0 ? (allTimeDevelopment / allTimeBeginningValue) * 100 : 0;
        const expenseEntries = generalLedger.filter(e => e['Account Type'] === 'Expenses' && e.Period && mostRecentYear === e.Period.substring(0,4));
        const periodExpenses = expenseEntries.reduce((sum, e) => sum + e.Amount, 0);
        const expensePerc = totalPortfolioValue !== 0 ? (periodExpenses / totalPortfolioValue) * 100 : 0;

        return { currentValue: totalPortfolioValue, performance: performancePerc, allTimePerformance: allTimePerformancePerc, ytdExpensesPerc: expensePerc, ytdExpensesValue: periodExpenses };
    }, [generalLedger, selectedYears, totalPortfolioValue]);

    const { tableData, timeKeys } = useMemo(() => {
        const hierarchy = {};
        const timeKeysSet = new Set();
        
        filteredLedger.forEach(entry => {
            const timeKey = analysisLevel === 'monthly' ? entry.Period : entry.Period.substring(0, 4);
            if (!timeKey) return;
            timeKeysSet.add(timeKey);

            const { 'Account Type': type, 'Account Class': accClass, 'GL Account Name': accName, Amount: amount } = entry;

            if (!hierarchy[type]) hierarchy[type] = { totals: {}, children: {} };
            if (!hierarchy[type].children[accClass]) hierarchy[type].children[accClass] = { totals: {}, children: {} };
            if (!hierarchy[type].children[accClass].children[accName]) hierarchy[type].children[accClass].children[accName] = { totals: {} };

            hierarchy[type].totals[timeKey] = (hierarchy[type].totals[timeKey] || 0) + amount;
            hierarchy[type].children[accClass].totals[timeKey] = (hierarchy[type].children[accClass].totals[timeKey] || 0) + amount;
            hierarchy[type].children[accClass].children[accName].totals[timeKey] = (hierarchy[type].children[accClass].children[accName].totals[timeKey] || 0) + amount;
        });

        const sortedTimeKeys = Array.from(timeKeysSet).sort();
        return { tableData: hierarchy, timeKeys: sortedTimeKeys };
    }, [filteredLedger, analysisLevel]);

    const chartData = useMemo(() => {
        const dataMap = new Map();
        const accountClasses = new Set();
        
        filteredLedger.forEach(entry => {
            const accountClass = entry['Account Class'];
            accountClasses.add(accountClass);
        });

        timeKeys.forEach(key => {
            const initialData = { name: key };
            accountClasses.forEach(ac => initialData[ac] = 0);
            dataMap.set(key, initialData);
        });

        filteredLedger.forEach(entry => {
            const key = analysisLevel === 'monthly' ? entry.Period : entry.Period.substring(0, 4);
            if (!key) return;
            const periodData = dataMap.get(key);
            if(periodData) {
                periodData[entry['Account Class']] = (periodData[entry['Account Class']] || 0) + (-entry.Amount);
            }
        });
        
        const dataPoints = Array.from(dataMap.values());
        const keys = Array.from(accountClasses).sort();

        if (chartView === 'cumulative') {
            const cumulativeData = [];
            let runningTotals = {};
            keys.forEach(k => runningTotals[k] = 0);

            dataPoints.forEach(point => {
                const cumulativePoint = { name: point.name };
                keys.forEach(k => {
                    runningTotals[k] += point[k] || 0;
                    cumulativePoint[k] = runningTotals[k];
                });
                cumulativeData.push(cumulativePoint);
            });
            return { data: cumulativeData, keys };
        }
        
        return { data: dataPoints, keys };
    }, [filteredLedger, analysisLevel, timeKeys, chartView]);

    const COLORS = useMemo(() => generatePastelColors(chartData.keys.length), [chartData.keys]);

    useEffect(() => {
        const initialExpanded = {};
        Object.keys(tableData).forEach(key => initialExpanded[key] = true);
        setExpandedRows(initialExpanded);
    }, [tableData]);

    // --- RENDER FUNCTIONS ---
    const KpiCard = ({ title, children, isSingleLine = false }) => (
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col">
            <h3 className="text-sm text-gray-500">{title}</h3>
            <div className={`flex-grow flex items-center ${isSingleLine ? 'justify-start' : 'flex-col justify-center'}`}>{children}</div>
        </div>
    );
    
    const ControlCard = ({ title, children }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-md font-semibold text-gray-700 mb-3">{title}</h3>
            <div className="space-y-4">{children}</div>
        </div>
    );

    const renderChart = () => {
        const ChartComponent = chartType === 'stacked' ? AreaChart : LineChart;
        const DataComponent = chartType === 'stacked' ? Area : Line;

        return (
            <div className="h-full bg-white p-4 border rounded-lg">
                <ResponsiveContainer width="100%" height="100%">
                    <ChartComponent data={chartData.data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `€${value.toLocaleString('nl-NL')}`} />
                        <Tooltip formatter={(value) => `€${value.toLocaleString('nl-NL', {maximumFractionDigits: 0})}`} />
                        <Legend />
                        {chartData.keys.map((key, index) => (
                            <DataComponent
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stackId={chartType === 'stacked' ? "1" : undefined}
                                stroke={COLORS[index % COLORS.length]}
                                fill={chartType === 'stacked' ? COLORS[index % COLORS.length] : 'none'}
                            />
                        ))}
                    </ChartComponent>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderTable = () => {
        const toggleExpand = (key) => setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));

        const renderRow = (label, data, level, id) => {
            const isExpanded = expandedRows[id];
            const hasChildren = Object.keys(data.children || {}).length > 0;
            const paddingLeft = `${level * 1.5}rem`;
            const fontWeight = level < 2 ? 'font-semibold' : 'font-normal';
            const bgColor = level === 0 ? 'bg-gray-100' : level === 1 ? 'bg-gray-50' : 'bg-white';

            return (
                <React.Fragment key={id}>
                    <tr className={`${bgColor} border-b`}>
                        <td className={`px-4 py-2 ${fontWeight} text-gray-800 sticky left-0 z-10 ${bgColor}`} style={{ paddingLeft, minWidth: '250px' }}>
                            {hasChildren ? (
                                <button onClick={() => toggleExpand(id)} className="flex items-center space-x-2 text-left">
                                    {isExpanded ? <ChevronDown /> : <ChevronRight />}
                                    <span>{label}</span>
                                </button>
                            ) : <span>{label}</span>}
                        </td>
                        {timeKeys.map(key => (
                            <td key={key} className={`px-4 py-2 text-right ${fontWeight} text-gray-700`}>
                                €{(data.totals[key] || 0).toLocaleString('nl-NL', {maximumFractionDigits: 2, minimumFractionDigits: 2})}
                            </td>
                        ))}
                    </tr>
                    {hasChildren && isExpanded && Object.entries(data.children).map(([childLabel, childData]) => 
                        renderRow(childLabel, childData, level + 1, `${id}-${childLabel}`)
                    )}
                </React.Fragment>
            );
        };
        
        const yearHeaders = timeKeys.reduce((acc, key) => {
            const year = key.substring(0, 4);
            if (!acc[year]) acc[year] = 0;
            acc[year]++;
            return acc;
        }, {});

        const accountTypesOrder = ['Revenue', 'Expenses'];

        return (
            <div className="flex-grow overflow-auto border rounded-lg bg-white">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200 sticky top-0 z-20">
                        {analysisLevel === 'monthly' && (
                            <tr>
                                <th rowSpan="2" className="px-4 py-3 align-bottom sticky left-0 bg-gray-200 z-30">Description</th>
                                {Object.entries(yearHeaders).map(([year, colSpan]) => (
                                    <th key={year} colSpan={colSpan} className="px-4 py-2 text-center border-b border-l">{year}</th>
                                ))}
                            </tr>
                        )}
                        <tr>
                            {analysisLevel === 'yearly' && <th className="px-4 py-3 sticky left-0 bg-gray-200 z-30">Description</th>}
                            {timeKeys.map(key => (
                                <th key={key} className="px-4 py-2 text-right font-medium border-l">
                                    {analysisLevel === 'monthly' ? new Date(key + '-02').toLocaleString('default', { month: 'short' }) : key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(tableData)
                            .sort((a,b) => accountTypesOrder.indexOf(a[0]) - accountTypesOrder.indexOf(b[0]))
                            .map(([label, data]) => renderRow(label, data, 0, label))
                        }
                    </tbody>
                </table>
            </div>
        );
    };
    
    const formatYearSelection = () => {
        if (selectedYears.length === 0) return 'None';
        if (selectedYears.length === allYears.length) return 'All Years';
        if (selectedYears.length > 2) {
             const sorted = selectedYears.map(Number).sort((a,b) => a-b);
             return `${sorted[0]} - ${sorted[sorted.length - 1]}`;
        }
        return selectedYears.join(', ');
    }

    return (
        <div className="p-6 h-full flex flex-col bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <KpiCard title="Current Portfolio Value" isSingleLine={true}>
                    <p className="text-2xl font-bold text-gray-800">€{kpis.currentValue.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}</p>
                </KpiCard>
                <KpiCard title="Performance (Selected Years)">
                    <p className="text-2xl font-bold text-gray-800">{kpis.performance.toFixed(2)}%</p>
                    <p className="text-xs text-gray-400 mt-auto pt-1">All-time: {kpis.allTimePerformance.toFixed(2)}%</p>
                </KpiCard>
                <KpiCard title={`Expenses (${selectedYears.length > 0 ? Math.max(...selectedYears.map(Number)) : 'YTD'})`}>
                    <p className="text-2xl font-bold text-gray-800">{kpis.ytdExpensesPerc.toFixed(2)}%</p>
                    <p className="text-xs text-gray-400 mt-auto pt-1">€{kpis.ytdExpensesValue.toLocaleString('nl-NL', { maximumFractionDigits: 2 })}</p>
                </KpiCard>
                <KpiCard title="View Selections">
                    <div className="text-xs space-y-1 overflow-hidden h-full flex flex-col justify-around">
                        <p className="truncate"><span className="font-semibold">Years:</span> {formatYearSelection()}</p>
                        <p className="truncate"><span className="font-semibold">Type:</span> {filters.accountType}</p>
                        <p className="truncate"><span className="font-semibold">Class:</span> {filters.accountClass}</p>
                        <p className="truncate"><span className="font-semibold">Desc:</span> {filters.glAccountName}</p>
                    </div>
                </KpiCard>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 my-4 text-center">
                How did the portfolio perform over time?
            </h2>

            <div className="flex-grow flex gap-4 overflow-hidden">
                <div className="flex-grow flex flex-col gap-4">
                       {view === 'table' && renderTable()}
                       {view === 'chart' && renderChart()}
                       {view === 'both' && (
                           <div className="h-full grid grid-rows-2 gap-4">
                               <div className="row-span-1 overflow-hidden">{renderTable()}</div>
                               <div className="row-span-1 overflow-hidden">{renderChart()}</div>
                           </div>
                       )}
                </div>
                
                <div className={`relative transition-all duration-300 flex-shrink-0 ${isControlPanelOpen ? 'w-72' : 'w-10'}`}>
                    <div className={`h-full ${isControlPanelOpen ? 'opacity-100' : 'opacity-0 invisible'}`}>
                        <ControlCard title="View & Filter Options">
                             <div className="flex justify-around bg-gray-100 p-1 rounded-md">
                               {['Table', 'Chart', 'Both'].map(v => (
                                   <button key={v} onClick={() => setView(v.toLowerCase())} className={`px-3 py-1 text-sm rounded-md w-full ${view === v.toLowerCase() ? 'bg-white shadow' : 'hover:bg-gray-200'}`}>{v}</button>
                               ))}
                            </div>
                             <div className="flex justify-around bg-gray-100 p-1 rounded-md">
                               {['Monthly', 'Yearly'].map(v => (
                                   <button key={v} onClick={() => setAnalysisLevel(v.toLowerCase())} className={`px-3 py-1 text-sm rounded-md w-full ${analysisLevel === v.toLowerCase() ? 'bg-white shadow' : 'hover:bg-gray-200'}`}>{v}</button>
                               ))}
                            </div>
                            <hr/>
                            <ToggleSwitch label="Stacked Chart" isEnabled={chartType === 'stacked'} onToggle={(val) => setChartType(val ? 'stacked' : 'individual')} />
                            <ToggleSwitch label="Cumulative View" isEnabled={chartView === 'cumulative'} onToggle={(val) => setChartView(val ? 'cumulative' : 'datapoint')} />
                            <hr/>
                            <MultiSelectDropdown label="Year" options={allYears} selectedOptions={selectedYears} onChange={setSelectedYears} />
                            <select value={filters.accountType} onChange={e => setFilters({...filters, accountType: e.target.value})} className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                                <option value="All">All Account Types</option>
                                {uniqueGLValues('Account Type').filter(t => ['Revenue', 'Expenses'].includes(t)).map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <select value={filters.accountClass} onChange={e => setFilters({...filters, accountClass: e.target.value})} className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                                <option value="All">All Account Classes</option>
                                {uniqueGLValues('Account Class').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <select value={filters.glAccountName} onChange={e => setFilters({...filters, glAccountName: e.target.value})} className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm">
                                <option value="All">All Account Descriptions</option>
                                {uniqueGLValues('GL Account Name').map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                        </ControlCard>
                    </div>
                    <button onClick={() => setIsControlPanelOpen(!isControlPanelOpen)} className="absolute top-0 -left-4 bg-white border rounded-full p-2 shadow hover:bg-gray-100">
                        {isControlPanelOpen ? <PanelRightClose /> : <PanelRightOpen />}
                    </button>
                </div>
            </div>
        </div>
    );
};


const GeneralLedgerPage = ({ generalLedger, setPage, setJournalEntryToDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const allColumns = [
        { id: 'Journaalpostnummer', label: 'Journal Entry Number', isMerged: true },
        { id: 'Source', label: 'Source', isMerged: true },
        { id: 'Effective Date', label: 'Effective Date', isMerged: true },
        { id: 'Entry Date', label: 'Entry Date', isMerged: true },
        { id: 'Period', label: 'Period', isMerged: true },
        { id: 'GL Account', label: 'GL Account', isMerged: false },
        { id: 'GL Account Name', label: 'GL Account Name', isMerged: false },
        { id: 'Line Description', label: 'Line Description', isMerged: false },
        { id: 'Amount', label: 'Amount', isMerged: false },
        { id: 'Quantity', label: 'Quantity', isMerged: false },
        { id: 'Asset Number', label: 'Asset Number', isMerged: false },
    ];
    
    const [selectedColumns, setSelectedColumns] = useState(['Journaalpostnummer', 'Source', 'Effective Date', 'GL Account', 'GL Account Name', 'Amount']);

    const groupedLedger = useMemo(() => {
        const groups = generalLedger.reduce((acc, entry) => {
            const key = entry.Journaalpostnummer;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(entry);
            return acc;
        }, {});
        return Object.entries(groups).filter(([key, entries]) => {
            if (!searchTerm) return true;
            return entries.some(e => e.Description?.toLowerCase().includes(searchTerm.toLowerCase()));
        });
    }, [generalLedger, searchTerm]);

    const handleDeleteClick = (journalId) => {
        setJournalEntryToDelete(journalId);
        setPage('DeleteJournalEntries');
    };

    const visibleColumns = allColumns.filter(c => selectedColumns.includes(c.id));
    const mergedColumns = visibleColumns.filter(c => c.isMerged);
    const lineColumns = visibleColumns.filter(c => !c.isMerged);

    return (
        <div className="p-8 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">View General Ledger</h1>
                <div className="w-72">
                    <MultiSelectDropdown 
                        label="Columns" 
                        options={allColumns.map(c => c.id)} 
                        selectedOptions={selectedColumns} 
                        onChange={setSelectedColumns} 
                    />
                </div>
            </div>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by description..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="flex-grow overflow-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                        <tr>
                            {mergedColumns.map(c => <th key={c.id} scope="col" className="px-6 py-3">{c.label}</th>)}
                            {lineColumns.map(c => <th key={c.id} scope="col" className="px-6 py-3">{c.label}</th>)}
                            <th scope="col" className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {groupedLedger.map(([journalId, entries]) => (
                            <React.Fragment key={journalId}>
                                {entries.map((item, index) => (
                                    <tr key={`${journalId}-${index}`} className="bg-white border-b hover:bg-gray-50">
                                        {index === 0 && (
                                            <>
                                                {mergedColumns.map(c => (
                                                    <td key={c.id} className="px-6 py-4" rowSpan={entries.length}>
                                                        {c.id.includes('Date') ? formatDateEuropean(item[c.id]) : item[c.id]}
                                                    </td>
                                                ))}
                                            </>
                                        )}
                                        {lineColumns.map(c => (
                                             <td key={c.id} className="px-6 py-4">
                                                {c.id === 'Amount' ? `€${item.Amount.toFixed(2)}` : item[c.id]}
                                             </td>
                                        ))}
                                        {index === 0 && (
                                            <td className="px-6 py-4 align-middle" rowSpan={entries.length}>
                                                <button onClick={() => handleDeleteClick(journalId)} className="text-red-500 hover:text-red-700">
                                                    <Trash2 />
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ManualJournalEntryPage = ({ portfolioData, setPortfolioData }) => {
    // State for the header
    const [effectiveDate, setEffectiveDate] = useState('');
    const [description, setDescription] = useState('');

    // State for the lines
    const [lines, setLines] = useState([
        { id: 1, glAccount: null, assetNumber: null, lineDescription: '', amount: '', quantity: '', price: '' },
        { id: 2, glAccount: null, assetNumber: null, lineDescription: '', amount: '', quantity: '', price: '' }
    ]);
    const [nextId, setNextId] = useState(3);
    const [postStatus, setPostStatus] = useState({ posted: false });

    const { generalLedger, chartOfAccounts, assetMaster } = usePortfolioData(portfolioData);
    
    // Derived and Calculated values
    const period = useMemo(() => {
        if (!effectiveDate) return '';
        const date = new Date(effectiveDate);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }, [effectiveDate]);

    const journalEntryNumber = useMemo(() => {
        if (!effectiveDate) return 'YY00000001';
        const date = new Date(effectiveDate);
        const yearPrefix = String(date.getFullYear()).slice(-2);
        
        const relevantEntries = generalLedger.filter(entry => 
            String(entry.Journaalpostnummer).startsWith(yearPrefix)
        );

        if (relevantEntries.length === 0) {
            return `${yearPrefix}00000001`;
        }

        const maxNumber = Math.max(...relevantEntries.map(e => parseInt(String(e.Journaalpostnummer).slice(2), 10)));
        const nextNumber = String(maxNumber + 1).padStart(8, '0');
        
        return `${yearPrefix}${nextNumber}`;
    }, [effectiveDate, generalLedger]);

    // Validation
    const [validation, setValidation] = useState({ isValid: false, message: 'Please fill all required fields.' });

    useEffect(() => {
        const validate = () => {
            if (!effectiveDate || !description) {
                return { isValid: false, message: 'Effective Date and Description are required.' };
            }

            let totalAmount = 0;
            for (const line of lines) {
                const applicableAssets = assetMaster.filter(a => a['GL Account'] === line.glAccount);
                const isAssetApplicable = applicableAssets.length > 0 && line.assetNumber;

                if (!line.glAccount) {
                    return { isValid: false, message: `Line ${line.id}: GL Account is required.` };
                }

                if (isAssetApplicable) {
                    if (!line.quantity || !line.price) {
                       return { isValid: false, message: `Line ${line.id}: Quantity and Price are required for assets.` };
                    }
                } else {
                    if (line.amount === '') {
                         return { isValid: false, message: `Line ${line.id}: Amount is required.` };
                    }
                }
                
                totalAmount += parseFloat(line.amount) || 0;
            }

            if (Math.abs(totalAmount) > 0.001) { // Using a tolerance for float comparison
                return { isValid: false, message: `The sum of amounts must be zero. Current sum: ${totalAmount.toFixed(2)}` };
            }

            return { isValid: true, message: 'Validations met.' };
        };
        setValidation(validate());
    }, [effectiveDate, description, lines, assetMaster]);

    // Handlers
    const handleAddLine = () => {
        setLines([...lines, { id: nextId, glAccount: null, assetNumber: null, lineDescription: '', amount: '', quantity: '', price: '' }]);
        setNextId(nextId + 1);
    };

    const handleRemoveLine = (idToRemove) => {
        if (lines.length > 2) {
            setLines(lines.filter(line => line.id !== idToRemove));
        }
    };

    const handleLineChange = (id, field, value) => {
        const newLines = lines.map(line => {
            if (line.id === id) {
                const updatedLine = { ...line, [field]: value };
                if (field === 'glAccount') {
                    updatedLine.assetNumber = null;
                    updatedLine.quantity = '';
                    updatedLine.price = '';
                    updatedLine.amount = '';
                }
                if (field === 'assetNumber') {
                    updatedLine.quantity = '';
                    updatedLine.price = '';
                    updatedLine.amount = '';
                }
                if (field === 'quantity' || field === 'price') {
                    const quantity = parseFloat(field === 'quantity' ? value : updatedLine.quantity) || 0;
                    const price = parseFloat(field === 'price' ? value : updatedLine.price) || 0;
                    updatedLine.amount = (quantity * price).toFixed(2);
                }
                return updatedLine;
            }
            return line;
        });
        setLines(newLines);
    };

    const handlePost = () => {
        const updatedPortfolioData = JSON.parse(JSON.stringify(portfolioData));
        const entryDate = new Date().toISOString().split('T')[0];
        const formattedEffectiveDate = new Date(effectiveDate).toISOString().split('T')[0];

        lines.forEach(line => {
            const newGLEntry = {
                "Journaalpostnummer": journalEntryNumber,
                "GL Account": line.glAccount,
                "Asset Number": line.assetNumber || null,
                "Description": description,
                "Line Description": line.lineDescription,
                "Amount": parseFloat(line.amount),
                "Quantity": line.quantity ? parseFloat(line.quantity) : null,
                "Entry Date": entryDate,
                "Effective Date": formattedEffectiveDate,
                "Source": "MJ",
                "Period": period
            };
            updatedPortfolioData["General Ledger"].push(newGLEntry);
        });

        const linesWithAssets = lines.filter(line => line.assetNumber);
        linesWithAssets.forEach(line => {
            const subAdminEntry = updatedPortfolioData.Subadministration.find(
                sa => sa["Asset Number"] === line.assetNumber
            );
            const lineQuantity = parseFloat(line.quantity) || 0;
            const lineAmount = parseFloat(line.amount) || 0;

            if (subAdminEntry) {
                const currentStukken = parseFloat(subAdminEntry["Aantal stukken"]) || 0;
                const currentWaarde = parseFloat(subAdminEntry["Meest recente waarde"]) || 0;
                subAdminEntry["Aantal stukken"] = currentStukken + lineQuantity;
                subAdminEntry["Meest recente waarde"] = currentWaarde + lineAmount;
                subAdminEntry["Meest recente prijs"] = subAdminEntry["Aantal stukken"] !== 0 ? subAdminEntry["Meest recente waarde"] / subAdminEntry["Aantal stukken"] : 0;
            } else {
                const newSubAdminEntry = {
                    "Asset Number": line.assetNumber,
                    "Waarde bijgewerkt": entryDate,
                    "Aantal stukken": lineQuantity,
                    "Meest recente waarde": lineAmount,
                    "Meest recente prijs": lineQuantity !== 0 ? lineAmount / lineQuantity : 0,
                    "Couponrente": NaN,
                    "Effectieve rente": NaN
                };
                updatedPortfolioData.Subadministration.push(newSubAdminEntry);
            }
        });

        setPortfolioData(updatedPortfolioData);
        setPostStatus({ posted: true });

        setEffectiveDate('');
        setDescription('');
        setLines([
            { id: 1, glAccount: null, assetNumber: null, lineDescription: '', amount: '', quantity: '', price: '' },
            { id: 2, glAccount: null, assetNumber: null, lineDescription: '', amount: '', quantity: '', price: '' }
        ]);
        setNextId(3);
    };
    
    const createNewEntry = () => {
        setPostStatus({ posted: false });
    }

    // Component for searchable dropdown is replaced and put in UI COMPONENTS
    
    const glAccountOptions = chartOfAccounts.map(acc => ({
        value: acc['GL Account Code'],
        label: `${acc['GL Account Code']} - ${acc['GL Account Name']}`
    }));

    if (postStatus.posted) {
        return (
            <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Journal Posted Successfully!</h2>
                <p className="text-gray-600 mb-6">Your data has been updated. You can continue working or save your changes using the 'Save portfolio.json' button in the sidebar.</p>
                <button onClick={createNewEntry} className="text-sm text-blue-600 hover:underline">
                    Create Another Journal Entry
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 h-full flex flex-col bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manual Journal Entry</h1>
            <div className="bg-white border rounded-lg p-6 flex-grow flex flex-col overflow-hidden">
                {/* Header Section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Journal Entry Number</label>
                        <input type="text" value={journalEntryNumber} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm text-gray-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Effective Date</label>
                        <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Period</label>
                        <input type="text" value={period} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm text-gray-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>

                {/* Lines Section */}
                <div className="flex-grow overflow-y-auto pr-2">
                    <div className="grid grid-cols-12 gap-x-4 gap-y-2 items-center font-semibold text-sm text-gray-600 mb-2 px-2 sticky top-0 bg-white py-2">
                        <div className="col-span-2">GL Account</div>
                        <div className="col-span-2">Asset Number</div>
                        <div className="col-span-2">Line Description</div>
                        <div className="col-span-1 text-right">Quantity</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-2 text-right">Amount</div>
                        <div className="col-span-1"></div>
                    </div>
                    {lines.map((line) => {
                        const applicableAssets = assetMaster.filter(a => String(a['GL Account']) === String(line.glAccount));
                        const isAssetApplicable = applicableAssets.length > 0;
                        const assetOptions = applicableAssets.map(a => ({
                            value: a['Asset Number'],
                            label: `${a['Asset Number']} - ${a['Asset Description']}`
                        }));

                        return (
                            <div key={line.id} className="grid grid-cols-12 gap-x-4 gap-y-2 items-center mb-2 p-2 rounded-md hover:bg-gray-50">
                                <div className="col-span-2">
                                    <SearchableDropdown
                                        options={glAccountOptions}
                                        value={line.glAccount}
                                        onChange={(value) => handleLineChange(line.id, 'glAccount', value)}
                                        placeholder="Select GL Account"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <SearchableDropdown
                                        disabled={!isAssetApplicable}
                                        options={assetOptions}
                                        value={line.assetNumber}
                                        onChange={(value) => handleLineChange(line.id, 'assetNumber', value)}
                                        placeholder="Select Asset"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <input type="text" value={line.lineDescription} onChange={e => handleLineChange(line.id, 'lineDescription', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm" />
                                </div>
                                {line.assetNumber && isAssetApplicable ? (
                                    <>
                                        <div className="col-span-1">
                                            <input type="number" value={line.quantity} onChange={e => handleLineChange(line.id, 'quantity', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-right" />
                                        </div>
                                        <div className="col-span-2">
                                            <input type="number" value={line.price} onChange={e => handleLineChange(line.id, 'price', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-right" />
                                        </div>
                                        <div className="col-span-2">
                                            <input type="number" value={line.amount} readOnly className="w-full px-3 py-1.5 bg-gray-200 border border-gray-300 rounded-md text-sm text-right text-gray-500" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="col-span-1"></div>
                                        <div className="col-span-2"></div>
                                        <div className="col-span-2">
                                            <input type="number" value={line.amount} onChange={e => handleLineChange(line.id, 'amount', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm text-right" />
                                        </div>
                                    </>
                                )}
                                <div className="col-span-1 flex justify-center">
                                    {lines.length > 2 && (
                                        <button type="button" onClick={() => handleRemoveLine(line.id)} className="text-red-500 hover:text-red-700">
                                            <XCircle />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <button type="button" onClick={handleAddLine} className="mt-2 flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800">
                        <PlusCircle />
                        <span>Add Line</span>
                    </button>
                </div>

                {/* Footer Section */}
                <div className="mt-auto pt-4 border-t">
                    <div className="flex justify-end items-center">
                        <div className={`text-sm mr-4 ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                            {validation.message}
                        </div>
                        <button
                            type="button"
                            onClick={handlePost}
                            disabled={!validation.isValid}
                            className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const DeleteJournalEntriesPage = ({ portfolioData, setPortfolioData, journalEntryToDelete, setJournalEntryToDelete }) => {
    const generalLedger = portfolioData?.["General Ledger"] || [];
    const [postStatus, setPostStatus] = useState({ posted: false });

    const journalEntryNumbers = useMemo(() => 
        [...new Set(generalLedger.map(entry => entry.Journaalpostnummer))].sort((a, b) => b - a)
    , [generalLedger]);

    const selectedEntryLines = useMemo(() => 
        generalLedger.filter(entry => String(entry.Journaalpostnummer) === String(journalEntryToDelete))
    , [generalLedger, journalEntryToDelete]);

    const isDeletable = useMemo(() => {
        if (!selectedEntryLines || selectedEntryLines.length === 0) {
            return { valid: true, message: '' }; // No message when nothing is selected
        }
        for (const line of selectedEntryLines) {
            if (line['Asset Number'] && (line.Quantity === undefined || line.Quantity === null)) {
                return { valid: false, message: `Entry cannot be reversed. Line with asset ${line['Asset Number']} is missing quantity data.` };
            }
        }
        return { valid: true, message: 'Entry is valid for reversal.' };
    }, [selectedEntryLines]);


    const handleDelete = () => {
        const originalEntry = selectedEntryLines[0];
        if (!originalEntry || !isDeletable.valid) return;

        const updatedPortfolioData = JSON.parse(JSON.stringify(portfolioData));
        const entryDate = new Date().toISOString().split('T')[0];
        
        // Create new Journal Entry Number
        const yearPrefix = String(new Date().getFullYear()).slice(-2);
        const relevantEntries = updatedPortfolioData["General Ledger"].filter(entry => String(entry.Journaalpostnummer).startsWith(yearPrefix));
        const maxNumber = Math.max(0, ...relevantEntries.map(e => parseInt(String(e.Journaalpostnummer).slice(2), 10)));
        const nextNumber = String(maxNumber + 1).padStart(8, '0');
        const newJournalEntryNumber = `${yearPrefix}${nextNumber}`;

        // Create reversing entries
        selectedEntryLines.forEach(line => {
            const newGLEntry = {
                ...line,
                Journaalpostnummer: newJournalEntryNumber,
                Description: `Delete journal entry ${journalEntryToDelete}`,
                Amount: -line.Amount,
                Quantity: line.Quantity ? -line.Quantity : null,
                "Entry Date": entryDate,
                Source: "MJ" // Manual Journal for reversal
            };
            updatedPortfolioData["General Ledger"].push(newGLEntry);

            // Update subadministration if asset is present
            if (line["Asset Number"]) {
                const subAdminEntry = updatedPortfolioData.Subadministration.find(
                    sa => sa["Asset Number"] === line["Asset Number"]
                );
                if (subAdminEntry) {
                    const lineQuantity = parseFloat(line.Quantity) || 0;
                    const currentWaarde = parseFloat(subAdminEntry["Meest recente waarde"]) || 0;
                    const currentStukken = parseFloat(subAdminEntry["Aantal stukken"]) || 0;
                    
                    subAdminEntry["Aantal stukken"] = currentStukken - lineQuantity;
                    subAdminEntry["Meest recente waarde"] = currentWaarde - line.Amount;
                    subAdminEntry["Waarde bijgewerkt"] = entryDate;
                    subAdminEntry["Meest recente prijs"] = subAdminEntry["Aantal stukken"] !== 0 ? subAdminEntry["Meest recente waarde"] / subAdminEntry["Aantal stukken"] : 0;
                }
            }
        });

        setPortfolioData(updatedPortfolioData);
        setPostStatus({ posted: true });
    };

    if (postStatus.posted) {
        return (
            <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Journal Entry Reversed Successfully!</h2>
                <p className="text-gray-600 mb-6">A reversing entry has been posted. You can continue working or save your changes.</p>
                <button onClick={() => {setJournalEntryToDelete(null); setPostStatus({posted: false})}} className="text-sm text-blue-600 hover:underline">
                    Delete Another Journal Entry
                </button>
            </div>
        );
    }

    return (
        <div className="p-8 h-full flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Delete Journal Entries</h1>
            <div className="mb-6 max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Journal Entry Number</label>
                <select 
                    value={journalEntryToDelete || ''} 
                    onChange={e => setJournalEntryToDelete(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                >
                    <option value="">Select an entry...</option>
                    {journalEntryNumbers.map(num => <option key={num} value={num}>{num}</option>)}
                </select>
            </div>

            {journalEntryToDelete && (
                <div className="flex-grow bg-white border rounded-lg p-6 flex flex-col overflow-hidden">
                    <h3 className="text-lg font-semibold mb-4">Preview of Journal Entry: {journalEntryToDelete}</h3>
                    <div className="flex-grow overflow-auto">
                         <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                                <tr>
                                    {["GL Account", "Asset Number", "Line Description", "Quantity", "Amount"].map(h => <th key={h} scope="col" className="px-6 py-3">{h}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {selectedEntryLines.map((item, index) => (
                                    <tr key={index} className="bg-white border-b">
                                        <td className="px-6 py-4">{item['GL Account']} - {item['GL Account Name']}</td>
                                        <td className="px-6 py-4">{item['Asset Number'] || 'N/A'}</td>
                                        <td className="px-6 py-4">{item['Line Description']}</td>
                                        <td className="px-6 py-4 text-right">{item.Quantity !== null ? item.Quantity : 'N/A'}</td>
                                        <td className="px-6 py-4 text-right">€{item.Amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-auto pt-4 border-t text-right flex justify-end items-center">
                         <div className={`text-sm mr-4 ${isDeletable.valid ? 'text-green-600' : 'text-red-600'}`}>
                            {!isDeletable.valid && isDeletable.message}
                        </div>
                        <button
                            onClick={handleDelete}
                            disabled={!isDeletable.valid}
                            className="px-6 py-2 rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Delete Journal Entry (Post Reversal)
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MODAL & PurchaseAssets HELPER COMPONENTS ---

const Modal = ({ children, onClose }) => (
    // This overlay now uses a gentler dark tint and adds a blur effect to the background content.
    <div className="fixed inset-0 bg-black/5	backdrop-blur-sm z-40 flex justify-center items-center p-4" onClick={onClose}>
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-50">
                <XIcon />
            </button>
            <div className="p-8">
                 {children}
            </div>
        </div>
    </div>
);


const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
     <Modal onClose={onCancel}>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Are you sure?</h2>
        <p className="text-gray-600 mb-8">{message}</p>
        <div className="flex justify-end space-x-4">
            <button onClick={onCancel} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Cancel</button>
            <button onClick={onConfirm} className="px-6 py-2 rounded-md text-white bg-red-600 hover:bg-red-700">Confirm</button>
        </div>
    </Modal>
);


const CreateAssetModal = ({ portfolioData, setPortfolioData, onClose, onAssetCreated }) => {
    const { assetMaster, assetGroupMaster } = usePortfolioData(portfolioData);
    const [newAsset, setNewAsset] = useState({
        "Asset Description": '',
        "Ticker": '',
        "ISIN": '',
        "Asset Type": '',
        "Asset Group": '',
        "Broker": '',
        "Waarderingsmethode": 'Fair Value PL',
        "Status": "Active"
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const generatedAssetNumber = useMemo(() => {
        if (!newAsset["Asset Type"] || !assetMaster) return '';
        const typeMap = { "Aandelen": "A", "Debt": "D", "ETF": "E" };
        const prefix = typeMap[newAsset["Asset Type"]] || "O";
        const relevantAssets = assetMaster.filter(a => a["Asset Number"].startsWith(prefix));
        const maxNumber = Math.max(0, ...relevantAssets.map(a => parseInt(a["Asset Number"].slice(1), 10)));
        return `${prefix}${(maxNumber + 1).toString().padStart(4, '0')}`;
    }, [newAsset["Asset Type"], assetMaster]);

    useEffect(() => {
        const { "Asset Description": desc, "Asset Type": type, "Asset Group": group, "Broker": broker, "Waarderingsmethode": method } = newAsset;
        if (desc && type && group && broker && method) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [newAsset]);

    const handleChange = (field, value) => {
        setNewAsset(prev => ({ ...prev, [field]: value }));
    };

    const handleCreate = () => {
        const finalAsset = { "Asset Number": generatedAssetNumber, ...newAsset };
        const updatedPortfolioData = JSON.parse(JSON.stringify(portfolioData));
        updatedPortfolioData["Asset master table"].push(finalAsset);
        setPortfolioData(updatedPortfolioData);
        onAssetCreated(finalAsset["Asset Number"]);
        onClose();
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Asset</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Asset Number</label>
                    <input type="text" value={generatedAssetNumber} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-200 border border-gray-300 rounded-md text-gray-500" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Asset Description *</label>
                    <input type="text" value={newAsset["Asset Description"]} onChange={e => handleChange("Asset Description", e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Asset Type *</label>
                    <input type="text" value={newAsset["Asset Type"]} onChange={e => handleChange("Asset Type", e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Asset Group *</label>
                    <select value={newAsset["Asset Group"]} onChange={e => handleChange("Asset Group", e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md">
                        <option value="">Select Group...</option>
                        {assetGroupMaster.map(group => <option key={group["Asset Group"]} value={group["Asset Group"]}>{group["Asset Group"]}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Broker *</label>
                    <input type="text" value={newAsset["Broker"]} onChange={e => handleChange("Broker", e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Valuation Method *</label>
                    <input type="text" value={newAsset["Waarderingsmethode"]} onChange={e => handleChange("Waarderingsmethode", e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Ticker</label>
                    <input type="text" value={newAsset["Ticker"]} onChange={e => handleChange("Ticker", e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">ISIN</label>
                    <input type="text" value={newAsset["ISIN"]} onChange={e => handleChange("ISIN", e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
                </div>
            </div>
            <div className="mt-8 flex justify-end space-x-4">
                 <button onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200">Cancel</button>
                <button onClick={handleCreate} disabled={!isFormValid} className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">Create</button>
            </div>
        </div>
    );
};

const ManageAssetsModal = ({ portfolioData, setPortfolioData, onClose }) => {
    const [editAsset, setEditAsset] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmAction, setConfirmAction] = useState({ type: null, asset: null }); // { type: 'delete'/'restore', asset: {...} }

    const { assetMaster, assetGroupMaster } = usePortfolioData(portfolioData);

    const handleUpdate = () => {
        const updatedPortfolioData = JSON.parse(JSON.stringify(portfolioData));
        const assetIndex = updatedPortfolioData["Asset master table"].findIndex(a => a["Asset Number"] === editAsset["Asset Number"]);
        if (assetIndex > -1) {
            updatedPortfolioData["Asset master table"][assetIndex] = editAsset;
        }
        setPortfolioData(updatedPortfolioData);
        setEditAsset(null);
    };
    
    const handleStatusChange = (assetNumber, newStatus) => {
        const updatedPortfolioData = JSON.parse(JSON.stringify(portfolioData));
        const asset = updatedPortfolioData["Asset master table"].find(a => a["Asset Number"] === assetNumber);
        if (asset) {
            asset["Status"] = newStatus;
        }
        setPortfolioData(updatedPortfolioData);
        setConfirmAction({ type: null, asset: null }); // Close confirmation modal
    };

    const filteredAssets = useMemo(() => {
        return assetMaster.filter(asset =>
            asset["Asset Description"].toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset["Asset Number"].toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [assetMaster, searchTerm]);

    // --- RENDER LOGIC ---

    if (confirmAction.type) {
        return (
            <ConfirmationModal
                message={`Are you sure you want to ${confirmAction.type} the asset "${confirmAction.asset["Asset Description"]}"?`}
                onConfirm={() => handleStatusChange(confirmAction.asset["Asset Number"], confirmAction.type === 'delete' ? 'Deleted' : 'Active')}
                onCancel={() => setConfirmAction({ type: null, asset: null })}
            />
        );
    }

    if (editAsset) {
        return (
            <div>
                 <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Asset: {editAsset["Asset Number"]}</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Asset Description *</label>
                        <input type="text" value={editAsset["Asset Description"]} onChange={e => setEditAsset({...editAsset, "Asset Description": e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Asset Type *</label>
                        <input type="text" value={editAsset["Asset Type"]} onChange={e => setEditAsset({...editAsset, "Asset Type": e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Asset Group *</label>
                         <select value={editAsset["Asset Group"]} onChange={e => setEditAsset({...editAsset, "Asset Group": e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md">
                            {assetGroupMaster.map(group => <option key={group["Asset Group"]} value={group["Asset Group"]}>{group["Asset Group"]}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Broker *</label>
                        <input type="text" value={editAsset["Broker"]} onChange={e => setEditAsset({...editAsset, "Broker": e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Valuation Method *</label>
                        <input type="text" value={editAsset["Waarderingsmethode"]} onChange={e => setEditAsset({...editAsset, "Waarderingsmethode": e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Ticker</label>
                        <input type="text" value={editAsset["Ticker"]} onChange={e => setEditAsset({...editAsset, "Ticker": e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ISIN</label>
                        <input type="text" value={editAsset["ISIN"]} onChange={e => setEditAsset({...editAsset, "ISIN": e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md" />
                    </div>
                </div>
                <div className="mt-8 flex justify-end space-x-4">
                     <button onClick={() => setEditAsset(null)} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Back to List</button>
                    <button onClick={handleUpdate} className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">Save Changes</button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-[600px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Manage Assets</h2>
             <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
            />
            <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                        <tr>
                            <th className="px-4 py-3">Asset</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAssets.map(asset => (
                            <tr key={asset["Asset Number"]} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{asset["Asset Number"]} - {asset["Asset Description"]}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs rounded-full ${asset.Status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {asset.Status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <button onClick={() => setEditAsset(asset)} className="p-1 text-blue-600 hover:text-blue-800" title="Edit"><Edit /></button>
                                    {asset.Status === 'Active' ? (
                                        <button onClick={() => setConfirmAction({ type: 'delete', asset })} className="p-1 text-red-600 hover:text-red-800" title="Delete"><Trash2 /></button>
                                    ) : (
                                        <button onClick={() => setConfirmAction({ type: 'restore', asset })} className="p-1 text-green-600 hover:text-green-800" title="Restore"><RestoreIcon /></button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 flex justify-end">
                 <button onClick={onClose} className="px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Close</button>
            </div>
        </div>
    )
};

const PurchaseAssetsPage = ({ portfolioData, setPortfolioData, setPage }) => {
    // --- STATE MANAGEMENT ---
    const [selectedAssetNumber, setSelectedAssetNumber] = useState(null);
    const [transaction, setTransaction] = useState({
        quantity: '',
        price: '',
        transactionCost: '0',
        transactionDate: '',
        purchasedInterest: '0',
        couponrente: '',
        effectiveRente: ''
    });
    const [modals, setModals] = useState({ create: false, manage: false });
    const [validation, setValidation] = useState({ isValid: false, message: 'Please fill all required fields.' });
    const [postStatus, setPostStatus] = useState({ posted: false, message: '' });

    // --- DATA & DERIVED VALUES ---
    const { assetMaster, assetGroupMaster, subadministration, generalLedger } = usePortfolioData(portfolioData);


    const selectedAsset = useMemo(() => {
        return assetMaster.find(a => a["Asset Number"] === selectedAssetNumber);
    }, [selectedAssetNumber, assetMaster]);

    const amount = useMemo(() => {
        const qty = parseFloat(transaction.quantity) || 0;
        const prc = parseFloat(transaction.price) || 0;
        return qty * prc;
    }, [transaction.quantity, transaction.price]);

    const assetOptions = useMemo(() => {
        return assetMaster
            .filter(a => a.Status === 'Active')
            .map(a => ({
                value: a["Asset Number"],
                label: `${a["Asset Number"]} - ${a["Asset Description"]}`
            }));
    }, [assetMaster]);

    // --- VALIDATION ---
    useEffect(() => {
        const { quantity, price, transactionDate } = transaction;
        if (selectedAsset && quantity > 0 && price > 0 && transactionDate) {
            setValidation({ isValid: true, message: 'Validations met.' });
        } else {
            let message = "Validation errors: ";
            const errors = [];
            if (!selectedAsset) errors.push("Select an asset");
            if (!quantity || quantity <= 0) errors.push("Quantity must be > 0");
            if (!price || price <= 0) errors.push("Price must be > 0");
            if (!transactionDate) errors.push("Transaction Date is required");
            setValidation({ isValid: false, message: errors.join(', ') });
        }
    }, [selectedAsset, transaction]);

    // --- HANDLERS ---
    const handleTransactionChange = (field, value) => {
        setTransaction(prev => ({ ...prev, [field]: value }));
    };
    
    const handleAssetCreated = (newAssetNumber) => {
        setSelectedAssetNumber(newAssetNumber);
    }

    const handlePost = () => {
        const updatedPortfolioData = JSON.parse(JSON.stringify(portfolioData));
        const today = new Date().toISOString().split('T')[0];
        const effectiveDate = new Date(transaction.transactionDate).toISOString().split('T')[0];
        const period = effectiveDate.substring(0, 7);
        const yearPrefix = effectiveDate.substring(2, 4);

        // 1. Generate Journal Entry Number
        const relevantEntries = generalLedger.filter(e => String(e.Journaalpostnummer).startsWith(yearPrefix));
        const maxNum = Math.max(0, ...relevantEntries.map(e => parseInt(String(e.Journaalpostnummer).slice(2), 10)));
        const journalEntryNumber = `${yearPrefix}${(maxNum + 1).toString().padStart(8, '0')}`;

        // 2. Prepare Journal Entry Lines
        const assetGroupInfo = assetGroupMaster.find(ag => ag["Asset Group"] === selectedAsset["Asset Group"]);
        const description = `Aankoop ${selectedAsset["Asset Type"]} ${selectedAsset["Asset Description"]}`;

        // Line 1: Asset Activation
        updatedPortfolioData["General Ledger"].push({
            "Journaalpostnummer": journalEntryNumber,
            "GL Account": assetGroupInfo["GL Account"],
            "Asset Number": selectedAssetNumber,
            "Description": description,
            "Line Description": `Activering ${selectedAsset["Asset Group"]}`,
            "Amount": amount,
            "Quantity": parseFloat(transaction.quantity),
            "Entry Date": today,
            "Effective Date": effectiveDate,
            "Source": "GA",
            "Period": period
        });

        // Line 2: Credit Cash/Settlement
        const totalDeduction = -1 * (amount + parseFloat(transaction.transactionCost) + parseFloat(transaction.purchasedInterest));
        updatedPortfolioData["General Ledger"].push({
            "Journaalpostnummer": journalEntryNumber,
            "GL Account": 300110,
            "Asset Number": null,
            "Description": description,
            "Line Description": "Crediteren Vrije deel",
            "Amount": totalDeduction,
            "Quantity": null,
            "Entry Date": today,
            "Effective Date": effectiveDate,
            "Source": "GA",
            "Period": period
        });

        // Line 3: Transaction Costs (optional)
        if (parseFloat(transaction.transactionCost) > 0) {
             updatedPortfolioData["General Ledger"].push({
                "Journaalpostnummer": journalEntryNumber, "GL Account": 700000, "Asset Number": null, "Description": description,
                "Line Description": "Transactiekosten", "Amount": parseFloat(transaction.transactionCost), "Quantity": null,
                "Entry Date": today, "Effective Date": effectiveDate, "Source": "GA", "Period": period
            });
        }
        
        // Line 4: Purchased Interest (optional)
        if (parseFloat(transaction.purchasedInterest) > 0) {
             updatedPortfolioData["General Ledger"].push({
                "Journaalpostnummer": journalEntryNumber, "GL Account": 105050, "Asset Number": selectedAssetNumber, "Description": description,
                "Line Description": "Meegekochte rente", "Amount": parseFloat(transaction.purchasedInterest), "Quantity": null,
                "Entry Date": today, "Effective Date": effectiveDate, "Source": "GA", "Period": period
            });
        }

        // 3. Update Subadministration
        const subAdminEntry = updatedPortfolioData.Subadministration.find(sa => sa["Asset Number"] === selectedAssetNumber);
        if (subAdminEntry) { // Existing asset in subadmin
            subAdminEntry["Waarde bijgewerkt"] = today;
            subAdminEntry["Aantal stukken"] += parseFloat(transaction.quantity);
            subAdminEntry["Meest recente waarde"] += amount;
            subAdminEntry["Meest recente prijs"] = subAdminEntry["Meest recente waarde"] / subAdminEntry["Aantal stukken"];
            if (selectedAsset["Asset Type"] === "Debt") {
                subAdminEntry["Couponrente"] = parseFloat(transaction.couponrente);
                subAdminEntry["Effectieve rente"] = parseFloat(transaction.effectiveRente);
            }
        } else { // New asset in subadmin
             updatedPortfolioData.Subadministration.push({
                 "Asset Number": selectedAssetNumber,
                 "Asset Description": selectedAsset["Asset Description"],
                 "Broker": selectedAsset["Broker"],
                 "GL Account": assetGroupInfo["GL Account"],
                 "GL Account Waardeverandering": assetGroupInfo["GL Account Waardeverandering"],
                 "Waarderingsmethode": selectedAsset["Waarderingsmethode"],
                 "Waarde bijgewerkt": today,
                 "Aantal stukken": parseFloat(transaction.quantity),
                 "Meest recente prijs": parseFloat(transaction.price),
                 "Meest recente waarde": amount,
                 "Couponrente": selectedAsset["Asset Type"] === "Debt" ? parseFloat(transaction.couponrente) : null,
                 "Effectieve rente": selectedAsset["Asset Type"] === "Debt" ? parseFloat(transaction.effectiveRente) : null,
             });
        }

        // 4. Finalize
        setPortfolioData(updatedPortfolioData);
        setPostStatus({ posted: true, message: `Successfully posted Journal Entry: ${journalEntryNumber}` });
    };

    if (postStatus.posted) {
        return (
            <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                <CheckCircle />
                <h2 className="text-2xl font-bold text-green-600 mt-4 mb-2">Transaction Posted!</h2>
                <p className="text-gray-600 mb-6">{postStatus.message}</p>
                <button onClick={() => setPage('Home')} className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Back to Home
                </button>
            </div>
        );
    }
    
    return (
        <div className="p-8 h-full flex flex-col bg-gray-50">
            {modals.create && <Modal onClose={() => setModals({...modals, create: false})}><CreateAssetModal portfolioData={portfolioData} setPortfolioData={setPortfolioData} onAssetCreated={handleAssetCreated} onClose={() => setModals({...modals, create: false})} /></Modal>}
            {modals.manage && <Modal onClose={() => setModals({...modals, manage: false})}><ManageAssetsModal portfolioData={portfolioData} setPortfolioData={setPortfolioData} onClose={() => setModals({...modals, manage: false})} /></Modal>}

            <h1 className="text-2xl font-bold text-gray-800 mb-6">Purchase Assets</h1>
            
            <div className="bg-white border rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-700">1. Asset Information</h2>
                    <div className="space-x-2">
                        <button onClick={() => setModals({...modals, create: true})} className="text-sm px-3 py-1.5 rounded-md text-white bg-green-600 hover:bg-green-700">Create Asset</button>
                        <button onClick={() => setModals({...modals, manage: true})} className="text-sm px-3 py-1.5 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300">Manage Assets</button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-1 md:col-span-3">
                         <label className="block text-sm font-medium text-gray-700">Select Asset</label>
                        <SearchableDropdown
                            options={assetOptions}
                            value={selectedAssetNumber}
                            onChange={setSelectedAssetNumber}
                            placeholder="Search and select an asset..."
                        />
                    </div>
                    {selectedAsset && (
                        <>
                            <div><label className="text-xs">Ticker</label><p className="font-mono p-2 bg-gray-100 rounded-md">{selectedAsset.Ticker || 'N/A'}</p></div>
                            <div><label className="text-xs">ISIN</label><p className="font-mono p-2 bg-gray-100 rounded-md">{selectedAsset.ISIN || 'N/A'}</p></div>
                             <div><label className="text-xs">Asset Type</label><p className="p-2 bg-gray-100 rounded-md">{selectedAsset["Asset Type"]}</p></div>
                             <div><label className="text-xs">Asset Group</label><p className="p-2 bg-gray-100 rounded-md">{selectedAsset["Asset Group"]}</p></div>
                             <div><label className="text-xs">Broker</label><p className="p-2 bg-gray-100 rounded-md">{selectedAsset.Broker}</p></div>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white border rounded-lg p-6 flex-grow">
                 <h2 className="text-lg font-semibold text-gray-700 mb-4">2. Transaction Details</h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div>
                         <label className="block text-sm font-medium text-gray-700">Quantity *</label>
                         <input type="number" value={transaction.quantity} onChange={e => handleTransactionChange('quantity', e.target.value)} className="mt-1 w-full px-3 py-1.5 border-gray-300 border rounded-md" />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700">Price *</label>
                         <input type="number" value={transaction.price} onChange={e => handleTransactionChange('price', e.target.value)} className="mt-1 w-full px-3 py-1.5 border-gray-300 border rounded-md" />
                     </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700">Amount</label>
                         <input type="text" value={amount.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })} readOnly className="mt-1 w-full px-3 py-1.5 bg-gray-200 border-gray-300 border rounded-md text-gray-500" />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700">Transaction Date *</label>
                         <input type="date" value={transaction.transactionDate} onChange={e => handleTransactionChange('transactionDate', e.target.value)} className="mt-1 w-full px-3 py-1.5 border-gray-300 border rounded-md" />
                     </div>
                     <div>
                         <label className="block text-sm font-medium text-gray-700">Transaction Cost</label>
                         <input type="number" value={transaction.transactionCost} onChange={e => handleTransactionChange('transactionCost', e.target.value)} className="mt-1 w-full px-3 py-1.5 border-gray-300 border rounded-md" />
                     </div>
                     {selectedAsset?.["Asset Type"] === 'Debt' && (
                         <>
                             <div>
                                 <label className="block text-sm font-medium text-gray-700">Purchased Interest</label>
                                 <input type="number" value={transaction.purchasedInterest} onChange={e => handleTransactionChange('purchasedInterest', e.target.value)} className="mt-1 w-full px-3 py-1.5 border-gray-300 border rounded-md" />
                             </div>
                              <div>
                                 <label className="block text-sm font-medium text-gray-700">Couponrente</label>
                                 <input type="number" value={transaction.couponrente} onChange={e => handleTransactionChange('couponrente', e.target.value)} className="mt-1 w-full px-3 py-1.5 border-gray-300 border rounded-md" />
                             </div>
                              <div>
                                 <label className="block text-sm font-medium text-gray-700">Effective Rente</label>
                                 <input type="number" value={transaction.effectiveRente} onChange={e => handleTransactionChange('effectiveRente', e.target.value)} className="mt-1 w-full px-3 py-1.5 border-gray-300 border rounded-md" />
                             </div>
                         </>
                     )}
                 </div>
                 <div className="mt-auto pt-6 mt-6 flex justify-end items-center">
                    <div className={`text-sm mr-4 ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
                        {validation.message}
                    </div>
                    <button onClick={handlePost} disabled={!validation.isValid} className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">Post</button>
                 </div>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
export default function App() {
    const [pageHistory, setPageHistory] = useState(['Home']);
    const [portfolioData, setPortfolioData] = useState(dummyPortfolioData);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [journalEntryToDelete, setJournalEntryToDelete] = useState(null);
    
    const { holdingsSummary, generalLedger, uniqueValues, uniqueGLValues, chartOfAccounts, assetMaster } = usePortfolioData(portfolioData);

    const page = pageHistory[pageHistory.length - 1];

    const setPage = (newPage) => {
        setPageHistory([...pageHistory, newPage]);
    };

    const goBack = () => {
        if (pageHistory.length > 1) {
            setPageHistory(pageHistory.slice(0, -1));
        }
    };

    const handleFileLoad = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const sanitizedContent = content.replace(/: NaN/g, ': null');
                const parsedData = JSON.parse(sanitizedContent);
                setPortfolioData(parsedData);
            } catch (error) {
                console.error("Error parsing JSON file:", error);
                // A non-blocking UI notification is better than alert()
            }
        };
        reader.readAsText(file);
    };

    const handleSaveFile = () => {
        if (!portfolioData) {
            console.error("No data to save.");
            return;
        }
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(portfolioData, null, 2)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "portfolio.json";
        link.click();
    };

    const renderPage = () => {
        switch (page) {
            case 'Home':
                return <HomePage setPage={setPage} />;
            case 'AnalyzePortfolio':
                return <AnalyzePortfolioPage holdingsSummary={holdingsSummary} uniqueValues={uniqueValues} />;
            case 'AnalyzePerformance':
                return <AnalyzePerformancePage generalLedger={generalLedger} holdingsSummary={holdingsSummary} uniqueGLValues={uniqueGLValues} />;
            case 'GeneralLedger':
                return <GeneralLedgerPage generalLedger={generalLedger} setPage={setPage} setJournalEntryToDelete={setJournalEntryToDelete} />;
            case 'ManualJournalEntry':
                return <ManualJournalEntryPage portfolioData={portfolioData} setPortfolioData={setPortfolioData} />;
            case 'DeleteJournalEntries':
                return <DeleteJournalEntriesPage portfolioData={portfolioData} setPortfolioData={setPortfolioData} journalEntryToDelete={journalEntryToDelete} setJournalEntryToDelete={setJournalEntryToDelete} />;
            // This is inside the renderPage function in the main App component
            case 'PurchaseAssets':
                return <PurchaseAssetsPage portfolioData={portfolioData} setPortfolioData={setPortfolioData} setPage={setPage} />;
            default:
                return <HomePage setPage={setPage} />;
        }
    };

    return (
        <div className="h-screen w-screen bg-gray-100 flex font-sans">
            <Sidebar 
                setPage={setPage} 
                onFileLoad={handleFileLoad}
                onFileSave={handleSaveFile}
                isCollapsed={isSidebarCollapsed} 
                setIsCollapsed={setIsSidebarCollapsed}
                goBack={goBack}
                canGoBack={pageHistory.length > 1}
            />
            <main className="flex-grow bg-white overflow-auto transition-all duration-300">
                {renderPage()}
            </main>
        </div>
    );
}
