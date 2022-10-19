import { SessionRequest } from "supertokens-node/framework/express";
import express from 'express';
import { dataSource, error } from "../../data-source";
import { Workspace } from "../../entity/Workspace";
import { E2EKey } from "../../entity/E2EKey";
import type { E2EKeyCreateDTO, E2EKeyVariantCreateDTO } from '../../../types';
import { E2EKeyVariant } from "../../entity/E2EKeyVariant";
import { User } from "../../entity/User";
import { AuditEntryEvent } from "../../entity/Audit";

export const info = async (req: SessionRequest, res: express.Response<Workspace>) => {
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
    res.status(200).send(workspace);
};

export const create = async (req: express.Request<E2EKeyCreateDTO>, res: express.Response<Workspace>) => {
    const workspace = new Workspace();
    const user = await dataSource.getRepository(User).findOne({ where: { id: (req as unknown as SessionRequest).session!.getUserId() } });
    workspace.owner = user;
    const newWorkspace = await dataSource.getRepository(Workspace).save(workspace);
    const key = new E2EKey();
    key.activator = req.body.activator;
    key.workspace = newWorkspace;
    let savedKey = await dataSource.getRepository(E2EKey).save(key);
    const keys: E2EKeyVariant = req.body.keys.map((k: E2EKeyVariantCreateDTO) => {
        const variant = new E2EKeyVariant();
        variant.key = savedKey;
        variant.activator = k.activator;
        variant.value = k.value;
        return variant;
    });
    await dataSource.getRepository(E2EKeyVariant).save(keys);
    res.status(200).send(savedKey.workspace);
};

export const remove = async (req: SessionRequest, res: express.Response) => {
    const workspace = await dataSource.getRepository(Workspace).findOne({
        where: {
            id: req.params.workspaceId,
            owner: { id: req.session!.getUserId() }
        }
    });
    if (!workspace) {
        error({ user: { id: req.session!.getUserId() }, detail: 'Attempted to delete workspace that is not owned by the current user', type: AuditEntryEvent.UNAUTHORIZED_WORKSPACE_DELETE_ATTEMPT });
        res.status(401).send();
    }
    await dataSource.getRepository(Workspace).delete({ id: req.params.workspaceId });
    res.status(200).send(workspace);
};
