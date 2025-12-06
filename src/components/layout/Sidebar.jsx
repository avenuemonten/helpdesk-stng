// src/components/layout/Sidebar.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";

// Карта меню по ролям
// roleKey: 'user' | 'support' | 'admin'
const MENU_BY_ROLE = {
  user: [
    { id: "profile", label: "Профиль" },
    { id: "tickets", label: "Мои тикеты" },
  ],
  support: [
    { id: "dashboard", label: "Дашборд" },
    { id: "tickets", label: "Тикеты" },
    { id: "users", label: "Пользователи" },
    { id: "admin", label: "Админ-панель" },
    { id: "profile", label: "Профиль" },
  ],
  admin: [
    { id: "dashboard", label: "Дашборд" },
    { id: "tickets", label: "Тикеты" },
    { id: "users", label: "Пользователи" },
    { id: "admin", label: "Админ-панель" },
    { id: "profile", label: "Профиль" },
  ],
};

export default function Sidebar({ activeSection = "tickets", onSectionChange }) {
  const { user, logout } = useAuth();

  // Сейчас у тебя role приходит строкой типа "Admin / IT Support" или "Пользователь"
  // Приводим к нашим ключам: user | support | admin
  let roleKey = "user";
  const rawRole = (user?.role || "").toLowerCase();

  if (rawRole.includes("admin")) {
    roleKey = "admin";
  } else if (rawRole.includes("support") || rawRole.includes("поддерж")) {
    roleKey = "support";
  } else {
    roleKey = "user";
  }

  const menuItems = MENU_BY_ROLE[roleKey];

  return (
    <aside className="w-60 h-full bg-[#f8fafc] border-r border-[var(--border-subtle)] flex flex-col">
      {/* Верхняя шапка */}
      <div className="px-4 py-4 border-b border-[var(--border-subtle)]">
        <div className="text-[11px] text-[var(--text-muted)] mb-1">
          СТНГ / Helpdesk
        </div>
        <div className="text-sm font-semibold">Панель поддержки</div>
      </div>

      {/* Меню */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            label={item.label}
            active={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          />
        ))}
      </nav>

      {/* Нижний блок с пользователем */}
      <div className="border-t border-[var(--border-subtle)] px-3 py-3">
        <div className="flex items-center gap-3">
          {/* Аватар-кружок с инициалами */}
          <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
            {getUserInitials(user)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">
              {user?.fullname || user?.username || "Пользователь"}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] truncate">
              {user?.department && user?.computerName
                ? `${user.department} / ${user.computerName}`
                : roleKey === "admin"
                ? "Администратор"
                : roleKey === "support"
                ? "Поддержка"
                : "Сотрудник"}
            </div>
          </div>

          {/* Кнопка выхода */}
          <button
            title="Выйти"
            className="w-7 h-7 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[11px] text-slate-500 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-colors"
            onClick={logout}
          >
            ⎋
          </button>
        </div>
      </div>
    </aside>
  );
}

function SidebarItem({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        "w-full flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-colors",
        active
          ? "bg-white shadow-sm border border-[var(--border-subtle)] text-slate-900"
          : "text-[var(--text-muted)] hover:bg-white/70",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function getUserInitials(user) {
  if (!user?.fullname && !user?.username) return "??";

  const base = user.fullname || user.username;
  const parts = base.trim().split(" ");

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}
