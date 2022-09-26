import { connection } from '../src/data-source';

beforeAll(async () => {
    await connection.create();
});

afterEach(async () => {
    await connection.clear();
})

afterAll(async () => {
    await connection.close();
})
