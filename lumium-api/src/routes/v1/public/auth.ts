import express from 'express';
const router = express.Router();
import { AUTH_SIGNIN_POST, AUTH_SIGNUP_POST } from '../../../../../routes/api/v1/public';
import { signIn, signUp } from '../../../controllers/user';

router.post(AUTH_SIGNIN_POST, signIn);

router.post(AUTH_SIGNUP_POST, signUp);

export { router as user };
