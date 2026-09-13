import React, { useState } from 'react';
import { Loader2, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../shared/Logo';

export default function LoginScreen({ darkMode, onSkipLogin, onOpenLegal }) {
  const { requestEmailMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const theme = {
    bg: darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-orange-50 to-amber-100',
    card: darkMode ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700' : 'bg-white/80 backdrop-blur-xl border-gray-200/50',
    text: darkMode ? 'text-white' : 'text-gray-900',
    textMuted: darkMode ? 'text-gray-400' : 'text-gray-600',
    input: darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError('');
    setEmailMessage('');
  };

  const handleSendEmailLink = async (e) => {
    e.preventDefault();
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

  return (
    <div className={`min-h-screen ${theme.bg} flex items-center justify-center`} style={{ padding: '32px 24px' }}>
      <div className={`w-full max-w-md ${theme.card} rounded-2xl shadow-xl border`} style={{ padding: '40px 32px' }}>
        <div className="flex justify-center" style={{ marginBottom: '40px' }}>
          <Logo size="lg" />
        </div>

        <form onSubmit={handleSendEmailLink}>
          <div style={{ marginBottom: '32px' }}>
            <label className={`block text-sm font-medium ${theme.textMuted}`} style={{ marginBottom: '12px' }}>
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="you@example.com"
                className={`w-full rounded-xl border ${theme.input} focus:outline-none focus:ring-2 focus:ring-orange-500`}
                style={{ padding: '14px 16px 14px 16px' }}
                autoFocus
              />
              <Mail className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme.textMuted}`} />
            </div>
            <p className={`text-xs ${theme.textMuted}`} style={{ marginTop: '12px' }}>
              We&apos;ll send a one-time sign-in link to your email.
            </p>
          </div>

          {error && (
            <div role="alert" className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg" style={{ marginBottom: '24px', padding: '12px' }}>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          {emailMessage && (
            <div className="bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg" style={{ marginBottom: '24px', padding: '12px' }}>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">{emailMessage}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            style={{ padding: '14px 16px' }}
            className={`w-full rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95
              ${email.trim() && !loading
                ? 'bg-primary text-white hover:from-orange-500 hover:to-orange-700 shadow-lg shadow-primary/20'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending link...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Send Magic Link
              </>
            )}
          </button>
        </form>

        {onSkipLogin && (
          <div style={{ marginTop: '32px' }}>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} ${theme.textMuted}`}>or</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onSkipLogin}
              style={{ marginTop: '20px', padding: '14px 16px' }}
              className={`w-full rounded-xl font-medium border-2 border-dashed transition-all
                ${darkMode
                  ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
                }`}
            >
              Continue Browsing (Demo Mode)
            </button>
          </div>
        )}

        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} style={{ marginTop: '40px', paddingTop: '24px' }}>
          <p className={`text-xs text-center ${theme.textMuted}`}>
            By continuing, you agree to our{' '}
            <button type="button" onClick={() => onOpenLegal?.('terms')} className="underline text-orange-500 hover:text-orange-600">
              Terms of Service
            </button>{' '}and{' '}
            <button type="button" onClick={() => onOpenLegal?.('privacy')} className="underline text-orange-500 hover:text-orange-600">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
