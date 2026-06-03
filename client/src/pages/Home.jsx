import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import Seo from '@/components/common/Seo';
import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeatureStrip from '@/components/home/FeatureStrip';
import Testimonials from '@/components/home/Testimonials';
import Newsletter from '@/components/home/Newsletter';
import SectionHeader from '@/components/common/SectionHeader';
import ProductCarousel from '@/components/product/ProductCarousel';
import { fetchProducts } from '@/services/catalogService';

export default function Home() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(),
  });

  const bestSellers = products.filter((p) => p.bestSeller);
  const newArrivals = products.filter((p) => p.newArrival);
  const festival = products.filter((p) => p.festival);

  return (
    <>
      <Seo
        title="Premium Gifts & Stationery"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: 'Sai Stationary',
          description: 'Premium gifts and stationery store.',
        }}
      />
      <Hero />
      <CategoryGrid />
      <FeatureStrip />

      {isLoading ? (
        <SectionSkeleton />
      ) : (
        <>
          <section className="container-px py-8">
            <SectionHeader title="Best Sellers" subtitle="Most-loved picks this week" to="/products?sort=rating" />
            <ProductCarousel products={bestSellers} />
          </section>

          <section className="container-px py-8">
            <SectionHeader title="New Arrivals" subtitle="Fresh in store" to="/products?sort=newest" />
            <ProductCarousel products={newArrivals} />
          </section>

          {festival.length > 0 && (
            <section className="container-px py-8">
              <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-secondary-500 to-primary-600 p-6 sm:p-8">
                <div className="mb-6 flex items-center justify-between text-white">
                  <div>
                    <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Festival Collection</h2>
                    <p className="mt-1 text-white/85">Diwali · Christmas · Rakhi · Valentine's specials</p>
                  </div>
                  <Link to="/products" className="btn bg-white text-ink hover:bg-gray-100">
                    Shop festive
                  </Link>
                </div>
                <ProductCarousel products={festival} />
              </div>
            </section>
          )}
        </>
      )}

      <Testimonials />
      <Newsletter />
    </>
  );
}

function SectionSkeleton() {
  return (
    <div className="container-px py-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
