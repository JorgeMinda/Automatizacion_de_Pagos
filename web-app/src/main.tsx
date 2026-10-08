import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializeQueryClient } from 'wasp/client/operations';
import { App } from './client/App';
import { LandingPage } from './client/pages/LandingPage';
import { LoginPage } from './client/pages/LoginPage';
import { ParentDashboardPage } from './client/pages/ParentDashboardPage';
import { POSCheckoutPage } from './client/pages/POSCheckoutPage';
import { AdminReportsPage } from './client/pages/AdminReportsPage';
import './client/styles/main.css';

// Initialize Wasp's query client infrastructure
initializeQueryClient();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/parent" element={<ParentDashboardPage />} />
            <Route path="/parent/dashboard" element={<ParentDashboardPage />} />
            <Route path="/pos" element={<POSCheckoutPage />} />
            <Route path="/pos/checkout" element={<POSCheckoutPage />} />
            <Route path="/admin" element={<AdminReportsPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
