CDE Transformer – Documentation
1. Problem
Engineering teams use 5 different CDE systems: BIM360, Procore, Viewpoint, Trimble,
Accnoex.
Each system stores files differently, making it hard to get all files in one place.
Goal: create a single API that collects files from any combination of these systems.
2. Solution
Built a Node.js + Express service called CDE Transformer.
Accepts a request with providers and project ID.
Fetches files from all providers in parallel.
Maps each provider’s data to a common format.
Removes duplicates and keeps the latest version.
Returns files sorted by last update.
3. Common File Format
All files are converted to the same structure:
{
 "source": "bim360",
 "projectId": "1234",
 "fileId": "file-1",
 "name": "Drawing A.pdf",
 "version": "v3",
 "size": 245678,
 "downloadUrl": "https://example.com/file",
 "updatedAt": "2025-08-13T11:25:00Z"
}
Why: Makes it easy for applications to read, sort, and filter files.
4. How It Works
Step by Step:
Client requests /v1/files with providers + project ID.
The service calls each provider to get files.
Provider responses are mapped to common format.
All files are merged and duplicates are removed.
Files are sorted by last update and returned as JSON.
5. Key Components
Component What it does
Providers Connect to each CDE system and fetch files.
Aggregator Combines files from all providers, removes duplicates.
Transformation Converts provider data into common format.
API Exposes endpoint /v1/files for clients.
Config Stores API keys and settings in .env.
6. How I Solved Problems
Problem Solution
Different API formats Created mapping logic for each provider.
Slow sequential calls Fetched all providers in parallel with Promise.all().
Duplicate files Used a Map to keep only the latest version.
Missing config Centralized secrets and settings in .env.
Testing Used Jest and Supertest for unit and e2e tests.
7. Example API Request & Response
Request:
GET /v1/files?providers=bim360,procore&project=1234
Response:
[
 {
 "source": "bim360",
 "projectId": "1234",
 "fileId": "file-5",
 "name": "Floor Plan DWG.dwg",
 "version": "v3",
 "size": 245678,
 "downloadUrl": "https://example.com/floor-plan",
 "updatedAt": "2025-08-13T11:25:00Z"
 }
]
8. Performance
Aggregating 500 mock files takes <200ms.
Parallel fetching + in-memory processing keeps it fast.
9. How to Run
Clone repo: git clone <repo-url>
Install dependencies: npm install
Add .env with provider API keys
Start server: npm start
Test endpoint: /v1/files?providers=bim360,procore&project=1234
10. Future Improvements
Real API connections with OAuth
Add filtering & pagination
Store historical versions in database
Implement caching for faster repeated requests
