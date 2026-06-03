// Order + payment orchestration.
//
// In production the flow is:
//   1. POST /api/payments/create-order  -> backend creates a Razorpay order
//   2. open Razorpay checkout on the client
//   3. POST /api/payments/verify        -> backend verifies signature, writes order
//
// In demo mode (no backend / no Razorpay key) we simulate a successful order and
// persist it to localStorage so the order-history & tracking screens work.
import { SITE } from '@/config/site';

const ORDERS_KEY = 'sai_demo_orders';

const isBackendLive = () => Boolean(import.meta.env.VITE_RAZORPAY_KEY_ID);

function readOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
  } catch {
    return [];
  }
}
function writeOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function makeOrder({ items, address, delivery, payment, totals }) {
  const id = `SAI${Date.now().toString().slice(-8)}`;
  const now = new Date().toISOString();
  return {
    id,
    items,
    address,
    delivery,
    payment,
    totals,
    status: 'Pending',
    timeline: [{ status: 'Pending', at: now }],
    createdAt: now,
  };
}

// Orders are keyed by the customer's mobile number. Pass a phone to get only
// that customer's orders (used by the account screen); omit for all (admin).
export function getOrders(phone) {
  const all = readOrders();
  if (!phone) return all;
  const digits = String(phone).replace(/\D/g, '').slice(-10);
  return all.filter((o) => String(o.userId || '').replace(/\D/g, '').slice(-10) === digits);
}

export function getOrderById(id) {
  return readOrders().find((o) => o.id === id) || null;
}

// Places an order. For COD or demo mode this resolves immediately; for online
// payment it would integrate Razorpay (sketched below).
export async function placeOrder({ items, address, delivery, payment, totals, user }) {
  const order = makeOrder({ items, address, delivery, payment, totals });
  // Mobile number is the user key.
  order.userId = (user?.phone || address?.phone || 'guest').toString().replace(/\D/g, '').slice(-10);

  if (payment.method !== 'cod' && isBackendLive()) {
    // --- Real Razorpay flow (requires backend + script) ---
    const res = await fetch(`${SITE.apiBaseUrl}/payments/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totals.total, orderId: order.id }),
    });
    const data = await res.json();
    await openRazorpay({ ...data, order, user });
  }

  // Persist (demo). In production the backend writes to Firestore `orders`.
  const orders = readOrders();
  orders.unshift(order);
  writeOrders(orders);
  return order;
}

function openRazorpay({ razorpayOrderId, amount }) {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error('Razorpay SDK not loaded'));
      return;
    }
    const rzp = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: amount * 100,
      currency: 'INR',
      name: SITE.name,
      order_id: razorpayOrderId,
      handler: (response) => resolve(response),
      modal: { ondismiss: () => reject(new Error('Payment cancelled')) },
    });
    rzp.open();
  });
}
