import express from 'express';
const router = express.Router();
import { ping } from '../../../controllers';

/**
 * GET /ping
 * @summary Dummy endpoint to test whether API is reachable
 * @tags pingpong
 * @return 200 - Success, API is online  - text/plain
 */
router.get('/ping', ping);

export { router as pub };
