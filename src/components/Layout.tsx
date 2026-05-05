import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Home, Store, BookHeart, Phone, ShoppingCart, User, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      navigate('/');
    }
  };

  const links = [
    { name: 'Menu', path: '/menu' },
    { name: 'Heritage', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#FDF3DC] border-b-4 border-double border-[#C97D0A] shadow-sm">
        <nav className="flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto">
          <div className="font-serif text-xl md:text-2xl font-bold text-[#3B1A00]">
            <Link to="/" className="flex items-center gap-3">
               <img src="/final-logo.png" alt="Selorm's Street Treats Logo" className="h-14 md:h-16 w-auto object-contain" />
               <span className="truncate hidden sm:block">Selorm's Street Treats</span>
            </Link>
          </div>
          
          <div className="hidden md:flex gap-8 items-center font-serif text-lg">
            {links.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={isActive(link.path) 
                  ? "text-[#C97D0A] font-bold border-b-2 border-[#C97D0A] pb-1"
                  : "text-[#2A0E00] hover:text-[#C97D0A] transition-colors"
                }
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-2 md:gap-6 text-[#C97D0A]">
            {session ? (
              <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm font-semibold font-serif whitespace-nowrap">
                <Link to="/history" className="text-[#3B1A00] hover:text-[#C97D0A] transition-colors flex items-center gap-1">
                  <User size={18} /> <span className="hidden md:inline">My Orders</span>
                </Link>
                {(session?.user?.email?.toLowerCase() === 'ss.treat@gmail.com' || session?.user?.email?.toLowerCase() === 'apmensah@gmail.com' || session?.user?.email?.toLowerCase() === 'sst.treat@gmail.com') && (
                   <Link to="/admin" className="text-[#3B1A00] hover:text-[#C97D0A] transition-colors font-bold">Admin</Link>
                )}
                <button onClick={handleSignOut} className="text-[#3B1A00]/70 hover:text-[#C0392B] transition-colors flex items-center gap-1">
                  <LogOut size={18} /> <span className="hidden md:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link to="/auth/login" className="text-xs md:text-sm font-bold font-serif text-[#3B1A00] hover:text-[#C97D0A] transition-colors border-2 border-[#C97D0A] px-3 py-1 md:px-4 md:py-1.5 rounded-full hover:bg-[#C97D0A]/5 whitespace-nowrap">
                Sign In
              </Link>
            )}

            <Link to="/checkout" className="relative group hidden md:block">
              <button className="material-symbols-outlined p-2 hover:bg-[#E8A020]/10 rounded-full transition-all scale-95 group-active:scale-90 flex items-center justify-center">
                shopping_cart
              </button>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white transform translate-x-1/4 translate-y-0 bg-[#C0392B] rounded-full border-2 border-[#FDF3DC]">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FDF3DC] border-t-2 border-[#C97D0A] z-50 px-2 pt-2 flex justify-around items-center shadow-[0_-4px_10px_rgba(0,0,0,0.05)] font-serif" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <Link to="/" className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive('/') ? 'text-[#C97D0A]' : 'text-[#3B1A00]/70'}`}>
          <Home size={22} className={isActive('/') ? 'fill-[#C97D0A]/20' : ''} />
          <span className="text-[10px] font-bold mt-1">Home</span>
        </Link>
        <Link to="/menu" className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive('/menu') ? 'text-[#C97D0A]' : 'text-[#3B1A00]/70'}`}>
          <Store size={22} className={isActive('/menu') ? 'fill-[#C97D0A]/20' : ''} />
          <span className="text-[10px] font-bold mt-1">Menu</span>
        </Link>
        <Link to="/about" className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive('/about') ? 'text-[#C97D0A]' : 'text-[#3B1A00]/70'}`}>
          <BookHeart size={22} className={isActive('/about') ? 'fill-[#C97D0A]/20' : ''} />
          <span className="text-[10px] font-bold mt-1">Heritage</span>
        </Link>
        <Link to="/contact" className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive('/contact') ? 'text-[#C97D0A]' : 'text-[#3B1A00]/70'}`}>
          <Phone size={22} className={isActive('/contact') ? 'fill-[#C97D0A]/20' : ''} />
          <span className="text-[10px] font-bold mt-1">Contact</span>
        </Link>
        {(session?.user?.email?.toLowerCase() === 'ss.treat@gmail.com' || session?.user?.email?.toLowerCase() === 'apmensah@gmail.com' || session?.user?.email?.toLowerCase() === 'sst.treat@gmail.com') && (
          <Link to="/admin" className={`flex flex-col items-center p-2 rounded-xl transition-all ${isActive('/admin') ? 'text-[#C97D0A]' : 'text-[#3B1A00]/70'}`}>
            <span className="material-symbols-outlined text-[22px] leading-none mb-1">dashboard</span>
            <span className="text-[10px] font-bold">Admin</span>
          </Link>
        )}
        <Link to="/checkout" className={`flex flex-col items-center p-2 rounded-xl transition-all relative ${isActive('/checkout') || isActive('/order/confirmation') ? 'text-[#C97D0A]' : 'text-[#3B1A00]/70'}`}>
          <div className="relative">
            <ShoppingCart size={22} className={isActive('/checkout') || isActive('/order/confirmation') ? 'fill-[#C97D0A]/20' : ''} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-[#C0392B] rounded-full border border-[#FDF3DC]">
                {totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1">Cart</span>
        </Link>
      </div>
    </>
  );
};

const Footer = () => {
  return (
    <footer className="w-full relative mt-20 pt-1 border-t-4 border-[#C97D0A] bg-[#3B1A00] font-serif text-sm tracking-wide">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-10 w-full max-w-7xl mx-auto">
        <div className="text-[#C97D0A] text-xl font-bold italic mb-6 md:mb-0 flex items-center gap-3">
          <img src="/final-logo.png" alt="SST Logo" className="h-12 md:h-14 w-auto object-contain brightness-0 invert opacity-90" />
          <span>Selorm's Street Treats</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-6 md:mb-0">
          <Link to="/contact" className="text-[#FDF3DC]/70 hover:text-[#FDF3DC] transition-opacity">Contact Us</Link>
          <Link to="/shipping" className="text-[#FDF3DC]/70 hover:text-[#FDF3DC] transition-opacity">Shipping Info</Link>
          <Link to="/privacy" className="text-[#FDF3DC]/70 hover:text-[#FDF3DC] transition-opacity">Privacy Policy</Link>
          // <Link to="/admin" className="text-[#C97D0A] font-bold hover:text-[#E8A020] transition-colors border border-[#C97D0A]/30 px-3 py-0.5 rounded-full text-xs flex items-center">Admin Portal</Link>
        </div>
        <div className="text-[#FDF3DC]/50 text-xs text-center md:text-right">
          © {new Date().getFullYear()} Selorm's Street Treats. Crafted with Heritage.
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-[#3B1A00] via-[#C97D0A] to-[#C0392B]"></div>
    </footer>
  );
};

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col pt-24 pb-20 md:pb-0 bg-background">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
