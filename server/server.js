import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import { config } from './src/config/index.js';
import { MetricsService } from './src/services/MetricsService.js';
import { registerSocketHandlers } from './src/socket/handlers.js';
import { createMetricsRouter } from './src/routes/metrics.js';
import { createHealthRouter } from './src/routes/health.js';
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: config.corsOrigin, methods: ['GET', 'POST'] },
});

const metricsService = new MetricsService({ historyLength: config.historyLength });

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.use('/api/metrics', createMetricsRouter(metricsService));
app.use('/api/health',  createHealthRouter());
app.use(notFoundHandler);
app.use(errorHandler);

registerSocketHandlers(io, metricsService);

httpServer.listen(config.port, () => {
  console.log(`\n  Dashboard server ready`);
  console.log(`  ➜  HTTP  http://localhost:${config.port}`);
  console.log(`  ➜  WS    ws://localhost:${config.port}`);
  console.log(`  ➜  CORS  ${config.corsOrigin}\n`);
});
