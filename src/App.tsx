import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard/Dashboard';
import InvoicesPage from './pages/Invoice/InvoicesPage';
import InvoiceDetailPage from './pages/Invoice/InvoiceDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          success: {
            style: {
              background: '#16a34a',
              color: '#fff',
              fontSize: '14px',
              borderRadius: '8px',
              padding: '10px 16px',
            },
            iconTheme: { primary: '#fff', secondary: '#16a34a' },
            duration: 3000,
          },
        }}
      />
      <Routes>
        <Route path="/" element={
          <AppProvider>
            <Dashboard />
          </AppProvider>
        } />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/invoices/:id" element={<InvoiceDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
