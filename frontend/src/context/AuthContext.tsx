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
      } catch (e) {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Attempting login...");
    const res = await axios.post(`${API_BASE}/login`, { email, password });
    const { token: newToken, user: newUser } = res.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);

    console.log("Login successful - token saved");
    return newUser;
  };

  const register = async (name: string, email: string, password: string) => {
    await axios.post(`${API_BASE}/register`, { name, email, password });
    await login(email, password);
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