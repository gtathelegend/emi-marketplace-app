import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.js';
import { CatalogPage } from '../../features/catalog/CatalogPage.js';
import { ProductDetailPage } from '../../features/product/ProductDetailPage.js';
import { ApplicationTrackingPage } from '../../features/application/ApplicationTrackingPage.js';

const AdminDashboardPlaceholder = () => (
  <div className="p-8 max-w-4xl mx-auto space-y-4">
    <h1 className="text-2xl font-bold text-slate-900">Admin Management Portal</h1>
    <p className="text-slate-500">Route: /admin (Phase 7 implementation)</p>
  </div>
);

const AdminLoginPlaceholder = () => (
  <div className="p-8 max-w-4xl mx-auto space-y-4">
    <h1 className="text-2xl font-bold text-slate-900">Admin Authentication</h1>
    <p className="text-slate-500">Route: /admin/login (Phase 7 implementation)</p>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/products" replace /> },
      { path: 'products', element: <CatalogPage /> },
      { path: 'products/:slug', element: <ProductDetailPage /> },
      { path: 'applications/:applicationNumber', element: <ApplicationTrackingPage /> },
      { path: 'admin', element: <AdminDashboardPlaceholder /> },
      { path: 'admin/login', element: <AdminLoginPlaceholder /> },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
