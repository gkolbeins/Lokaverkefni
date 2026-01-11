import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";

describe("UC9 – Update user profile", () => {
  let token: string;
  let email: string;

  beforeAll(async () => {
    email = `uc9-${Date.now()}@test.is`;

    //register user
    await request(app).post("/auth/register").send({
      name: "UC9 User",
      email,
      password: "password",
    });

    //login
    const loginRes = await request(app).post("/auth/login").send({
      email,
      password: "password",
    });

    token = loginRes.body.token;
  });

  it("Notandi getur uppfært nafn og síma", async () => {
    const res = await request(app)
      .patch("/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Nýtt nafn",
        phone: "555-1234",
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Nýtt nafn");
    expect(res.body.phone).toBe("555-1234");
    expect(res.body.email).toBe(email);
  });

  it("Notandi getur uppfært email", async () => {
    const newEmail = `new-${Date.now()}@test.is`;

    const res = await request(app)
      .patch("/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: newEmail,
      });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(newEmail);
  });

  it("Ekki hægt að uppfæra í email sem er þegar til", async () => {
    const existingEmail = `existing-${Date.now()}@test.is`;

    //búa til annan notanda
    await request(app).post("/auth/register").send({
      name: "Other User",
      email: existingEmail,
      password: "password",
    });

    const res = await request(app)
      .patch("/auth/me")
      .set("Authorization", `Bearer ${token}`)
      .send({
        email: existingEmail,
      });

    expect(res.status).toBe(400);
  });

  it("Óinnskráður notandi fær 401", async () => {
    const res = await request(app)
      .patch("/auth/me")
      .send({
        name: "Fail",
      });

    expect(res.status).toBe(401);
  });
});
