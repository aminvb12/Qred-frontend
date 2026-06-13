import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Invoice } from '../types';
import styles from './InvoicesPage.module.css';

function statusLabel(status: Invoice['status']) {
  if (status === 'paid') return { label: 'Paid', color: '#2e7d32' };
  if (status === 'processing') return { label: 'Processing', color: '#e65100' };
  return { label: 'Pending', color: '#c62828' };
}

export default function InvoicesPage() {
  const navigate = useNavigate();
  const { invoices, loading, error } = useApp();

  const statementInvoices = invoices.filter(i => i.type === 'statement');

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>‹ Back</button>
        <h1 className={styles.title}>Invoices</h1>
        <span />
      </header>

      {statementInvoices.length === 0 ? (
        <div className={styles.empty}>No invoices</div>
      ) : (
        <ul className={styles.list}>
          {statementInvoices.map(invoice => {
            const { label, color } = statusLabel(invoice.status);
            return (
              <li
                key={invoice.id}
                className={styles.item}
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              >
                <div className={styles.itemTop}>
                  <span className={styles.from}>{invoice.from}</span>
                  <span className={styles.amount}>
                    {new Intl.NumberFormat('sv-SE').format(invoice.amount)} kr
                  </span>
                </div>
                <div className={styles.itemBottom}>
                  <span className={styles.due}>Due {new Date(invoice.due_date).toLocaleDateString('sv-SE')}</span>
                  <span className={styles.status} style={{ color }}>{label}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
