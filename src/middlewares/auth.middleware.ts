import { Request, Response, NextFunction } from 'express';

import { MessageEnum } from '../enums/enums';
import { ApiError } from '../errors/api.error';
import { tokenService } from '../services/token.service';
import { userRepository } from '../repositories/user.repositorie';

const authMiddleware = async (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  const token = req.cookies['token'];

  if (!token) {
    return next(ApiError.unauthorized(MessageEnum.UNAUTHORIZED));
  }

  try {
    const decodedToken = tokenService.verifyToken(token);

    const { _id } = decodedToken;

    const user = await userRepository.getById(_id);

    if (user === null) {
      return next(ApiError.unauthorized(MessageEnum.UNAUTHORIZED));
    }

    if (user.token !== token) {
      return next(ApiError.unauthorized(MessageEnum.UNAUTHORIZED));
    }

    req.body.user = {
      _id: user._id,
      email: user.email,
    };

    next();
  } catch (err) {
    const error = err as Error;
    return next(ApiError.unauthorized(error.message));
  }
};

export { authMiddleware };
