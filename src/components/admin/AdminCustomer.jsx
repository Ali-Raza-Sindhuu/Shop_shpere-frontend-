import { useState } from "react";
import { USERS } from "../../data/mockData";
import Card from "../layout/Card";
import { Badge } from "../../pages/AdminDashboard";

const AdminCustomer = () => {
  const [search, setSearch] = useState("");
  const filtered = USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search)
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer…"
          className="rounded-xl border border-[#eeeeee] bg-white px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 w-52"
        />
        <p className="text-xs text-gray-400">{USERS.length} total customers</p>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-[#f8f8f8] border-b border-[#eeeeee]">
            <tr>
              {["Customer","Email","Joined","Orders","Total Spent","Status",""].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eeeeee]">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-[#f8f8f8] transition">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                      {u.name[0]}
                    </div>
                    <span className="font-medium text-gray-900">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{u.email}</td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{u.joined}</td>
                <td className="px-4 py-3 text-gray-700">{u.orders}</td>
                <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">${u.spent.toLocaleString()}</td>
                <td className="px-4 py-3"><Badge status={u.status} /></td>
                <td className="px-4 py-3">
                  <button className="rounded-lg border border-[#eeeeee] px-2.5 py-1 text-[10px] text-gray-600 hover:border-orange-500 hover:text-orange-600 transition whitespace-nowrap">
                    View
                  </button>
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

export default AdminCustomer