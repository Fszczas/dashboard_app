import { MetricCard } from '../components/widgets/MetricCard';
import { TimeSeriesChart } from '../components/widgets/TimeSeriesChart';
import { StatusList } from '../components/widgets/StatusList';
import { ActivityFeed } from '../components/widgets/ActivityFeed';

const METRICS = [
  { title: 'Requests / s', key: 'requestsPerSecond', decimals: 0, color: 'var(--chart-1)' },
  { title: 'Avg Latency', key: 'latencyMs', decimals: 1, unit: 'ms', color: 'var(--chart-2)' },
  { title: 'Error Rate', key: 'errorRate', decimals: 2, unit: '%', color: 'var(--chart-5)', invertTrend: true },
  { title: 'Active Users', key: 'activeUsers', decimals: 0, color: 'var(--chart-3)' },
];

export function Overview() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      <div className="page-header">
        <h2 className="page-title">Overview</h2>
        <p className="page-description">Real-time system metrics and service health</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-4">
        {METRICS.map((m) => (
          <MetricCard
            key={m.key}
            title={m.title}
            metricKey={m.key}
            unit={m.unit}
            decimals={m.decimals}
            invertTrend={m.invertTrend}
            color={m.color}
          />
        ))}
      </div>

      {/* Time series */}
      <TimeSeriesChart title="Traffic Overview" points={60} />

      {/* Bottom row */}
      <div className="grid grid-2" style={{ gridTemplateColumns: '5fr 7fr' }}>
        <StatusList />
        <ActivityFeed />
      </div>
    </div>
  );
}
