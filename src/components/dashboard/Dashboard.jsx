// src/components/dashboard/Dashboard.jsx
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const trendData = [
  { day: "Пн", count: 4 },
  { day: "Вт", count: 6 },
  { day: "Ср", count: 5 },
  { day: "Чт", count: 7 },
  { day: "Пт", count: 6 },
  { day: "Сб", count: 3 },
  { day: "Вс", count: 2 },
];

export default function Dashboard({ tickets }) {
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const closed = tickets.filter((t) => t.status === "closed").length;

  // данные для пончика – уже из реальных статусов
  const statusData = [
    { name: "Открытые", value: open, color: "#10b981" },
    { name: "В работе", value: inProgress, color: "#fbbf24" },
    { name: "Закрытые", value: closed, color: "#9ca3af" },
  ];

  // Самый загруженный отдел (по количеству тикетов)
  const deptCounts = tickets.reduce((acc, t) => {
    const key = t.department || "Без отдела";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const topDepartment =
    Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0] || null;

  return (
    <div className="h-full bg-[var(--bg)] rounded-2xl">
      {/* верхние карточки-статистики */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <StatCard label="Всего тикетов" value={total} />
        <StatCard label="Открытые" value={open} dotClass="bg-emerald-500" />
        <StatCard
          label="В работе"
          value={inProgress}
          dotClass="bg-amber-500"
        />
        <StatCard label="Закрытые" value={closed} dotClass="bg-slate-400" />
      </div>

      {/* низ: линия + пончик, компактный блок */}
      <div className="flex gap-4 h-[260px]">
        {/* линия — низкий, вытянутый график */}
        <div className="flex-1 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] px-4 py-3 flex flex-col">
          <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1">
            Динамика обращений (фейковая заглушка)
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mb-2">
            Потом сюда подкинем реальные данные c бэка.
          </div>
          <div className="flex-1 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ left: 0, right: 0, top: 5 }}
              >
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6b7280"
                  fill="#e5e7eb"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* пончик — аккуратный круг справа */}
        <div className="w-80 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)] px-4 py-3 flex flex-col items-center">
          <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1 self-start">
            Распределение по статусам
          </div>
          <div className="flex-1 flex items-center justify-center w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ fontSize: 10 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1 text-center">
            {total} тикетов всего
            {topDepartment && (
              <>
                <br />
                Самый частый отдел:{" "}
                <span className="font-semibold">{topDepartment[0]}</span> (
                {topDepartment[1]})
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, dotClass }) {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl px-4 py-3 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-[var(--text-muted)]">{label}</span>
        {dotClass && (
          <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
        )}
      </div>
      <div className="text-xl font-semibold leading-none">{value}</div>
    </div>
  );
}
