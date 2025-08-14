const express = require("express");
const config = require("./config");
const { Bim360Provider, ProcoreProvider, ViewpointProvider, TrimbleProvider, AccnoexProvider } = require("./providers");
const { aggregateFiles } = require("./aggregator");

const app = express();
app.use(express.json());

app.get("/v1/files", async (req,res)=>{
  const { providers: provQuery, project } = req.query;
  if(!provQuery || !project) return res.status(400).json({ error:"Missing providers or project id" });

  const providerNames = provQuery.split(",");
  const instances = [];

  for(const name of providerNames){
    switch(name.toLowerCase()){
      case "bim360": instances.push(new Bim360Provider()); break;
      case "procore": instances.push(new ProcoreProvider()); break;
      case "viewpoint": instances.push(new ViewpointProvider()); break;
      case "trimble": instances.push(new TrimbleProvider()); break;
      case "accnoex": instances.push(new AccnoexProvider()); break;
      default: break;
    }
  }

  try{
    const result = await aggregateFiles(instances, project);
    res.json(result);
  }catch(err){ console.error(err); res.status(500).json({error:"Server error"}); }
});

// Only listen if not imported (prevents E2E test port conflict)
if (require.main === module) {
  app.listen(config.port, ()=>console.log(`CDE Hub running on port ${config.port}`));
}

module.exports = app;
