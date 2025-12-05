import { useState } from "react";

export default function TicketList({
  tickets,
  selectedId,
  onSelect,
  onChangeStatus,
  onChangePriority,
  onDelete,
  variant = "full", // full | compact
}) {
  const [openPriorityId, setOpenPriorityId] = useState(null);
  const [openStatusId, setOpenStatusId] = useState(null);

  const isFull = variant === "full";

  function handlePriority(ticketId, priority) {
    onChangePriority?.(ticketId, priority);
    setOpenPriorityId(null);
  }

  function handleStatus(ticketId, status) {
    onChangeStatus?.(ticketId, status);
    setOpenStatusId(null);
  }

  return (
    <div className="h-full min-h-0 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-soft flex flex-col">
      {/* Шапка */}
      <div className="px-4 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Тикеты</h2>
          <p className="text-xs text-[var(--text-muted)]">список обращений</p>
        </div>
      </div>

      {/* Заголовки таблички */}
      {isFull && (
        <div className="px-4 py-2 border-b border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex gap-2">
          <div className="flex-[2]">Тема</div>
          <div className="flex-[1]">Отдел</div>
          <div className="flex-[1]">Имя</div>
          <div className="flex-[1]">Дата</div>
          <div className="flex-[1] text-right">Приоритет</div>
          <div className="flex-[1] text-right">Статус</div>
        </div>
      )}

      {/* Список тикетов */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {tickets.map((ticket) => {
          const isActive = ticket.id === selectedId;

          return (
            <div
              key={ticket.id}
              className={
                "relative border-b border-[var(--border-subtle)] " +
                (isActive ? "bg-[var(--bg)]" : "hover:bg-[var(--bg)]")
              }
            >
              <div className="px-4 py-3 flex items-center gap-2 text-sm">
                {/* Тема */}
                <button
                  onClick={() => onSelect(ticket.id)}
                  className="flex-[2] text-left"
                >
                  <div className="font-medium truncate">{ticket.title}</div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">
                    {ticket.department} • {ticket.createdAt}
                  </div>
                </button>

                {/* Отдел */}
                <div className="flex-[1] text-xs text-[var(--text-muted)] truncate">
                  {ticket.department}
                </div>

                {/* Имя (пока нет данных) */}
                <div className="flex-[1] text-xs text-[var(--text-muted)] truncate">
                  —
                </div>

                {/* Дата */}
                <div className="flex-[1] text-xs text-[var(--text-muted)] truncate">
                  {ticket.createdAt}
                </div>

                {/* Приоритет */}
                <div className="flex-[1] relative flex justify-end min-w-[80px]">
                  <button
                    onClick={() =>
                      setOpenPriorityId(
                        openPriorityId === ticket.id ? null : ticket.id
                      )
                    }
                  >
                    <PriorityBadge priority={ticket.priority} withCaret />
                  </button>

                  {openPriorityId === ticket.id && (
                    <Dropdown>
                      <DropdownItem onClick={() => handlePriority(ticket.id, "high")}>
                        <PriorityBadge priority="high" wide />
                      </DropdownItem>
                      <DropdownItem onClick={() => handlePriority(ticket.id, "medium")}>
                        <PriorityBadge priority="medium" wide />
                      </DropdownItem>
                      <DropdownItem onClick={() => handlePriority(ticket.id, "low")}>
                        <PriorityBadge priority="low" wide />
                      </DropdownItem>
                    </Dropdown>
                  )}
                </div>

                {/* Статус */}
                <div className="flex-[1] relative flex justify-end min-w-[80px]">
                  <button
                    onClick={() =>
                      setOpenStatusId(
                        openStatusId === ticket.id ? null : ticket.id
                      )
                    }
                  >
                    <StatusBadge status={ticket.status} withCaret />
                  </button>

                  {openStatusId === ticket.id && (
                    <Dropdown>
                      <DropdownItem onClick={() => handleStatus(ticket.id, "open")}>
                        <StatusBadge status="open" wide />
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => handleStatus(ticket.id, "in_progress")}
                      >
                        <StatusBadge status="in_progress" wide />
                      </DropdownItem>
                      <DropdownItem onClick={() => handleStatus(ticket.id, "closed")}>
                        <StatusBadge status="closed" wide />
                      </DropdownItem>
                    </Dropdown>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --- Dropdown components --- */

function Dropdown({ children }) {
  return (
    <div className="absolute top-8 right-0 z-30 w-40 rounded-2xl bg-white border border-[var(--border-subtle)] shadow-2xl py-2 flex flex-col gap-1 backdrop-blur-xl">
      {children}
    </div>
  );
}

function DropdownItem({ children, onClick }) {
  return (
    <button
      className="w-full text-left px-2 py-1 hover:bg-slate-100 rounded-lg transition"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/* --- Badges --- */

function PriorityBadge({ priority, withCaret = false, wide = false }) {
  let label = "СРЕДНИЙ";
  let classes = "bg-slate-100 text-slate-700";

  if (priority === "high") {
    label = "ВЫСОКИЙ";
    classes = "bg-red-100 text-red-700";
  }
  if (priority === "low") {
    label = "НИЗКИЙ";
    classes = "bg-emerald-100 text-emerald-700";
  }

  return (
    <span
      className={
        "inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide " +
        classes +
        (wide ? " w-full" : "")
      }
    >
      {label}
      {withCaret && <span className="text-[8px] opacity-60">▼</span>}
    </span>
  );
}

function StatusBadge({ status, withCaret = false, wide = false }) {
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
    <span
      className={
        "inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-[10px] font-medium bg-slate-50 text-[var(--text-muted)] " +
        (wide ? " w-full" : "")
      }
    >
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
      {withCaret && <span className="text-[8px] opacity-60">▼</span>}
    </span>
  );
}
