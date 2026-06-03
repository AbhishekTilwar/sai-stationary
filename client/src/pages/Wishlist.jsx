import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { Heart } from 'lucide-react';

import Seo from '@/components/common/Seo';
import ProductCard from '@/components/product/ProductCard';
import { selectWishlistIds } from '@/store/slices/wishlistSlice';
import { fetchProducts } from '@/services/catalogService';

export default function Wishlist() {
  const ids = useSelector(selectWishlistIds);
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: () => fetchProducts() });
  const wishlisted = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container-px py-8">
      <Seo title="Wishlist" />
      <h1 className="mb-6 font-display text-2xl font-extrabold sm:text-3xl">My Wishlist</h1>

      {wishlisted.length === 0 ? (
        <div className="card flex flex-col items-center gap-3 py-20 text-center">
          <Heart size={48} className="text-gray-300" />
          <p className="text-lg font-semibold">Your wishlist is empty</p>
          <p className="text-sm text-gray-500">Tap the heart on any product to save it here.</p>
          <Link to="/products" className="btn-primary mt-2">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {wishlisted.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
