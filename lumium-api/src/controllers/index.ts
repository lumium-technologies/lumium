import Express from 'express';
import { SessionRequest } from 'supertokens-node/framework/express';

const ping = (req: Express.Request, res: Express.Response) => {
    res.status(200).send('pong');
};

const pong = (req: SessionRequest, res: Express.Response) => {
    res.status(200).send('ping');
};

export { ping, pong };
