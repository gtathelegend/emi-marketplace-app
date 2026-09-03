import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from './Container';
import { ShieldCheck, Search, Menu, X, CreditCard } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [trackRef, setTrackRef] = useState('');
  const navigate = useNavigate();

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackRef.trim()) {
      navigate(`/applications/${encodeURIComponent(trackRef.trim())}`);
      setTrackRef('');
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gborder transition-all">
      <Container size="lg">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gblue-600 flex items-center justify-center text-white shadow-sm group-hover:bg-gblue-700 transition-colors">
              <CreditCard className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-gdark flex items-center gap-0.5">
                FinEmi<span className="text-brand-600 font-extrabold">.</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-ggray -mt-1">
                Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Search & Quick Application Tracking */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <form onSubmit={handleTrackSubmit} className="relative w-full">
              <input
                type="text"
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
                placeholder="Track application (e.g. 1FI-2026-984321)..."
                className="w-full bg-slate-100/90 text-sm text-gdark pl-9 pr-22 py-2 rounded-xl border border-gborder focus:outline-none focus:ring-2 focus:ring-gblue-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1 bg-gblue-600 hover:bg-gblue-700 active:bg-gblue-800 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Track
              </button>
            </form>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/products"
              className="text-sm font-semibold text-gdark hover:text-gblue-600 transition-colors px-3 py-2"
            >
              Catalog
            </Link>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified EMI Plans</span>
            </div>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-gdark rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-4">
            <form onSubmit={handleTrackSubmit} className="relative w-full">
              <input
                type="text"
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
                placeholder="Track application reference..."
                className="w-full bg-slate-100 text-sm text-gdark pl-9 pr-20 py-2.5 rounded-xl border border-gborder"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-gblue-600 text-white text-xs font-semibold rounded-lg"
              >
                Track
              </button>
            </form>

            <div className="flex flex-col gap-2">
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-semibold text-gdark p-2 rounded-lg hover:bg-slate-100"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};
