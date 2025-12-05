export type TransactionType = 'borrowed' | 'given' | 'returned';
export type ItemAdjustmentType = 'given_by_me' | 'given_to_me';
export type Language = 'en' | 'ur';

export interface Person {
  id: string;
  name: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  personId: string;
  type: TransactionType;
  amount: number;
  date: string;
  time: string;
  description: string;
  createdAt: string;
}

export interface ItemAdjustment {
  id: string;
  personId: string;
  itemName: string;
  amount: number;
  type: ItemAdjustmentType;
  date: string;
  time: string;
  description: string;
  createdAt: string;
}

export interface LedgerState {
  persons: Person[];
  transactions: Transaction[];
  itemAdjustments: ItemAdjustment[];
  language: Language;
}

export interface PersonBalance {
  totalBorrowed: number;
  totalGiven: number;
  totalReturned: number;
  totalItemsGivenByMe: number;
  totalItemsGivenToMe: number;
  finalBalance: number;
}
