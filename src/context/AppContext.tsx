import { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompanyState] = useState<Company | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const STORAGE_KEY = 'selectedCompanyId';

  // Read searchParams via ref so loadData doesn't re-create on URL changes
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

        // Priority: URL param → localStorage → first company
        const companyIdParam =
          searchParamsRef.current.get('companyId') ||
          localStorage.getItem(STORAGE_KEY);
        const defaultCompany = companiesData[0] ?? null;

        const company = (companyIdParam && companiesData.find(c => c.id === companyIdParam)) || defaultCompany;
        setSelectedCompanyState(company);
        if (company) {
          localStorage.setItem(STORAGE_KEY, company.id);
          setSearchParams({ companyId: company.id }, { replace: true });
        }
      }
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [setSearchParams]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fetch cards + invoices when company changes
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

  // Fetch all transactions for the company — no card filter to avoid stale card_id from previous company
  useEffect(() => {
    if (!selectedCompany) return;
    setTransactions([]);
    getTransactions(selectedCompany.id).then(setTransactions)
      .catch(() => setError('Failed to load transactions'));
  }, [selectedCompany?.id]);

  const updateCard = useCallback((updated: Card) =>
    setCards(prev => prev.map(c => c.id === updated.id ? updated : c)), []);

  const handleSetSelectedCompany = useCallback((company: Company) => {
    setSelectedCompanyState(company);
    localStorage.setItem('selectedCompanyId', company.id);
    setSearchParams({ companyId: company.id });
  }, [setSearchParams]);

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
