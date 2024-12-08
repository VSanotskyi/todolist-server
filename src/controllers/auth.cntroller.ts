import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../errors/api.error';
import { authService } from '../services/auth.service';
import { ctrlWrapper } from './ctrl.wrapper';
import { ISignInReq, ISignUpReq } from '../interfaces/auth.interface';
import { HttpStatusCode, MessageEnum, Status } from '../enums/enums';

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body as ISignUpReq;

  if (!body) {
    return next(ApiError.badRequest(MessageEnum.REQUEST_BODY_MISSING));
  }

  const user = await authService.signUp(body);

  res.status(201).json({
    user,
    message: MessageEnum.USER_CREATED,
    code: HttpStatusCode.CREATED,
    status: Status.SUCCESS,
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
    sameSite: 'none',
    maxAge: 48 * 60 * 60 * 1000,
    path: '/',
    partitioned: true,
  });

  res.status(200).json({
    code: HttpStatusCode.OK,
    status: Status.SUCCESS,
    message: MessageEnum.LOGGED_IN,
    user: {
      email: user.email,
      _id: user._id,
    },
  });
};

export const authController = {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
};
