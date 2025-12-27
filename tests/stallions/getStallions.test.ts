import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { pool } from "../../src/config/db";

describe.sequential("GET /stallions", () => {
let tokenA: string;
let tokenB: string;
const emailA = `stallion-a-${Date.now()}@test.is`;
const emailB = `stallion-b-${Date.now()}@test.is`;

beforeAll(async () => {
  await pool.query("DELETE FROM stallions");

  //notandi a
  await request(app).post("/auth/register").send({
    name: "User A",
    email: emailA,
    password: "password",
  });

  const loginA = await request(app).post("/auth/login").send({
    email: emailA,
    password: "password",
  });

  tokenA = loginA.body.token;

  //notandi b
  await request(app).post("/auth/register").send({
    name: "User B",
    email: emailB,
    password: "password",
  });

  const loginB = await request(app).post("/auth/login").send({
    email: emailB,
    password: "password",
  });

  tokenB = loginB.body.token;

  //hestar frá notanda a
  await request(app)
    .post("/stallions")
    .set("Authorization", `Bearer ${tokenA}`)
    .send({ name: "Hestur A1" });

  await request(app)
    .post("/stallions")
    .set("Authorization", `Bearer ${tokenA}`)
    .send({ name: "Hestur A2" });

  //hestar frá notanda b
  await request(app)
    .post("/stallions")
    .set("Authorization", `Bearer ${tokenB}`)
    .send({ name: "Hestur B1" });
});

describe("GET /stallions", () => {
  it("should return only stallions belonging to the logged-in user", async () => {
    const res = await request(app)
      .get("/stallions")
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);

    res.body.forEach((stallion: any) => {
      expect(stallion.name.startsWith("Hestur A")).toBe(true);
    });
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/stallions");
    expect(res.status).toBe(401);
  });
});
});
