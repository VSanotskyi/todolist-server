import jsonwebtoken from 'jsonwebtoken';

import { IToken, ITokenPayload } from '../interfaces/token.interface.ts';
import { config } from '../config/config.ts';

const generateToken = (payload: ITokenPayload): IToken => {
  const token = jsonwebtoken.sign(payload, config.JWT_TOKEN_SECRET!, {
    expiresIn: config.JWT_EXPIRES,
  });

  return { token };
};

export const tokenService = {
  generateToken,
};
