export const ROOT = '/';
export const ACCOUNT = ROOT + 'account';
export const AUTH = ROOT + 'auth';
export const AUTH_SIGNIN = AUTH + '/signin';
export const AUTH_SIGNUP = AUTH + '/signup';
export const AUTH_PASSWORD_RESET = AUTH + '/reset-password';
export const SPACES = ROOT + 'spaces';
export const SPACES_NEW = SPACES + '/new';
export const WORKSPACE = ROOT + 'workspace';

export const AUTH_USER = AUTH + '/user';
export const PASSWORD_RESET = AUTH_USER + '/password/reset';
export const PASSWORD_RESET_TOKEN = PASSWORD_RESET + '/token';
export const EMAIL_EXISTS = AUTH_SIGNUP + '/email/exists';
export const EMAIL_VERIFY = AUTH_USER + '/email/verify';
export const EMAIL_VERIFY_TOKEN = EMAIL_VERIFY + '/token';
