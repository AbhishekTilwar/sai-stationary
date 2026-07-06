import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Check, ShieldCheck, MapPin, Truck, CreditCard, ClipboardCheck, Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

import Seo from '@/components/common/Seo';
import PhoneOtpForm from '@/components/auth/PhoneOtpForm';
import {
  selectCartItems,
  selectSubtotal,
  selectDiscount,
  clearCart,
} from '@/store/slices/cartSlice';
import { selectUser } from '@/store/slices/authSlice';
import { formatPrice } from '@/lib/format';
import { SITE, PAYMENT_METHODS } from '@/config/site';
import { placeOrder } from '@/services/orderService';
import { getAddresses, saveAddress } from '@/services/userService';
import { sendOrderToWhatsApp } from '@/lib/whatsapp';

const STEPS = [
  { id: 1, label: 'Verify', icon: ShieldCheck },
  { id: 2, label: 'Address', icon: MapPin },
  { id: 3, label: 'Delivery', icon: Truck },
  { id: 4, label: 'Payment', icon: CreditCard },
  { id: 5, label: 'Review', icon: ClipboardCheck },
];

const DELIVERY_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', eta: '3–5 days', price: 0 },
  { id: 'express', label: 'Express Delivery', eta: '1–2 days', price: 79 },
  { id: 'local', label: 'Local Same-day', eta: 'Today (within city)', price: 99 },
];

const emptyAddress = { name: '', phone: '', line1: '', city: '', state: '', pincode: '' };

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const discount = useSelector(selectDiscount);
  const user = useSelector(selectUser);

  // Start at address if the customer is already verified, else verify first.
  const [step, setStep] = useState(user ? 2 : 1);
  const [placing, setPlacing] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [address, setAddress] = useState({
    ...emptyAddress,
    name: user?.name?.startsWith('+91') ? '' : user?.name || '',
    phone: user?.phone || '',
  });
  const [delivery, setDelivery] = useState(DELIVERY_OPTIONS[0]);
  const [payment, setPayment] = useState(PAYMENT_METHODS.COD);

  // Load saved addresses for this mobile number whenever the user is known.
  useEffect(() => {
    let active = true;
    if (user?.phone) {
      getAddresses(user.phone).then((list) => {
        if (!active) return;
        setSavedAddresses(list);
        if (list[0]) setAddress({ ...emptyAddress, ...list[0], phone: user.phone });
        else setAddress((a) => ({ ...a, phone: user.phone, name: a.name || (user.name?.startsWith('+91') ? '' : user.name) }));
      });
    }
    return () => {
      active = false;
    };
  }, [user?.phone]);

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const total = Math.max(0, subtotal - discount) + delivery.price;

  const next = () => {
    if (step === 2) {
      const required = ['name', 'phone', 'line1', 'city', 'state', 'pincode'];
      if (required.some((k) => !address[k])) {
        toast.error('Please fill all address fields');
        return;
      }
    }
    setStep((s) => Math.min(5, s + 1));
  };
  const back = () => setStep((s) => Math.max(user ? 2 : 1, s - 1));

  const confirm = async () => {
    setPlacing(true);
    try {
      const phone = user?.phone || address.phone;
      await saveAddress(phone, address);
      const order = await placeOrder({
        items,
        address,
        delivery,
        payment: { method: payment },
        totals: { subtotal, discount, shipping: delivery.price, total },
        user: { phone, name: address.name },
      });
      // Send the full order to the shop's WhatsApp (opens WhatsApp with a
      // pre-filled message). Done before clearing the cart / navigating.
      sendOrderToWhatsApp(order);
      dispatch(clearCart());
      toast.success('Order placed! Sending details on WhatsApp…');
      navigate(`/track/${order.id}`, { state: { justPlaced: true } });
    } catch (e) {
      toast.error(e.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-px py-6 sm:py-8">
      <Seo title="Checkout" />
      <h1 className="mb-5 font-display text-2xl font-extrabold sm:text-3xl">Checkout</h1>

      {/* Stepper */}
      <div className="mb-6 flex items-center">
        {STEPS.map((s, i) => {
          const done = step > s.id;
          const active = step === s.id;
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors sm:h-10 sm:w-10 ${
                    done ? 'bg-accent-500 text-white' : active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {done ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span className={`mt-1 hidden text-xs sm:block ${active ? 'font-semibold text-primary' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`mx-1.5 h-0.5 flex-1 sm:mx-2 ${step > s.id ? 'bg-accent-500' : 'bg-gray-100'}`} />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card p-5 sm:p-6">
          {step === 1 && (
            <div>
              <h2 className="font-display text-lg font-bold">Verify your mobile number</h2>
              <p className="mt-1 text-sm text-gray-500">
                No account needed — just confirm your number with an OTP to place the order.
              </p>
              <div className="mt-5 max-w-sm">
                <PhoneOtpForm collectName onVerified={() => setStep(2)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold">Shipping Address</h2>

              {savedAddresses.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">Saved addresses</p>
                  {savedAddresses.map((a) => {
                    const selected = a.line1 === address.line1 && a.pincode === address.pincode;
                    return (
                      <button
                        key={a.id || a.line1}
                        onClick={() => setAddress({ ...emptyAddress, ...a, phone: user?.phone || a.phone })}
                        className={`block w-full rounded-xl border p-3 text-left text-sm ${
                          selected ? 'border-primary bg-primary-50' : 'border-gray-200'
                        }`}
                      >
                        <span className="font-semibold">{a.name}</span> · {a.phone}
                        <br />
                        <span className="text-gray-500">{a.line1}, {a.city}, {a.state} - {a.pincode}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setAddress({ ...emptyAddress, phone: user?.phone || '' })}
                    className="flex items-center gap-1 text-sm font-semibold text-primary"
                  >
                    <Plus size={14} /> Add a new address
                  </button>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" value={address.name} onChange={(v) => setAddress({ ...address, name: v })} />
                <Field label="Mobile number" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} />
              </div>
              <Field label="Address line" value={address.line1} onChange={(v) => setAddress({ ...address, line1: v })} />
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
                <Field label="State" value={address.state} onChange={(v) => setAddress({ ...address, state: v })} />
                <Field label="Pincode" value={address.pincode} onChange={(v) => setAddress({ ...address, pincode: v })} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold">Delivery Method</h2>
              {DELIVERY_OPTIONS.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${
                    delivery.id === opt.id ? 'border-primary bg-primary-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={delivery.id === opt.id} onChange={() => setDelivery(opt)} className="accent-primary" />
                    <div>
                      <p className="text-sm font-semibold">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.eta}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">{opt.price === 0 ? 'FREE' : formatPrice(opt.price)}</span>
                </label>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <h2 className="font-display text-lg font-bold">Payment Method</h2>
              <PaymentOption id={PAYMENT_METHODS.COD} payment={payment} setPayment={setPayment} title="Cash on Delivery" desc="Pay when your order arrives" />
              <PaymentOption id={PAYMENT_METHODS.UPI} payment={payment} setPayment={setPayment} title="UPI" desc="Google Pay, PhonePe, Paytm" />
              <PaymentOption id={PAYMENT_METHODS.CARD} payment={payment} setPayment={setPayment} title="Credit / Debit Card" desc="Visa, Mastercard, RuPay" />
              <PaymentOption id={PAYMENT_METHODS.RAZORPAY} payment={payment} setPayment={setPayment} title="Razorpay (All methods)" desc="Secure checkout via Razorpay" />
              {payment !== PAYMENT_METHODS.COD && (
                <p className="rounded-lg bg-secondary-50 p-3 text-xs text-secondary-600">
                  Online payments are coming soon. For now your order is confirmed over WhatsApp and
                  paid on delivery — we'll message you to arrange payment.
                </p>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="font-display text-lg font-bold">Review Order</h2>
              <div className="rounded-xl bg-gray-50 p-4 text-sm">
                <p className="font-semibold">{address.name} · {address.phone}</p>
                <p className="text-gray-500">{address.line1}, {address.city}, {address.state} - {address.pincode}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 text-sm">
                <p className="font-semibold">{delivery.label} ({delivery.eta})</p>
                <p className="capitalize text-gray-500">Payment: {payment}</p>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 py-3">
                    <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty {item.qty}</p>
                    </div>
                    <p className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation (hidden on the verify step — that has its own CTA) */}
          {step !== 1 && (
            <div className="mt-6 flex justify-between">
              {step > (user ? 2 : 1) ? (
                <button onClick={back} className="btn-outline">Back</button>
              ) : (
                <span />
              )}
              {step < 5 ? (
                <button onClick={next} className="btn-primary">Continue</button>
              ) : (
                <button onClick={confirm} disabled={placing} className="btn-primary">
                  {placing ? <Loader2 size={18} className="animate-spin" /> : null}
                  Place Order · {formatPrice(total)}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Summary */}
        <aside className="h-fit lg:sticky lg:top-32">
          <div className="card p-5">
            <h2 className="font-display text-lg font-bold">Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              {discount > 0 && <Row label="Discount" value={`- ${formatPrice(discount)}`} />}
              <Row label="Delivery" value={delivery.price === 0 ? 'FREE' : formatPrice(delivery.price)} />
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Need help? Chat with us on WhatsApp at +{SITE.whatsapp}.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-600">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="input" />
    </label>
  );
}

function PaymentOption({ id, payment, setPayment, title, desc }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
        payment === id ? 'border-primary bg-primary-50' : 'border-gray-200'
      }`}
    >
      <input type="radio" checked={payment === id} onChange={() => setPayment(id)} className="accent-primary" />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </label>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
