import Joi from 'joi';

import { EMAIL_REGEX, PASSWORD_REGEX } from '../constants/index.ts';
import { MessageEnum } from '../enums/enums.ts';

const AuthSchema = Joi.object({
  email: Joi.string().regex(EMAIL_REGEX).required().messages({
    'string.pattern.base': MessageEnum.INVALID_EMAIL_FORMAT,
    'any.required': MessageEnum.REQUIRED_EMAIL,
  }),
  password: Joi.string().regex(PASSWORD_REGEX).required().messages({
    'string.pattern.base': MessageEnum.INVALID_PASSWORD_FORMAT,
    'any.required': MessageEnum.REQUIRED_PASSWORD,
  }),
});

export { AuthSchema };
