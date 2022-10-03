import express from 'express';
const router = express.Router();
import { info, deleteAccount } from '../../../../controllers/user';

/**
 * GET /secure/user
 * @summary Returns all account information about the token subject
 * @security JWTAuth
 * @tags user
 * @return {UserDTO} 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 */
router.get('/', info);

/**
 * DELETE /secure/user
 * @summary Deletes the token subject's account
 * @security JWTAuth
 * @tags user
 * @return 200 - Success - text/plain
 * @return 401 - Unauthorized - text/plain
 */
router.delete('/', deleteAccount);

export { router as user };
