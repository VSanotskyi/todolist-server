import { Request, Response, NextFunction } from 'express';
import { cache } from 'joi';

const ctrlWrapper = (
  ctrl: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ctrl(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};

export { ctrlWrapper };
