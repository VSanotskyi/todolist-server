import jsonwebtoken from 'jsonwebtoken';

import { IToken, ITokenPayload } from '../interfaces/token.interface';
import { config } from '../config/config';

const generateToken = (payload: ITokenPayload): IToken => {
  const token = jsonwebtoken.sign(payload, config.JWT_TOKEN_SECRET!, {
    expiresIn: config.JWT_EXPIRES,
  });

  return { token };
};

export const tokenService = {
  generateToken,
};
