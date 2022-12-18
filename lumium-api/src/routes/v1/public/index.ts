import express from 'express';
const router = express.Router();
import { ping } from '../../../controllers';
import { PUBLIC_PING, PUBLIC_AUTH } from '../../../../routes/api/v1';
import { user as auth } from './auth';

/**
 * GET /ping
 * @summary Dummy endpoint to test whether API is reachable
 * @tags pingpong
 * @return 200 - Success, API is online  - text/plain
 */
router.get(PUBLIC_PING, ping);

router.use(PUBLIC_AUTH, auth);

export { router as pub };
