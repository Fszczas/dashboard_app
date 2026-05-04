import { useStore } from '../../store/store';
import { formatDistanceToNow } from 'date-fns';
import styles from './ActivityFeed.module.css';

const LEVEL_CONFIG = {
  success: { cls: styles.levelSuccess, icon: '✓' },
  warning: { cls: styles.levelWarning, icon: '⚠' },
  error:   { cls: styles.levelError,   icon: '✕' },
  info:    { cls: styles.levelInfo,    icon: '·' },
};

export function ActivityFeed() {
  const { events } = useStore();

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="card-header">
        <span className="card-title">Activity</span>
        {events.length > 0 && (
          <span className="text-label">{events.length} events</span>
        )}
      </div>

      <div className={styles.feed}>
        {events.length === 0 ? (
          <div className={styles.empty}>No events yet — stream will populate shortly.</div>
        ) : (
          events.map((evt) => {
            const cfg = LEVEL_CONFIG[evt.level] || LEVEL_CONFIG.info;
            return (
              <div key={evt.id} className={`${styles.item} slide-down`}>
                <div className={`${styles.icon} ${cfg.cls}`} aria-hidden>
                  {cfg.icon}
                </div>
                <div className={styles.content}>
                  <div className={styles.message}>{evt.message}</div>
                  <div className={styles.time}>
                    {formatDistanceToNow(new Date(evt.timestamp), { addSuffix: true })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
