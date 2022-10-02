import supertest from 'supertest';
import { app } from "../app";

describe('ping', () => {
    test('returns pong', async () => {
        const response = await supertest(app).get("/v1/ping").send();
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("pong");
    });
});
