import React, { useState } from 'react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    quantity: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    
    setErrorMessage('');
    
    let waText = `*New Bulk Order Inquiry*\n\n`;
    waText += `Name: ${formData.name}\n`;
    waText += `Email: ${formData.email}\n`;
    if (formData.quantity) waText += `Quantity Needed: ${formData.quantity}\n`;
    waText += `\nMessage:\n${formData.message}`;
    
    window.open(`https://wa.me/13606087185?text=${encodeURIComponent(waText)}`, '_blank', 'noreferrer,noopener');
    
    setFormData({ name: '', email: '', message: '', quantity: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="px-6 md:px-16 mb-24 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7">
          <div className="kente-stripe w-32 mb-8"></div>
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-on-surface mb-6 leading-tight">
            Share a Taste of <span className="italic text-primary">Home.</span>
          </h1>
          <p className="text-xl text-on-surface-variant max-w-xl leading-relaxed mb-10 font-headline font-light">
            Looking to bring authentic Ghanaian flavors to your next celebration? Whether it's a small gathering or a grand event, our handcrafted traditional drinks and Abele Walls ice cream offer a unique cultural experience. Reach out for bulk orders, collaborations, or just to say hello.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="https://wa.me/13606087185" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg hover:shadow-xl transition-all scale-100 active:scale-95"
            >
              <span className="material-symbols-outlined mr-2">chat</span>
              WhatsApp Click-to-Chat
            </a>
            <a 
              href="#bulk-order" 
              className="inline-flex items-center justify-center px-8 py-4 bg-surface-container-high text-primary font-bold rounded-xl hover:bg-surface-container-highest transition-all"
            >
              View Bulk Form
            </a>
          </div>
        </div>
        
        <div className="md:col-span-5 relative mt-8 md:mt-0">
          <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            <img 
              alt="Abele Walls Ghanaian Ice Cream" 
              className="w-full h-full object-cover" 
              src="/abele%20walls%20casual%20edited.png"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-primary p-6 rounded-xl shadow-xl hidden md:block z-20">
            <p className="font-headline text-on-primary italic text-lg text-center leading-tight">Authentic<br/>Flavors</p>
          </div>
        </div>
      </section>

      {/* Bento Contact Grid */}
      <section className="px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {/* Location Card */}
        <div className="md:col-span-2 bg-surface-container rounded-xl p-8 md:p-10 flex flex-col justify-between">
          <div>
            <span className="material-symbols-outlined text-primary text-4xl mb-4">location_on</span>
            <h3 className="font-headline text-3xl font-bold mb-4 text-on-surface">Find Us</h3>
            <p className="text-lg text-on-surface-variant mb-2">Mountain View, CA</p>
            <p className="text-sm uppercase tracking-widest text-primary font-bold mb-8">Serving the entire Bay Area</p>
          </div>
          <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden transition-all duration-700 mt-4 md:mt-0 shadow-sm border border-outline-variant/30">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101397.71181216503!2d-122.14660305820313!3d37.38605170000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02425dad8f%3A0x6c296c66619367e0!2sMountain%20View%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps Location - Selorm's Street Treats Mountain View"
            ></iframe>
          </div>
        </div>

        {/* Social/Digital Card */}
        <div className="md:col-span-1 bg-secondary-container rounded-xl p-8 md:p-10 flex flex-col justify-between text-on-secondary-container">
          <div>
            <h3 className="font-headline text-3xl font-bold mb-8">Get Social</h3>
            <ul className="space-y-6">
              <li>
                <a href="mailto:sst.treat@gmail.com" className="flex items-center group cursor-pointer">
                  <span className="material-symbols-outlined mr-4 group-hover:scale-110 transition-transform">mail</span>
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-80 mb-1">Email</p>
                    <p className="font-bold text-lg">sst.treat@gmail.com</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="https://instagram.com/sstreettreats" target="_blank" rel="noopener noreferrer" className="flex items-center group cursor-pointer">
                  <span className="material-symbols-outlined mr-4 group-hover:scale-110 transition-transform">photo_camera</span>
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-80 mb-1">Instagram</p>
                    <p className="font-bold text-lg">@sstreettreats</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="tel:+13606087185" className="flex items-center group cursor-pointer">
                  <span className="material-symbols-outlined mr-4 group-hover:scale-110 transition-transform">call</span>
                  <div>
                    <p className="text-xs uppercase tracking-widest opacity-80 mb-1">Phone</p>
                    <p className="font-bold text-lg">(360) 608-7185</p>
                  </div>
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-8 pt-8 border-t border-on-secondary-container/20">
            <p className="italic font-headline text-lg">"A Taste of Home — For Everyone."</p>
          </div>
        </div>
      </section>

      {/* Bulk Order Form Section */}
      <section id="bulk-order" className="px-6 md:px-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start bg-surface-container-low py-16 rounded-3xl">
        <div className="lg:sticky lg:top-24">
          <h2 className="font-headline text-4xl md:text-5xl font-bold mb-6 text-on-surface">Bulk Order <span className="text-primary italic">Inquiry</span></h2>
          <p className="text-on-surface-variant text-lg mb-8 leading-relaxed">
            Planning an event, wedding, or corporate gathering? Our handcrafted drinks and Abele Walls ice cream packages are perfect for sharing our rich culture with your guests. Fill out the form below and we'll reach out within 24 hours to coordinate.
          </p>
          <div className="space-y-4">
            <div className="flex items-center text-on-surface-variant text-lg">
              <span className="material-symbols-outlined text-primary mr-3">check_circle</span>
              <span>Authentic Ghanaian Ingredients</span>
            </div>
            <div className="flex items-center text-on-surface-variant text-lg">
              <span className="material-symbols-outlined text-primary mr-3">check_circle</span>
              <span>No Preservatives or Additives</span>
            </div>
            <div className="flex items-center text-on-surface-variant text-lg">
              <span className="material-symbols-outlined text-primary mr-3">check_circle</span>
              <span>Bay Area Pickup & Delivery Options</span>
            </div>
          </div>
        </div>
        
        <div className="bg-surface-container-lowest p-8 md:p-10 rounded-2xl shadow-sm border border-outline-variant/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="font-headline font-bold text-sm mb-2 text-on-surface">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name" 
                  className="bg-surface-container-highest border-b-2 border-transparent focus:border-primary focus:bg-white focus:ring-0 px-4 py-3 rounded-t-lg transition-all w-full outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-headline font-bold text-sm mb-2 text-on-surface">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email Address" 
                  className="bg-surface-container-highest border-b-2 border-transparent focus:border-primary focus:bg-white focus:ring-0 px-4 py-3 rounded-t-lg transition-all w-full outline-none"
                />
              </div>
            </div>
            
            <div className="flex flex-col">
              <label className="font-headline font-bold text-sm mb-2 text-on-surface">Quantity (Optional)</label>
              <input 
                type="text" 
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Approx. Number of Servings" 
                className="bg-surface-container-highest border-b-2 border-transparent focus:border-primary focus:bg-white focus:ring-0 px-4 py-3 rounded-t-lg transition-all w-full outline-none"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="font-headline font-bold text-sm mb-2 text-on-surface">Message</label>
              <textarea 
                rows={4}
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us about your event..." 
                className="bg-surface-container-highest border-b-2 border-transparent focus:border-primary focus:bg-white focus:ring-0 px-4 py-3 rounded-t-lg transition-all w-full outline-none resize-none"
              ></textarea>
            </div>
            
            {errorMessage && (
              <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-medium">
                {errorMessage}
              </div>
            )}
            
            <button 
              type="submit" 
              className="w-full py-4 mt-2 bg-primary text-on-primary font-bold rounded-xl shadow-md hover:bg-primary-container transition-all active:scale-95 text-lg"
            >
              Submit Inquiry
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
