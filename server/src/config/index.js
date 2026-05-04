export const config = {
  port: parseInt(process.env.PORT, 10) || 3001,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  metricsInterval: parseInt(process.env.METRICS_INTERVAL, 10) || 2000,
  historyLength: parseInt(process.env.HISTORY_LENGTH, 10) || 120,
};
