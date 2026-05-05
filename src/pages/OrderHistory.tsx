import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Package, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { OrderTrackingTimeline } from '../components/OrderTrackingTimeline';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: string;
  email: string;
  date: string;
  total: number;
  status: string;
  items: OrderItem[];
  fulfillmentMethod: string;
  trackingNumber: string;
  carrier: string;
  statusHistory: any[];
}

export const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<{ [id: string]: boolean }>({});

  const toggleExpand = (id: string) => {
      setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!supabase) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        // Logged in: Fetch from Supabase
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
          
        if (!error && data) {
           const dbOrders = data.map(dbItem => {
               // Ensure status history is present and has current status if empty
               const history = dbItem.status_history || [];
               if (history.length === 0) {
                   history.push({ status: dbItem.status, timestamp: dbItem.created_at, note: '' });
               }
               
               // Attempt to guess fulfillment method by searching metadata or fallback
               // Since we didn't add fulfillment_method formally to the DB in original prompt setup, 
               // we will fallback to local_delivery or check notes if possible
               
               let method = 'local_delivery';
               if (dbItem.notes?.includes('nationwide')) method = 'nationwide';
               if (dbItem.notes?.includes('california')) method = 'california_shipping';
               if (dbItem.notes?.includes('pickup')) method = 'store_pickup';
               if (dbItem.notes?.includes('extended')) method = 'extended_bay_area';
               
               // Use tracking_number to assume shipping if missing notes
               if (dbItem.tracking_number && method === 'local_delivery') {
                   method = 'nationwide'; 
               }

               return {
                 orderId: dbItem.id.substring(0, 8).toUpperCase(),
                 email: dbItem.customer_email || session.user.email || '',
                 date: dbItem.created_at,
                 total: Number(dbItem.subtotal),
                 status: dbItem.status,
                 items: dbItem.items || [],
                 fulfillmentMethod: method,
                 trackingNumber: dbItem.tracking_number || '',
                 carrier: dbItem.carrier || '',
                 statusHistory: history
               };
           });
           setOrders(dbOrders);
        }
      } else {
         setIsAuthenticated(false);
      }
      setLoading(false);
    };
    
    fetchOrders();
  }, []);

  if (loading) return null;

  if (isAuthenticated === false) {
    return <Navigate to="/auth/login" state={{ from: { pathname: '/history' } }} replace />;
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-on-surface-variant hover:text-primary font-medium transition-colors">
          <ArrowLeft size={20} className="mr-2" /> Back to Home
        </Link>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-on-surface mb-2">Order History</h1>
        <p className="text-on-surface-variant italic font-headline text-lg">Your taste of home, neatly recorded.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface-container-low rounded-3xl p-12 text-center border-t-4 border-primary">
          <div className="w-24 h-24 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-6 text-on-surface-variant/40">
            <span className="material-symbols-outlined text-5xl">receipt_long</span>
          </div>
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">No past orders yet</h2>
          <p className="text-on-surface-variant mb-8 max-w-md mx-auto">Once you place an order for our handcrafted treats, it will appear here.</p>
          <Link 
            to="/menu"
            className="inline-block bg-primary hover:bg-primary-container text-on-primary font-bold py-3 px-8 rounded-full transition-colors shadow-md"
          >
            Explore the Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.orderId} className="bg-surface-container-low rounded-3xl overflow-hidden shadow-sm border border-outline-variant/20 transition-all hover:shadow-md">
              <div 
                  className="bg-surface-container-high px-6 md:px-8 py-5 border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-surface-container-highest transition-colors"
                  onClick={() => toggleExpand(order.orderId)}
              >
                <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                  <div>
                    <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Order Placed</span>
                    <span className="font-headline font-semibold text-on-surface">
                      {new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total</span>
                    <span className="font-headline font-semibold text-on-surface">${order.total.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                         order.status === 'paid' ? 'bg-green-100 text-green-800' :
                         order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                         order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                         order.status === 'fulfilled' ? 'bg-blue-100 text-blue-800' :
                         order.status === 'ready_for_pickup' ? 'bg-amber-100 text-amber-800' :
                         order.status === 'out_for_delivery' ? 'bg-orange-100 text-orange-800' :
                         'bg-gray-100 text-gray-800'
                    }`}>
                      <Clock size={12} className="mr-1" /> {order.status}
                    </span>
                  </div>
                </div>
                <div className="text-left md:text-right flex items-center gap-4">
                  <div>
                    <span className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Order #</span>
                    <span className="font-headline font-semibold text-on-surface">{order.orderId}</span>
                  </div>
                  <div className="text-gray-400">
                     {expandedOrders[order.orderId] ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </div>
                </div>
              </div>
              
              {expandedOrders[order.orderId] && (
                 <div className="p-6 md:p-8 bg-white border-b border-outline-variant/30">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 font-serif">Track Your Order</h3>
                    <OrderTrackingTimeline 
                       fulfillmentMethod={order.fulfillmentMethod} 
                       statusHistory={order.statusHistory}
                       currentStatus={order.status}
                       trackingNumber={order.trackingNumber}
                       carrier={order.carrier}
                    />
                 </div>
              )}

              <div className="p-6 md:p-8">
                <div className="space-y-6">
                  {order.items.map((item, idx) => (
                    <div key={`${order.orderId}-${item.id}-${idx}`} className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-highest">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-grow flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-headline font-bold text-on-surface">{item.name}</h3>
                          <p className="text-sm text-on-surface-variant">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-headline font-bold text-secondary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center text-sm font-medium text-on-surface-variant">
                    <Package size={16} className="mr-2" /> Delivered to {order.email} (Demo functionality)
                  </div>
                  <button className="text-primary hover:text-primary-container font-bold text-sm tracking-wide transition-colors flex items-center">
                    <ExternalLink size={16} className="mr-1" /> View Receipt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
