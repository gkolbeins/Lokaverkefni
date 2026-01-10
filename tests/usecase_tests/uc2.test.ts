import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { pool } from "../../src/config/db";

describe("UC2 – View my horse details", () => {
  let ownerToken: string;
  let otherToken: string;
  let horseId: number;

  beforeAll(async () => {
    //búa til notanda sem er eigandi
    const ownerRes = await request(app)
      .post("/auth/register")
      .send({
        name: "Eigandi",
        email: "owner@test.is",
        password: "password123",
      });

    const ownerLogin = await request(app)
      .post("/auth/login")
      .send({
        email: "owner@test.is",
        password: "password123",
      });

    ownerToken = ownerLogin.body.token;

    //búa til annan notanda
    await request(app).post("/auth/register").send({
      name: "Annar",
      email: "other@test.is",
      password: "password123",
    });

    const otherLogin = await request(app)
      .post("/auth/login")
      .send({
        email: "other@test.is",
        password: "password123",
      });

    otherToken = otherLogin.body.token;

    //búa til hryssu
    const horseRes = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({
        name: "Brynja frá Forsæti",
        is_number: "IS2019284585",
        chip_id: "35209810009777",
      });

    horseId = horseRes.body.id;
  });

  afterAll(async () => {
    await pool.end();
  });

  it("Eigandi getur skoðað sína hryssu (200)", async () => {
    const res = await request(app)
      .get(`/horses/${horseId}`)
      .set("Authorization", `Bearer ${ownerToken}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("id", horseId);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("is_number");
    expect(res.body).toHaveProperty("chip_id");

    expect(res.body).toHaveProperty("owner");
    expect(res.body.owner).toHaveProperty("id");
    expect(res.body.owner).toHaveProperty("name");
    expect(res.body.owner).toHaveProperty("email");

    expect(res.body).toHaveProperty("needs_vet");
    expect(res.body).toHaveProperty("pregnancy_confirmed");
    expect(res.body).toHaveProperty("age");
  });

  it("Annar notandi fær 403 Forbidden", async () => {
    const res = await request(app)
      .get(`/horses/${horseId}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });

  it("Óinnskráður notandi fær 401 Unauthorized", async () => {
    const res = await request(app).get(`/horses/${horseId}`);
    expect(res.status).toBe(401);
  });
});
