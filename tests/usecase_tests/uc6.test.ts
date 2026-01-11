import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { createIsNumber } from "../helpers/isNumber";

describe.sequential("UC6 – Register horse", () => {
  let token: string;

  beforeAll(async () => {
    const email = `uc6-${Date.now()}@test.is`;

    await request(app).post("/auth/register").send({
      name: "UC6 User",
      email,
      password: "password",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email,
      password: "password",
    });

    token = loginRes.body.token;
  });

  it("Notandi getur skráð nýja hryssu (201)", async () => {
    const res = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "UC6 Hryssa",
        is_number: createIsNumber({ gender: 2 }),
        chip_id: `uc6-chip-${Date.now()}`,
        arrival_date: "2024-05-01",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name", "UC6 Hryssa");
    expect(res.body).toHaveProperty("arrival_date");
  });

  it("Óinnskráður notandi fær 401", async () => {
    const res = await request(app).post("/horses").send({
      name: "Fail Horse",
    });

    expect(res.status).toBe(401);
  });

  it("arrival_date er ekki skylda við skráningu (201)", async () => {
  const res = await request(app)
    .post("/horses")
    .set("Authorization", `Bearer ${token}`)
    .send({
      name: "Hryssa án komudags",
      is_number: createIsNumber({ gender: 2 }),
      chip_id: `UC6-${Date.now()}`,
    });

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty("id");
});
});
