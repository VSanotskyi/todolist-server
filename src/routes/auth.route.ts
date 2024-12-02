import { Router, Request, Response, NextFunction } from 'express';

import { validateAuthBody } from '../middlewares/common.middleware.ts';
import { AuthSchema } from '../schemas/AuthSchema.ts';
import { authController } from '../controllers/auth.cntroller.ts';

const authRoute = Router();

authRoute.post('/sign-up', validateAuthBody(AuthSchema), authController.signUp);

authRoute.post('/sign-in', validateAuthBody(AuthSchema), authController.signIn);

authRoute.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: 'logout' });
});

export { authRoute };
