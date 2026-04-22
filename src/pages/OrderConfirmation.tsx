import React, { useEffect, useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle, Instagram, MapPin, MessageSquare, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const OrderConfirmation = () => {
  const location = useLocation();
  const state = location.state as { email?: string; orderId?: string; notes?: string } | null;
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });
    }
  }, []);

  // If someone navigates here directly without an order, send them home
  if (!state || !state.orderId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="bg-brand-cream min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-2xl w-full px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center border border-brand-brown/5 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-amber rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6 relative z-10">
            <CheckCircle size={40} />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-brown mb-4 relative z-10">
            Order Confirmed!
          </h1>
          
          <p className="text-lg text-brand-brown/80 mb-8 relative z-10">
            Thank you for your order. We've sent a confirmation email to <strong className="text-brand-brown">{state.email}</strong>.
          </p>
          
          <div className="bg-brand-cream/50 rounded-2xl p-6 mb-8 border border-brand-brown/10 relative z-10 flex gap-6 text-left">
             <div className="flex-1">
               <p className="text-sm text-brand-brown/60 uppercase tracking-wider font-bold mb-1">Order Reference</p>
               <p className="text-2xl font-mono font-bold text-brand-amber">{state.orderId}</p>
             </div>
             {state.notes && (
                <div className="flex-1 border-l border-brand-brown/10 pl-6">
                   <div className="flex items-center gap-2 mb-1">
                      <MessageSquare size={16} className="text-brand-amber" />
                      <p className="text-sm text-brand-brown/60 uppercase tracking-wider font-bold">Special Notes</p>
                   </div>
                   <p className="text-sm text-brand-brown font-medium italic">{state.notes}</p>
                </div>
             )}
          </div>
          
          <div className="space-y-6 text-left mb-10 relative z-10">
            <div className="flex items-start">
              <MapPin className="text-brand-amber mt-1 mr-4 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-brand-brown">Pickup / Delivery Information</h3>
                <p className="text-brand-brown/70 mt-1">
                  We have received your order details and chosen fulfillment method. We will be in touch shortly to confirm!
                </p>
              </div>
            </div>
            
            {!session && (
              <div className="flex items-start bg-brand-amber/10 p-5 rounded-2xl border border-brand-amber/20 mt-6">
                <UserPlus className="text-brand-amber mt-1 mr-4 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-brand-brown">Want to track this order?</h3>
                  <p className="text-brand-brown/70 mt-1 text-sm mb-3">
                    Create an account to easily track your orders across all devices and save your taste preferences.
                  </p>
                  <Link to="/auth/signup" className="inline-block text-xs font-bold bg-brand-brown text-white px-4 py-2 rounded-lg hover:bg-brand-amber transition-colors">
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link 
              to="/"
              className="bg-brand-brown hover:bg-brand-red text-brand-cream font-bold py-3 px-8 rounded-full transition-colors shadow-md"
            >
              Return Home
            </Link>
            <a 
              href="https://instagram.com/ststreettreats"
              target="_blank"
              rel="noreferrer"
              className="bg-white border-2 border-brand-brown/20 hover:border-brand-amber text-brand-brown font-bold py-3 px-8 rounded-full transition-colors flex items-center justify-center"
            >
              <Instagram size={20} className="mr-2 text-brand-amber" /> Follow us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
