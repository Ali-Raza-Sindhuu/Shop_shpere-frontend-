import { useState } from "react";
import { PROMOTIONS } from "../../data/mockData";
import StatCard from "../StatCard";
import Card from "../layout/Card";
import { Badge } from "../../pages/AdminDashboard";

const AdminPromotion = () => {
  const [search, setSearch] = useState("");
  const filtered = PROMOTIONS.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase())
  );
  const active = PROMOTIONS.filter((p) => p.status === "Active").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Active Promotions" value={active} />
        <StatCard label="Total Redemptions" value={PROMOTIONS.reduce((s, p) => s + p.used, 0)} />
        <StatCard label="Total Promotions"  value={PROMOTIONS.length} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search promotion or code…"
          className="rounded-xl border border-[#eeeeee] bg-white px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 w-52"
        />
        <button className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-medium text-white hover:bg-orange-600 transition">
          + New Promotion
        </button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-[#f8f8f8] border-b border-[#eeeeee]">
            <tr>
              {["Promotion","Code","Type","Value","Usage","Window","Status",""].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eeeeee]">
            {filtered.map((p) => {
              const pct = Math.round((p.used / p.limit) * 100);
              return (
                <tr key={p.id} className="hover:bg-[#f8f8f8] transition">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-gray-500 whitespace-nowrap">{p.code}</td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.type}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">
                    {p.type === "Percentage" ? `${p.value}%` : p.type === "Shipping" ? "Free" : `$${p.value}`}
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-[#eeeeee]">
                        <div className="h-full rounded-full bg-orange-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap">{p.used}/{p.limit}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{p.starts} – {p.ends}</td>
                  <td className="px-4 py-3"><Badge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <button className="rounded-lg border border-[#eeeeee] px-2.5 py-1 text-[10px] text-gray-600 hover:border-orange-500 hover:text-orange-600 transition whitespace-nowrap">Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
        {filtered.length === 0 && (
          <p className="py-10 text-center text-xs text-gray-400">No promotions match your search.</p>
        )}
      </Card>
    </div>
  );
};

export default AdminPromotion