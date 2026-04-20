import React from 'react';

export const About = () => {
  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative px-6 md:px-16 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-on-background leading-tight mb-6 font-headline">
              A Piece of <span className="text-primary italic">Ghana</span> in the Heart of Mountain View.
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed font-light font-headline">
              Founded by Selorm, our mission is to preserve the soulful heritage of West African street food, one small-batch treat at a time.
            </p>
          </div>
          <div className="md:col-span-5 relative mt-8 md:mt-0">
            <div className="rounded-xl overflow-hidden shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                className="w-full h-[350px] md:h-[500px] object-cover" 
                alt="Close up of artisanal Ghanaian bofrot donuts" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_nLGDYl-gR4O4QYe-qfU0OGAbF9N6-bi60BeOd9dbpvPniU-z40m2iFbQwxpSvfBShIuribktB52nn2pNt_VpVXIQrT_eJmCjo_kok13RoW8XhPpcTQMln0dlxl5BI0Sp9a-DMbTKao2uuN5NtUbZALQA2aGx28v3O2hTV0ObFX-9r6BQhtIBgs3HYVtJlr83e2pnpBp23ra2uM9MVuE0OsbWDI9kPJtApXsgFf9EMUus7eQsb9Y0UnY3ir7YxjflFiLhBxjFKX8"
              />
            </div>
            <div className="absolute -bottom-6 left-12 md:-left-6 bg-surface-container-highest p-4 md:p-6 rounded-xl shadow-xl z-20">
              <span className="font-headline italic text-primary text-xl md:text-2xl font-bold">Est. 2021</span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story / Heritage Section */}
      <section className="bg-surface-container-low py-24 px-6 md:px-16 relative">
        <div className="max-w-4xl mx-auto">
          <div className="kente-stripe w-32 mb-12"></div>
          <h2 className="font-headline text-4xl font-bold mb-8 text-on-surface">The Selorm Story</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg leading-relaxed text-on-surface-variant">
            <div className="space-y-6">
              <p>
                Selorm grew up in the vibrant markets of Accra, where the air was thick with the scent of roasted peanuts, fresh ginger, and fermenting dough. To her, these weren't just snacks; they were the rhythmic heartbeat of the city.
              </p>
              <p>
                Moving to the Bay Area meant bringing that heartbeat with her. "I missed the warmth of a fresh bofrot wrapped in newspaper," Selorm recalls. "I wanted Mountain View to experience that same unpretentious joy."
              </p>
            </div>
            <div className="space-y-6">
              <p>
                What started as a kitchen experiment for friends quickly turned into a local obsession. Today, Selorm's Street Treats is more than a bakery—it's a cultural bridge. 
              </p>
              <p>
                Every spice is sourced directly from heritage farmers in Ghana, ensuring that every bite tastes exactly like the sun-drenched afternoons of her childhood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Bento Grid */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <h2 className="font-headline text-3xl font-bold text-center mb-16">The Values That Guide Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Value 1 */}
          <div className="col-span-1 md:col-span-2 bg-surface-container-highest p-10 rounded-xl flex flex-col justify-center">
            <div>
              <span className="material-symbols-outlined text-4xl text-primary mb-6">workspace_premium</span>
              <h3 className="font-headline text-2xl font-bold mb-4">Unyielding Authenticity</h3>
              <p className="text-on-surface-variant leading-relaxed">We don't "twist" flavors. We honor them. Using traditional copper pots and slow-fermentation methods, we preserve the original techniques passed down through generations.</p>
            </div>
          </div>

          {/* Image Box */}
          <div className="col-span-1 md:col-span-2 rounded-xl overflow-hidden h-64 md:h-auto">
            <img 
              className="w-full h-full object-cover" 
              alt="Hands of a woman kneading dough" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsFKlBZjt-Hjm8CEIv_c6jWQapIVyNtUdDDkaV1vYVtxqi63D-MI6VD7VrUx0szVdy4k-OtbVa4yMHN0GCgGUJ7Bayvv88SYuuUcANqspkZUngD51vXnlDdCx1WHZCoQNlK5hapFDiL_2XYEuQPOp05HxcsWSpZExYq73EnDYy8ybv_aj-7O8Rbm9BPeB_xu7W6W430RE8zPkDarBNZ0ltw4bC7gjDwdLvE4YKODZJPIl4KS9Kc1mSsJ0hEI5XbgKCKaHVI7ZEDAA"
            />
          </div>

          {/* Value 2 */}
          <div className="col-span-1 md:col-span-1 bg-surface-container p-8 rounded-xl border-t-4 border-primary shadow-sm hover:-translate-y-1 transition-transform">
            <h3 className="font-headline text-xl font-bold mb-3">Direct Sourcing</h3>
            <p className="text-sm text-on-surface-variant">We partner with independent Ghanaian spice merchants, ensuring fair trade and premium quality.</p>
          </div>

          {/* Value 3 */}
          <div className="col-span-1 md:col-span-1 bg-surface-container p-8 rounded-xl border-t-4 border-secondary/50 shadow-sm hover:-translate-y-1 transition-transform">
            <h3 className="font-headline text-xl font-bold mb-3">Community Hub</h3>
            <p className="text-sm text-on-surface-variant">Our Mountain View shop is a space for storytelling, cultural exchange, and pure enjoyment.</p>
          </div>

          {/* Value 4 */}
          <div className="col-span-1 md:col-span-2 bg-primary text-on-primary p-8 rounded-xl flex items-center justify-center shadow-lg">
            <p className="font-headline text-2xl italic text-center leading-snug">"Bringing the soul of West African street culture to every Silicon Valley corner."</p>
          </div>
          
        </div>
      </section>

      {/* Location Section */}
      <section className="bg-surface-dim py-24 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 order-2 md:order-1">
            <h2 className="font-headline text-4xl font-bold text-on-surface">Visit the Hub</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <span className="material-symbols-outlined text-primary mt-1">location_on</span>
                <div>
                  <h4 className="font-bold text-lg text-on-surface">Mountain View Flagship</h4>
                  <p className="text-on-surface-variant">123 Castro St, Mountain View, CA 94041</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <span className="material-symbols-outlined text-primary mt-1">schedule</span>
                <div>
                  <h4 className="font-bold text-lg text-on-surface">Treat Hours</h4>
                  <p className="text-on-surface-variant">Tue - Sat: 11:00 AM – 7:00 PM</p>
                  <p className="text-on-surface-variant">Sun: 12:00 PM – 5:00 PM</p>
                </div>
              </div>
            </div>
            <a 
              href="https://maps.google.com/?q=123+Castro+St,+Mountain+View,+CA+94041" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-lg hover:bg-primary-container transition-all shadow-lg hover:-translate-y-1"
            >
              Get Directions
            </a>
          </div>
          
          <div className="h-[350px] md:h-[450px] bg-surface-container-highest rounded-2xl overflow-hidden shadow-2xl relative order-1 md:order-2">
            <img 
              className="w-full h-full object-cover" 
              alt="Stylized map showing downtown Mountain View area" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvjDSRGWe_KL3zRT2DyYQiw6e0xbDoizMuLRUCGOyAJEXGiU2Lf2Bk8lQRYlux0ZN_OpGl9YQ86g-fr2J4Fb8yRlc7uGrk2J0y8Zz84HBqTyZ6rxIk2VEySXJaKWBylCgbBOYwesF8ng3LCarR3EIj_Y-uSYkfyAyt0M7Pf7n2KTDofV-_iGvpUEfIM5J7WdusAFa77uUIYQqT6AXWznvgh08L-DmknpFLuDLT8e4q3RPGp1OB_D6nqyPz9rO53gw__3IK5yKrFis"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none mix-blend-multiply"></div>
          </div>
        </div>
      </section>
    </div>
  );
};
