import { Router } from 'express';

import { route as authRoute } from './auth.ts';

const router = Router();

router.use('/app', authRoute);

export { router };
