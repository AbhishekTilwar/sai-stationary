import { SITE } from '@/config/site';
import { formatPrice } from '@/lib/format';

// Builds a human-readable order summary to send to the shop over WhatsApp.
// This is the "WhatsApp ordering" flow local shops rely on: on checkout we open
// a pre-filled message to the business number so the owner instantly receives
// the full order — no backend required.
export function buildOrderMessage(order) {
  const { id, items = [], address = {}, delivery = {}, payment = {}, totals = {} } = order;
  const L = [];

  L.push(`🛍️ *New Order — ${SITE.name}*`);
  L.push(`Order ID: *${id}*`);
  L.push('');
  L.push('*Items:*');
  items.forEach((it, i) => {
    const variant = it.variant?.label ? ` (${it.variant.label})` : '';
    L.push(`${i + 1}. ${it.name}${variant} × ${it.qty} — ${formatPrice(it.price * it.qty)}`);
    if (it.customization?.text) L.push(`   ✍️ Personalization: ${it.customization.text}`);
    if (it.customization?.imageName) L.push(`   🖼️ Photo: ${it.customization.imageName}`);
  });

  L.push('');
  L.push('*Bill:*');
  L.push(`Subtotal: ${formatPrice(totals.subtotal)}`);
  if (totals.discount) L.push(`Discount: -${formatPrice(totals.discount)}`);
  L.push(`Delivery: ${totals.shipping ? formatPrice(totals.shipping) : 'FREE'}`);
  L.push(`*Total: ${formatPrice(totals.total)}*`);

  L.push('');
  L.push('*Deliver to:*');
  L.push(`${address.name} (${address.phone})`);
  L.push(`${address.line1}, ${address.city}, ${address.state} - ${address.pincode}`);

  L.push('');
  L.push(`Delivery: ${delivery.label || '—'}${delivery.eta ? ` (${delivery.eta})` : ''}`);
  L.push(`Payment: ${String(payment.method || '').toUpperCase()}`);

  return L.join('\n');
}

// Returns the wa.me deep link to the business number with the order pre-filled.
export function orderWhatsAppLink(order, phone = SITE.whatsapp) {
  const text = encodeURIComponent(buildOrderMessage(order));
  return `https://wa.me/${phone}?text=${text}`;
}

// Opens WhatsApp with the order message. Uses a real anchor click so mobile
// browsers open the WhatsApp app reliably (and it isn't treated as a popup).
export function sendOrderToWhatsApp(order, phone = SITE.whatsapp) {
  const url = orderWhatsAppLink(order, phone);
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  a.remove();
  return url;
}
