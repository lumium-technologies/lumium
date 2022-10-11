import express from 'express';
import { PONG, USER, WORKSPACE } from '../../../../routes/v1/secure';
const router = express.Router();
import { pong } from '../../../controllers';
import { user } from './user';
import { workspace } from './workspace';

/**
 * GET /secure/pong
 * @summary Dummy endpoint to test whether authentication is working
 * @security JWTAuth
 * @tags pingpong
 * @return 200 - Success, authorization accepted  - text/plain
 * @return 401 - Unauthorized - text/plain
 */
router.get(PONG, pong);

router.use(USER, user);
router.use(WORKSPACE, workspace);

export { router as sec };
