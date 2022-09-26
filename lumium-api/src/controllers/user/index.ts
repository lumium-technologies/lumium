import express from 'express';
import { SessionRequest } from 'supertokens-node/framework/express';
import { dataSource } from '../../data-source';
import { User } from '../../entity/User';

export const info = async (req: SessionRequest, res: express.Response) => {
    const user = await dataSource.getRepository(User).findOneById(req.session!.getUserId());
    res.status(200).send(user);
}
