export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,

  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,

  INTERNAL_SERVER_ERROR = 500,
}

export enum MessageEnum {
  USER_CREATED = 'User has been successfully created.',
  USER_UPDATED = 'User has been successfully updated.',
  USER_DELETED = 'User has been successfully deleted.',
  LOGGED_IN = 'User has been successfully logged in.',
  LOGGED_OUT = 'User has been successfully logged out.',

  INVALID_CREDENTIALS = 'Invalid email or password.',
  UNAUTHORIZED_ACCESS = 'You are not authorized to access this resource.',
  TOKEN_EXPIRED = 'Token has expired, please log in again.',
  TOKEN_INVALID = 'Invalid token.',

  USER_NOT_FOUND = 'User not found.',
  EMAIL_ALREADY_EXISTS = 'Email already exists.',
  USER_NOT_ACTIVE = 'User account is not active.',

  INVALID_EMAIL_FORMAT = 'Invalid email format. Please enter a valid email address.',
  INVALID_PASSWORD_FORMAT = 'Password must be at least 8 characters long, include an uppercase letter and a special character.',
  REQUIRED_EMAIL = 'Email is required',
  REQUIRED_PASSWORD = 'Password is required',

  BAD_REQUEST = 'Invalid request.',
  UNAUTHORIZED = 'Unauthorized.',
  NOT_FOUND = 'Resource not found.',
  CONFLICT = 'Conflict detected.',
  INTERNAL_SERVER_ERROR = 'Internal server error.',
  REQUEST_BODY_MISSING = 'Request body is missing.',
  INVALID_CREDENTIALS_MESSAGE = 'Invalid email or password.',

  FORBIDDEN = 'You do not have permission to perform this action.',
  RESOURCE_ALREADY_EXISTS = 'The resource already exists.',
  ACTION_SUCCESSFUL = 'Action completed successfully.',
}
