import { useState } from 'react';
import toast from 'react-hot-toast';
import { Building2, Loader2 } from 'lucide-react';

import Seo from '@/components/common/Seo';
import { SITE } from '@/config/site';

export default function CorporateEnquiry() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    quantity: '',
    budget: '',
    message: '',
  });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // In production: POST /api/enquiries → Firestore + email to sales + WhatsApp.
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    toast.success('Enquiry received! Our team will reach out within 24 hours.');
    setForm({ company: '', name: '', email: '', phone: '', quantity: '', budget: '', message: '' });
  };

  const whatsappHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    'Hi, I have a bulk / school stationery order enquiry.'
  )}`;

  return (
    <div className="container-px py-12">
      <Seo title="Bulk & School Orders" description="Bulk stationery orders for schools, offices and institutions — volume pricing and local delivery." />
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <span className="badge bg-primary-100 text-primary-700">For Schools & Offices</span>
          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">Bulk & School Orders</h1>
          <p className="mt-4 text-gray-600">
            Stocking up for a school, office or institution? Get volume pricing on notebooks, pens,
            files, chart paper and more — plus dedicated support and local delivery.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-gray-600">
            <li className="flex items-center gap-2"><Building2 size={18} className="text-primary" /> Best rates on bulk quantities</li>
            <li className="flex items-center gap-2"><Building2 size={18} className="text-primary" /> Volume discounts on 25+ units</li>
            <li className="flex items-center gap-2"><Building2 size={18} className="text-primary" /> GST invoicing & local delivery</li>
          </ul>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-6 inline-flex">
            Chat on WhatsApp
          </a>
        </div>

        <form onSubmit={submit} className="card space-y-4 p-6">
          <h2 className="font-display text-lg font-bold">Request a quote</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="input" placeholder="Company name" value={form.company} onChange={set('company')} required />
            <input className="input" placeholder="Your name" value={form.name} onChange={set('name')} required />
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
            <input className="input" placeholder="Phone" value={form.phone} onChange={set('phone')} required />
            <input className="input" placeholder="Approx. quantity" value={form.quantity} onChange={set('quantity')} />
            <input className="input" placeholder="Budget per unit (₹)" value={form.budget} onChange={set('budget')} />
          </div>
          <textarea
            className="input min-h-28"
            placeholder="Tell us about your requirement…"
            value={form.message}
            onChange={set('message')}
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading && <Loader2 size={18} className="animate-spin" />}
            Submit enquiry
          </button>
        </form>
      </div>
    </div>
  );
}
