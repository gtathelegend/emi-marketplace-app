import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Header Placeholder */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-indigo-400">
            <span>FinEmi</span>
            <span className="text-xs bg-indigo-950 border border-indigo-700 text-indigo-300 px-2 py-0.5 rounded-full">
              Marketplace
            </span>
          </Link>
          <nav className="flex space-x-6 text-sm font-medium text-slate-300">
            <Link to="/" className="hover:text-indigo-400 transition-colors">
              Home
            </Link>
            <Link to="/products" className="hover:text-indigo-400 transition-colors">
              Catalog
            </Link>
            <Link to="/admin" className="hover:text-indigo-400 transition-colors">
              Admin Console
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer Placeholder */}
      <footer className="border-t border-slate-800 bg-slate-900 py-6 text-center text-xs text-slate-500">
        <p>FinEmi Marketplace Foundation Phase — Active Engineering Demo</p>
      </footer>
    </div>
  );
};
