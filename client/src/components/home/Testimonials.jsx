import { motion } from 'framer-motion';
import Rating from '@/components/common/Rating';

const reviews = [
  { name: 'Priya S.', text: 'The Diwali hamper was beautifully packed and arrived on time. My family loved it!', rating: 5, city: 'Pune' },
  { name: 'Rahul M.', text: 'Ordered customized mugs for my team. Quality print and great service over WhatsApp.', rating: 5, city: 'Mumbai' },
  { name: 'Aisha K.', text: 'Back-to-school combo saved me so much time. Everything my kids needed in one box.', rating: 4, city: 'Delhi' },
];

export default function Testimonials() {
  return (
    <section className="container-px py-14">
      <div className="mb-8 text-center">
        <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Loved by our customers</h2>
        <p className="mt-1 text-sm text-gray-500">Real reviews from happy shoppers</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="card p-6"
          >
            <Rating value={r.rating} size={16} />
            <p className="mt-3 text-sm text-gray-600">“{r.text}”</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 font-bold text-primary">
                {r.name[0]}
              </span>
              <div>
                <p className="text-sm font-semibold">{r.name}</p>
                <p className="text-xs text-gray-400">{r.city}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
