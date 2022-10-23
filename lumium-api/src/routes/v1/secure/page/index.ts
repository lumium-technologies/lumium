import express from 'express';
import { PAGEID_GET } from '../../../../../routes/api/v1/secure/page';
const router = express.Router();
import { info } from '../../../../controllers/page';

/**
 * GET /secure/page/{pageId}
 * @summary Get all page information the token subject is allowed to see
 * @security JWTAuth
 * @tags page
 * @param {string} id.path.required - Page uuid
 * @return {PageDTO} 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 * @return 404 - Not found - text/plain
 */
router.get(PAGEID_GET, info);

export { router as page };
