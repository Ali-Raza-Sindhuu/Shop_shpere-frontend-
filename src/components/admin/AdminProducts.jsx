import { useState } from "react";
import { PRODUCTS } from "../../data/mockData";
import Card from "../layout/Card";
import { Badge } from "../../pages/AdminDashboard";

const AdminProducts = () => {
  const [search, setSearch] = useState("");
  const filtered = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search product or SKU…"
          className="rounded-xl border border-[#eeeeee] bg-white px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 w-52"
        />
        <button className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-medium text-white hover:bg-orange-600 transition">
          + Add Product
        </button>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-[#f8f8f8] border-b border-[#eeeeee]">
            <tr>
              {["SKU","Product","Category","Price","Stock","Status","Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eeeeee]">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-[#f8f8f8] transition">
                <td className="px-4 py-3 font-mono text-gray-400 whitespace-nowrap">{p.sku}</td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{p.name}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.category}</td>
                <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">${p.price}</td>
                <td className={`px-4 py-3 font-medium whitespace-nowrap ${p.stock === 0 ? "text-red-500" : p.stock < 10 ? "text-amber-500" : "text-gray-700"}`}>
                  {p.stock === 0 ? "Out" : p.stock}
                </td>
                <td className="px-4 py-3"><Badge status={p.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="rounded-lg border border-[#eeeeee] px-2.5 py-1 text-[10px] text-gray-600 hover:border-orange-500 hover:text-orange-600 transition">Edit</button>
                    <button className="rounded-lg border border-[#eeeeee] px-2.5 py-1 text-[10px] text-red-400 hover:border-red-400 transition">Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminProducts