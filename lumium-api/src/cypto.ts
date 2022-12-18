import jwt from 'jsonwebtoken';

declare module "express-serve-static-core" {
    interface Request {
        user?: string;
    }
}

export const generateAccessToken = (username: string) => {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "3600s" });
};

export const authenticateAccessToken = (req, res, next) => {
    const header = req.headers['authorization'];
    const parts = header && header.split(' ');
    const token = parts[1];

    if (token == null) {
        return res.status(401).send();
    }

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) {
            console.log(err);
            return res.status(403).send();
        }
        req.user = user;
        next();
    });
};
