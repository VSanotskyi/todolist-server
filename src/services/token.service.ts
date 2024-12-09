import jsonwebtoken from 'jsonwebtoken';

import { IToken, ITokenPayload } from '../interfaces/token.interface';
import { config } from '../config/config';
import { ApiError } from '../errors/api.error';
import { HttpStatusCode, MessageEnum } from '../enums/enums';

const generateToken = (payload: ITokenPayload): IToken => {
  const token = jsonwebtoken.sign(payload, config.JWT_TOKEN_SECRET!, {
    expiresIn: config.JWT_EXPIRES,
  });

  return { token };
};

const verifyToken = (token: string): ITokenPayload => {
  try {
    const decodeToken = jsonwebtoken.verify(token, config.JWT_TOKEN_SECRET);
    return decodeToken as ITokenPayload;
  } catch (error) {
    if (error instanceof jsonwebtoken.TokenExpiredError) {
      throw new ApiError(
        MessageEnum.TOKEN_EXPIRED,
        HttpStatusCode.UNAUTHORIZED,
      );
    }
    if (error instanceof jsonwebtoken.JsonWebTokenError) {
      throw new ApiError(
        MessageEnum.TOKEN_INVALID,
        HttpStatusCode.UNAUTHORIZED,
      );
    }
    throw new ApiError(MessageEnum.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED);
  }
};

export const tokenService = {
  generateToken,
  verifyToken,
};
