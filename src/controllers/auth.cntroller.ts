import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../errors/api.error.ts';
import { authService } from '../services/auth.service.ts';
import { ctrlWrapper } from './ctrl.wrapper.ts';
import { ISignInReq, ISignUpReq } from '../interfaces/auth.interface.ts';
import { SuccessMessages } from '../constants/enum.ts';
import { HttpStatusCode, MessageEnum, Status } from '../enums/enums.ts';

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body as ISignUpReq;

  if (!body) {
    return next(ApiError.badRequest(MessageEnum.REQUEST_BODY_MISSING));
  }

  const user = await authService.signUp(body);

  res.status(201).json({
    user,
    message: SuccessMessages.USER_CREATED,
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

  res.status(200).json({
    code: HttpStatusCode.OK,
    status: Status.SUCCESS,
    message: SuccessMessages.LOGIN_SUCCESS,
    user,
  });
};

export const authController = {
  signUp: ctrlWrapper(signUp),
  signIn: ctrlWrapper(signIn),
};
