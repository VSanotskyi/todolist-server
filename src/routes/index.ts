import { Router, Request, Response, NextFunction } from 'express';

import { route as authRoute } from './auth.ts';

const router = Router();

router.use('/app', authRoute);

router.get('/error', (_req: Request, _res: Response, next: NextFunction) => {
  try {
    throw new Error('Error message');
  } catch (err) {
    next(err);
  }
});

export { router };
