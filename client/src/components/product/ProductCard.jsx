import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

import Rating from '@/components/common/Rating';
import { PRODUCT_IMAGE_FALLBACK } from '@/data/products';
import { formatPrice, discountPercent, classNames } from '@/lib/format';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist, selectWishlistIds } from '@/store/slices/wishlistSlice';
import { openCartDrawer } from '@/store/slices/uiSlice';

const badgeStyles = {
  bestseller: 'bg-secondary-100 text-secondary-600',
  newarrival: 'bg-accent-100 text-accent-600',
  festival: 'bg-primary-100 text-primary-700',
  premium: 'bg-ink text-white',
  customizable: 'bg-accent-500 text-white',
};

const badgeLabel = {
  bestseller: 'Bestseller',
  newarrival: 'New',
  festival: 'Festive',
  premium: 'Premium',
  customizable: 'Customizable',
};

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlistIds);
  const wishlisted = wishlist.includes(product.id);
  const off = discountPercent(product.mrp, product.price);

  const handleAdd = (e) => {
    e.preventDefault();
    dispatch(addToCart({ product, qty: 1 }));
    dispatch(openCartDrawer());
    toast.success('Added to cart');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product.id));
    toast(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist', { icon: '❤️' });
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/product/${product.slug}`}
        className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition-shadow hover:shadow-card-hover"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = PRODUCT_IMAGE_FALLBACK; }}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.badges?.slice(0, 2).map((b) => (
              <span key={b} className={classNames('badge', badgeStyles[b] || 'bg-gray-100 text-gray-600')}>
                {badgeLabel[b] || b}
              </span>
            ))}
          </div>
          <button
            onClick={handleWishlist}
            aria-label="Toggle wishlist"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors hover:text-red-500"
          >
            <Heart size={18} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
          </button>
          {off > 0 && (
            <span className="absolute bottom-3 left-3 badge bg-accent-500 text-white">{off}% OFF</span>
          )}
        </div>

        <div className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">{product.brand}</p>
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-ink">{product.name}</h3>
          <div className="mt-2">
            <Rating value={product.rating} count={product.reviewCount} />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-ink">{formatPrice(product.price)}</span>
              {product.mrp > product.price && (
                <span className="text-xs text-gray-400 line-through">{formatPrice(product.mrp)}</span>
              )}
            </div>
            <button
              onClick={handleAdd}
              aria-label="Add to cart"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white transition-transform hover:scale-105"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
