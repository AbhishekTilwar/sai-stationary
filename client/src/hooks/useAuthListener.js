import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, setAuthLoading } from '@/store/slices/authSlice';
import { subscribeToAuth } from '@/services/authService';

export function useAuthListener() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAuthLoading());
    const unsub = subscribeToAuth((user) => dispatch(setUser(user)));
    return () => unsub && unsub();
  }, [dispatch]);
}
