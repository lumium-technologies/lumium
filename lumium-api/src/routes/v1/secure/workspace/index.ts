import express from 'express';
const router = express.Router();
import { info, create } from '../../../../controllers/workspace';

/**
 * GET /secure/workspace/{workspaceId}
 * @summary Get all workspace information the token subject is allowed to see
 * @security JWTAuth
 * @tags workspace
 * @param {string} id.path.required - Workspace uuid
 * @return {Workspace} 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 */
router.get('/:workspaceId', info);

/**
 * POST /secure/workspace
 * @summary Create a new workspace owned by the token subject
 * @security JWTAuth
 * @tags workspace
 * @return {Workspace} 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 */
router.get('/', info);

export { router as workspace };
