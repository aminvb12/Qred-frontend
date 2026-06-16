import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Invoice } from '../../types';
import { getInvoice } from '../../api/companies';
import styles from './InvoiceDetailPage.module.css';

export default function InvoiceDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const companyId = searchParams.get('companyId');
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadInvoice = async () => {
            try {
                if (!companyId || !id) {
                    setError('Invalid request');
                    setLoading(false);
                    return;
                }
                const data = await getInvoice(companyId, id);
                setInvoice(data);
            } catch {
                setError('Failed to load invoice');
            } finally {
                setLoading(false);
            }
        };
        loadInvoice();
    }, [id, companyId]);

    if (loading) return <div className={styles.error} data-testid="loading">Loading...</div>;
    if (error || !invoice) return <div className={styles.error} data-testid="error">{error || 'Invoice not found'}</div>;

    const isPending = invoice.status === 'pending';

    return (
        <div className={styles.page} data-testid="invoice-detail">
            <header className={styles.header}>
                <button className={styles.backBtn} data-testid="back-btn" onClick={() => navigate(`/invoices?companyId=${companyId}`)}>‹ Back</button>
                <h1 className={styles.title}>Invoice</h1>
                <span />
            </header>

            <div className={styles.card}>
                <div className={styles.row}>
                    <span className={styles.label}>From</span>
                    <span className={styles.value} data-testid="field-from">{invoice.from}</span>
                </div>
                <div className={styles.divider} />
                <div className={styles.row}>
                    <span className={styles.label}>Org number</span>
                    <span className={styles.value} data-testid="field-org-number">{invoice.from_org_number}</span>
                </div>
                <div className={styles.divider} />
                <div className={styles.row}>
                    <span className={styles.label}>OCR number</span>
                    <span className={styles.value} data-testid="field-ocr">{invoice.ocr_number}</span>
                </div>
                <div className={styles.divider} />
                <div className={styles.row}>
                    <span className={styles.label}>Issue date</span>
                    <span className={styles.value} data-testid="field-issue-date">{new Date(invoice.issue_date).toLocaleDateString('sv-SE')}</span>
                </div>
                <div className={styles.divider} />
                <div className={styles.row}>
                    <span className={styles.label}>Due date</span>
                    <span className={styles.value} data-testid="field-due-date" style={{ color: isPending ? '#c62828' : undefined }}>
                        {new Date(invoice.due_date).toLocaleDateString('sv-SE')}
                    </span>
                </div>
                <div className={styles.divider} />
                <div className={styles.row}>
                    <span className={styles.label}>Amount</span>
                    <span className={styles.valueL} data-testid="field-amount">
                        {new Intl.NumberFormat('sv-SE').format(invoice.amount)} kr
                    </span>
                </div>
                <div className={styles.divider} />
                <div className={styles.row}>
                    <span className={styles.label}>Status</span>
                    <span className={styles.value} data-testid="field-status" style={{
                        color: invoice.status === 'paid' ? '#2e7d32' : invoice.status === 'processing' ? '#e65100' : '#c62828',
                        fontWeight: 600,
                    }}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                </div>
            </div>
        </div>
    );
}
