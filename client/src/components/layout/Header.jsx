import { ThemeToggle } from '../ui/ThemeToggle';
import styles from './Header.module.css';

function IconSearch() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function Header({ title, onOpenPalette }) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <div className={styles.right}>
        <button className={styles.searchBtn} onClick={onOpenPalette}>
          <IconSearch />
          <span className={styles.searchLabel}>Search…</span>
          <kbd>Ctrl K</kbd>
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
