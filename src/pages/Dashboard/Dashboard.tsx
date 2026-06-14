import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Invoice, Company } from '../../types';
import { activateCard } from '../../api/companies';
import CompanySelector from '../../components/CompanySelector';
import CardImage from '../../components/CardImage';
import RemainingSpend from '../../components/RemainingSpend';
import TransactionList from '../../components/TransactionList';
import styles from './Dashboard.module.css';

export default function Dashboard() {
    const {
        companies, selectedCompany, setSelectedCompany,
        cards, invoices, transactions,
        loading, error, updateCard,
    } = useApp();

    const navigate = useNavigate();

    const handleSelectCompany = (company: Company) => {
        setSelectedCompany(company);
    };

    const handleNavigateToInvoices = () => {
        if (selectedCompany) {
            navigate(`/invoices?companyId=${selectedCompany.id}`);
        }
    };
    const card = cards[0] ?? null;
    const totalDue = invoices.filter((i: Invoice) => i.status.toLowerCase() === 'pending')
        .reduce((sum: number, i: Invoice) => sum + Number(i.amount), 0);

    const handleActivateCard = async () => {
        if (!card || !selectedCompany) return;
        const updated = await activateCard(selectedCompany.id, card.id);
        updateCard(updated);
    };

    if (loading) return <div className={styles.loading} data-testid="loading">Loading...</div>;
    if (error) return <div className={styles.error} data-testid="error">{error}</div>;

    return (
        <div className={styles.phone} data-testid="dashboard">
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
                onSelect={handleSelectCompany}
            />

            {/* Invoice + Card section */}
            <section className={styles.card}>
                <div className={styles.row} data-testid="invoice-due-row" onClick={handleNavigateToInvoices} style={{ cursor: 'pointer' }}>
                    <span className={styles.rowLabel}>
                        Invoice due
                        {totalDue > 0 && (
                            <span className={styles.badge} data-testid="invoice-badge">
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
                        <div className={styles.row} data-testid="no-card">
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
                        data-testid="activate-card-btn"
                        onClick={handleActivateCard}
                    >
                        Activate card
                    </button>
                )}
                {card?.status === 'active' && (
                    <button className={styles.primaryBtn} data-testid="card-active-btn" disabled>
                        Card active
                    </button>
                )}
                <button className={styles.secondaryBtn} data-testid="support-btn">
                    Contact Qred's support
                </button>
            </div>
        </div>
    );
}
