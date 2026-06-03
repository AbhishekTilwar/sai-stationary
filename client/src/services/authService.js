// Phone + OTP auth.
//
// Customers never create a username/password. They simply add to cart, and at
// checkout we verify them with their mobile number + a one-time password. The
// MOBILE NUMBER is the user key (profile, addresses & orders are stored under it).
//
// - Demo mode (no Firebase): OTP is always "123456" so the whole flow is testable.
// - Firebase mode: uses Firebase Phone Auth (RecaptchaVerifier + signInWithPhoneNumber).
import { auth, isFirebaseConfigured } from '@/lib/firebase';

const SESSION_KEY = 'sai_session';
const DEMO_OTP = '123456';

// Phone numbers that should get the admin role (comma separated env, fallback demo).
const ADMIN_PHONES = (import.meta.env.VITE_ADMIN_PHONES || '9999999999')
  .split(',')
  .map((s) => s.replace(/\D/g, ''));

export const normalizePhone = (raw) => (raw || '').replace(/\D/g, '').slice(-10);
export const roleForPhone = (phone) => (ADMIN_PHONES.includes(normalizePhone(phone)) ? 'admin' : 'customer');

const session = {
  get() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    } catch {
      return null;
    }
  },
  set(user) {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  },
};

export function subscribeToAuth(callback) {
  // We manage the lightweight phone session ourselves (works in both modes), so
  // the listener just reports the current stored session.
  callback(session.get());
  return () => {};
}

// Step 1 — request an OTP for a mobile number.
// Returns a "confirmation" handle that step 2 uses to verify the code.
export async function sendOtp(rawPhone) {
  const phone = normalizePhone(rawPhone);
  if (phone.length !== 10) {
    throw new Error('Enter a valid 10-digit mobile number');
  }

  if (!isFirebaseConfigured) {
    return { phone, demo: true };
  }

  const { RecaptchaVerifier, signInWithPhoneNumber } = await import('firebase/auth');
  if (!window._saiRecaptcha) {
    window._saiRecaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
  }
  const confirmation = await signInWithPhoneNumber(auth, `+91${phone}`, window._saiRecaptcha);
  return { phone, confirmation };
}

// Step 2 — verify the OTP and establish the session (keyed by phone).
export async function verifyOtp(handle, code, { name } = {}) {
  const phone = handle.phone;

  if (handle.demo) {
    if (code !== DEMO_OTP) throw new Error('Invalid OTP. (Demo OTP is 123456)');
  } else {
    await handle.confirmation.confirm(code);
  }

  const user = { phone, name: name || `+91 ${phone}`, role: roleForPhone(phone) };
  session.set(user);
  return user;
}

export function getCurrentUser() {
  return session.get();
}

export function updateSessionName(name) {
  const user = session.get();
  if (!user) return null;
  const next = { ...user, name };
  session.set(next);
  return next;
}

export async function logoutUser() {
  session.set(null);
  if (isFirebaseConfigured && auth?.currentUser) {
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
  }
}

export const DEMO_OTP_CODE = DEMO_OTP;
