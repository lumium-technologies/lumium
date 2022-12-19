import express from 'express';
const router = express.Router();
import { SIGNIN_POST, SIGNUP_POST } from '../../../../../routes/api/v1/public/auth';
import { signIn, signUp } from '../../../controllers/auth';

/**
 * POST /auth/signin
 * @summary Generates a signed JWT to authenticate the user
 * @tags auth
 * @param {UserAuthDTO} request.body.required - Auth information
 * @return 200 - Success - application/json
 * @return {ReasonDTO} 500 - Error, status can be: "INVALID_CREDENTIALS", "EMAIL_DOES_NOT_EXIST" - application/json
 */
router.post(SIGNIN_POST, signIn);

/**
 * POST /auth/signup
 * @summary Creates a new user account and generates a JWT to authenticate the user
 * @tags auth
 * @param {UserAuthDTO} request.body.required - Auth information
 * @return 200 - Success - application/json
 * @return {ReasonDTO} 500 - Error, status can be: "EMAIL_ALREADY_EXISTS" - application/json
 */
router.post(SIGNUP_POST, signUp);

export { router as auth };
