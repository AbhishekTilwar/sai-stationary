import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { sendOrderConfirmation } from '../services/email.js';
import { sendWhatsAppUpdate } from '../services/whatsapp.js';

const router = Router();

// Create an order server-side: recompute totals from authoritative product data,
// apply/validate coupon, decrement inventory in a transaction, then notify.
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { items, address, delivery, payment, couponCode } = req.body;
    if (!items?.length) return res.status(400).json({ error: 'Cart is empty' });

    // TODO: Firestore transaction:
    //   - read products, verify stock & price
    //   - validate coupon
    //   - create orders/{id}
    //   - decrement product.stock
    const order = {
      id: `SAI${Date.now().toString().slice(-8)}`,
      userId: req.user.uid,
      items,
      address,
      delivery,
      payment,
      couponCode,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    // Fire-and-forget notifications.
    sendOrderConfirmation(order).catch(() => {});
    sendWhatsAppUpdate(order, 'Pending').catch(() => {});

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get('/', requireAuth, async (req, res) => {
  // TODO: query orders where userId == req.user.uid
  res.json({ orders: [] });
});

// Admin: update order status (also triggers a WhatsApp/email update).
router.patch('/:id/status', requireAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  // TODO: update orders/{id}.status + append to timeline
  res.json({ id: req.params.id, status });
});

export default router;
