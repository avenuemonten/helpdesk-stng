// src/components/auth/ProfileSetupPage.jsx
import { useState, useMemo, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

const DEPARTMENTS = ["АУП", "СМУ", "УГРС", "ЛПУМП", "УСД", "УДТГ"];

export default function ProfileSetupPage() {
  const { user, saveProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullname || "");
  const [computerName, setComputerName] = useState(user?.computerName || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [deptOpen, setDeptOpen] = useState(false);

  const dropdownRef = useRef(null);

  // закрываем дропдаун при клике вне
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDeptOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // простая валидация
  const isFullNameValid = useMemo(
    () => fullName.trim().length >= 3,
    [fullName]
  );

  const isComputerNameValid = useMemo(
    () => /^[A-ZА-Я]-[A-ZА-Я0-9]{3,}$/i.test(computerName.trim()),
    [computerName]
  );

  const isDepartmentValid = useMemo(
    () => department.trim().length > 0,
    [department]
  );

  const allValid = isFullNameValid && isComputerNameValid && isDepartmentValid;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!allValid || saving) return;

    try {
      setSaving(true);
      setError("");

      await saveProfile({
        fullname: fullName.trim(),
        department: department.trim(),
        computerName: computerName.trim(),
      });
      // После успешного saveProfile нас уже пустит в основную панель
    } catch (err) {
      setError(err.message || "Ошибка при сохранении данных");
    } finally {
      setSaving(false);
    }
  }

  const inputBase =
    "w-full rounded-full border px-4 py-3 text-sm outline-none transition-colors bg-white";

  function statusClasses(valid, value) {
    if (!value) return "border-[#e4e7ee]";
    return valid ? "border-emerald-500" : "border-rose-400";
  }

  function statusIcon(valid, value) {
    if (!value) return null;
    if (valid) {
      return (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500 text-lg">
          ✓
        </span>
      );
    }
    return (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500 text-lg">
        ✕
      </span>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fb]">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] px-10 py-8">
        <div className="text-xs text-slate-400 mb-2">Первый вход в Helpdesk</div>
        <h1 className="text-xl font-semibold text-slate-900 mb-1">
          Заполни карточку сотрудника
        </h1>
        <p className="text-xs text-slate-500 mb-6">
          Эти данные будут подставляться во все тикеты и появятся в левом нижнем
          углу панели.
        </p>

        {error && (
          <div className="mb-4 rounded-2xl bg-rose-50 px-4 py-3 text-xs text-rose-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ФИО */}
            <div>
              <label className="block mb-1 text-xs font-medium text-slate-600">
                ФИО
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Например: Заболоцкий Дуолан Спиридонович"
                  className={`${inputBase} ${statusClasses(
                    isFullNameValid,
                    fullName
                  )}`}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                {statusIcon(isFullNameValid, fullName)}
              </div>
            </div>

            {/* Имя компьютера */}
            <div>
              <label className="block mb-1 text-xs font-medium text-slate-600">
                Имя компьютера
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Например: A-SIT11"
                  className={`${inputBase} ${statusClasses(
                    isComputerNameValid,
                    computerName
                  )}`}
                  value={computerName}
                  onChange={(e) =>
                    setComputerName(e.target.value.toUpperCase())
                  }
                />
                {statusIcon(isComputerNameValid, computerName)}
              </div>
              <p className="mt-1 text-[10px] text-slate-400">
                Формат: буква отдела, дефис, код ПК. Пример: A-SIT11
              </p>
            </div>
          </div>

          {/* Отдел — кастомный дропдаун БЕЗ галочки/крестика */}
          <div>
            <label className="block mb-1 text-xs font-medium text-slate-600">
              Отдел
            </label>
            <div ref={dropdownRef} className="relative inline-block w-full md:w-64">
              <button
                type="button"
                onClick={() => setDeptOpen((v) => !v)}
                className={`${inputBase} flex items-center justify-between ${statusClasses(
                  isDepartmentValid,
                  department
                )}`}
              >
                <span
                  className={
                    department ? "text-slate-900" : "text-slate-400 text-sm"
                  }
                >
                  {department || "Выберите отдел"}
                </span>
                {/* Только аккуратная стрелка */}
                <span
                  className={`ml-2 text-[10px] text-slate-400 transition-transform ${
                    deptOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {deptOpen && (
                <div className="absolute z-20 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.14)] overflow-hidden text-sm">
                  <div className="px-4 py-2 text-[11px] text-slate-400 border-b border-slate-100">
                    — Выберите отдел —
                  </div>
                  {DEPARTMENTS.map((dep) => (
                    <button
                      type="button"
                      key={dep}
                      className={`w-full text-left px-4 py-2 hover:bg-slate-50 ${
                        dep === department ? "bg-slate-50 font-medium" : ""
                      }`}
                      onClick={() => {
                        setDepartment(dep);
                        setDeptOpen(false);
                      }}
                    >
                      {dep}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-400">
            Все поля обязательны. Когда блок подсвечен зелёным с галочкой — всё
            ок. Только после этого станет доступна кнопка «Подтвердить».
          </p>

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={!allValid || saving}
              className={`rounded-full px-7 py-2 text-sm font-medium text-white transition-colors
                ${
                  allValid && !saving
                    ? "bg-slate-900 hover:bg-slate-800"
                    : "bg-slate-300 cursor-not-allowed"
                }`}
            >
              {saving ? "Сохраняю..." : "Подтвердить"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
