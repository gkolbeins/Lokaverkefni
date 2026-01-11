import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";

describe("UC10 – Delete user account", () => {
  let token: string;
  let tokenWithAssets: string;

  const email1 = `delete-${Date.now()}@test.is`;
  const email2 = `delete-assets-${Date.now()}@test.is`;

  beforeAll(async () => {
    // User WITHOUT assets
    await request(app).post("/auth/register").send({
      name: "Delete User",
      email: email1,
      password: "password",
    });

    const login1 = await request(app).post("/auth/login").send({
      email: email1,
      password: "password",
    });

    token = login1.body.token;

    //notandi með paddock
    await request(app).post("/auth/register").send({
      name: "Delete With Assets",
      email: email2,
      password: "password",
    });

    const login2 = await request(app).post("/auth/login").send({
      email: email2,
      password: "password",
    });

    tokenWithAssets = login2.body.token;

    await request(app)
      .post("/paddocks")
      .set("Authorization", `Bearer ${tokenWithAssets}`)
      .send({
        name: "Paddock to block delete",
        location: "Test farm",
      });
  });

  it("Eyðir notanda sem á engin gögn (200)", async () => {
    const res = await request(app)
      .delete("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
  });

  it("Skilar 400 ef notandi á paddock/stallion án staðfestingar", async () => {
    const res = await request(app)
      .delete("/auth/me")
      .set("Authorization", `Bearer ${tokenWithAssets}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Confirmation required/i);
  });

  it("Eyðir notanda með confirm = true (200)", async () => {
    const res = await request(app)
      .delete("/auth/me")
      .set("Authorization", `Bearer ${tokenWithAssets}`)
      .send({ confirm: true });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
  });

  it("Skilar 401 ef notandi er óinnskráður", async () => {
    const res = await request(app).delete("/auth/me");
    expect(res.status).toBe(401);
  });
});
