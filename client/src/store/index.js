import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import { loadState, saveState } from './persist';

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
    ui: uiReducer,
  },
  preloadedState,
});

// Persist cart + wishlist to localStorage (debounced via microtask batching).
let queued = false;
store.subscribe(() => {
  if (queued) return;
  queued = true;
  queueMicrotask(() => {
    queued = false;
    const { cart, wishlist } = store.getState();
    saveState({ cart, wishlist });
  });
});
