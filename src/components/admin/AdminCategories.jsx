import { PRODUCTS } from "../../data/mockData";
import Card from "../layout/Card";

const AdminCategories = () => {
  const categories = Object.entries(
    PRODUCTS.reduce((acc, p) => {
      if (!acc[p.category]) acc[p.category] = [];
      acc[p.category].push(p);
      return acc;
    }, {})
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">{categories.length} categories · {PRODUCTS.length} products total</p>
        <button className="rounded-xl bg-orange-500 px-4 py-2 text-xs font-medium text-white hover:bg-orange-600 transition">
          + Add Category
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(([name, items]) => {
          const totalStock = items.reduce((s, p) => s + p.stock, 0);
          const avgPrice = (items.reduce((s, p) => s + p.price, 0) / items.length).toFixed(0);
          return (
            <Card key={name}>
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{name}</p>
                  <p className="text-[10px] text-gray-400">{items.length} products</p>
                </div>
                <button className="rounded-lg border border-[#eeeeee] px-2.5 py-1 text-[10px] text-gray-600 hover:border-orange-500 hover:text-orange-600 transition">
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-[10px] text-gray-400">Units in stock</p>
                  <p className="font-semibold text-gray-900">{totalStock}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Avg price</p>
                  <p className="font-semibold text-gray-900">${avgPrice}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminCategories