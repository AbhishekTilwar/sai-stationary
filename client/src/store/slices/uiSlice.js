import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    cartDrawerOpen: false,
    mobileMenuOpen: false,
    searchOpen: false,
  },
  reducers: {
    openCartDrawer: (s) => { s.cartDrawerOpen = true; },
    closeCartDrawer: (s) => { s.cartDrawerOpen = false; },
    toggleMobileMenu: (s) => { s.mobileMenuOpen = !s.mobileMenuOpen; },
    closeMobileMenu: (s) => { s.mobileMenuOpen = false; },
    toggleSearch: (s) => { s.searchOpen = !s.searchOpen; },
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleMobileMenu,
  closeMobileMenu,
  toggleSearch,
} = uiSlice.actions;
export default uiSlice.reducer;
