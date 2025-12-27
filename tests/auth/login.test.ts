import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";

describe.sequential("POST /auth/login", () => {
  const email = `login-${Date.now()}@test.is`;
  const password = "password123";

  beforeAll(async () => {
    await request(app)
      .post("/auth/register")
      .send({
        name: "Login User",
        email,
        password,
      });
  });

  it("should login with correct credentials", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email,
        password,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should return 401 for wrong password", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email,
        password: "wrongpassword",
      });

    expect(response.status).toBe(401);
  });

  it("should return 401 for non-existing user", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "nope@test.is",
        password: "password123",
      });

    expect(response.status).toBe(401);
  });

  it("should return 400 if fields are missing", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({
        email,
      });

    expect(response.status).toBe(400);
  });
});
