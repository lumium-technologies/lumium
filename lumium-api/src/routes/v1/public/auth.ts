import express from 'express';
const router = express.Router();
import { AUTH_SIGNIN_POST, AUTH_SIGNUP_POST } from '../../../../../routes/api/v1/public';
import { signIn, signUp } from '../../../controllers/auth';

/**
 * POST /auth/signin
 * @summary Generates a signed JWT to authenticate the user
 * @security JWTAuth
 * @tags auth
 * @param {UserAuthDTO} request.body.required - Auth information 
 * @return 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 */
router.post(AUTH_SIGNIN_POST, signIn);

/**
 * POST /auth/signup
 * @summary Creates a new user account and generates a JWT to authenticate the user
 * @security JWTAuth
 * @tags auth
 * @param {UserAuthDTO} request.body.required - Auth information 
 * @return 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 */
router.post(AUTH_SIGNUP_POST, signUp);

export { router as user };
