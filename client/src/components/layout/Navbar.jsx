import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search, ShoppingCart, Heart, User, Menu, X } from 'lucide-react';

import { SITE } from '@/config/site';
import { categories } from '@/data/categories';
import { selectCartCount } from '@/store/slices/cartSlice';
import { selectWishlistIds } from '@/store/slices/wishlistSlice';
import { selectUser } from '@/store/slices/authSlice';
import { openCartDrawer } from '@/store/slices/uiSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector(selectCartCount);
  const wishlist = useSelector(selectWishlistIds);
  const user = useSelector(selectUser);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
      {/* Top promo bar */}
      <div className="bg-primary text-center text-xs font-medium text-white">
        <div className="container-px py-1.5">
          🎉 Free shipping on orders above {SITE.currency}
          {SITE.freeShippingThreshold} · Use code <span className="font-bold">WELCOME10</span> for 10% off
        </div>
      </div>

      <div className="container-px flex h-16 items-center gap-4">
        <button
          className="lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
            S
          </span>
          <span className="hidden font-display text-lg font-extrabold text-ink sm:block">
            {SITE.name}
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={onSearch} className="relative hidden flex-1 md:block">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for gifts, pens, notebooks…"
            className="input pl-10"
          />
        </form>

        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link to="/wishlist" className="relative rounded-xl p-2.5 hover:bg-gray-100" aria-label="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && <Dot count={wishlist.length} />}
          </Link>
          <button
            onClick={() => dispatch(openCartDrawer())}
            className="relative rounded-xl p-2.5 hover:bg-gray-100"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && <Dot count={cartCount} />}
          </button>
          <Link
            to={user ? '/account' : '/login'}
            className="flex items-center gap-2 rounded-xl p-2.5 hover:bg-gray-100"
            aria-label="Account"
          >
            <User size={20} />
            <span className="hidden text-sm font-medium lg:block">
              {user ? (user.name?.startsWith('+') ? 'Account' : user.name.split(' ')[0]) : 'Login'}
            </span>
          </Link>
        </nav>
      </div>

      {/* Mobile search (always visible on small screens) */}
      <div className="border-t border-gray-100 px-4 py-2.5 md:hidden">
        <form onSubmit={onSearch} className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search gifts, pens, notebooks…"
            className="input pl-10"
          />
        </form>
      </div>

      {/* Category nav */}
      <div className="hidden border-t border-gray-100 lg:block">
        <div className="container-px flex h-11 items-center gap-6 overflow-x-auto no-scrollbar">
          <NavLink to="/products" className={navItemClass}>
            All Products
          </NavLink>
          {categories.map((c) => (
            <NavLink key={c.id} to={`/category/${c.slug}`} className={navItemClass}>
              {c.name}
            </NavLink>
          ))}
          <NavLink to="/corporate-enquiry" className={navItemClass}>
            Corporate Gifting
          </NavLink>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="grid grid-cols-2 gap-1 p-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/category/${c.slug}`}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 text-sm hover:bg-gray-100"
              >
                {c.icon} {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

const navItemClass = ({ isActive }) =>
  `whitespace-nowrap text-sm font-medium transition-colors ${
    isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'
  }`;

function Dot({ count }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold text-white">
      {count > 9 ? '9+' : count}
    </span>
  );
}
