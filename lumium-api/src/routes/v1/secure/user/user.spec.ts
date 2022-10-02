import { app } from "../../../../app";
import supertest from 'supertest';

describe('user info', () => {
    jest.setTimeout(60000);
    test('returns all user data', async () => {
        const cookies = await auth();
        let resp = await supertest(app).get("/v1/secure/user").set('cookie', cookies).send();
        expect(resp.statusCode).toBe(200);
        expect(resp.body.id).toBeDefined();
        resp = await supertest(app).delete("/v1/secure/user").set('cookie', cookies).send();
        expect(resp.statusCode).toBe(200);
    });
});
