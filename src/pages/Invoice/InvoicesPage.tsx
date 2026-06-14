import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Invoice } from '../../types';
import { getInvoices } from '../../api/companies';
import styles from './InvoicesPage.module.css';

function statusLabel(status: Invoice['status']) {
    if (status === 'paid') return { label: 'Paid', color: '#2e7d32' };
    if (status === 'processing') return { label: 'Processing', color: '#e65100' };
    return { label: 'Pending', color: '#c62828' };
}

export default function InvoicesPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const companyId = searchParams.get('companyId');
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadInvoices = async () => {
            try {
                if (!companyId) {
                    setError('No company selected');
                    setLoading(false);
                    return;
                }
                const data = await getInvoices(companyId);
                setInvoices(data);
            } catch {
                setError('Failed to load invoices');
            } finally {
                setLoading(false);
            }
        };
        loadInvoices();
    }, [companyId]);

    if (loading) return <div className={styles.loading} data-testid="loading">Loading...</div>;
    if (error) return <div className={styles.error} data-testid="error">{error}</div>;

    return (
        <div className={styles.page} data-testid="invoices-page">
            <header className={styles.header}>
                <button className={styles.backBtn} data-testid="back-btn" onClick={() => navigate('/')}>‹ Back</button>
                <h1 className={styles.title}>Invoices</h1>
                <span />
            </header>

            {invoices.length === 0 ? (
                <div className={styles.empty} data-testid="empty-invoices">No invoices</div>
            ) : (
                <ul className={styles.list} data-testid="invoice-list">
                    {invoices.map(invoice => {
                        const { label, color } = statusLabel(invoice.status);
                        return (
                            <li
                                key={invoice.id}
                                className={styles.item}
                                data-testid="invoice-item"
                                onClick={() => navigate(`/invoices/${invoice.id}?companyId=${companyId}`)}
                            >
                                <div className={styles.itemTop}>
                                    <span className={styles.from} data-testid="invoice-from">{invoice.from}</span>
                                    <span className={styles.amount} data-testid="invoice-amount">
                                        {new Intl.NumberFormat('sv-SE').format(invoice.amount)} kr
                                    </span>
                                </div>
                                <div className={styles.itemBottom}>
                                    <span className={styles.due} data-testid="invoice-due">Due {new Date(invoice.due_date).toLocaleDateString('sv-SE')}</span>
                                    <span className={styles.status} data-testid="invoice-status" style={{ color }}>{label}</span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
