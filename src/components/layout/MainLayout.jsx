import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import TicketList from "../tickets/TicketList.jsx";
import TicketDetail from "../tickets/TicketDetail.jsx";
import CreateTicketModal from "../modals/CreateTicketModal.jsx";
import AdminPanel from "../admin/AdminPanel.jsx";
import AdminUsers from "../admin/AdminUsers.jsx";
import Dashboard from "../dashboard/Dashboard.jsx";
import ProfilePage from "../profile/ProfilePage.jsx";

export default function MainLayout({ currentUser, onLogout }) {
  const role = currentUser?.role || "user"; // user | support | admin
  const isAdmin = role === "admin";
  const isSupport = role === "support";
  const isUser = role === "user";

  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: "Не открывается 1С",
      department: "1С и бухгалтерия",
      status: "open",
      priority: "high",
      createdAt: "Сегодня, 10:24",
      description: "При запуске 1С возникает ошибка.",
      computerName: "A-SIT11",
    },
    {
      id: 2,
      title: "Проблема с VPN",
      department: "VPN / удалённый доступ",
      status: "in_progress",
      priority: "medium",
      createdAt: "Вчера, 18:02",
      description: "Не получается подключиться к VPN.",
      computerName: "U-VEGU18",
    },
  ]);

  const [activeSection, setActiveSection] = useState(
    isUser ? "tickets" : "dashboard"
  );
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const selectedTicket =
    tickets.find((t) => t.id === selectedTicketId) || null;

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
      department: data.category,
      status: "open",
      priority: data.priority,
      description: data.description,
      computerName: data.computerName,
      createdAt: "Только что",
    };

    setTickets((prev) => [newTicket, ...prev]);
    setSelectedTicketId(nextId);
  }

  function handleChangeTicketStatus(id, status) {
    if (isUser) return;
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }

  function handleChangeTicketPriority(id, priority) {
    if (isUser) return;
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority } : t))
    );
  }

  function handleDeleteTicket(id) {
    if (!isAdmin) return;
    setTickets((prev) => prev.filter((t) => t.id !== id));
    if (selectedTicketId === id) setSelectedTicketId(null);
  }

  return (
    <div className="h-screen flex bg-[var(--bg)] overflow-hidden">
      <Sidebar
        isAdmin={isAdmin}
        isSupport={isSupport}
        isUser={isUser}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      <main className="flex-1 flex flex-col p-6 gap-4 min-h-0 overflow-hidden">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-2">
          <div>
            {activeSection === "tickets" && (
              <>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Мои тикеты
                </h1>
                <p className="text-sm text-[var(--text-muted)]">
                  Список созданных обращений
                </p>
              </>
            )}

            {activeSection === "dashboard" && (isAdmin || isSupport) && (
              <>
                <h1 className="text-2xl font-semibold tracking-tight">
                  Дашборд
                </h1>
                <p className="text-sm text-[var(--text-muted)]">
                  Общая картина обращений
                </p>
              </>
            )}

            {activeSection === "users" && isSupport && (
              <h1 className="text-2xl font-semibold tracking-tight">
                Пользователи
              </h1>
            )}

            {activeSection === "admin" && isAdmin && (
              <h1 className="text-2xl font-semibold tracking-tight">
                Админ-панель
              </h1>
            )}

            {activeSection === "profile" && (
              <h1 className="text-2xl font-semibold tracking-tight">
                Профиль пользователя
              </h1>
            )}
          </div>

          {activeSection === "tickets" && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-3 py-1.5 text-sm rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-card)] transition"
            >
              Создать тикет
            </button>
          )}
        </header>

        {/* MAIN CONTENT */}
        <section className="flex-1 flex gap-4 min-h-0 overflow-hidden">
          {activeSection === "tickets" && (
            <>
              {selectedTicket ? (
                // когда тикет выбран — два столбца
                <>
                  <div className="w-[40%] min-w-[320px] max-w-md h-full">
                    <TicketList
                      tickets={tickets}
                      selectedId={selectedTicketId}
                      onSelect={handleSelectTicket}
                      onChangeStatus={
                        isUser ? null : handleChangeTicketStatus
                      }
                      onChangePriority={
                        isUser ? null : handleChangeTicketPriority
                      }
                      onDelete={isAdmin ? handleDeleteTicket : null}
                      variant={isUser ? "readonly" : "full"}
                    />
                  </div>

                  <div className="flex-1 h-full">
                    <TicketDetail
                      ticket={selectedTicket}
                      onClose={() => setSelectedTicketId(null)}
                      onChangeStatus={
                        isUser ? null : handleChangeTicketStatus
                      }
                      onChangePriority={
                        isUser ? null : handleChangeTicketPriority
                      }
                      onDelete={isAdmin ? handleDeleteTicket : null}
                    />
                  </div>
                </>
              ) : (
                // когда тикет НЕ выбран — только список, на всю ширину
                <div className="flex-1 h-full">
                  <TicketList
                    tickets={tickets}
                    selectedId={selectedTicketId}
                    onSelect={handleSelectTicket}
                    onChangeStatus={
                      isUser ? null : handleChangeTicketStatus
                    }
                    onChangePriority={
                      isUser ? null : handleChangeTicketPriority
                    }
                    onDelete={isAdmin ? handleDeleteTicket : null}
                    variant={isUser ? "readonly" : "full"}
                  />
                </div>
              )}
            </>
          )}

          {(isSupport || isAdmin) && activeSection === "dashboard" && (
            <Dashboard tickets={tickets} />
          )}

          {isSupport && activeSection === "users" && (
            <AdminUsers tickets={tickets} />
          )}

          {isAdmin && activeSection === "admin" && <AdminPanel />}

          {activeSection === "profile" && <ProfilePage />}
        </section>

        <CreateTicketModal
          open={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={(data) => {
            handleCreateTicket(data);
            setIsCreateOpen(false);
          }}
        />
      </main>
    </div>
  );
}
