import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../errors/api.error';
import { authService } from '../services/auth.service';
import { ctrlWrapper } from './ctrl.wrapper';
import { ISignInReq, ISignUpReq } from '../interfaces/auth.interface';
import { MessageEnum } from '../enums/enums';
import { IUser } from '../interfaces/user.interface';

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body as ISignUpReq;

  if (!body) {
    return next(ApiError.badRequest(MessageEnum.REQUEST_BODY_MISSING));
  }

  const user = await authService.signUp(body);

  res.status(201).json({
    user,
    message: MessageEnum.USER_CREATED,
  });
};

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body as ISignInReq;

  if (!body) {
    return next(ApiError.badRequest(MessageEnum.REQUEST_BODY_MISSING));
  }

  const user = await authService.signIn(body);

  res.cookie('token', user.token, {
    httpOnly: true,
    secure: false,
    // todo for https
    sameSite: 'lax',
    maxAge: 48 * 60 * 60 * 1000,
    path: '/',
  });

  res.status(200).json({
    message: MessageEnum.LOGGED_IN,
    user: {
      email: user.email,
      _id: user._id,
    },
  });
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.body.user as IUser;

  if (!user) {
    return next(ApiError.unauthorized(MessageEnum.UNAUTHORIZED));
  }

  await authService.logout({ _id: user._id });

  res.clearCookie('token');

  res.status(200).json({
    message: MessageEnum.LOGGED_OUT,
  });
};

export const authController = {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
  logout: ctrlWrapper(logout),
};
