import { Request, Response, NextFunction } from 'express';

import { ApiError } from '../errors/api.error.ts';
import { HttpStatusCode, MessageEnum } from '../enums/enums.ts';

export const errorMiddleware = (
  err: ApiError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      status: 'error',
      code: err.statusCode,
      message: err.message,
    });

    return;
  }

  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    code: HttpStatusCode.INTERNAL_SERVER_ERROR,
    message: MessageEnum.INTERNAL_SERVER_ERROR,
  });
};
