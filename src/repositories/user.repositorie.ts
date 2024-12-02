import { User } from '../models/user.model.ts';
import { IUser } from '../interfaces/user.interface.ts';
import { ISignUpReq } from '../interfaces/auth.interface.ts';
import { IToken } from '../interfaces/token.interface.ts';

const getUserByEmail = async (email: string): Promise<IUser | null> =>
  await User.findOne({ email });

const createUser = async (dto: ISignUpReq): Promise<IUser> =>
  await User.create(dto);

const findUserAndUpdateToken = async (_id: string, token: IToken) =>
  await User.findByIdAndUpdate(_id, token);

export const userRepository = {
  createUser,
  getUserByEmail,
  findUserAndUpdateToken,
};
