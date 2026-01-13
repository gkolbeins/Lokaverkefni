import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";
import { createIsNumber } from "../helpers/isNumber";

describe("POST /horses – edge case: duplicate IS number", () => {
  let token: string;
  let isNumber: string;

  const testEmail = `horse-duplicate-is-${Date.now()}@test.is`;

  beforeAll(async () => {
    //skrá notanda
    await request(app).post("/auth/register").send({
      name: "Horse Duplicate User",
      email: testEmail,
      password: "password",
    });

    //logga inn
    const loginRes = await request(app).post("/auth/login").send({
      email: testEmail,
      password: "password",
    });

    token = loginRes.body.token;

    //búa til gilt IS-númer
    isNumber = createIsNumber({ gender: 1 });

    //skrá fyrstu hryssu
    await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "First Horse",
        is_number: isNumber,
        chip_id: "352098100000111",
      });
  });

  it("should return 409 when IS number already exists", async () => {
    const response = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Second Horse",
        is_number: isNumber, //önnur hryssa með sama IS-númer
        chip_id: "352098100000222",
      });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toMatch(/IS number/i);
  });
});
