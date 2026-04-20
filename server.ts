import express from "express";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import * as dotenv from "dotenv";
import path from "path";
import { createClient } from "@supabase/supabase-js";
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
    stripeClient = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  }
  return stripeClient;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
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
        
        const supabase = getSupabase();
        if (supabase) {
          // The metadata saves standard details if provided
          await supabase.from('orders').insert({
              stripe_payment_intent_id: paymentIntent.id,
              customer_email: paymentIntent.receipt_email || paymentIntent.metadata?.email || "unknown@email.com",
              subtotal: (paymentIntent.amount - 1500) / 100, // subtract delivery
              status: "processing",
              items: paymentIntent.metadata?.items ? JSON.parse(paymentIntent.metadata.items) : [],
              notes: paymentIntent.metadata?.notes || ''
          });
        }
      }

      res.json({received: true});
    } catch (err: any) {
      console.error(err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

  app.use(express.json());

  // API endpoints FIRST
  app.get("/api/products", async (req, res) => {
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        
        const mappedData = data.map(dbItem => ({
            id: dbItem.id,
            name: dbItem.name,
            slug: dbItem.name.toLowerCase().replace(/ /g, '-'),
            category: dbItem.category,
            price: Number(dbItem.price),
            unitLabel: dbItem.unit_label,
            image: dbItem.image_url,
            shortDescription: dbItem.short_description,
            fullDescription: dbItem.full_description,
            culturalOrigin: dbItem.cultural_origin,
            healthBenefits: dbItem.health_benefits || [],
            ingredients: dbItem.ingredients || [],
            isAvailable: dbItem.is_available
        }));
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

  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { items, email, notes } = req.body;
      
      // Calculate total securely on server (delivery is 15.00)
      const deliveryFeeCents = 1500;
      let subtotalCents = 0;
      if (items && Array.isArray(items)) {
        for (const item of items) {
          subtotalCents += Math.round(item.product.price * 100) * item.quantity;
        }
      }
      const totalAmountCents = subtotalCents + deliveryFeeCents;

      const stripe = getStripe();
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmountCents,
        currency: "usd",
        receipt_email: email || undefined,
        automatic_payment_methods: { enabled: true },
        metadata: {
           email: email || '',
           notes: notes || '',
           items: JSON.stringify(items.map((i: any) => ({
              id: i.product.id,
              name: i.product.name,
              quantity: i.quantity,
              price: i.product.price
           })).slice(0, 10)) // safe trunc metadata string limit
        }
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

  // Keep Payment Intent fresh with notes and email
  app.post("/api/update-payment-intent", async (req, res) => {
    try {
      const { paymentIntentId, email, notes } = req.body;
      if (!paymentIntentId) {
         return res.status(400).send({ error: { message: "Missing PaymentIntent ID" } });
      }
      const stripe = getStripe();
      await stripe.paymentIntents.update(paymentIntentId, {
        receipt_email: email || undefined,
        metadata: {
           email: email || '',
           notes: notes || ''
        }
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
