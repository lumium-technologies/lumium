import express from 'express';
import { DELETE, GET } from '../../../../../routes/api/v1/secure/user';
const router = express.Router();
import { info, deleteAccount } from '../../../controllers/user';

/**
 * GET /secure/user
 * @summary Returns all account information about the token subject
 * @security JWTAuth
 * @tags user
 * @return {UserDTO} 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 */
router.get(GET, info);

/**
 * DELETE /secure/user
 * @summary Deletes the token subject's account
 * @security JWTAuth
 * @tags user
 * @return 200 - Success - text/plain
 * @return 401 - Unauthorized - text/plain
 */
router.delete(DELETE, deleteAccount);

export { router as user };