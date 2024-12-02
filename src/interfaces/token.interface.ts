export interface IToken {
  token: string;
}

export interface ITokenPayload {
  _id: string;
  email: string;
}

export interface ITokenPair extends IToken {}
