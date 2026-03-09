const request = require("supertest");
const app = require("./app");

//champs manquants
it("POST/signUp -champs manquant", async () => {
  const res = await request(app).post("/parents/signUp").send({
    email: "test@gmail.com",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe("Missing or empty fields");
});

//test signUp - création utilisateur
it("POST/parents/signUp", async () => {
  const res = await request(app).post("/parents/signUp").send({
    email: "test@gmail.com",
    password: "test",
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.token).toBeDefined();
});
