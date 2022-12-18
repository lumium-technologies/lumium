import jwt from 'jsonwebtoken';
import { dataSource } from './data-source';
import { BlacklistedToken } from './entity/BlacklistedToken';

declare module "express-serve-static-core" {
    interface Request {
        user?: string;
        token?: string;
    }
}

export const generateAccessToken = async (data: any) => {
    return jwt.sign(data, process.env.TOKEN_SECRET, { expiresIn: "1800s" });
};

export const authenticateAccessToken = async (req, res, next) => {
    const token = req.cookies['accessToken'];

    if (token == null) {
        return res.status(401).send();
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);
    } catch (e) {
        console.log(e);
        return res.status(401).send();
    }
    let blacklisted = await dataSource.getRepository(BlacklistedToken).findOne({ where: { user: decoded.userId, token: token } });
    if (blacklisted) {
        return res.status(401).send();
    }
    req.user = decoded.userId;
    req.token = token;
    next();
};
