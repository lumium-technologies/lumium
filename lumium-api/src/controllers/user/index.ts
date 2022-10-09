import axios from 'axios';
import express from 'express';
import { SessionRequest } from 'supertokens-node/framework/express';
import { info as i, dataSource } from '../../data-source';
import { AuditEntryEvent } from '../../entity/Audit';
import { User } from '../../entity/User';

export const info = async (req: SessionRequest, res: express.Response) => {
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
            preferences: true
        },
        where: {
            id: req.session!.getUserId()
        },
    });
    res.status(200).send(user);
}

export const deleteAccount = async (req: SessionRequest, res: express.Response) => {
    await dataSource.getRepository(User).remove({ id: req.session!.getUserId() });
    await i({ detail: req.session!.getUserId() + " has deleted his account", type: AuditEntryEvent.USER_DELETED });
    await req.session!.revokeSession();
    await axios.post(process.env.SUPERTOKENS_CONNECTION_URI! + "/user/remove",
        {
            userId: req.session!.getUserId()
        },
        {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "api-key": process.env.SUPERTOKENS_API_KEY!,
                "cdi-version": "2.14"
            }
        }
    );
    res.status(200).send();
}
