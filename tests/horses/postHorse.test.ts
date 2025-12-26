import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { pool } from "../../src/config/db";

describe.sequential("POST /horses", () => {
let token: string;

beforeAll(async () => {
  //skrá notanda
  await request(app).post("/auth/register").send({
    name: "Test User",
    email: "horse-create@test.is",
    password: "password123",
  });

  //innskráning
  const loginRes = await request(app).post("/auth/login").send({
    email: "horse-create@test.is",
    password: "password123",
  });

  token = loginRes.body.token;
});

afterAll(async () => {
  //hreinsa test-gögn
  await pool.query("DELETE FROM horses");
  await pool.query("DELETE FROM users WHERE email = $1", [
    "horse-create@test.is",
  ]);
  await pool.end();
});

describe("POST /horses", () => {
  it("should create a horse and return 201", async () => {
    const response = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Hryssa",
        is_number: "IS2019123456",
        chip_id: "352098100000001",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Test Hryssa");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).post("/horses").send({
      name: "Unauthorized Hryssa",
    });

    expect(response.status).toBe(401);
  });

  it("should return 400 if name is missing", async () => {
    const response = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        is_number: "IS2019123456",
      });

    expect(response.status).toBe(400);
  });
});
});