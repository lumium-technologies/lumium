import express from 'express';
import { SIGNOUT_POST } from '../../../../routes/api/v1/secure/auth';
import { signOut } from '../../../controllers/auth';
const router = express.Router();

/**
 * POST /secure/auth/signout
 * @summary Unauthenticates the token subject and blacklists the token
 * @security JWTAuth
 * @tags auth
 * @return 200 - Success (user is now unauthenticated) - text/plain
 * @return 401 - Unauthorized (user is not authenticated and can thus not be unauthenticated) - text/plain
 */
router.post(SIGNOUT_POST, signOut);

export { router as auth };
