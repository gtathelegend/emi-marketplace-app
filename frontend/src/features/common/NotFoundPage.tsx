import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../shared/components/ui/Button';
import { Home, SearchX } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
      <div className="p-4 rounded-3xl bg-brand-50 text-brand-600 border border-brand-100">
        <SearchX className="w-12 h-12" />
      </div>

      <div className="max-w-md space-y-2">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-600">
          The page or product link you requested does not exist or has been moved.
        </p>
      </div>

      <Link to="/products">
        <Button variant="primary" size="lg" leftIcon={<Home className="w-4 h-4" />}>
          Back to Marketplace Catalog
        </Button>
      </Link>
    </div>
  );
};
