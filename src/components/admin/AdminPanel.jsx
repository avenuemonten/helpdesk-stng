// src/components/admin/AdminPanel.jsx
import React, { useState } from "react";

export default function AdminPanel({
  categories,
  tickets,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddCategory(name, description);
    setName("");
    setDescription("");
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(category.description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const saveEdit = () => {
    if (!editName.trim()) return;
    onUpdateCategory(editingId, editName, editDescription);
    cancelEdit();
  };

  const handleDelete = (id) => {
    if (window.confirm("Удалить категорию? Существующие тикеты останутся.")) {
      onDeleteCategory(id);
    }
  };

  const getCountForCategory = (catName) =>
    tickets.filter((t) => t.department === catName).length;

  return (
    <div className="w-full h-full bg-[var(--bg)] flex flex-col gap-4">
      {/* Карточка добавления категории */}
      <section className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-soft p-4">
        <h2 className="text-sm font-semibold mb-1">Категории тикетов</h2>
        <p className="text-xs text-[var(--text-muted)] mb-3">
          Здесь администратор задаёт список категорий, которые будут доступны
          пользователям при создании тикета.
        </p>

        <form
          onSubmit={handleCreate}
          className="flex flex-col md:flex-row gap-3 items-stretch md:items-end"
        >
          <div className="flex-1">
            <label className="block text-[11px] font-medium mb-1">
              Название категории
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg)] px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Например: 1С и бухгалтерия"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex-[2]">
            <label className="block text-[11px] font-medium mb-1">
              Описание (необязательно)
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg)] px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Коротко, для чего эта категория"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="md:w-auto w-full h-10 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Добавить
          </button>
        </form>
      </section>

      {/* Таблица категорий */}
      <section className="flex-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-soft p-4 overflow-hidden flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Текущие категории</h3>
          <span className="text-[11px] text-[var(--text-muted)]">
            Всего: {categories.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg)]">
          {categories.length === 0 ? (
            <div className="px-4 py-6 text-xs text-[var(--text-muted)]">
              Пока нет ни одной категории. Добавьте первую сверху.
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead className="text-[11px] text-[var(--text-muted)] border-b border-[var(--border-subtle)] bg-[var(--bg-card)]">
                <tr>
                  <th className="text-left px-4 py-2 w-[30%]">Название</th>
                  <th className="text-left px-4 py-2 w-[45%]">Описание</th>
                  <th className="text-left px-4 py-2 w-[10%]">Тикеты</th>
                  <th className="text-right px-4 py-2 w-[15%]">Действия</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => {
                  const isEditing = editingId === cat.id;
                  const ticketsCount = getCountForCategory(cat.name);

                  if (isEditing) {
                    return (
                      <tr
                        key={cat.id}
                        className="border-b border-[var(--border-subtle)] bg-[var(--bg-card)]/80"
                      >
                        <td className="px-4 py-2 align-top">
                          <input
                            type="text"
                            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg)] px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-slate-900"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-2 align-top">
                          <input
                            type="text"
                            className="w-full rounded-lg border border-[var(--border-subtle)] bg-[var(--bg)] px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-slate-900"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                          />
                        </td>
                        <td className="px-4 py-2 align-top text-[11px] text-[var(--text-muted)]">
                          {ticketsCount}
                        </td>
                        <td className="px-4 py-2 align-top">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={saveEdit}
                              className="px-2 py-1 rounded-lg bg-slate-900 text-white text-[10px] hover:bg-slate-800"
                            >
                              Сохранить
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-2 py-1 rounded-lg border border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)] hover:bg-[var(--bg-card)]"
                            >
                              Отмена
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={cat.id}
                      className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-card)]/60"
                    >
                      <td className="px-4 py-2 align-top">
                        <div className="font-medium text-[13px]">
                          {cat.name}
                        </div>
                      </td>
                      <td className="px-4 py-2 align-top">
                        <div className="text-[11px] text-[var(--text-muted)]">
                          {cat.description || (
                            <span className="italic text-[var(--text-muted)]/70">
                              Описание не задано
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 align-top text-[11px] text-[var(--text-muted)]">
                        {ticketsCount}
                      </td>
                      <td className="px-4 py-2 align-top">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(cat)}
                            className="px-2 py-1 rounded-lg border border-[var(--border-subtle)] text-[10px] hover:bg-[var(--bg-card)]"
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="px-2 py-1 rounded-lg text-[10px] text-red-500 hover:bg-red-50"
                          >
                            Удалить
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}