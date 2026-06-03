// Coupon validation. In production, coupons live in Firestore `coupons` and are
// validated server-side at checkout (the client check is only for UX). The demo
// uses a small in-memory table.
const COUPONS = {
  WELCOME10: { code: 'WELCOME10', type: 'percent', value: 10, maxDiscount: 150, minOrder: 0 },
  FLAT100: { code: 'FLAT100', type: 'flat', value: 100, minOrder: 499 },
  FIRST50: { code: 'FIRST50', type: 'flat', value: 50, minOrder: 0, firstOrderOnly: true },
};

export function validateCoupon(code, subtotal) {
  const coupon = COUPONS[code];
  if (!coupon) return { valid: false, message: 'Invalid coupon code' };
  if (subtotal < (coupon.minOrder || 0)) {
    return { valid: false, message: `Minimum order ₹${coupon.minOrder} required` };
  }
  return { valid: true, coupon };
}

export const listCoupons = () => Object.values(COUPONS);
