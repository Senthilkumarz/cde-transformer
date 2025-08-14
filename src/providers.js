const config = require("./config");

// Interface
class ICDEProvider {
  async fetchFiles(projectId) { throw new Error("Not implemented"); }
}

// BIM360 Provider
class Bim360Provider extends ICDEProvider {
  constructor() { 
    super(); 
    this.sourceName = "bim360"; 
    this.token = config.bim360Token; 
  }
  async fetchFiles(projectId) {
    if(!this.token) throw new Error("BIM360 token missing");
    await new Promise(r => setTimeout(r, config.rateLimitDelayMs));
    return [
      { source:this.sourceName, projectId, fileId:"b360-101", name:"FloorPlan-A.dwg", version:"2", size:204800, downloadUrl:"https://bim360.com/files/101", updatedAt:"2025-08-10T12:00:00Z" },
      { source:this.sourceName, projectId, fileId:"b360-102", name:"Electrical.dwg", version:"1", size:102400, downloadUrl:"https://bim360.com/files/102", updatedAt:"2025-08-12T15:00:00Z" }
    ];
  }
}

// Procore Provider
class ProcoreProvider extends ICDEProvider {
  constructor() { super(); this.sourceName="procore"; this.token=config.procoreToken; }
  async fetchFiles(projectId) {
    if(!this.token) throw new Error("Procore token missing");
    await new Promise(r=>setTimeout(r, config.rateLimitDelayMs));
    return [
      { source:this.sourceName, projectId, fileId:"pc-501", name:"SitePlan.pdf", version:"3", size:512000, downloadUrl:"https://procore.com/files/501", updatedAt:"2025-08-11T10:00:00Z" }
    ];
  }
}

// Stubs for other providers
class ViewpointProvider extends ICDEProvider { async fetchFiles(projectId){ return []; } }
class TrimbleProvider extends ICDEProvider { async fetchFiles(projectId){ return []; } }
class AccnoexProvider extends ICDEProvider { async fetchFiles(projectId){ return []; } }

module.exports = { ICDEProvider, Bim360Provider, ProcoreProvider, ViewpointProvider, TrimbleProvider, AccnoexProvider };
