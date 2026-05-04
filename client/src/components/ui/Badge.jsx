import styles from './Badge.module.css';

const VARIANTS = {
  default: 'badge-default',
  success: 'badge-success',
  warning: 'badge-warning',
  error:   'badge-error',
  info:    'badge-info',
};

export function Badge({ children, variant = 'default', dot = false }) {
  return (
    <span className={`${styles.badge} ${styles[VARIANTS[variant] || VARIANTS.default]}`}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
