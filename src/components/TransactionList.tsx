import { Transaction } from '../types';
import styles from './TransactionList.module.css';

interface Props { transactions: Transaction[]; }

const fmt = (n: number) =>
  new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(n);

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });

export default function TransactionList({ transactions }: Props) {
  const preview = transactions.slice(0, 3);
  const remaining = transactions.length - preview.length;

  return (
    <section className={styles.section} data-testid="transaction-list">
      <p className={styles.title}>Latest transactions</p>
      {preview.map(tx => (
        <div key={tx.id} className={styles.row} data-testid="transaction-row">
          <div className={styles.left}>
            <span className={styles.date} data-testid="transaction-date">{fmtDate(tx.date)}</span>
          </div>
          <span className={styles.amount} data-testid="transaction-amount">{fmt(tx.amount)}</span>
        </div>
      ))}
      {remaining > 0 && (
        <div className={styles.more} data-testid="transaction-more">
          <span>{remaining} more items in transaction view</span>
          <span className={styles.chevron}>›</span>
        </div>
      )}
    </section>
  );
}
