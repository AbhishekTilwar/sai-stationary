import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { User, Package, MapPin, Gift, LogOut, Download, ShieldCheck } from 'lucide-react';

import Seo from '@/components/common/Seo';
import { selectUser, selectIsAdmin, logout } from '@/store/slices/authSlice';
import { logoutUser } from '@/services/authService';
import { getOrders } from '@/services/orderService';
import { getAddresses } from '@/services/userService';
import { formatPrice } from '@/lib/format';
import { ORDER_STATUS } from '@/config/site';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'rewards', label: 'Rewards', icon: Gift },
];

export default function Account() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const [tab, setTab] = useState('orders');
  const orders = getOrders(user?.phone);

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
  };

  return (
    <div className="container-px py-8">
      <Seo title="My Account" />
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <aside>
          <div className="card p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary">
                {user?.name && !user.name.startsWith('+') ? user.name[0].toUpperCase() : <User size={20} />}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{user?.name?.startsWith('+') ? 'Guest' : user?.name}</p>
                <p className="truncate text-xs text-gray-500">+91 {user?.phone}</p>
              </div>
            </div>
            <nav className="mt-5 space-y-1">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium ${
                    tab === id ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} /> {label}
                </button>
              ))}
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-secondary-600 hover:bg-secondary-50">
                  <ShieldCheck size={18} /> Admin Console
                </Link>
              )}
              <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50">
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </div>
        </aside>

        <section>
          {tab === 'profile' && <ProfileTab user={user} />}
          {tab === 'orders' && <OrdersTab orders={orders} />}
          {tab === 'addresses' && <AddressesTab phone={user?.phone} />}
          {tab === 'rewards' && <RewardsTab orders={orders} />}
        </section>
      </div>
    </div>
  );
}

function ProfileTab({ user }) {
  return (
    <div className="card p-6">
      <h2 className="font-display text-lg font-bold">Profile</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Info label="Name" value={user?.name?.startsWith('+') ? '—' : user?.name} />
        <Info label="Mobile" value={`+91 ${user?.phone || ''}`} />
        <Info label="Account type" value={user?.role} />
      </div>
    </div>
  );
}

function OrdersTab({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-2 py-16 text-center">
        <Package size={42} className="text-gray-300" />
        <p className="font-semibold">No orders yet</p>
        <Link to="/products" className="btn-primary mt-2">Start shopping</Link>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold">Order #{o.id}</p>
              <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p>
            </div>
            <StatusBadge status={o.status} />
          </div>
          <div className="mt-3 flex items-center gap-2">
            {o.items.slice(0, 4).map((it) => (
              <img key={it.id} src={it.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
            ))}
            {o.items.length > 4 && <span className="text-xs text-gray-400">+{o.items.length - 4}</span>}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-bold">{formatPrice(o.totals.total)}</span>
            <div className="flex gap-2">
              <button className="btn-outline text-xs" title="Demo: invoice generation is server-side">
                <Download size={14} /> Invoice
              </button>
              <Link to={`/track/${o.id}`} className="btn-primary text-xs">Track order</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddressesTab({ phone }) {
  const [addresses, setAddresses] = useState([]);
  useEffect(() => {
    if (phone) getAddresses(phone).then(setAddresses);
  }, [phone]);

  return (
    <div className="card p-6">
      <h2 className="font-display text-lg font-bold">Saved Addresses</h2>
      <p className="mt-1 text-sm text-gray-500">
        Saved against your mobile number <b>+91 {phone}</b>. Used to speed up checkout.
      </p>
      {addresses.length === 0 ? (
        <p className="mt-4 text-sm text-gray-400">No saved addresses yet — they'll appear after your first order.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {addresses.map((a) => (
            <div key={a.id || a.line1} className="rounded-xl border border-gray-100 p-4 text-sm">
              <p className="font-semibold">{a.name} · {a.phone}</p>
              <p className="text-gray-500">{a.line1}, {a.city}, {a.state} - {a.pincode}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RewardsTab({ orders }) {
  const points = orders.length * 50 + 100;
  return (
    <div className="space-y-4">
      <div className="card bg-gradient-to-br from-primary-600 to-primary-800 p-6 text-white">
        <p className="text-sm text-white/80">Loyalty points</p>
        <p className="mt-1 text-4xl font-extrabold">{points}</p>
        <p className="mt-2 text-sm text-white/85">Earn 50 points on every order. 100 points = ₹50 off.</p>
      </div>
      <div className="card p-6">
        <h3 className="font-display text-lg font-bold">Refer & Earn</h3>
        <p className="mt-2 text-sm text-gray-500">Share your code and both of you get ₹100 off.</p>
        <div className="mt-3 flex items-center gap-2">
          <code className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold">SAI-FRIEND-100</code>
          <button className="btn-secondary text-xs">Copy & share</button>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium capitalize">{value || '—'}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    [ORDER_STATUS.PENDING]: 'bg-secondary-100 text-secondary-600',
    [ORDER_STATUS.PROCESSING]: 'bg-primary-100 text-primary-700',
    [ORDER_STATUS.PACKED]: 'bg-primary-100 text-primary-700',
    [ORDER_STATUS.SHIPPED]: 'bg-accent-100 text-accent-600',
    [ORDER_STATUS.DELIVERED]: 'bg-accent-500 text-white',
    [ORDER_STATUS.CANCELLED]: 'bg-red-100 text-red-600',
  };
  return <span className={`badge ${map[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}
