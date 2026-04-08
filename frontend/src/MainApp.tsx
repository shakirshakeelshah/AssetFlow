import { useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { AppProvider } from './context/AppContext';

export default function MainApp() {
  const { user, token, isLoading } = useAuth();

  console.log("MainApp rendered - user:", !!user, "token:", !!token, "isLoading:", isLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (user && token) {
    return (
      <AppProvider key={token}>
        <Dashboard />
      </AppProvider>
    );
  }

  return <AuthPage />;
}