import express from "express";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import * as dotenv from "dotenv";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { products as mockProducts } from "./src/data/products.ts";

// Parse .env
dotenv.config();

let stripeClient: Stripe | null = null;
function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripeClient = new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
  }
  return stripeClient;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
  if (url && key) {
    return createClient(url, key);
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Webhook MUST be before express.json()
  app.post("/api/webhook", express.raw({ type: "application/json" }), async (req: express.Request, res: express.Response): Promise<void> => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !endpointSecret || !req.body) {
      res.status(400).send("Webhook Secret missing or bad request");
      return;
    }

    try {
      const stripe = getStripe();
      let event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const isDelivery = paymentIntent.metadata?.fulfillmentMethod === 'delivery';
        const deliveryFeeCents = isDelivery ? 1500 : 0;
        const subtotal = (paymentIntent.amount - deliveryFeeCents) / 100;
        const customerEmail = paymentIntent.receipt_email || paymentIntent.metadata?.email || "unknown@email.com";
        
        let itemsString = '';
        for (let i = 0; i < 20; i++) {
           if (paymentIntent.metadata && paymentIntent.metadata[`items_${i}`]) {
              itemsString += paymentIntent.metadata[`items_${i}`];
           } else {
              break;
           }
        }
        if (!itemsString && paymentIntent.metadata?.items) {
           itemsString = paymentIntent.metadata.items;
        }
        const items = itemsString ? JSON.parse(itemsString) : [];
        
        const orderId = paymentIntent.id.replace('pi_', 'ORD-').toUpperCase().slice(0, 14);
        
        const supabase = getSupabase();
        if (supabase) {
          // The metadata saves standard details if provided
          await supabase.from('orders').insert({
              stripe_payment_intent_id: paymentIntent.id,
              customer_email: customerEmail,
              subtotal: subtotal,
              status: "processing",
              items: items,
              notes: (paymentIntent.metadata?.notes || '')
          });
        }

        // Send Email via Resend
        if (process.env.RESEND_API_KEY) {
           const resend = new Resend(process.env.RESEND_API_KEY);
           
           // You would use your real custom domain here eventually like 'orders@ststreettreats.com'
           const senderEmail = 'onboarding@resend.dev'; 
           
           // Construct email body
           let itemsHtml = items.map((i: any) => `<li>${i.quantity}x ${i.name} - $${(i.price * i.quantity).toFixed(2)}</li>`).join('');
           
           // This will be replaced with your live domain in production
           const host = req.headers.host || 'localhost:3000';
           const protocol = req.headers['x-forwarded-proto'] || req.protocol;
           const trackingUrl = `${protocol}://${host}/track/${orderId}`;
           
           const emailHtml = `
             <h2>Selorm's Street Treats - Order Confirmed!</h2>
             <p>Thank you for your order! We are preparing it fresh for you.</p>
             <p><strong>Order ID:</strong> ${orderId}</p>
             <h3>Items:</h3>
             <ul>${itemsHtml}</ul>
             <p><strong>Total Paid:</strong> $${(paymentIntent.amount / 100).toFixed(2)}</p>
             <br/>
             <a href="${trackingUrl}" style="background-color:#C97D0A;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;">
                Track Your Order
             </a>
             <br/><br/>
             <p>If you have any questions, you can reply directly to this email or contact us via WhatsApp.</p>
           `;

           try {
             // 1. Send Email to the Customer
             await resend.emails.send({
               from: `Selorm's Street Treats <${senderEmail}>`,
               to: customerEmail,
               subject: `Order Confirmed: ${orderId}`,
               html: emailHtml
             });
             console.log(`Order confirmation email sent to ${customerEmail}`);
             
             // 2. Send Notification Email to the Admin (Selorm)
             const adminEmail = 'ss.treat@gmail.com';
             const adminHtml = `
                <h2>New Order Received!</h2>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Customer Email:</strong> ${customerEmail}</p>
                <p><strong>Fulfillment Method:</strong> ${paymentIntent.metadata?.fulfillmentMethod?.replace('_', ' ').toUpperCase() || 'PICKUP'}</p>
                <div style="background-color: #fcecd4; padding: 16px; border-radius: 8px;">
                   <strong>Customer Information / Notes / Address:</strong><br/>
                   <pre style="font-family: inherit; white-space: pre-wrap;">${paymentIntent.metadata?.notes || 'None provided'}</pre>
                </div>
                <h3>Items Ordered:</h3>
                <ul>${itemsHtml}</ul>
                <p><strong>Total Paid:</strong> $${(paymentIntent.amount / 100).toFixed(2)}</p>
                <hr />
                <p>Log in to your Admin Dashboard (<code>/admin</code>) to manage this order and update its status.</p>
             `;
             
             await resend.emails.send({
                from: `Street Treats Orders <${senderEmail}>`,
                to: adminEmail,
                subject: `🎉 NEW ORDER: $${(paymentIntent.amount / 100).toFixed(2)} - ${orderId}`,
                html: adminHtml
             });
             console.log(`Admin notification email sent reliably to ${adminEmail}`);

           } catch (emailErr) {
             console.error("Failed to send Resend email:", emailErr);
           }
        } else {
           console.warn("RESEND_API_KEY not found in environment. Skipping confirmation email.");
        }
      }

      res.json({received: true});
    } catch (err: any) {
      console.error(err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  app.use(express.json({ limit: '15mb' }));

  let productsCache: any = null;
  let productsCacheTime = 0;

  // API endpoints FIRST
  // Categories API
  app.get("/api/categories", async (req, res) => {
    try {
      const supabase = getSupabase();
      if (!supabase) return res.json([]);
      
      const { data, error } = await supabase.from('categories').select('*').order('name');
      
      if (error || !data) {
        // Fallback: extract distinct categories from products if table doesn't exist
        const { data: pData } = await supabase.from('products').select('category');
        if (pData) {
          const unique = Array.from(new Set(pData.map(p => p.category).filter(Boolean)));
          return res.json(unique.map(c => ({ id: c, name: String(c).charAt(0).toUpperCase() + String(c).slice(1), slug: c })));
        }
        return res.json([]);
      }
      res.json(data);
    } catch(e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      if (productsCache && Date.now() - productsCacheTime < 60000) { // 1 min cache
         return res.json(productsCache);
      }
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        
        const mappedData = data.map(dbItem => {
          const safeName = dbItem.name || 'Unnamed Product';
          return {
            id: dbItem.id,
            name: safeName,
            slug: safeName.toLowerCase().replace(/ /g, '-'),
            category: dbItem.category,
            price: Number(dbItem.price) || 0,
            unitLabel: dbItem.unit_label,
            sizes: dbItem.sizes || null,
            image: dbItem.image_url,
            shortDescription: dbItem.short_description,
            fullDescription: dbItem.full_description,
            culturalOrigin: dbItem.cultural_origin,
            healthBenefits: Array.isArray(dbItem.health_benefits) ? dbItem.health_benefits : (typeof dbItem.health_benefits === 'string' ? dbItem.health_benefits.split(',').map((s: string) => s.trim()) : []),
            ingredients: Array.isArray(dbItem.ingredients) ? dbItem.ingredients : (typeof dbItem.ingredients === 'string' ? dbItem.ingredients.split(',').map((s: string) => s.trim()) : []),
            isAvailable: dbItem.is_available,
            allowedFulfillmentMethods: dbItem.allowed_fulfillment_methods || ['pickup', 'local_delivery', 'extended_delivery', 'west_coast_shipping', 'nationwide_shipping'],
            fulfillmentMinimums: dbItem.fulfillment_minimums || {}
          };
        });
        productsCache = mappedData;
        productsCacheTime = Date.now();
        res.json(mappedData);
      } else {
         // mock data fallback
         res.json(mockProducts);
      }
    } catch (e: any) {
        console.error("Products error", e);
        res.status(500).send({ error: e.message });
    }
  });

  // Address Validation Helpers
  function validateFulfillmentRules(fulfillmentMethod: string, address: { zip?: string; state?: string }, subtotalCents: number, items?: any[]) {
     const hasIceCream = items?.some(item => item.product?.category === 'icecream');
     if (hasIceCream && fulfillmentMethod !== 'pickup' && fulfillmentMethod !== 'local_delivery') {
        return { valid: false, message: `Ice cream can only be ordered for Pickup or Local Delivery.` };
     }

     if (items && fulfillmentMethod !== 'pending_delivery') {
        for (const item of items) {
           const p = item.product;
           
           if (!p.isAvailable || p.is_available === false) {
              return { valid: false, message: `${p.name} is currently out of stock.` };
           }

           if (p.allowedFulfillmentMethods && p.allowedFulfillmentMethods.length > 0) {
              if (!p.allowedFulfillmentMethods.includes(fulfillmentMethod)) {
                 const formattedMethod = fulfillmentMethod.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                 return { valid: false, message: `${p.name} cannot be ordered for ${formattedMethod}.` };
              }
           }
           
           if (p.fulfillmentMinimums && p.fulfillmentMinimums[fulfillmentMethod]) {
              const minQty = Number(p.fulfillmentMinimums[fulfillmentMethod]);
              if (item.quantity < minQty) {
                 const formattedMethod = fulfillmentMethod.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                 return { valid: false, message: `${p.name} requires a minimum quantity of ${minQty} for ${formattedMethod}.` };
              }
           }
        }
     }

     if (fulfillmentMethod === 'pickup') return { valid: true };

     // Basic distance checks for local Bay Area ZIP codes (Mountain View / SF / SJ area)
     const bayAreaZips = [/^940\d{2}$/, /^943\d{2}$/, /^950\d{2}$/, /^951\d{2}$/, /^944\d{2}$/];
     const isBayArea = address.zip && bayAreaZips.some(regex => regex.test(address.zip));

     // CA check based strictly on Stripe's standard state codes
     const isCAState = address.state?.toUpperCase() === 'CA' || address.state?.toLowerCase() === 'california';
     const zNum = parseInt(address.zip || "0", 10);
     const isCAZip = (zNum >= 90000 && zNum <= 96199);
     
     // The entire location logic requires both state and zip to legally match CA
     const isCA = isCAState && isCAZip;

     if (fulfillmentMethod === 'local_delivery') {
        if (!isBayArea || !isCA) return { valid: false, message: `Your ZIP code (${address.zip}) is outside our 15-mile Local Delivery radius or invalid. Please choose Extended Bay Area Delivery or West Coast Shipping.` };
        if (subtotalCents < 2400) return { valid: false, message: `Local Delivery requires a $24.00 minimum subtotal.` };
     }

     if (fulfillmentMethod === 'extended_delivery') {
        if (!isBayArea && !isCA) return { valid: false, message: `Extended Bay Area Delivery is only available within Northern California.` };
        if (subtotalCents < 2400) return { valid: false, message: `Extended Delivery requires a $24.00 minimum subtotal.` };
     }

     if (fulfillmentMethod === 'west_coast_shipping') {
        const stateCode = address.state?.toUpperCase();
        const stateName = address.state?.toLowerCase();
        const isWestCoast = stateCode === 'CA' || stateCode === 'OR' || stateCode === 'WA' || 
                            stateName === 'california' || stateName === 'oregon' || stateName === 'washington';
        
        if (!isWestCoast) return { valid: false, message: `West Coast Shipping is only available for California, Oregon, and Washington.` };
        if (subtotalCents < 4800) return { valid: false, message: `West Coast Shipping requires a $48.00 minimum subtotal.` };
     }
     
     if (fulfillmentMethod === 'nationwide_shipping') {
         if (subtotalCents < 4800) return { valid: false, message: `Nationwide Shipping requires a $48.00 minimum subtotal.` };
     }

     return { valid: true };
  }

  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { items, email, notes, fulfillmentMethod, deliveryAddress } = req.body;
      
      let deliveryFeeCents = 0;
      if (fulfillmentMethod === 'local_delivery') deliveryFeeCents = 0;
      if (fulfillmentMethod === 'extended_delivery') deliveryFeeCents = 2000;
      if (fulfillmentMethod === 'west_coast_shipping') deliveryFeeCents = 3000;
      if (fulfillmentMethod === 'nationwide_shipping') deliveryFeeCents = 4500;

      let subtotalCents = 0;
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const cachedProduct = productsCache?.find(p => p.id === item.product.id) || item.product;
          item.product = { ...item.product, ...cachedProduct }; // Override from db cache
          subtotalCents += Math.round(item.product.price * 100) * item.quantity;
        }
      }
      
      if (deliveryAddress && fulfillmentMethod !== 'pickup') {
          const validation = validateFulfillmentRules(fulfillmentMethod, deliveryAddress, subtotalCents, items);
          if (!validation.valid) {
              return res.status(400).send({ error: { message: validation.message } });
          }
      }

      const totalAmountCents = subtotalCents + deliveryFeeCents;

      const stripe = getStripe();
      
      let itemsString = JSON.stringify(items.map((i: any) => ({
         id: i.product.id,
         name: i.product.name,
         quantity: i.quantity,
         price: i.product.price
      })));
      let md: any = {
         email: email || '',
         notes: notes ? String(notes).substring(0, 500) : '',
         fulfillmentMethod: fulfillmentMethod || 'pickup',
      };
      const chunks = itemsString.match(/.{1,500}/g) || [];
      chunks.forEach((chunk: string, index: number) => {
         md[`items_${index}`] = chunk;
      });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmountCents,
        currency: "usd",
        receipt_email: email || undefined,
        automatic_payment_methods: { enabled: true },
        metadata: md
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (e: any) {
      res.status(400).send({
        error: {
          message: e.message,
        },
      });
    }
  });

  // Keep Payment Intent fresh with notes, email, and validate shipping rules
  app.post("/api/update-payment-intent", async (req, res) => {
    try {
      const { paymentIntentId, email, notes, fulfillmentMethod, items, deliveryAddress } = req.body;
      if (!paymentIntentId) {
         return res.status(400).send({ error: { message: "Missing PaymentIntent ID" } });
      }
      
      let deliveryFeeCents = 0;
      if (fulfillmentMethod === 'local_delivery') deliveryFeeCents = 0;
      if (fulfillmentMethod === 'extended_delivery') deliveryFeeCents = 2000;
      if (fulfillmentMethod === 'west_coast_shipping') deliveryFeeCents = 3000;
      if (fulfillmentMethod === 'nationwide_shipping') deliveryFeeCents = 4500;

      let subtotalCents = 0;
      if (items && Array.isArray(items)) {
        for (const item of items) {
          const cachedProduct = productsCache?.find(p => p.id === item.product.id) || item.product;
          item.product = { ...item.product, ...cachedProduct }; // Override from db cache
          subtotalCents += Math.round(item.product.price * 100) * item.quantity;
        }
      }
      
      if (deliveryAddress && fulfillmentMethod !== 'pickup') {
          const validation = validateFulfillmentRules(fulfillmentMethod, deliveryAddress, subtotalCents, items);
          if (!validation.valid) {
              return res.status(400).send({ error: { message: validation.message } });
          }
      }

      const totalAmountCents = subtotalCents > 0 ? subtotalCents + deliveryFeeCents : undefined;

      const stripe = getStripe();
      let md: any = {
         email: email || '',
         notes: notes ? String(notes).substring(0, 500) : '',
         fulfillmentMethod: fulfillmentMethod || 'pickup'
      };
      if (items && Array.isArray(items)) {
         let itemsString = JSON.stringify(items.map((i: any) => ({
            id: i.product.id,
            name: i.product.name,
            quantity: i.quantity,
            price: i.product.price
         })));
         const chunks = itemsString.match(/.{1,500}/g) || [];
         chunks.forEach((chunk: string, index: number) => {
            md[`items_${index}`] = chunk;
         });
      }
      
      await stripe.paymentIntents.update(paymentIntentId, {
        ...(totalAmountCents ? { amount: totalAmountCents } : {}),
        receipt_email: email || undefined,
        metadata: md
      });
      res.send({ success: true });
    } catch (e: any) {
      console.error(e);
      res.status(400).send({ error: { message: e.message } });
    }
  });

  // Reviews API
  const mockReviewsStore: any[] = [];

  app.get("/api/reviews/:productId", async (req, res) => {
    const { productId } = req.params;
    try {
       const supabase = getSupabase();
       if (supabase) {
          const { data, error } = await supabase.from('reviews').select('*').eq('product_id', productId).order('created_at', { ascending: false });
          if (!error && data) {
             // merge in-memory temporary with db data (in memory wins for temp session)
             const memory = mockReviewsStore.filter(r => r.product_id === productId);
             return res.json([...memory, ...data]);
          }
       }
    } catch(e) {}
    res.json(mockReviewsStore.filter(r => r.product_id === productId));
  });

  app.post("/api/reviews", async (req, res) => {
     const { product_id, author_name, rating, text } = req.body;
     const newReview = {
        id: Math.random().toString(36).substring(2, 9),
        product_id,
        author_name: author_name || 'Anonymous',
        rating: Number(rating) || 5,
        text: text || '',
        created_at: new Date().toISOString()
     };
     
     try {
       const supabase = getSupabase();
       if (supabase) {
           // We try to insert to the 'reviews' table. If it errors out (e.g. table doesn't exist), we catch it.
           const { error } = await supabase.from('reviews').insert({
              product_id: newReview.product_id,
              author_name: newReview.author_name,
              rating: newReview.rating,
              text: newReview.text
           });
           if (!error) return res.json({ success: true, review: newReview });
       }
     } catch(e) {}
  
     // fallback
     mockReviewsStore.unshift(newReview);
     res.json({ success: true, review: newReview });
  });

  // Admin Authentication Middleware
  const requireAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
    const supabaseAuth = createClient(supabaseUrl, supabaseKey);
    const { data: { user }, error } = await supabaseAuth.auth.getUser(token);
    if (error || !user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    
    const allowedAdmins = ['ss.treat@gmail.com', 'apmensah@gmail.com', 'sst.treat@gmail.com'];
    if (!allowedAdmins.includes(user.email?.toLowerCase() || '')) {
      res.status(403).json({ error: 'Forbidden: Admin access only' });
      return;
    }
    
    // Note: Can also check if user email is strictly allowed here.
    next();
  };

  // --- ADMIN ROUTES (Uses Service Role Key bypassing RLS) ---
  app.get("/api/admin/orders", requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabase();
      if (!supabase) return res.json([]);
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      res.json(data);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.patch("/api/admin/orders/:id", requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabase();
      if (!supabase) return res.json({ success: false });
      
      const { status, tracking_number, carrier } = req.body;
      
      // Get current order to append to history
      const { data: orderData } = await supabase.from('orders').select('status_history').eq('id', req.params.id).single();
      const currentHistory = orderData?.status_history || [];
      const newHistoryEvent = {
        status,
        timestamp: new Date().toISOString(),
        note: tracking_number ? `Tracking added: ${tracking_number} via ${carrier}` : ''
      };

      const updatePayload: any = { 
         status,
         status_history: [...currentHistory, newHistoryEvent]
      };
      
      if (tracking_number) updatePayload.tracking_number = tracking_number;
      if (carrier) updatePayload.carrier = carrier;

      const { error } = await supabase.from('orders').update(updatePayload).eq('id', req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // --- Categories Admin Endpoints ---
  app.post("/api/admin/categories", requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabase();
      if (!supabase) return res.status(500).json({ error: "DB not initialized" });
      const { name, slug } = req.body;
      const { data, error } = await supabase.from('categories').insert([{ name, slug }]).select();
      if (error) throw error;
      res.json(data[0]);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.put("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabase();
      if (!supabase) return res.status(500).json({ error: "DB not initialized" });
      const { id } = req.params;
      const { name, slug, oldSlug } = req.body;
      
      const { data, error } = await supabase.from('categories').update({ name, slug }).eq('id', id).select();
      if (error) throw error;
      
      // Update all products that had the old category
      if (oldSlug && oldSlug !== slug) {
        await supabase.from('products').update({ category: slug }).eq('category', oldSlug);
        productsCache = null;
      }
      
      res.json(data[0]);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.delete("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabase();
      if (!supabase) return res.status(500).json({ error: "DB not initialized" });
      const { id } = req.params;
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });
  
  app.get("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabase();
      if (!supabase) return res.json(mockProducts);
      const { data, error } = await supabase.from('products').select('*').order('category').order('name');
      if (error) throw error;
      res.json(data);
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.post("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabase();
      if (!supabase) return res.json({ success: false });
      const { error } = await supabase.from('products').insert([req.body]);
      if (error) throw error;
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.patch("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabase();
      if (!supabase) return res.json({ success: false });
      const { error } = await supabase.from('products').update(req.body).eq('id', req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const supabase = getSupabase();
      if (!supabase) return res.json({ success: false });
      const { error } = await supabase.from('products').delete().eq('id', req.params.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (e: any) { res.status(500).json({ error: e.message }); }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving setup
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Provide a wildcard catch-all for single-page apps routing
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
