import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { createIsNumber } from "../helpers/isNumber";

describe("PATCH /paddocks/:id – only one stallion allowed", () => {
  let token: string;
  let paddockId: number;
  let stallionAId: number;
  let stallionBId: number;

  const testEmail = `paddock-stallion-${Date.now()}@test.is`;

  beforeAll(async () => {
    //skrá notanda
    await request(app).post("/auth/register").send({
      name: "Paddock Stallion User",
      email: testEmail,
      password: "password",
    });

    //logga inn
    const loginRes = await request(app).post("/auth/login").send({
      email: testEmail,
      password: "password",
    });

    token = loginRes.body.token;

    //búa til paddock
    const paddockRes = await request(app)
      .post("/paddocks")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Paddock" });

    paddockId = paddockRes.body.id;

    //búa til stallion A
    const stallionARes = await request(app)
      .post("/stallions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Stallion A",
        is_number: createIsNumber({ gender: 1 }),
        chip_id: "352098100000111",
      });

    stallionAId = stallionARes.body.id;

    //búa til stallion B
    const stallionBRes = await request(app)
      .post("/stallions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Stallion B",
        is_number: createIsNumber({ gender: 1 }),
        chip_id: "352098100000222",
      });

    stallionBId = stallionBRes.body.id;

    //setja stallion A í paddock
    await request(app)
      .patch(`/paddocks/${paddockId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ stallion_id: stallionAId });
  });

  it("should return 409 if paddock already has a stallion", async () => {
    const response = await request(app)
      .patch(`/paddocks/${paddockId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ stallion_id: stallionBId });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(/stallion/i);
  });
});
