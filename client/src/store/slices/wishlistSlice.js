import { createSlice } from '@reduxjs/toolkit';

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { ids: [] },
  reducers: {
    toggleWishlist: (state, action) => {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((x) => x !== id);
      } else {
        state.ids.push(id);
      }
    },
    removeFromWishlist: (state, action) => {
      state.ids = state.ids.filter((x) => x !== action.payload);
    },
    clearWishlist: (state) => {
      state.ids = [];
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export const selectWishlistIds = (s) => s.wishlist.ids;
export const selectIsWishlisted = (id) => (s) => s.wishlist.ids.includes(id);
export default wishlistSlice.reducer;
