import { useEffect, useRef } from "react";
import { ORDERS, PRODUCTS } from "../../data/mockData.js";

// ─── Icon (inline SVG, no dep) ────────────────────────────────────────────────
const Icon = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

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

// ─── Build a notification feed straight from the existing mock data ──────────
// (kept as a function so it stays in sync if ORDERS / PRODUCTS change)
const buildNotifications = () => {
  const items = [];

  ORDERS.forEach((o) => {
    if (o.status === "Pending" || o.status === "Processing") {
      items.push({
        id: `order-${o.id}`,
        type: "order",
        title: "New order placed",
        detail: `${o.customer} ordered ${o.items} item${o.items > 1 ? "s" : ""} · $${o.total}`,
        time: o.date,
        unread: true,
      });
    }
    if (o.status === "Delivered") {
      items.push({
        id: `delivered-${o.id}`,
        type: "order",
        title: "Order delivered",
        detail: `${o.id} for ${o.customer} was delivered`,
        time: o.date,
        unread: false,
      });
    }
    if (o.payment === "Refunded") {
      items.push({
        id: `refund-${o.id}`,
        type: "cancel",
        title: "Order cancelled & refunded",
        detail: `${o.id} for ${o.customer} · $${o.total} refunded`,
        time: o.date,
        unread: true,
      });
    }
    if (o.payment === "Paid" && o.status === "Shipped") {
      items.push({
        id: `paid-${o.id}`,
        type: "payment",
        title: "Payment received",
        detail: `$${o.total} from ${o.customer} for ${o.id}`,
        time: o.date,
        unread: false,
      });
    }
  });

  PRODUCTS.forEach((p) => {
    if (p.stock === 0) {
      items.push({
        id: `out-${p.id}`,
        type: "stock",
        title: "Out of stock",
        detail: `${p.name} has no units left`,
        time: "Today",
        unread: true,
      });
    } else if (p.stock < 10) {
      items.push({
        id: `low-${p.id}`,
        type: "stock",
        title: "Low stock warning",
        detail: `${p.name} has only ${p.stock} units left`,
        time: "Today",
        unread: true,
      });
    }
  });

  // newest / most actionable first
  return items.sort((a, b) => (b.unread ? 1 : 0) - (a.unread ? 1 : 0));
};

// ─── Single row ───────────────────────────────────────────────────────────────
const NotificationRow = ({ n, onRead }) => (
  <button
    onClick={() => onRead(n.id)}
    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[#f8f8f8] ${
      n.unread ? "bg-[#fffaf5]" : "bg-white"
    }`}
  >
    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${NOTIF_STYLE[n.type]}`}>
      <Icon d={NOTIF_ICONS[n.type]} size={14} />
    </span>
    <span className="flex-1 min-w-0">
      <span className="flex items-center gap-1.5">
        <span className="text-xs font-semibold text-gray-900 truncate">{n.title}</span>
        {n.unread && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />}
      </span>
      <p className="mt-0.5 text-[11px] leading-snug text-gray-500 line-clamp-2">{n.detail}</p>
      <p className="mt-1 text-[10px] text-gray-400">{n.time}</p>
    </span>
  </button>
);

// ─── Panel ────────────────────────────────────────────────────────────────────
const NotificationPanel = ({ open, onClose, notifications, onMarkRead, onMarkAllRead, onViewAll, anchorClassName = "" }) => {
  const ref = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // close on outside click + Escape (only listen while open)
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  // dropdown shows the 5 most relevant (unread-first) — full list lives on the page
  const preview = notifications.slice(0, 5);

  return (
    <div
      ref={ref}
      className={`fixed left-3 right-3 top-16 z-40 flex max-h-[28rem] flex-col overflow-hidden rounded-2xl border border-[#eeeeee] bg-white shadow-xl shadow-black/5 sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[22rem] ${anchorClassName}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#eeeeee] px-4 py-3.5">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">Notifications</p>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-[11px] font-medium text-orange-600 hover:text-orange-700"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#eeeeee]">
        {preview.length > 0 ? (
          preview.map((n) => <NotificationRow key={n.id} n={n} onRead={onMarkRead} />)
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8f8f8] text-gray-400">
              <Icon d={NOTIF_ICONS.bell} size={18} />
            </span>
            <p className="text-xs text-gray-400">You're all caught up.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#eeeeee] px-4 py-2.5">
        <button
          onClick={() => { onViewAll?.(); onClose(); }}
          className="w-full rounded-lg py-1.5 text-center text-[11px] font-medium text-gray-500 hover:bg-[#f8f8f8] hover:text-gray-900 transition"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
export { buildNotifications, NotificationRow, NOTIF_ICONS, NOTIF_STYLE, Icon };