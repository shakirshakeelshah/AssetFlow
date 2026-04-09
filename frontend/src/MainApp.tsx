import { useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { AppProvider } from './context/AppContext';

export default function MainApp() {
  const { user, token, isLoading } = useAuth();

  console.log("MainApp rendered → user:", !!user, "token:", !!token, "isLoading:", isLoading);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">Loading...</div>;
  }

  // Force show dashboard if we have token (even if user object is delayed)
  if (token) {
    console.log("✅ Token detected - showing Dashboard");
    return (
      <AppProvider key={token}>
        <Dashboard />
      </AppProvider>
    );
  }

  console.log("📋 Showing Login Page");
  return <AuthPage />;
}