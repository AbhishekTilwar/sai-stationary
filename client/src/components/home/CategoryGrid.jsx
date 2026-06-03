import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categories } from '@/data/categories';
import SectionHeader from '@/components/common/SectionHeader';

export default function CategoryGrid() {
  return (
    <section className="container-px py-12">
      <SectionHeader title="Shop by Category" subtitle="Find exactly what you're looking for" to="/products" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {categories.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
          >
            <Link
              to={`/category/${c.slug}`}
              className={`flex flex-col items-center gap-2 rounded-2xl ${c.color} p-4 text-center transition-transform hover:-translate-y-1`}
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-xs font-semibold text-ink">{c.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
