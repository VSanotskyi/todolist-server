import { ApiError } from '../errors/api.error';
import {
  comparePasswordService,
  hashPasswordService,
} from './password.service';
import { userRepository } from '../repositories/user.repositorie';
import {
  ISignInReq,
  ISignInRes,
  ISignUpReq,
  ISignUpRes,
} from '../interfaces/auth.interface';
import { tokenService } from './token.service';
import { MessageEnum } from '../enums/enums';

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
  const normalizeEmail = emailFormat(dto.email);

  const user = await userRepository.getUserByEmail(normalizeEmail);

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
