import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { Loader2, Phone, ShieldCheck, ChevronLeft } from 'lucide-react';

import { setUser } from '@/store/slices/authSlice';
import { sendOtp, verifyOtp, DEMO_OTP_CODE } from '@/services/authService';
import { saveUserProfile } from '@/services/userService';
import { isFirebaseConfigured } from '@/lib/firebase';

// Self-contained phone + OTP verification. Calls onVerified(user) on success.
// `collectName` adds a name field shown on the OTP step (used at checkout).
export default function PhoneOtpForm({ onVerified, collectName = false }) {
  const dispatch = useDispatch();
  const [stage, setStage] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [handle, setHandle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    timer.current = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(timer.current);
  }, [seconds]);

  const requestOtp = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const h = await sendOtp(phone);
      setHandle(h);
      setStage('otp');
      setSeconds(30);
      toast.success(isFirebaseConfigured ? 'OTP sent via SMS' : `Demo OTP is ${DEMO_OTP_CODE}`);
    } catch (err) {
      toast.error(err.message || 'Could not send OTP');
    } finally {
      setLoading(false);
    }
  };

  const confirm = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const user = await verifyOtp(handle, code.trim(), { name: name.trim() || undefined });
      if (name.trim()) await saveUserProfile(user.phone, { name: name.trim() });
      dispatch(setUser(user));
      toast.success('Mobile number verified');
      onVerified?.(user);
    } catch (err) {
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Invisible reCAPTCHA target for Firebase Phone Auth */}
      <div id="recaptcha-container" />

      {stage === 'phone' && (
        <form onSubmit={requestOtp} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-600">Mobile number</span>
            <div className="flex items-center rounded-xl border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
              <span className="flex items-center gap-1 border-r border-gray-200 px-3 py-2.5 text-sm text-gray-500">
                <Phone size={15} /> +91
              </span>
              <input
                type="tel"
                inputMode="numeric"
                autoFocus
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit number"
                className="flex-1 bg-transparent px-3 py-2.5 text-base outline-none"
                required
              />
            </div>
          </label>
          <button type="submit" disabled={loading || phone.length !== 10} className="btn-primary w-full">
            {loading && <Loader2 size={18} className="animate-spin" />}
            Send OTP
          </button>
        </form>
      )}

      {stage === 'otp' && (
        <form onSubmit={confirm} className="space-y-4">
          <button
            type="button"
            onClick={() => setStage('phone')}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
          >
            <ChevronLeft size={16} /> +91 {phone}
          </button>

          {collectName && (
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-600">Your name</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="input"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-600">Enter OTP</span>
            <input
              type="tel"
              inputMode="numeric"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="6-digit code"
              className="input text-center text-lg tracking-[0.5em]"
              required
            />
          </label>

          <button type="submit" disabled={loading || code.length !== 6} className="btn-primary w-full">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
            Verify & continue
          </button>

          <div className="text-center text-sm text-gray-500">
            {seconds > 0 ? (
              <span>Resend OTP in {seconds}s</span>
            ) : (
              <button type="button" onClick={requestOtp} className="font-semibold text-primary hover:underline">
                Resend OTP
              </button>
            )}
          </div>
          {!isFirebaseConfigured && (
            <p className="rounded-lg bg-secondary-50 p-2 text-center text-xs text-secondary-600">
              Demo mode — use OTP <b>{DEMO_OTP_CODE}</b>
            </p>
          )}
        </form>
      )}
    </div>
  );
}
