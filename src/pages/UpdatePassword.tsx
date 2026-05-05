import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        // Recovery link clicked
      }
    });
  }, [navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage("Password updated successfully. Redirecting...");
      setTimeout(() => navigate('/history'), 2000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FDF3DC] pt-32 pb-20 px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm p-8 border border-[#3B1A00]/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#3B1A00] mb-2">Update Password</h1>
          <p className="text-[#3B1A00]/70">Enter your new password below.</p>
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

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#3B1A00]/70 uppercase tracking-wider mb-2">
              New Password
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
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
