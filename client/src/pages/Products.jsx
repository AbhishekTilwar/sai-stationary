import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SlidersHorizontal, X } from 'lucide-react';

import Seo from '@/components/common/Seo';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/product/FilterSidebar';
import { fetchProducts } from '@/services/catalogService';
import { categories } from '@/data/categories';

export default function Products() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || undefined;
  const sortParam = searchParams.get('sort') || undefined;

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(sortParam || 'relevance');
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    setFilters((f) => ({ ...f, category: slug || undefined }));
  }, [slug]);

  useEffect(() => {
    if (sortParam) setSort(sortParam);
  }, [sortParam]);

  const queryFilters = useMemo(() => ({ ...filters, q, sort }), [filters, q, sort]);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', queryFilters],
    queryFn: () => fetchProducts(queryFilters),
  });

  const category = categories.find((c) => c.slug === slug);
  const heading = category ? category.name : q ? `Results for "${q}"` : 'All Products';

  return (
    <div className="container-px py-8">
      <Seo title={heading} />
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold sm:text-3xl">{heading}</h1>
        <p className="mt-1 text-sm text-gray-500">{products.length} products</p>
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-32 card p-5">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>
        </aside>

        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              onClick={() => setMobileFilters(true)}
              className="btn-outline lg:hidden"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input ml-auto w-auto"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="card flex flex-col items-center gap-2 py-20 text-center">
              <p className="text-lg font-semibold">No products found</p>
              <p className="text-sm text-gray-500">Try adjusting your filters or search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-white p-5">
            <button
              onClick={() => setMobileFilters(false)}
              className="absolute right-4 top-4 rounded-lg p-1 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
            <FilterSidebar filters={filters} setFilters={setFilters} onClose={() => setMobileFilters(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
