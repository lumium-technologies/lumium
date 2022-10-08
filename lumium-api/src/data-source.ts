import 'reflect-metadata';
import { DataSource } from 'typeorm';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { AuditEntry, AuditEntryLevel } from './entity/Audit';
import { ConnectionString } from "connection-string";

if (process.env.REVIEW_APP && process.env.NODE_ENV === 'production') {
    dotenvExpand.expand(dotenv.config({path: process.cwd() + '/.env.review'}));
} else if (process.env.NODE_TEST) {
    dotenvExpand.expand(dotenv.config({path: process.cwd() + '/.env.test'}));
} else if (process.env.NODE_ENV !== 'production') {
    dotenvExpand.expand(dotenv.config({path: process.cwd() + '/.env.development'}));
}

const connectionObject = process.env.REDIS_URL ? new ConnectionString(process.env.REDIS_URL) : null;

console.log(JSON.stringify(connectionObject));

export const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: process.env.DB_SYNC && true || false,
    dropSchema: process.env.DB_DROP && true || false,
    logging: true,
    entities: [
        'src/entity/**/*.ts'
    ],
    migrations: [
        'src/migration/**/*.ts'
    ],
    cache: {
        type: 'ioredis',
        options: connectionObject && {
            host: connectionObject.host,
            user: connectionObject.user,
            password: connectionObject.password,
            port: connectionObject.port
        },
        alwaysEnabled: true,
        duration: 3600000
    }
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

export const audit = async (entry: AuditEntry) => {
    if (entry.detail) {
        console.log(`AUDIT [${entry.level}] [${entry.user?.id!}] [${entry.type}]: ${entry.detail}`);
    } else {
        console.log(`AUDIT [${entry.level}] [${entry.user?.id!}] [${entry.type}]`);
    }
    await dataSource.getRepository(AuditEntry).save(entry);
};

export const verbose = async (entry: AuditEntry) => {
    await audit({...entry, level: AuditEntryLevel.VERBOSE});
};

export const debug = async (entry: AuditEntry) => {
    await audit({...entry, level: AuditEntryLevel.DEBUG});
};

export const info = async (entry: AuditEntry) => {
    await audit({...entry, level: AuditEntryLevel.INFO});
};

export const warn = async (entry: AuditEntry) => {
    await audit({...entry, level: AuditEntryLevel.WARNING});
};

export const error = async (entry: AuditEntry) => {
    await audit({...entry, level: AuditEntryLevel.ERROR});
};

export const fatal = async (entry: AuditEntry) => {
    await audit({...entry, level: AuditEntryLevel.FATAL});
};
