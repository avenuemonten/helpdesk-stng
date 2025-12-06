import { useAuth } from "../../context/AuthContext.jsx";

const MENU_BY_ROLE = {
  support: [
    { id: "tickets", label: "Тикеты" },
    { id: "users", label: "Пользователи" },
    { id: "admin", label: "Панель поддержки" },
  ],
  admin: [
    { id: "dashboard", label: "Дашборд" },
    { id: "tickets", label: "Тикеты" },
    { id: "users", label: "Пользователи" },
    { id: "admin", label: "Панель поддержки" },
  ],
  user: [
    { id: "tickets", label: "Мои тикеты" },
    { id: "profile", label: "Профиль" },
  ],
};

export default function Sidebar({ activeSection = "tickets", onSectionChange, currentUser, onLogout }) {
  const { user, logout } = useAuth();

  // Приводим строку роли к нашим ключам: user | support | admin
  const rawRole = (user?.role || currentUser?.role || "").toLowerCase();
  let roleKey = "user";

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
        <div className="text-sm font-semibold">
          {roleKey === "user"
            ? "Панель пользователя"
            : roleKey === "support"
            ? "Панель поддержки"
            : "Админ-панель"}
        </div>
      </div>

      {/* Меню */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
            {/* Фамилия.И.О */}
            <div className="text-xs font-medium truncate">
              {formatCompactName(user)}
            </div>

            {/* Бейдж роли для support / admin */}
            {roleKey !== "user" && (
              <div className="mt-0.5">
                <span
                  className={[
                    "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wide border",
                    roleKey === "admin"
                      ? "bg-rose-100 text-rose-700 border-rose-200"
                      : "bg-amber-100 text-amber-700 border-amber-200",
                  ].join(" ")}
                >
                  {roleKey === "admin" ? "ADMINISTRATOR" : "SUPPORT"}
                </span>
              </div>
            )}

            {/* Подразделение / имя компьютера или fallback */}
            <div className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">
              {user?.department && user?.computerName
                ? `${user.department} / ${user.computerName}`
                : roleKey === "user"
                ? "Сотрудник"
                : roleKey === "admin"
                ? "Администратор"
                : "Поддержка"}
            </div>
          </div>

          {/* Кнопка выхода */}
          <button
            title="Выйти"
            className="w-7 h-7 rounded-full border border-[var(--border-subtle)] flex items-center justify-center text-[11px] text-slate-500 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-colors"
            onClick={logout}
          >
            ⏻
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

// Формат: "Заболоцкий Дуолан Спиридонович" -> "Заболоцкий.Д.С"
function formatCompactName(user) {
  const base = user?.fullname || user?.username;
  if (!base) return "Пользователь";

  const parts = base.trim().split(/\s+/);
  if (parts.length === 1) return base;

  const [last, first, middle] = parts;
  let result = last || base;

  if (first) result += `.${first[0].toUpperCase()}`;
  if (middle) result += `.${middle[0].toUpperCase()}`;

  return result;
}