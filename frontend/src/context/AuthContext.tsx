import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://assetflow-j8vw.onrender.com';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🔄 AuthProvider mounted. API_BASE =", API_BASE);
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        setUser({
          id: payload.userId,
          name: payload.name,
          email: payload.email,
        });
      } catch (err) {
        console.error("Invalid token");
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Attempting login to:", `${API_BASE}/api/login`);
    try {
      const res = await axios.post(`${API_BASE}/api/login`, { email, password });
      console.log("Login successful:", res.data);

      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
    } catch (err: any) {
      console.error("Login failed:", err.response?.data || err.message);
      throw new Error(err.response?.data?.error || "Login failed");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    console.log("Attempting register to:", `${API_BASE}/api/register`);
    try {
      const res = await axios.post(`${API_BASE}/api/register`, { name, email, password });
      console.log("Register response:", res.data);
      await login(email, password);
    } catch (err: any) {
      console.error("Register failed:", err.response?.data || err.message);
      throw new Error(err.response?.data?.error || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};