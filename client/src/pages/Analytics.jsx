import { useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { useStore } from '../store/store';
import { format } from 'date-fns';
import styles from './Analytics.module.css';

const RANGES = [
  { label: '1 min',  points: 30  },
  { label: '5 min',  points: 150 },
  { label: '15 min', points: 450 },
];

function SimpleChart({ metricKey, label, color, points, yUnit = '' }) {
  const { history } = useStore();
  const raw = (history[metricKey] || []).slice(-points);

  const data = raw.map((p) => ({ ts: p.timestamp, value: p.value }));

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">{label}</span>
        {raw.length > 0 && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-3)' }}>
            avg {(raw.reduce((s, p) => s + p.value, 0) / raw.length).toFixed(1)}{yUnit}
          </span>
        )}
      </div>
      <div style={{ height: 180, padding: '8px 4px 4px' }}>
        {data.length < 2 ? (
          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-4)', fontSize: 'var(--text-sm)' }}>
            Collecting data…
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`g-${metricKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis
                dataKey="ts"
                tickFormatter={(ts) => format(new Date(ts), 'HH:mm')}
                tick={{ fontSize: 10, fill: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}
                axisLine={false} tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--text-4)', fontFamily: 'var(--font-mono)' }}
                axisLine={false} tickLine={false} width={36}
              />
              <Tooltip
                contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-1)', borderRadius: 6, fontSize: 12 }}
                itemStyle={{ color: 'var(--text-1)', fontFamily: 'var(--font-mono)' }}
                labelFormatter={(ts) => format(new Date(ts), 'HH:mm:ss')}
                formatter={(v) => [`${v}${yUnit}`, label]}
              />
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={1.5}
                fill={`url(#g-${metricKey})`} dot={false} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function StatRow({ label, metricKey, unit = '', decimals = 1 }) {
  const { history } = useStore();
  const arr = (history[metricKey] || []).slice(-60);
  if (!arr.length) return null;

  const values = arr.map((p) => p.value);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const p95 = [...values].sort((a, b) => a - b)[Math.floor(values.length * 0.95)] ?? max;

  const fmt = (v) => `${v.toFixed(decimals)}${unit}`;

  return (
    <div className={styles.statRow}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statVal} style={{ fontFamily: 'var(--font-mono)' }}>{fmt(avg)}<span className={styles.statSub}> avg</span></span>
      <span className={styles.statVal} style={{ fontFamily: 'var(--font-mono)' }}>{fmt(min)}<span className={styles.statSub}> min</span></span>
      <span className={styles.statVal} style={{ fontFamily: 'var(--font-mono)' }}>{fmt(max)}<span className={styles.statSub}> max</span></span>
      <span className={styles.statVal} style={{ fontFamily: 'var(--font-mono)' }}>{fmt(p95)}<span className={styles.statSub}> p95</span></span>
    </div>
  );
}

export function Analytics() {
  const [range, setRange] = useState(RANGES[0]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <div className={styles.pageTop}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2 className="page-title">Analytics</h2>
          <p className="page-description">Detailed performance metrics and statistics</p>
        </div>
        <div className={styles.rangeBar}>
          {RANGES.map((r) => (
            <button
              key={r.label}
              className={`${styles.rangeBtn} ${range.label === r.label ? styles.rangeBtnActive : ''}`}
              onClick={() => setRange(r)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Statistics — last 60 samples</span>
        </div>
        <div>
          <StatRow label="Requests/s"   metricKey="requestsPerSecond" decimals={0} />
          <StatRow label="Latency"      metricKey="latencyMs"         unit="ms" decimals={1} />
          <StatRow label="Error rate"   metricKey="errorRate"         unit="%" decimals={2} />
          <StatRow label="Active users" metricKey="activeUsers"       decimals={0} />
          <StatRow label="CPU"          metricKey="cpuPercent"        unit="%" decimals={1} />
          <StatRow label="Memory"       metricKey="memoryPercent"     unit="%" decimals={1} />
        </div>
      </div>

      {/* Charts 2-column */}
      <div className="grid grid-2">
        <SimpleChart metricKey="cpuPercent"    label="CPU Usage"      color="var(--chart-1)" points={range.points} yUnit="%" />
        <SimpleChart metricKey="memoryPercent" label="Memory Usage"   color="var(--chart-2)" points={range.points} yUnit="%" />
        <SimpleChart metricKey="latencyMs"     label="Latency"        color="var(--chart-3)" points={range.points} yUnit="ms" />
        <SimpleChart metricKey="errorRate"     label="Error Rate"     color="var(--chart-5)" points={range.points} yUnit="%" />
      </div>
    </div>
  );
}
