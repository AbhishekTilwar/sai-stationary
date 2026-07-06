import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const slides = [
  {
    eyebrow: 'Back To School',
    title: 'Notebooks, pens & pencils for the new term',
    subtitle: 'Classmate, Navneet, Apsara, DOMS & more at everyday low prices.',
    cta: 'Shop Now',
    to: '/category/notebooks',
    bg: 'from-primary-600 to-primary-800',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80',
  },
  {
    eyebrow: 'Chart Paper & Craft',
    title: 'Project supplies, ready when you are',
    subtitle: 'Chart paper from ₹6, colours, glue, sketch pens and more.',
    cta: 'Explore',
    to: '/category/chart-paper',
    bg: 'from-secondary-500 to-secondary-600',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&q=80',
  },
  {
    eyebrow: 'Order on WhatsApp',
    title: 'Add to cart & order in one tap',
    subtitle: 'Send your list to us on WhatsApp — we confirm & deliver locally.',
    cta: 'Start Shopping',
    to: '/products',
    bg: 'from-accent-500 to-accent-600',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80',
  },
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);
  const slide = slides[index];

  return (
    <section className="container-px pt-6">
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${slide.bg}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid items-center gap-6 p-8 sm:p-12 md:grid-cols-2 lg:p-16"
          >
            <div className="text-white">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm font-semibold uppercase tracking-widest text-white/80"
              >
                {slide.eyebrow}
              </motion.p>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl"
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-3 max-w-md text-white/90"
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex gap-3"
              >
                <Link to={slide.to} className="btn bg-white text-ink hover:bg-gray-100">
                  {slide.cta}
                </Link>
                <Link to="/products" className="btn border border-white/40 text-white hover:bg-white/10">
                  Browse all
                </Link>
              </motion.div>
            </div>
            <div className="hidden md:block">
              <img
                src={slide.image}
                alt={slide.title}
                className="ml-auto h-72 w-full max-w-md rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute bottom-5 left-8 flex gap-2 lg:left-16">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-white' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
