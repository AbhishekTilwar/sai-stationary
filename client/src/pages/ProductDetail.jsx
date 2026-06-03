import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Minus, Plus, ShoppingCart, Truck, ShieldCheck, Upload, Check } from 'lucide-react';
import toast from 'react-hot-toast';

import Seo from '@/components/common/Seo';
import Rating from '@/components/common/Rating';
import PageLoader from '@/components/common/PageLoader';
import ProductCard from '@/components/product/ProductCard';
import { fetchProductBySlug, fetchRelated } from '@/services/catalogService';
import { addToCart } from '@/store/slices/cartSlice';
import { toggleWishlist, selectWishlistIds } from '@/store/slices/wishlistSlice';
import { openCartDrawer } from '@/store/slices/uiSlice';
import { formatPrice, discountPercent } from '@/lib/format';

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlistIds);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug),
  });

  const { data: related = [] } = useQuery({
    queryKey: ['related', product?.id],
    queryFn: () => fetchRelated(product),
    enabled: !!product,
  });

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState(null);
  const [customText, setCustomText] = useState('');
  const [customImage, setCustomImage] = useState(null);

  if (isLoading) return <PageLoader />;
  if (!product) {
    return (
      <div className="container-px py-20 text-center">
        <p className="text-lg font-semibold">Product not found</p>
        <Link to="/products" className="btn-primary mt-4">Back to shop</Link>
      </div>
    );
  }

  const selectedVariant = variant || product.variants?.[0] || null;
  const unitPrice = product.price + (selectedVariant?.priceDelta || 0);
  const off = discountPercent(product.mrp, product.price);
  const wishlisted = wishlist.includes(product.id);

  const handleAdd = () => {
    const customization =
      product.customizable && (customText || customImage)
        ? { text: customText, imageName: customImage?.name || null }
        : null;
    dispatch(addToCart({ product, qty, variant: selectedVariant, customization }));
    dispatch(openCartDrawer());
    toast.success('Added to cart');
  };

  return (
    <div className="container-px py-6 pb-28 sm:py-8 lg:pb-8">
      <Seo
        title={product.name}
        description={product.shortDescription}
        image={product.images[0]}
        type="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          image: product.images,
          description: product.shortDescription,
          brand: { '@type': 'Brand', name: product.brand },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          },
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'INR',
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        }}
      />

      <nav className="mb-5 text-sm text-gray-400">
        <Link to="/" className="hover:text-primary">Home</Link> /{' '}
        <Link to={`/category/${product.category}`} className="hover:text-primary capitalize">
          {product.category.replace('-', ' ')}
        </Link>{' '}
        / <span className="text-gray-600">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
            <img
              src={product.images[activeImg]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-125"
            />
          </div>
          <div className="mt-3 flex gap-3">
            {product.images.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${
                  i === activeImg ? 'border-primary' : 'border-transparent'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-gray-400">{product.brand}</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <Rating value={product.rating} count={product.reviewCount} size={16} />
            {product.stock > 0 ? (
              <span className="badge bg-accent-100 text-accent-600">In stock</span>
            ) : (
              <span className="badge bg-red-100 text-red-600">Out of stock</span>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold">{formatPrice(unitPrice)}</span>
            {product.mrp > unitPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.mrp)}</span>
                <span className="badge bg-accent-500 text-white">{off}% OFF</span>
              </>
            )}
          </div>

          <p className="mt-4 text-gray-600">{product.description}</p>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">Options</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => {
                  const active = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVariant(v)}
                      className={`rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                        active ? 'border-primary bg-primary-50 text-primary' : 'border-gray-200 hover:border-primary'
                      }`}
                    >
                      {v.label}
                      {v.priceDelta ? ` (${v.priceDelta > 0 ? '+' : ''}${formatPrice(v.priceDelta)})` : ''}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customization upload */}
          {product.customizable && (
            <div className="mt-6 rounded-2xl border border-dashed border-accent-500 bg-accent-50 p-4">
              <p className="text-sm font-semibold text-accent-600">Personalize this gift ✨</p>
              <input
                type="text"
                placeholder="Text to print (e.g. a name or message)"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="input mt-3"
              />
              <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm">
                {customImage ? <Check size={16} className="text-accent-600" /> : <Upload size={16} />}
                <span className="truncate">{customImage ? customImage.name : 'Upload your photo (JPG/PNG)'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => setCustomImage(e.target.files?.[0] || null)}
                />
              </label>
            </div>
          )}

          {/* Quantity + actions */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-xl border border-gray-200">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2.5 hover:text-primary">
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2.5 hover:text-primary">
                <Plus size={16} />
              </button>
            </div>
            <button onClick={handleAdd} disabled={product.stock === 0} className="btn-primary flex-1">
              <ShoppingCart size={18} /> Add to cart
            </button>
            <button
              onClick={() => dispatch(toggleWishlist(product.id))}
              className="btn-outline px-3"
              aria-label="Wishlist"
            >
              <Heart size={18} className={wishlisted ? 'fill-red-500 text-red-500' : ''} />
            </button>
          </div>

          {/* Trust */}
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Truck size={18} className="text-primary" /> Fast local delivery
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <ShieldCheck size={18} className="text-primary" /> Secure payment & COD
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection product={product} />

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-extrabold">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile sticky add-to-cart bar */}
      <div className="fixed inset-x-0 bottom-16 z-30 flex items-center gap-3 border-t border-gray-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="leading-tight">
          <p className="text-lg font-extrabold">{formatPrice(unitPrice)}</p>
          {product.mrp > unitPrice && (
            <p className="text-xs text-gray-400 line-through">{formatPrice(product.mrp)}</p>
          )}
        </div>
        <button onClick={handleAdd} disabled={product.stock === 0} className="btn-primary flex-1">
          <ShoppingCart size={18} /> Add to cart
        </button>
      </div>
    </div>
  );
}

function ReviewSection({ product }) {
  const reviews = [
    { name: 'Verified Buyer', rating: 5, text: 'Exactly as described. Fast delivery and great packaging.', date: '2 weeks ago' },
    { name: 'Verified Buyer', rating: 4, text: 'Good quality for the price. Would buy again.', date: '1 month ago' },
  ];
  return (
    <section className="mt-16">
      <h2 className="mb-6 font-display text-2xl font-extrabold">Ratings & Reviews</h2>
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <div className="card flex flex-col items-center justify-center p-6 text-center">
          <p className="text-5xl font-extrabold">{product.rating}</p>
          <Rating value={product.rating} size={18} />
          <p className="mt-2 text-sm text-gray-500">{product.reviewCount} ratings</p>
        </div>
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <div key={i} className="card p-5">
              <div className="flex items-center justify-between">
                <Rating value={r.rating} size={14} />
                <span className="text-xs text-gray-400">{r.date}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{r.text}</p>
              <p className="mt-2 text-xs font-semibold text-gray-500">{r.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
