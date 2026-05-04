import { useStore } from '../store/store';
import { format } from 'date-fns';
import { Badge } from '../components/ui/Badge';
import styles from './Events.module.css';

const LEVEL_TO_VARIANT = {
  success: 'success',
  warning: 'warning',
  error:   'error',
  info:    'info',
};

export function Events() {
  const { events } = useStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <div className="page-header">
        <h2 className="page-title">Events</h2>
        <p className="page-description">System event log — live stream</p>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Event log</span>
          <span className="text-label">{events.length} total</span>
        </div>

        {events.length === 0 ? (
          <div className={styles.empty}>No events recorded yet.</div>
        ) : (
          <div className={styles.table}>
            <div className={styles.thead}>
              <span>Time</span>
              <span>Level</span>
              <span>Type</span>
              <span>Message</span>
              <span>ID</span>
            </div>
            {events.map((evt) => (
              <div key={evt.id} className={`${styles.row} slide-down`}>
                <span className={styles.time} style={{ fontFamily: 'var(--font-mono)' }}>
                  {format(new Date(evt.timestamp), 'HH:mm:ss')}
                </span>
                <span>
                  <Badge variant={LEVEL_TO_VARIANT[evt.level] || 'default'} dot>
                    {evt.level}
                  </Badge>
                </span>
                <span className={styles.type}>{evt.type}</span>
                <span className={styles.message}>{evt.message}</span>
                <span className={styles.id} style={{ fontFamily: 'var(--font-mono)' }}>
                  {evt.id.split('_').pop()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
