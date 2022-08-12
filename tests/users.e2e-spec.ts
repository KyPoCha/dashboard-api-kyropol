import {App} from "../src/app";
import {boot} from "../src/main";
import request from "supertest";

let application: App;

beforeAll(async ()=>{
    const { app } = await boot;
    application = app;
});

describe("Users e2e", ()=>{
   it("Register - error", async ()=>{
       const res = await request(application.app).
       post('/users/register').
       send(
           {email: "a@a.com", password: "1"}
       );
       expect(res.statusCode).toBe(422);
   });

    it("Login - error 1", async ()=>{
        const res = await request(application.app).
        post('/users/register').
        send(
            {email: "a3@a.com", password: "asdawea"}
        );
        expect(res.body?.jwt).toBeUndefined();
    });

    it("Login - error 2", async ()=>{
        const res = await request(application.app).
        post('/users/login').
        send(
            {email: "a3@a.com", password: "1"}
        );
        expect(res.statusCode).toBe(401);
    });

    it("Info - error 1", async ()=>{
        const login = await request(application.app).
        post('/users/login').
        send(
            {email: "a3@a.com", password: "asdawea"}
        );
        const res = await request(application.app).
        get('/users/info').
        set("Authorization",`Bearer ${login.body.jwt}`)
        expect(res.body?.email).not.toBe("a3@a.com");
    });

    it("Info - error 2", async ()=>{
        const res = await request(application.app).
        get('/users/info').
        set("Authorization",`Bearer 1`)
        expect(res.statusCode).toBe(401);
    });
});

afterAll(()=>{
    application.close();
})