import Seo from '@/components/common/Seo';
import { getOrders } from '@/services/orderService';
import { formatPrice } from '@/lib/format';
import { ORDER_STATUS_FLOW, ORDER_STATUS } from '@/config/site';

// Demo fallback orders so the table isn't empty before any checkout happens.
const demoOrders = [
  { id: 'SAI10001', customer: 'Priya S.', total: 1499, status: ORDER_STATUS.SHIPPED, date: '2026-05-28', items: 2 },
  { id: 'SAI10002', customer: 'Rahul M.', total: 899, status: ORDER_STATUS.PROCESSING, date: '2026-05-29', items: 1 },
  { id: 'SAI10003', customer: 'Aisha K.', total: 2398, status: ORDER_STATUS.DELIVERED, date: '2026-05-27', items: 3 },
  { id: 'SAI10004', customer: 'Vivek T.', total: 449, status: ORDER_STATUS.PENDING, date: '2026-05-30', items: 1 },
];

const statusStyle = {
  [ORDER_STATUS.PENDING]: 'bg-secondary-100 text-secondary-600',
  [ORDER_STATUS.PROCESSING]: 'bg-primary-100 text-primary-700',
  [ORDER_STATUS.PACKED]: 'bg-primary-100 text-primary-700',
  [ORDER_STATUS.SHIPPED]: 'bg-accent-100 text-accent-600',
  [ORDER_STATUS.DELIVERED]: 'bg-accent-500 text-white',
  [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-600',
};

export default function AdminOrders() {
  const real = getOrders().map((o) => ({
    id: o.id,
    customer: o.address?.name || 'Guest',
    total: o.totals.total,
    status: o.status,
    date: o.createdAt.slice(0, 10),
    items: o.items.length,
  }));
  const orders = [...real, ...demoOrders];

  return (
    <div>
      <Seo title="Manage Orders" />
      <h1 className="mb-5 font-display text-xl font-bold">Orders ({orders.length})</h1>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-400">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs font-semibold">{o.id}</td>
                  <td className="px-4 py-3">{o.customer}</td>
                  <td className="px-4 py-3 text-gray-500">{o.date}</td>
                  <td className="px-4 py-3">{o.items}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3">
                    <select
                      defaultValue={o.status}
                      className={`badge cursor-pointer border-0 ${statusStyle[o.status]}`}
                    >
                      {ORDER_STATUS_FLOW.concat(ORDER_STATUS.CANCELLED).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
