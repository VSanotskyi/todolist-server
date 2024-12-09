import dotenv from 'dotenv';

dotenv.config();

const config = {
  APP_PORT: process.env.APP_PORT!,
  MONGO_URL: process.env.MONGO_URL!,
  JWT_TOKEN_SECRET: process.env.JWT_TOKEN_SECRET!,
  JWT_EXPIRES: process.env.JWT_EXPIRES!,
};

export { config };
