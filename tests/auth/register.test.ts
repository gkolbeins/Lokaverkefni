import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/index";

describe.sequential("POST /auth/register", () => {
  const email = `user-${Date.now()}@test.is`;

  it("should register a new user", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Test User",
      email,
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", "Test User");
    expect(response.body).toHaveProperty("email", email);
    expect(response.body).not.toHaveProperty("password");
    expect(response.body).not.toHaveProperty("password_hash");
  });

  it("should not allow duplicate email", async () => {
    const response = await request(app).post("/auth/register").send({
      name: "Test User 2",
      email,
      password: "password123",
    });

    expect(response.status).toBe(400);
  });

  it("should return 400 if required fields are missing", async () => {
    const response = await request(app).post("/auth/register").send({
      email: `x-${Date.now()}@test.is`,
    });

    expect(response.status).toBe(400);
  });
});
