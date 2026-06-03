// Central site configuration & brand constants.
export const SITE = {
  name: import.meta.env.VITE_STORE_NAME || 'Sai Stationary',
  tagline: 'Gifts & Stationery, beautifully delivered',
  whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  currency: '₹',
  freeShippingThreshold: 499,
  supportEmail: 'support@saistationary.com',
};

export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const ORDER_STATUS_FLOW = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.PACKED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
];

export const PAYMENT_METHODS = {
  RAZORPAY: 'razorpay',
  UPI: 'upi',
  CARD: 'card',
  COD: 'cod',
};
