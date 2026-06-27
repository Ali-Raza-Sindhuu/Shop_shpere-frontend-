import { useState } from "react";
import { EARNING_TREND, ORDERS, PRODUCTS } from "../../data/mockData";
import EarningStatCard, { ProductTile } from "../EarningStatCard";
import Card from "../layout/Card";
import { Badge } from "lucide-react";

const AdminEarning = () => {
  const [tab, setTab] = useState("history");
  const [search, setSearch] = useState("");
  const [checked, setChecked] = useState({});

  const totalRevenue   = ORDERS.filter(o => o.payment === "Paid").reduce((s, o) => s + o.total, 0);
  const availableFunds = totalRevenue * 0.55;
  const clearingFunds  = totalRevenue * 0.1;

  const earningRows = PRODUCTS.map((p) => ({
    sku: p.sku,
    updated: "26 Jun, 2025",
    name: p.name,
    category: p.category,
    brand: "Nike",
    variation: "1 Style",
    unitPrice: p.price,
    totalSales: p.stock + 40,
    totalEarning: Math.round(p.price * (p.stock + 40) * 0.15),
    status: p.stock === 0 ? "Out of Stock" : p.stock < 10 ? "Low Stock" : "In Stock",
  }));

  const filtered = earningRows.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.sku.includes(search) ||
      r.status.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (i) => setChecked((c) => ({ ...c, [i]: !c[i] }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Earning</h2>
          <p className="mt-0.5 text-xs text-gray-400">
            Get an overview of your current earning. You can easily withdraw balance.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-xl border border-[#eeeeee] bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#f8f8f8] transition">
            ↓ Export List
          </button>
          <button className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-medium text-white hover:bg-orange-600 transition">
            + Withdraw Balance
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <EarningStatCard
          chip="dollar"
          label="All Time Earnings"
          value={`$${totalRevenue.toLocaleString("en", { minimumFractionDigits: 2 })}`}
          sub="This period"
          subAccent="text-[#1a7a44]"
          trendUp
          spark={EARNING_TREND.allTime}
          sparkColor="#f97316"
        />
        <EarningStatCard
          chip="coin"
          label="Available for Withdrawal"
          value={`$${availableFunds.toLocaleString("en", { minimumFractionDigits: 2 })}`}
          sub="This period"
          subAccent="text-amber-600"
          trendUp
          spark={EARNING_TREND.available}
          sparkColor="#854d0e"
        />
        <EarningStatCard
          chip="card"
          label="Payment Clearing"
          value={`$${clearingFunds.toLocaleString("en", { minimumFractionDigits: 2 })}`}
          sub="This period"
          subAccent="text-[#1a7a44]"
          trendUp
          spark={EARNING_TREND.clearing}
          sparkColor="#1a7a44"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#eeeeee]">
        {[
          { id: "history", label: "Earning History" },
          { id: "withdraw", label: "Withdraw History" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative pb-3 text-xs font-medium transition ${
              tab === t.id ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-orange-500" />
            )}
          </button>
        ))}
      </div>

      {tab === "history" ? (
        <div className="space-y-4">
          {/* Search + filter row */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, name, status"
              className="w-64 rounded-xl border border-[#eeeeee] bg-white px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
            <div className="flex items-center gap-2">
              <select className="rounded-xl border border-[#eeeeee] bg-white px-3 py-2 text-xs text-gray-700 outline-none focus:border-orange-500">
                <option>Sort By: All History</option>
                <option>Sort By: This Week</option>
                <option>Sort By: This Month</option>
              </select>
              <button className="flex items-center gap-1.5 rounded-xl border border-[#eeeeee] bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-[#f8f8f8] transition">
                Filter ▾
              </button>
            </div>
          </div>

          {/* List */}
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[760px]">
                <div className="grid grid-cols-[24px_2.4fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 border-b border-[#eeeeee] bg-[#f8f8f8] px-5 py-3 text-[11px] font-medium text-gray-500">
                  <input type="checkbox" className="rounded border-gray-300 accent-orange-500" />
                  <span>Product</span>
                  <span>Variation</span>
                  <span>Unit Price</span>
                  <span>Total Sales</span>
                  <span>Total Earning</span>
                  <span>Status</span>
                </div>

                <div className="divide-y divide-[#eeeeee]">
                  {filtered.map((r, i) => (
                    <div key={i} className="grid grid-cols-[24px_2.4fr_1fr_1fr_1fr_1fr_1fr] items-center gap-4 px-5 py-4">
                      <input
                        type="checkbox"
                        checked={!!checked[i]}
                        onChange={() => toggle(i)}
                        className="rounded border-gray-300 accent-orange-500"
                      />
                      <div className="flex items-center gap-3">
                        <ProductTile name={r.name} />
                        <div>
                          <p className="text-[10px] text-gray-400">
                            SKU {r.sku} · Last Updated {r.updated}
                          </p>
                          <p className="mt-0.5 text-xs font-semibold text-gray-900">{r.name}</p>
                          <p className="text-[10px] text-gray-400">Brand: {r.brand}</p>
                          <p className="text-[10px] text-gray-400">Category: {r.category}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-700">{r.variation}</span>
                      <span className="text-xs text-gray-700">${r.unitPrice.toFixed(2)}</span>
                      <span className="text-xs text-gray-700">{r.totalSales}</span>
                      <span className="flex items-center gap-1 text-xs font-semibold text-gray-900">
                        <span className="text-orange-500">●</span>${r.totalEarning.toLocaleString()}
                      </span>
                      <Badge status={r.status} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {filtered.length === 0 && (
              <p className="py-10 text-center text-xs text-gray-400">No earning records match your search.</p>
            )}
          </Card>
        </div>
      ) : (
        <Card>
          <p className="py-10 text-center text-xs text-gray-400">No withdrawal history yet.</p>
        </Card>
      )}
    </div>
  );
};

export default AdminEarning