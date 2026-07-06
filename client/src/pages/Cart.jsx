import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, Trash2, Tag, ShoppingBag, Bookmark, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import Seo from '@/components/common/Seo';
import {
  selectCartItems,
  selectSubtotal,
  selectDiscount,
  selectSavedForLater,
  selectCoupon,
  updateQty,
  removeFromCart,
  saveForLater,
  moveToCart,
  applyCoupon,
  removeCoupon,
} from '@/store/slices/cartSlice';
import { formatPrice } from '@/lib/format';
import { validateCoupon } from '@/services/couponService';
import { sendCartToWhatsApp } from '@/lib/whatsapp';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const saved = useSelector(selectSavedForLater);
  const subtotal = useSelector(selectSubtotal);
  const discount = useSelector(selectDiscount);
  const coupon = useSelector(selectCoupon);
  const [code, setCode] = useState('');

  const total = Math.max(0, subtotal - discount);

  const handleApplyCoupon = () => {
    const result = validateCoupon(code.trim(), subtotal);
    if (result.valid) {
      dispatch(applyCoupon(result.coupon));
      toast.success(`Coupon ${result.coupon.code} applied!`);
    } else {
      toast.error(result.message);
    }
  };

  if (items.length === 0 && saved.length === 0) {
    return (
      <div className="container-px py-20 text-center">
        <Seo title="Cart" />
        <ShoppingBag size={56} className="mx-auto text-gray-300" />
        <h1 className="mt-4 font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-gray-500">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary mt-6">Start shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-px py-8">
      <Seo title="Cart" />
      <h1 className="mb-6 font-display text-2xl font-extrabold sm:text-3xl">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card flex gap-4 p-4">
              <Link to={`/product/${item.slug}`} className="shrink-0">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link to={`/product/${item.slug}`} className="font-semibold hover:text-primary">
                      {item.name}
                    </Link>
                    {item.variant && <p className="text-xs text-gray-400">{item.variant.label}</p>}
                    {item.customization && (
                      <p className="text-xs text-accent-600">Personalized ✨</p>
                    )}
                  </div>
                  <p className="font-bold">{formatPrice(item.price * item.qty)}</p>
                </div>
                <div className="mt-auto flex items-center gap-2 pt-3">
                  <div className="flex items-center rounded-lg border border-gray-200">
                    <button onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty - 1 }))} className="px-2 py-1.5">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{item.qty}</span>
                    <button onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))} className="px-2 py-1.5">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => dispatch(saveForLater(item.id))}
                    className="ml-2 flex items-center gap-1 text-xs text-gray-500 hover:text-primary"
                  >
                    <Bookmark size={14} /> Save for later
                  </button>
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="ml-auto text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {saved.length > 0 && (
            <div className="pt-4">
              <h2 className="mb-3 font-display text-lg font-bold">Saved for later ({saved.length})</h2>
              <div className="space-y-3">
                {saved.map((item) => (
                  <div key={item.id} className="card flex items-center gap-4 p-3">
                    <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-sm font-semibold text-primary">{formatPrice(item.price)}</p>
                    </div>
                    <button onClick={() => dispatch(moveToCart(item.id))} className="btn-outline text-xs">
                      Move to cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <aside className="h-fit lg:sticky lg:top-32">
            <div className="card p-5">
              <h2 className="font-display text-lg font-bold">Order Summary</h2>

              <div className="mt-4 flex gap-2">
                <div className="relative flex-1">
                  <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Coupon code"
                    className="input pl-9 uppercase"
                  />
                </div>
                <button onClick={handleApplyCoupon} className="btn-secondary">Apply</button>
              </div>
              {coupon && (
                <div className="mt-2 flex items-center justify-between rounded-lg bg-accent-50 px-3 py-2 text-sm text-accent-600">
                  <span>{coupon.code} applied</span>
                  <button onClick={() => dispatch(removeCoupon())} className="text-xs underline">Remove</button>
                </div>
              )}
              <p className="mt-2 text-xs text-gray-400">Try <b>WELCOME10</b>, <b>FLAT100</b> or <b>FIRST50</b></p>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                <Row label="Subtotal" value={formatPrice(subtotal)} />
                {discount > 0 && <Row label="Discount" value={`- ${formatPrice(discount)}`} highlight />}
                <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-gray-400">+ delivery charges as applicable</p>
              </div>

              <button
                onClick={() => sendCartToWhatsApp(items, { subtotal, discount })}
                className="btn mt-5 w-full bg-[#25D366] text-white hover:brightness-95"
              >
                <MessageCircle size={18} /> Order on WhatsApp
              </button>
              <p className="mt-2 text-center text-xs text-gray-400">
                Your order & prices open in WhatsApp — just hit send.
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={highlight ? 'font-semibold text-accent-600' : 'font-medium'}>{value}</span>
    </div>
  );
}
