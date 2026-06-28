import { ORDERS, PRODUCTS } from "../data/mockData.js";


export const buildNotifications = () => {
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