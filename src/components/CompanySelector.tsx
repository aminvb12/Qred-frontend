import { useState } from 'react';
import { Company } from '../types';
import styles from './CompanySelector.module.css';

interface Props {
  companies: Company[];
  selected: Company | null;
  onSelect: (company: Company) => void;
}

export default function CompanySelector({ companies, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.selector} onClick={() => setOpen(!open)}>
        <span className={styles.name}>{selected?.name ?? 'Select company'}</span>
        <span className={`${styles.arrow} ${open ? styles.open : ''}`}>✓</span>
      </div>
      {open && (
        <div className={styles.dropdown}>
          {companies.map(c => (
            <div
              key={c.id}
              className={`${styles.option} ${c.id === selected?.id ? styles.active : ''}`}
              onClick={() => { onSelect(c); setOpen(false); }}
            >
              {c.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
