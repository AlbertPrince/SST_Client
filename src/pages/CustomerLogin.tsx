import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (!supabase) {
        setError("Supabase not configured locally.");
        setLoading(false);
        return;
    }

    if (isResetMode) {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (resetError) {
        setError(resetError.message);
      } else {
        setMessage('Password reset link sent to your email.');
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        const origin = (location.state as any)?.from?.pathname || '/history';
        navigate(origin);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF3DC] pt-32 pb-20 px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm p-8 border border-[#3B1A00]/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#3B1A00] mb-2">{isResetMode ? 'Reset Password' : 'Welcome Back'}</h1>
          <p className="text-[#3B1A00]/70">{isResetMode ? 'Enter your email to receive a reset link.' : 'Sign in to track your orders.'}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 text-sm font-medium">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#3B1A00]/70 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#FDF3DC]/50 border border-[#3B1A00]/20 focus:border-[#C97D0A] focus:ring-1 focus:ring-[#C97D0A] text-[#3B1A00] px-4 py-3 rounded-xl transition-colors"
            />
          </div>

          {!isResetMode && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-bold text-[#3B1A00]/70 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="text-xs font-bold text-[#C97D0A] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isResetMode}
                className="w-full bg-[#FDF3DC]/50 border border-[#3B1A00]/20 focus:border-[#C97D0A] focus:ring-1 focus:ring-[#C97D0A] text-[#3B1A00] px-4 py-3 rounded-xl transition-colors"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
              loading ? 'bg-[#3B1A00]/50 cursor-not-allowed' : 'bg-[#3B1A00] hover:bg-[#C97D0A] cursor-pointer'
            }`}
          >
            {loading ? (isResetMode ? 'Sending...' : 'Signing In...') : (isResetMode ? 'Send Reset Link' : 'Sign In')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm flex flex-col gap-3">
          {isResetMode && (
             <button
                type="button"
                onClick={() => setIsResetMode(false)}
                className="text-[#3B1A00]/70 hover:text-[#C97D0A] font-bold"
             >
                Back to Sign In
             </button>
          )}
          <span className="text-[#3B1A00]/70">
            Don't have an account?{' '}
            <Link to="/auth/signup" className="text-[#C97D0A] font-bold hover:underline">
              Create one
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

