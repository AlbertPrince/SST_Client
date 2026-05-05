import React from 'react';
import { Link } from 'react-router-dom';

export const Privacy = () => {
  return (
    <div className="pt-32 pb-20 max-w-3xl mx-auto px-6 min-h-[60vh]">
      <div className="mb-12 text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-on-surface mb-6">
          Privacy <span className="italic text-primary">Policy</span>
        </h1>
        <p className="text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
          Information on how we handle your data.
        </p>
      </div>

      <div className="prose prose-lg px-0 md:px-8 max-w-none text-on-surface-variant">
        <p>
          This is a placeholder for the Privacy Policy. Update this page with your actual privacy policy information.
        </p>
        <p>
          If you have any questions about how your data is handled, please <Link to="/contact" className="text-primary hover:underline">contact us</Link>.
        </p>
      </div>
    </div>
  );
};
