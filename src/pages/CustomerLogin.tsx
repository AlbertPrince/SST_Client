import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!supabase) {
        setError("Supabase not configured locally.");
        setLoading(false);
        return;
    }

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
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF3DC] pt-32 pb-20 px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm p-8 border border-[#3B1A00]/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#3B1A00] mb-2">Welcome Back</h1>
          <p className="text-[#3B1A00]/70">Sign in to track your orders.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
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

          <div>
            <label className="block text-sm font-bold text-[#3B1A00]/70 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#FDF3DC]/50 border border-[#3B1A00]/20 focus:border-[#C97D0A] focus:ring-1 focus:ring-[#C97D0A] text-[#3B1A00] px-4 py-3 rounded-xl transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
              loading ? 'bg-[#3B1A00]/50 cursor-not-allowed' : 'bg-[#3B1A00] hover:bg-[#C97D0A] cursor-pointer'
            }`}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[#3B1A00]/70">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="text-[#C97D0A] font-bold hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};
