import { GET as getUser, DELETE as deleteUser } from './user';
import { WORKSPACEID_GET as getWorkspace, PUT as createWorkspace, WORKSPACEID_DELETE as deleteWorkspace, WORKSPACEID_PATCH as patchWorkspace, WORKSPACEID_POST as postWorkspace } from './workspace';
import { PAGEID_GET as getPage } from './page';
import { SIGNOUT_POST as postSignOut } from './auth';

export const PONG = '/pong';
export const USER = '/user';
export const USER_GET = USER + getUser;
export const USER_DELETE = USER + deleteUser;
export const WORKSPACE = '/workspace';
export const WORKSPACE_WORKSPACEID_GET = WORKSPACE + getWorkspace;
export const WORKSPACE_PUT = WORKSPACE + createWorkspace;
export const WORKSPACE_WORKSPACEID_DELETE = WORKSPACE + deleteWorkspace;
export const WORKSPACE_WORKSPACEID_PATCH = WORKSPACE + patchWorkspace;
export const WORKSPACE_WORKSPACEID_POST = WORKSPACE + postWorkspace;
export const PAGE = '/page';
export const PAGE_PAGEID_GET = PAGE + getPage;
export const AUTH = '/auth';
export const AUTH_SIGNOUT = AUTH + postSignOut;