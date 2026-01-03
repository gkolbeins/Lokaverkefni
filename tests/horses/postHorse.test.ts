import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { createIsNumber } from "../helpers/isNumber";
//hér nota ég sama test og í postStallions en breyti í horse

describe("POST /horses", () => {
  let token: string;

  //fimleikar til að búa til einstakt netfang fyrir hvert test
  const testEmail = `horse-create-${Date.now()}@test.is`;
  beforeAll(async () => {
    //skrá notanda
    await request(app).post("/auth/register").send({
      name: "Horse User",
      email: testEmail,
      password: "password",
    });

    //logga inn
    const loginRes = await request(app).post("/auth/login").send({
      email: testEmail,
      password: "password",
    });

    token = loginRes.body.token;
  });

  it("should create a horse and return 201", async () => {
    const response = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Hestur",
        is_number: createIsNumber({ gender: 1 }),
        chip_id: "352098100000002",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Test Hestur");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).post("/horses").send({
      name: "Unauthorized Hestur",
    });

    expect(response.status).toBe(401);
  });

  it("should return 400 if name is missing", async () => {
    const response = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        is_number: createIsNumber({ gender: 1 }),
      });

    expect(response.status).toBe(400);
  });
});
