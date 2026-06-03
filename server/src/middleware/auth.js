import { getAdmin, isAdminReady } from '../config/firebaseAdmin.js';

// Verifies the Firebase ID token from the Authorization: Bearer <token> header.
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing auth token' });

    if (!isAdminReady()) {
      // In local dev without credentials, accept a decoded stub for testing.
      req.user = { uid: 'dev-user', role: 'customer' };
      return next();
    }

    const decoded = await getAdmin().auth().verifyIdToken(token);
    req.user = { uid: decoded.uid, email: decoded.email, role: decoded.role || 'customer' };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
