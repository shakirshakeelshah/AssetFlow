export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: TransactionType;
}

export type Role = 'viewer' | 'admin';

export interface Filters {
  search: string;
  type: 'all' | 'income' | 'expense';
  category: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}