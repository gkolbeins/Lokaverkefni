import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { createIsNumber } from "../helpers/isNumber";
import test from "node:test";

describe.sequential("DELETE /horses/:id", () => {
let token: string;
let horseId: number;
const testEmail = `horse-delete-${Date.now()}@test.is`;

describe("DELETE /horses/:id", () => {
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

    //búa til hryssu sem þessi notandi á
    const horseRes = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test Hryssa",
        is_number: createIsNumber({ gender: 2 }),
      });

    horseId = horseRes.body.id;
  });

  it("should delete own horse", async () => {
    const response = await request(app)
      .delete(`/horses/${horseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Horse deleted");
    expect(response.body.horse.id).toBe(horseId);
  });

  it("should return 404 when deleting same horse again", async () => {
    const response = await request(app)
      .delete(`/horses/${horseId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

});
});
