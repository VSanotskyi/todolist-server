import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Server } from 'http';
import bcrypt from 'bcrypt';

import { server } from '../server';
import { User } from '../models/user.model';
import { HttpStatusCode, MessageEnum, Status } from '../enums/enums';
import { SuccessMessages } from '../constants/enum.ts';

enum BASE_URL {
  SIGN_UP = '/app/auth/sign-up',
  SIGN_IN = '/app/auth/sign-in',
}

enum TEST_DATA {
  TEST1 = 'test1@email.com',
  TEST2 = 'test2@email.com',
  TEST3 = 'XXXXXXXXXXXXXXX',
  PASSWORD1 = 'QWERTY!1',
  PASSWORD2 = 'XXXXXXXX',
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

beforeEach(async () => {
  // Create initial test user
  const hashedPassword = await bcrypt.hash(TEST_DATA.PASSWORD1, 10);

  await User.create({
    email: TEST_DATA.TEST2,
    password: hashedPassword,
  });
});

describe('Auth API', () => {
  describe('POST /app/auth/sign-up', () => {
    interface SignUpPayload {
      email?: string;
      password?: string;
    }

    const makeSignUpRequest = (payload: SignUpPayload) =>
      request(app).post(BASE_URL.SIGN_UP).send(payload);

    it(`should return: ${HttpStatusCode.CREATED}, ${Status.SUCCESS}, ${MessageEnum.USER_CREATED}, user`, async () => {
      const response = await makeSignUpRequest({
        email: TEST_DATA.TEST1,
        password: TEST_DATA.PASSWORD1,
      });

      expect(response.status).toBe(HttpStatusCode.CREATED);
      expect(response.body).toMatchObject({
        code: HttpStatusCode.CREATED,
        status: Status.SUCCESS,
        message: MessageEnum.USER_CREATED,
        user: {
          _id: expect.any(String),
          email: TEST_DATA.TEST1,
        },
      });
    });

    it(`should return: ${HttpStatusCode.BAD_REQUEST}, ${Status.ERROR}, ${MessageEnum.REQUIRED_PASSWORD}`, async () => {
      const response = await makeSignUpRequest({
        email: TEST_DATA.TEST2,
      });

      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toMatchObject({
        message: MessageEnum.REQUIRED_PASSWORD,
        status: Status.ERROR,
        code: HttpStatusCode.BAD_REQUEST,
      });
    });

    it(`should return: ${HttpStatusCode.BAD_REQUEST}, ${Status.ERROR}, ${MessageEnum.REQUIRED_EMAIL}`, async () => {
      const response = await makeSignUpRequest({
        password: TEST_DATA.PASSWORD2,
      });

      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toMatchObject({
        code: HttpStatusCode.BAD_REQUEST,
        message: MessageEnum.REQUIRED_EMAIL,
        status: Status.ERROR,
      });
    });

    it(`should return: ${HttpStatusCode.BAD_REQUEST}, ${Status.ERROR}, ${MessageEnum.INVALID_EMAIL_FORMAT}`, async () => {
      const response = makeSignUpRequest({
        email: TEST_DATA.TEST3,
        password: TEST_DATA.PASSWORD1,
      });

      const res = await response;
      expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(res.body).toMatchObject({
        message: MessageEnum.INVALID_EMAIL_FORMAT,
        status: Status.ERROR,
        code: HttpStatusCode.BAD_REQUEST,
      });
    });

    it(`should return: ${HttpStatusCode.BAD_REQUEST}, ${Status.ERROR}, ${MessageEnum.INVALID_PASSWORD_FORMAT}`, async () => {
      const response = makeSignUpRequest({
        email: TEST_DATA.TEST1,
        password: TEST_DATA.PASSWORD2,
      });

      const res = await response;
      expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(res.body).toMatchObject({
        message: MessageEnum.INVALID_PASSWORD_FORMAT,
        status: Status.ERROR,
        code: HttpStatusCode.BAD_REQUEST,
      });
    });

    it(`should return: ${HttpStatusCode.CONFLICT}, ${Status.ERROR}, ${MessageEnum.CONFLICT}`, async () => {
      const response = await makeSignUpRequest({
        email: TEST_DATA.TEST2,
        password: TEST_DATA.PASSWORD1,
      });

      expect(response.status).toBe(HttpStatusCode.CONFLICT);
      expect(response.body).toMatchObject({
        message: MessageEnum.CONFLICT,
        status: Status.ERROR,
        code: HttpStatusCode.CONFLICT,
      });
    });
  });

  describe('POST /app/auth/sign-in', () => {
    interface SignInPayload {
      email?: string;
      password?: string;
    }

    const makeSignUpRequest = (payload: SignInPayload) =>
      request(app).post(BASE_URL.SIGN_IN).send(payload);

    it(`should return: ${HttpStatusCode.OK}, ${Status.SUCCESS}, ${SuccessMessages.LOGIN_SUCCESS}, user`, async () => {
      const response = await makeSignUpRequest({
        email: TEST_DATA.TEST2,
        password: TEST_DATA.PASSWORD1,
      });

      expect(response.status).toBe(HttpStatusCode.OK);
      expect(response.body).toMatchObject({
        code: HttpStatusCode.OK,
        status: Status.SUCCESS,
        message: SuccessMessages.LOGIN_SUCCESS,
        user: {
          _id: expect.any(String),
          email: TEST_DATA.TEST2,
          token: expect.any(String),
        },
      });
    });

    it(`should return: ${HttpStatusCode.BAD_REQUEST}, ${Status.ERROR}, ${MessageEnum.INVALID_CREDENTIALS}`, async () => {
      const response = await makeSignUpRequest({
        email: TEST_DATA.TEST1,
        password: TEST_DATA.PASSWORD1,
      });

      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toMatchObject({
        message: MessageEnum.INVALID_CREDENTIALS,
        status: Status.ERROR,
        code: HttpStatusCode.BAD_REQUEST,
      });
    });

    it(`should return: ${HttpStatusCode.BAD_REQUEST}, ${Status.ERROR}, ${MessageEnum.INVALID_EMAIL_FORMAT}`, async () => {
      const response = await makeSignUpRequest({
        email: TEST_DATA.TEST3,
        password: TEST_DATA.PASSWORD1,
      });

      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toMatchObject({
        message: MessageEnum.INVALID_EMAIL_FORMAT,
        status: Status.ERROR,
        code: HttpStatusCode.BAD_REQUEST,
      });
    });

    it(`should return: ${HttpStatusCode.BAD_REQUEST}, ${Status.ERROR}, ${MessageEnum.INVALID_PASSWORD_FORMAT}`, async () => {
      const response = await makeSignUpRequest({
        email: TEST_DATA.TEST2,
        password: TEST_DATA.PASSWORD2,
      });

      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toMatchObject({
        message: MessageEnum.INVALID_PASSWORD_FORMAT,
        status: Status.ERROR,
        code: HttpStatusCode.BAD_REQUEST,
      });
    });

    it(`should return:  ${HttpStatusCode.BAD_REQUEST}, ${Status.ERROR}, ${MessageEnum.REQUIRED_PASSWORD}`, async () => {
      const response = await makeSignUpRequest({
        email: TEST_DATA.TEST2,
      });

      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toMatchObject({
        message: MessageEnum.REQUIRED_PASSWORD,
        status: Status.ERROR,
        code: HttpStatusCode.BAD_REQUEST,
      });
    });

    it(`should return: ${HttpStatusCode.BAD_REQUEST}, ${Status.ERROR}, ${MessageEnum.REQUIRED_EMAIL}`, async () => {
      const response = await makeSignUpRequest({
        password: TEST_DATA.PASSWORD1,
      });

      expect(response.status).toBe(HttpStatusCode.BAD_REQUEST);
      expect(response.body).toMatchObject({
        code: HttpStatusCode.BAD_REQUEST,
        message: MessageEnum.REQUIRED_EMAIL,
        status: Status.ERROR,
      });
    });
  });
});
