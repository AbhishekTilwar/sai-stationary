import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X, Trash2, Minus, Plus, ShoppingBag, MessageCircle } from 'lucide-react';

import { closeCartDrawer } from '@/store/slices/uiSlice';
import {
  selectCartItems,
  selectSubtotal,
  selectDiscount,
  updateQty,
  removeFromCart,
} from '@/store/slices/cartSlice';
import { formatPrice } from '@/lib/format';
import { sendCartToWhatsApp } from '@/lib/whatsapp';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const open = useSelector((s) => s.ui.cartDrawerOpen);
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectSubtotal);
  const discount = useSelector(selectDiscount);

  const orderOnWhatsApp = () => {
    sendCartToWhatsApp(items, { subtotal, discount });
    dispatch(closeCartDrawer());
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCartDrawer())}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <h3 className="font-display text-lg font-bold">Your Cart ({items.length})</h3>
              <button onClick={() => dispatch(closeCartDrawer())} className="rounded-lg p-2 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <ShoppingBag size={48} className="text-gray-300" />
                <p className="text-gray-500">Your cart is empty</p>
                <Link to="/products" onClick={() => dispatch(closeCartDrawer())} className="btn-primary">
                  Start shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="line-clamp-2 text-sm font-medium">{item.name}</p>
                        {item.variant && <p className="text-xs text-gray-400">{item.variant.label}</p>}
                        <p className="mt-1 text-sm font-semibold text-primary">{formatPrice(item.price)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <QtyBtn onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty - 1 }))}>
                            <Minus size={14} />
                          </QtyBtn>
                          <span className="w-6 text-center text-sm">{item.qty}</span>
                          <QtyBtn onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}>
                            <Plus size={14} />
                          </QtyBtn>
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
                </div>

                <div className="border-t border-gray-100 p-4">
                  <div className="mb-3 flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <button onClick={orderOnWhatsApp} className="btn w-full bg-[#25D366] text-white hover:brightness-95">
                    <MessageCircle size={18} /> Order on WhatsApp
                  </button>
                  <Link
                    to="/cart"
                    onClick={() => dispatch(closeCartDrawer())}
                    className="btn-ghost mt-2 w-full"
                  >
                    View full cart
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function QtyBtn({ children, onClick }) {
  return (
    <button onClick={onClick} className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 hover:border-primary hover:text-primary">
      {children}
    </button>
  );
}
