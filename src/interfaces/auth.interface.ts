export interface ISignUpReq {
  email: string;
  password: string;
}

export interface ISignUpRes {
  _id: string;
  email: string;
}

export interface ISignInReq {
  email: string;
  password: string;
}

export interface ISignInRes {
  _id: string;
  email: string;
  token: string;
}

export interface ILogoutReq {
  _id: string;
}
