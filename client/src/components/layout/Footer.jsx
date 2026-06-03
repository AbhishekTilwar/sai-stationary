import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { SITE } from '@/config/site';
import { categories } from '@/data/categories';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-gray-50">
      <div className="container-px grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
              S
            </span>
            <span className="font-display text-lg font-extrabold">{SITE.name}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-gray-500">{SITE.tagline}. Premium gifts and stationery delivered to your door.</p>
          <div className="mt-4 flex gap-3">
            <Social icon={<Instagram size={18} />} />
            <Social icon={<Facebook size={18} />} />
            <Social icon={<Twitter size={18} />} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-500">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link to={`/category/${c.slug}`} className="hover:text-primary">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-500">
            <li><Link to="/corporate-enquiry" className="hover:text-primary">Corporate Gifting</Link></li>
            <li><Link to="/account" className="hover:text-primary">My Account</Link></li>
            <li><Link to="/products" className="hover:text-primary">All Products</Link></li>
            <li><a href="#" className="hover:text-primary">Track Order</a></li>
            <li><a href="#" className="hover:text-primary">Return Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold">Get in touch</h4>
          <ul className="mt-4 space-y-3 text-sm text-gray-500">
            <li className="flex items-center gap-2"><Phone size={16} /> +91 99999 99999</li>
            <li className="flex items-center gap-2"><Mail size={16} /> {SITE.supportEmail}</li>
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-0.5" /> Main Market Road, India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="container-px flex flex-col items-center justify-between gap-2 py-5 text-xs text-gray-400 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Payments secured by Razorpay · UPI · Cards · COD</p>
        </div>
      </div>
    </footer>
  );
}

function Social({ icon }) {
  return (
    <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm hover:text-primary">
      {icon}
    </a>
  );
}
