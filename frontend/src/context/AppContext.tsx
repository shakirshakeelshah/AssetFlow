import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = '/api';   // Now uses Vite proxy

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

interface Filters {
  search: string;
  type: 'all' | 'income' | 'expense';
  category: string;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}

interface AppContextType {
  transactions: Transaction[];
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    type: 'all',
    category: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
  });
  const [loading, setLoading] = useState(false);

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const refreshTransactions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/transactions`, config);
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      refreshTransactions();
    }
  }, [token]);

  const addTransaction = async (newTx: Omit<Transaction, 'id'>) => {
    try {
      const res = await axios.post(`${API_URL}/transactions`, newTx, config);
      setTransactions(prev => [res.data, ...prev]);
    } catch (err) {
      console.error("Failed to add transaction", err);
      throw err;
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`, config);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error("Failed to delete transaction", err);
      throw err;
    }
  };

  return (
    <AppContext.Provider value={{
      transactions,
      filters,
      setFilters,
      addTransaction,
      deleteTransaction,
      loading,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};