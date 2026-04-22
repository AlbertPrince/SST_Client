import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Kwame A.",
    rating: 5,
    feedback: "The Abele Walls transported me right back to my childhood in Osu. Absolutely authentic and delicious. I order these every week!"
  },
  {
    id: 2,
    name: "Sarah J.",
    rating: 5,
    feedback: "I tried the Sobolo at a pop-up and was blown away. It has the perfect balance of sweetness and ginger kick. Highly recommend!"
  },
  {
    id: 3,
    name: "David M.",
    rating: 4,
    feedback: "First time trying Hausa Beer and it's incredible. So refreshing on a hot day. The spices are perfectly balanced."
  }
];

export const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setIsLoading(false);
      });
  }, []);
  
  // Grab specific items to feature, or fallback to the first 3 available products
  const zomkom = products.find(p => p.name.toLowerCase().includes('zomkom'));
  const abele = products.find(p => p.name.toLowerCase().includes('abele') && p.name.toLowerCase().includes('original'));
  const streetMix = products.find(p => p.name.toLowerCase().includes('street mix'));

  const featuredProducts = [];
  
  if (zomkom) {
    featuredProducts.push({
      ...zomkom,
      displayTag: 'Refreshing & Spicy',
      description: "Spiced millet drink with a signature kick of ginger and cloves. Served chilled for ultimate refreshment."
    });
  }
  
  if (abele) {
    featuredProducts.push({
      ...abele,
      name: "Abele Walls",
      displayTag: 'Creamy Heritage',
      description: "Our signature traditional cornmeal and milk ice cream. Rich, nostalgic, and perfectly balanced."
    });
  }

  if (streetMix) {
    featuredProducts.push({
      ...streetMix,
      displayTag: 'Daily Special',
      description: "A curated assortment of our finest sweet and savory snacks, changing daily based on local harvest."
    });
  }

  // If we have fewer than 3 featured products, fill the remaining with other items from DB
  for (const p of products) {
    if (featuredProducts.length >= 3) break;
    if (!featuredProducts.find(fp => fp.id === p.id)) {
      featuredProducts.push({
        ...p,
        displayTag: 'Customer Favorite',
        description: p.shortDescription || "Taste the authentic flavors of West Africa."
      });
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[870px] flex items-center overflow-hidden bg-surface-container-low hero-clip">
        <div className="absolute inset-0 z-0">
          <img 
            className="w-full h-full object-cover shadow-2xl opacity-90" 
            alt="Close-up of vibrant Ghanaian street food appetizers" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIOJkuTQPc8yqYJJlsX1BezaV6Ur0rGAOnSOJI9-FvfB3u6z5kDY0_1G-HIgZcVPM-VO2PFfNedAGp536o22YJXXdYtEp61hrwfaNEYC-Rc1p7VgzW85Vc3SvqjKxjRW3P5tJvrd2lErkmO1WiX-nxXDqRlyzK2M0tabxC1JCkSoqXKqgprg_c-VmszMJQH8db6cmWYeTGyadWSJY6GYYgDk0pk4j-090b3GGWT8vBQx57v1If4soqLd1vCJvSoIBb7WON5sBfcRs"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-surface-container-low/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full pt-16 pb-24 md:py-0">
          <div className="max-w-2xl">
            <h1 className="font-headline text-5xl md:text-7xl text-on-surface leading-tight mb-6">
              Authentic Ghanaian Street Flavors · <span className="italic text-primary">A Taste of Home for Everyone</span>
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant mb-10 font-light">
              Handcrafted millet drinks and artisanal ice cream that transport you to the bustling streets of Accra.
            </p>
            <div className="flex flex-wrap gap-4 pb-12 md:pb-0">
              <Link to="/menu" className="bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-5 rounded-full font-semibold text-lg editorial-shadow hover:-translate-y-1 transition-transform active:scale-95">
                Order for Pickup/Delivery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Kente Divider */}
      <div className="kente-stripe"></div>

      {/* Featured Products */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div className="max-w-xl">
            <h2 className="font-headline text-4xl text-on-surface mb-4 italic">The Street's Finest</h2>
            <p className="text-on-surface-variant text-lg">Every treat is a tribute to heritage, crafted with ingredients sourced directly from West African cooperatives.</p>
          </div>
          <Link to="/menu" className="hidden md:block text-primary font-headline font-bold border-b-2 border-primary pb-1 hover:text-primary-container transition-colors">
            View Full Menu
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={`group rounded-xl overflow-hidden editorial-shadow transition-all hover:-translate-y-2 flex flex-col ${
                  index % 2 === 1 ? 'bg-surface-container-highest' : 'bg-surface-container-lowest'
                }`}
              >
                <div className="h-72 overflow-hidden relative">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    alt={product.name} 
                    src={product.image}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <span className="text-tertiary font-bold tracking-widest text-xs uppercase mb-2 block">{product.displayTag}</span>
                  <h3 className="font-headline text-3xl text-secondary mb-3">{product.name}</h3>
                  <p className="text-on-surface-variant mb-8 leading-relaxed flex-1">{product.description}</p>
                  <div className="flex items-center justify-between border-t border-outline-variant pt-6">
                    <span className="font-headline text-2xl text-on-surface">${product.price.toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart(product as any)}
                      className="material-symbols-outlined bg-primary text-on-primary p-3 rounded-full hover:bg-primary-container transition-colors"
                    >
                      add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-8 bg-surface-container-low overflow-hidden relative border-t border-outline-variant/30">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="font-headline text-4xl text-on-surface mb-12 italic">What Our Family Thinks</h2>
          
          <div className="relative bg-surface-container-lowest p-8 md:p-12 rounded-3xl editorial-shadow">
            <button 
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 md:-ml-8 bg-primary text-on-primary p-2 md:p-3 rounded-full hover:bg-primary-container hover:-translate-x-1 transition-all z-20 editorial-shadow"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 md:-mr-8 bg-primary text-on-primary p-2 md:p-3 rounded-full hover:bg-primary-container hover:translate-x-1 transition-all z-20 editorial-shadow"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} />
            </button>

            <div className="min-h-[220px] flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center"
                >
                  <div className="flex gap-1 mb-6 text-[#C97D0A]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i}
                        size={24}
                        fill={i < testimonials[currentTestimonial].rating ? "currentColor" : "none"}
                        className={i < testimonials[currentTestimonial].rating ? "" : "text-outline"}
                      />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl text-on-surface-variant font-light italic mb-8 leading-relaxed max-w-2xl px-6">
                    "{testimonials[currentTestimonial].feedback}"
                  </p>
                  <div className="font-headline font-bold text-lg text-primary">
                    — {testimonials[currentTestimonial].name}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentTestimonial ? "bg-primary w-8" : "bg-primary/30"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-surface-container py-24 px-4 sm:px-8 mt-12 relative border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-primary">nature_people</span>
            </div>
            <h4 className="font-headline text-2xl text-on-surface mb-3">Freshly Prepared</h4>
            <p className="text-on-surface-variant leading-relaxed">Small batches made daily in our kitchen to ensure every sip and scoop tastes exactly like home.</p>
          </div>
          
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-primary">verified</span>
            </div>
            <h4 className="font-headline text-2xl text-on-surface mb-3">No Preservatives</h4>
            <p className="text-on-surface-variant leading-relaxed">We believe in nature's purity. Our ingredients stay honest, shelf-life is natural, and the taste is real.</p>
          </div>
          
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-primary">eco</span>
            </div>
            <h4 className="font-headline text-2xl text-on-surface mb-3">No Additives</h4>
            <p className="text-on-surface-variant leading-relaxed">Pure flavors from Ghana's earth. No synthetic colors or artificial enhancers. Just heritage in a bottle.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-on-primary py-24 px-4 sm:px-8 mt-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        {/* Subtle patterned background or gradient overlay could go here */}
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-headline text-5xl lg:text-6xl font-bold mb-6 italic">Ready to Taste Something Real?</h2>
          <p className="text-xl md:text-2xl font-light mb-10 leading-relaxed opacity-90 max-w-2xl mx-auto">
            Place your order and experience authentic Ghanaian street beverages — crafted in small batches, delivered with love.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
            <Link 
              to="/menu" 
              className="bg-surface text-primary px-12 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform editorial-shadow"
            >
              Order Now
            </Link>
            <a 
              href="https://wa.me/13606087185"
              className="bg-primary-container text-on-primary-container px-12 py-5 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-3 editorial-shadow border border-on-primary/20"
            >
              <span className="material-symbols-outlined">chat</span>
              WhatsApp Order
            </a>
          </div>
          
          <div className="bg-primary-container/20 backdrop-blur-sm p-8 md:p-10 rounded-2xl mx-auto border border-on-primary/10">
            <p className="text-lg md:text-xl font-medium mb-6">
              Available for <strong className="font-bold">pickup</strong>, <strong className="font-bold">local delivery</strong>, and <strong className="font-bold">shipping</strong>.
            </p>
            <div className="h-px bg-on-primary/20 w-3/4 mx-auto mb-6"></div>
            <p className="mb-4 font-medium italic">Payment accepted via Stripe (Credit/Debit), or manually via WhatsApp using:</p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-x-8 gap-y-3 font-mono text-sm md:text-base bg-black/20 py-4 px-6 rounded-xl inline-flex w-full md:w-auto">
              <span><strong className="font-sans text-brand-amber-light">Zelle:</strong> sst.treat@gmail.com</span>
              <span className="hidden md:inline text-on-primary/30">|</span>
              <span><strong className="font-sans text-brand-amber-light">Cash App:</strong> $STamaks</span>
              <span className="hidden md:inline text-on-primary/30">|</span>
              <span><strong className="font-sans text-brand-amber-light">Venmo:</strong> @sstreettreats</span>
            </div>
            <p className="mt-4 text-sm opacity-80">(Cash also accepted for in-person pickups)</p>
          </div>
        </div>
      </section>

      {/* Kente Divider */}
      <div className="kente-stripe border-t border-outline-variant/30"></div>

      {/* Sticky FAB */}
      <div className="fixed bottom-8 right-8 z-40 group">
        <Link to="/menu" className="bg-primary text-on-primary flex items-center gap-3 px-6 py-4 rounded-full editorial-shadow transition-all hover:scale-105 hover:bg-primary-container active:scale-95">
          <span className="material-symbols-outlined">shopping_basket</span>
          <span className="font-semibold uppercase tracking-wider text-sm">Order Now</span>
        </Link>
      </div>
    </div>
  );
};
