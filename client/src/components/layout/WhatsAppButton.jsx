import { MessageCircle } from 'lucide-react';
import { SITE } from '@/config/site';

export default function WhatsAppButton() {
  const href = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    `Hi ${SITE.name}, I'd like to know more about your products.`
  )}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 lg:bottom-5 lg:right-5 lg:h-14 lg:w-14"
    >
      <MessageCircle size={26} />
    </a>
  );
}
