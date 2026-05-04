import { useStore } from '../../store/store';
import styles from './StatusList.module.css';

const STATUS_CONFIG = {
  healthy:  { label: 'Healthy',  dot: '',         badge: styles.statusHealthy  },
  degraded: { label: 'Degraded', dot: 'warning',  badge: styles.statusDegraded },
  down:     { label: 'Down',     dot: 'error',     badge: styles.statusDown     },
};

export function StatusList() {
  const { services } = useStore();

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Service Health</span>
        <span className="text-label">
          {services.filter((s) => s.status === 'healthy').length}/{services.length} healthy
        </span>
      </div>
      <div className={styles.list}>
        {services.length === 0
          ? Array.from({ length: 5 }, (_, i) => (
              <div key={i} className={styles.row}>
                <div className={`skeleton ${styles.skeletonName}`} />
                <div className={`skeleton ${styles.skeletonBadge}`} />
              </div>
            ))
          : services.map((svc) => {
              const cfg = STATUS_CONFIG[svc.status] || STATUS_CONFIG.healthy;
              return (
                <div key={svc.id} className={styles.row}>
                  <div className={styles.left}>
                    <span className={`live-dot ${cfg.dot}`} />
                    <span className={styles.name}>{svc.name}</span>
                  </div>
                  <div className={styles.right}>
                    <span className={styles.latency} style={{ fontFamily: 'var(--font-mono)' }}>
                      {svc.latency}ms
                    </span>
                    <span className={`${styles.statusBadge} ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    <span className={styles.uptime}>{svc.uptime}</span>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
