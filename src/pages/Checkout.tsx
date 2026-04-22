import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutForm = ({ email, setEmail, notes, setNotes, total, onSuccess, paymentIntentId, fulfillmentMethod, items }: { email: string, setEmail: (e: string) => void, notes: string, setNotes: (e: string) => void, total: number, onSuccess: (email: string, notes: string) => void, paymentIntentId: string, fulfillmentMethod: string, items: any[] }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !paymentIntentId) {
      return;
    }
    
    if (!email) {
      setErrorMessage('Please enter your email for the receipt.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    // First update the payment intent with the latest email and notes
    try {
      await fetch('/api/update-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId, email, notes, fulfillmentMethod, items }),
      });
    } catch (err) {
      console.warn('Failed to update meta before confirm:', err);
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', 
      confirmParams: {
        receipt_email: email,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? 'An unexpected error occurred.');
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(email, notes);
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-on-surface uppercase tracking-wider block mb-1">Email Address</label>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-primary transition-colors py-3 px-4 rounded-t leading-relaxed text-lg outline-none" 
          placeholder="youremail@example.com" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-on-surface uppercase tracking-wider block mb-1">Special Instructions / Notes</label>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-primary transition-colors py-3 px-4 rounded-t leading-relaxed text-lg outline-none resize-none" 
          placeholder="Allergies, delivery instructions, or special requests..." 
        />
        <p className="text-xs text-on-surface-variant font-medium">Optional</p>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold text-on-surface uppercase tracking-wider block mb-1">Payment Details</label>
        <div className="bg-surface-container-highest p-6 rounded-xl border border-outline-variant/30">
          <div className="mb-6">
            <ExpressCheckoutElement onReady={({availablePaymentMethods}) => {
                if (!availablePaymentMethods) {
                    console.log('No express payment methods available for this browser.');
                }
            }} />
          </div>
          <PaymentElement />
        </div>
      </div>
      
      {errorMessage && (
        <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-medium">
          {errorMessage}
        </div>
      )}

      <button 
        type="submit" 
        disabled={isProcessing || !stripe || !elements}
        className={`w-full py-5 rounded-full text-xl font-bold font-headline shadow-xl hover:translate-y-[-2px] transition-transform active:scale-95 ${
          isProcessing || !stripe || !elements ? 'bg-primary/50 text-on-primary cursor-not-allowed' : 'bg-gradient-to-r from-primary to-primary-container text-on-primary'
        }`}
      >
        {isProcessing ? 'Processing SECURELY...' : `Complete Order • $${total.toFixed(2)}`}
      </button>

      <div className="pt-6 border-t border-outline-variant/20">
        <div className="flex items-start gap-4 p-4 rounded-2xl bg-surface-container-low border-l-4 border-[#25D366]">
          <span className="material-symbols-outlined text-[#25D366] mt-0.5">chat</span>
          <div>
            <p className="text-sm font-bold text-on-surface">Prefer WhatsApp?</p>
            <p className="text-xs text-on-surface-variant leading-relaxed mt-1">Click to send your order details directly via WhatsApp for manual payment processing.</p>
            <button 
              type="button" 
              className="mt-2 text-xs font-bold text-primary hover:text-primary-container underline underline-offset-4"
              onClick={() => window.open(`https://wa.me/1234567890?text=Hi,%20I'd%20like%20to%20place%20an%20order.%20My%20total%20is%20$${total.toFixed(2)}`, '_blank')}
            >
              Connect via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export const Checkout = () => {
  const { items, subtotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [initError, setInitError] = useState('');

  const deliveryFee = fulfillmentMethod === 'delivery' ? 15.00 : 0.00;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (items.length === 0) return;
    
    // Fetch PaymentIntent client secret from the backend
    const initializePayment = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items, email, notes, fulfillmentMethod }),
        });
        
        const data = await response.json();
        
        if (data.error) {
           setInitError(data.error.message);
        } else {
           setClientSecret(data.clientSecret);
           setPaymentIntentId(data.paymentIntentId);
        }
      } catch (err) {
        setInitError('Failed to initialize payment system. Have you added your Stripe Secret Key to Settings?');
      }
    };
    
    initializePayment();
  }, [items]); // Deliberately keeping items only, backend will update amt on confirm

  // Automatically update the server payment intent amount when fulfillment method changes
  useEffect(() => {
    if (paymentIntentId) {
      fetch('/api/update-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId, email, notes, fulfillmentMethod, items }),
      }).catch(err => console.error(err));
    }
  }, [fulfillmentMethod]);

  const handleSuccess = (confirmedEmail: string, orderNotes: string) => {
      const orderId = 'ORD-' + Math.floor(Math.random() * 1000000);
      const newOrder = {
        orderId,
        email: confirmedEmail,
        notes: orderNotes + (fulfillmentMethod === 'delivery' ? ' (Delivery)' : ' (Pickup)'),
        date: new Date().toISOString(),
        total,
        status: 'Preparing',
        items: items.map(item => ({
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
          quantity: item.quantity,
          price: item.product.price
        }))
      };
      
      const existingOrders = JSON.parse(localStorage.getItem('streetTreats_orders') || '[]');
      localStorage.setItem('streetTreats_orders', JSON.stringify([newOrder, ...existingOrders]));
      
      clearCart();
      navigate('/order/confirmation', { state: { email: confirmedEmail, orderId, notes: orderNotes } });
  };

  if (items.length === 0) {
    return (
      <div className="bg-background min-h-[70vh] py-24 flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mb-6 text-on-surface-variant/40">
          <span className="material-symbols-outlined text-5xl">shopping_cart</span>
        </div>
        <h2 className="text-3xl font-headline font-bold text-on-surface mb-4">Your cart is empty</h2>
        <p className="text-on-surface-variant mb-8">Looks like you haven't added any treats yet.</p>
        <Link 
          to="/menu"
          className="bg-primary hover:bg-primary-container text-on-primary font-bold py-3 px-8 rounded-full transition-colors shadow-md"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <Link to="/menu" className="inline-flex items-center text-on-surface-variant hover:text-primary font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Menu
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Left Column: Order Review */}
        <section className="w-full md:w-1/2 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-headline font-bold text-on-surface">Review Your Selection</h1>
            <p className="text-on-surface-variant italic font-headline">Hand-crafted Ghanaian goodness on its way to you.</p>
          </div>
          
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-6 p-4 rounded-xl bg-surface-container-low transition-all hover:bg-surface-container-high group relative">
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-headline font-bold text-on-surface">{item.product.name}</h3>
                  <p className="text-sm text-on-surface-variant">{item.product.unitLabel}</p>
                  
                  <div className="mt-3 flex justify-between items-center pr-4">
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-semibold">Qty:</span>
                      <div className="flex items-center border border-outline-variant/30 rounded-lg overflow-hidden bg-surface-container-highest">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-dim"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>remove</span>
                        </button>
                        <span className="w-6 text-center font-bold text-on-surface text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-dim"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
                        </button>
                      </div>
                    </div>
                    <span className="font-headline font-bold text-lg text-secondary">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="absolute top-4 right-4 text-outline-variant hover:text-error transition-colors"
                  title="Remove Item"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>delete</span>
                </button>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t-2 border-outline-variant/20">
            <h3 className="text-xl font-headline font-bold text-on-surface mb-4">Fulfillment Method</h3>
            <div className="flex gap-4">
              <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${fulfillmentMethod === 'pickup' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-highest'}`}>
                <input type="radio" name="fulfillment" value="pickup" checked={fulfillmentMethod === 'pickup'} onChange={() => setFulfillmentMethod('pickup')} className="hidden" />
                <span className="material-symbols-outlined">storefront</span>
                <span className="font-bold">Store Pickup</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${fulfillmentMethod === 'delivery' ? 'border-primary bg-primary/5 text-primary' : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-highest'}`}>
                <input type="radio" name="fulfillment" value="delivery" checked={fulfillmentMethod === 'delivery'} onChange={() => setFulfillmentMethod('delivery')} className="hidden" />
                <span className="material-symbols-outlined">local_shipping</span>
                <span className="font-bold">Local Delivery</span>
              </label>
            </div>
            {fulfillmentMethod === 'delivery' && (
              <p className="text-sm text-on-surface-variant mt-3 italic">Delivery fee of $15.00 applies to your order. We'll be in touch to confirm coordinates.</p>
            )}
          </div>

          <div className="pt-8 space-y-4 border-t-2 border-outline-variant/20">
            <div className="flex justify-between items-center text-on-surface-variant text-lg">
              <span>Subtotal</span>
              <span className="font-headline">${subtotal.toFixed(2)}</span>
            </div>
            {fulfillmentMethod === 'delivery' && (
              <div className="flex justify-between items-center text-on-surface-variant text-lg">
                <span>Heritage Delivery</span>
                <span className="font-headline">${deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-2xl font-bold text-on-surface pt-4 border-t border-outline-variant/10">
              <span className="font-headline">Total</span>
              <span className="font-headline text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Vertical Divider */}
        <div className="hidden md:block w-1 self-stretch opacity-30 rounded-full mx-4" style={{
          background: 'linear-gradient(to bottom, #3B1A00 0%, #3B1A00 25%, #C97D0A 25%, #C97D0A 50%, #C0392B 50%, #C0392B 75%, #C97D0A 75%, #C97D0A 100%)',
          backgroundSize: '100% 40px'
        }}></div>

        {/* Right Column: Secure Payment */}
        <section className="w-full md:w-1/2 bg-surface-container p-8 md:p-12 rounded-3xl shadow-sm space-y-10 border-t-4 border-primary">
          <div className="space-y-4">
            <h2 className="text-3xl font-headline font-bold text-on-surface">Secure Payment</h2>
            <p className="text-on-surface-variant text-sm">Every transaction is encrypted and handled with care.</p>
          </div>

          {!clientSecret && !initError && (
             <div className="flex justify-center items-center py-10 opacity-60">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                 <span className="ml-3 font-medium">Initializing secure checkout...</span>
             </div>
          )}

          {initError && (
              <div className="bg-error-container text-on-error-container p-6 rounded-xl font-medium border border-error/20 my-6">
                {initError}
              </div>
          )}

          {clientSecret && (
             <Elements options={{ 
               clientSecret, 
               appearance: { 
                 theme: 'flat',
                 variables: {
                    colorPrimary: '#C97D0A',
                    colorBackground: '#ffffff',
                    colorText: '#3B1A00',
                    colorDanger: '#C0392B',
                    fontFamily: 'Georgia, system-ui, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '8px',
                    colorIcon: '#C97D0A'
                 },
                 rules: {
                    '.Input': {
                       borderColor: '#E8A020',
                       boxShadow: 'none'
                    },
                    '.Input:focus': {
                       borderColor: '#C97D0A',
                       boxShadow: '0 0 0 1px #C97D0A'
                    },
                    '.Label': {
                       color: '#3B1A00',
                       fontWeight: '600'
                    }
                 }
               } 
             }} stripe={stripePromise}>
               <CheckoutForm 
                  email={email} 
                  setEmail={setEmail} 
                  notes={notes}
                  setNotes={setNotes}
                  total={total} 
                  onSuccess={handleSuccess} 
                  paymentIntentId={paymentIntentId}
                  fulfillmentMethod={fulfillmentMethod}
                  items={items}
                />
             </Elements>
          )}

          <div className="flex justify-center items-center gap-8 opacity-40 grayscale pt-2 border-t border-outline-variant/10 mt-8">
            <span className="material-symbols-outlined text-4xl" title="Secure Encryption">lock</span>
            <span className="material-symbols-outlined text-4xl" title="Verified Checkout">verified_user</span>
            <span className="material-symbols-outlined text-4xl" title="Privacy Protected">shield_person</span>
          </div>
        </section>
      </div>
    </div>
  );
};
