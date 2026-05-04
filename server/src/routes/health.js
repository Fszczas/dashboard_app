import { Router } from 'express';

const START_TIME = Date.now();

export function createHealthRouter() {
  const router = Router();

  router.get('/', (_req, res) => {
    res.json({
      status: 'ok',
      uptime: Math.floor((Date.now() - START_TIME) / 1000),
      timestamp: Date.now(),
    });
  });

  return router;
}
