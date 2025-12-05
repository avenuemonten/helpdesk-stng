// src/components/admin/AdminUsers.jsx
import React, { useState } from "react";

const initialUsers = [
  {
    id: 1,
    name: "Иван Петров",
    department: "Бухгалтерия",
    computerName: "A-BUHG01",
  },
  {
    id: 2,
    name: "Светлана Иванова",
    department: "Отдел кадров",
    computerName: "A-HR03",
  },
  {
    id: 3,
    name: "Заболоцкий Д. С.",
    department: "IT Support",
    computerName: "A-SIT11",
  },
];

export default function AdminUsers({ tickets }) {
  const [users, setUsers] = useState(initialUsers);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ name: "", department: "", computerName: "" });

  const startEdit = (user) => {
    setEditingId(user.id);
    setDraft(user);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({ name: "", department: "", computerName: "" });
  };

  const saveEdit = () => {
    setUsers((prev) =>
      prev.map((u) => (u.id === editingId ? { ...u, ...draft } : u))
    );
    cancelEdit();
  };

  const deleteUser = (id) => {
    if (!window.confirm("Удалить пользователя?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="h-full w-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-soft flex flex-col overflow-hidden">
      <div className="px-5 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div className="text-xs text-[var(--text-muted)]">
          Управление пользователями. Позже сюда подтянем данные из AD.
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-[var(--border-subtle)]">
            <tr>
              <th className="text-left px-5 py-2 font-semibold">Имя</th>
              <th className="text-left px-3 py-2 font-semibold">Отдел</th>
              <th className="text-left px-3 py-2 font-semibold">
                Имя компьютера
              </th>
              <th className="text-right px-5 py-2 font-semibold">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) =>
              editingId === u.id ? (
                <tr key={u.id} className="border-b border-[var(--border-subtle)]">
                  <td className="px-5 py-2">
                    <input
                      className="w-full text-xs border border-[var(--border-subtle)] rounded-lg px-2 py-1"
                      value={draft.name}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, name: e.target.value }))
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="w-full text-xs border border-[var(--border-subtle)] rounded-lg px-2 py-1"
                      value={draft.department}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, department: e.target.value }))
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      className="w-full text-xs border border-[var(--border-subtle)] rounded-lg px-2 py-1"
                      value={draft.computerName}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, computerName: e.target.value }))
                      }
                    />
                  </td>
                  <td className="px-5 py-2 text-right space-x-2">
                    <button
                      onClick={saveEdit}
                      className="text-[10px] px-2 py-1 rounded-full bg-slate-900 text-white hover:bg-slate-800"
                    >
                      Сохранить
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="text-[10px] px-2 py-1 rounded-full border border-[var(--border-subtle)] hover:bg-slate-50"
                    >
                      Отмена
                    </button>
                  </td>
                </tr>
              ) : (
                <tr
                  key={u.id}
                  className="border-b border-[var(--border-subtle)] hover:bg-slate-50/50"
                >
                  <td className="px-5 py-2">{u.name}</td>
                  <td className="px-3 py-2 text-[var(--text-muted)]">
                    {u.department}
                  </td>
                  <td className="px-3 py-2 font-mono text-[11px]">
                    {u.computerName}
                  </td>
                  <td className="px-5 py-2 text-right space-x-3">
                    <button
                      onClick={() => startEdit(u)}
                      className="text-[10px] text-slate-600 hover:text-slate-900"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="text-[10px] text-red-500 hover:text-red-600"
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
