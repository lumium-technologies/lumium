import express from 'express';
import { dataSource } from '../data-source';
import { Page } from '../entity/Page';

export const info = async (req: express.Request, res: express.Response<Page>) => {
    const page = await dataSource.getRepository(Page).findOne({
        relations: {
            workspace: true,
            owner: true,
            admins: true,
            members: true,
            visitors: true,
            contents: true
        },
        where: {
            id: req.user!
        },
    });
    if (!page) {
        return res.status(404).send();
    }
    return res.status(200).send(page);
}
