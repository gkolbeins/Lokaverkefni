import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { createIsNumber } from "../helpers/isNumber";

describe("PATCH /stallions/:id", () => {
  let token: string;
  let stallionId: number;
  const testEmail = `stallion-patch-${Date.now()}@test.is`;

  beforeAll(async () => {
    //skrá notanda
    await request(app).post("/auth/register").send({
      name: "Patch User",
      email: testEmail,
      password: "password",
    });

    //login
    const loginRes = await request(app).post("/auth/login").send({
      email: testEmail,
      password: "password",
    });

    token = loginRes.body.token;
  });

  beforeEach(async () => {
    const stallionRes = await request(app)
      .post("/stallions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Gamla nafnið",
        is_number: createIsNumber({ gender: 2 }),
      });

    stallionId = stallionRes.body.id;
  });

  it("should update stallion when owner", async () => {
    const response = await request(app)
      .patch(`/stallions/${stallionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Nýja nafnið",
        notes: "Uppfærðar upplýsingar",
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Nýja nafnið");
    expect(response.body.notes).toBe("Uppfærðar upplýsingar");
  });

  it("should return 400 for empty body", async () => {
    const response = await request(app)
      .patch(`/stallions/${stallionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });

  it("should return 401 without token", async () => {
    const response = await request(app)
      .patch(`/stallions/${stallionId}`)
      .send({ name: "Fail" });

    expect(response.status).toBe(401);
  });

  it("should return 404 for non-existing stallion", async () => {
    const response = await request(app)
      .patch("/stallions/999999")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Fail" });

    expect(response.status).toBe(404);
  });
});
