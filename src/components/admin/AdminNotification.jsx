import { useState } from "react";
import Card from "../layout/Card";
import { Icon } from "../sections/NotificationPanel";


const NOTIF_ICONS = {
  order:   "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
  stock:   "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  payment: "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  cancel:  "M10 15 8 17 M8 15l2 2 M15 9l-3 3 3 3 M9 9l3 3-3 3 M12 1a11 11 0 1 0 0 22 11 11 0 1 0 0-22z",
  bell:    "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
};

const NOTIF_STYLE = {
  order:   "bg-[#fff1e6] text-orange-600",
  stock:   "bg-[#fefce8] text-[#854d0e]",
  payment: "bg-[#eef9f1] text-[#1a7a44]",
  cancel:  "bg-[#fef2f2] text-[#991b1b]",
};


const NOTIF_FILTERS = [
  { id: "all",     label: "All" },
  { id: "unread",  label: "Unread" },
  { id: "order",   label: "Orders" },
  { id: "stock",   label: "Inventory" },
  { id: "payment", label: "Payments" },
  { id: "cancel",  label: "Cancellations" },
];
 
const AdminNotifications = ({ notifications, markRead, markAllRead }) => {
  const [filter, setFilter] = useState("all");
 
  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return n.unread;
    return n.type === filter;
  });
 
  const unreadCount = notifications.filter((n) => n.unread).length;
  const counts = {
    all: notifications.length,
    unread: unreadCount,
    order: notifications.filter((n) => n.type === "order").length,
    stock: notifications.filter((n) => n.type === "stock").length,
    payment: notifications.filter((n) => n.type === "payment").length,
    cancel: notifications.filter((n) => n.type === "cancel").length,
  };
 
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "You're all caught up."}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="rounded-xl border border-[#eeeeee] bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#f8f8f8] transition"
          >
            Mark all read
          </button>
        )}
      </div>
 
      {/* Filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {NOTIF_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition ${
              filter === f.id
                ? "bg-orange-500 text-white"
                : "bg-white border border-[#eeeeee] text-gray-500 hover:border-orange-500"
            }`}
          >
            {f.label}
            <span className={`rounded-full px-1.5 text-[10px] ${filter === f.id ? "bg-white/20" : "bg-[#f8f8f8]"}`}>
              {counts[f.id]}
            </span>
          </button>
        ))}
      </div>
 
      {/* List */}
      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-[#eeeeee]">
          {filtered.length > 0 ? (
            filtered.map((n) => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex w-full items-start gap-4 px-5 py-4 text-left transition-colors hover:bg-[#f8f8f8] ${
                  n.unread ? "bg-[#fffaf5]" : "bg-white"
                }`}
              >
                <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${NOTIF_STYLE[n.type]}`}>
                  <Icon d={NOTIF_ICONS[n.type]} size={16} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{n.title}</span>
                      {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />}
                    </span>
                    <span className="shrink-0 text-[11px] text-gray-400">{n.time}</span>
                  </span>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{n.detail}</p>
                </span>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f8f8f8] text-gray-400">
                <Icon d={NOTIF_ICONS.bell} size={20} />
              </span>
              <p className="text-sm font-medium text-gray-900">Nothing here</p>
              <p className="text-xs text-gray-400">No notifications match this filter.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AdminNotifications