import { SessionRequest } from "supertokens-node/framework/express";
import express from 'express';
import { dataSource } from "../../data-source";
import { Workspace } from "../../entity/Workspace";

export const info = async (req: SessionRequest, res: express.Response) => {
    const workspace = await dataSource.getRepository(Workspace).findOne({
        where: {
            id: req.params.workspaceId
        }
    });
    res.status(200).send(workspace);
}

export const create = async (req: SessionRequest, res: express.Response) => {
    res.status(200).send();
}
