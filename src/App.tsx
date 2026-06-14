import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard/Dashboard';
import InvoicesPage from './pages/Invoice/InvoicesPage';
import InvoiceDetailPage from './pages/Invoice/InvoiceDetailPage';

export default function App() {
  return (
    <BrowserRouter>
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
