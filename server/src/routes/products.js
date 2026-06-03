import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Public catalog reads normally happen client-side directly against Firestore
// (guarded by security rules). These admin endpoints centralize privileged
// writes so inventory/audit logic lives server-side.

router.post('/', requireAuth, requireAdmin, async (req, res) => {
  // TODO: validate + write products/{id}
  res.status(201).json({ created: true, product: req.body });
});

router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  res.json({ updated: true, id: req.params.id });
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  res.json({ deleted: true, id: req.params.id });
});

router.patch('/:id/inventory', requireAuth, requireAdmin, async (req, res) => {
  const { stock } = req.body;
  res.json({ id: req.params.id, stock });
});

export default router;
