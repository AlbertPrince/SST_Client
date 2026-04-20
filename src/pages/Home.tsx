import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

export const Home = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  
  // Using the exact products from the reference design
  const zomkom = products.find(p => p.name.toLowerCase().includes('zomkom'));
  const abele = products.find(p => p.name.toLowerCase().includes('abele') && p.name.toLowerCase().includes('original'));

  const featuredProducts = [];
  
  if (zomkom) {
    featuredProducts.push({
      ...zomkom,
      displayTag: 'Refreshing & Spicy',
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbDfSNX51_wOebCFnwvRXwEj7PRXBusQaEMyp-RU-Dy5SXCGMpWzeYXJgfu0i6Dem99g85N4-Rwfosd3rwwiE1xKxeTyfamW-G7pplV4yrzcQHv05hBAVVXQh2GAugVpkrd5RDSM5M5_aD43eorNT5kSgq9sQeAO9LNZamXlUW1v0SN2Nn-QgTfAhX91uf5D9zBtClEYzaDDNlzxTl5fwcHLr30p8Dm-BnOYffVIu6P21lj6i0eu9D3q9fk-dV0qeiafCpTANuS5I",
      description: "Spiced millet drink with a signature kick of ginger and cloves. Served chilled for ultimate refreshment.",
      price: 15.00
    });
  }
  
  if (abele) {
    featuredProducts.push({
      ...abele,
      name: "Abele Walls",
      displayTag: 'Creamy Heritage',
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCh7nwDwHrTTgDjar49RSDp3W0GP2iA2Y7mRv5kFsWTsSi45lBHXdSuTDJqGQjYut4N5BPDz-647mWrfaE-gp9NOWz38Us_DR7lIuj5ycGKRRxsN11jnYJeJNm4bBhavs0hnECI8yYFIZoe_OMbNtS3kKiWvWKaEaEC-nYaob0pDtIWoEgOP8EEc38sWXB0TZ0vNTJsEJr24rf5AWHXR1iuPJL0j75O1KZc_UgnBex1yijz8cMCeApRT2FJCwzcwqab6tmQiRQ1LZU",
      description: "Our signature traditional cornmeal and milk ice cream. Rich, nostalgic, and perfectly balanced.",
      price: 20.00
    });
  }

  // Always add street mix
  featuredProducts.push({
    id: "street-mix",
    name: "Street Mix",
    slug: "street-mix",
    category: "other",
    displayTag: 'Daily Special',
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0PCDdbLtIymadBWISjPzOaPb75wT-xsRJUX__nPHIlCXsNQUdvrOBRvCWbVf9IWW01hN99V02TWFQ9aNg6E1MIwGEGIDuoRPSijv_wCv9-dZ1-HTNTqA0ESaJk0RtuVEkaNm0FY6pmTboDn4qm6CEmgVsWVzDqWi8w6BN67nr-eN2xkUbZ4UkQMNMmKn1o7ec4LGaiv0nZuFKeHK9iQjN3lUc7kOWwxUPuHYSdOTH7XxXWPSi-RKcRTxaqaWpI0B6wpF8e8VGw5M",
    description: "A curated assortment of our finest sweet and savory snacks, changing daily based on local harvest.",
    price: 25.00,
    unitLabel: 'Box',
    shortDescription: '',
    fullDescription: '',
    culturalOrigin: '',
    healthBenefits: [],
    ingredients: [],
    isAvailable: true
  } as unknown as Product & { displayTag: string; description: string; });

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
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="font-headline text-5xl md:text-7xl text-on-surface leading-tight mb-6">
              Authentic Ghanaian Street Flavors · <span className="italic text-primary">A Taste of Home for Everyone</span>
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant mb-10 font-light">
              Handcrafted millet drinks and artisanal ice cream that transport you to the bustling streets of Accra.
            </p>
            <div className="flex flex-wrap gap-4">
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

      {/* Kente Divider */}
      <div className="kente-stripe mt-12"></div>

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
