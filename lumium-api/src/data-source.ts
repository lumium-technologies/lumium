import 'reflect-metadata';
import { DataSource } from 'typeorm';

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
