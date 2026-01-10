import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../../src/index";

describe("UC1 – GET /horses filters & sorting", () => {
  let token: string;
  let paddockId: number;
  let stallionId: number;
  let horseAId: number;
  let horseBId: number;

  beforeAll(async () => {
    const email = `uc1-${Date.now()}@test.is`;

    await request(app).post("/auth/register").send({
      name: "UC1 User",
      email,
      password: "password",
    });

    const loginRes = await request(app).post("/auth/login").send({
      email,
      password: "password",
    });

    token = loginRes.body.token;

    const paddockRes = await request(app)
      .post("/paddocks")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Paddock" });

    paddockId = paddockRes.body.id;

    const stallionRes = await request(app)
      .post("/stallions")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Test Stallion" });

    stallionId = stallionRes.body.id;

    // Horse A
    const horseARes = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Alpha",
        chip_id: "A1",
        is_number: "IS2019202560",
      });

    horseAId = horseARes.body.id;

    await request(app)
      .post(`/horses/${horseAId}/move`)
      .set("Authorization", `Bearer ${token}`)
      .send({ paddockId });

    // Horse B
    const horseBRes = await request(app)
      .post("/horses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Bravo",
        chip_id: "B2",
        is_number: "IS2017202560",
      });

    horseBId = horseBRes.body.id;
  });

  it("filters by chip_id", async () => {
    const res = await request(app)
      .get("/horses?chip_id=B2")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].chip_id).toBe("B2");
  });

  it("sorts by name", async () => {
    const res = await request(app)
      .get("/horses?sort=name")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe("Alpha");
    expect(res.body[1].name).toBe("Bravo");
  });

  it("sorts by age", async () => {
    const res = await request(app)
      .get("/horses?sort=age")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body[0].age).toBeLessThanOrEqual(res.body[1].age);
  });
});
