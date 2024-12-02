import { ApiError } from '../errors/api.error.ts';
import {
  comparePasswordService,
  hashPasswordService,
} from './password.service.ts';
import { userRepository } from '../repositories/user.repositorie.ts';
import {
  ISignInReq,
  ISignInRes,
  ISignUpReq,
  ISignUpRes,
} from '../interfaces/auth.interface.ts';
import { tokenService } from './token.service.ts';
import { MessageEnum } from '../enums/enums.ts';

const isEmailExist = async (email: string): Promise<void> => {
  const res = await userRepository.getUserByEmail(email);

  if (res) {
    throw ApiError.conflict(MessageEnum.CONFLICT);
  }
};

const emailFormat = (email: string): string => {
  return email.toLowerCase();
};

const signUp = async (dto: ISignUpReq): Promise<ISignUpRes> => {
  await isEmailExist(dto.email);

  const normalizeEmail = emailFormat(dto.email);
  const hashPassword = await hashPasswordService(dto.password);

  const user = await userRepository.createUser({
    email: normalizeEmail,
    password: hashPassword,
  });

  const response = {
    _id: user._id,
    email: user.email,
  };

  return response;
};

const signIn = async (dto: ISignInReq): Promise<ISignInRes> => {
  const user = await userRepository.getUserByEmail(dto.email);

  if (!user) {
    throw ApiError.badRequest(MessageEnum.INVALID_CREDENTIALS_MESSAGE);
  }

  const isComparePassword = await comparePasswordService(
    dto.password,
    user.password,
  );

  if (!isComparePassword) {
    throw ApiError.badRequest(MessageEnum.INVALID_CREDENTIALS_MESSAGE);
  }

  const token = tokenService.generateToken({
    _id: user._id,
    email: user.email,
  });

  await userRepository.findUserAndUpdateToken(user._id, token);

  return {
    _id: user._id,
    email: user.email,
    ...token,
  };
};

export const authService = {
  signUp,
  signIn,
};