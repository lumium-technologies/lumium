import express from 'express';
import { POST } from '../../../../../routes/api/v1/secure/workspace';
import { WORKSPACEID_GET } from '../../../../../routes/api/v1/secure/workspace';
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
router.get(WORKSPACEID_GET, info);

/**
 * POST /secure/workspace
 * @summary Create a new workspace owned by the token subject
 * @security JWTAuth
 * @tags workspace
 * @param {E2EKeyCreateDTO} request.body.required - end-to-end key variants encrypted with passwords of user's choice - application/json
 * @return {WorkspaceDTO} 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 */
router.post(POST, create);

export { router as workspace };
