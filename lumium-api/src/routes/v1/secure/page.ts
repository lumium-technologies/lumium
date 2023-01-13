import express from 'express';
import { PAGEID_GET } from '../../../../../routes/api/v1/secure/page';
import { PAGEID_DELETE, POST, PUT } from '../../../../routes/api/v1/secure/page';
const router = express.Router();
import { create, info, remove, post } from '../../../controllers/page';

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

/**
 * PUT /secure/page/
 * @summary Create a new page
 * @security JWTAuth
 * @tags page
 * @param {PageCreateDTO} request.body.required - Page creation information
 * @return {PageDTO} 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 * @return 404 - Not found - text/plain
 */
router.put(PUT, create);

/**
 * POST /secure/page/
 * @summary Update a page
 * @security JWTAuth
 * @tags page
 * @param {PageUpdateDTO} request.body.required - Updated page information
 * @return {PageDTO} 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 * @return 404 - Not found - text/plain
 */
router.post(POST, post);

/**
 * DELETE /secure/page/{pageId}
 * @summary Delete a page
 * @security JWTAuth
 * @tags page
 * @param {string} id.path.required - Page uuid
 * @return 204 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 * @return 404 - Not found - text/plain
 */
router.delete(PAGEID_DELETE, remove);

export { router as page };
