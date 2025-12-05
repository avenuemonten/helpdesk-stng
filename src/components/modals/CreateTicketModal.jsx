// src/components/modals/CreateTicketModal.jsx
import React, { useState, useEffect } from "react";

export default function CreateTicketModal({
  open,
  onClose,
  onSubmit,
  categories = [],
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [computerName, setComputerName] = useState("");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");

  // при открытии модалки подставляем первую категорию по умолчанию
  useEffect(() => {
    if (open && categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [open, categories, category]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit?.({
      title: title.trim(),
      category: category || "",
      computerName: computerName.trim(),
      priority,
      description: description.trim(),
    });

    setTitle("");
    setDescription("");
    setComputerName("");
    setPriority("medium");
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-soft p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold">Создать тикет</h2>
            <p className="text-xs text-[var(--text-muted)]">
              Опишите проблему, мы поможем как можно быстрее.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg)] transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Тема */}
          <div>
            <label className="block text-[11px] font-medium mb-1">
              Тема обращения
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg)] px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Например: Не открывается 1С"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Категория */}
          <div>
            <label className="block text-[11px] font-medium mb-1">
              Категория
            </label>
            <select
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg)] px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-slate-900"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.length === 0 && (
                <option value="">Категории ещё не заданы</option>
              )}
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Имя компьютера */}
          <div>
            <label className="block text-[11px] font-medium mb-1">
              Имя компьютера / устройства
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg)] px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Например: A-SIT11, U-VEGU18"
              value={computerName}
              onChange={(e) => setComputerName(e.target.value)}
            />
          </div>

          {/* Приоритет */}
          <div>
            <label className="block text-[11px] font-medium mb-1">
              Приоритет
            </label>
            <div className="flex gap-2">
              <PriorityPill
                label="Низкий"
                value="low"
                active={priority === "low"}
                onClick={setPriority}
              />
              <PriorityPill
                label="Средний"
                value="medium"
                active={priority === "medium"}
                onClick={setPriority}
              />
              <PriorityPill
                label="Высокий"
                value="high"
                active={priority === "high"}
                onClick={setPriority}
              />
            </div>
          </div>

          {/* Комментарий */}
          <div>
            <label className="block text-[11px] font-medium mb-1">
              Комментарий
            </label>
            <textarea
              rows={4}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg)] px-3 py-2 text-xs outline-none resize-none focus:ring-2 focus:ring-slate-900"
              placeholder="Кратко опишите проблему, ошибки, что уже пробовали сделать…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Кнопки */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] hover:bg-[var(--bg)]"
            >
              Отменить
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-semibold hover:bg-slate-800"
            >
              Создать тикет
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PriorityPill({ label, value, active, onClick }) {
  const base =
    "px-3 py-1.5 rounded-full text-[11px] border text-xs cursor-pointer transition-colors";

  const activeCls = "bg-slate-900 text-white border-slate-900";
  const inactiveCls =
    "bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:bg-[var(--bg-card)]";

  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={base + " " + (active ? activeCls : inactiveCls)}
    >
      {label}
    </button>
  );
}
