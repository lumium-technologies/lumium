import express from 'express';
import { UserAuthDTO } from "../../types/api/v1/dto/request";
import { dataSource } from '../data-source';
import { User } from '../entity/User';
import crypto from 'crypto';
import { generateAccessToken } from '../crypto';
import { Email } from '../entity/Email';
import { AuthenticationInformation } from '../entity/AuthenticationInformation';
import { BlacklistedToken } from '../entity/BlacklistedToken';
import jwt from 'jsonwebtoken';
import { LessThan } from 'typeorm';
import { ReasonDTO } from '../../types';

const peppers =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const signIn = async (req: express.Request<UserAuthDTO>, res: express.Response<null | ReasonDTO>) => {
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
        return res.status(401).send({ status: 'EMAIL_DOES_NOT_EXIST', reason: 'email does not exist' });
    }
    let expiredTokens = await dataSource.getRepository(BlacklistedToken).find({
        where: {
            user: { id: user.id },
            expires: LessThan(Date.now())
        }
    });
    await dataSource.getRepository(BlacklistedToken).remove(expiredTokens);
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
            return res.status(200).cookie('accessToken', generateAccessToken({ userId: user.id }), { httpOnly: true }).send();
        }
    });
    return res.status(401).send({ status: 'INVALID_CREDENTIALS', reason: 'credentials were invalid' });
};

export const signUp = async (req: express.Request<UserAuthDTO>, res: express.Response<null | ReasonDTO>) => {
    let exists = await dataSource.getRepository(Email).count({ where: { email: req.body.email } }) != 0;
    if (exists) {
        return res.status(401).send({ status: "EMAIL_ALREADY_EXISTS", reason: "this email already exists" });
    }
    const pepper = peppers[Math.floor(Math.random() * 52)];
    const derivedKey = crypto.pbkdf2Sync(
        Buffer.from(req.body.password + pepper, 'utf8'),
        Buffer.from(process.env.SALT, 'base64'),
        100000,
        64,
        'sha512'
    );
    let user = await dataSource.getRepository(User).save({});
    await dataSource.getRepository(Email).save({ user, primary: true, email: req.body.email });
    let auth = new AuthenticationInformation();
    auth.key = derivedKey.toString('base64');
    user.auth = auth;
    await dataSource.getRepository(User).save(user);
    return res.status(200).cookie('accessToken', generateAccessToken({ userId: user.id }), { httpOnly: true }).send();
};

export const signOut = async (req: express.Request, res: express.Response) => {
    const { exp } = jwt.decode(req.token) as {
        exp: number;
    };
    const expTime = exp * 1000;
    await dataSource.getRepository(BlacklistedToken).save({ user: { id: req.user! }, token: req.token!, expiresAfter: expTime });
    return res.status(200).cookie('accessToken', '', { expires: new Date(1970, 1, 1) }); // yes, this is the spec-defined way of deleting a cookie on the client, not joking
};
