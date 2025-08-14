async function aggregateFiles(providers, projectId) {
  const allFiles = await Promise.all(providers.map(p => p.fetchFiles(projectId)));
  const merged = allFiles.flat();
  const dedupMap = new Map();
  for(const f of merged){
    const key = `${f.projectId}_${f.name}`;
    if(!dedupMap.has(key) || dedupMap.get(key).updatedAt < f.updatedAt){
      dedupMap.set(key, f);
    }
  }
  return Array.from(dedupMap.values()).sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt));
}

module.exports = { aggregateFiles };
