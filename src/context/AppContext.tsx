import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
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

  const loadData = useCallback(async () => {
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
  }, []);

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (!selectedCompany) return;
    Promise.all([
      getCards(selectedCompany.id),
      getInvoices(selectedCompany.id),
    ]).then(([cardsData, invoicesData]) => {
      setCards(cardsData);
      setInvoices(invoicesData.filter(i => i.company_id === selectedCompany.id));
    }).catch(() => setError('Failed to load data'));
  }, [selectedCompany?.id]);

  useEffect(() => {
    if (!selectedCompany || !cards[0]) return;
    getTransactions(selectedCompany.id, cards[0].id).then(txData => {
      setTransactions(txData);
    }).catch(() => setError('Failed to load transactions'));
  }, [selectedCompany?.id, cards[0]?.id]);

  const updateCard = useCallback((updated: Card) =>
    setCards(prev => prev.map(c => c.id === updated.id ? updated : c)), []);

  const handleSetSelectedCompany = useCallback((company: Company) => {
    setSelectedCompany(company);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    companies,
    selectedCompany,
    cards,
    invoices,
    transactions,
    loading,
    error,
    setSelectedCompany: handleSetSelectedCompany,
    updateCard,
    refetch: loadData,
  }), [user, companies, selectedCompany, cards, invoices, transactions, loading, error, handleSetSelectedCompany, updateCard, loadData]);

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
