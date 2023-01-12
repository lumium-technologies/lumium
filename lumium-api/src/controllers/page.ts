import express from 'express';
import { PageCreateDTO, PageDTO, PageUpdateDTO } from '../../types';
import { dataSource } from '../data-source';
import { mapCreateToPage, mapToPageDTO, mapUpdateToPage, Page } from '../entity/Page';
import { Workspace } from '../entity/Workspace';

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

export const create = async (req: express.Request<PageCreateDTO>, res: express.Response<PageDTO>) => {
    const workspace = await dataSource.getRepository(Workspace).findOne({
        relations: {
            owner: true,
            admins: true,
            members: true
        },
        where: {
            id: req.body.workspaceId
        }
    });
    if (!workspace) {
        return res.status(404).send();
    }

    const userId = req.user!;
    if (workspace.owner.id != userId && !workspace.admins.map(t => t.id).includes(userId) && !workspace.members.map(t => t.id).includes(userId)) {
        return res.status(401).send();
    }

    const page = await dataSource.getRepository(Page).save(mapCreateToPage(req.body, userId));
    return res.status(200).send(mapToPageDTO(page));
};

export const update = async (req: express.Request<PageUpdateDTO>, res: express.Response<PageDTO>) => {
    const page = await dataSource.getRepository(Page).findOne({
        relations: {
            workspace: true,
            owner: true,
            admins: true,
            members: true
        },
        where: {
            id: req.body.pageId
        }
    });
    const workspace = await dataSource.getRepository(Workspace).findOne({
        relations: {
            owner: true,
            admins: true,
            members: true
        },
        where: {
            id: page.workspace.id
        }
    });

    if (!page) {
        return res.status(404).send();
    }

    const userId = req.user!;
    if (page.owner.id != userId && !page.admins.map(t => t.id).includes(userId) && !page.members.map(t => t.id).includes(userId)) {
        return res.status(401).send();
    }
    if (workspace.owner.id != userId && !workspace.admins.map(t => t.id).includes(userId) && !workspace.members.map(t => t.id).includes(userId)) {
        return res.status(401).send();
    }

    const updatedPage = await dataSource.getRepository(Page).save(mapUpdateToPage(req.body));
    return res.status(200).send(mapToPageDTO(updatedPage));
};

export const remove = async (req: express.Request, res: express.Response) => {
    const page = await dataSource.getRepository(Page).findOne({
        relations: {
            workspace: true,
            owner: true,
            admins: true,
            members: true
        },
        where: {
            id: req.params.pageId
        }
    });
    const workspace = await dataSource.getRepository(Workspace).findOne({
        relations: {
            owner: true,
            admins: true,
            members: true
        },
        where: {
            id: page.workspace.id
        }
    });

    if (!page) {
        return res.status(404).send();
    }

    const userId = req.user!;
    if (page.owner.id != userId && !page.admins.map(t => t.id).includes(userId) && !page.members.map(t => t.id).includes(userId)) {
        return res.status(401).send();
    }
    if (workspace.owner.id != userId && !workspace.admins.map(t => t.id).includes(userId) && !workspace.members.map(t => t.id).includes(userId)) {
        return res.status(401).send();
    }

    await dataSource.getRepository(Page).delete({ id: req.params.pageId });
    return res.status(204).send();
};
