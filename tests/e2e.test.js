
const request = require("supertest");
const app = require("../src/app");

test("GET /v1/files returns array", async ()=>{
  const res = await request(app).get("/v1/files?providers=bim360,procore&project=PRJ1");
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});
