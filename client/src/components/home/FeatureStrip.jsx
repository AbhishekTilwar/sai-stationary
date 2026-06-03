import { Truck, ShieldCheck, RefreshCw, Headphones } from 'lucide-react';

const features = [
  { icon: Truck, title: 'Fast Delivery', text: 'Same-day local dispatch' },
  { icon: ShieldCheck, title: 'Secure Payments', text: 'Razorpay · UPI · COD' },
  { icon: RefreshCw, title: 'Easy Returns', text: '7-day return policy' },
  { icon: Headphones, title: 'WhatsApp Support', text: 'Chat with us anytime' },
];

export default function FeatureStrip() {
  return (
    <section className="container-px py-8">
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-6 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary">
              <Icon size={22} />
            </span>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-gray-500">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
