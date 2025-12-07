// src/components/tickets/TicketDetail.jsx
import React, { useState, useEffect, useRef } from "react";

/**
 * Приводим ticket.messages к единому виду для чата
 */
function mapMessagesFromTicket(ticket) {
  if (!ticket?.messages || !ticket.messages.length) return null;

  return ticket.messages.map((m, index) => {
    const authorType = m.authorType || (m.isAgent ? "support" : "user");

    const isAgent =
      typeof m.isAgent === "boolean"
        ? m.isAgent
        : authorType === "support";

    const authorName =
      m.authorName ||
      m.author ||
      (authorType === "user" ? "Пользователь" : "IT Support");

    const role =
      m.role ||
      (authorType === "user" ? "Пользователь" : "IT Support");

    return {
      id: m.id ?? index + 1,
      author: authorName,
      role,
      time: m.time || m.createdAt || "",
      text: m.text || m.comment || "",
      isAgent,
    };
  });
}

export default function TicketDetail({
  ticket,
  onClose,
  onChangeStatus,
  onChangePriority,
  onDelete,
  // кто сейчас смотрит этот тикет: 'user' | 'support' | 'admin'
  viewerRole = "support",
}) {
  if (!ticket) {
    return (
      <div className="h-full min-h-0 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-soft flex items-center justify-center text-xs text-[var(--text-muted)]">
        Выберите тикет слева, чтобы посмотреть детали и чат.
      </div>
    );
  }

  /* ==== DEMO сообщения (если нет данных из тикета) ==== */
  const demoMessages = [
    {
      id: 1,
      author: "Иван Петров",
      role: "Пользователь",
      time: "10:25",
      text: "Добрый день! 1С не открывается, сразу ошибка.",
      isAgent: false,
    },
    {
      id: 2,
      author: "Заболоцкий Д. С.",
      role: "IT Support",
      time: "10:27",
      text: "Здравствуйте! Сейчас подключусь и посмотрю, что происходит.",
      isAgent: true,
    },
    {
      id: 3,
      author: "Заболоцкий Д. С.",
      role: "IT Support",
      time: "10:41",
      text: "Проверьте, пожалуйста, ещё раз. Обновил настройки доступа.",
      isAgent: true,
    },
  ];

  const mappedFromTicket = mapMessagesFromTicket(ticket);
  const [messages, setMessages] = useState(
    mappedFromTicket || demoMessages
  );
  const bottomRef = useRef(null);

  // при смене тикета подтягиваем его сообщения
  useEffect(() => {
    const mapped = mapMessagesFromTicket(ticket);
    setMessages(mapped || demoMessages);
  }, [ticket]);

  /* Автоскролл вниз */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCloseTicket = () => {
    if (!onChangeStatus) return;
    onChangeStatus(ticket.id, "closed");
  };

  const handleDelete = () => {
    if (!onDelete) return;
    if (window.confirm("Удалить этот тикет безвозвратно?")) {
      onDelete(ticket.id);
    }
  };

  // support/admin пишут как "агент", user — как "пользователь"
  const isAgentSide = viewerRole === "support" || viewerRole === "admin";

  const handleSendMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const now = new Date();
    const time = now.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: isAgentSide ? "Заболоцкий Д. С." : "Пользователь",
        role: isAgentSide ? "IT Support" : "Пользователь",
        time,
        text: trimmed,
        isAgent: isAgentSide,
      },
    ]);
  };

  return (
    <div className="h-full bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl shadow-soft flex flex-col min-h-0">
      {/* ==== HEADER ==== */}
      <div className="px-5 py-3 border-b border-[var(--border-subtle)] flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[11px] text-[var(--text-muted)] mb-1">
            Детали тикета #{ticket.id}
          </div>
          <h2 className="text-sm font-semibold truncate">{ticket.title}</h2>
          <div className="text-[11px] text-[var(--text-muted)] truncate">
            {ticket.department} • {ticket.createdAt}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />

          {/* Пользователь НЕ может закрывать тикет — кнопка есть только если есть onChangeStatus */}
          {onChangeStatus && ticket.status !== "closed" ? (
            <button
              onClick={handleCloseTicket}
              className="text-[11px] px-3 py-1 rounded-full border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
            >
              Закрыть тикет
            </button>
          ) : ticket.status === "closed" ? (
            <span className="text-[10px] px-3 py-1 rounded-full border border-slate-200 text-[var(--text-muted)] bg-slate-50">
              Тикет закрыт
            </span>
          ) : null}

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* ==== ОПИСАНИЕ ==== */}
      <div className="px-5 py-3 border-b border-[var(--border-subtle)] text-xs">
        <div className="text-[11px] font-semibold mb-1 text-[var(--text-muted)]">
          Описание
        </div>
        <div className="text-[var(--text)] leading-relaxed">
          {ticket.description || "Описание отсутствует."}
        </div>
      </div>

      {/* ==== ИМЯ КОМПЬЮТЕРА ==== */}
      <div className="px-5 py-3 border-b border-[var(--border-subtle)] text-xs">
        <div className="text-[11px] font-semibold mb-1 text-[var(--text-muted)]">
          Имя компьютера
        </div>
        <div className="text-[var(--text)] leading-relaxed font-medium">
          {ticket.computerName || "Не указано"}
        </div>
      </div>

      {/* ==== ЧАТ ==== */}
      <div className="flex-1 px-5 py-3 flex flex-col min-h-0">
        <div className="text-[11px] font-semibold mb-2 text-[var(--text-muted)]">
          Чат по тикету
        </div>

        <div className="flex-1 bg-[var(--bg)] rounded-2xl border border-[var(--border-subtle)] flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 chat-scroll">
  {messages.map((msg) => (
    <ChatMessage
      key={msg.id}
      message={msg}
      viewerRole={viewerRole}
    />
  ))}
  <div ref={bottomRef} />
</div>
          <ChatComposer onSend={handleSendMessage} />
        </div>
      </div>

      {/* ==== УДАЛЕНИЕ ==== */}
      <div className="px-5 pb-3 pt-1 flex justify-end">
        {onDelete && (
          <button
            onClick={handleDelete}
            className="text-[11px] text-red-500 hover:text-red-600"
          >
            Удалить тикет
          </button>
        )}
      </div>
    </div>
  );
}

/* ==== Сообщение ==== */
function ChatMessage({ message, viewerRole = "support" }) {
  const { author, role, time, text, isAgent } = message;

  const isUserView = viewerRole === "user";
  // кто “я” в этом режиме
  const isMine = isUserView ? !isAgent : isAgent;

  // сообщение собеседника (слева)
  if (!isMine) {
    return (
      <div className="flex items-start gap-3 max-w-[70%]">
        <Avatar name={author} accent="user" />
        <div className="flex flex-col gap-1">
          <div className="text-[10px] text-[var(--text-muted)]">
            <span className="font-semibold">{author}</span> • {role} •{" "}
            {time}
          </div>
          <div className="bg-white rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-soft">
            {text}
          </div>
        </div>
      </div>
    );
  }

  // мои сообщения (справа)
  return (
    <div className="flex items-start gap-3 justify-end max-w-[70%] ml-auto">
      <div className="flex flex-col gap-1 items-end">
        <div className="text-[10px] text-[var(--text-muted)] text-right">
          <span className="font-semibold">{author}</span> • {role} •{" "}
          {time}
        </div>
        <div className="bg-slate-900 text-white rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-soft max-w-full">
          {text}
        </div>
      </div>
      <Avatar name={author} accent="agent" />
    </div>
  );
}

/* ==== Аватар ==== */
function Avatar({ name, accent = "user" }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const bg =
    accent === "agent"
      ? "bg-slate-900 text-white"
      : "bg-indigo-500 text-white";

  return (
    <div
      className={
        "w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shadow-soft shrink-0 " +
        bg
      }
    >
      {initials}
    </div>
  );
}

/* ==== Composer ==== */
function ChatComposer({ onSend }) {
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="border-t border-[var(--border-subtle)] px-3 py-3">
      <div className="flex items-center gap-3 bg-white rounded-full border border-[var(--border-subtle)] px-3 py-2 shadow-soft">
        <button className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-slate-50 transition-colors shrink-0">
          📎
        </button>

        <textarea
          rows={1}
          className="flex-1 resize-none border-none outline-none bg-transparent text-xs leading-relaxed placeholder:text-[var(--text-muted)]"
          placeholder="Напишите сообщение…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={send}
          className="h-8 px-4 rounded-full bg-slate-900 text-white text-[11px] font-semibold hover:bg-slate-800 transition-colors shrink-0"
        >
          Отправить
        </button>
      </div>

      <div className="mt-1 text-[9px] text-[var(--text-muted)]">
        Enter — отправить, Shift+Enter — новая строка
      </div>
    </div>
  );
}

/* ==== Badge Status ==== */
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
    <span className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-full text-[10px] font-medium bg-slate-50 text-[var(--text-muted)]">
      <span className={"w-2 h-2 rounded-full " + dot} />
      <span>{label}</span>
    </span>
  );
}

/* ==== Badge Priority ==== */
function PriorityBadge({ priority }) {
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
        "inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide " +
        classes
      }
    >
      {label}
    </span>
  );
}
