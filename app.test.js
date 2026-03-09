const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");

require("./models/connection");
require("dotenv").config();

const parentRouter = require("./routes/parents");

const app = express();
app.use(express.json());
app.use("/parents", parentRouter);

beforeAll(async () => {
  await mongoose.connect(process.env.CONNECTION_STRING);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /parents/signUp", () => {
  it("SignUp fonctionne", async () => {
    const response = await request(app).post("/parents/signUp").send({
      email: "jest@test.fr",
      password: "123456",
    });

    expect(response.body.result).toBe(true);
    expect(response.body.token).toBeDefined();
  });
});
