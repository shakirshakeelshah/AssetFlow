import { useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { AppProvider } from './context/AppContext';

export default function MainApp() {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">Loading...</div>;
  }

  if (token) {
    return (
      <AppProvider key={token}>
        <Dashboard />
      </AppProvider>
    );
  }

  return <AuthPage />;
}