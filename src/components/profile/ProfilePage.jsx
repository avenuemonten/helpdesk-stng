// src/components/profile/ProfilePage.jsx
import { useEffect, useState } from "react";

function mockUser() {
  return {
    id: 1,
    username: "duolan",
    fullname: "Заболоцкий Дуолан",
    email: "duolan@example.com",
    role: "Admin / IT Support",
    avatar: "",
    created_at: "2024-12-01",
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState(mockUser());
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/me");
        if (res.ok) {
          const data = await res.json();
          setUser((prev) => ({ ...prev, ...data }));
        }
      } catch (_) {
        // пока просто мок
      }
    })();

    (async () => {
      try {
        const res = await fetch("/api/users/me/tickets");
        if (res.ok) {
          const data = await res.json();
          setTickets(data);
        }
      } catch (_) {
        // tickets остаются []
      }
    })();
  }, []);

  return (
    <div className="w-full h-full bg-[var(--bg)] flex flex-col gap-4">
      {/* Верхняя карточка с именем / ролью */}
      <section className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-soft px-5 py-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-semibold">
          {getInitials(user.fullname || user.username)}
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-semibold text-[var(--text-main)]">
            {user.fullname || user.username}
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            {user.role || "Пользователь"}
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">
            В системе с {user.created_at}
          </div>
        </div>
      </section>

      {/* Нижняя сетка: слева инфа + аватар, справа мои тикеты */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full min-h-0">
        {/* Левая колонка */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          {/* Аватар */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-soft px-5 py-4 text-sm">
            <div className="text-xs font-semibold mb-2 text-[var(--text-main)]">
              Аватар
            </div>

            {user.avatar && (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-16 h-16 rounded-full mb-3 border border-[var(--border-subtle)] object-cover"
              />
            )}

            <label className="inline-flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 cursor-pointer">
              <span className="underline">Выбрать файл</span>
              <input type="file" className="hidden" onChange={(e) => handleAvatarChange(e, setUser)} />
            </label>

            <p className="mt-2 text-[11px] text-[var(--text-muted)]">
              Поддерживаются jpg, png. Аватар сохраняется на сервере.
            </p>
          </div>

          {/* Информация о пользователе */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-soft px-5 py-4 text-sm">
            <div className="text-xs font-semibold mb-2 text-[var(--text-main)]">
              Информация
            </div>

            <InfoRow label="Логин" value={user.username} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Роль" value={user.role} />
            <InfoRow label="ID" value={user.id} />
          </div>
        </div>

        {/* Правая колонка — мои тикеты */}
        <div className="lg:col-span-2 flex flex-col bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-soft px-5 py-4 min-h-0">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-[var(--text-main)]">
              Мои тикеты
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              Всего: {tickets.length}
            </div>
          </div>

          {tickets.length === 0 ? (
            <p className="text-xs text-[var(--text-muted)]">
              У тебя пока нет тикетов. Создай первый в разделе «Тикеты».
            </p>
          ) : (
            <div className="flex-1 overflow-y-auto min-h-0">
              <table className="w-full text-xs">
                <thead className="border-b border-[var(--border-subtle)] bg-slate-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-semibold">Тема</th>
                    <th className="text-left px-3 py-2 font-semibold">Категория</th>
                    <th className="text-left px-3 py-2 font-semibold">Дата</th>
                    <th className="text-right px-3 py-2 font-semibold">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr
                      key={t.id}
                      className="border-b border-[var(--border-subtle)] hover:bg-slate-50/70"
                    >
                      <td className="px-3 py-2 text-[var(--text-main)]">
                        #{t.id} — {t.title}
                      </td>
                      <td className="px-3 py-2 text-[var(--text-muted)]">
                        {t.category || t.department}
                      </td>
                      <td className="px-3 py-2 text-[var(--text-muted)]">
                        {t.created_at || t.createdAt}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <StatusBadge status={t.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

/* ===== helpers / мелкие компоненты ===== */

function getInitials(name = "") {
  const parts = name.trim().split(" ");
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";
  return (
    (parts[0][0] || "").toUpperCase() +
    (parts[parts.length - 1][0] || "").toUpperCase()
  );
}

async function handleAvatarChange(e, setUser) {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const res = await fetch("/api/users/me/avatar", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.avatar) {
        setUser((prev) => ({ ...prev, avatar: data.avatar }));
      }
    }
  } catch (err) {
    console.error("Ошибка загрузки аватара", err);
  }
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-1 text-xs">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="text-[var(--text-main)] font-medium truncate max-w-[55%] text-right">
        {value ?? "—"}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  let label = "Открыт";
  let dot = "bg-emerald-500";

  if (status === "in_progress") {
    label = "В работе";
    dot = "bg-amber-500";
  }
  if (status === "closed") {
    label = "Закрыт";
    dot = "bg-slate-400";
  }

  return (
    <span className="inline-flex items-center justify-end gap-1 px-2 py-1 rounded-full bg-slate-50 text-[10px] text-[var(--text-muted)]">
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
