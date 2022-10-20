import express from 'express';
import { PUT as PUT, WORKSPACEID_PATCH } from '../../../../../routes/api/v1/secure/workspace';
import { WORKSPACEID_GET, WORKSPACEID_DELETE } from '../../../../../routes/api/v1/secure/workspace';
const router = express.Router();
import { info, create, remove, patch } from '../../../../controllers/workspace';

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
 * PUT /secure/workspace
 * @summary Create a new workspace owned by the token subject
 * @security JWTAuth
 * @tags workspace
 * @param {E2EKeyCreateDTO} request.body.required - end-to-end key variants encrypted with passwords of user's choice - application/json
 * @return {WorkspaceDTO} 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 */
router.put(PUT, create);

/**
 * DELETE /secure/workspace/{workspaceId}
 * @summary Deletes a workspace owned by the token subject
 * @security JWTAuth
 * @tags workspace
 * @param {string} id.path.required - Workspace uuid
 * @return {WorkspaceDTO} 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 */
router.delete(WORKSPACEID_DELETE, remove);

/**
 * PATCH /secure/workspace/{workspaceId}
 * @summary Patches a workspace owned by the token subject
 * @security JWTAuth
 * @tags workspace
 * @param {string} id.path.required - Workspace uuid
 * @param {WorkspaceUpdateDTO} request.body.required - new workspace properties - application/json
 * @return {WorkspaceDTO} 200 - Success - application/json
 * @return 401 - Unauthorized - text/plain
 */
router.patch(WORKSPACEID_PATCH, patch);

export { router as workspace };
