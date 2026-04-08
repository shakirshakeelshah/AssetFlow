import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import axios from 'axios';

const API_BASE = '/api';

interface User {
  id: string;
  name: string;
  email: string;
}

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const payload = JSON.parse(atob(savedToken.split('.')[1]));
        setUser({ id: payload.userId, name: payload.name, email: payload.email });
      } catch (e) {}
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log("🔄 Attempting login to:", `${API_BASE}/api/login`);
    try {
      const res = await axios.post(`${API_BASE}/api/login`, { email, password }, {
        timeout: 30000   // Increased to 30 seconds for cold start
      });
      console.log("✅ Login successful");
      const { token: newToken, user: newUser } = res.data;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      setUser(newUser);
    } catch (err: any) {
      console.error("❌ Login error:", err.message);
      if (err.code === 'ECONNABORTED') {
        throw new Error("Request timed out. Backend may be waking up. Try again.");
      }
      throw new Error(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    console.log("🔄 Attempting register to:", `${API_BASE}/api/register`);
    try {
      await axios.post(`${API_BASE}/api/register`, { name, email, password }, {
        timeout: 30000
      });
      await login(email, password);
    } catch (err: any) {
      console.error("❌ Register error:", err.message);
      throw new Error(err.response?.data?.error || "Registration failed. Try again.");
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

export const useAuth = () => useContext(AuthContext);