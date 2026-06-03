import { useParams, useLocation, Link } from 'react-router-dom';
import { Check, Circle, CheckCircle2, PartyPopper } from 'lucide-react';

import Seo from '@/components/common/Seo';
import { getOrderById } from '@/services/orderService';
import { formatPrice } from '@/lib/format';
import { ORDER_STATUS_FLOW } from '@/config/site';

export default function OrderTracking() {
  const { orderId } = useParams();
  const { state } = useLocation();
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="container-px py-20 text-center">
        <Seo title="Order not found" />
        <p className="text-lg font-semibold">Order not found</p>
        <Link to="/account" className="btn-primary mt-4">My orders</Link>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(order.status);

  return (
    <div className="container-px py-8">
      <Seo title={`Track Order #${order.id}`} />

      {state?.justPlaced && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-accent-50 p-5 text-accent-600">
          <PartyPopper size={24} />
          <div>
            <p className="font-semibold">Thank you! Your order is confirmed.</p>
            <p className="text-sm">A confirmation has been sent. We'll keep you posted on WhatsApp & email.</p>
          </div>
        </div>
      )}

      <h1 className="font-display text-2xl font-extrabold sm:text-3xl">Order #{order.id}</h1>
      <p className="mt-1 text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Timeline */}
        <div className="card p-6">
          <h2 className="mb-6 font-display text-lg font-bold">Tracking</h2>
          <ol className="relative ml-3 border-l-2 border-gray-100">
            {ORDER_STATUS_FLOW.map((status, i) => {
              const done = i <= currentIndex;
              const active = i === currentIndex;
              return (
                <li key={status} className="mb-8 ml-6 last:mb-0">
                  <span
                    className={`absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full ${
                      done ? 'bg-accent-500 text-white' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {done ? <Check size={14} /> : <Circle size={10} />}
                  </span>
                  <p className={`text-sm font-semibold ${active ? 'text-primary' : done ? 'text-ink' : 'text-gray-400'}`}>
                    {status}
                  </p>
                  {active && <p className="text-xs text-gray-500">Your order is currently here</p>}
                </li>
              );
            })}
          </ol>
        </div>

        {/* Summary */}
        <aside className="space-y-4">
          <div className="card p-5">
            <h3 className="font-display text-lg font-bold">Items</h3>
            <div className="mt-3 divide-y divide-gray-100">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center gap-3 py-3">
                  <img src={it.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{it.name}</p>
                    <p className="text-xs text-gray-400">Qty {it.qty}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(it.price * it.qty)}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-between border-t border-gray-100 pt-3 font-bold">
              <span>Total</span>
              <span>{formatPrice(order.totals.total)}</span>
            </div>
          </div>
          <div className="card p-5 text-sm">
            <h3 className="font-display text-lg font-bold">Delivery</h3>
            <p className="mt-2 font-medium">{order.address.name}</p>
            <p className="text-gray-500">{order.address.line1}, {order.address.city}, {order.address.state} - {order.address.pincode}</p>
            <p className="mt-2 flex items-center gap-1 text-accent-600">
              <CheckCircle2 size={14} /> {order.delivery.label}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
