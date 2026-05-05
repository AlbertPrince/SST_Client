import React from 'react';
import { Link } from 'react-router-dom';

export const Shipping = () => {
  return (
    <div className="pt-32 pb-20 max-w-4xl mx-auto px-6">
      <div className="mb-16 text-center">
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-on-surface mb-6">
          Shipping & <span className="italic text-primary">Delivery</span>
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          We Deliver the Real Thing — Carefully.
        </p>
      </div>

      <div className="prose prose-lg px-0 md:px-8 max-w-none">
        <p className="text-on-surface-variant leading-relaxed text-lg mb-12">
          Our beverages are handcrafted, fresh, and perishable. That means we take packaging and shipping seriously so every order arrives exactly the way it should — cold, intact, and ready to enjoy.
        </p>

        <div className="space-y-12">
          {/* Local Delivery */}
          <section className="bg-surface-container-low p-8 md:p-10 rounded-3xl border border-outline-variant/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">Local Delivery</h2>
            <p className="text-primary font-bold uppercase tracking-widest text-sm mb-6">Mountain View and surrounding areas</p>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              Free delivery on all local orders within 15 miles of Mountain View. We personally deliver every local order — no third party, no guessing. Just SST, straight to your door.
            </p>
            <ul className="space-y-3 text-on-surface-variant">
              <li><strong className="text-on-surface">Minimum order:</strong> 2 bottles ($24)</li>
              <li><strong className="text-on-surface">Delivery fee:</strong> <span className="text-green-600 font-bold">FREE</span></li>
              <li><strong className="text-on-surface">Delivery radius:</strong> Within 15 miles of Mountain View, CA</li>
              <li><strong className="text-on-surface">Scheduling:</strong> We’ll coordinate a delivery window with you directly after your order is placed.</li>
            </ul>
          </section>

          {/* Extended Bay Area */}
          <section className="bg-surface-container-low p-8 md:p-10 rounded-3xl border border-outline-variant/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-full pointer-events-none"></div>
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">Extended Bay Area Delivery</h2>
            <p className="text-primary font-bold uppercase tracking-widest text-sm mb-6">Oakland, San Francisco, Fremont, and beyond</p>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              We deliver across the greater Bay Area for a flat delivery fee.
            </p>
            <ul className="space-y-3 text-on-surface-variant">
              <li><strong className="text-on-surface">Minimum order:</strong> 2 bottles ($24)</li>
              <li><strong className="text-on-surface">Delivery fee:</strong> $20-$25 (based on distance)</li>
              <li><strong className="text-on-surface">Scheduling:</strong> We’ll confirm your delivery window via email or text after your order is placed.</li>
            </ul>
          </section>

          {/* California Shipping */}
          <section className="bg-surface-container-low p-8 md:p-10 rounded-3xl border border-outline-variant/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/5 rounded-bl-full pointer-events-none"></div>
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">California Shipping</h2>
            <p className="text-primary font-bold uppercase tracking-widest text-sm mb-6">All California zip codes outside the Bay Area</p>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              All California shipments are sent via 2-day expedited shipping in insulated packaging with ice packs to ensure your beverages arrive fresh and cold.
            </p>
            <ul className="space-y-3 text-on-surface-variant">
              <li><strong className="text-on-surface">Minimum order:</strong> 4 bottles ($48)</li>
              <li><strong className="text-on-surface">Shipping fee:</strong> $30-$35 flat rate</li>
              <li><strong className="text-on-surface">Carrier:</strong> USPS Priority Mail / UPS 2-Day</li>
              <li><strong className="text-on-surface">Packaging:</strong> Insulated liner + ice packs included</li>
              <li><strong className="text-on-surface">Processing time:</strong> Orders ship within 1-2 business days of placement</li>
            </ul>
          </section>

          {/* Nationwide Shipping */}
          <section className="bg-surface-container-low p-8 md:p-10 rounded-3xl border border-outline-variant/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2A0E00]/5 rounded-bl-full pointer-events-none"></div>
            <h2 className="font-headline text-3xl font-bold text-on-surface mb-4">Nationwide Shipping</h2>
            <p className="text-primary font-bold uppercase tracking-widest text-sm mb-6">All 50 states</p>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              We ship nationwide via 2-day expedited shipping to keep your beverages fresh from our kitchen to your door.
            </p>
            <ul className="space-y-3 text-on-surface-variant">
              <li><strong className="text-on-surface">Minimum order:</strong> 4 bottles ($48)</li>
              <li><strong className="text-on-surface">Shipping fee:</strong> $45 flat rate</li>
              <li><strong className="text-on-surface">Carrier:</strong> UPS 2-Day / FedEx 2-Day</li>
              <li><strong className="text-on-surface">Packaging:</strong> Insulated liner + ice packs included</li>
              <li><strong className="text-on-surface">Processing time:</strong> Orders ship within 1-2 business days of placement</li>
            </ul>
          </section>

          <hr className="border-outline-variant/30 my-8" />

          {/* Important Notes */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-secondary mb-6">Important Notes</h2>
            <ul className="list-disc pl-5 space-y-4 text-on-surface-variant leading-relaxed text-lg">
              <li><strong className="text-on-surface">All beverages are perishable.</strong> Please refrigerate immediately upon delivery or arrival.</li>
              <li>Someone should be available to receive shipped orders promptly — especially in warm weather.</li>
              <li>We are not responsible for delays caused by the carrier once the package has been handed off. However if there is an issue with your order, please contact us and we will do our best to make it right.</li>
              <li>Weekend orders placed after Friday may ship the following Monday.</li>
            </ul>
          </section>

          {/* Taxes */}
          <section>
            <h2 className="font-headline text-2xl font-bold text-secondary mb-4">Taxes</h2>
            <p className="text-on-surface-variant leading-relaxed text-lg">
              Sales tax is calculated automatically at checkout based on your delivery location and applicable state and local tax rates.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-primary text-on-primary p-10 rounded-3xl mt-12 text-center">
            <h2 className="font-headline text-3xl font-bold mb-4">Have questions about your order?</h2>
            <p className="text-on-primary/90 text-lg mb-8">We’re always happy to help. We typically respond within 24 hours.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6 text-on-primary font-bold">
               <a href="mailto:sst.treat@gmail.com" className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
                 <span className="material-symbols-outlined">mail</span> sst.treat@gmail.com
               </a>
               <a href="tel:+13606087185" className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
                 <span className="material-symbols-outlined">call</span> (360) 608-7185
               </a>
               <a href="https://instagram.com/sstreettreats" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 hover:opacity-80 transition-opacity">
                 <span className="material-symbols-outlined">photo_camera</span> @sstreettreats
               </a>
            </div>
            
            <Link to="/contact" className="mt-8 inline-block px-8 py-3 bg-white text-primary rounded-full font-bold shadow-md hover:scale-105 transition-transform active:scale-95">
              Contact Us Directly
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};
