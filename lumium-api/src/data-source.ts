import 'reflect-metadata';
import { DataSource, createConnection, getConnection } from 'typeorm';

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
    'synchronize': process.env.DB_SYNC && true || false,
    'dropSchema': process.env.DB_DROP && true || false,
    'logging': true,
    'entities': [
        'src/entity/**/*.ts'
    ],
    'migrations': [
        'src/migration/**/*.ts'
    ]
});

export const connection = {
    async create() {
        await dataSource.initialize();
    },

    async close() {
        await dataSource.destroy();
    },

    async clear() {
        const entities = dataSource.entityMetadatas;

        entities.forEach(async (entity) => {
            const repository = dataSource.getRepository(entity.name);
            await repository.query(`DELETE FROM ${entity.tableName}`);
        });
    },
};
