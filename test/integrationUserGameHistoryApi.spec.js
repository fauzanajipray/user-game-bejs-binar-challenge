const { UserGame, UserGameBiodata, sequelize } = require("../models");
const { QueryTypes } = require("sequelize");
require("../controllers/api/userGameController");
const request = require("supertest");
const app = require("../app");

let id = 1;
let dataUser = {
    "username": "paujan.pray",
    "password": "berdoa",
    "email": "fauzanpray@gmail.com",
    "first_name": "Fauzan",
    "last_name": "aji pray",
    "address": "jl. Kalibata",
}

let idHistory = 1;

describe('UserGame History API Integration Testing', () => {
    beforeAll(async () => {
        try {
            let res = await UserGame.create({
                username: dataUser.username,
                password: dataUser.password,
            })
            id = res.dataValues.id;
    
            await UserGameBiodata.create({
                first_name: dataUser.first_name,
                last_name: dataUser.last_name,
                address: dataUser.address,
                email: dataUser.email,
                user_id: id,
            })
        } catch (error) {
            console.log(error);
        }
    })

    afterAll(async () => {
        try {
            await UserGame.destroy({where: { id } })
            await sequelize.query("TRUNCET user_games, user_game_biodata, user_game_histories RESTART IDENTITY;", 
          { type: QueryTypes.RAW });
        } catch (error) {
            console.log(error);
        }
    })

    test('POST /api/history - Should Fail Create User Game History (Bad Request)', async () => {
        const { body, statusCode } = await request(app).post(`/api/history`).send(dataUser);
        expect(statusCode).toEqual(400);
        expect(body.message).toEqual("Bad Request");
    })

    test('POST /api/history - Should Fail Create User Game History (Foreign Key Constraint Error)', async () => {
        const { body, statusCode } = await request(app).post(`/api/history`).send({
            user_game_id: 999999,
            score: 10,
            time_played: 120000,
        });
        expect(statusCode).toEqual(400);
        expect(body.message).toEqual("Foreign Key Constraint Error");
    })

    test('POST /api/history - Should Fail Create User Game History (Invalid Data Type)', async () => {
        const { body, statusCode } = await request(app).post(`/api/history`).send({
            user_game_id: "1",
            score: "lorem",
            time_played: "lorem",
        });
        expect(statusCode).toEqual(400);
        expect(body.message).toEqual("Invalid Data Type");
    })

    test('POST /api/history - Should Success Create User Game History', async () => {
        const { body, statusCode } = await request(app).post(`/api/history`).send({
            user_game_id: id,
            score: 10,
            time_played: 120000,
        });
        idHistory = body.data.id
        expect(statusCode).toEqual(201);
        expect(body.message).toEqual("Success");
    })

    test('GET /api/history - Should Success Get All History', async () => {
        const { body, statusCode } = await request(app).get(`/api/history`);
        expect(statusCode).toEqual(200);
        expect(body.message).toEqual("Success");
        expect(body.data.length).toBeGreaterThan(0);
    })

    test('GET /api/history/:id - Should Success Get History By Id', async () => {
        const { body, statusCode } = await request(app).get(`/api/history/${idHistory}`);
        expect(statusCode).toEqual(200);
        expect(body.message).toEqual("Success");
    })

    test('GET /api/history/:id - Should Fail Get History By Id (Not Found)', async () => {
        const { body, statusCode } = await request(app).get(`/api/history/999999`);
        expect(statusCode).toEqual(404);
        expect(body.message).toEqual("User Game History not found");
    })

    test('GET /api/history/:id - Should Fail Get History By Id (Invalid Data Type)', async () => {
        const { body, statusCode } = await request(app).get(`/api/history/lorem`);
        expect(statusCode).toEqual(400);
        expect(body.message).toEqual("Invalid Data Type");
    })

    test('PUT /api/history/:id - Should Fail Update History (Not Found)', async () => {
        const { body, statusCode } = await request(app).put(`/api/history/99999`).send({
            user_game_id: id,
            score: 10,
            time_played: 120000,
        });
        expect(statusCode).toEqual(404);
        expect(body.message).toEqual("User Game History not found");
    })

    test('PUT /api/history/:id - Should Fail Update History (Invalid Data Type)', async () => {
        const { body, statusCode } = await request(app).put(`/api/history/lorem`).send({
            user_game_id: id,
            score: 10,
            time_played: 120000,
        });
        expect(statusCode).toEqual(400);
        expect(body.message).toEqual("Invalid Data Type");
    })

    test('PUT /api/history/:id - Should Fail Update History (Foreign Key Constraint Error)', async () => {
        const { body, statusCode } = await request(app).put(`/api/history/${idHistory}`).send({
            user_game_id: 99999,
            score: 10,
            time_played: 120000,
        });
        expect(statusCode).toEqual(400);
        expect(body.message).toEqual("Foreign Key Constraint Error");
    })

    test('PUT /api/history/:id - Should Success Update History', async () => {
        const { body, statusCode } = await request(app).put(`/api/history/${idHistory}`).send({
            user_game_id: id,
            score: 100,
            time_played: 3000000,
        });
        expect(statusCode).toEqual(200);
        expect(body.message).toEqual("Success");
    })

    test('DELETE /api/history/:id - Should Fail Delete History (Not Found)', async () => {
        const { body, statusCode } = await request(app).delete(`/api/history/99999`);
        expect(statusCode).toEqual(404);
        expect(body.message).toEqual("User Game History not found");
    })

    test('DELETE /api/history/:id - Should Fail Delete History (Invalid Data Type)', async () => {
        const { body, statusCode } = await request(app).delete(`/api/history/lorem`);
        expect(statusCode).toEqual(400);
        expect(body.message).toEqual("Invalid Data Type");
    })

    test('DELETE /api/history/:id - Should Success Delete History', async () => {
        const { body, statusCode } = await request(app).delete(`/api/history/${idHistory}`);
        expect(statusCode).toEqual(200);
        expect(body.message).toEqual("User Game History deleted");
    })
    
})