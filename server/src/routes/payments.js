import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  getRazorpay,
  verifyPaymentSignature,
  verifyWebhookSignature,
} from '../services/razorpay.js';

const router = Router();

// 1) Create a Razorpay order. Amount is computed/validated server-side in
//    production (recompute from the cart in Firestore — never trust the client).
router.post('/create-order', requireAuth, async (req, res, next) => {
  try {
    const { amount, orderId } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const razorpay = getRazorpay();
    if (!razorpay) {
      // Demo fallback so the client flow can be exercised without keys.
      return res.json({
        razorpayOrderId: `order_demo_${Date.now()}`,
        amount,
        currency: 'INR',
        demo: true,
      });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: orderId,
    });
    res.json({ razorpayOrderId: order.id, amount, currency: 'INR' });
  } catch (err) {
    next(err);
  }
});

// 2) Verify the payment signature, then mark the order paid in Firestore.
router.post('/verify', requireAuth, async (req, res, next) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const ok = verifyPaymentSignature({ orderId, paymentId, signature });
    if (!ok) return res.status(400).json({ error: 'Payment verification failed' });
    // TODO: update orders/{orderId} -> { paymentStatus: 'paid', paymentId }
    res.json({ verified: true });
  } catch (err) {
    next(err);
  }
});

// 3) Razorpay webhook (raw body mounted in index.js).
router.post('/webhook', (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const ok = verifyWebhookSignature(req.body, signature);
  if (!ok) return res.status(400).json({ error: 'Invalid webhook signature' });
  const event = JSON.parse(req.body.toString());
  // TODO: handle payment.captured / payment.failed / refund.processed
  // eslint-disable-next-line no-console
  console.log('[webhook] event:', event.event);
  res.json({ received: true });
});

export default router;
