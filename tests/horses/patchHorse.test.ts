import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { pool } from "../../src/config/db";

describe.sequential("PATCH /horses/:id", () => {
let token: string;
let horseId: number;

beforeAll(async () => {
  await pool.query("DELETE FROM horses");
  await pool.query("DELETE FROM users");

  //skrá notanda
  await request(app).post("/auth/register").send({
    name: "Patch User",
    email: "patch@test.is",
    password: "password",
  });

  const loginRes = await request(app).post("/auth/login").send({
    email: "patch@test.is",
    password: "password",
  });

  token = loginRes.body.token;
});

beforeEach(async () => {
  //búa alltaf til NÝJA hryssu
  const horseRes = await request(app)
    .post("/horses")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Gamla nafnið",
      is_number: "IS2018001234",
    });

  horseId = horseRes.body.id;
});

describe("PATCH /horses/:id", () => {
  it("should update horse when owner", async () => {
    const response = await request(app)
      .patch(`/horses/${horseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Nýja nafnið",
        notes: "Uppfærðar upplýsingar",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Nýja nafnið");
    expect(response.body.notes).toBe("Uppfærðar upplýsingar");
  });

  it("should return 400 for empty body", async () => {
    const response = await request(app)
      .patch(`/horses/${horseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("should return 401 without token", async () => {
    const response = await request(app)
      .patch(`/horses/${horseId}`)
      .send({ name: "Fail" });

    expect(response.status).toBe(401);
  });

  it("should return 404 for non-existing horse", async () => {
    const response = await request(app)
      .patch("/horses/999999")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Fail" });

    expect(response.status).toBe(404);
  });
});
});
