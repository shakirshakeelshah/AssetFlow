import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'https://assetflow-j8vw.onrender.com';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

interface AppContextType {
  transactions: Transaction[];
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  addTransaction: (tx: any) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const refreshTransactions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/transactions`, config);
      setTransactions(res.data);
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) refreshTransactions();
  }, [token]);

  const addTransaction = async (newTx: any) => {
    const res = await axios.post(`${API_BASE}/api/transactions`, newTx, config);
    setTransactions(prev => [res.data, ...prev]);
  };

  const deleteTransaction = async (id: string) => {
    await axios.delete(`${API_BASE}/api/transactions/${id}`, config);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider value={{
      transactions,
      filters: { search: '', type: 'all', category: 'all', sortBy: 'date', sortOrder: 'desc' },
      setFilters: () => {},
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