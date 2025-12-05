// src/components/auth/ProfileSetupPage.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProfileSetupPage() {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.fullname || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [computerName, setComputerName] = useState(user?.computerName || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fioError = validateFullName(fullName);
  const deptError = validateDepartment(department);
  const compError = validateComputerName(computerName);

  const allValid = !fioError && !deptError && !compError;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!allValid || saving) return;

    try {
      setSaving(true);
      setError("");

      // ПОКА БЕЗ БЭКЕНДА: просто обновляем в контексте + localStorage
      updateUser({
        fullname: fullName.trim(),
        department: department.trim(),
        computerName: computerName.trim(),
      });

      // когда появится бэкенд:
      // await fetch("/api/users/me", { method: "PATCH", ... })
    } catch (err) {
      setError(err.message || "Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4">
      <div className="w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-soft px-6 py-6">
        <div className="mb-4">
          <div className="text-[11px] text-[var(--text-muted)] mb-1">
            Первый вход в Helpdesk
          </div>
          <h1 className="text-lg font-semibold">Заполни карточку сотрудника</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Эти данные будут подставляться во все тикеты и появятся в левом
            нижнем углу панели.
          </p>
        </div>

        {error && (
          <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs"
        >
          {/* ФИО */}
          <FieldBox
            label="ФИО"
            placeholder="Например: Заболоцкий Дуолан Спиридонович"
            value={fullName}
            onChange={setFullName}
            error={fioError}
          />

          {/* Имя компьютера */}
          <FieldBox
            label="Имя компьютера"
            placeholder="Например: A-SIT11"
            value={computerName}
            onChange={setComputerName}
            error={compError}
            hint="Формат: буква отдела, дефис, код ПК. Пример: A-SIT11"
          />

          {/* Отдел */}
          <FieldBox
            label="Отдел"
            placeholder="Например: IT Support, Бухгалтерия…"
            value={department}
            onChange={setDepartment}
            error={deptError}
          />

          <div className="md:col-span-2 text-[11px] text-[var(--text-muted)] mt-1">
            Все поля обязательны. Когда блок подсвечен зелёным с галочкой — всё
            ок. Только после этого станет доступна кнопка &laquo;Подтвердить&raquo;.
          </div>

          <div className="md:col-span-2 flex justify-end mt-2">
            <button
              type="submit"
              disabled={!allValid || saving}
              className={`h-9 px-4 rounded-xl text-xs font-semibold text-white transition-colors ${
                allValid && !saving
                  ? "bg-slate-900 hover:bg-slate-800"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              {saving ? "Сохраняем…" : "Подтвердить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ===== Валидация ===== */

function validateFullName(value) {
  if (!value.trim()) return "Обязательное поле";
  const parts = value.trim().split(/\s+/);
  if (parts.length < 2) return "Укажи минимум фамилию и имя";
  return "";
}

function validateDepartment(value) {
  if (!value.trim()) return "Обязательное поле";
  return "";
}

function validateComputerName(value) {
  if (!value.trim()) return "Обязательное поле";
  const pattern = /^[A-ZА-Я]-[A-ZА-Я0-9]{3,6}$/;
  if (!pattern.test(value.trim())) {
    return "Формат типа A-SIT11 (буква отдела, дефис, код ПК)";
  }
  return "";
}

function FieldBox({ label, value, onChange, placeholder, error, hint }) {
  const hasValue = Boolean(value);
  const ok = hasValue && !error;

  const borderColor = error
    ? "border-red-400 bg-red-50"
    : ok
    ? "border-emerald-400 bg-emerald-50"
    : "border-[var(--border-subtle)] bg-[var(--bg)]";

  const icon = error
    ? "✕"
    : ok
    ? "✓"
    : "";

  const iconColor = error
    ? "text-red-500"
    : ok
    ? "text-emerald-500"
    : "text-transparent";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium">{label}</label>

      <div className={`relative`}>
        <input
          className={`w-full rounded-xl border px-3 py-2 pr-8 text-xs outline-none transition-colors ${borderColor}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        {/* Иконка внутри input справа */}
        <span
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold ${iconColor}`}
        >
          {icon}
        </span>
      </div>

      {/* Ошибка */}
      {error && hasValue && (
        <div className="text-[10px] text-red-500">{error}</div>
      )}

      {/* Подсказка */}
      {!error && hint && (
        <div className="text-[10px] text-[var(--text-muted)]">{hint}</div>
      )}
    </div>
  );
}