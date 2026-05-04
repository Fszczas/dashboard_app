import { create } from 'zustand';

const getInitialTheme = () => {
  const saved = localStorage.getItem('dashboard:theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useStore = create((set, get) => ({
  /* ─── Connection ──────────────────── */
  connected: false,
  setConnected: (connected) => set({ connected }),

  /* ─── Theme ───────────────────────── */
  theme: getInitialTheme(),
  toggleTheme: () => {
    const next = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('dashboard:theme', next);
    document.documentElement.setAttribute('data-theme', next);
    set({ theme: next });
  },

  /* ─── Metrics ─────────────────────── */
  metrics: {},
  prevMetrics: {},
  updateMetrics: (metrics) =>
    set((s) => ({ prevMetrics: s.metrics, metrics })),

  /* ─── History ─────────────────────── */
  history: {},
  setHistory: (history) => set({ history }),
  appendHistory: (key, point) =>
    set((s) => ({
      history: {
        ...s.history,
        [key]: [...(s.history[key] || []).slice(-119), point],
      },
    })),

  /* ─── Services ────────────────────── */
  services: [],
  setServices: (services) => set({ services }),

  /* ─── Events ──────────────────────── */
  events: [],
  setEvents: (events) => set({ events }),
  prependEvent: (event) =>
    set((s) => ({ events: [event, ...s.events].slice(0, 100) })),
}));
