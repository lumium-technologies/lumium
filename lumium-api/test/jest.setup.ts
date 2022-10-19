import { connection } from '../src/data-source';
import { app } from "../src/app";
import supertest from 'supertest';
import { randomUUID } from "crypto";

beforeAll(async () => {
    await connection.create();
});

afterAll(async () => {
    await connection.close();
})

global.auth = async () => {
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
