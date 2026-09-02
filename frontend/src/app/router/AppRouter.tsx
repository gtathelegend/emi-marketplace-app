import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.js';
import { CatalogPage } from '../../features/catalog/CatalogPage.js';
import { ProductDetailPage } from '../../features/product/ProductDetailPage.js';
import { ApplicationTrackingPage } from '../../features/application/ApplicationTrackingPage.js';
import { NotFoundPage } from '../../features/common/NotFoundPage.js';
import { AdminAuthProvider } from '../../features/admin/auth/AdminAuthContext.js';
import { ProtectedAdminRoute } from '../../features/admin/components/ProtectedAdminRoute.js';
import { AdminLayout } from '../../features/admin/components/AdminLayout.js';
import { AdminLoginPage } from '../../features/admin/pages/AdminLoginPage.js';
import { AdminDashboardPage } from '../../features/admin/pages/AdminDashboardPage.js';
import { AdminProductsPage } from '../../features/admin/pages/AdminProductsPage.js';
import { AdminProductEditorPage } from '../../features/admin/pages/AdminProductEditorPage.js';
import { AdminEmiPage } from '../../features/admin/pages/AdminEmiPage.js';
import { AdminApplicationsPage } from '../../features/admin/pages/AdminApplicationsPage.js';
import { AdminAuditLogsPage } from '../../features/admin/pages/AdminAuditLogsPage.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/products" replace /> },
      { path: 'products', element: <CatalogPage /> },
      { path: 'products/:slug', element: <ProductDetailPage /> },
      { path: 'applications/:applicationNumber', element: <ApplicationTrackingPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <ProtectedAdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'products/new', element: <AdminProductEditorPage /> },
          { path: 'products/:id/edit', element: <AdminProductEditorPage /> },
          { path: 'emi', element: <AdminEmiPage /> },
          { path: 'applications', element: <AdminApplicationsPage /> },
          { path: 'audit-logs', element: <AdminAuditLogsPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);

export const AppRouter: React.FC = () => {
  return (
    <AdminAuthProvider>
      <RouterProvider router={router} />
    </AdminAuthProvider>
  );
};
