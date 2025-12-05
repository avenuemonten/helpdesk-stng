// src/components/auth/LoginPage.jsx
import { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

// Кастомный дропдаун для подразделений
function DropdownField({ label, value, onChange }) {
  const options = ["АУП", "СМУ", "УГРС", "ЛПУМП", "УСД", "УДТГ"];
  const [open, setOpen] = useState(false);

  const hasValue = Boolean(value);
  const error = !hasValue ? "Обязательное поле" : "";

  const border =
    error && hasValue === false
      ? "border-red-400 bg-red-50"
      : hasValue
      ? "border-emerald-400 bg-emerald-50"
      : "border-[var(--border-subtle)] bg-[var(--bg)]";

  return (
    <div className="relative text-xs">
      <label className="block mb-1 font-medium">{label}</label>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full rounded-xl px-3 py-2 flex justify-between items-center border ${border}`}
      >
        <span className={hasValue ? "text-[var(--text-main)]" : "text-[var(--text-muted)]"}>
          {hasValue ? value : "Выберите подразделение"}
        </span>
        <span className="opacity-60">▾</span>
      </button>

      {open && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[var(--border-subtle)] rounded-xl shadow-lg max-h-44 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 hover:bg-slate-100 text-xs"
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {!hasValue && (
        <p className="text-[10px] text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [subdivision, setSubdivision] = useState(""); // значение из дропдауна
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = username && password && subdivision && !loading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    try {
      setLoading(true);
      setError("");
      await login(username.trim(), password, subdivision.trim());
    } catch (err) {
      setError(err.message || "Ошибка авторизации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
      <div className="w-full max-w-md bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-soft px-6 py-6">
        <div className="mb-4">
          <div className="text-[11px] text-[var(--text-muted)] mb-1">
            СТНГ / Helpdesk
          </div>
          <h1 className="text-xl font-semibold">Вход в систему</h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Используйте свои доменные учётные данные.
          </p>
        </div>

        {error && (
          <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Логин */}
          <div>
            <label className="block mb-1 font-medium">
              Логин (как в Windows)
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg)] px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </div>

          {/* Пароль */}
          <div>
            <label className="block mb-1 font-medium">Пароль</label>
            <input
              type="password"
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg)] px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {/* Подразделение — кастомный дропдаун */}
          <DropdownField
            label="Подразделение"
            value={subdivision}
            onChange={setSubdivision}
          />

          <button
            type="submit"
            disabled={!canSubmit}
            className={`w-full mt-1 h-9 rounded-xl text-xs font-semibold text-white transition-colors ${
              canSubmit
                ? "bg-slate-900 hover:bg-slate-800"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            {loading ? "Входим…" : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
