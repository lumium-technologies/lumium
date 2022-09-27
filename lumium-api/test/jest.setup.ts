import { connection } from '../src/data-source';

beforeAll(async () => {
    await connection.create();
});

beforeEach(async () => {
    await connection.clear();
})

afterEach(async () => {
    await connection.clear();
})

afterAll(async () => {
    await connection.close();
})
