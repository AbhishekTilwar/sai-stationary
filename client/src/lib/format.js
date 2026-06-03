import { SITE } from '@/config/site';

export const formatPrice = (value) =>
  `${SITE.currency}${Number(value || 0).toLocaleString('en-IN')}`;

export const discountPercent = (mrp, price) => {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

export const classNames = (...xs) => xs.filter(Boolean).join(' ');
