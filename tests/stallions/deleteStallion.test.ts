import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { createIsNumber } from "../helpers/isNumber";
import test from "node:test";

describe.sequential("DELETE /stallions/:id", () => {
let token: string;
let stallionId: number;
const testEmail = `stallion-delete-${Date.now()}@test.is`;

describe("DELETE /stallions/:id", () => {
  beforeAll(async () => {
    //nýr notandi
    await request(app)
      .post("/auth/register")
      .send({
        name: "Delete Test User",
        email: testEmail,
        password: "password123",
      });

    //innskráning og fá token
    const loginRes = await request(app)
      .post("/auth/login")
      .send({
        email: testEmail,
        password: "password123",
      });

    token = loginRes.body.token;

    //búa til hest sem þessi notandi á
    const stallionRes = await request(app)
      .post("/stallions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Hestur",
        is_number: createIsNumber({ gender: 2 }),
      });

    stallionId = stallionRes.body.id;
  });

  it("should delete own stallion", async () => {
    const response = await request(app)
      .delete(`/stallions/${stallionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Stallion deleted");
    expect(response.body.stallion.id).toBe(stallionId);
  });

  it("should return 404 when deleting same stallion again", async () => {
    const response = await request(app)
      .delete(`/stallions/${stallionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

});
});
