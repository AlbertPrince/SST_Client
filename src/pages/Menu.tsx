import React, { useState, useEffect } from 'react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

export const Menu = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedSizes, setSelectedSizes] = useState<Record<string, number>>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  const displayProducts = filter === 'all' ? products : products.filter(p => p.category === filter);
  
  const categories = Array.from(new Set(products.map(p => p.category)));
  const filterTabs = ['all', ...categories];

  const handleQuantityChange = (productId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleSizeChange = (productId: string, sizeIdx: number) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: sizeIdx }));
  };

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 1;
    const sizeIdx = selectedSizes[product.id] ?? -1;
    let finalProduct = product;
    let sizeLabel = undefined;
    
    if (sizeIdx >= 0 && product.sizes && product.sizes[sizeIdx]) {
      finalProduct = { ...product, price: product.sizes[sizeIdx].price };
      sizeLabel = product.sizes[sizeIdx].label;
    }

    addToCart(finalProduct, qty, sizeLabel);
    
    // Reset quantity after adding
    setQuantities(prev => ({ ...prev, [product.id]: 1 }));
  };

  const ProductCard: React.FC<{ product: Product, showBestSeller?: boolean }> = ({ product, showBestSeller = false }) => (
    <div className={`group relative bg-surface-container-low rounded-xl overflow-visible transition-all hover:shadow-xl hover:translate-y-[-4px] flex flex-col ${!product.isAvailable ? 'opacity-70' : ''}`}>
      <div className="h-64 w-full relative overflow-hidden rounded-t-xl mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-transform duration-500 cursor-pointer ${product.isAvailable ? 'group-hover:scale-110' : 'grayscale'}`}
          onClick={() => setSelectedProduct(product)}
          referrerPolicy="no-referrer"
        />
        {showBestSeller && product.isAvailable && (
          <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-widest text-primary uppercase">
            Best Seller
          </div>
        )}
        {!product.isAvailable && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-on-surface/80 backdrop-blur-md px-6 py-2 rounded-full text-sm font-bold tracking-widest text-surface uppercase">
            Sold Out
          </div>
        )}
      </div>
      
      <div className="p-8 pt-2 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 
              className={`text-2xl font-bold font-headline transition-colors ${product.isAvailable ? 'text-on-surface cursor-pointer hover:text-primary' : 'text-on-surface-variant'}`}
              onClick={() => setSelectedProduct(product)}
            >
              {product.name}
            </h3>
            {(!product.sizes || product.sizes.length === 0) ? (
              <span className="text-sm text-on-surface-variant font-medium">{product.unitLabel}</span>
            ) : (
              <select 
                title="Select Size"
                className="mt-1 block text-sm border-none bg-surface-container-high rounded px-2 py-1 outline-none font-bold text-primary disabled:opacity-50"
                value={selectedSizes[product.id] ?? -1} 
                onChange={(e) => handleSizeChange(product.id, Number(e.target.value))}
                disabled={!product.isAvailable}
              >
                <option value={-1}>{product.unitLabel} - ${product.price.toFixed(2)}</option>
                {product.sizes.map((s, idx) => (
                  <option key={idx} value={idx}>{s.label} - ${s.price.toFixed(2)}</option>
                ))}
              </select>
            )}
          </div>
          {(!product.sizes || product.sizes.length === 0) && (
            <span className={`text-2xl font-bold font-headline ${product.isAvailable ? 'text-primary' : 'text-on-surface-variant'}`}>${product.price.toFixed(2)}</span>
          )}
        </div>
        
        <p className="text-on-surface-variant text-lg mb-6 leading-relaxed flex-grow">{product.shortDescription}</p>
        
        <div className="flex items-center justify-between gap-4 mt-auto">
          <div className={`flex items-center bg-surface-container-highest rounded-full px-3 py-1 ${!product.isAvailable ? 'opacity-50 pointer-events-none' : ''}`}>
            <button 
              onClick={() => handleQuantityChange(product.id, -1)}
              className="p-1 hover:text-primary flex items-center justify-center disabled:opacity-50"
              disabled={!product.isAvailable}
            >
              <span className="material-symbols-outlined text-sm">remove</span>
            </button>
            <span className="px-4 font-bold">{quantities[product.id] || 1}</span>
            <button 
              onClick={() => handleQuantityChange(product.id, 1)}
              className="p-1 hover:text-primary flex items-center justify-center disabled:opacity-50"
              disabled={!product.isAvailable}
            >
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
          <button 
            onClick={() => handleAddToCart(product)}
            className={`flex-1 py-3 rounded-full font-bold shadow-md transition-opacity ${product.isAvailable ? 'bg-gradient-to-r from-primary to-primary-container text-on-primary hover:opacity-90' : 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed'}`}
            disabled={!product.isAvailable}
          >
            {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
        <button 
          onClick={() => setSelectedProduct(product)}
          className="mt-4 text-primary font-bold text-sm underline underline-offset-4 hover:text-primary-container text-left w-max"
        >
          Learn More
        </button>
      </div>
    </div>
  );

  const ProductReviews = ({ productId }: { productId: string }) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [authorName, setAuthorName] = useState('');

    useEffect(() => {
      fetch(`/api/reviews/${productId}`)
        .then(res => res.json())
        .then(data => {
          setReviews(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }, [productId]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!text.trim()) return;
      
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, author_name: authorName, rating, text })
      });
      const data = await res.json();
      if (data.success) {
        setReviews([data.review, ...reviews]);
        setText('');
        setAuthorName('');
        setRating(5);
      }
    };

    const avgRating = reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : null;

    return (
      <div className="mt-8 border-t border-outline-variant/20 pt-8">
        <h3 className="text-2xl font-bold font-headline mb-4 flex items-center gap-3">
          Customer Reviews
          {avgRating && (
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">star</span>
              {avgRating} ({reviews.length})
            </span>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="mb-8 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/10">
          <h4 className="font-bold text-sm uppercase tracking-widest text-on-surface-variant mb-4">Leave a Review</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <input 
                type="text" 
                placeholder="Your Name (Optional)" 
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-surface py-2 px-4 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-on-surface-variant">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    type="button" 
                    onClick={() => setRating(star)}
                    className="hover:scale-110 transition-transform"
                  >
                    <span 
                      className={`material-symbols-outlined ${star <= rating ? 'text-[#C97D0A] font-bold' : 'text-outline-variant'}`}
                      style={{ fontVariationSettings: star <= rating ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <textarea 
            placeholder="What did you think of this treat?"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-surface py-3 px-4 rounded-lg outline-none focus:ring-2 focus:ring-primary text-sm resize-none mb-4 h-24"
          />
          
          <div className="flex justify-end">
            <button type="submit" className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold text-sm shadow hover:bg-primary-container transition-colors">
              Submit Review
            </button>
          </div>
        </form>

        {isLoading ? (
          <div className="flex justify-center py-8"><div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full"></div></div>
        ) : reviews.length === 0 ? (
          <p className="text-on-surface-variant text-sm italic text-center py-4 bg-surface-container-lowest rounded-xl">Be the first to review this item!</p>
        ) : (
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {reviews.map(review => (
              <div key={review.id} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10">
                <div className="flex justify-between items-start mb-2">
                  <div>
                     <span className="font-bold text-sm text-on-surface block">{review.author_name}</span>
                     <span className="text-xs text-on-surface-variant">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star}
                        className={`material-symbols-outlined text-[14px] ${star <= review.rating ? 'text-[#C97D0A]' : 'text-outline-variant/30'}`}
                        style={{ fontVariationSettings: star <= review.rating ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed">"{review.text}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="pt-8 pb-20 px-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <header className="mb-16 text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-bold text-on-surface mb-4 leading-tight font-headline">Our Street Menu</h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl font-light italic font-headline">
          From the bustling streets of Accra to your doorstep. Every treat is crafted with heritage recipes and a dash of contemporary soul.
        </p>
      </header>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-4 mb-12 items-center justify-center md:justify-start">
        {filterTabs.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-8 py-2.5 rounded-full font-medium transition-transform transition-colors capitalize ${
              filter === f 
                ? 'bg-primary text-on-primary shadow-lg hover:-translate-y-[2px]' 
                : 'bg-surface-container-highest text-on-surface-variant hover:bg-primary-fixed-dim hover:text-on-primary'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.filter(c => filter === 'all' || filter === c).map(category => {
            const categoryProducts = displayProducts.filter(p => p.category === category);
            if (categoryProducts.length === 0) return null;
            return (
              <React.Fragment key={category}>
                {filter === 'all' && (
                  <div className="md:col-span-2 lg:col-span-3 pt-12 pb-6 first:pt-0">
                    <h2 className="text-4xl font-bold text-on-surface flex items-center gap-4 font-headline space-x-4 capitalize">
                      <span>{category === 'icecream' ? 'Abele Walls' : category}</span>
                      <span className="flex-1 h-[2px] bg-outline-variant opacity-30 mt-2"></span>
                    </h2>
                  </div>
                )}
                {categoryProducts.map(product => (
                  <ProductCard key={product.id} product={product} showBestSeller={product.slug === 'zomkom'} />
                ))}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {/* Modal View for "Learn More" */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}></div>
          <div className="relative bg-surface rounded-3xl max-w-2xl w-full p-6 md:p-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-on-surface-variant hover:text-primary z-[110] p-2 bg-surface-container/80 backdrop-blur rounded-full shadow"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                <div className="flex flex-col gap-4 sticky top-0 self-start">
                  <img 
                    className="rounded-2xl aspect-square object-cover shadow-md w-full" 
                    alt={selectedProduct.name} 
                    src={selectedProduct.image}
                  />
                  <div className="pt-2 flex flex-col gap-4 hidden md:flex">
                    <button 
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-opacity"
                    >
                      Add to Cart - ${((selectedSizes[selectedProduct.id] >= 0 && selectedProduct.sizes ? selectedProduct.sizes[selectedSizes[selectedProduct.id]].price : selectedProduct.price) * (quantities[selectedProduct.id] || 1)).toFixed(2)}
                    </button>
                    <div className="flex items-center justify-center bg-surface-container-highest rounded-full px-3 py-2 shrink-0">
                      <button 
                        onClick={() => handleQuantityChange(selectedProduct.id, -1)}
                        className="p-1 hover:text-primary flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-sm">remove</span>
                      </button>
                      <span className="px-6 font-bold">{quantities[selectedProduct.id] || 1}</span>
                      <button 
                        onClick={() => handleQuantityChange(selectedProduct.id, 1)}
                        className="p-1 hover:text-primary flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-sm">add</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-3xl font-bold font-headline">{selectedProduct.name}</h2>
                      {(!selectedProduct.sizes || selectedProduct.sizes.length === 0) ? (
                        <p className="text-xl font-bold text-primary mt-1">${selectedProduct.price.toFixed(2)} / {selectedProduct.unitLabel}</p>
                      ) : (
                        <select 
                          title="Select Size"
                          className="mt-2 block text-lg border-none bg-surface-container-high rounded px-3 py-2 outline-none font-bold text-primary"
                          value={selectedSizes[selectedProduct.id] ?? -1} 
                          onChange={(e) => handleSizeChange(selectedProduct.id, Number(e.target.value))}
                        >
                          <option value={-1}>{selectedProduct.unitLabel} - ${selectedProduct.price.toFixed(2)}</option>
                          {selectedProduct.sizes.map((s, idx) => (
                            <option key={idx} value={idx}>{s.label} - ${s.price.toFixed(2)}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                  <p className="text-on-surface-variant mb-6 leading-relaxed">
                    {selectedProduct.fullDescription}
                  </p>
                  
                  <div className="bg-surface-container-low p-4 rounded-xl border-l-4 border-primary mb-6">
                    <p className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Ingredients</p>
                    <p className="text-sm text-on-surface">
                      {Array.isArray(selectedProduct.ingredients) ? selectedProduct.ingredients.join(', ') : selectedProduct.ingredients || ''}.
                    </p>
                  </div>
                  
                  {selectedProduct.healthBenefits && selectedProduct.healthBenefits.length > 0 && (
                    <div className="bg-surface-container-low p-4 rounded-xl border-l-4 border-secondary mb-6">
                      <p className="text-sm font-bold uppercase tracking-widest text-secondary mb-2">Why It's Good</p>
                      <ul className="text-sm text-on-surface list-disc list-inside">
                        {Array.isArray(selectedProduct.healthBenefits) ? selectedProduct.healthBenefits.map((benefit, idx) => (
                          <li key={idx}>{benefit}</li>
                        )) : <li>{selectedProduct.healthBenefits}</li>}
                      </ul>
                    </div>
                  )}

                  {/* Mobile Add to Cart (visible only on small screens) */}
                  <div className="mt-4 pt-4 flex flex-col gap-4 md:hidden">
                    <button 
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-3 rounded-full font-bold shadow-md hover:opacity-90 transition-opacity"
                    >
                      Add to Cart - ${((selectedSizes[selectedProduct.id] >= 0 && selectedProduct.sizes ? selectedProduct.sizes[selectedSizes[selectedProduct.id]].price : selectedProduct.price) * (quantities[selectedProduct.id] || 1)).toFixed(2)}
                    </button>
                  </div>
                  
                  {/* Reviews Section */}
                  <ProductReviews productId={selectedProduct.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
