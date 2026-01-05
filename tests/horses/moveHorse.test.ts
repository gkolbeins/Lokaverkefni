import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { createIsNumber } from "../helpers/isNumber";

describe.sequential("POST /horses/:id/move", () => {
  let token: string;
  let horseId: number;
  let paddockId: number;

  beforeEach(async () => {
    const email = `move-${Date.now()}@test.is`;

    //skrá notanda
    await request(app).post("/auth/register").send({
      name: "Move User",
      email,
      password: "password",
    });

    const login = await request(app).post("/auth/login").send({
      email,
      password: "password",
    });

    token = login.body.token;

    //búa til paddock með engan gradda
    const paddockRes = await request(app)
      .post("/paddocks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Paddock A",
      });

    paddockId = paddockRes.body.id;

    //búa til hryssu sem er ekki í paddock strax
    const horseRes = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Hryssa",
        is_number: createIsNumber({ gender: 2 }),
      });

    horseId = horseRes.body.id;
  });

  it("should move horse to paddock", async () => {
    const response = await request(app)
      .post(`/horses/${horseId}/move`)
      .set("Authorization", `Bearer ${token}`)
      .send({ paddockId });

    expect(response.status).toBe(200);
    expect(response.body.paddockId).toBe(paddockId);
  });

  it("should return 401 without token", async () => {
    const response = await request(app)
      .post(`/horses/${horseId}/move`)
      .send({ paddockId });

    expect(response.status).toBe(401);
  });
});
