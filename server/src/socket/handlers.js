import { config } from '../config/index.js';

export function registerSocketHandlers(io, metricsService) {
  io.on('connection', (socket) => {
    console.log(`[WS] + ${socket.id}`);

    socket.emit('init', {
      history:  metricsService.getAllHistory(60),
      services: metricsService.getServiceStatus(),
      events:   metricsService.getEvents(25),
    });

    socket.on('disconnect', (reason) => {
      console.log(`[WS] - ${socket.id} (${reason})`);
    });
  });

  let tick = 0;
  const interval = setInterval(() => {
    if (io.engine.clientsCount === 0) return;

    const { metrics, event, timestamp } = metricsService.snapshot();
    io.emit('metrics:update', { metrics, timestamp });

    if (event) io.emit('event:new', event);

    if (++tick % 5 === 0) {
      io.emit('services:update', metricsService.getServiceStatus());
    }
  }, config.metricsInterval);

  return () => clearInterval(interval);
}
