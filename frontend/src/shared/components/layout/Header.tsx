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
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gblue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-gblue-700 transition-colors">
              <CreditCard className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-gdark">
              EMI <span className="font-normal text-ggray text-sm">App</span>
            </span>
          </Link>

          {/* Desktop Search & Quick Application Tracking */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <form onSubmit={handleTrackSubmit} className="relative w-full">
              <input
                type="text"
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
                placeholder="Track application (e.g. 1FI-2026-984321)..."
                className="w-full bg-[#F1F3F4] hover:bg-[#E8EAED] text-sm text-gdark pl-9 pr-20 py-2 rounded-xl border border-transparent focus:border-gborder focus:bg-white focus:outline-none focus:ring-2 focus:ring-gblue-500/20 transition-all placeholder:text-slate-400"
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
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/products"
              className="text-sm font-medium text-gdark hover:text-gblue-600 hover:bg-slate-50 transition-colors px-3 py-1.5 rounded-lg"
            >
              Products
            </Link>
            <Link
              to="/admin"
              className="text-sm font-medium text-ggray hover:text-gdark hover:bg-slate-50 transition-colors px-3 py-1.5 rounded-lg"
            >
              Admin
            </Link>
            <div className="ml-2 flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified EMI</span>
            </div>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-gdark rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <form onSubmit={handleTrackSubmit} className="relative w-full">
              <input
                type="text"
                value={trackRef}
                onChange={(e) => setTrackRef(e.target.value)}
                placeholder="Track application reference..."
                className="w-full bg-[#F1F3F4] text-sm text-gdark pl-9 pr-20 py-2.5 rounded-xl border border-gborder focus:bg-white focus:outline-none focus:ring-2 focus:ring-gblue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-3 py-1.5 bg-gblue-600 text-white text-xs font-semibold rounded-lg"
              >
                Track
              </button>
            </form>

            <div className="flex flex-col gap-1">
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-gdark p-2 rounded-lg hover:bg-slate-100"
              >
                Products
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-medium text-gdark p-2 rounded-lg hover:bg-slate-100"
              >
                Admin Portal
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
};
