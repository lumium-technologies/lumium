import express from 'express';
import { dataSource, error } from "../data-source";
import { mapToWorkspaceDTO, Workspace } from "../entity/Workspace";
import type { WorkspaceDTO, WorkspaceUpdateDTO } from '../../../types';
import { User } from "../entity/User";
import { AuditEntryEvent } from "../entity/Audit";
import { WorkspaceCreateDTO } from "../../../types/api/v1/dto/request/WorkspaceCreateDTO";

export const info = async (req: express.Request, res: express.Response<WorkspaceDTO>) => {
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
        return res.status(404).send();
    }
    const userId = req.user!;
    if (workspace.owner.id != userId && !workspace.admins.map((t) => t.id).includes(userId) && !workspace.members.map((t) => t.id).includes(userId) && !workspace.visitors.map((t) => t.id).includes(userId)) {
        return res.status(401).send();
    }
    return res.status(200).send(mapToWorkspaceDTO(workspace));
};

export const create = async (req: express.Request<WorkspaceCreateDTO>, res: express.Response<WorkspaceDTO>) => {
    const workspace = new Workspace();
    const user = await dataSource.getRepository(User).findOne({ where: { id: req.user! } });
    workspace.owner = user;
    workspace.name = req.body.name;
    workspace.key = req.body.key;
    const newWorkspace = await dataSource.getRepository(Workspace).save(workspace);
    user.recentWorkspace = newWorkspace;
    await dataSource.getRepository(User).save(user);
    return res.status(200).send(mapToWorkspaceDTO(newWorkspace));
};

export const remove = async (req: express.Request, res: express.Response<WorkspaceDTO>) => {
    const workspace = await dataSource.getRepository(Workspace).findOne({
        relations: {
            owner: true
        },
        where: {
            id: req.params.workspaceId,
        }
    });
    if (!workspace) {
        return res.status(404).send();
    }
    if (workspace.owner.id != req.user!) {
        error({ user: { id: req.user! }, detail: 'Attempted to delete workspace that is not owned by the current user', type: AuditEntryEvent.UNAUTHORIZED_WORKSPACE_DELETE_ATTEMPT });
        return res.status(401).send();
    }
    await dataSource.getRepository(Workspace).delete({ id: req.params.workspaceId });
    return res.status(200).send(mapToWorkspaceDTO(workspace));
};

export const patch = async (req: express.Request<WorkspaceUpdateDTO>, res: express.Response<WorkspaceDTO>) => {
    // TODO: make this a true patch implementation
    const workspace = await dataSource.getRepository(Workspace).findOne({
        relations: {
            owner: true,
            admins: true
        },
        where: {
            id: req.body.workspaceId,
        }
    });
    if (!workspace) {
        return res.status(404).send();
    }
    const userId = req.user!;
    if (workspace.owner.id != userId && !workspace.admins.map((t) => t.id).includes(userId)) {
        error({ user: { id: req.user! }, detail: 'Attempted to patch workspace that is not owned by the current user', type: AuditEntryEvent.UNAUTHORIZED_WORKSPACE_PATCH_ATTEMPT });
        return res.status(401).send();
    }
    const updated = await dataSource.getRepository(Workspace).save({ ...workspace, ...req.body });
    return res.status(200).send(mapToWorkspaceDTO(updated));
};

export const post = async (req: express.Request<WorkspaceUpdateDTO>, res: express.Response<WorkspaceDTO>) => {
    const workspace = await dataSource.getRepository(Workspace).findOne({
        relations: {
            owner: true,
            admins: true
        },
        where: {
            id: req.body.workspaceId,
        }
    });
    if (!workspace) {
        return res.status(404).send();
    }
    const userId = req.user!;
    if (workspace.owner.id != userId && !workspace.admins.map((t) => t.id).includes(userId)) {
        error({ user: { id: req.user! }, detail: 'Attempted to post workspace that is not owned by the current user', type: AuditEntryEvent.UNAUTHORIZED_WORKSPACE_POST_ATTEMPT });
        return res.status(401).send();
    }
    const updated = await dataSource.getRepository(Workspace).save({ ...workspace, ...req.body });
    return res.status(200).send(mapToWorkspaceDTO(updated));
};
