import { MONTHLY_ORDERS, ORDERS, USERS } from "../../data/mockData";
import Card from "../layout/Card";
import StatCard from "../StatCard";

const AdminAnalytics = () => {
  const totalRevenue  = ORDERS.filter(o => o.payment === "Paid").reduce((s, o) => s + o.total, 0);
  const avgOrderValue = (totalRevenue / ORDERS.filter(o => o.payment === "Paid").length).toFixed(2);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Revenue"       value={`$${totalRevenue.toFixed(2)}`} />
        <StatCard label="Avg Order"     value={`$${avgOrderValue}`}           />
        <StatCard label="Total Orders"  value={ORDERS.length}                 />
        <StatCard label="Total Users"   value={USERS.length}                  />
      </div>

      <Card>
        <p className="mb-4 text-xs font-semibold text-gray-900">Monthly Orders (12 months)</p>
        <div className="flex items-end gap-1.5 h-28">
          {MONTHLY_ORDERS.map((v, i) => {
            const max = Math.max(...MONTHLY_ORDERS);
            const pct = (v / max) * 100;
            return (
              <div key={i} className="group flex flex-1 flex-col items-center gap-1">
                <span className="hidden group-hover:block text-[9px] text-gray-500">{v}</span>
                <div
                  className="w-full rounded-t-md bg-orange-500 hover:bg-orange-600 transition-all cursor-default"
                  style={{ height: `${pct}%` }}
                />
                <span className="text-[9px] text-gray-400">{months[i]}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="mb-3 text-xs font-semibold text-gray-900">Orders by Status</p>
          {["Delivered","Shipped","Processing","Pending","Cancelled"].map(s => {
            const count = ORDERS.filter(o => o.status === s).length;
            const pct   = Math.round((count / ORDERS.length) * 100);
            return (
              <div key={s} className="mb-2.5">
                <div className="mb-1 flex justify-between text-[10px]">
                  <span className="text-gray-600">{s}</span>
                  <span className="font-medium text-gray-900">{count} ({pct}%)</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#eeeeee]">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </Card>

        <Card>
          <p className="mb-3 text-xs font-semibold text-gray-900">Top Customers</p>
          <div className="space-y-3">
            {[...USERS].sort((a, b) => b.spent - a.spent).slice(0, 5).map((u, i) => (
              <div key={u.id} className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-300 w-3">{i + 1}</span>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#eeeeee] text-[10px] font-bold text-gray-700">
                  {u.name[0]}
                </div>
                <p className="flex-1 text-xs text-gray-700">{u.name}</p>
                <p className="text-xs font-semibold text-gray-900">${u.spent.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics