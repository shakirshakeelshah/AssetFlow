import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SummaryCards from './SummaryCards';
import TransactionsTable from './TransactionsTable';
import Insights from './Insights';
import { Moon, Sun, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">AssetFlow</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, <span className="font-semibold">{user?.name}</span>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {isDark ? <Sun size={22} className="text-yellow-500" /> : <Moon size={22} />}
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-medium transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <SummaryCards />

        <div className="mt-10">
          <Insights />
        </div>

        <div className="mt-12">
          <TransactionsTable />
        </div>
      </div>

      {/* Copyright Footer */}
      <footer className="mt-20 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {currentYear} AssetFlow. All rights reserved.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Built by Shakir Shakeel Shah
          </p>
        </div>
      </footer>
    </div>
  );
}