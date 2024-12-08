import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

import { ApiError } from '../errors/api.error';

const validateAuthBody = (validator: ObjectSchema) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = await validator.validateAsync(req.body);
      next();
    } catch (e) {
      const error = e as Error;
      next(ApiError.badRequest(error.message));
    }
  };
};

export { validateAuthBody };
