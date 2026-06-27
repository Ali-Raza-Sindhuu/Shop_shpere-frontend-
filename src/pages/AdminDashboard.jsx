import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  ORDERS, PRODUCTS, USERS, WEEKLY_REVENUE, MONTHLY_ORDERS,
  PROMOTIONS, EARNING_TREND,
} from "../data/mockData.js";
import AdminOverview from "../components/admin/AdminOverview.jsx";
import AdminEcommerce from "../components/admin/AdminEcommerce.jsx";
import AdminOrders from "../components/admin/AdminOrders.jsx";
import AdminProducts from "../components/admin/AdminProducts.jsx";
import AdminCategories from "../components/admin/AdminCategories.jsx";
import AdminEarning from "../components/admin/AdminEarning.jsx";
import AdminPromotion from "../components/admin/AdminPromotion.jsx";
import AdminCustomer from "../components/admin/AdminCustomer.jsx";
import AdminAnalytics from "../components/admin/AdminAnalytics.jsx";
import AdminInventory from "../components/admin/AdminInventory.jsx";
import Card from "../components/layout/Card.jsx";
import AdminNotifications from "../components/admin/AdminNotification.jsx";

// ─── Tiny helpers ─────────────────────────────────────────────────────────────
export const Badge = ({ status }) => {
  const map = {
    Delivered:  "bg-[#f0faf4] text-[#1a7a44]",
    Shipped:    "bg-[#fff7ed] text-orange-600",
    Processing: "bg-[#fefce8] text-[#854d0e]",
    Pending:    "bg-[#fefce8] text-[#854d0e]",
    Cancelled:  "bg-[#fef2f2] text-[#991b1b]",
    Active:     "bg-[#f0faf4] text-[#1a7a44]",
    Inactive:   "bg-[#eeeeee] text-gray-500",
    Banned:     "bg-[#fef2f2] text-[#991b1b]",
    Low:        "bg-[#fefce8] text-[#854d0e]",
    Out:        "bg-[#fef2f2] text-[#991b1b]",
    Paid:       "bg-[#f0faf4] text-[#1a7a44]",
    Refunded:   "bg-[#fef2f2] text-[#991b1b]",
    Ended:      "bg-[#eeeeee] text-gray-500",
    Scheduled:  "bg-[#fff7ed] text-orange-600",
    "In Stock":     "bg-[#f0faf4] text-[#1a7a44]",
    "Low Stock":    "bg-[#fefce8] text-[#854d0e]",
    "Out of Stock": "bg-[#fef2f2] text-[#991b1b]",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold w-fit ${map[status] ?? "bg-[#eeeeee] text-gray-600"}`}>
      {status}
    </span>
  );
};



// ─── Placeholder sections (sidebar items without a dedicated view yet) ───────
const ComingSoon = ({ title }) => (
  <Card className="flex flex-col items-center justify-center gap-1 py-16 text-center">
    <p className="text-sm font-semibold text-gray-900">{title}</p>
    <p className="text-xs text-gray-400">This section isn't wired up yet.</p>
  </Card>
);

// ─── Admin Dashboard (router) ─────────────────────────────────────────────────
// ─── Admin Dashboard (router) ─────────────────────────────────────────────────
const AdminDashboard = () => {
  const [section, setSection] = useState("overview");
 
  const SECTIONS = {
    overview:   <AdminOverview  />,
    ecommerce:  <AdminEcommerce />,
    orders:     <AdminOrders />,
    products:   <AdminProducts />,
    categories: <AdminCategories />,
    earning:    <AdminEarning />,
    promotion:  <AdminPromotion />,
    customer:   <AdminCustomer />,
    inventory:  <AdminInventory />,
    analytics:  <AdminAnalytics />,
    returns:    <ComingSoon title="Return Request" />,
    calendar:   <ComingSoon title="Calendar" />,
    support:    <ComingSoon title="Help & Support" />,
    settings:   <ComingSoon title="Settings" />,
  };
 
  return (
    <DashboardLayout activeSection={section} onSectionChange={setSection}>
      {({ notifications, markRead, markAllRead }) =>
        section === "notifications" ? (
          <AdminNotifications notifications={notifications} markRead={markRead} markAllRead={markAllRead} />
        ) : (
          SECTIONS[section]
        )
      }
    </DashboardLayout>
  );
};
 
export default AdminDashboard;