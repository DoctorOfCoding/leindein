import { Language } from '@/types/ledger';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    people: 'People',
    settings: 'Settings',
    
    // Dashboard
    totalBorrowed: 'Total Borrowed',
    totalGiven: 'Total Given',
    totalAdjustments: 'Total Adjustments',
    overallBalance: 'Overall Balance',
    youOwe: 'You Owe',
    theyOwe: 'They Owe',
    balanced: 'Balanced',
    
    // People
    addPerson: 'Add Person',
    personName: 'Person Name',
    noPeople: 'No people added yet',
    addFirstPerson: 'Add your first person to start tracking',
    
    // Person Detail
    balance: 'Balance',
    borrowed: 'Borrowed',
    given: 'Given',
    returned: 'Returned',
    itemsGivenByMe: 'Items Given by Me',
    itemsGivenToMe: 'Items Given to Me',
    transactions: 'Transactions',
    noTransactions: 'No transactions yet',
    
    // Transaction Types
    moneyBorrowed: 'Money Borrowed',
    moneyGiven: 'Money Given',
    moneyReturned: 'Money Returned',
    itemGivenByMe: 'Item Given by Me',
    itemGivenToMe: 'Item Given to Me',
    
    // Forms
    addTransaction: 'Add Transaction',
    editTransaction: 'Edit Transaction',
    addItemAdjustment: 'Add Item Adjustment',
    editItemAdjustment: 'Edit Item Adjustment',
    selectPerson: 'Select Person',
    selectType: 'Select Type',
    amount: 'Amount',
    date: 'Date',
    time: 'Time',
    description: 'Description',
    itemName: 'Item Name',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    
    // Settings
    language: 'Language',
    english: 'English',
    romanUrdu: 'Roman Urdu',
    exportData: 'Export Data',
    importData: 'Import Data',
    exportCSV: 'Export as CSV',
    importCSV: 'Import CSV',
    
    // Confirmation
    confirmDelete: 'Are you sure you want to delete this?',
    yes: 'Yes',
    no: 'No',
  },
  ur: {
    // Navigation
    dashboard: 'Dashboard',
    people: 'Log',
    settings: 'Settings',
    
    // Dashboard
    totalBorrowed: 'Kul Liya Hua',
    totalGiven: 'Kul Diya Hua',
    totalAdjustments: 'Kul Adjustments',
    overallBalance: 'Kul Baqi',
    youOwe: 'Aap Par Baqi',
    theyOwe: 'Un Par Baqi',
    balanced: 'Barabar',
    
    // People
    addPerson: 'Shakhs Shamil Karo',
    personName: 'Shakhs Ka Naam',
    noPeople: 'Koi shakhs nahi mila',
    addFirstPerson: 'Pehla shakhs shamil karo',
    
    // Person Detail
    balance: 'Baqi',
    borrowed: 'Liya',
    given: 'Diya',
    returned: 'Wapis Kiya',
    itemsGivenByMe: 'Mene Diya',
    itemsGivenToMe: 'Mujhy Mila',
    transactions: 'Lein Dein',
    noTransactions: 'Koi transaction nahi',
    
    // Transaction Types
    moneyBorrowed: 'Paise Liye',
    moneyGiven: 'Paise Diye',
    moneyReturned: 'Paise Wapis Kiye',
    itemGivenByMe: 'Mene Cheez Di',
    itemGivenToMe: 'Mujhy Cheez Mili',
    
    // Forms
    addTransaction: 'Transaction Shamil Karo',
    editTransaction: 'Transaction Badlo',
    addItemAdjustment: 'Item Adjustment Karo',
    editItemAdjustment: 'Item Adjustment Badlo',
    selectPerson: 'Shakhs Chuno',
    selectType: 'Qisam Chuno',
    amount: 'Raqam',
    date: 'Tareekh',
    time: 'Waqt',
    description: 'Tafseel',
    itemName: 'Cheez Ka Naam',
    save: 'Mehfooz Karo',
    cancel: 'Mansookh',
    delete: 'Mitao',
    edit: 'Badlo',
    
    // Settings
    language: 'Zuban',
    english: 'English',
    romanUrdu: 'Roman Urdu',
    exportData: 'Data Nikalo',
    importData: 'Data Daalo',
    exportCSV: 'CSV Nikalo',
    importCSV: 'CSV Daalo',
    
    // Confirmation
    confirmDelete: 'Kya aap waqai mitana chahte hain?',
    yes: 'Haan',
    no: 'Nahi',
  },
};

export const useTranslation = (language: Language) => {
  return (key: string): string => {
    return translations[language][key] || key;
  };
};
