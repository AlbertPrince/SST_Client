// This middleware handles route protection if this is run in an environment
// that auto-consumes middleware.ts (e.g. Next.js or Vercel Edge).
// For the SPA running on Express, the equivalent server-side protection
// logic can be added in server.ts and client-side via React router.

import { createClient } from '@supabase/supabase-js';

export async function middleware(req: any, res: any, next: any) {
  // If this is an Express environment
  if (req && res && next) {
    if (req.path.startsWith('/admin') && req.path !== '/admin/login' && !req.path.startsWith('/api/')) {
      // Typically SPA routes rely on client-side routing, but if a hard load hits here:
      // In a real full-stack SSR we'd check cookies. With an SPA, we generally pass
      // the index.html and let the client routing handle redirect.
      // We will let Express serve index.html for SPA by calling next().
    }
    // Protect API routes
    if (req.path.startsWith('/api/admin')) {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
         return res.status(401).json({ error: 'Unauthorized' });
      }
      const token = authHeader.replace('Bearer ', '');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
         return res.status(401).json({ error: 'Unauthorized' });
      }
    }
    return next();
  }
}

export const config = {
  matcher: ['/admin/:path*']
};
