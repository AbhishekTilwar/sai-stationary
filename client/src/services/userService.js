// User profile + addresses, keyed by MOBILE NUMBER.
//
// Production: a single Firestore document per phone -> users/{phone}
//   { name, addresses: [...], loyaltyPoints, createdAt }
// Demo: localStorage, same shape, so the UI is identical.
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { normalizePhone } from './authService';

const key = (phone) => `sai_user_${normalizePhone(phone)}`;

function readLocal(phone) {
  try {
    return JSON.parse(localStorage.getItem(key(phone)) || 'null') || { addresses: [] };
  } catch {
    return { addresses: [] };
  }
}
function writeLocal(phone, data) {
  localStorage.setItem(key(phone), JSON.stringify(data));
}

export async function getUserProfile(phone) {
  const id = normalizePhone(phone);
  if (!isFirebaseConfigured) return readLocal(id);
  const snap = await getDoc(doc(db, 'users', id));
  return snap.exists() ? snap.data() : { addresses: [] };
}

export async function saveUserProfile(phone, patch) {
  const id = normalizePhone(phone);
  const current = await getUserProfile(id);
  const next = { ...current, ...patch };
  if (!isFirebaseConfigured) {
    writeLocal(id, next);
  } else {
    await setDoc(doc(db, 'users', id), next, { merge: true });
  }
  return next;
}

export async function getAddresses(phone) {
  const profile = await getUserProfile(phone);
  return profile.addresses || [];
}

// Saves an address under the phone key (dedupes by line1+pincode, marks default).
export async function saveAddress(phone, address) {
  const id = normalizePhone(phone);
  const profile = await getUserProfile(id);
  const addresses = profile.addresses || [];
  const exists = addresses.find(
    (a) => a.line1 === address.line1 && a.pincode === address.pincode
  );
  const next = exists
    ? addresses.map((a) => (a === exists ? { ...a, ...address } : a))
    : [{ ...address, id: `addr_${Date.now()}` }, ...addresses];
  await saveUserProfile(id, { name: profile.name || address.name, addresses: next });
  return next;
}
