
const { aggregateFiles } = require("../src/aggregator");

test("deduplicate keeps newest version", async ()=>{
  const providers = [
    { fetchFiles: async ()=>[{ projectId:"P1", name:"A", updatedAt:"2025-01-01" }] },
    { fetchFiles: async ()=>[{ projectId:"P1", name:"A", updatedAt:"2025-02-01" }] }
  ];
  const result = await aggregateFiles(providers,"P1");
  expect(result.length).toBe(1);
  expect(result[0].updatedAt).toBe("2025-02-01");
});
