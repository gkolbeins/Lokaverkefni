import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";

describe.sequential("UC5 – Login user", () => {
  const email = `uc5-user-${Date.now()}@test.is`;
  const password = "password123";

  beforeAll(async () => {
    //bý til notanda sem hægt er að logga inn
    await request(app).post("/auth/register").send({
      name: "UC5 Test User",
      email,
      password,
    });
  });

  it("Notandi getur skráð sig inn með réttu email og lykilorði (200)", async () => {
    const res = await request(app).post("/auth/login").send({
      email,
      password,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

  it("Rangt lykilorð → 401 Unauthorized", async () => {
    const res = await request(app).post("/auth/login").send({
      email,
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
  });

  it("Rangt email → 401 Unauthorized", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "wrong-email@test.is",
      password,
    });

    expect(res.status).toBe(401);
  });

  it("Vantar email eða lykilorð → 400 Bad Request", async () => {
    const res = await request(app).post("/auth/login").send({
      email,
    });

    expect(res.status).toBe(400);
  });
});
