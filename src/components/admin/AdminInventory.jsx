import { PRODUCTS } from "../../data/mockData";
import Card from "../layout/Card";
import StatCard from "../StatCard";

const AdminInventory = () => {
  const low     = PRODUCTS.filter(p => p.stock > 0 && p.stock < 10);
  const out     = PRODUCTS.filter(p => p.stock === 0);
  const healthy = PRODUCTS.filter(p => p.stock >= 10);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Healthy Stock" value={healthy.length} />
        <StatCard label="Low Stock"     value={low.length}     accent="text-amber-600" />
        <StatCard label="Out of Stock"  value={out.length}     accent="text-red-500"   />
      </div>

      <Card>
        <p className="mb-4 text-xs font-semibold text-gray-900">Stock Levels</p>
        <div className="space-y-3">
          {PRODUCTS.map(p => {
            const pct = Math.min((p.stock / 70) * 100, 100);
            const color = p.stock === 0 ? "bg-red-400" : p.stock < 10 ? "bg-amber-400" : "bg-orange-500";
            return (
              <div key={p.id}>
                <div className="mb-1 flex items-center justify-between">
                  <p className="text-xs text-gray-700 truncate max-w-[60%]">{p.name}</p>
                  <span className={`text-xs font-semibold ${p.stock === 0 ? "text-red-500" : p.stock < 10 ? "text-amber-600" : "text-gray-900"}`}>
                    {p.stock} units
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#eeeeee] overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {out.length > 0 && (
        <Card>
          <p className="mb-3 text-xs font-semibold text-red-500">Restock Needed</p>
          <div className="space-y-2">
            {out.map(p => (
              <div key={p.id} className="flex items-center justify-between">
                <p className="text-xs text-gray-700">{p.name}</p>
                <button className="rounded-lg border border-[#eeeeee] px-2.5 py-1 text-[10px] font-medium text-gray-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition">
                  Restock
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};


export default AdminInventory