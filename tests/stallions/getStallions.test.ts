import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { createIsNumber } from "../helpers/isNumber";

describe.sequential("GET /stallions", () => {
  let tokenA: string;
  let tokenB: string;

  const testEmailA = `stallion_emaila-${Date.now()}@test.is`;
  const testEmailB = `stallion_emailb-${Date.now()}@test.is`;

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

    //graddi notanda A (2 stk)
    await request(app)
      .post("/stallions")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        name: "Hryssa A1",
        is_number: createIsNumber({ gender: 2 }),
        chip_id: `A1-${Date.now()}`
      });

    await request(app)
      .post("/stallions")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        name: "Hryssa A2",
        is_number: createIsNumber({ gender: 2 }),
        chip_id: `A2-${Date.now()}`
      });

    
    //graddi notanda B (1 stk)
    await request(app)
      .post("/stallions")
      .set("Authorization", `Bearer ${tokenB}`)
      .send({
        name: "Hryssa B1",
        is_number: createIsNumber({ gender: 2 }),
        chip_id: `B1-${Date.now()}`
      });
  });

  it("should return only stallions belonging to the logged-in user", async () => {
    const res = await request(app)
      .get("/stallions")
      .set("Authorization", `Bearer ${tokenA}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);

    res.body.forEach((stallion: any) => {
      expect(stallion.name.startsWith("Hryssa A")).toBe(true);
    });
  });

  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get("/stallions");
    expect(res.status).toBe(401);
  });
});
