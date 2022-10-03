import supertest from 'supertest';
import { app } from "../../../app";

describe('pong', () => {
    test('returns ping', async () => {
        const cookies = await auth();
        const response = await supertest(app).get("/v1/secure/pong").set('cookie', cookies).send();
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("ping");
    });
    test('throws 401', async () => {
        const response = await supertest(app).get("/v1/secure/pong").send();
        expect(response.statusCode).toBe(401);
    });
});
