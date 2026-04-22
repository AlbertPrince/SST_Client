import React, { useState } from 'react';

export const About = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="pt-24 pb-0">
      {/* SECTION 1 — HERO */}
      <section className="relative px-6 md:px-16 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 z-10">
            <h1 className="text-5xl md:text-7xl font-bold text-on-background leading-tight mb-6 font-headline">
              A Piece of <span className="text-primary italic">Ghana</span> in the Heart of Mountain View.
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant max-w-2xl leading-relaxed font-light font-headline">
              Born from the streets of Ghana. Crafted with care. Made for everyone.
            </p>
          </div>
          <div className="md:col-span-5 relative mt-8 md:mt-0">
            <div className="rounded-xl overflow-hidden shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                className="w-full h-[350px] md:h-[500px] object-cover" 
                alt="Refreshing traditional Ghanaian drinks" 
                src="/sst%20heritage%20edited.png"
              />
            </div>
            <div className="absolute -bottom-6 left-12 md:-left-6 bg-surface-container-highest p-4 md:p-6 rounded-xl shadow-xl z-20">
              <span className="font-headline italic text-primary text-xl md:text-2xl font-bold">Est. 2021</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — WHO WE ARE */}
      <section className="bg-surface-container-low py-24 px-6 md:px-16 text-center md:text-left relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center md:items-start">
          <div className="kente-stripe w-32 mb-10"></div>
          <h2 className="font-headline text-4xl font-bold mb-8 text-on-surface">Who We Are</h2>
          <div className="space-y-6 text-xl leading-relaxed text-on-surface-variant font-light">
            <p>
              Selorm's Street Treats was born from a simple, powerful feeling — the one you get when something you eat or drink takes you somewhere familiar. Somewhere warm. Somewhere that feels like home.
            </p>
            <p>
              We take some of the most beloved treats from the streets of Ghana — Sobolo, Hausa Beer, Zomkom, Samia, and Abele Walls ice cream — and craft them with the same care they've always deserved. No shortcuts. No artificial flavors. Just real ingredients, rooted in tradition, ready to be tasted for the first time or remembered all over again.
            </p>
            <p>
              Whether you grew up knowing these flavors or you're discovering them now — there's a seat at our table for you.
            </p>
            <p className="font-headline text-2xl md:text-3xl font-bold text-[#C97D0A] italic mt-8">
              A Taste of Home — For Everyone.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — MEET SELORM */}
      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <h2 className="font-headline text-4xl font-bold mb-8 text-on-surface">Meet Selorm</h2>
            <div className="space-y-5 text-lg leading-relaxed text-on-surface-variant">
              <p>It started with ice cream.</p>
              <p>Not a business idea. Not a vision board. Just a feeling — the freedom of an afternoon, the heat on your skin, and a cold, creamy Abele Walls in your hand from the vendor just outside the school gate. Pure bliss. Pure childhood.</p>
              <p>I'm Selorm Tamakloe — founder of Selorm's Street Treats, researcher, entrepreneur, and a proud Ghanaian woman building something I hope lasts long after me.</p>
              
              <div className={`${isExpanded ? 'block' : 'hidden md:block'} space-y-5 transition-all duration-500`}>
                <p>Growing up in Ghana, the street was alive in a way I didn't have words for as a child. I just knew it felt good. After school, it was Abele Walls. In the evenings, it was Hausa Beer or Zomkom — earthy, nourishing, shared with people you loved. On hot afternoons, it was Sobolo, cold and tart and alive with ginger. And sometimes it was Samia — bold and tangy, the kind of flavor that made you stop mid-sip and raise an eyebrow in the best possible way.</p>
                <p>These weren't just treats. They were the punctuation of daily life. They were woven into every good memory I have of growing up.</p>
                <p>When I came to the United States, I carried those memories like something precious. And for a long time, I had no way to taste them again. Not the real versions — not made the way they were on those streets, with that care.</p>
                <p>Then life shifted. A layoff brought everything to a stop. And in that disorienting space, something unexpected happened — I stopped moving forward long enough to look back. What I found there was everything I needed. Those flavors. Those memories. That little girl with her ice cream after school.</p>
                <p>I started making the drinks myself. Sobolo, Hausa Beer, Zomkom, Samia — and brought back Abele Walls to honor where it all began. Made from scratch, with whole ingredients, rooted in tradition, offered to anyone willing to try something true.</p>
                <p>SST began in a home kitchen and has been growing one cup, one scoop, one story at a time.</p>
                <p>Every time someone tries these treats for the first time and their eyes light up — or someone from the diaspora takes a sip and goes quiet for a moment, somewhere else for a second, somewhere that feels like home — I know exactly why I started.</p>
                <p className="font-headline font-bold text-xl italic text-primary mt-6">— Selorm</p>
              </div>
              
              {!isExpanded && (
                <button 
                  onClick={() => setIsExpanded(true)}
                  className="md:hidden text-primary font-bold hover:underline mb-2 flex items-center gap-1"
                >
                  Read more <span className="material-symbols-outlined text-sm">expand_more</span>
                </button>
              )}
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="rounded-xl overflow-hidden shadow-2xl relative">
              <img 
                className="w-full h-[500px] object-cover"
                alt="Portrait of Selorm, founder of SST"
                src="https://github.com/AlbertPrince/SST_Client/blob/main/public/Selorm%20SST.jpg?raw=true"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent mix-blend-multiply"></div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — OUR VISION */}
      <section className="bg-[#3B1A00] text-white py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="font-headline text-4xl font-bold mb-6 text-[#FDF3DC]">More Than a Beverage Brand</h2>
            <div className="text-lg leading-relaxed text-[#FDF3DC]/80 space-y-6 font-light">
              <p>SST is more than what's in the cup.</p>
              <p>We believe food and drink are among the most powerful bridges between cultures. SST was founded on the idea that Ghanaian street culture deserves a seat at the table of American food and beverage — that the vibrant flavors enjoyed every day across West Africa are just as worthy of celebration here.</p>
              <p>Our long-term vision is to build SST into a foundation that creates economic opportunity, celebrates African culture, and powers a nonprofit dedicated to the communities that inspired these recipes. Every treat sold is a small step toward something much larger.</p>
            </div>
          </div>
          <div className="flex-1">
            <blockquote className="font-headline text-2xl md:text-3xl italic text-[#C97D0A] leading-relaxed border-l-4 border-[#C97D0A] pl-8 py-2">
              "We're building a taste of home — for everyone — and we're doing it with intention, pride, and a whole lot of ginger."
            </blockquote>
          </div>
        </div>
      </section>

      {/* SECTION 5 — VALUES */}
      <section className="bg-surface-container py-24 px-6 md:px-16 relative border-t-8 border-[#C97D0A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-surface p-10 rounded-xl shadow-sm hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">verified</span>
              </div>
              <h3 className="font-headline text-2xl font-bold mb-4 text-on-surface">Unyielding Authenticity</h3>
              <p className="text-on-surface-variant leading-relaxed">
                We don't twist flavors. We honor them. Real ingredients, traditional methods, no shortcuts — because these recipes have always deserved better than shortcuts.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-surface p-10 rounded-xl shadow-sm hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-secondary text-2xl">menu_book</span>
              </div>
              <h3 className="font-headline text-2xl font-bold mb-4 text-on-surface">Rooted in Tradition</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Every product traces back to the streets of Ghana — made the way it was always made, by people who grew up knowing exactly what it should taste like.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-surface p-10 rounded-xl shadow-sm hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-[#C97D0A]/20 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#C97D0A] text-2xl">diversity_3</span>
              </div>
              <h3 className="font-headline text-2xl font-bold mb-4 text-on-surface">Community First</h3>
              <p className="text-on-surface-variant leading-relaxed">
                SST is a bridge. Between cultures, between generations, between the person discovering these flavors for the first time and the one tasting home all over again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 — VISIT THE HUB */}
      <section className="bg-surface-dim pt-24 pb-0 px-6 md:px-16">
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
              className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-lg hover:bg-primary-container transition-all shadow-lg hover:-translate-y-1 mt-4"
            >
              Get Directions
            </a>
          </div>
          
          <div className="h-[350px] md:h-[450px] bg-surface-container-highest rounded-2xl overflow-hidden shadow-2xl relative order-1 md:order-2">
            <img 
              className="w-full h-full object-cover" 
              alt="Stylized map showing downtown Mountain View area" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvjDSRGWe_KL3zRT2DyYQiw6e0xbDoizMuLRUCGOyAJEXGiU2Lf2Bk8lQRYlux0ZN_OpGl9YQ86g-fr2J4Fb8yRlc7uGrk2J0y8Zz84HBqTyZ6rxIk2VEySXJaKWBylCgbBOYwesF8ng3LCarR3EIj_Y-uSYkfyAyt0M7Pf7n2KTDofV-_iGvpUEfIM5J7WdusAFa77uUIYQqT6AXWznvgh08L-DmknpFLuDLT8e4q3RPGp1OB_D6nqyPz9rO53gw__3IK5yKrFis"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none mix-blend-multiply"></div>
          </div>
        </div>
      </section>
    </div>
  );
};
