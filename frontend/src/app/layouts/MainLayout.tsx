import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../../shared/components/layout/Header';
import { Container } from '../../shared/components/layout/Container';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200/80 py-8 mt-12">
        <Container size="lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-700">FinEmi Marketplace</p>
              <p className="mt-0.5">Browse products with flexible EMI financing options.</p>
            </div>
            <p>© 2026 FinEmi Marketplace</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};
