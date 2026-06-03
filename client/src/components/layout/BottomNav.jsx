import { NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Home, LayoutGrid, Heart, ShoppingCart, User } from 'lucide-react';

import { selectCartCount } from '@/store/slices/cartSlice';
import { selectWishlistIds } from '@/store/slices/wishlistSlice';
import { selectUser } from '@/store/slices/authSlice';
import { openCartDrawer } from '@/store/slices/uiSlice';

// Fixed bottom tab bar for mobile — the primary nav pattern for mobile commerce.
export default function BottomNav() {
  const dispatch = useDispatch();
  const location = useLocation();
  const cartCount = useSelector(selectCartCount);
  const wishlist = useSelector(selectWishlistIds);
  const user = useSelector(selectUser);

  // Hide on checkout to keep focus on the flow.
  if (location.pathname.startsWith('/checkout')) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-100 bg-white/95 backdrop-blur lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        <Tab to="/" icon={Home} label="Home" />
        <Tab to="/products" icon={LayoutGrid} label="Shop" />
        <Tab to="/wishlist" icon={Heart} label="Wishlist" badge={wishlist.length} />
        <button
          onClick={() => dispatch(openCartDrawer())}
          className="flex flex-col items-center gap-0.5 py-2 text-gray-500"
        >
          <span className="relative">
            <ShoppingCart size={22} />
            {cartCount > 0 && <Badge count={cartCount} />}
          </span>
          <span className="text-[10px] font-medium">Cart</span>
        </button>
        <Tab to={user ? '/account' : '/login'} icon={User} label="Account" />
      </div>
    </nav>
  );
}

function Tab({ to, icon: Icon, label, badge = 0 }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex flex-col items-center gap-0.5 py-2 ${isActive ? 'text-primary' : 'text-gray-500'}`
      }
    >
      <span className="relative">
        <Icon size={22} />
        {badge > 0 && <Badge count={badge} />}
      </span>
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
}

function Badge({ count }) {
  return (
    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[9px] font-bold text-white">
      {count > 9 ? '9+' : count}
    </span>
  );
}
