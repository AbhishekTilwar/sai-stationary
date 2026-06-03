import { useQuery } from '@tanstack/react-query';
import { IndianRupee, ShoppingCart, Package, Users, TrendingUp, AlertTriangle } from 'lucide-react';

import Seo from '@/components/common/Seo';
import { fetchProducts } from '@/services/catalogService';
import { getOrders } from '@/services/orderService';
import { formatPrice } from '@/lib/format';
import { categories } from '@/data/categories';

const monthlyRevenue = [
  { m: 'Jan', v: 42000 }, { m: 'Feb', v: 38000 }, { m: 'Mar', v: 51000 },
  { m: 'Apr', v: 47000 }, { m: 'May', v: 62000 }, { m: 'Jun', v: 58000 },
  { m: 'Jul', v: 71000 }, { m: 'Aug', v: 83000 }, { m: 'Sep', v: 69000 },
  { m: 'Oct', v: 92000 }, { m: 'Nov', v: 110000 }, { m: 'Dec', v: 128000 },
];

export default function Dashboard() {
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: () => fetchProducts() });
  const orders = getOrders();

  const revenue = orders.reduce((s, o) => s + o.totals.total, 0) || 842500;
  const lowStock = products.filter((p) => p.stock < 30);

  const topProducts = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5);
  const salesByCategory = categories.map((c) => ({
    name: c.name,
    value: products.filter((p) => p.category === c.id).reduce((s, p) => s + p.reviewCount, 0),
  }));

  const maxRev = Math.max(...monthlyRevenue.map((d) => d.v));
  const maxCat = Math.max(...salesByCategory.map((d) => d.value), 1);

  return (
    <div>
      <Seo title="Admin Dashboard" />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Kpi icon={IndianRupee} label="Revenue" value={formatPrice(revenue)} trend="+12.4%" color="bg-primary" />
        <Kpi icon={ShoppingCart} label="Orders" value={orders.length || 1284} trend="+8.1%" color="bg-secondary" />
        <Kpi icon={Package} label="Products" value={products.length} trend="+3" color="bg-accent-500" />
        <Kpi icon={Users} label="Customers" value="3,902" trend="+5.6%" color="bg-primary" />
        <Kpi icon={TrendingUp} label="Avg. Order" value={formatPrice(658)} trend="+2.2%" color="bg-secondary" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-bold">Monthly Revenue</h2>
          <div className="mt-6 flex h-56 items-end gap-2">
            {monthlyRevenue.map((d) => (
              <div key={d.m} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-primary-400 to-primary transition-all hover:from-primary-600"
                    style={{ height: `${(d.v / maxRev) * 100}%` }}
                    title={formatPrice(d.v)}
                  />
                </div>
                <span className="text-[10px] text-gray-400">{d.m}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-lg font-bold">Sales by Category</h2>
          <div className="mt-4 space-y-3">
            {salesByCategory.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">{c.name}</span>
                  <span className="font-semibold">{c.value}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-accent-500" style={{ width: `${(c.value / maxCat) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top products + low stock */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-display text-lg font-bold">Top Products</h2>
          <div className="mt-4 space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-5 text-sm font-bold text-gray-400">{i + 1}</span>
                <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.reviewCount} sold</p>
                </div>
                <span className="text-sm font-semibold">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <AlertTriangle size={18} className="text-secondary" /> Low Stock Alerts
          </h2>
          <div className="mt-4 space-y-3">
            {lowStock.length === 0 && <p className="text-sm text-gray-500">All products well stocked.</p>}
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-secondary-50 px-3 py-2">
                <span className="line-clamp-1 text-sm">{p.name}</span>
                <span className="badge bg-secondary-100 text-secondary-600">{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, trend, color }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} text-white`}>
          <Icon size={20} />
        </span>
        <span className="text-xs font-semibold text-accent-600">{trend}</span>
      </div>
      <p className="mt-3 text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}
