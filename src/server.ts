import express, { json } from 'express';
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

server.listen(process.env.PORT, () => {
  console.log('Server start on port ' + process.env.PORT);
});
