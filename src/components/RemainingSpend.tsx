import { Card } from '../types';
import styles from './RemainingSpend.module.css';

interface Props { card: Card; }

const fmt = (n: number) =>
  new Intl.NumberFormat('sv-SE').format(n);

export default function RemainingSpend({ card }: Props) {
  const pct = (card.current_credit / card.max_credit) * 100;

  return (
    <section className={styles.section} data-testid="remaining-spend">
      <p className={styles.label}>Remaining spend</p>
      <div className={styles.row}>
        <span className={styles.amount} data-testid="remaining-amount">
          {fmt(card.current_credit)}/{fmt(card.max_credit)} kr
        </span>
        <span className={styles.chevron}>›</span>
      </div>
      <div className={styles.progressBar}>
        <div className={styles.progress} data-testid="progress-bar" style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.hint}>based on your set limit</p>
    </section>
  );
}
