// src/components/modals/CreateTicketModal.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function CreateTicketModal({
  open,
  onClose,
  onSubmit,
  categories,
}) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]?.name || "");
  const [computerName, setComputerName] = useState("");
  const [priority, setPriority] = useState("medium"); // low | medium | high
  const [comment, setComment] = useState("");

  // подхватываем имя ПК из профиля
  useEffect(() => {
    if (user?.computerName) {
      setComputerName(user.computerName);
    }
  }, [user]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !category || !computerName.trim()) {
      // TODO: потом можно сделать toast/ошибку
      return;
    }

    onSubmit({
      title: title.trim(),
      category,
      computerName: computerName.trim(),
      priority,
      comment: comment.trim(),
    });

    // очистим форму
    setTitle("");
    setCategory(categories[0]?.name || "");
    setPriority("medium");
    setComment("");
  }

  const priorityOptions = [
    { id: "low", label: "Низкий" },
    { id: "medium", label: "Средний" },
    { id: "high", label: "Высокий" },
  ];

  function priorityButtonClasses(id) {
    const base =
      "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors";

    if (id === priority) {
      if (id === "low") {
        return `${base} bg-emerald-100 text-emerald-700 border-emerald-200`;
      }
      if (id === "medium") {
        return `${base} bg-sky-100 text-sky-700 border-sky-200`;
      }
      // high
      return `${base} bg-rose-100 text-rose-700 border-rose-200`;
    }

    return `${base} bg-white text-[var(--text-muted)] border-[var(--border-subtle)] hover:bg-slate-50`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-xl rounded-3xl bg-white shadow-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Создать тикет
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Опишите проблему, мы поможем как можно быстрее.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Тема */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Тема обращения
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Не открывается 1С"
              className="w-full rounded-2xl border border-[var(--border-subtle)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          {/* Категория */}
          <div>
            <label className="block text-xs font-medium mb-1">Категория</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-2xl border border-[var(--border-subtle)] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Имя компьютера / устройства (read-only) */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Имя компьютера / устройства
            </label>
            <input
              type="text"
              value={computerName}
              readOnly
              placeholder="Например: A-SIT11, U-VEGU18"
              className="w-full rounded-2xl border border-[var(--border-subtle)] px-3 py-2 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <p className="mt-1 text-[10px] text-[var(--text-muted)]">
              Берётся из заполненной карточки сотрудника.
            </p>
          </div>

          {/* Приоритет */}
          <div>
            <label className="block text-xs font-medium mb-1">Приоритет</label>
            <div className="flex gap-2">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={priorityButtonClasses(opt.id)}
                  onClick={() => setPriority(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Комментарий -> первое сообщение в чате */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Комментарий
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Кратко опишите проблему, ошибки, что уже пробовали сделать..."
              rows={4}
              className="w-full rounded-2xl border border-[var(--border-subtle)] px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-2xl text-xs border border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-slate-50"
            >
              Отменить
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-2xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
            >
              Создать тикет
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
