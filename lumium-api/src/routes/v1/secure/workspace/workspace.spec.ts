import { app } from "../../../../app";
import supertest from 'supertest';
import { E2EKeyCreateDTO, E2EKeyVariantCreateDTO } from "../../../../../types";
import cryptojs from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';

describe('user info', () => {
    jest.setTimeout(60000);
    test('creates workspace with keys', async () => {
        const cookies = await auth();
        let keyString = uuidv4();
        let passwords = [];
        for (let i = 0; i < 10; i++) {
            passwords.push(uuidv4());
        }
        let activatorPlaintext = uuidv4();
        let values: string[] = passwords.map((t) => cryptojs.AES.encrypt(keyString, t).ciphertext.toString());
        let activators: string[] = passwords.map((t) => cryptojs.AES.encrypt(activatorPlaintext, keyString).ciphertext.toString());
        let keys: E2EKeyVariantCreateDTO[] = [];
        for (let i = 0; i < passwords.length; i++) {
            keys.push({
                activator: activators[i],
                value: values[i]
            });
        }
        let key: E2EKeyCreateDTO = { activator: activatorPlaintext, keys };
        let resp = await supertest(app).post('/v1/secure/workspace').set('cookie', cookies).send(key);
        expect(resp.statusCode).toBe(200);
        resp = await supertest(app).delete("/v1/secure/user").set('cookie', cookies).send();
        expect(resp.statusCode).toBe(200);
    });
    test('throws 401', async () => {
        let resp = await supertest(app).post("/v1/secure/workspace").send();
        expect(resp.statusCode).toBe(401);
    });
});
