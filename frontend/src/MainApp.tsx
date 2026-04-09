import { useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { AppProvider } from './context/AppContext';

export default function MainApp() {
  const { user, token, isLoading } = useAuth();

  console.log("MainApp rendered → user:", !!user, "token:", !!token);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (user && token) {
    console.log("✅ Switching to Dashboard");
    return (
      <AppProvider key={token}>
        <Dashboard />
      </AppProvider>
    );
  }

  console.log("📋 Showing Login Page");
  return <AuthPage />;
}