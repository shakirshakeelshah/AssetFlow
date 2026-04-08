import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_BASE = '/api';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const refreshTransactions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/transactions`, config);
      setTransactions(res.data);
    } catch (err) {
      console.error("Transactions fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTransactions();
  }, [token]);

  const addTransaction = async (newTx: any) => {
    const res = await axios.post(`${API_BASE}/api/transactions`, newTx, config);
    setTransactions(prev => [res.data, ...prev]);
  };

  const deleteTransaction = async (id:const string) => {
    await axios.delete(`${API_BASE}/api/transactions/${id}`, config);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <AppContext.Provider value={{ 
      transactions, 
      addTransaction, 
      deleteTransaction, 
      loading 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);