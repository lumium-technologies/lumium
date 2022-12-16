import { app } from "../../../../app";
import supertest from 'supertest';
import { E2EKeyCreateDTO, E2EKeyVariantCreateDTO } from "../../../../../types";
import cryptojs from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import { WorkspaceCreateDTO } from "../../../../../types/api/v1/dto/request/WorkspaceCreateDTO";

describe('workspaces', () => {
    test('crud for workspaces with keys', async () => {
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
                activatorNonce: "someTotallyRandomNonceInBase64",
                value: values[i],
                valueNonce: "someTotallyRandomNonceInBase64"
            });
        }
        let key: E2EKeyCreateDTO = { activator: activatorPlaintext, keys };
        let workspace: WorkspaceCreateDTO = {
            name: "test",
            key: key
        };
        let resp = await supertest(app).put('/v1/secure/workspace').set('cookie', cookies).send(workspace);
        expect(resp.body).toHaveProperty('id');
        expect(resp.body).toHaveProperty('name', "test");
        expect(resp.body).toHaveProperty('key');
        expect(resp.statusCode).toBe(200);
        resp = await supertest(app).get('/v1/secure/workspace/' + resp.body.id).set('cookie', cookies).send();
        expect(resp.body).toHaveProperty('id');
        expect(resp.body).toHaveProperty('name', "test");
        expect(resp.body).toHaveProperty('key');
        expect(resp.statusCode).toBe(200);
        resp = await supertest(app).patch('/v1/secure/workspace/' + resp.body.id).set('cookie', cookies).send({ preferences: [{ option: 'something', value: 'something' }] });
        expect(resp.body).toHaveProperty('id');
        expect(resp.body).toHaveProperty('name', "test");
        expect(resp.body).toHaveProperty('preferences');
        expect(resp.statusCode).toBe(200);
        // TODO: implement patch test correctly
        resp = await supertest(app).delete('/v1/secure/workspace/' + resp.body.id).set('cookie', cookies).send();
        expect(resp.statusCode).toBe(200);
        resp = await supertest(app).delete("/v1/secure/user").set('cookie', cookies).send();
        expect(resp.statusCode).toBe(200);
    });
    test('throws 401', async () => {
        let resp = await supertest(app).post("/v1/secure/workspace").send();
        expect(resp.statusCode).toBe(401);
    });
});
