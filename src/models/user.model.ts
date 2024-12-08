import mongoose from 'mongoose';

import { IUser } from '../interfaces/user.interface';

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, default: null },
});

export const User = mongoose.model<IUser>('user', userSchema);
