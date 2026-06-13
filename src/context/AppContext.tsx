import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Company, Card, Invoice, Transaction, User } from '../types';
import { getUsers, getCompanies, getCards, getInvoices, getTransactions } from '../api/companies';

interface AppState {
  user: User | null;
  companies: Company[];
  selectedCompany: Company | null;
  cards: Card[];
  invoices: Invoice[];
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  setSelectedCompany: (company: Company) => void;
  updateCard: (card: Card) => void;
  refetch: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await getUsers();
      const firstUser = users[0] ?? null;
      setUser(firstUser);

      if (firstUser) {
        const companiesData = await getCompanies(firstUser.id);
        setCompanies(companiesData);
        setSelectedCompany(companiesData[0] ?? null);
      }
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (!selectedCompany) return;
    Promise.all([
      getCards(selectedCompany.id),
      getInvoices(selectedCompany.id),
      getTransactions(selectedCompany.id),
    ]).then(([cardsData, invoicesData, txData]) => {
      setCards(cardsData);
      setInvoices(invoicesData.filter(i => i.company_id === selectedCompany.id));
      setTransactions(txData);
    }).catch(() => setError('Failed to load data'));
  }, [selectedCompany?.id]);

  const updateCard = (updated: Card) =>
    setCards(prev => prev.map(c => c.id === updated.id ? updated : c));

  return (
    <AppContext.Provider value={{
      user, companies, selectedCompany, cards, invoices, transactions,
      loading, error, setSelectedCompany, updateCard, refetch: loadData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
