import express, { json, Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { router } from './routes/index.ts';
import { config } from './config/config.ts';
import { ApiError } from './errors/api.error.ts';
import { errorMiddleware } from './middlewares/error.middleware.ts';
import { MessageEnum } from './enums/enums.ts';

export const server = express();

server.use(cors());
server.use(json());
server.use(helmet());
server.use(morgan('dev'));

server.use('/app', router);

server.use('*', (_req: Request, _res: Response, next: NextFunction) => {
  next(ApiError.notFound(MessageEnum.NOT_FOUND));
});

server.use(errorMiddleware);

if (require.main === module) {
  server.listen(config.APP_PORT, async () => {
    if (process.env.NODE_ENV !== 'test') {
      mongoose
        .connect(process.env.MONGODB_URI!)
        .then(() => {
          console.log('Connected to MongoDB');
        })
        .catch((error) => {
          console.error('MongoDB connection error:', error);
        });
    }
  });
}
