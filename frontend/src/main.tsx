import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryProvider } from './app/providers/QueryProvider.js';
import { AppRouter } from './app/router/AppRouter.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  </React.StrictMode>
);
