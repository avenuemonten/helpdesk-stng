// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

// IP твоей Ubuntu. Если поменяется — поменяешь тут одну строку.
const API_BASE = "http://192.168.171.130:3000/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { id, username, fullname, department, computerName, ... }
  const [token, setToken] = useState(null); // реальный JWT с бэка
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

  // ====== ЛОГИН ЧЕРЕЗ BACKEND /api/auth/login ======
  async function login(username, password, subdivision) {
    if (!username || !password || !subdivision) {
      throw new Error("Заполните все поля");
    }

    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, subdivision }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Ошибка авторизации");
    }

    const data = await res.json(); // { token, user }

    // user с бэка: { id, username, fullName, department, computerName, role, createdAt }
    const apiUser = data.user || {};

    // Маппинг к тому, что уже ждёт фронт (fullname, created_at)
    const mappedUser = {
      ...apiUser,
      fullname: apiUser.fullName ?? apiUser.fullname ?? "",
      department: apiUser.department ?? "",
      computerName: apiUser.computerName ?? apiUser.computer_name ?? "",
      role: apiUser.role ?? "user",
      created_at: apiUser.createdAt ?? apiUser.created_at ?? null,
    };

    setToken(data.token);
    setUser(mappedUser);

    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_user", JSON.stringify(mappedUser));
  }

  // ====== ВЫХОД ======
  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }

  // ====== СОХРАНЕНИЕ ПРОФИЛЯ НА БЭКЕНДЕ ======
  // Можно дергать из формы "Заполнить карточку сотрудника"
  async function saveProfile({ fullname, department, computerName }) {
    if (!token) {
      throw new Error("Нет токена авторизации");
    }

    const res = await fetch(`${API_BASE}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: fullname,      // бэку нужно fullName
        department,
        computerName,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Не удалось сохранить профиль");
    }

    const apiUser = await res.json();
    const mappedUser = {
      ...apiUser,
      fullname: apiUser.fullName ?? apiUser.fullname ?? "",
      department: apiUser.department ?? "",
      computerName: apiUser.computerName ?? apiUser.computer_name ?? "",
      role: apiUser.role ?? "user",
      created_at: apiUser.createdAt ?? apiUser.created_at ?? null,
    };

    setUser(mappedUser);
    localStorage.setItem("auth_user", JSON.stringify(mappedUser));

    return mappedUser;
  }

  // Старый локальный updateUser оставляем, чтобы ничего не сломать
  // (может использоваться в компонентах). Он просто правит локальный state.
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
    updateUser,   // локальный апдейт (как было)
    saveProfile,  // новый апдейт через backend
    profileCompleted,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
