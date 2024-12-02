import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Server } from 'http';

import { server } from '../server';
import { User } from '../models/user.model';
import { HttpStatusCode, MessageEnum } from '../enums/enums';

enum BASE_URL {
  SIGN_UP = '/app/auth/sign-up',
}

enum TEST_DATA {
  TEST1 = 'test1@email.com',
  TEST2 = 'test2@email.com',
  PASSWORD1 = 'QWERTY!1',
}

let mongoServer: MongoMemoryServer;
let app: Server;

beforeAll(async () => {
  try {
    // Close any existing connections
    await mongoose.disconnect();

    // Create and start MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(uri);

    // Create server instance
    return new Promise<void>((resolve) => {
      app = server.listen(0, () => resolve());
    });
  } catch (error) {
    console.error('Failed to setup test environment:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await Promise.all([
      new Promise<void>((resolve) => {
        if (app) {
          app.close(() => resolve());
        } else {
          resolve();
        }
      }),
      mongoose.disconnect(),
      mongoServer?.stop(),
    ]);
  } catch (error) {
    console.error('Failed to cleanup test environment:', error);
    throw error;
  }
});

afterEach(async () => {
  try {
    await User.deleteMany({});
  } catch (error) {
    console.error('Failed to cleanup test data:', error);
    throw error;
  }
});

describe('Auth API', () => {
  describe('POST /app/auth/sign-up', () => {
    interface SignUpPayload {
      email?: string;
      password?: string;
    }

    const makeSignUpRequest = (payload: SignUpPayload) =>
      request(app).post(BASE_URL.SIGN_UP).send(payload);

    it('should register a new user and return: user, message', async () => {
      const response = await makeSignUpRequest({
        email: TEST_DATA.TEST1,
        password: TEST_DATA.PASSWORD1,
      });

      expect(response.status).toBe(HttpStatusCode.CREATED);
      expect(response.body).toMatchObject({
        user: {
          _id: expect.any(String),
          email: TEST_DATA.TEST1,
        },
        message: MessageEnum.USER_CREATED,
      });
    });

    it('should return 400 for missing password', async () => {
      const response = await makeSignUpRequest({
        email: TEST_DATA.TEST2,
      });

      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toMatchObject({
        message: MessageEnum.REQUIRED_PASSWORD,
        status: 'error',
        code: HttpStatusCode.BAD_REQUEST,
      });
    });

    it('should return 400 for missing email', async () => {
      const response = await makeSignUpRequest({
        password: TEST_DATA.PASSWORD1,
      });

      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toMatchObject({
        message: MessageEnum.REQUIRED_EMAIL,
        status: 'error',
        code: HttpStatusCode.BAD_REQUEST,
      });
    });
  });
});
