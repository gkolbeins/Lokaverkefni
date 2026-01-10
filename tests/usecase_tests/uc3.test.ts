import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { createIsNumber } from "../helpers/isNumber";

describe.sequential("UC3 – View paddock details", () => {
  let ownerToken: string;
  let otherToken: string;
  let paddockId: number;
  let horseAId: number;
  let horseBId: number;

  beforeAll(async () => {
    //eigandinn
    const ownerEmail = `uc3-owner-${Date.now()}@test.is`;

    await request(app).post("/auth/register").send({
      name: "Paddock Owner",
      email: ownerEmail,
      password: "password",
    });

    const ownerLogin = await request(app).post("/auth/login").send({
      email: ownerEmail,
      password: "password",
    });

    ownerToken = ownerLogin.body.token;

    //annar notandi
    const otherEmail = `uc3-other-${Date.now()}@test.is`;

    await request(app).post("/auth/register").send({
      name: "Other User",
      email: otherEmail,
      password: "password",
    });

    const otherLogin = await request(app).post("/auth/login").send({
      email: otherEmail,
      password: "password",
    });

    otherToken = otherLogin.body.token;

    //búa til graðhest
    const stallionRes = await request(app)
      .post("/stallions")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        name: "UC3 Stallion",
        is_number: createIsNumber({ gender: 1 }),
        chip_id: `stallion-${Date.now()}`,
      });

    const stallionId = stallionRes.body.id;

    //búa til paddock
    const paddockRes = await request(app)
      .post("/paddocks")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        name: "UC3 paddock",
        stallion_id: stallionId,
      });

    paddockId = paddockRes.body.id;

    //búa til hryssu A
    const horseARes = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        name: "Hryssa A",
        is_number: createIsNumber({ gender: 1 }),
        chip_id: `HA-${Date.now()}`,
        arrival_date: "2024-05-01",
      });

    horseAId = horseARes.body.id;

    //búa til hryssu B
    const horseBRes = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        name: "Hryssa B",
        is_number: createIsNumber({ gender: 1 }),
        chip_id: `HB-${Date.now()}`,
        arrival_date: "2024-05-03",
      });

    horseBId = horseBRes.body.id;

    //flytja báðar í paddock (EKKI harðkóðuð ID)
    await request(app)
      .post(`/horses/${horseAId}/move`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ paddockId });

    await request(app)
      .post(`/horses/${horseBId}/move`)
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ paddockId });
  });

  it("Eigandi getur skoðað girðingu með hryssum og graðhesti (200)", async () => {
    const res = await request(app)
      .get(`/paddocks/${paddockId}`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("id", paddockId);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("location");

    //stallion er VALKVÆÐUR – en ef hann er til, þá þarf hann að vera réttur
    expect(res.body).toHaveProperty("stallion");
    if (res.body.stallion !== null) {
      expect(res.body.stallion).toHaveProperty("id");
      expect(res.body.stallion).toHaveProperty("name");
    }

    expect(res.body).toHaveProperty("horses");
    expect(Array.isArray(res.body.horses)).toBe(true);
    expect(res.body.horses.length).toBe(2);

    res.body.horses.forEach((horse: any) => {
      expect(horse).toHaveProperty("id");
      expect(horse).toHaveProperty("name");
      expect(horse).toHaveProperty("chip_id");
      expect(horse).toHaveProperty("arrival_date");
    });
  });

  it("Annar notandi fær 403 Forbidden", async () => {
    const res = await request(app)
      .get(`/paddocks/${paddockId}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });

  it("Óinnskráður notandi fær 401 Unauthorized", async () => {
    const res = await request(app).get(`/paddocks/${paddockId}`);
    expect(res.status).toBe(401);
  });
});
