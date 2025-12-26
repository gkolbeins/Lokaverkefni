import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { pool } from "../../src/config/db";

describe.sequential("GET /horses", () => {
let tokenA: string;
let tokenB: string;

beforeAll(async () => {
  await pool.query("DELETE FROM horses");
  await pool.query("DELETE FROM users");

  //notandi a
  await request(app).post("/auth/register").send({
    name: "User A",
    email: "a@test.is",
    password: "password",
  });

  const loginA = await request(app).post("/auth/login").send({
    email: "a@test.is",
    password: "password",
  });

  tokenA = loginA.body.token;

  //notandi b
  await request(app).post("/auth/register").send({
    name: "User B",
    email: "b@test.is",
    password: "password",
  });

  const loginB = await request(app).post("/auth/login").send({
    email: "b@test.is",
    password: "password",
  });

  tokenB = loginB.body.token;

  //hestar frá notanda a
  await request(app)
    .post("/horses")
    .set("Authorization", `Bearer ${tokenA}`)
    .send({ name: "Hryssa A1" });

  await request(app)
    .post("/horses")
    .set("Authorization", `Bearer ${tokenA}`)
    .send({ name: "Hryssa A2" });

  //hestar frá notanda b
  await request(app)
    .post("/horses")
    .set("Authorization", `Bearer ${tokenB}`)
    .send({ name: "Hryssa B1" });
});

describe("GET /horses", () => {
  it("should return only horses belonging to the logged-in user", async () => {
    const res = await request(app)
      .get("/horses")
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);

    res.body.forEach((horse: any) => {
      expect(horse.name.startsWith("Hryssa A")).toBe(true);
    });
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/horses");
    expect(res.status).toBe(401);
  });
});
});
