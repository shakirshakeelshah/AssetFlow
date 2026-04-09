import { useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { AppProvider } from './context/AppContext';
import { useState, useEffect } from 'react';

export default function MainApp() {
  const { user, token, isLoading } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    if (user && token) {
      console.log("✅ Token & User detected - forcing Dashboard");
      setShowDashboard(true);
    } else {
      setShowDashboard(false);
    }
  }, [user, token]);

  console.log("MainApp rendered → showDashboard:", showDashboard, "user:", !!user, "token:", !!token);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">Loading...</div>;
  }

  if (showDashboard) {
    return (
      <AppProvider key={token}>
        <Dashboard />
      </AppProvider>
    );
  }

  return <AuthPage />;
}