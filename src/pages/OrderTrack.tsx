import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle, Clock, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { OrderTrackingTimeline } from '../components/OrderTrackingTimeline';

export const OrderTrack = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchOrder = async () => {
         if (!orderId) return;
         setLoading(true);
         
         const { data, error } = await supabase
            .from('orders')
            .select('*')
            // Using ilike or just exact match if we saved the short id somewhere. 
            // the order URL param might be the ID prefix or the generic ID...
            .match({ id: orderId })
            .single();
         
         // Fallback by checking the ID start if we only pass a substring segment, though
         // real ID match is preferred if they passed the full UUID
         
         if (error && error.code !== 'PGRST116') {
             // Handle gracefully, might be string match prefix issue.
             const { data: listData } = await supabase.from('orders').select('*');
             const matched = listData?.find(o => o.id.includes(orderId) || o.id.replace(/-/g, '').toUpperCase().includes(orderId.toUpperCase()));
             if (matched) {
                 setupOrderData(matched);
             }
         } else if (data) {
             setupOrderData(data);
         }
         
         setLoading(false);
     };
     fetchOrder();
  }, [orderId]);

  const setupOrderData = (dbItem: any) => {
         const history = dbItem.status_history || [];
         if (history.length === 0) {
             history.push({ status: dbItem.status, timestamp: dbItem.created_at, note: '' });
         }
         
         let method = 'local_delivery';
         if (dbItem.notes?.includes('nationwide')) method = 'nationwide';
         if (dbItem.notes?.includes('california')) method = 'california_shipping';
         if (dbItem.notes?.includes('pickup')) method = 'store_pickup';
         if (dbItem.notes?.includes('extended')) method = 'extended_bay_area';
         
         if (dbItem.tracking_number && method === 'local_delivery') {
             method = 'nationwide'; 
         }

         setOrder({
             orderId: dbItem.id.substring(0, 8).toUpperCase(),
             status: dbItem.status,
             fulfillmentMethod: method,
             trackingNumber: dbItem.tracking_number || '',
             carrier: dbItem.carrier || '',
             statusHistory: history
         });
  }

  if (loading) {
      return <div className="bg-brand-cream min-h-screen pt-32 pb-16 flex justify-center"><div className="w-12 h-12 border-4 border-brand-amber border-t-transparent rounded-full animate-spin"></div></div>
  }

  if (!order) {
      return (
        <div className="bg-brand-cream min-h-screen pt-32 pb-16">
            <div className="max-w-3xl mx-auto px-4 text-center">
                <h1 className="text-2xl font-serif font-bold mb-4">Order Not Found</h1>
                <Link to="/history" className="text-brand-amber hover:underline">Return to Order History</Link>
            </div>
        </div>
      )
  }

  return (
    <div className="bg-brand-cream min-h-screen pt-32 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/history" className="inline-flex items-center text-brand-brown/60 hover:text-brand-brown font-medium transition-colors mb-8">
          <ArrowLeft size={20} className="mr-2" /> Back to Orders
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-brand-brown/5 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-serif font-bold text-brand-brown mb-1">
                Order Tracking
              </h1>
              <p className="text-brand-brown/60 font-mono text-lg">{order.orderId}</p>
            </div>
            <div className="bg-brand-amber/10 text-brand-amber px-4 py-2 rounded-full font-bold text-sm border border-brand-amber/20 capitalize">
              Status: {order.status.replace(/_/g, ' ')}
            </div>
          </div>

          <OrderTrackingTimeline 
              fulfillmentMethod={order.fulfillmentMethod}
              statusHistory={order.statusHistory}
              currentStatus={order.status}
              trackingNumber={order.trackingNumber}
              carrier={order.carrier}
          />

          <div className="bg-brand-cream/50 rounded-2xl p-6 mt-8 border border-brand-brown/10">
            <h3 className="font-bold text-brand-brown mb-2 text-lg">Next Steps</h3>
            <p className="text-brand-brown/70 leading-relaxed text-sm">
              Your order is currently being handcrafted with authentic African ingredients. We will notify you once it's ready and on its way to you! If you have any urgent requests, please contact us via WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
