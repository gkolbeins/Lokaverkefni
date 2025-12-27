import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { createIsNumber } from "../helpers/isNumber";

describe.sequential("DELETE /stallions/:id", () => {
  let token: string;
  let stallionId: number;
  const testEmail = `stallion-delete-${Date.now()}@test.is`;

  beforeAll(async () => {
    //skrá notanda
    await request(app).post("/auth/register").send({
      name: "Delete Test User",
      email: testEmail,
      password: "password123",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email: testEmail,
      password: "password123",
    });

    token = loginRes.body.token;
  });

  beforeEach(async () => {
    //BÚA TIL NÝJAN HEST FYRIR HVERT TEST
    const stallionRes = await request(app)
      .post("/stallions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Test hestur",
        is_number: createIsNumber({ gender: 1 }),
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
    await request(app)
      .delete(`/stallions/${stallionId}`)
      .set("Authorization", `Bearer ${token}`);

    const response = await request(app)
      .delete(`/stallions/${stallionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});
