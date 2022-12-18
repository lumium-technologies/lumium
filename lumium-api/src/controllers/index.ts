import express from 'express';

const ping = (req: express.Request, res: express.Response) => {
    return res.status(200).send('pong');
};

const pong = (req: express.Request, res: express.Response) => {
    return res.status(200).send('ping');
};

export { ping, pong };
