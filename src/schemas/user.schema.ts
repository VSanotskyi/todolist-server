import Joi from 'joi';

import { EMAIL_REGEX, PASSWORD_REGEX } from '../constants';

export const userSchema = Joi.object({
  email: Joi.string().regex(EMAIL_REGEX).required().messages({
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().regex(PASSWORD_REGEX).required().messages({
    'string.pattern.base':
      'Password must be at least 8 characters long, include one uppercase letter, and one special character.',
    'any.required': 'Password is required',
  }),
});
