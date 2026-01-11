import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { createIsNumber } from "../helpers/isNumber";

describe.sequential("UC8 – Merkja stöðu á hryssu", () => {
  let token: string;
  let horseId: number;

  beforeAll(async () => {
    const email = `uc8-${Date.now()}@test.is`;

    //skrá notanda
    await request(app).post("/auth/register").send({
      name: "UC8 User",
      email,
      password: "password",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email,
      password: "password",
    });

    token = loginRes.body.token;

    //skrá hryssu
    const horseRes = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "UC8 Hryssa",
        is_number: createIsNumber({ gender: 2 }),
        chip_id: `UC8-${Date.now()}`,
      });

    horseId = horseRes.body.id;
  });

  it("Eigandi getur merkt needs_vet = true (200)", async () => {
    const res = await request(app)
      .patch(`/horses/${horseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ needs_vet: true });

    expect(res.status).toBe(200);
    expect(res.body.needs_vet).toBe(true);
  });

  it("Eigandi getur merkt pregnancy_confirmed = true og dagsetning skráist (200)", async () => {
    const res = await request(app)
      .patch(`/horses/${horseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ pregnancy_confirmed: true });

    expect(res.status).toBe(200);
    expect(res.body.pregnancy_confirmed).toBe(true);
    expect(res.body).toHaveProperty("pregnancy_confirmed_at");

    const date = new Date(res.body.pregnancy_confirmed_at);
    expect(isNaN(date.getTime())).toBe(false);
  });

  it("Eigandi getur tekið pregnancy_confirmed af og dagsetning hreinsast (200)", async () => {
    const res = await request(app)
      .patch(`/horses/${horseId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ pregnancy_confirmed: false });

    expect(res.status).toBe(200);
    expect(res.body.pregnancy_confirmed).toBe(false);
    expect(res.body.pregnancy_confirmed_at).toBeNull();
  });

  it("Óinnskráður notandi fær 401 Unauthorized", async () => {
    const res = await request(app)
      .patch(`/horses/${horseId}`)
      .send({ needs_vet: true });

    expect(res.status).toBe(401);
  });
});
