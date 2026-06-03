import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null, // { uid, name, email, photoURL, role }
    status: 'idle', // idle | loading | authenticated | guest
  },
  reducers: {
    setAuthLoading: (state) => {
      state.status = 'loading';
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = action.payload ? 'authenticated' : 'guest';
    },
    logout: (state) => {
      state.user = null;
      state.status = 'guest';
    },
  },
});

export const { setAuthLoading, setUser, logout } = authSlice.actions;
export const selectUser = (s) => s.auth.user;
export const selectIsAdmin = (s) => s.auth.user?.role === 'admin';
export const selectAuthStatus = (s) => s.auth.status;
export default authSlice.reducer;
