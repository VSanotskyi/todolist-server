import { Router } from 'express';

import { validateAuthBody } from '../middlewares/common.middleware';
import { AuthSchema } from '../schemas/AuthSchema';
import { authController } from '../controllers/auth.cntroller';
import { authMiddleware } from '../middlewares/auth.middleware';

const authRoute = Router();

authRoute.post('/sign-up', validateAuthBody(AuthSchema), authController.signUp);

authRoute.post('/sign-in', validateAuthBody(AuthSchema), authController.signIn);

authRoute.get('/sign-out', authMiddleware, authController.logout);

export { authRoute };
