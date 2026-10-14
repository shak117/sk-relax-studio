import React from 'react';
import { Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { usePageSEO } from '../hooks/usePageSEO';

export const NotFoundPage: React.FC = () => {
  usePageSEO({
    title: 'Page Not Found | SK Relax Beauty Academy & Salon, Satara',
    description: 'The requested page could not be located.',
    path: '/404',
  });

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-ivory px-4 py-20 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <span className="text-xs uppercase tracking-widest text-rose-600 font-sans font-semibold">
          Error 404
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl text-forest-900 font-light">
          Page Not <span className="font-serif italic text-rose-500">Found</span>
        </h1>
        <p className="text-xs sm:text-sm text-forest-700/80 leading-relaxed font-sans">
          The page you are looking for may have been moved or is currently unavailable. Please explore our main salon destinations below.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button to="/" variant="primary" size="md" icon={<Home size={15} />}>
            Back to Home
          </Button>
          <Button to="/services" variant="outline" size="md">
            View Services
          </Button>
        </div>
      </div>
    </div>
  );
};
