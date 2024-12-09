import { User } from '../models/user.model';
import { IUser } from '../interfaces/user.interface';
import { ISignUpReq } from '../interfaces/auth.interface';
import { IToken } from '../interfaces/token.interface';

const getUserByEmail = async (email: string): Promise<IUser | null> =>
  await User.findOne({ email });

const getById = async (_id: string): Promise<IUser | null> =>
  await User.findById(_id);

const createUser = async (dto: ISignUpReq): Promise<IUser> =>
  await User.create(dto);

const findUserAndUpdateToken = async (_id: string, token: IToken) =>
  await User.findByIdAndUpdate(_id, token);

export const userRepository = {
  createUser,
  getUserByEmail,
  findUserAndUpdateToken,
  getById,
};
