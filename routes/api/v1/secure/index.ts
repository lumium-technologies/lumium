import { GET as getUser, DELETE as deleteUser } from './user';
import { WORKSPACEID_GET as getWorkspace, PUT as createWorkspace, WORKSPACEID_DELETE as deleteWorkspace } from './workspace';

export const PONG = '/pong';
export const USER = '/user';
export const USER_GET = USER + getUser;
export const USER_DELETE = USER + deleteUser;
export const WORKSPACE = '/workspace';
export const WORKSPACE_WORKSPACEID_GET = WORKSPACE + getWorkspace;
export const WORKSPACE_PUT= WORKSPACE + createWorkspace;
export const WORKSPACE_WORKSPACEID_DELETE = WORKSPACE + deleteWorkspace;
