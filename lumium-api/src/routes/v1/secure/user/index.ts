import express from 'express';
const router = express.Router();
import { info } from '../../../../controllers/user';

/**
 * GET /secure/user/info
 * @summary Returns all account information about the token subject
 * @security JWTAuth
 * @tags user
 * @return {User} 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 */
router.get('/info', info);

export { router as user };
