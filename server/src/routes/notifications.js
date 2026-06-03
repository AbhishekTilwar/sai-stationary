import { Router } from 'express';
import { sendWelcomeEmail } from '../services/email.js';

const router = Router();

// Newsletter subscription (called from the homepage form).
router.post('/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  // TODO: store in Firestore `newsletter` + add to email provider list.
  res.json({ subscribed: true });
});

// Corporate / bulk gifting enquiry.
router.post('/enquiry', async (req, res) => {
  // TODO: store in Firestore `enquiries` + email sales team + WhatsApp ping.
  res.status(201).json({ received: true });
});

// Send welcome email on registration (called by a Cloud Function or client).
router.post('/welcome', async (req, res) => {
  await sendWelcomeEmail(req.body);
  res.json({ sent: true });
});

export default router;
