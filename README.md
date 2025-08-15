CDE API – Documentation
1. Overview
The CDE Transformer API is a lightweight Node.js + Express service that aggregates files from multiple Common Data Environment (CDE) platforms—such as BIM360, Procore, Viewpoint, etc.—into one unified API response.

Key Functions:
- Accepts a list of providers and a project ID.
- Fetches files from each provider in parallel.
- Deduplicates files by project & file name, keeping the most recent version.
- Returns files sorted by last update time.
2. Architecture
[ CDE Providers ] --> [ Aggregator ] --> [ Express API ] --> [ Client ]

Providers: Each integration connects to a specific CDE system.
Aggregator: Merges results, removes duplicates, sorts.
Express API: Serves the unified file list to clients.
Why this design?
- Modular → easy to add new providers.
- Asynchronous fetching → better performance.
- Map-based deduplication → fast lookups.
3. Project Structure
cde-transformer/
├─ package.json           
├─ src/
│   ├─ app.js             
│   ├─ config.js         
│   ├─ aggregator.js      
│   └─ providers/         
│       ├─ index.js
│       ├─ bim360Provider.js
│       ├─ procoreProvider.js
│       ├─ viewpointProvider.js
│       ├─ trimbleProvider.js
│       └─ accnoexProvider.js
4. Installation & Setup
Local Development:
1. Clone the repo
   git clone https://github.com/SenthilkumarZ/cde-transformer.git
   cd cde-transformer
2. Install dependencies
   npm install
3. Start the API
   npm start
Runs at: http://localhost:3000
Deployment on Render:
1. Create a Web Service on Render.
2. Link your GitHub repository.
3. Build Command: npm install
4. Start Command: npm start
5. API will be live at: https://your-service.onrender.com
5. API Endpoints
GET `/` - Health check. Response:
✅ CDE Transformer API is running. Try: /v1/files?providers=bim360,procore&project=1234
GET `/v1/files` - Fetch aggregated files from specified providers.
Query Parameters:
providers (string, required) - e.g., bim360,procore
project (string, required) - e.g., 1234
Example Request: GET /v1/files?providers=bim360,procore&project=1234
Example Response:
[
  {
    "id": "file-5",
    "name": "Floor Plan DWG.dwg",
    "projectId": "1234",
    "provider": "bim360",
    "updatedAt": "2025-08-13T11:25:00Z"
  }
]
6. Aggregator Logic
async function aggregateFiles(providers, projectId) {
  const allFiles = await Promise.all(providers.map(p => p.fetchFiles(projectId)));
  const merged = allFiles.flat();
  const dedupMap = new Map();
  for (const f of merged) {
    const key = `${f.projectId}_${f.name}`;
    if (!dedupMap.has(key) || dedupMap.get(key).updatedAt < f.updatedAt) {
      dedupMap.set(key, f);
    }
  }
  return Array.from(dedupMap.values())
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}
module.exports = { aggregateFiles };
7. Adding a New Provider
Steps:
1. Create src/providers/newProvider.js
2. Implement fetchFiles(projectId)
3. Add to src/providers/index.js
4. Allow it in provider selection logic in app.js
8. Error Handling
Missing `providers` or `project` → 400 Bad Request.
Any exception → 500 Server Error.
Logs error details to console.
9. Performance Features
Parallel fetching using Promise.all.
Map for instant deduplication.
Minimal in-memory processing.
10. Example cURL Test
curl "https://cde-transformer.onrender.com/v1/files?providers=bim360,procore&project=1234"
11. Future Roadmap
Real API integration, OAuth, filtering, pagination, caching.
12. License
MIT License – free to use & modify.
