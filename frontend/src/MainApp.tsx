import { useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import { AppProvider } from './context/AppContext';

export default function MainApp() {
  const { user, isLoading, token } = useAuth();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If no user or no token → show Login/Register
  if (!user || !token) {
    return <AuthPage />;
  }

  // Only render Dashboard when everything is ready
  return (
    <AppProvider key={token}>   {/* Important: key forces re-mount when token changes */}
      <Dashboard />
    </AppProvider>
  );
}