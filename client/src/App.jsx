import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import StoreLayout from '@/components/layout/StoreLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import ScrollToTop from '@/components/common/ScrollToTop';
import PageLoader from '@/components/common/PageLoader';
import RequireAuth from '@/components/auth/RequireAuth';
import { useAuthListener } from '@/hooks/useAuthListener';

// Lazy-load routes for smaller initial bundles.
const Home = lazy(() => import('@/pages/Home'));
const Products = lazy(() => import('@/pages/Products'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const Cart = lazy(() => import('@/pages/Cart'));
const Wishlist = lazy(() => import('@/pages/Wishlist'));
const Login = lazy(() => import('@/pages/Login'));
const Account = lazy(() => import('@/pages/Account'));
const OrderTracking = lazy(() => import('@/pages/OrderTracking'));
const CorporateEnquiry = lazy(() => import('@/pages/CorporateEnquiry'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Admin
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/Products'));
const AdminOrders = lazy(() => import('@/pages/admin/Orders'));

export default function App() {
  useAuthListener();
  const location = useLocation();

  useEffect(() => {
    // Placeholder for analytics page-view tracking.
  }, [location.pathname]);

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<StoreLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/category/:slug" element={<Products />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            <Route path="/corporate-enquiry" element={<CorporateEnquiry />} />
            {/* Ordering now happens via WhatsApp from the cart — no checkout/OTP page. */}
            <Route path="/checkout" element={<Navigate to="/cart" replace />} />
            <Route
              path="/account/*"
              element={
                <RequireAuth>
                  <Account />
                </RequireAuth>
              }
            />
            <Route path="/track/:orderId" element={<OrderTracking />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route
            path="/admin"
            element={
              <RequireAuth role="admin">
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
