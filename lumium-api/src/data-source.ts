import 'reflect-metadata';
import { DataSource } from 'typeorm';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

if (process.env.REVIEW_APP && process.env.NODE_ENV === 'production') {
    dotenvExpand.expand(dotenv.config({path: process.cwd() + '/.env.review'}));
} else if (process.env.NODE_TEST) {
    dotenvExpand.expand(dotenv.config({path: process.cwd() + '/.env.test'}));
} else if (process.env.NODE_ENV !== 'production') {
    dotenvExpand.expand(dotenv.config({path: process.cwd() + '/.env.development'}));
}

export const dataSource = new DataSource({
    'type': 'postgres',
    'url': process.env.DATABASE_URL,
    'synchronize': true,
    'logging': true,
    'entities': [
    ],
    'migrations': [
        'migration/**/*.ts'
    ]
});
