import express from 'express';
import { UserAuthDTO } from "../../types/api/v1/dto/request";
import { dataSource } from '../data-source';
import { User } from '../entity/User';
import crypto from 'crypto';
import { generateAccessToken } from '../cypto';
import { Email } from '../entity/Email';
import { AuthenticationInformation } from '../entity/AuthenticationInformation';

const peppers =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const signIn = async (req: express.Request<UserAuthDTO>, res: express.Response) => {
    const user = await dataSource.getRepository(User).findOne({
        where: {
            emails: {
                email: req.body.email
            }
        },
        relations: {
            auth: true
        }
    });
    if (!user) {
        res.status(401).send();
    }
    let keys = Buffer.from(user.auth!.key, 'base64');
    Array.from(peppers).forEach((pepper) => {
        const derivedKey = crypto.pbkdf2Sync(
            Buffer.from(req.body.password + pepper, 'utf8'),
            Buffer.from(process.env.SALT, 'base64'),
            100000,
            64,
            'sha512'
        );
        if (keys.includes(derivedKey)) {
            res.status(200).cookie('accessToken', generateAccessToken({ userId: user.id }), { httpOnly: true }).send();
        }
    });
    res.status(401).send();
};

export const signUp = async (req: express.Request<UserAuthDTO>, res: express.Response) => {
    const pepper = peppers[Math.floor(Math.random() * 52)];
    const derivedKey = crypto.pbkdf2Sync(
        Buffer.from(req.body.password + pepper, 'utf8'),
        Buffer.from(process.env.SALT, 'base64'),
        100000,
        64,
        'sha512'
    );
    let user = await dataSource.getRepository(User).save({});
    let email = await dataSource.getRepository(Email).save({ user, primary: true, email: req.body.email! });
    let auth = new AuthenticationInformation();
    auth.key = derivedKey.toString('base64');
    user.auth = auth;
    await dataSource.getRepository(User).save(user);
    res.status(200).cookie('accessToken', generateAccessToken({ userId: user.id }), { httpOnly: true }).send();
};
