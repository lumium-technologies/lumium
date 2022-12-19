import jwt from 'jsonwebtoken';
import { dataSource } from './data-source';
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
    const token = req.cookies['accessToken'];

    if (token == null) {
        return res.status(401).send();
    }

    jwt.verify(token, process.env.TOKEN_SECRET as string, async (err: any, decoded: any) => {
        if (err) {
            console.error(err);
            return res.status(401).send()
        }
        let blacklisted = await dataSource.getRepository(BlacklistedToken).count({ where: { user: { id: decoded.userId }, token: token } });
        if (blacklisted != 0) {
            return res.status(401).send();
        }
        req.user = decoded.userId;
        req.token = token;
        next();
    });
};
