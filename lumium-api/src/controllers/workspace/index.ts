import { SessionRequest } from "supertokens-node/framework/express";
import express from 'express';
import { dataSource, error } from "../../data-source";
import { mapToWorkspaceDTO, Workspace } from "../../entity/Workspace";
import { E2EKey } from "../../entity/E2EKey";
import type { E2EKeyCreateDTO, E2EKeyVariantCreateDTO, WorkspaceDTO, WorkspaceUpdateDTO } from '../../../types';
import { E2EKeyVariant } from "../../entity/E2EKeyVariant";
import { User } from "../../entity/User";
import { AuditEntryEvent } from "../../entity/Audit";
import { WorkspacePreference } from "../../entity/WorkspacePreference";

export const info = async (req: SessionRequest, res: express.Response<WorkspaceDTO>) => {
    const workspace = await dataSource.getRepository(Workspace).findOne({
        where: {
            id: req.params.workspaceId
        },
        relations: {
            owner: true,
            admins: true,
            members: true,
            visitors: true,
            pages: true,
            preferences: true,
            key: true
        }
    });
    if (!workspace) {
        res.status(404).send();
    }
    const userId = (req as unknown as SessionRequest).session!.getUserId();
    if (workspace.owner.id != userId && !workspace.admins.map((t) => t.id).includes(userId) && !workspace.members.map((t) => t.id).includes(userId) && !workspace.visitors.map((t) => t.id).includes(userId)) {
        res.status(401).send();
    }
    res.status(200).send(mapToWorkspaceDTO(workspace));
};

export const create = async (req: express.Request<E2EKeyCreateDTO>, res: express.Response<WorkspaceDTO>) => {
    const workspace = new Workspace();
    const user = await dataSource.getRepository(User).findOne({ where: { id: (req as unknown as SessionRequest).session!.getUserId() } });
    workspace.owner = user;
    const newWorkspace = await dataSource.getRepository(Workspace).save(workspace);
    user.recentWorkspace = newWorkspace;
    await dataSource.getRepository(User).save(user);
    const key = new E2EKey();
    key.activator = req.body.activator;
    key.workspace = newWorkspace;
    let savedKey = await dataSource.getRepository(E2EKey).save(key);
    const keys: E2EKeyVariant = req.body.keys.map((k: E2EKeyVariantCreateDTO) => {
        const variant = new E2EKeyVariant();
        variant.key = savedKey;
        variant.activator = k.activator;
        variant.activatorNonce = k.activatorNonce;
        variant.value = k.value;
        variant.valueNonce = k.valueNonce;
        return variant;
    });
    await dataSource.getRepository(E2EKeyVariant).save(keys);
    res.status(200).send(mapToWorkspaceDTO(savedKey.workspace));
};

export const remove = async (req: SessionRequest, res: express.Response<WorkspaceDTO>) => {
    const workspace = await dataSource.getRepository(Workspace).findOne({
        relations: {
            owner: true
        },
        where: {
            id: req.params.workspaceId,
        }
    });
    if (!workspace) {
        res.status(404).send();
    }
    if (workspace.owner.id != req.session!.getUserId()) {
        error({ user: { id: req.session!.getUserId() }, detail: 'Attempted to delete workspace that is not owned by the current user', type: AuditEntryEvent.UNAUTHORIZED_WORKSPACE_DELETE_ATTEMPT });
        res.status(401).send();
    }
    await dataSource.getRepository(Workspace).delete({ id: req.params.workspaceId });
    res.status(200).send(mapToWorkspaceDTO(workspace));
};

export const patch = async (req: express.Request<WorkspaceUpdateDTO>, res: express.Response<WorkspaceDTO>) => {
    // TODO: make this a true patch implementation
    const workspace = await dataSource.getRepository(Workspace).findOne({
        relations: {
            owner: true,
            admins: true
        },
        where: {
            id: (req as unknown as SessionRequest).params.workspaceId,
        }
    });
    if (!workspace) {
        res.status(404).send();
    }
    const userId = (req as unknown as SessionRequest).session!.getUserId();
    if (workspace.owner.id != userId && !workspace.admins.map((t) => t.id).includes(userId)) {
        error({ user: { id: (req as unknown as SessionRequest).session!.getUserId() }, detail: 'Attempted to patch workspace that is not owned by the current user', type: AuditEntryEvent.UNAUTHORIZED_WORKSPACE_PATCH_ATTEMPT });
        res.status(401).send();
    }
    const updated = await dataSource.getRepository(Workspace).save({ ...workspace, ...req.body });
    res.status(200).send(mapToWorkspaceDTO(updated));
};

export const post = async (req: express.Request<WorkspaceUpdateDTO>, res: express.Response<WorkspaceDTO>) => {
    const workspace = await dataSource.getRepository(Workspace).findOne({
        relations: {
            owner: true,
            admins: true
        },
        where: {
            id: (req as unknown as SessionRequest).params.workspaceId,
        }
    });
    if (!workspace) {
        res.status(404).send();
    }
    const userId = (req as unknown as SessionRequest).session!.getUserId();
    if (workspace.owner.id != userId && !workspace.admins.map((t) => t.id).includes(userId)) {
        error({ user: { id: (req as unknown as SessionRequest).session!.getUserId() }, detail: 'Attempted to post workspace that is not owned by the current user', type: AuditEntryEvent.UNAUTHORIZED_WORKSPACE_POST_ATTEMPT });
        res.status(401).send();
    }
    const updated = await dataSource.getRepository(Workspace).save({ ...workspace, ...req.body });
    res.status(200).send(mapToWorkspaceDTO(updated));
};
