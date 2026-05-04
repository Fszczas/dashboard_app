import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { useStore } from '../../store/store';
import { format } from 'date-fns';
import styles from './TimeSeriesChart.module.css';

const SERIES = [
  { key: 'requestsPerSecond', label: 'Requests/s',   color: 'var(--chart-1)', yAxisId: 'left'  },
  { key: 'activeUsers',       label: 'Active Users', color: 'var(--chart-2)', yAxisId: 'right' },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTime}>
        {label ? format(new Date(label), 'HH:mm:ss') : ''}
      </div>
      {payload.map((entry) => (
        <div key={entry.dataKey} className={styles.tooltipRow}>
          <span className={styles.tooltipDot} style={{ background: entry.color }} />
          <span className={styles.tooltipLabel}>{entry.name}</span>
          <span className={styles.tooltipValue} style={{ fontFamily: 'var(--font-mono)' }}>
            {Number(entry.value).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

function CustomLegend({ payload }) {
  return (
    <div className={styles.legend}>
      {payload?.map((entry) => (
        <span key={entry.value} className={styles.legendItem}>
          <span className={styles.legendDot} style={{ background: entry.color }} />
          {entry.value}
        </span>
      ))}
    </div>
  );
}

export function TimeSeriesChart({ title = 'Traffic Overview', points = 60 }) {
  const { history } = useStore();

  const timestamps = history[SERIES[0].key]?.map((p) => p.timestamp) || [];

  const data = timestamps.slice(-points).map((ts, i) =>
    SERIES.reduce((acc, s) => {
      const arr = history[s.key] || [];
      const offset = arr.length - timestamps.length;
      acc[s.key] = arr[offset + i]?.value ?? 0;
      return acc;
    }, { ts })
  );

  return (
    <div className={`card ${styles.chartCard}`}>
      <div className="card-header">
        <span className="card-title">{title}</span>
      </div>
      <div className={styles.chartBody}>
        {data.length < 2 ? (
          <div className={styles.empty}>Collecting data…</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <defs>
                {SERIES.map((s) => (
                  <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={s.color} stopOpacity={0.15} />
                    <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--chart-grid)"
                vertical={false}
              />
              <XAxis
                dataKey="ts"
                tickFormatter={(ts) => format(new Date(ts), 'HH:mm')}
                tick={{ fontSize: 11, fill: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 11, fill: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11, fill: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              {SERIES.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  yAxisId={s.yAxisId}
                  stroke={s.color}
                  strokeWidth={1.5}
                  fill={`url(#grad-${s.key})`}
                  dot={false}
                  activeDot={{ r: 3, strokeWidth: 0 }}
                  isAnimationActive={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
