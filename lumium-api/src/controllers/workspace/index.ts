import { SessionRequest } from "supertokens-node/framework/express";
import express from 'express';
import { dataSource } from "../../data-source";
import { Workspace } from "../../entity/Workspace";
import { E2EKey } from "../../entity/E2EKey";

export const info = async (req: SessionRequest, res: express.Response) => {
    const workspace = await dataSource.getRepository(Workspace).findOne({
        where: {
            id: req.params.workspaceId
        }
    });
    res.status(200).send(workspace);
}

export const create = async (req: SessionRequest, res: express.Response) => {
    const workspace = new Workspace();
    workspace.owner = { id: req.session!.getUserId() };
    const key = new E2EKey();
    key.keys = req.body.keys!;
    workspace.key = key;
    const newWorkspace = await dataSource.getRepository(Workspace).save(workspace);
    res.status(200).send(newWorkspace);
}
