import { useState } from "react";
import Card from "../layout/Card";
import { Icon, NOTIF_ICONS, NOTIF_STYLE } from "../sections/NotificationPanel";

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