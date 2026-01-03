import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { pool } from "../../src/config/db";
import { createIsNumber } from "../helpers/isNumber";

describe.sequential("POST /stallions", () => {
let token: string;
const testEmail = `stallion-create-${Date.now()}@test.is`;

beforeAll(async () => {
  await pool.query(`
    TRUNCATE TABLE stallions,
    users
    RESTART IDENTITY
    CASCADE`);

  await request(app).post("/auth/register").send({
    name: "Stallion User",
    email: "stallion@test.is",
    password: "password",
  });

  const loginRes = await request(app).post("/auth/login").send({
    email: "stallion@test.is",
    password: "password",
  });

  token = loginRes.body.token;
});


afterAll(async () => {
  //hreinsa test-gögn
  await pool.query("DELETE FROM stallions");
  await pool.query("DELETE FROM users WHERE email = $1", [testEmail]);
});

describe("POST /stallions", () => {
  it("should create a stallion and return 201", async () => {
    const response = await request(app)
      .post("/stallions")
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
    const response = await request(app).post("/stallions").send({
      name: "Unauthorized Hestur",
    });

    expect(response.status).toBe(401);
  });

  it("should return 400 if name is missing", async () => {
    const response = await request(app)
      .post("/stallions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        is_number: createIsNumber({ gender: 1 }),
      });

    expect(response.status).toBe(400);
  });
});
});