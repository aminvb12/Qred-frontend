import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { activateCard } from '../api/companies';
import CompanySelector from './CompanySelector';
import CardImage from './CardImage';
import RemainingSpend from './RemainingSpend';
import TransactionList from './TransactionList';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const {
    companies, selectedCompany, setSelectedCompany,
    cards, invoices, transactions,
    loading, error, updateCard,
  } = useApp();

  const navigate = useNavigate();
  const card = cards[0] ?? null;
  const totalDue = invoices
    .filter(i => i.type === 'statement' && i.status === 'pending')
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const handleActivateCard = async () => {
    if (!card || !selectedCompany) return;
    const updated = await activateCard(selectedCompany.id, card.id);
    updateCard(updated);
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.phone}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          {selectedCompany?.logo
            ? <img src={selectedCompany.logo} alt="logo" className={styles.logoImg} />
            : <span className={styles.logoText}>Logo</span>}
        </div>
        <button className={styles.menuBtn}>Menu</button>
      </header>

      {/* Company selector */}
      <CompanySelector
        companies={companies}
        selected={selectedCompany}
        onSelect={setSelectedCompany}
      />

      {/* Invoice + Card section */}
      <section className={styles.card}>
        <div className={styles.row} onClick={() => navigate('/invoices')} style={{ cursor: 'pointer' }}>
          <span className={styles.rowLabel}>
            Invoice due
            {totalDue > 0 && (
              <span className={styles.badge}>
                {new Intl.NumberFormat('sv-SE').format(totalDue)} kr
              </span>
            )}
          </span>
          <span className={styles.chevron}>›</span>
        </div>
        <div className={styles.divider} />
        {card
          ? <CardImage card={card} />
          : (
            <div className={styles.row}>
              <span className={styles.rowLabel}>No card yet</span>
            </div>
          )
        }
      </section>

      {/* Remaining spend */}
      {card && <RemainingSpend card={card} />}

      {/* Latest transactions */}
      <TransactionList transactions={transactions} />

      {/* Action buttons */}
      <div className={styles.actions}>
        {card?.status === 'under_review' && (
          <button
            className={styles.primaryBtn}
            onClick={handleActivateCard}
          >
            Activate card
          </button>
        )}
        {card?.status === 'active' && (
          <button className={styles.primaryBtn} disabled>
            Card active
          </button>
        )}
        <button className={styles.secondaryBtn}>
          Contact Qred's support
        </button>
      </div>
    </div>
  );
}
