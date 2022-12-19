import { app } from "../../../app";
import supertest from 'supertest';

describe('user info', () => {
    test('returns all user data', async () => {
        const cookies = await auth();
        let resp = await supertest(app).get("/v1/secure/user").set('cookie', cookies).send();
        expect(resp.statusCode).toBe(200);
        expect(resp.body.id).toBeDefined();
        resp = await supertest(app).delete("/v1/secure/user").set('cookie', cookies).send();
        expect(resp.statusCode).toBe(200);
    });
    test('throws 401', async () => {
        let resp = await supertest(app).get("/v1/secure/user").send();
        expect(resp.statusCode).toBe(401);
        resp = await supertest(app).delete("/v1/secure/user").send();
        expect(resp.statusCode).toBe(401);
    })
});
