import React, { useState, useEffect } from 'react';
import { Loader2, X, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../shared/Logo';
import { cn } from '@/lib/utils';

/**
 * AuthModal - Email-only magic-link sign-in
 * Phone OTP and recovery codes removed (billing-not-enabled).
 */
export default function AuthModal({ open, onClose, onSuccess, title = 'Sign in to continue', onOpenLegal }) {
  const {
    requestEmailMagicLink,
    authUser,
    userProfile,
  } = useAuth();
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setEmail('');
      setEmailMessage('');
      setError('');
      setLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (authUser && open) {
      if (userProfile) {
        onSuccess?.();
      }
      onClose();
    }
  }, [authUser, userProfile, open, onSuccess, onClose]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
    setEmailMessage('');
  };

  const handleSendEmailLink = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    setError('');
    setEmailMessage('');
    const result = await requestEmailMagicLink(email);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Unable to send email link. Please try again.');
      return;
    }
    setEmailMessage(result.message || 'If an eligible account exists, a sign-in link will be sent.');
  };

  if (!open) return null;

  return (
    <div
      data-testid="auth-modal"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ padding: '16px' }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative w-full bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        style={{ maxWidth: '420px', borderRadius: '16px' }}
      >
        <button
          onClick={onClose}
          className="absolute z-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          style={{ top: '16px', right: '16px', padding: '8px', borderRadius: '8px' }}
        >
          <X style={{ width: '20px', height: '20px' }} />
        </button>

        <div style={{ padding: '32px' }}>
          <div className="flex justify-center" style={{ marginBottom: '24px' }}>
            <Logo size="default" />
          </div>

          <h2
            className="text-center font-semibold text-gray-900 dark:text-white"
            style={{ fontSize: '20px', marginBottom: '28px' }}
          >
            {title}
          </h2>

          <form onSubmit={handleSendEmailLink}>
            <div style={{ marginBottom: '24px' }}>
              <label
                className="block font-medium text-gray-700 dark:text-gray-300"
                style={{ fontSize: '14px', marginBottom: '10px' }}
              >
                Email Address
              </label>
              <p
                className="text-gray-500 dark:text-gray-400"
                style={{ fontSize: '13px', marginBottom: '14px' }}
              >
                We&apos;ll send a one-time sign-in link to your email.
              </p>

              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="you@example.com"
                  className={cn(
                    "w-full border border-gray-200 dark:border-gray-600",
                    "bg-white dark:bg-gray-700 text-gray-900 dark:text-white",
                    "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500",
                    "transition-all duration-200"
                  )}
                  style={{
                    padding: '15px 48px 15px 16px',
                    borderRadius: '12px',
                    fontSize: '16px',
                  }}
                  autoFocus
                />
                <Mail
                  className="absolute text-orange-400"
                  style={{ right: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px' }}
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                style={{ padding: '12px 14px', borderRadius: '10px', marginBottom: '20px' }}
              >
                <p className="text-red-600 dark:text-red-400" style={{ fontSize: '14px' }}>{error}</p>
              </div>
            )}

            {emailMessage && (
              <div
                className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                style={{ padding: '12px 14px', borderRadius: '10px', marginBottom: '20px' }}
              >
                <p className="text-emerald-700 dark:text-emerald-300" style={{ fontSize: '14px' }}>{emailMessage}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className={cn(
                "w-full font-medium flex items-center justify-center transition-all duration-300",
                email.trim() && !loading
                  ? "bg-primary text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
              )}
              style={{ padding: '14px 20px', borderRadius: '12px', gap: '8px', fontSize: '15px' }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" style={{ width: '18px', height: '18px' }} />
                  Sending link...
                </>
              ) : (
                <>
                  <Mail style={{ width: '18px', height: '18px' }} />
                  Send Magic Link
                </>
              )}
            </button>
          </form>

          <div
            className="border-t border-gray-200 dark:border-gray-700"
            style={{ marginTop: '24px', paddingTop: '16px' }}
          >
            <p className="text-center text-gray-400 dark:text-gray-500" style={{ fontSize: '12px' }}>
              By continuing, you agree to our{' '}
              <button type="button" onClick={() => onOpenLegal?.('terms')} className="underline text-orange-500 hover:text-orange-600 dark:hover:text-orange-400">
                Terms of Service
              </button>{' '}and{' '}
              <button type="button" onClick={() => onOpenLegal?.('privacy')} className="underline text-orange-500 hover:text-orange-600 dark:hover:text-orange-400">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
