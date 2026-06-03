import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import BottomNav from './BottomNav';
import CartDrawer from '@/components/cart/CartDrawer';

export default function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* Extra bottom padding on mobile to clear the fixed bottom nav. */}
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
      <BottomNav />
    </div>
  );
}
