import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (!email) return;
    // In production: POST /api/newsletter → store in Firestore + email provider.
    toast.success('Subscribed! Watch your inbox for offers.');
    setEmail('');
  };
  return (
    <section className="container-px py-12">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-center text-white sm:p-12">
        <Mail size={36} className="mx-auto" />
        <h2 className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">Get 10% off your first order</h2>
        <p className="mx-auto mt-2 max-w-md text-white/85">
          Subscribe for new arrivals, festive offers and exclusive discounts.
        </p>
        <form onSubmit={submit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="input flex-1 border-transparent text-ink"
          />
          <button type="submit" className="btn bg-secondary text-white hover:bg-secondary-600">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
