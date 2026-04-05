import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SummaryCards from './SummaryCards';
import TransactionsTable from './TransactionsTable';
import Insights from './Insights';
import { Moon, Sun, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const [isDark, setIsDark] = useState(false);

  // Strong reset - runs once when component mounts
  useEffect(() => {
    console.log("Dashboard mounted - forcing light mode");

    // Remove dark class forcefully
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');

    setIsDark(false);
  }, []);

  const toggleDarkMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log("→ Switched to DARK mode");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log("→ Switched to LIGHT mode");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">AssetFlow</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, <span className="font-semibold">{user?.name}</span>
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 text-2xl hover:scale-110 transition-all"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            <button
              onClick={logout}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        <SummaryCards />
        <div className="mt-10"><Insights /></div>
        <div className="mt-12"><TransactionsTable /></div>

      </div>
    </div>
  );
}