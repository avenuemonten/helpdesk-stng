// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { id, username, fullname, department, computerName, ... }
  const [token, setToken] = useState(null); // пока фейковый
  const [loading, setLoading] = useState(true);

  // Загрузка из localStorage при старте
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("auth_user");
      }
    }

    setLoading(false);
  }, []);

  // ====== DEV-LOGIN БЕЗ БЭКЕНДА ======
  async function login(username, password, subdivision) {
    // имитируем запрос
    await new Promise((r) => setTimeout(r, 500));

    if (!username || !password || !subdivision) {
      throw new Error("Заполните все поля");
    }

    // здесь потом будет ответ от /api/auth/login
    const devUser = {
      id: 1,
      username,
      fullname: "",              // специально пусто → откроется форма профиля
      department: subdivision,   // подразделение с логина
      computerName: "",
      role: "Admin / IT Support",
      created_at: new Date().toISOString().slice(0, 10),
    };

    const devToken = "dev-token";

    setToken(devToken);
    setUser(devUser);
    localStorage.setItem("auth_token", devToken);
    localStorage.setItem("auth_user", JSON.stringify(devUser));
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }

  function updateUser(patch) {
    setUser((prev) => {
      const next = { ...(prev || {}), ...patch };
      localStorage.setItem("auth_user", JSON.stringify(next));
      return next;
    });
  }

  const profileCompleted = Boolean(
    user?.fullname && user?.department && user?.computerName
  );

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    profileCompleted,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
