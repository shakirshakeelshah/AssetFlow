import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_BASE = 'https://assetflow-j8vw.onrender.com/api';   // Full URL

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
      const res = await axios.get(`${API_BASE}/transactions`, config);
      setTransactions(res.data);
      console.log("✅ Transactions loaded:", res.data.length);
    } catch (err: any) {
      console.error("❌ Failed to fetch transactions:", err.response?.status, err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTransactions();
  }, [token]);

  const addTransaction = async (newTx: any) => {
    const res = await axios.post(`${API_BASE}/transactions`, newTx, config);
    setTransactions(prev => [res.data, ...prev]);
  };

  const deleteTransaction = async (id: string) => {
    await axios.delete(`${API_BASE}/transactions/${id}`, config);
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