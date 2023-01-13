import express from 'express';
import { ACCESS_TOKEN_COOKIE } from '../../routes/constants';
import { UserDTO } from '../../types/api/v1/response/UserDTO';
import { dataSource } from '../data-source';
import { mapToUserDTO, User } from '../entity/User';

export const info = async (req: express.Request, res: express.Response<UserDTO>) => {
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
        cache: {
            id: `user-${req.user!}`,
            milliseconds: 60 * 1000
        }
    });
    return res.status(200).send(mapToUserDTO(user));
}

export const deleteAccount = async (req: express.Request, res: express.Response) => {
    await dataSource.getRepository(User).remove({ id: req.user! });
    await dataSource.queryResultCache?.remove([`user-${req.user!}`]);

    res.clearCookie(ACCESS_TOKEN_COOKIE);

    return res.status(200).send();
}
