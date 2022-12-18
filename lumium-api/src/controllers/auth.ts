import express from 'express';
import { UserAuthDTO } from "../../types/api/v1/dto/request";
import { dataSource } from '../data-source';
import { User } from '../entity/User';
import crypto from 'crypto';
import { generateAccessToken } from '../cypto';

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
    let keys = Buffer.from(user.auth?.variant, 'base64');
    Array.from('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ').forEach((pepper) => {
        crypto.pbkdf2(
            Buffer.from(req.body.password + pepper, 'utf8'),
            Buffer.from(process.env.SALT, 'base64'),
            100000,
            64,
            'sha512',
            (err, derivedKey) => {
                if (err) {
                    throw err;
                }
                if (keys.includes(derivedKey)) {
                    res.status(200).cookie('accessToken', generateAccessToken(user.id), { httpOnly: true }).send();
                }
            });
    });
};

export const signUp = async () => { };
