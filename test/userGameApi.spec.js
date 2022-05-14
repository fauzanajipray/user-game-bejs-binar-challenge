const { UserGame, sequelize } = require("../models");
const { QueryTypes } = require("sequelize");
require("../controllers/api/userGameController");
const request = require("supertest");
const app = require("../app");

let id = 1;
let data = {
    "username": "paujan.pray",
    "password": "berdoa",
    "email": "fauzanpray@gmail.com",
    "first_name": "Fauzan",
    "last_name": "aji pray",
    "address": "jl. Kalibata",
}
let data2 = {
    "username": "paujan.pray",
    "password": "berdoa",
    "email": "fauzanpray@gmail.com",
    "first_name": "Fauzan",
    "last_name": "Goyang Dumang",
    "address": "Mars Barat 1 Blok A No.1"
};

describe("UserGame API Integration Testing", () => {

    // Positive Test 1
    test("GET /api/usergame - Should Success Get All User Games ", async () => {
        const { body, statusCode } = await request(app).get(`/api/usergame`);
        expect(statusCode).toEqual(200);
        expect(body.message).toEqual("Success");
        expect(body.data.length).toBeGreaterThan(0);
    });
    // Positive Test 2
    test("POST /api/usergame - Should Success Create User Game ", async () => {
       
        const { body, statusCode } = await request(app).post(`/api/usergame`).send(data);
        id = body.data.id;
        console.log(`id: ${id}`);
        expect(statusCode).toEqual(201);
        expect(body.message).toEqual("UserGame created");
    });
    // Positive Test 3
    test("GET /api/usergame/:id - Shoud Success Get Usergame By Id ", async () => {
        const { body, statusCode } = await request(app).get(`/api/usergame/${id}`);
        expect(statusCode).toEqual(200);
        expect(body.message).toEqual("Success");
    });
    // Positive Test 4
    test("PUT /api/usergame/:id - Should Success Update Usergame By Id ", async () => {
        const { body, statusCode } = await request(app).put(`/api/usergame/${id}`).send(data2);
        expect(statusCode).toEqual(200);
        expect(body.message).toEqual("UserGame updated");

        const { body: body2, statusCode: statusCode2 } = await request(app).get(`/api/usergame/${id}`);
        expect(statusCode2).toEqual(200);
        expect(body2.message).toEqual("Success");
        expect(body2.data.userGameBiodata.first_name).toEqual(data2.first_name);
        expect(body2.data.userGameBiodata.last_name).toEqual(data2.last_name);
        expect(body2.data.userGameBiodata.address).toEqual(data2.address);
    });

    // Negative Test 1
    test("POST /api/usergame - Should Fail Create User Game (Username already exist)", async () => {
        const { body, statusCode } = await request(app).post(`/api/usergame`).send(data);
        expect(statusCode).toEqual(400);
        expect(body.message).toEqual("Username already exist");
    });

    // Negative Test 2
    test("POST /api/usergame - Should Fail Create User Game (Validation Error) ", async () => {
        data = {
            "username": "",
            "password": "",
        }
        const { body, statusCode } = await request(app).post(`/api/usergame`).send(data);
        expect(statusCode).toEqual(400);
        expect(body.message).toEqual("Validation error: Validation notEmpty on username failed,\nValidation error: Validation notEmpty on password failed");
    });
    // Negative Test 3
    test("PUT /api/usergame/:id - Should Fail Update Usergame By Id (Validation Error)", async () => {
        let data = {
            "username": "",
            "password": "",
        };
        const { body, statusCode } = await request(app).put(`/api/usergame/${id}`).send(data);
        expect(statusCode).toEqual(400);
        expect(body.message).toEqual("Validation error: Validation notEmpty on username failed,\nValidation error: Validation notEmpty on password failed");
    });

    // Positive Test 5
    test("DELETE /api/usergame/:id - Should Success Delete Usergame By Id ", async () => {
        const { body, statusCode } = await request(app).delete(`/api/usergame/${id}`);
        expect(statusCode).toEqual(200);
        expect(body.message).toEqual("User Game deleted");
    });

    // Negative Test 4
    test("DELETE /api/usergame/:id - Should Fail Delete Usergame By Id ", async () => {
        const { body, statusCode } = await request(app).delete(`/api/usergame/${id}`);
        expect(statusCode).toEqual(404);
        expect(body.message).toEqual("User Game not found");
    });

    // Negative Test 5
    test("PUT /api/usergame/:id - Should Fail Update Usergame By Id (User Game not found)", async () => {
        const { body, statusCode } = await request(app).put(`/api/usergame/${id}`).send(data2);
        expect(statusCode).toEqual(404);
        expect(body.message).toEqual("User Game not found");
    });

    // Negative Test 6
    test("GET /api/usergame/:id - Shoud Fail Get Usergame By Id ", async () => {
        const { body, statusCode } = await request(app).get(`/api/usergame/${id}`);
        expect(statusCode).toEqual(404);
        expect(body.message).toEqual("User Game not found");
    })

    afterAll(async () => {
        await sequelize.query(`DELETE FROM user_games WHERE id = ${id}`, { type: QueryTypes.DELETE });
    });
})