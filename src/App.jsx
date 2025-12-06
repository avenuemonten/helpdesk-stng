// src/App.jsx
import MainLayout from "./components/layout/MainLayout.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import LoginPage from "./components/auth/LoginPage.jsx";
import ProfileSetupPage from "./components/auth/ProfileSetupPage.jsx";

function AppInner() {
  const { user, loading, profileCompleted } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Загружаем…
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (!profileCompleted) {
    return <ProfileSetupPage />;
  }

  return <MainLayout currentUser={user} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  );
}
