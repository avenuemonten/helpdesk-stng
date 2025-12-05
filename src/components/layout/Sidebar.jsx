// src/components/layout/Sidebar.jsx
import React from "react";

export default function Sidebar({
  activeSection = "dashboard",
  onSectionChange,
  isAdmin = true, // пока просто флаг, вдруг пригодится дальше
}) {
  return (
    <aside className="w-60 h-full bg-[#f8fafc] border-r border-[var(--border-subtle)] flex flex-col">
      {/* Логотип / заголовок слева */}
      <div className="px-4 py-4 border-b border-[var(--border-subtle)]">
        <div className="text-[11px] text-[var(--text-muted)] mb-1">
          СТНГ / Helpdesk
        </div>
        <div className="text-sm font-semibold">Панель поддержки</div>
      </div>

      {/* Навигация */}
      <nav className="px-2 py-3 space-y-1 text-sm">
        <SidebarItem
          label="Дашборд"
          active={activeSection === "dashboard"}
          onClick={() => onSectionChange?.("dashboard")}
        />
        <SidebarItem
          label="Тикеты"
          active={activeSection === "tickets"}
          onClick={() => onSectionChange?.("tickets")}
        />
        {isAdmin && (
          <SidebarItem
            label="Пользователи"
            active={activeSection === "users"}
            onClick={() => onSectionChange?.("users")}
          />
        )}
        {isAdmin && (
          <SidebarItem
            label="Админ-панель"
            active={activeSection === "admin"}
            onClick={() => onSectionChange?.("admin")}
          />
        )}
      </nav>

      {/* Юзер-карточка снизу (как в Discord) */}
      <div className="mt-auto px-3 py-3 border-t border-[var(--border-subtle)]">
        <button className="w-full flex items-center justify-between gap-3 rounded-xl bg-white hover:bg-slate-50 border border-[var(--border-subtle)] px-3 py-2 text-left transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-semibold">
              ЗД
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold leading-tight">
                Заболоцкий Д. С.
              </span>
              <span className="text-[10px] text-[var(--text-muted)] leading-tight">
                Admin / IT Support
              </span>
            </div>
          </div>

          {/* Иконка выхода */}
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-red-50 hover:text-red-500 transition-colors">
            ⏏
          </div>
        </button>
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
