import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin');
    });
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let authError;
    if (isSignUp) {
      const { error: err } = await supabase.auth.signUp({
        email,
        password,
      });
      authError = err;
      if (!err) {
        setError("Account created! If Supabase email confirmation is enabled, check your email. Otherwise, you can now sign in.");
        setIsSignUp(false);
        setLoading(false);
        return;
      }
    } else {
      const { error: err } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      authError = err;
      if (!err) {
        navigate('/admin');
      }
    }

    if (authError) {
      setError(authError.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface-container rounded-3xl p-8 shadow-xl border border-outline-variant/20">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-[#3B1A00] mb-2">Admin Portal</h1>
          <p className="text-[#3B1A00]/70 font-sans">Sign in to manage kitchen operations.</p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-bold text-[#3B1A00] uppercase tracking-wider mb-2">Auth Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              className="w-full bg-[#FDF3DC]/50 border-0 border-b-2 border-[#C97D0A] focus:ring-0 focus:border-[#C0392B] transition-colors py-3 px-4 rounded-t-md text-lg outline-none font-sans"
              placeholder="kitchen@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-[#3B1A00] uppercase tracking-wider mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#FDF3DC]/50 border-0 border-b-2 border-[#C97D0A] focus:ring-0 focus:border-[#C0392B] transition-colors py-3 px-4 rounded-t-md text-lg outline-none font-sans"
              placeholder="********"
              required
            />
          </div>
          
          {error && <p className={`text-sm mt-2 font-medium ${error.includes('Account created') ? 'text-green-600' : 'text-[#C0392B]'}`}>{error}</p>}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#C97D0A] to-[#C0392B] text-white py-4 rounded-full text-lg font-bold font-serif shadow-md hover:-translate-y-1 transition-transform active:scale-95 disabled:opacity-70"
          >
            {loading ? 'Authenticating...' : (isSignUp ? 'Create Password' : 'Access Kitchen')}
          </button>
        </form>
        
        <div className="mt-6 flex flex-col gap-4 text-center">
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }} 
            className="text-sm font-bold text-[#3B1A00]/70 hover:text-[#C97D0A] transition-colors tracking-wide"
          >
            {isSignUp ? "Already created a password? Sign In" : "First time setup? Create Password"}
          </button>
          
          <button onClick={() => navigate('/')} className="text-sm font-bold text-[#C97D0A] hover:text-[#3B1A00] transition-colors tracking-wide underline underline-offset-4">
            Return to Storefront
          </button>
        </div>
      </div>
    </div>
  );
};
