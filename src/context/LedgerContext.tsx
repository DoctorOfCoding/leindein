import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { LedgerState, Person, Transaction, ItemAdjustment, Language, PersonBalance } from '@/types/ledger';

const STORAGE_KEY = 'ledger_data';

const initialState: LedgerState = {
  persons: [],
  transactions: [],
  itemAdjustments: [],
  language: 'en',
};

type Action =
  | { type: 'LOAD_STATE'; payload: LedgerState }
  | { type: 'ADD_PERSON'; payload: Person }
  | { type: 'DELETE_PERSON'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_ITEM_ADJUSTMENT'; payload: ItemAdjustment }
  | { type: 'UPDATE_ITEM_ADJUSTMENT'; payload: ItemAdjustment }
  | { type: 'DELETE_ITEM_ADJUSTMENT'; payload: string }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'IMPORT_DATA'; payload: LedgerState };

function reducer(state: LedgerState, action: Action): LedgerState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;
    case 'ADD_PERSON':
      return { ...state, persons: [...state.persons, action.payload] };
    case 'DELETE_PERSON':
      return {
        ...state,
        persons: state.persons.filter(p => p.id !== action.payload),
        transactions: state.transactions.filter(t => t.personId !== action.payload),
        itemAdjustments: state.itemAdjustments.filter(i => i.personId !== action.payload),
      };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'ADD_ITEM_ADJUSTMENT':
      return { ...state, itemAdjustments: [...state.itemAdjustments, action.payload] };
    case 'UPDATE_ITEM_ADJUSTMENT':
      return {
        ...state,
        itemAdjustments: state.itemAdjustments.map(i =>
          i.id === action.payload.id ? action.payload : i
        ),
      };
    case 'DELETE_ITEM_ADJUSTMENT':
      return {
        ...state,
        itemAdjustments: state.itemAdjustments.filter(i => i.id !== action.payload),
      };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'IMPORT_DATA':
      return action.payload;
    default:
      return state;
  }
}

interface LedgerContextType {
  state: LedgerState;
  addPerson: (name: string) => void;
  deletePerson: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  addItemAdjustment: (adjustment: Omit<ItemAdjustment, 'id' | 'createdAt'>) => void;
  updateItemAdjustment: (adjustment: ItemAdjustment) => void;
  deleteItemAdjustment: (id: string) => void;
  setLanguage: (language: Language) => void;
  getPersonBalance: (personId: string) => PersonBalance;
  getOverallStats: () => {
    totalBorrowed: number;
    totalGiven: number;
    totalAdjustments: number;
    overallBalance: number;
  };
  exportData: () => string;
  importData: (data: string) => boolean;
}

const LedgerContext = createContext<LedgerContextType | undefined>(undefined);

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (e) {
        console.error('Failed to load ledger data:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addPerson = (name: string) => {
    const person: Person = {
      id: generateId(),
      name,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_PERSON', payload: person });
  };

  const deletePerson = (id: string) => {
    dispatch({ type: 'DELETE_PERSON', payload: id });
  };

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const addItemAdjustment = (adjustment: Omit<ItemAdjustment, 'id' | 'createdAt'>) => {
    const newAdjustment: ItemAdjustment = {
      ...adjustment,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_ITEM_ADJUSTMENT', payload: newAdjustment });
  };

  const updateItemAdjustment = (adjustment: ItemAdjustment) => {
    dispatch({ type: 'UPDATE_ITEM_ADJUSTMENT', payload: adjustment });
  };

  const deleteItemAdjustment = (id: string) => {
    dispatch({ type: 'DELETE_ITEM_ADJUSTMENT', payload: id });
  };

  const setLanguage = (language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const getPersonBalance = (personId: string): PersonBalance => {
    const personTransactions = state.transactions.filter(t => t.personId === personId);
    const personAdjustments = state.itemAdjustments.filter(i => i.personId === personId);

    const totalBorrowed = personTransactions
      .filter(t => t.type === 'borrowed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalGiven = personTransactions
      .filter(t => t.type === 'given')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalReturned = personTransactions
      .filter(t => t.type === 'returned')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalItemsGivenByMe = personAdjustments
      .filter(i => i.type === 'given_by_me')
      .reduce((sum, i) => sum + i.amount, 0);

    const totalItemsGivenToMe = personAdjustments
      .filter(i => i.type === 'given_to_me')
      .reduce((sum, i) => sum + i.amount, 0);

    // Positive = I owe them, Negative = They owe me
    const finalBalance = totalBorrowed - totalReturned - totalGiven + totalItemsGivenToMe - totalItemsGivenByMe;

    return {
      totalBorrowed,
      totalGiven,
      totalReturned,
      totalItemsGivenByMe,
      totalItemsGivenToMe,
      finalBalance,
    };
  };

  const getOverallStats = () => {
    const totalBorrowed = state.transactions
      .filter(t => t.type === 'borrowed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalGiven = state.transactions
      .filter(t => t.type === 'given')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalReturned = state.transactions
      .filter(t => t.type === 'returned')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalItemsGivenByMe = state.itemAdjustments
      .filter(i => i.type === 'given_by_me')
      .reduce((sum, i) => sum + i.amount, 0);

    const totalItemsGivenToMe = state.itemAdjustments
      .filter(i => i.type === 'given_to_me')
      .reduce((sum, i) => sum + i.amount, 0);

    const totalAdjustments = totalItemsGivenByMe + totalItemsGivenToMe;
    const overallBalance = totalBorrowed - totalReturned - totalGiven + totalItemsGivenToMe - totalItemsGivenByMe;

    return { totalBorrowed, totalGiven, totalAdjustments, overallBalance };
  };

  const exportData = () => {
    const lines: string[] = [];
    
    // Persons CSV
    lines.push('### PERSONS ###');
    lines.push('id,name,createdAt');
    state.persons.forEach(p => {
      lines.push(`${p.id},"${p.name.replace(/"/g, '""')}",${p.createdAt}`);
    });
    
    // Transactions CSV
    lines.push('');
    lines.push('### TRANSACTIONS ###');
    lines.push('id,personId,type,amount,date,time,description,createdAt');
    state.transactions.forEach(t => {
      lines.push(`${t.id},${t.personId},${t.type},${t.amount},${t.date},${t.time},"${(t.description || '').replace(/"/g, '""')}",${t.createdAt}`);
    });
    
    // Item Adjustments CSV
    lines.push('');
    lines.push('### ITEM_ADJUSTMENTS ###');
    lines.push('id,personId,itemName,amount,type,date,time,description,createdAt');
    state.itemAdjustments.forEach(i => {
      lines.push(`${i.id},${i.personId},"${i.itemName.replace(/"/g, '""')}",${i.amount},${i.type},${i.date},${i.time},"${(i.description || '').replace(/"/g, '""')}",${i.createdAt}`);
    });
    
    return lines.join('\n');
  };

  const importData = (data: string): boolean => {
    try {
      const lines = data.split('\n').map(l => l.trim()).filter(l => l);
      const persons: Person[] = [];
      const transactions: Transaction[] = [];
      const itemAdjustments: ItemAdjustment[] = [];
      
      let currentSection = '';
      
      for (const line of lines) {
        if (line.startsWith('### PERSONS ###')) {
          currentSection = 'persons';
          continue;
        } else if (line.startsWith('### TRANSACTIONS ###')) {
          currentSection = 'transactions';
          continue;
        } else if (line.startsWith('### ITEM_ADJUSTMENTS ###')) {
          currentSection = 'itemAdjustments';
          continue;
        }
        
        // Skip headers
        if (line.startsWith('id,')) continue;
        
        const parseCSVLine = (line: string): string[] => {
          const result: string[] = [];
          let current = '';
          let inQuotes = false;
          
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
              if (inQuotes && line[i + 1] === '"') {
                current += '"';
                i++;
              } else {
                inQuotes = !inQuotes;
              }
            } else if (char === ',' && !inQuotes) {
              result.push(current);
              current = '';
            } else {
              current += char;
            }
          }
          result.push(current);
          return result;
        };
        
        const fields = parseCSVLine(line);
        
        if (currentSection === 'persons' && fields.length >= 3) {
          persons.push({
            id: fields[0],
            name: fields[1],
            createdAt: fields[2],
          });
        } else if (currentSection === 'transactions' && fields.length >= 8) {
          transactions.push({
            id: fields[0],
            personId: fields[1],
            type: fields[2] as 'borrowed' | 'given' | 'returned',
            amount: parseFloat(fields[3]),
            date: fields[4],
            time: fields[5],
            description: fields[6],
            createdAt: fields[7],
          });
        } else if (currentSection === 'itemAdjustments' && fields.length >= 9) {
          itemAdjustments.push({
            id: fields[0],
            personId: fields[1],
            itemName: fields[2],
            amount: parseFloat(fields[3]),
            type: fields[4] as 'given_by_me' | 'given_to_me',
            date: fields[5],
            time: fields[6],
            description: fields[7],
            createdAt: fields[8],
          });
        }
      }
      
      if (persons.length > 0 || transactions.length > 0 || itemAdjustments.length > 0) {
        dispatch({ 
          type: 'IMPORT_DATA', 
          payload: { persons, transactions, itemAdjustments, language: state.language } 
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <LedgerContext.Provider
      value={{
        state,
        addPerson,
        deletePerson,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addItemAdjustment,
        updateItemAdjustment,
        deleteItemAdjustment,
        setLanguage,
        getPersonBalance,
        getOverallStats,
        exportData,
        importData,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
}

export function useLedger() {
  const context = useContext(LedgerContext);
  if (context === undefined) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
}
