
const { Bim360Provider, ProcoreProvider } = require("../src/providers");
const { aggregateFiles } = require("../src/aggregator");
const { performance } = require("perf_hooks");

(async ()=>{
  const bim = new Bim360Provider();
  const pro = new ProcoreProvider();

  bim.fetchFiles = async ()=>Array.from({length:250},(_,i)=>({ source:"bim360", projectId:"PRJ1", fileId:"b"+i, name:"File"+i, version:"1", size:1000, downloadUrl:"#", updatedAt:new Date().toISOString() }));
  pro.fetchFiles = async ()=>Array.from({length:250},(_,i)=>({ source:"procore", projectId:"PRJ1", fileId:"p"+i, name:"File"+i, version:"1", size:1000, downloadUrl:"#", updatedAt:new Date().toISOString() }));

  const start = performance.now();
  const files = await aggregateFiles([bim,pro],"PRJ1");
  const end = performance.now();
  console.log(`Aggregated ${files.length} files in ${Math.round(end-start)} ms`);
})();
