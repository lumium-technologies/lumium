import { postSignIn, postSignUp } from './auth';

export const PING = '/ping';
export const AUTH = '/auth';
export const AUTH_SIGNIN_POST = AUTH + postSignIn;
export const AUTH_SIGNUP_POST = AUTH + postSignUp;
