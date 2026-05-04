# Pulse — Real-time Monitoring Dashboard

A professional, plug-and-play monitoring dashboard built with React and Node.js. Connects to any data source via REST or WebSocket and displays live metrics with smooth animations.

![Dashboard preview](https://img.shields.io/badge/status-active-brightgreen) ![License](https://img.shields.io/badge/license-MIT-blue)

## Features

- **Live metrics** — WebSocket stream updating every 2s with animated number transitions
- **Command palette** — `Ctrl+K` for instant navigation and actions
- **Dark / light mode** — system preference detected automatically, toggle in header
- **4 pages** — Overview, Analytics, Events, Settings
- **Service health** — status indicators with latency and uptime per service
- **Activity feed** — real-time event log with severity levels
- **Pluggable** — swap the mock data generator for any real data source

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, CSS Modules |
| Charts | Recharts |
| State | Zustand |
| Realtime | Socket.io |
| Backend | Node.js, Express |

## Getting started

**Requirements:** Node.js 18+

```bash
# Clone
git clone https://github.com/Fszczas/dashboard_app.git
cd dashboard_app

# Install dependencies
cd server && npm install && cd ../client && npm install && cd ..
```

**Run — two terminals:**

```bash
# Terminal 1 — server (port 3001)
cd server
npm run dev

# Terminal 2 — client (port 5173)
cd client
npm run dev
```

Open **http://localhost:5173**

## Project structure

```
├── client/                  # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── layout/      # Sidebar, Header, Layout
│       │   ├── ui/          # CommandPalette, Badge, ThemeToggle
│       │   └── widgets/     # MetricCard, TimeSeriesChart, StatusList, ActivityFeed
│       ├── hooks/           # useSocket, useCountAnimation, useCommandPalette
│       ├── pages/           # Overview, Analytics, Events, Settings
│       ├── services/        # API client, Socket.io singleton
│       ├── store/           # Zustand store
│       └── styles/          # Design system (variables, globals, animations)
└── server/                  # Node.js + Express + Socket.io
    └── src/
        ├── config/
        ├── middleware/
        ├── routes/          # GET /api/metrics, /api/health
        ├── services/        # DataGenerator, MetricsService
        └── socket/          # WebSocket handlers
```

## Connecting your own data

The server exposes two interfaces:

**REST** — `GET /api/metrics?points=60` returns historical data for all metrics.

**WebSocket** — emit `metrics:update` with the shape below to push live data to all connected clients:

```json
{
  "metrics": {
    "requestsPerSecond": 312,
    "latencyMs": 54.2,
    "errorRate": 1.8,
    "activeUsers": 408,
    "cpuPercent": 43.1,
    "memoryPercent": 57.4
  },
  "timestamp": 1714000000000
}
```

Replace `MetricsService.js` with a connector to Prometheus, Datadog, your own database, or any other source — the frontend doesn't care where the numbers come from.

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl K` | Open command palette |
| `G O` | Go to Overview |
| `G A` | Go to Analytics |
| `G E` | Go to Events |
| `G S` | Go to Settings |

## License

MIT
