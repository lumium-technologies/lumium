import express from 'express';
const router = express.Router();
import { pong } from '../../../controllers';

/**
 * GET /secure/pong
 * @summary Dummy endpoint to test whether authentication is working
 * @security JWTAuth
 * @tags pingpong
 * @return 200 - Success, authorization accepted  - text/plain
 * @return 401 - Unauthorized - text/plain
 */
router.get('/pong', pong);

export { router as sec };
