import { useStore } from '../../store/store';
import { useCountAnimation } from '../../hooks/useCountAnimation';
import { Sparkline } from './Sparkline';
import styles from './MetricCard.module.css';

function TrendIcon({ direction }) {
  if (direction === 'up') return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
  if (direction === 'down') return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function MetricCard({ title, metricKey, unit = '', decimals = 0, invertTrend = false, color }) {
  const { metrics, history, connected } = useStore();

  const raw     = metrics[metricKey] ?? 0;
  const animated = useCountAnimation(raw);
  const display  = animated.toFixed(decimals);

  const sparkData  = history[metricKey] || [];
  const sparkColor = color || 'var(--accent)';

  const prev = sparkData.length >= 2
    ? sparkData[sparkData.length - 2]?.value ?? raw
    : raw;

  const diff    = raw - prev;
  const pctDiff = prev !== 0 ? (diff / prev) * 100 : 0;

  let direction = 'flat';
  if (Math.abs(pctDiff) > 0.3) direction = diff > 0 ? 'up' : 'down';

  const isPositive = invertTrend ? direction === 'down' : direction === 'up';
  const trendClass = direction === 'flat'
    ? styles.trendFlat
    : isPositive ? styles.trendGood : styles.trendBad;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {connected && <span className="live-dot" title="Live" />}
      </div>

      <div className={styles.body}>
        <div className={styles.valueRow}>
          <span className={styles.value} style={{ fontFamily: 'var(--font-mono)' }}>
            {display}
            {unit && <span className={styles.unit}>{unit}</span>}
          </span>
          {direction !== 'flat' && (
            <span className={`${styles.trend} ${trendClass}`}>
              <TrendIcon direction={direction} />
              {Math.abs(pctDiff).toFixed(1)}%
            </span>
          )}
        </div>

        {sparkData.length > 1 && (
          <div className={styles.spark}>
            <Sparkline
              data={sparkData.slice(-30)}
              color={sparkColor}
              width={100}
              height={32}
            />
          </div>
        )}
      </div>
    </div>
  );
}
