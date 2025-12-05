// src/components/layout/MainLayout.jsx
import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import TicketList from "../tickets/TicketList.jsx";
import TicketDetail from "../tickets/TicketDetail.jsx";
import CreateTicketModal from "../modals/CreateTicketModal.jsx";
import AdminPanel from "../admin/AdminPanel.jsx";
import AdminUsers from "../admin/AdminUsers.jsx";
import Dashboard from "../dashboard/Dashboard.jsx"; // твой жирный дашборд

// Стартовые тикеты
const initialTickets = [
  {
    id: 1,
    title: "Не открывается 1С",
    department: "1С и бухгалтерия",
    status: "open",
    priority: "high",
    createdAt: "Сегодня, 10:24",
    description: "При запуске 1С возникает ошибка, программа закрывается.",
    computerName: "A-SIT11",
  },
  {
    id: 2,
    title: "Проблема с VPN",
    department: "VPN / удалённый доступ",
    status: "in_progress",
    priority: "medium",
    createdAt: "Вчера, 18:02",
    description: "Не получается подключиться к корпоративному VPN из дома.",
    computerName: "U-VEGU18",
  },
];

// Стартовые категории
const initialCategories = [
  {
    id: 1,
    name: "1С и бухгалтерия",
    description: "Ошибки 1С, доступ к базам, отчёты, документы.",
  },
  {
    id: 2,
    name: "VPN / удалённый доступ",
    description: "Подключение из дома, с ноутбуков и телефонов.",
  },
  {
    id: 3,
    name: "Компьютеры и ноутбуки",
    description: "Не включается, тормозит, синий экран, периферия.",
  },
  {
    id: 4,
    name: "Печать и сканирование",
    description: "Принтеры, МФУ, сканы, очередь печати.",
  },
];

export default function MainLayout() {
  const isAdmin = true; // потом возьмём из auth / роли

  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // "dashboard" | "tickets" | "users" | "admin"
  const [activeSection, setActiveSection] = useState("dashboard");

  const [categories, setCategories] = useState(initialCategories);

  const selectedTicket =
    tickets.find((t) => t.id === selectedTicketId) || null;
  const hasSelection = !!selectedTicket;

  // ====== TICKETS ======

  function handleSelectTicket(id) {
    setSelectedTicketId(id);
  }

  function handleCreateTicket(data) {
    const nextId = tickets.length
      ? Math.max(...tickets.map((t) => t.id)) + 1
      : 1;

    const newTicket = {
      id: nextId,
      title: data.title,
      department: data.category || "Не указана категория",
      status: "open",
      priority: data.priority || "medium",
      description: data.description || "",
      computerName: data.computerName || "",
      createdAt: "Только что",
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicketId(nextId);
  }

  function handleChangeTicketStatus(id, nextStatus) {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: nextStatus } : t
      )
    );
  }

  function handleChangeTicketPriority(id, nextPriority) {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, priority: nextPriority } : t
      )
    );
  }

  function handleDeleteTicket(id) {
    setTickets((prev) => {
      const remaining = prev.filter((t) => t.id !== id);
      if (id === selectedTicketId) {
        setSelectedTicketId(remaining[0]?.id ?? null);
      }
      return remaining;
    });
  }

  // ====== CATEGORIES (Admin) ======

  function handleAddCategory(name, description) {
    const trimmed = name.trim();
    if (!trimmed) return;

    const nextId = categories.length
      ? Math.max(...categories.map((c) => c.id)) + 1
      : 1;

    const newCategory = {
      id: nextId,
      name: trimmed,
      description: description.trim() || "",
    };

    setCategories((prev) => [...prev, newCategory]);
  }

  function handleUpdateCategory(id, name, description) {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              name: name.trim() || c.name,
              description: (description ?? "").trim(),
            }
          : c
      )
    );
  }

  function handleDeleteCategory(id) {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  // ====== LAYOUT ======

  return (
    // ВАЖНО: фиксированная высота и без внешнего скролла
    <div className="h-screen flex bg-[var(--bg)] overflow-hidden">
      <Sidebar
        isAdmin={isAdmin}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Правая часть */}
      <main className="flex-1 flex flex-col p-6 gap-4 min-h-0 overflow-hidden">
        {/* Шапка */}
        <header className="flex items-center justify-between mb-2">
          <div>
            {activeSection === "dashboard" && (
              <>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Дашборд
                </h1>
                <p className="text-sm text-[var(--text-muted)]">
                  Общая картина по тикетам и нагрузке
                </p>
              </>
            )}

            {activeSection === "tickets" && (
              <>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Helpdesk
                </h1>
                <p className="text-sm text-[var(--text-muted)]">
                  Центр поддержки сотрудников СТНГ
                </p>
              </>
            )}

            {activeSection === "users" && (
              <>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Пользователи
                </h1>
                <p className="text-sm text-[var(--text-muted)]">
                  Список сотрудников и их рабочих мест
                </p>
              </>
            )}

            {activeSection === "admin" && (
              <>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Админ-панель
                </h1>
                <p className="text-sm text-[var(--text-muted)]">
                  Управление категориями и структурой тикетов
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {activeSection === "tickets" && (
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-3 py-1.5 text-sm rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-card)] transition"
              >
                Создать тикет
              </button>
            )}
          </div>
        </header>

        {/* Контент: ОБЯЗАТЕЛЬНО min-h-0 + overflow-hidden, чтобы чат скроллился внутри */}
        <section className="flex-1 flex gap-4 min-h-0 overflow-hidden">
          {activeSection === "dashboard" && (
            <div className="w-full h-full min-h-0">
              <Dashboard tickets={tickets} />
            </div>
          )}

          {activeSection === "tickets" && (
            <>
              {!hasSelection && (
                <div className="w-full h-full min-h-0">
                  <TicketList
                    variant="full"
                    tickets={tickets}
                    selectedId={selectedTicketId}
                    onSelect={handleSelectTicket}
                    onChangeStatus={handleChangeTicketStatus}
                    onChangePriority={handleChangeTicketPriority}
                    onDelete={handleDeleteTicket}
                  />
                </div>
              )}

              {hasSelection && (
                <>
                  <div className="w-[40%] min-w-[320px] max-w-md h-full min-h-0">
                    <TicketList
                      variant="compact"
                      tickets={tickets}
                      selectedId={selectedTicketId}
                      onSelect={handleSelectTicket}
                      onChangeStatus={handleChangeTicketStatus}
                      onChangePriority={handleChangeTicketPriority}
                      onDelete={handleDeleteTicket}
                    />
                  </div>

                  {/* TicketDetail с чатом */}
                  <div className="flex-1 h-full min-h-0">
                    <TicketDetail
                      ticket={selectedTicket}
                      onChangeStatus={handleChangeTicketStatus}
                      onChangePriority={handleChangeTicketPriority}
                      onDelete={handleDeleteTicket}
                      onClose={() => setSelectedTicketId(null)}
                    />
                  </div>
                </>
              )}
            </>
          )}

          {activeSection === "users" && (
            <div className="w-full h-full min-h-0">
              <AdminUsers tickets={tickets} />
            </div>
          )}

          {activeSection === "admin" && (
            <AdminPanel
              categories={categories}
              tickets={tickets}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}
        </section>

        {/* Модалка создания тикета */}
        <CreateTicketModal
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={(data) => {
            handleCreateTicket(data);
            setIsCreateOpen(false);
          }}
          categories={categories}
        />
      </main>
    </div>
  );
}
