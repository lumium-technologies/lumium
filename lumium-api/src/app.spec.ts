import { app } from "./app";
import supertest from 'supertest';
import { randomUUID } from "crypto";

const auth = async () => {
    const response = await supertest(app).post("/v1/auth/signup").send({
        formFields: [
            {
                id: "email",
                value: randomUUID() + '@example.com'
            },
            {
                id: "password",
                value: randomUUID()
            }
        ]
    });
    return response.headers['set-cookie'];
}

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

describe('ping', () => {
    test('returns pong', async () => {
        const response = await supertest(app).get("/v1/ping").send();
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("pong");
    });
});
