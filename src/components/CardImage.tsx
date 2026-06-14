import { Card } from '../types';
import styles from './CardImage.module.css';

interface Props { card: Card; }

function maskCardNumber(num: string | null): string {
  if (!num) return '**** **** **** ****';
  return `${num.slice(0, 4)} ${num.slice(4, 8)} ${num.slice(8, 12)} ${num.slice(12)}`;
}

function formatExpiry(date: string | null): string {
  if (!date) return 'MM/YY';
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${yy}`;
}

export default function CardImage({ card }: Props) {
  const isActive = card.status === 'active';

  return (
    <div className={`${styles.card} ${!isActive ? styles.inactive : ''}`} data-testid="card-image">
      <div className={styles.top}>
        <span className={styles.brand}>qred.</span>
        <span className={styles.status} data-testid="card-status">
          {isActive ? 'Active' : card.status.replace('_', ' ')}
        </span>
      </div>

      <div className={styles.number} data-testid="card-number">
        {maskCardNumber(card.card_number)}
      </div>

      <div className={styles.bottom}>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Expires</span>
          <span className={styles.fieldValue} data-testid="card-expiry">{formatExpiry(card.exp_date)}</span>
        </div>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Limit</span>
          <span className={styles.fieldValue} data-testid="card-limit">
            {new Intl.NumberFormat('sv-SE').format(card.max_credit)} kr
          </span>
        </div>
      </div>
    </div>
  );
}
