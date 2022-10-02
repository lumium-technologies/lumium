import express from 'express';
const router = express.Router();
import { info, create } from '../../../../controllers/workspace';

/**
 * GET /secure/workspace/{workspaceId}
 * @summary Get all workspace information the token subject is allowed to see
 * @security JWTAuth
 * @tags workspace
 * @param {string} id.path.required - Workspace uuid
 * @return {WorkspaceDTO} 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 */
router.get('/:workspaceId', info);

/**
 * POST /secure/workspace
 * @summary Create a new workspace owned by the token subject
 * @security JWTAuth
 * @tags workspace
 * @param {E2EKeyCreateDTO} request.body.required - end-to-end key variants encrypted with passwords of user's choice - application/json
 * @return {WorkspaceDTO} 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 */
router.post('/', create);

export { router as workspace };
