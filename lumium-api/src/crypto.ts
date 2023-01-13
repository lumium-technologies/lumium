import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_COOKIE } from '../routes/constants';
import { dataSource, error } from './data-source';
import { AuditEntryEvent } from './entity/AuditEntry';
import { BlacklistedToken } from './entity/BlacklistedToken';

declare module "express-serve-static-core" {
    interface Request {
        user?: string;
        token?: string;
    }
}

export const generateAccessToken = (data: any) => {
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
};

export const authenticateAccessToken = (req, res, next) => {
    const token = req.cookies[ACCESS_TOKEN_COOKIE];

    if (token == null) {
        return res.status(401).send();
    }

    jwt.verify(token, process.env.TOKEN_SECRET as string, async (err: any, decoded: any) => {
        if (err) {
            console.error(err);
            return res.status(401).send()
        }
        let blacklisted = await dataSource.getRepository(BlacklistedToken).find({
            where: {
                user: {
                    id: decoded.userId,
                }
            },
            cache: {
                id: `blacklisted-tokens-user-${decoded.userId}`,
                milliseconds: 60 * 1000
            }
        });
        if (blacklisted?.map(t => t.token).includes(token)) {
            await error({ id: decoded.userId, type: AuditEntryEvent.FAILED_AUTH_ATTEMPT });
            return res.status(401).send();
        }
        req.user = decoded.userId;
        req.token = token;
        next();
    });
};
