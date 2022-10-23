import express from 'express';
import { PAGE, PONG, USER, WORKSPACE } from '../../../../routes/api/v1/secure';
const router = express.Router();
import { pong } from '../../../controllers';
import { page } from './page';
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
router.use(PAGE, page);

export { router as sec };
