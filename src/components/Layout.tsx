import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { totalItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const links = [
    { name: 'Menu', path: '/menu' },
    { name: 'Heritage', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Order', path: '/checkout' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 w-full z-50 bg-[#FDF3DC] border-b-4 border-double border-[#C97D0A] shadow-sm">
      <nav className="flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto">
        <div className="font-serif text-xl md:text-2xl font-bold text-[#3B1A00]">
          <Link to="/" className="flex items-center gap-3">
             <img src="/logo.png" alt="Selorm's Street Treats Logo" className="h-10 w-auto object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
             <span>Selorm's Street Treats</span>
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
        
        <div className="flex items-center gap-4 text-[#C97D0A]">
          <Link to="/checkout" className="relative group">
            <button className="material-symbols-outlined p-2 hover:bg-[#E8A020]/10 rounded-full transition-all scale-95 group-active:scale-90 flex items-center justify-center">
              shopping_cart
            </button>
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white transform translate-x-1/4 translate-y-0 bg-[#C0392B] rounded-full border-2 border-[#FDF3DC]">
                {totalItems}
              </span>
            )}
          </Link>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-[#2A0E00] hover:text-[#C97D0A] focus:outline-none p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      
      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#FDF3DC] border-t border-[#C97D0A]/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 font-serif">
            {links.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base ${
                  isActive(link.path) ? 'text-[#C97D0A] font-bold bg-[#E8A020]/10' : 'text-[#2A0E00] hover:text-[#C97D0A] hover:bg-[#E8A020]/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="w-full relative mt-20 pt-1 border-t-4 border-[#C97D0A] bg-[#3B1A00] font-serif text-sm tracking-wide">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 py-10 w-full max-w-7xl mx-auto">
        <div className="text-[#C97D0A] text-xl font-bold italic mb-6 md:mb-0 flex items-center gap-3">
          <img src="/logo.png" alt="SST Logo" className="h-10 w-auto object-contain brightness-0 invert opacity-90" onError={(e) => e.currentTarget.style.display = 'none'} />
          <span>Selorm's Street Treats</span>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 mb-6 md:mb-0">
          <Link to="/contact" className="text-[#FDF3DC]/70 hover:text-[#FDF3DC] transition-opacity">Contact Us</Link>
          <Link to="/history" className="text-[#FDF3DC]/70 hover:text-[#FDF3DC] transition-opacity">Order History</Link>
          <Link to="/admin" className="text-[#FDF3DC]/70 hover:text-[#C97D0A] transition-colors font-bold">Admin Portal</Link>
          <a href="#" className="text-[#FDF3DC]/70 hover:text-[#FDF3DC] transition-opacity">Privacy Policy</a>
          <a href="#" className="text-[#FDF3DC]/70 hover:text-[#FDF3DC] transition-opacity">Shipping Info</a>
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
    <div className="min-h-screen flex flex-col pt-24 bg-background">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
