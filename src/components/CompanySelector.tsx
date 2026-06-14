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
    <div className={styles.wrapper} data-testid="company-selector">
      <div className={styles.selector} data-testid="company-selector-trigger" onClick={() => setOpen(!open)}>
        <span className={styles.name} data-testid="company-name">{selected?.name ?? 'Select company'}</span>
        <span className={`${styles.arrow} ${open ? styles.open : ''}`}>✓</span>
      </div>
      {open && (
        <div className={styles.dropdown} data-testid="company-dropdown">
          {companies.map(c => (
            <div
              key={c.id}
              data-testid="company-option"
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
