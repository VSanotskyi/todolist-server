import { Router, Request, Response, NextFunction } from 'express';

import { authRoute } from './auth.route.ts';
import { ApiError } from '../errors/api.error.ts';

const router = Router();

router.use('/auth', authRoute);

router.get('/error', (_req: Request, _res: Response, next: NextFunction) => {
  try {
    throw new Error('Error message');
  } catch (err) {
    next(ApiError.badRequest('Bad request'));
  }
});

export { router };
