import { SessionRequest } from "supertokens-node/framework/express";
import express from 'express';
import { dataSource } from "../../data-source";
import { Workspace } from "../../entity/Workspace";
import { E2EKey } from "../../entity/E2EKey";
import type { E2EKeyCreateDTO } from '../../../types';

export const info = async (req: SessionRequest, res: express.Response<Workspace>) => {
    const workspace = await dataSource.getRepository(Workspace).findOne({
        where: {
            id: req.params.workspaceId
        }
    });
    res.status(200).send(workspace);
}

export const create = async (req: express.Request<E2EKeyCreateDTO>, res: express.Response<Workspace>) => {
    const workspace = new Workspace();
    workspace.owner = { id: (req as unknown as SessionRequest).session!.getUserId() };
    const key = new E2EKey();
    key.keys = req.body.keys;
    workspace.key = key;
    const newWorkspace = await dataSource.getRepository(Workspace).save(workspace);
    res.status(200).send(newWorkspace);
}
