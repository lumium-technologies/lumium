import { postSignIn, postSignUp } from './auth';

export const PING = '/ping';
export const AUTH = '/auth';
export const SIGNIN_POST = postSignIn;
export const SIGNUP_POST = postSignUp;
export const AUTH_SIGNIN_POST = AUTH + SIGNIN_POST;
export const AUTH_SIGNUP_POST = AUTH + SIGNUP_POST;
