import { ORDERS, PRODUCTS } from "../../data/mockData";
import Card from "../layout/Card";
import StatCard from "../StatCard";

const AdminEcommerce = () => {
  const totalRevenue  = ORDERS.filter(o => o.payment === "Paid").reduce((s, o) => s + o.total, 0);
  const totalProducts = PRODUCTS.length;
  const totalStock    = PRODUCTS.reduce((s, p) => s + p.stock, 0);
  const lowStock      = PRODUCTS.filter(p => p.stock > 0 && p.stock < 10).length;
  const outOfStock    = PRODUCTS.filter(p => p.stock === 0).length;
  const byCategory    = Object.entries(
    PRODUCTS.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {})
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Store Revenue"  value={`$${totalRevenue.toLocaleString("en", { minimumFractionDigits: 2 })}`} sub="This period" />
        <StatCard label="Total Products" value={totalProducts} sub={`${byCategory.length} categories`} />
        <StatCard label="Units in Stock" value={totalStock}    sub={`${lowStock} running low`} accent={lowStock ? "text-amber-600" : undefined} />
        <StatCard label="Out of Stock"   value={outOfStock}    accent={outOfStock ? "text-red-500" : undefined} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="mb-4 text-xs font-semibold text-gray-900">Products by Category</p>
          <div className="space-y-3">
            {byCategory.map(([cat, count]) => {
              const pct = Math.round((count / totalProducts) * 100);
              return (
                <div key={cat}>
                  <div className="mb-1 flex justify-between text-[10px]">
                    <span className="text-gray-600">{cat}</span>
                    <span className="font-medium text-gray-900">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#eeeeee]">
                    <div className="h-full rounded-full bg-orange-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <p className="mb-4 text-xs font-semibold text-gray-900">Best Sellers</p>
          <div className="space-y-3">
            {[...PRODUCTS].sort((a, b) => b.price - a.price).slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-900">{p.name}</p>
                  <p className="text-[10px] text-gray-400">{p.sku} · {p.category}</p>
                </div>
                <p className="text-xs font-semibold text-gray-900">${p.price}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminEcommerce