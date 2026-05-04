import { Router } from 'express';

export function createMetricsRouter(metricsService) {
  const router = Router();

  router.get('/', (req, res) => {
    const points = parseInt(req.query.points, 10) || 60;
    res.json({
      history:   metricsService.getAllHistory(points),
      services:  metricsService.getServiceStatus(),
      timestamp: Date.now(),
    });
  });

  router.get('/events', (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 50;
    res.json({ events: metricsService.getEvents(limit), timestamp: Date.now() });
  });

  router.get('/:key', (req, res) => {
    const points = parseInt(req.query.points, 10) || 60;
    const history = metricsService.getHistory(req.params.key, points);

    if (!history.length) {
      return res.status(404).json({
        error: { message: `Metric '${req.params.key}' not found`, status: 404 },
      });
    }

    res.json({ key: req.params.key, history, timestamp: Date.now() });
  });

  return router;
}
