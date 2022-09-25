import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { connection, dataSource } from './data-source';
import { v1pub } from './routes';
import { v1sec } from './routes';

import supertokens from 'supertokens-node';
import { middleware } from 'supertokens-node/framework/express';
import Session from 'supertokens-node/recipe/session';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import { errorHandler } from 'supertokens-node/framework/express';

import expressJSDocSwagger from 'express-jsdoc-swagger';

const initDataSource = async () => {
    try {
        await connection.create();
    } catch(e) {
        console.error(e);
    }
};

if (!process.env.NODE_TEST) {
    initDataSource();
}
export const app = express();

if (process.env.NODE_ENV === 'production' &&
    process.env.PRODUCTION) { // only enforce connections to the production server, everything non-production is only guarded through Cloudflare (insecure between CF and Heroku, matter of development infrastructure cost), this serves to encrypt the production traffic between Heroku and Cloudflare
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
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
        {
            url: 'http://localhost:5000/{Base Path}',
            description: 'Local API server',
            variables: {
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
            in: 'sAccessToken'
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

const connectionUri: string = process.env.SUPERTOKENS_CONNECTION_URI || '';
const apiKey: string  = process.env.SUPERTOKENS_API_KEY || '';

const spaceHosts: (string)[] = [process.env.SPACE_HOST, process.env.SPACE_HOST_HEROKU];
const apiHosts: (string)[] = [process.env.API_HOST, process.env.API_HOST_HEROKU];
supertokens.init({
    framework: 'express',
    supertokens: {
        connectionURI: connectionUri,
        apiKey: apiKey
    },
    appInfo: {
        appName: 'lumium-api',
        apiDomain: apiHosts[0],
        websiteDomain: spaceHosts[0],
        apiBasePath: '/v1/auth',
        websiteBasePath: '/auth'
    },
    recipeList: [
        ThirdPartyEmailPassword.init({}),
        Session.init({})
    ]
});

const windowMs: number = Number(process.env.EXPRESS_RATE_LIMIT_WINDOW_MILLISECONDS) || 1000;
const limit: number = Number(process.env.EXPRESS_RATE_LIMIT) || 5;

const limiter = rateLimit({
    windowMs: windowMs,
    max: limit,
    message: 'API rate limit hit, please try again in a short moment',
});

app.use(limiter);

let cors_config = {
    origin: [...spaceHosts, ...apiHosts],
    credentials: true,
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()]
};

app.use(cors(cors_config));

app.use('/v1/', v1pub);

app.use(middleware());

app.use('/v1/secure/', verifySession(), v1sec);

app.get('/', (req, res)  => {
    res.redirect('/docs/');
});

app.use(errorHandler());
