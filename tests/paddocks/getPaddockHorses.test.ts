import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { createIsNumber } from "../helpers/isNumber";

describe.sequential("GET /paddocks/:id/horses", () => {
  let token: string;
  let paddockId: number;
  let horseId: number;

  beforeEach(async () => {
    const email = `paddock-${Date.now()}@test.is`;

    //notandi
    await request(app).post("/auth/register").send({
      name: "Paddock User",
      email,
      password: "password",
    });

    const login = await request(app).post("/auth/login").send({
      email,
      password: "password",
    });

    token = login.body.token;

    //paddock
    const paddockRes = await request(app)
      .post("/paddocks")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Paddock" });

    paddockId = paddockRes.body.id;

    //hryssa sem er ekki í paddock ennþá
    const horseRes = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Hryssa í paddock",
        is_number: createIsNumber({ gender: 2 }),
      });

    horseId = horseRes.body.id;

    //færa hryssu í paddock
    await request(app)
      .post(`/horses/${horseId}/move`)
      .set("Authorization", `Bearer ${token}`)
      .send({ paddockId });
  });

  it("should return horses in paddock", async () => {
    const response = await request(app)
      .get(`/paddocks/${paddockId}/horses`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].id).toBe(horseId);
  });
});