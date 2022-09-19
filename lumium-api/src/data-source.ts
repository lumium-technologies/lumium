import 'reflect-metadata';
import { DataSource } from 'typeorm';

import dotenv from 'dotenv';

if (process.env.REVIEW_APP && process.env.NODE_ENV === 'production') {
    dotenv.config({path: process.cwd() + '/.env.review'});
} else if (process.env.NODE_TEST) {
    dotenv.config({path: process.cwd() + '/.env.test'})
} else if (process.env.NODE_ENV !== 'production') {
    dotenv.config({path: process.cwd() + '/.env.development'});
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
