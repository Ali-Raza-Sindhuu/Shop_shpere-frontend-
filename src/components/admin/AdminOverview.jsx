import { Badge } from "lucide-react";
import { ORDERS, USERS, WEEKLY_REVENUE } from "../../data/mockData";
import Card from "../layout/Card";
import Spark from "../Spark";
import StatCard from "../StatCard";

const AdminOverview = () => {
  const totalRevenue = ORDERS.filter(o => o.payment === "Paid").reduce((s, o) => s + o.total, 0);
  const delivered    = ORDERS.filter(o => o.status === "Delivered").length;
  const pendingCount = ORDERS.filter(o => o.status === "Pending" || o.status === "Processing").length;
  const activeUsers  = USERS.filter(u => u.status === "Active").length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Revenue"   value={`$${totalRevenue.toLocaleString("en", { minimumFractionDigits: 2 })}`} sub="This period" />
        <StatCard label="Orders Delivered" value={delivered}   sub={`of ${ORDERS.length} orders`} />
        <StatCard label="Pending / Processing" value={pendingCount} accent="text-amber-600" />
        <StatCard label="Active Users"    value={activeUsers}  sub={`of ${USERS.length} total`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-900">Weekly Revenue</p>
            <Spark data={WEEKLY_REVENUE} color="#f97316" />
          </div>
          <div className="flex items-end gap-1 h-20">
            {WEEKLY_REVENUE.map((v, i) => {
              const max = Math.max(...WEEKLY_REVENUE);
              const pct = (v / max) * 100;
              const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-gray-900 transition-all"
                    style={{ height: `${pct}%` }}
                  />
                  <span className="text-[9px] text-gray-400">{days[i]}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <p className="mb-4 text-xs font-semibold text-gray-900">Recent Orders</p>
          <div className="space-y-3">
            {ORDERS.slice(0, 4).map((o) => (
              <div key={o.id} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-900">{o.customer}</p>
                  <p className="text-[10px] text-gray-400">{o.id} · {o.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-900">${o.total}</p>
                  <Badge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview