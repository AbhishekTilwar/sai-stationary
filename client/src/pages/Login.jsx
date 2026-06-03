import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Gift } from 'lucide-react';

import Seo from '@/components/common/Seo';
import PhoneOtpForm from '@/components/auth/PhoneOtpForm';

// Optional login — only needed to view past orders / account. Shopping and
// checkout never require it; identity is verified with a phone OTP at checkout.
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/account';

  return (
    <div className="container-px flex items-center justify-center py-12 sm:py-16">
      <Seo title="Sign in with mobile" />
      <div className="card w-full max-w-md p-6 sm:p-8">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
          <Gift size={24} />
        </div>
        <h1 className="font-display text-2xl font-extrabold">Sign in with your mobile</h1>
        <p className="mt-1 text-sm text-gray-500">
          No password needed. We'll send a one-time OTP to verify your number and show your orders.
        </p>

        <div className="mt-6">
          <PhoneOtpForm onVerified={() => navigate(from, { replace: true })} />
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          <Link to="/products" className="hover:text-primary">← Continue shopping</Link>
        </p>
      </div>
    </div>
  );
}
