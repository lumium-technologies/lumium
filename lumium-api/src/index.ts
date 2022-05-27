import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { dataSource} from './data-source';
import { v1pub } from './routes';
import { v1sec } from './routes';

import dotenv from 'dotenv';

import supertokens from 'supertokens-node';
import {middleware} from 'supertokens-node/framework/express';
import Session from 'supertokens-node/recipe/session';
import { verifySession } from 'supertokens-node/recipe/session/framework/express';

import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import { errorHandler } from 'supertokens-node/framework/express';

import expressJSDocSwagger from 'express-jsdoc-swagger';

if (process.env.REVIEW_APP && process.env.NODE_ENV === 'production') {
    dotenv.config({path: process.cwd() + '/.env'});
} else if (process.env.NODE_ENV !== 'production') {
    dotenv.config({path: process.cwd() + '/.env.development'});
}

const initDataSource = async () => {
    try {
        await dataSource.initialize();
    } catch(e) {
        console.error(e);
    }
};
initDataSource();
const app = express();
const PORT = process.env.PORT || 5000;

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
            url: 'https://api.lumium.space/{Base Path}',
            description: 'Production API server',
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
            url: 'https://lumium-api-pr-{Pull Request}.herokuapp.com/{Base Path}',
            description: 'Pull request API server',
            variables: {
                'Pull Request': {
                    default: '0',
                    description: 'this value is assigned by the service provider, in this example `gigantic-server.com`',
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

const herokuPrNumber: string = process.env.HEROKU_PR_NUMBER || '';
const primarySpaceHost = process.env.REVIEW_APP && process.env.SPACE_HOST?.replace('{PR_NUMBER}', herokuPrNumber) || process.env.SPACE_HOST;

const spaceHosts: (string | any)[] = [primarySpaceHost, process.env.SPACE_HOST_HEROKU];
const apiHosts: (string | any)[] = [process.env.API_HOST, process.env.API_HOST_HEROKU];
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

app.use(cors({
    origin: [...spaceHosts, ...apiHosts],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
}));

app.use('/v1/', v1pub);

app.use(middleware());

app.use('/v1/secure/', verifySession(), v1sec);

app.get('/', (req, res)  => {
    res.redirect('/docs/');
});

app.use(errorHandler());

app.listen(PORT, () => {
    console.log(`Now serving API on http://localhost:${PORT}`);
});
