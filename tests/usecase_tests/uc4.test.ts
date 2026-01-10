import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/index";

describe.sequential("UC4 – Register user", () => {

  it("Notandi getur skráð sig með nafni, síma, email og lykilorði (201)", async () => {
    const email = `uc4-${Date.now()}@test.is`;

    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "UC4 Test User",
        phone: "5551234",
        email,
        password: "securePassword123",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name", "UC4 Test User");
    expect(res.body).toHaveProperty("email", email);

    //lykilorð má ALDREI koma til baka
    expect(res.body).not.toHaveProperty("password");
    expect(res.body).not.toHaveProperty("password_hash");
  });

  it("Email verður að vera unique (400)", async () => {
    const email = `uc4-duplicate@test.is`;

    await request(app)
      .post("/auth/register")
      .send({
        name: "First User",
        phone: "5551111",
        email,
        password: "password123",
      });

    const res = await request(app)
      .post("/auth/register")
      .send({
        name: "Second User",
        phone: "5552222",
        email,
        password: "password456",
      });

    expect(res.status).toBe(400);
  });

  it("Vantar nauðsynleg gögn → 400", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({
        email: `uc4-missing-${Date.now()}@test.is`,
        password: "password123",
      });

    expect(res.status).toBe(400);
  });

  it("Lykilorð er hössað í gagnagrunni", async () => {
    const email = `uc4-hash-${Date.now()}@test.is`;

    const registerRes = await request(app)
      .post("/auth/register")
      .send({
        name: "Hash Test User",
        phone: "5559999",
        email,
        password: "plainTextPassword",
      });

    expect(registerRes.status).toBe(201);

    //reyna innskráningu - sanna að hash virkar
    const loginRes = await request(app)
      .post("/auth/login")
      .send({
        email,
        password: "plainTextPassword",
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
  });

});
