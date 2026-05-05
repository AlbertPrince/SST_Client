import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, ExpressCheckoutElement, AddressElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '../lib/supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutForm = ({ name, setName, phone, setPhone, email, setEmail, notes, setNotes, deliveryAddress, setDeliveryAddress, total, onSuccess, paymentIntentId, fulfillmentMethod, items, isMinMet, hasOutofStockItems }: { name: string, setName: (n: string) => void, phone: string, setPhone: (p: string) => void, email: string, setEmail: (e: string) => void, notes: string, setNotes: (e: string) => void, deliveryAddress: any, setDeliveryAddress: (a: any) => void, total: number, onSuccess: (email: string, notes: string) => void, paymentIntentId: string, fulfillmentMethod: string, items: any[], isMinMet: boolean, hasOutofStockItems: boolean }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [agreedToCompliance, setAgreedToCompliance] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (hasOutofStockItems) {
      setErrorMessage('Please remove out of stock items from your cart before proceeding.');
      return;
    }

    if (!agreedToCompliance) {
      setErrorMessage('Please agree to the compliance terms before proceeding.');
      return;
    }

    if (!isMinMet) {
      setErrorMessage('Please add more items to meet the minimum subtotal for your delivery region.');
      return;
    }

    if (!stripe || !elements || !paymentIntentId) {
      return;
    }
    
    if (!name) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email) {
      setErrorMessage('Please enter your email for the receipt.');
      return;
    }

    if (!phone) {
      setErrorMessage('Please enter your phone number so we can contact you regarding your order.');
      return;
    }

    if (fulfillmentMethod !== 'pickup') {
      if (!deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zip) {
        setErrorMessage('Please complete all delivery address fields.');
        return;
      }
    }

    setIsProcessing(true);
    setErrorMessage('');

    // Combine notes and address
    let finalNotes = notes;
    if (fulfillmentMethod !== 'pickup') {
       finalNotes = `Name: ${name}\nPhone: ${phone}\nDelivery Address: ${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zip}\n\n${notes}`;
    } else {
       finalNotes = `Name: ${name}\nPhone: ${phone}\n\n${notes}`;
    }

    // First update the payment intent with the latest email and notes
    try {
      await fetch('/api/update-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId, email, notes: finalNotes, fulfillmentMethod, items }),
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
      onSuccess(email, finalNotes);
    } else {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {fulfillmentMethod === 'pickup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface uppercase tracking-wider block mb-1">Full Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-primary transition-colors py-3 px-4 rounded-t leading-relaxed outline-none" 
              placeholder="First & Last Name" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-on-surface uppercase tracking-wider block mb-1">Phone Number</label>
            <input 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-primary transition-colors py-3 px-4 rounded-t leading-relaxed outline-none" 
              placeholder="(555) 555-5555" 
            />
          </div>
        </div>
      )}

      <div className="space-y-2 mb-6">
        <label className="text-sm font-semibold text-on-surface uppercase tracking-wider block mb-1">Email Address</label>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          // Add border color matching Stripe exactly so it visually aligns when stacking
          className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-primary transition-colors py-3 px-4 rounded-t leading-relaxed outline-none" 
          placeholder="Receipt & Updates" 
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-on-surface uppercase tracking-wider block mb-1">Special Instructions / Notes</label>
        <textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-primary transition-colors py-3 px-4 rounded-t leading-relaxed text-lg outline-none resize-none" 
          placeholder="Allergies, door codes, or special requests..." 
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

      <div className="flex items-start gap-3 p-4 bg-surface rounded-xl border border-outline-variant/30">
        <input 
          type="checkbox" 
          id="compliance"
          required
          checked={agreedToCompliance}
          onChange={(e) => setAgreedToCompliance(e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="compliance" className="text-sm text-on-surface-variant leading-relaxed">
          I agree to assume all responsibility for handling and delivery of these items, and agree not to hold Selorm's Street Treats liable for any injury or issues arising from their use.
        </label>
      </div>

      <button 
        type="submit" 
        disabled={isProcessing || !stripe || !elements || !isMinMet || !agreedToCompliance}
        className={`w-full py-5 rounded-full text-xl font-bold font-headline shadow-xl hover:-translate-y-1 transition-transform active:scale-95 ${
          isProcessing || !stripe || !elements || !isMinMet || !agreedToCompliance ? 'bg-primary/50 text-on-primary cursor-not-allowed hover:transform-none' : 'bg-gradient-to-r from-primary to-primary-container text-on-primary hover:opacity-90'
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
              onClick={() => {
                let waText = `Hello! I'd like to place a manual order. Here are my details:\n\n`;
                if (name) waText += `Name: ${name}\n`;
                if (phone) waText += `Phone: ${phone}\n`;
                if (email) waText += `Email: ${email}\n`;
                waText += `\nORDER ITEMS:\n`;
                items.forEach((item: any) => {
                   waText += `- ${item.quantity}x ${item.product.name} ($${(item.product.price * item.quantity).toFixed(2)})\n`;
                });
                waText += `\nFulfillment: ${fulfillmentMethod.replace('_', ' ').toUpperCase()}\n`;
                if (fulfillmentMethod !== 'pickup') {
                   waText += `Address: ${deliveryAddress.street}, ${deliveryAddress.city}, ${deliveryAddress.state} ${deliveryAddress.zip}\n`;
                }
                if (notes) waText += `\nNotes: ${notes}\n`;
                waText += `\nTOTAL: $${total.toFixed(2)}`;
                
                window.open(`https://wa.me/13606087185?text=${encodeURIComponent(waText)}`, '_blank');
              }}
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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState({ street: '', city: '', state: '', zip: '' });
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'pickup' | 'pending_delivery' | 'local_delivery' | 'extended_delivery' | 'west_coast_shipping' | 'nationwide_shipping'>('pickup');
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentIdState] = useState('');
  const paymentIntentIdRef = React.useRef(paymentIntentId);

  const setPaymentIntentId = (id: string) => {
    setPaymentIntentIdState(id);
    paymentIntentIdRef.current = id;
  };
  const [initError, setInitError] = useState('');
  const [defaultAddress, setDefaultAddress] = useState<any>(null);

  // Determine delivery region based on address
  useEffect(() => {
    if (fulfillmentMethod === 'pickup') return;

    if (!deliveryAddress.state || !deliveryAddress.city) {
      setFulfillmentMethod('pending_delivery');
      return;
    }

    const city = deliveryAddress.city.toLowerCase().trim();
    const state = deliveryAddress.state.toUpperCase().trim();

    if (state !== 'CA' && state !== 'OR' && state !== 'WA' && state !== 'CALIFORNIA' && state !== 'OREGON' && state !== 'WASHINGTON') {
      setFulfillmentMethod('nationwide_shipping');
      return;
    }

    const southBayCities = ['san jose', 'mountain view', 'sunnyvale', 'santa clara', 'milpitas', 'palo alto', 'los altos', 'cupertino', 'campbell', 'los gatos', 'saratoga'];
    const extendedBayCities = ['san francisco', 'oakland', 'napa', 'half moon bay', 'walnut creek', 'marin', 'san rafael', 'novato', 'mill valley', 'berkeley', 'hayward', 'fremont', 'san mateo', 'redwood city', 'san leandro', 'richmond', 'vallejo', 'concord', 'pleasanton', 'livermore', 'alameda', 'daly city', 'south san francisco', 'san bruno', 'pacifica', 'burlingame', 'foster city', 'belmont', 'san carlos', 'menlo park', 'east palo alto'];

    if (state === 'CA' || state === 'CALIFORNIA') {
      if (southBayCities.includes(city)) {
        setFulfillmentMethod('local_delivery');
      } else if (extendedBayCities.includes(city) || city.includes('marin') || city.includes('napa')) {
        setFulfillmentMethod('extended_delivery');
      } else {
        setFulfillmentMethod('west_coast_shipping');
      }
    } else {
      setFulfillmentMethod('west_coast_shipping');
    }
  }, [deliveryAddress.city, deliveryAddress.state, fulfillmentMethod]);

  // Fetch saved user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setEmail(session.user.email || '');
        
        // Fetch last order to auto-fill details natively
        const { data: latestOrders } = await supabase
          .from('orders')
          .select('notes')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (latestOrders && latestOrders.length > 0) {
           const orderNotes = latestOrders[0].notes || '';
           const nameMatch = orderNotes.match(/Name: (.*)/);
           if (nameMatch) setName(nameMatch[1]);
           const phoneMatch = orderNotes.match(/Phone: (.*)/);
           if (phoneMatch) setPhone(phoneMatch[1]);
           
           const addressMatch = orderNotes.match(/Delivery Address: (.*), (.*), (.*) (.*)/);
           if (addressMatch) {
              const addr = {
                 line1: addressMatch[1],
                 city: addressMatch[2],
                 state: addressMatch[3],
                 postal_code: addressMatch[4],
                 country: 'US'
              };
              setDefaultAddress(addr);
              setDeliveryAddress({
                 street: addressMatch[1],
                 city: addressMatch[2],
                 state: addressMatch[3],
                 zip: addressMatch[4]
              });
           }
        }
      }
    };
    fetchUserData();
  }, []);

  let deliveryFee = 0.00;
  if (fulfillmentMethod === 'local_delivery') deliveryFee = 0.00;
  if (fulfillmentMethod === 'extended_delivery') deliveryFee = 20.00;
  if (fulfillmentMethod === 'west_coast_shipping') deliveryFee = 30.00;
  if (fulfillmentMethod === 'nationwide_shipping') deliveryFee = 45.00;
  
  const total = subtotal + deliveryFee;

  // Minimum required logic
  let requiredMin = 0;
  if (fulfillmentMethod === 'local_delivery' || fulfillmentMethod === 'extended_delivery' || fulfillmentMethod === 'pending_delivery') requiredMin = 24.00;
  if (fulfillmentMethod === 'west_coast_shipping' || fulfillmentMethod === 'nationwide_shipping') requiredMin = 48.00;
  const isMinMet = fulfillmentMethod === 'pickup' || subtotal >= requiredMin;

  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      try {
        const currentIntentId = paymentIntentIdRef.current;
        if (!currentIntentId) {
          const response = await fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items, email, notes, fulfillmentMethod, deliveryAddress }),
          });
          const data = await response.json();
          if (data.error) {
             setInitError(data.error.message);
          } else {
             setClientSecret(data.clientSecret);
             setPaymentIntentId(data.paymentIntentId);
             setInitError(''); 
          }
        } else {
          const response = await fetch('/api/update-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId: currentIntentId, email, notes, fulfillmentMethod, items, deliveryAddress }),
          });
          const data = await response.json();
          if (data.error) {
             setInitError(data.error.message);
          } else {
             setInitError('');
          }
        }
      } catch (err) {
        setInitError('Failed to initialize payment system. Have you added your Stripe Secret Key to Settings?');
      }
    }, 600);

  }, [items, deliveryAddress.zip, deliveryAddress.state, fulfillmentMethod]); 


  const handleSuccess = (confirmedEmail: string, orderNotes: string) => {
      const orderId = paymentIntentId.replace('pi_', 'ORD-').toUpperCase().slice(0, 14); // Generates a clean looking ID based on Stripe intent
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
      
      try {
        const existingOrders = JSON.parse(localStorage.getItem('streetTreats_orders') || '[]');
        localStorage.setItem('streetTreats_orders', JSON.stringify([newOrder, ...existingOrders]));
      } catch (e) {
        console.warn("Could not save to localStorage. Cart is too large, likely due to base64 images.", e);
      }
      
      clearCart();
      navigate('/order/confirmation', { 
        state: { 
          email: confirmedEmail, 
          orderId, 
          notes: orderNotes,
          fulfillmentMethod,
          deliveryAddress,
          subtotal,
          deliveryFee,
          total
        } 
      });
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
            {items.map((item) => {
              const isOut = !item.product.isAvailable;
              return (
              <div key={`${item.product.id}-${item.size || 'base'}`} className={`flex items-center gap-6 p-4 rounded-xl transition-all group relative ${isOut ? 'opacity-70 bg-error-container/10 border border-error/20' : 'bg-surface-container-low hover:bg-surface-container-high'}`}>
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className={`w-full h-full object-cover ${isOut ? 'grayscale' : ''}`}
                    referrerPolicy="no-referrer"
                  />
                  {isOut && <div className="absolute inset-0 bg-error/20" />}
                </div>
                <div className="flex-grow">
                  <h3 className={`text-xl font-headline font-bold flex items-center gap-2 ${isOut ? 'text-error' : 'text-on-surface'}`}>
                    {item.product.name}
                    {isOut && <span className="text-[10px] uppercase tracking-wider bg-error text-white px-2 py-0.5 rounded-sm">Out of Stock</span>}
                  </h3>
                  <p className="text-sm text-on-surface-variant">{item.size || item.product.unitLabel}</p>
                  
                  <div className="mt-3 flex justify-between items-center pr-4">
                    <div className={`flex items-center gap-3 ${isOut ? 'pointer-events-none opacity-50' : ''}`}>
                      <span className="text-primary font-semibold">Qty:</span>
                      <div className="flex items-center border border-outline-variant/30 rounded-lg overflow-hidden bg-surface-container-highest">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)}
                          className="px-2 py-0.5 text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-dim"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>remove</span>
                        </button>
                        <span className="w-6 text-center font-bold text-on-surface text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)}
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
                  onClick={() => removeFromCart(item.product.id, item.size)}
                  className="absolute top-4 right-4 text-outline-variant hover:text-error hover:scale-110 hover:bg-error/10 p-1 rounded-full transition-all duration-200"
                  title="Remove Item"
                >
                  <span className="material-symbols-outlined block" style={{ fontSize: '20px' }}>delete</span>
                </button>
              </div>
            )})}
          </div>

          <div className="pt-8 border-t-2 border-outline-variant/20">
            <h3 className="text-xl font-headline font-bold text-on-surface mb-4">Fulfillment Method</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${fulfillmentMethod === 'pickup' ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:bg-surface-container-highest'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <input type="radio" value="pickup" checked={fulfillmentMethod === 'pickup'} onChange={() => setFulfillmentMethod('pickup')} className="hidden" />
                  <span className={`material-symbols-outlined ${fulfillmentMethod === 'pickup' ? 'text-primary' : 'text-on-surface-variant'}`}>storefront</span>
                  <span className={`font-bold ${fulfillmentMethod === 'pickup' ? 'text-primary' : 'text-on-surface'}`}>Store Pickup</span>
                </div>
                <span className="text-sm text-on-surface-variant ml-8">Free</span>
              </label>

              <label className={`flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${fulfillmentMethod !== 'pickup' ? 'border-primary bg-primary/5' : 'border-outline-variant/30 hover:bg-surface-container-highest'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <input type="radio" value="delivery" checked={fulfillmentMethod !== 'pickup'} onChange={() => setFulfillmentMethod('pending_delivery')} className="hidden" />
                  <span className={`material-symbols-outlined ${fulfillmentMethod !== 'pickup' ? 'text-primary' : 'text-on-surface-variant'}`}>local_shipping</span>
                  <span className={`font-bold ${fulfillmentMethod !== 'pickup' ? 'text-primary' : 'text-on-surface'}`}>Delivery & Shipping</span>
                </div>
                <span className="text-sm text-on-surface-variant ml-8">
                  {fulfillmentMethod === 'local_delivery' && 'Free (South Bay)'}
                  {fulfillmentMethod === 'extended_delivery' && '$20.00 (Extended Bay Area)'}
                  {fulfillmentMethod === 'west_coast_shipping' && '$30.00 (West Coast)'}
                  {fulfillmentMethod === 'nationwide_shipping' && '$45.00 (Nationwide)'}
                  {fulfillmentMethod === 'pending_delivery' && 'Calculated at checkout'}
                  {fulfillmentMethod === 'pickup' && 'Calculated at checkout'}
                </span>
              </label>
            </div>
            
            {fulfillmentMethod !== 'pickup' && !isMinMet && (
              <div className="mt-4 p-4 rounded-xl bg-error-container text-on-error-container text-sm font-bold flex items-start gap-3">
                <span className="material-symbols-outlined mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                <p>
                  {fulfillmentMethod === 'pending_delivery' && `Delivery requires a minimum order of $24.00 (Bay Area) or $48.00 (CA/Nationwide). Your current subtotal is $${subtotal.toFixed(2)}.`}
                  {fulfillmentMethod !== 'pending_delivery' && `Your delivery region requires a minimum order subtotal of $${requiredMin.toFixed(2)}. Your current subtotal is $${subtotal.toFixed(2)}. Please add more items to your cart.`}
                </p>
              </div>
            )}
          </div>

          <div className="pt-8 space-y-4 border-t-2 border-outline-variant/20">
            <div className="flex justify-between items-center text-on-surface-variant text-lg">
              <span>Subtotal</span>
              <span className="font-headline">${subtotal.toFixed(2)}</span>
            </div>
            {fulfillmentMethod !== 'pickup' && (
              <div className="flex justify-between items-center text-on-surface-variant text-lg">
                <span>Shipping & Delivery Fee</span>
                <span className="font-headline">
                  {fulfillmentMethod === 'pending_delivery' ? 'Pending' : `$${deliveryFee.toFixed(2)}`}
                </span>
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
               {fulfillmentMethod !== 'pickup' && (
                 <div className="space-y-4 mb-6">
                   <label className="text-sm font-semibold text-on-surface uppercase tracking-wider block mb-1">
                     Delivery Address
                   </label>
                   <div className="bg-surface-container-highest p-4 rounded-xl border border-outline-variant/30">
                     <AddressElement 
                       options={{ 
                         mode: 'shipping',
                         allowedCountries: ['US'], // Restrict to US only for validation
                         fields: { phone: 'always' },
                         validation: { phone: { required: 'always' } },
                         defaultValues: defaultAddress ? { name: name, phone: phone, address: defaultAddress } : undefined
                       }} 
                       onChange={(e) => {
                         const addr = e.value.address;
                         setDeliveryAddress({
                           street: (addr.line1 || '') + (addr.line2 ? ' ' + addr.line2 : ''),
                           city: addr.city || '',
                           state: addr.state || '',
                           zip: addr.postal_code || '',
                         });
                         if (e.value.name) setName(e.value.name);
                         if (e.value.phone) setPhone(e.value.phone);
                       }}
                     />
                   </div>
                 </div>
               )}
               <CheckoutForm 
                  name={name}
                  setName={setName}
                  phone={phone}
                  setPhone={setPhone}
                  email={email} 
                  setEmail={setEmail} 
                  notes={notes}
                  setNotes={setNotes}
                  deliveryAddress={deliveryAddress}
                  setDeliveryAddress={setDeliveryAddress}
                  total={total} 
                  onSuccess={handleSuccess} 
                  paymentIntentId={paymentIntentId}
                  fulfillmentMethod={fulfillmentMethod}
                  items={items}
                  isMinMet={isMinMet}
                  hasOutofStockItems={items.some((i: any) => !i.product.isAvailable || i.product.is_available === false)}
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
