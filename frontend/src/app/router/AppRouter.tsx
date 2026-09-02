import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.js';

const HomePagePlaceholder = () => (
  <div className="space-y-4">
    <h1 className="text-3xl font-bold text-slate-100">FinEmi Marketplace</h1>
    <p className="text-slate-400">Phase 1 Foundation — Architecture & Routing Placeholder</p>
  </div>
);

const CatalogPagePlaceholder = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-slate-100">Product Catalog</h1>
    <p className="text-slate-400">Route: /products (Phase 6 implementation)</p>
  </div>
);

const ProductDetailPagePlaceholder = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-slate-100">Product Detail Page</h1>
    <p className="text-slate-400">Route: /products/:slug (Phase 6 implementation)</p>
  </div>
);

const ApplicationStatusPagePlaceholder = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-slate-100">Application Tracking</h1>
    <p className="text-slate-400">Route: /applications/:id (Phase 6 implementation)</p>
  </div>
);

const AdminDashboardPlaceholder = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-slate-100">Admin Management Portal</h1>
    <p className="text-slate-400">Route: /admin (Phase 7 implementation)</p>
  </div>
);

const AdminLoginPlaceholder = () => (
  <div className="space-y-4">
    <h1 className="text-2xl font-bold text-slate-100">Admin Authentication</h1>
    <p className="text-slate-400">Route: /admin/login (Phase 7 implementation)</p>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePagePlaceholder /> },
      { path: 'products', element: <CatalogPagePlaceholder /> },
      { path: 'products/:slug', element: <ProductDetailPagePlaceholder /> },
      { path: 'applications/:id', element: <ApplicationStatusPagePlaceholder /> },
      { path: 'admin', element: <AdminDashboardPlaceholder /> },
      { path: 'admin/login', element: <AdminLoginPlaceholder /> },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
