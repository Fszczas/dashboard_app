const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  getMetrics: (points = 60) => request(`/metrics?points=${points}`),
  getMetric:  (key, points = 60) => request(`/metrics/${key}?points=${points}`),
  getEvents:  (limit = 50) => request(`/metrics/events?limit=${limit}`),
  getHealth:  () => request('/health'),
};
