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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <Container size="lg">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-teal-700 flex items-center justify-center text-white shadow-sm group-hover:shadow transition-shadow">
              <CreditCard className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                FinEmi<span className="text-brand-600 font-bold">.</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-400 -mt-1">
                Smart Financing Marketplace
              </span>
            </div>
          </Link>

          {/* Desktop Search & Quick Tracking */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <form onSubmit={handleTrackSubmit} className="relative w-full">
              <input
                type="text"
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
                placeholder="Track application (e.g. 1FI-2026-984321)..."
                className="w-full bg-slate-100/80 text-sm text-slate-900 pl-9 pr-20 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Track
              </button>
            </form>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/products"
              className="text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors px-3 py-2"
            >
              Catalog
            </Link>
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200/80 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <span>100% Server Verified EMI</span>
            </div>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-4 animate-in slide-in-from-top duration-200">
            <form onSubmit={handleTrackSubmit} className="relative w-full">
              <input
                type="text"
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
                placeholder="Track application reference..."
                className="w-full bg-slate-100 text-sm text-slate-900 pl-9 pr-20 py-2.5 rounded-xl border border-slate-200"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-brand-600 text-white text-xs font-semibold rounded-lg"
              >
                Track
              </button>
            </form>

            <div className="flex flex-col gap-2">
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-800 p-2 rounded-lg hover:bg-slate-100"
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
