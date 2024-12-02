import { HttpStatusCode, MessageEnum } from '../enums/enums.ts';

export class ApiError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string = MessageEnum.BAD_REQUEST) {
    return new ApiError(message, HttpStatusCode.BAD_REQUEST);
  }

  static unauthorized(message: string = MessageEnum.UNAUTHORIZED) {
    return new ApiError(message, HttpStatusCode.UNAUTHORIZED);
  }

  static notFound(message: string = MessageEnum.NOT_FOUND) {
    return new ApiError(message, HttpStatusCode.NOT_FOUND);
  }

  static conflict(message: string = MessageEnum.CONFLICT) {
    return new ApiError(message, HttpStatusCode.CONFLICT);
  }

  static internal(message: string = MessageEnum.INTERNAL_SERVER_ERROR) {
    return new ApiError(message, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}
