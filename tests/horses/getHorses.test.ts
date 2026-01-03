import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import test from "node:test";

describe.sequential("GET /horses", () => {
  let tokenA: string;
  let tokenB: string;
  const testEmailA = `horse_emaila-${Date.now()}@test.is`;
  const testEmailB = `horse_emailb-${Date.now()}@test.is`;

  beforeAll(async () => {
    //notandi A
    await request(app).post("/auth/register").send({
      name: "User A",
      email: testEmailA,
      password: "password",
    });

    const loginA = await request(app).post("/auth/login").send({
      email: testEmailA,
      password: "password",
    });

    tokenA = loginA.body.token;

    //notandi B
    await request(app).post("/auth/register").send({
      name: "User B",
      email: testEmailB,
      password: "password",
    });

    const loginB = await request(app).post("/auth/login").send({
      email: testEmailB,
      password: "password",
    });

    tokenB = loginB.body.token;

    //hryssa notanda A
    await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ name: "Hryssa A1" });

    await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ name: "Hryssa A2" });

    //hryssa notanda B
    await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ name: "Hryssa B1" });
  });

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
