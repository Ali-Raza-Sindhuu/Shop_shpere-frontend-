import { Badge } from "lucide-react";
import Card from "../layout/Card";
import { useState } from "react";
import { ORDERS } from "../../data/mockData";

const AdminOrders = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const statuses = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
  const filtered = ORDERS.filter(o =>
    (filter === "All" || o.status === filter) &&
    (o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search))
  );

  if (selected) {
    const o = selected;
    return (
      <div className="space-y-4">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900">
          ← Back to Orders
        </button>

        {/* Invoice card */}
        <Card>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">Invoice</p>
              <p className="mt-0.5 text-xl font-semibold text-gray-900">{o.id}</p>
              <p className="text-xs text-gray-400 mt-0.5">Issued {o.date}</p>
            </div>
            <Badge status={o.payment} />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Bill To</p>
              <p className="text-sm font-medium text-gray-900">{o.customer}</p>
              <p className="text-xs text-gray-400">{o.email}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Order Status</p>
              <Badge status={o.status} />
            </div>
          </div>

          <div className="rounded-xl border border-[#eeeeee] overflow-hidden mb-6">
            <table className="w-full text-xs">
              <thead className="bg-[#f8f8f8] border-b border-[#eeeeee]">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium text-gray-500">Item</th>
                  <th className="px-4 py-2.5 text-right font-medium text-gray-500">Qty</th>
                  <th className="px-4 py-2.5 text-right font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeeeee]">
                {Array.from({ length: o.items }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3 text-gray-700">Item #{i + 1}</td>
                    <td className="px-4 py-3 text-right text-gray-500">1</td>
                    <td className="px-4 py-3 text-right text-gray-900 font-medium">
                      ${(o.total / o.items).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-[#eeeeee] bg-[#f8f8f8]">
                <tr>
                  <td colSpan="2" className="px-4 py-3 text-xs font-semibold text-gray-900">Total</td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-gray-900">${o.total}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex gap-2">
            <button className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-medium text-white hover:bg-orange-600 transition">
              Download PDF
            </button>
            <button className="rounded-xl border border-[#eeeeee] px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#f8f8f8] transition">
              Send to Customer
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order or customer…"
          className="rounded-xl border border-[#eeeeee] bg-white px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 w-52"
        />
        <div className="flex flex-wrap gap-1.5">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-[10px] font-medium transition ${filter === s ? "bg-orange-500 text-white" : "bg-white border border-[#eeeeee] text-gray-500 hover:border-orange-500"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-[#f8f8f8] border-b border-[#eeeeee]">
            <tr>
              {["Order ID","Customer","Date","Items","Total","Payment","Status",""].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eeeeee]">
            {filtered.map(o => (
              <tr key={o.id} className="hover:bg-[#f8f8f8] transition">
                <td className="px-4 py-3 font-mono font-medium text-gray-900 whitespace-nowrap">{o.id}</td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{o.customer}</td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{o.date}</td>
                <td className="px-4 py-3 text-gray-700">{o.items}</td>
                <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">${o.total}</td>
                <td className="px-4 py-3"><Badge status={o.payment} /></td>
                <td className="px-4 py-3"><Badge status={o.status} /></td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelected(o)}
                    className="rounded-lg border border-[#eeeeee] px-2.5 py-1 text-[10px] font-medium text-gray-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition whitespace-nowrap"
                  >
                    Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-xs text-gray-400">No orders match your filter.</p>
        )}
      </Card>
    </div>
  );
};

export default AdminOrders