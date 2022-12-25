import express from 'express';
import { PageDTO } from '../../types';
import { dataSource } from '../data-source';
import { mapToPageDTO, Page } from '../entity/Page';

export const info = async (req: express.Request, res: express.Response<PageDTO>) => {
    const page = await dataSource.getRepository(Page).findOne({
        relations: {
            workspace: true,
            owner: true,
            admins: true,
            members: true,
            visitors: true,
        },
        where: {
            id: req.params.pageId
        },
    });
    if (!page) {
        return res.status(404).send();
    }
    
    const userId = req.user!;
    if (page.owner.id != userId && !page.admins.map((t) => t.id).includes(userId) && !page.members.map((t) => t.id).includes(userId) && !page.visitors.map((t) => t.id).includes(userId)) {
        return res.status(401).send();
    }
    return res.status(200).send(mapToPageDTO(page));
};

export const create = async (req: express.Request, res: express.Response) => {
};

export const update = async (req: express.Request, res: express.Response) => {
};

export const remove = async (req: express.Request, res: express.Response) => {
};
