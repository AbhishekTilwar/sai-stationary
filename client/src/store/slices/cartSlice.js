import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // { id, productId, name, price, image, qty, variant, customization }
  savedForLater: [],
  coupon: null, // { code, type: 'percent'|'flat', value, maxDiscount }
};

const lineKey = (productId, variant) => `${productId}__${variant?.id || 'default'}`;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, qty = 1, variant = null, customization = null } = action.payload;
      const id = lineKey(product.id, variant);
      const existing = state.items.find((i) => i.id === id);
      const unitPrice = product.price + (variant?.priceDelta || 0);
      if (existing) {
        existing.qty += qty;
      } else {
        state.items.push({
          id,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          price: unitPrice,
          mrp: product.mrp,
          image: product.images?.[0],
          qty,
          variant,
          customization,
        });
      }
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) item.qty = Math.max(1, qty);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    saveForLater: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item) {
        state.items = state.items.filter((i) => i.id !== action.payload);
        state.savedForLater.push(item);
      }
    },
    moveToCart: (state, action) => {
      const item = state.savedForLater.find((i) => i.id === action.payload);
      if (item) {
        state.savedForLater = state.savedForLater.filter((i) => i.id !== action.payload);
        const existing = state.items.find((i) => i.id === item.id);
        if (existing) existing.qty += item.qty;
        else state.items.push(item);
      }
    },
    applyCoupon: (state, action) => {
      state.coupon = action.payload;
    },
    removeCoupon: (state) => {
      state.coupon = null;
    },
    clearCart: (state) => {
      state.items = [];
      state.coupon = null;
    },
  },
});

export const {
  addToCart,
  updateQty,
  removeFromCart,
  saveForLater,
  moveToCart,
  applyCoupon,
  removeCoupon,
  clearCart,
} = cartSlice.actions;

// --- Selectors ---
export const selectCartItems = (s) => s.cart.items;
export const selectSavedForLater = (s) => s.cart.savedForLater;
export const selectCoupon = (s) => s.cart.coupon;
export const selectCartCount = (s) => s.cart.items.reduce((n, i) => n + i.qty, 0);
export const selectSubtotal = (s) => s.cart.items.reduce((sum, i) => sum + i.price * i.qty, 0);

export const selectDiscount = (s) => {
  const subtotal = selectSubtotal(s);
  const coupon = s.cart.coupon;
  if (!coupon) return 0;
  let d = coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value;
  if (coupon.maxDiscount) d = Math.min(d, coupon.maxDiscount);
  return Math.min(Math.round(d), subtotal);
};

export default cartSlice.reducer;
