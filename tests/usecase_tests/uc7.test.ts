import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { createIsNumber } from "../helpers/isNumber";

describe.sequential("UC7 – Move horse", () => {
  let ownerToken: string;
  let paddockAId: number;
  let paddockBId: number;
  let horseId: number;

  beforeAll(async () => {
    //skrá eiganda
    const email = `uc7-owner-${Date.now()}@test.is`;

    await request(app).post("/auth/register").send({
      name: "UC7 Owner",
      email,
      password: "password",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email,
      password: "password",
    });

    ownerToken = loginRes.body.token;

    //búa til tvær girðingar
    const paddockA = await request(app)
      .post("/paddocks")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "UC7 Paddock A" });

    paddockAId = paddockA.body.id;

    const paddockB = await request(app)
      .post("/paddocks")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ name: "UC7 Paddock B" });

    paddockBId = paddockB.body.id;

    //búa til hryssu
    const horseRes = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        name: "UC7 Hryssa",
        is_number: createIsNumber({ gender: 2 }),
        chip_id: `uc7-${Date.now()}`,
      });

    horseId = horseRes.body.id;
  });

  it("Eigandi getur flutt hryssu í nýja girðingu með arrival_date (200)", async () => {
    const res = await request(app)
      .post(`/horses/${horseId}/move`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        paddockId: paddockAId,
        arrival_date: "2024-06-01",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("horseId", horseId);
    expect(res.body).toHaveProperty("paddockId", paddockAId);
    expect(res.body).toHaveProperty("arrival_date", "2024-06-01");
  });

  it("arrival_date er sett sjálfkrafa ef ekki sent (200)", async () => {
    const res = await request(app)
      .post(`/horses/${horseId}/move`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        paddockId: paddockBId,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("arrival_date");
  });

  it("Óinnskráður notandi fær 401", async () => {
    const res = await request(app)
      .post(`/horses/${horseId}/move`)
      .send({
        paddockId: paddockAId,
      });

    expect(res.status).toBe(401);
  });

  it("Vantar paddockId - 400", async () => {
    const res = await request(app)
      .post(`/horses/${horseId}/move`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({});

    expect(res.status).toBe(400);
  });
});
