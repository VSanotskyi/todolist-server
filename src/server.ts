import express, { json, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';

import { router } from './routes/index.ts';

dotenv.config();

const server = express();

server.use(cors());
server.use(json());
server.use(helmet());
server.use(morgan('dev'));

server.use('/', router);

server.use('*', (_req: Request, res: Response) => {
  res.status(404).json({ message: 'Page not found' });
});

server.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: 'Internal server error', message: err.message });
});

server.listen(process.env.PORT, () => {
  console.log('Server start on port ' + process.env.PORT);
});
