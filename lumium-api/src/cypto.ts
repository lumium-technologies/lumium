import jwt from 'jsonwebtoken';

declare module "express-serve-static-core" {
    interface Request {
        user?: string;
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

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
        if (err) {
            console.log(err);
            return res.status(401).send();
        }
        req.user = user.userId;
        next();
    });
};
