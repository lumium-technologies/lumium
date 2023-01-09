import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connection } from './data-source';
import { v1pub } from './routes';
import { v1sec } from './routes';

import expressJSDocSwagger from 'express-jsdoc-swagger';
import { SECURE, V1 } from '../routes/api/v1';
import { authenticateAccessToken } from './crypto';

const initDataSource = async () => {
    try {
        await connection.create();
    } catch (e) {
        console.error(e);
    }
};

if (!process.env.NODE_JEST) {
    initDataSource();
}
export const app = express();

if (process.env.NODE_ENV === 'production' &&
    process.env.PRODUCTION) {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`, 301);
        } else {
            next();
        }
    });
}

if (!process.env.NODE_JEST) {
    app.use((req, res, next) => {
        if (!process.env.API_HOST?.includes(req.header('host'))) {
            res.redirect(`${process.env.API_HOST!}${req.url}`, 301);
        } else {
            next();
        }
    });
}

const options = {
    info: {
        version: '1.0.0',
        title: 'Lumium API',
        license: {
            name: 'GPLV3',
            url: 'https://github.com/d3psi/lumium',
        },
        description: 'API description',
        contact: {
            name: 'Cedric Schwyter',
            email: 'cedricschwyter@bluewin.ch',
        },
    },
    servers: [
        {
            url: 'http://localhost:5000/{Base Path}',
            description: 'Local API server',
            variables: {
                'Base Path': {
                    default: 'v1',
                },
            },
        },
        {
            url: 'https://api.staging.lumium.space/{Base Path}',
            description: 'Staging API server',
            variables: {
                'Base Path': {
                    default: 'v1',
                },
            },
        },
        {
            url: 'https://pr-{Pull Request}.api.review.lumium.space/{Base Path}',
            description: 'Pull request API server (Cloudflare DNS)',
            variables: {
                'Pull Request': {
                    default: '0',
                },
                'Base Path': {
                    default: 'v1',
                },
            },
        },
        {
            url: 'https://lumium-api-pr-{Pull Request}.herokuapp.com/{Base Path}',
            description: 'Pull request API server (Heroku DNS)',
            variables: {
                'Pull Request': {
                    default: '0',
                },
                'Base Path': {
                    default: 'v1',
                },
            },
        },
    ],
    security: {
        JWTAuth: {
            type: 'apiKey',
            scheme: 'cookie',
            name: 'test',
            in: 'accessToken'
        },
    },
    filesPattern: './routes/**/*.ts',
    baseDir: __dirname,
    swaggerUIPath: '/docs',
    exposeSwaggerUI: true,
    exposeApiDocs: false,
    notRequiredAsNullable: false,
};

expressJSDocSwagger(app)(options);

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());

const spaceHosts: (string)[] = [process.env.SPACE_HOST, process.env.SPACE_HOST_HEROKU];
const apiHosts: (string)[] = [process.env.API_HOST, process.env.API_HOST_HEROKU];

const windowMs: number = Number(process.env.EXPRESS_RATE_LIMIT_WINDOW_MILLISECONDS) || 1000;
const limit: number = Number(process.env.EXPRESS_RATE_LIMIT) || 50;

const limiter = rateLimit({
    windowMs: windowMs,
    max: limit,
    message: 'API rate limit hit, please try again in a short moment',
});

if (!process.env.NODE_JEST) {
    app.use(limiter);
}

let cors_config = {
    origin: [...spaceHosts, ...apiHosts],
    credentials: true,
};

app.use(cors(cors_config));

app.use(V1, v1pub);

app.use(V1 + SECURE, authenticateAccessToken, v1sec);

app.get('/', (req, res) => {
    res.redirect('/docs/');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500);
    res.render('render', { error: err });
});
