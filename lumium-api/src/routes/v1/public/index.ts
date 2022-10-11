import express from 'express';
const router = express.Router();
import { ping } from '../../../controllers';
import { PING } from '../../../../routes/v1';
/**
 * GET /ping
 * @summary Dummy endpoint to test whether API is reachable
 * @tags pingpong
 * @return 200 - Success, API is online  - text/plain
 */
router.get(PING, ping);

export { router as pub };
