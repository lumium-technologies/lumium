import express from 'express';
import { info as i, dataSource } from '../data-source';
import { AuditEntryEvent } from '../entity/Audit';
import { User } from '../entity/User';

export const signIn = async () => { };

export const signUp = async () => { };

export const info = async (req: express.Request, res: express.Response<User>) => {
    const user = await dataSource.getRepository(User).findOne({
        relations: {
            emails: true,
            addresses: true,
            ownedWorkspaces: true,
            administratedWorkspaces: true,
            memberWorkspaces: true,
            visitorWorkspaces: true,
            ownedPages: true,
            administratedPages: true,
            memberPages: true,
            visitorPages: true,
            preferences: true,
            recentWorkspace: true
        },
        where: {
            id: req.user!
        },
    });
    res.status(200).send(user);
}

export const deleteAccount = async (req: express.Request, res: express.Response) => {
    await dataSource.getRepository(User).remove({ id: req.user! });
    await i({ detail: req.user! + " has deleted his account", type: AuditEntryEvent.USER_DELETED });

    res.status(200).send();
}
