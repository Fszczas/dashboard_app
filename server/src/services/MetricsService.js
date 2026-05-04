import { DataGenerator } from './DataGenerator.js';

const EVENT_TEMPLATES = [
  { type: 'deploy', message: 'Deployment to production succeeded', level: 'success' },
  { type: 'deploy', message: 'Deployment to staging completed', level: 'success' },
  { type: 'alert', message: 'High CPU usage detected: {cpu}%', level: 'warning' },
  { type: 'alert', message: 'Memory pressure above threshold: {mem}%', level: 'warning' },
  { type: 'error', message: 'Unhandled exception in auth service', level: 'error' },
  { type: 'error', message: 'Database connection timeout after 30s', level: 'error' },
  { type: 'user', message: 'Spike in active sessions detected', level: 'info' },
  { type: 'scale', message: 'Auto-scaled API service to 4 instances', level: 'info' },
  { type: 'backup', message: 'Database backup completed — 2.3 GB', level: 'success' },
  { type: 'cert', message: 'SSL certificate renewed for api.domain.com', level: 'success' },
  { type: 'rate_limit', message: 'Rate limit exceeded from 192.168.1.0/24', level: 'warning' },
  { type: 'cache', message: 'Cache warming done — hit rate 94.2%', level: 'success' },
  { type: 'health', message: 'All services reporting healthy', level: 'success' },
  { type: 'migration', message: 'Schema migration v42 applied successfully', level: 'info' },
];

export class MetricsService {
  #generators;
  #history;
  #events;
  #historyLength;

  constructor({ historyLength = 120 } = {}) {
    this.#historyLength = historyLength;

    this.#generators = {
      requestsPerSecond: new DataGenerator({ min: 60, max: 680, mean: 290, volatility: 28, decimals: 0 }),
      latencyMs: new DataGenerator({ min: 10, max: 260, mean: 64, volatility: 7, decimals: 1 }),
      errorRate: new DataGenerator({ min: 0, max: 12, mean: 1.6, volatility: 0.4, decimals: 2 }),
      activeUsers: new DataGenerator({ min: 30, max: 1500, mean: 440, volatility: 38, decimals: 0 }),
      cpuPercent: new DataGenerator({ min: 4, max: 96, mean: 43, volatility: 4, decimals: 1 }),
      memoryPercent: new DataGenerator({ min: 22, max: 89, mean: 57, volatility: 1.5, decimals: 1 }),
    };

    this.#history = Object.fromEntries(
      Object.keys(this.#generators).map((k) => [k, []])
    );

    this.#events = [];

    // Pre-warm history so charts aren't empty on first load
    const now = Date.now();
    for (let i = historyLength; i > 0; i--) {
      this.#tick(now - i * 2000, false);
    }
  }

  #tick(timestamp = Date.now(), maybeEvent = true) {
    const metrics = {};

    for (const [key, gen] of Object.entries(this.#generators)) {
      const value = gen.next();
      metrics[key] = value;
      this.#history[key].push({ value, timestamp });
      if (this.#history[key].length > this.#historyLength) {
        this.#history[key].shift();
      }
    }

    if (maybeEvent && Math.random() < 0.09) {
      const event = this.#buildEvent(metrics);
      this.#events.unshift(event);
      if (this.#events.length > 200) this.#events.pop();
      return { metrics, event, timestamp };
    }

    return { metrics, event: null, timestamp };
  }

  snapshot() {
    return this.#tick();
  }

  getHistory(key, points) {
    const h = this.#history[key] || [];
    return points ? h.slice(-points) : [...h];
  }

  getAllHistory(points = 60) {
    return Object.fromEntries(
      Object.keys(this.#history).map((k) => [k, this.getHistory(k, points)])
    );
  }

  getEvents(limit = 50) {
    return this.#events.slice(0, limit);
  }

  getServiceStatus() {
    const latest = Object.fromEntries(
      Object.entries(this.#history).map(([k, arr]) => [k, arr.at(-1)?.value ?? 0])
    );

    const errorOk = latest.errorRate < 3;
    const errorDegraded = latest.errorRate < 7;
    const cpuOk = latest.cpuPercent < 80;
    const memOk = latest.memoryPercent < 85;

    return [
      { id: 'api', name: 'API Gateway', status: errorOk ? 'healthy' : errorDegraded ? 'degraded' : 'down', latency: Math.round(latest.latencyMs), uptime: '99.98%' },
      { id: 'db', name: 'Database', status: cpuOk ? 'healthy' : 'degraded', latency: Math.round(latest.latencyMs * 0.28), uptime: '99.99%' },
      { id: 'cache', name: 'Cache Layer', status: 'healthy', latency: Math.round(latest.latencyMs * 0.04), uptime: '100%' },
      { id: 'queue', name: 'Message Queue', status: memOk ? 'healthy' : 'degraded', latency: Math.round(latest.latencyMs * 0.11), uptime: '99.95%' },
      { id: 'cdn', name: 'CDN', status: 'healthy', latency: Math.round(latest.latencyMs * 0.13), uptime: '99.99%' },
    ];
  }

  #buildEvent(metrics) {
    let pool = EVENT_TEMPLATES;

    if (metrics.errorRate > 6)      pool = EVENT_TEMPLATES.filter((t) => t.type === 'error');
    else if (metrics.cpuPercent > 80) pool = EVENT_TEMPLATES.filter((t) => t.type === 'alert');

    const template = pool[Math.floor(Math.random() * pool.length)];

    return {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type:      template.type,
      message:   template.message
        .replace('{cpu}', Math.round(metrics.cpuPercent))
        .replace('{mem}', Math.round(metrics.memoryPercent)),
      level:     template.level,
      timestamp: Date.now(),
    };
  }
}
