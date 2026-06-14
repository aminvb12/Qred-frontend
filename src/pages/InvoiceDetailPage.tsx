import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import styles from './InvoiceDetailPage.module.css';

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices } = useApp();

  const invoice = invoices.find(i => i.id === id);

  if (!invoice) return <div className={styles.error}>Invoice not found</div>;

  const isPending = invoice.status === 'pending';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/invoices')}>‹ Back</button>
        <h1 className={styles.title}>Invoice</h1>
        <span />
      </header>

      <div className={styles.card}>
        <div className={styles.row}>
          <span className={styles.label}>From</span>
          <span className={styles.value}>{invoice.from}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.row}>
          <span className={styles.label}>Org number</span>
          <span className={styles.value}>{invoice.from_org_number}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.row}>
          <span className={styles.label}>OCR number</span>
          <span className={styles.value}>{invoice.ocr_number}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.row}>
          <span className={styles.label}>Issue date</span>
          <span className={styles.value}>{new Date(invoice.issue_date).toLocaleDateString('sv-SE')}</span>
        </div>
        <div className={styles.divider} />
        <div className={styles.row}>
          <span className={styles.label}>Due date</span>
          <span className={styles.value} style={{ color: isPending ? '#c62828' : undefined }}>
            {new Date(invoice.due_date).toLocaleDateString('sv-SE')}
          </span>
        </div>
        <div className={styles.divider} />
        <div className={styles.row}>
          <span className={styles.label}>Amount</span>
          <span className={styles.valueL}>
            {new Intl.NumberFormat('sv-SE').format(invoice.amount)} kr
          </span>
        </div>
        <div className={styles.divider} />
        <div className={styles.row}>
          <span className={styles.label}>Status</span>
          <span className={styles.value} style={{
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
