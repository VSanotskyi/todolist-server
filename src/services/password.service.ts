import * as bcrypt from 'bcrypt';

const hashPasswordService = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const comparePasswordService = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export { hashPasswordService, comparePasswordService };
