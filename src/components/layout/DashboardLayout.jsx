import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slice/authSlice";
import NotificationPanel, { buildNotifications } from "../sections/NotificationPanel";

// ─── Icons (inline SVG, no dep) ──────────────────────────────────────────────
const Icon = ({ d, size = 18, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

const ICONS = {
  dashboard:  "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  ecommerce:  "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0",
  orders:     "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2 M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2 M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
  products:   "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",
  categories: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  earning:    "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  promotion:  "M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
  customer:   "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  users:      "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  analytics:  "M18 20V10 M12 20V4 M6 20v-6",
  inventory:  "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z",
  wishlist:   "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  profile:    "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  address:    "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  support:    "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  returns:    "M9 14 4 9l5-5 M4 9h10a6 6 0 0 1 6 6v1",
  calendar:   "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  review:     "M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  bug:        "M9 9V7a3 3 0 0 1 6 0v2 M8 9h8l1 11H7z M5 13H3 M21 13h-2 M5 18H3 M21 18h-2 M9 5 7 3 M15 5l2-2",
  message:    "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  settings:   "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  logout:     "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  menu:       "M3 12h18 M3 6h18 M3 18h18",
  close:      "M18 6 6 18 M6 6l12 12",
  chevronLeft:"M15 18 9 12l6-6",
  search:     "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.35-4.35",
  bell:       "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
};

// ─── Nav config ──────────────────────────────────────────────────────────────
const ADMIN_NAV = [
  { id: "overview",   label: "Dashboard",   icon: "dashboard"  },
  { id: "ecommerce",  label: "Ecommerce",   icon: "ecommerce"  },
  { id: "orders",     label: "All Order",   icon: "orders", badge: 2 },
  { id: "products",   label: "All Product", icon: "products"   },
  { id: "categories", label: "Categories",  icon: "categories" },
  { id: "earning",    label: "Earning",     icon: "earning"    },
  { id: "promotion",  label: "Promotion",   icon: "promotion"  },
  { id: "customer",   label: "Customer",    icon: "customer"   },
];

const ADMIN_NAV_SECONDARY = [
  { id: "inventory",  label: "Inventory",       icon: "inventory" },
  { id: "returns",    label: "Return Request",  icon: "returns", badge: 2 },
  { id: "calendar",   label: "Calendar",         icon: "calendar"  },
  { id: "analytics",  label: "Analytics",        icon: "analytics" },
];

const ADMIN_NAV_ACCOUNT = [
  { id: "notifications", label: "Notifications",   icon: "bell" },
  { id: "support",       label: "Help & Support",  icon: "support" },
  { id: "settings",      label: "Settings",        icon: "settings" },
];

const CUSTOMER_NAV = [
  { id: "overview",   label: "Overview",   icon: "dashboard"  },
  { id: "orders",     label: "My Orders",  icon: "orders"     },
  { id: "wishlist",   label: "Wishlist",   icon: "wishlist"   },
  { id: "addresses",  label: "Addresses",  icon: "address"    },
];

const CUSTOMER_NAV_ACCOUNT = [
  { id: "profile",    label: "Profile", icon: "profile" },
  { id: "support",    label: "Support", icon: "support" },
];

// ─── Nav button ──────────────────────────────────────────────────────────────
const NavButton = ({ id, label, icon, badge, isActive, onSelect, collapsed }) => (
  <button
    onClick={() => onSelect(id)}
    title={collapsed ? label : undefined}
    className={`
      group relative mb-0.5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition-all
      ${collapsed ? "justify-center px-0" : ""}
      ${isActive
        ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30"
        : "text-gray-500 hover:bg-[#f8f8f8] hover:text-gray-900"}
    `}
  >
    <Icon d={ICONS[icon]} size={16} />
    {!collapsed && <span className="truncate">{label}</span>}
    {badge ? (
      <span
        className={`
          flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold
          ${collapsed ? "absolute -top-1 -right-1" : "ml-auto"}
          ${isActive ? "bg-white text-orange-600" : "bg-red-500 text-white"}
        `}
      >
        {badge}
      </span>
    ) : null}
  </button>
);

// ─── Sidebar ─────────────────────────────────────────────────────────────────
const Sidebar = ({ active, onSelect, role, onLogout, open, onClose, collapsed, onToggleCollapse, unreadCount }) => {
  const isAdmin = role === "admin";
  const primary = isAdmin ? ADMIN_NAV : CUSTOMER_NAV;
  const secondary = isAdmin ? ADMIN_NAV_SECONDARY : null;
  const account = (isAdmin ? ADMIN_NAV_ACCOUNT : CUSTOMER_NAV_ACCOUNT).map((item) =>
    item.id === "notifications" && unreadCount > 0 ? { ...item, badge: unreadCount } : item
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-20 bg-black/30 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-30 flex h-full flex-col bg-white border-r border-[#eeeeee]
          transition-all duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0 lg:z-auto
          ${collapsed ? "w-[78px]" : "w-64"}
        `}
      >
        {/* Brand */}
        <div className={`flex items-center justify-between border-b border-[#eeeeee] px-5 py-5 ${collapsed ? "px-0 justify-center" : ""}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white">
                D
              </span>
              <span className="text-base font-bold tracking-tight text-gray-900">Dokani</span>
            </div>
          )}
          {collapsed && (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-sm font-bold text-white">
              D
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className={`hidden lg:flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:bg-[#f8f8f8] hover:text-gray-900 ${collapsed ? "absolute -right-3 top-7 bg-white border border-[#eeeeee] shadow-sm" : ""}`}
          >
            <Icon d={ICONS.chevronLeft} size={14} className={collapsed ? "rotate-180" : ""} />
          </button>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-900">
            <Icon d={ICONS.close} size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          {primary.map((item) => (
            <NavButton key={item.id} {...item} isActive={active === item.id} onSelect={(id) => { onSelect(id); onClose(); }} collapsed={collapsed} />
          ))}

          {secondary && (
            <>
              {!collapsed && (
                <p className="mt-5 mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Product &amp; Event
                </p>
              )}
              {collapsed && <div className="my-3 h-px bg-[#eeeeee]" />}
              {secondary.map((item) => (
                <NavButton key={item.id} {...item} isActive={active === item.id} onSelect={(id) => { onSelect(id); onClose(); }} collapsed={collapsed} />
              ))}
            </>
          )}

          {!collapsed && (
            <p className="mt-5 mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              Account
            </p>
          )}
          {collapsed && <div className="my-3 h-px bg-[#eeeeee]" />}
          {account.map((item) => (
            <NavButton key={item.id} {...item} isActive={active === item.id} onSelect={(id) => { onSelect(id); onClose(); }} collapsed={collapsed} />
          ))}
        </nav>

        {/* Logout */}
        <div className={`p-3 border-t border-[#eeeeee]`}>
          <button
            onClick={onLogout}
            title={collapsed ? "Log out" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-gray-400 hover:bg-[#f8f8f8] hover:text-gray-900 transition ${collapsed ? "justify-center px-0" : ""}`}
          >
            <Icon d={ICONS.logout} size={16} />
            {!collapsed && "Log out"}
          </button>
        </div>
      </aside>
    </>
  );
};

// ─── Layout shell ─────────────────────────────────────────────────────────────
const DashboardLayout = ({ children, activeSection, onSectionChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, role } = useSelector((s) => s.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(buildNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markRead = (id) =>
    setNotifications((list) => list.map((n) => (n.id === id ? { ...n, unread: false } : n)));

  const markAllRead = () =>
    setNotifications((list) => list.map((n) => ({ ...n, unread: false })));

  const allNav = [
    ...ADMIN_NAV, ...ADMIN_NAV_SECONDARY, ...ADMIN_NAV_ACCOUNT,
    ...CUSTOMER_NAV, ...CUSTOMER_NAV_ACCOUNT,
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const today = new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "2-digit" });

  return (
    <div className="flex h-screen bg-[#f8f8f8] font-sans overflow-hidden">
      <Sidebar
        active={activeSection}
        onSelect={onSectionChange}
        role={role}
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        unreadCount={unreadCount}
      />

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between gap-4 border-b border-[#eeeeee] bg-white px-4 py-3 sm:px-6">
          <button className="lg:hidden text-gray-400 hover:text-gray-900" onClick={() => setSidebarOpen(true)}>
            <Icon d={ICONS.menu} />
          </button>

          {/* Search */}
          <div className="hidden flex-1 max-w-xs items-center gap-2 rounded-xl border border-[#eeeeee] bg-[#f8f8f8] px-3.5 py-2.5 sm:flex">
            <Icon d={ICONS.search} size={15} className="text-gray-400" />
            <input
              placeholder="Search data"
              className="w-full bg-transparent text-xs text-gray-700 placeholder:text-gray-400 outline-none"
            />
          </div>

          <h1 className="text-sm font-semibold text-gray-900 capitalize lg:hidden">
            {allNav.find((n) => n.id === activeSection)?.label ?? "Dashboard"}
          </h1>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-1.5 rounded-xl border border-[#eeeeee] px-3 py-2 text-xs font-medium text-gray-600 md:flex">
              <Icon d={ICONS.calendar} size={14} className="text-gray-400" />
              {today}
            </div>
            <button className="hidden h-9 w-9 items-center justify-center rounded-xl border border-[#eeeeee] text-gray-500 hover:bg-[#f8f8f8] sm:flex">
              <Icon d={ICONS.message} size={16} />
            </button>
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className={`relative flex h-9 w-9 items-center justify-center rounded-xl border transition-colors ${
                  notifOpen
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-[#eeeeee] text-gray-500 hover:bg-[#f8f8f8]"
                }`}
              >
                <Icon d={ICONS.bell} size={16} />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              <NotificationPanel
                open={notifOpen}
                onClose={() => setNotifOpen(false)}
                notifications={notifications}
                onMarkRead={markRead}
                onMarkAllRead={markAllRead}
                onViewAll={() => onSectionChange("notifications")}
              />
            </div>
            <div className="flex items-center gap-2.5 border-l border-[#eeeeee] pl-2.5 sm:pl-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-gray-900">{user?.name ?? "Guest"}</p>
                <p className="text-[10px] capitalize text-gray-400">{role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {typeof children === "function"
            ? children({ notifications, markRead, markAllRead })
            : children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;