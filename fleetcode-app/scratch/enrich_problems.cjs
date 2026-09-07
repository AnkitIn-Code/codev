const fs = require('fs');

const ourProblems = JSON.parse(fs.readFileSync('public/data/problems.json'));
const ourCompanies = JSON.parse(fs.readFileSync('public/data/companies.json'));
const repoFrequencies = JSON.parse(fs.readFileSync('scratch/repo_frequencies.json'));

const missingProblems = repoFrequencies.missing;
const freqData = repoFrequencies.freqData;

console.log('Original problems count:', ourProblems.length);
console.log('Missing problems to add:', missingProblems.length);

// Map company slug to proper display name
const companySlugToName = new Map();
ourCompanies.forEach(c => {
  const slug = c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  companySlugToName.set(slug, c.name);
  companySlugToName.set(c.name.toLowerCase().replace(/[^a-z0-9]/g, ''), c.name);
});

// Format missing problems into our schema
const newProblems = missingProblems.map(p => {
  const companyNames = p.companies.map(slug => companySlugToName.get(slug) || slug.charAt(0).toUpperCase() + slug.slice(1));
  return {
    "#": p.id,
    "Title": p.title,
    "Difficulty": p.difficulty,
    "AcceptanceRate": p.acceptance || 50.0,
    "Tags": "Database",
    "TopicTags": ["Database"],
    "Companies": companyNames.join(', '),
    "CompanyList": companyNames,
    "CompanyCount": companyNames.length,
    "PaidOnly": true,
    "HasSolution": false,
    "URL": p.url,
    "Slug": p.slug,
    "Frequency": p.maxFreq || 12.5
  };
});

// Combine problems
const allProblems = [...ourProblems, ...newProblems];

// Sort by ID
allProblems.sort((a, b) => (Number(a['#']) || 0) - (Number(b['#']) || 0));

// Enrich all problems with Frequency & clean AcceptanceRate
allProblems.forEach(p => {
  const idStr = String(p['#']);
  const repoInfo = freqData[idStr];

  if (repoInfo && repoInfo.maxFreq != null) {
    p.Frequency = repoInfo.maxFreq;
  } else {
    // If not in repo, estimate based on CompanyCount
    const count = p.CompanyCount || (p.CompanyList ? p.CompanyList.length : 0);
    if (count >= 100) {
      p.Frequency = 95.0;
    } else if (count >= 50) {
      p.Frequency = 80.0 + Math.round((count - 50) * 0.3);
    } else if (count >= 20) {
      p.Frequency = 60.0 + Math.round((count - 20) * 0.6);
    } else if (count >= 5) {
      p.Frequency = 35.0 + Math.round((count - 5) * 1.5);
    } else if (count >= 1) {
      p.Frequency = 15.0 + count * 3;
    } else {
      p.Frequency = 8.0;
    }
  }

  // Ensure AcceptanceRate is formatted nicely
  if (p.AcceptanceRate != null) {
    p.AcceptanceRate = parseFloat(p.AcceptanceRate);
  } else {
    p.AcceptanceRate = 50.0;
  }
});

console.log('Enriched total problems count:', allProblems.length);

// Save updated problems.json
fs.writeFileSync('public/data/problems.json', JSON.stringify(allProblems, null, 2));

// Update companies.json problem counts
const companyCounts = {};
allProblems.forEach(p => {
  (p.CompanyList || []).forEach(c => {
    companyCounts[c] = (companyCounts[c] || 0) + 1;
    const clean = c.toLowerCase().replace(/[^a-z0-9]/g, '');
    companyCounts[clean] = (companyCounts[clean] || 0) + 1;
  });
});

ourCompanies.forEach(c => {
  const clean = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (companyCounts[c.name]) {
    c.count = companyCounts[c.name];
  } else if (companyCounts[clean]) {
    c.count = companyCounts[clean];
  }
});

fs.writeFileSync('public/data/companies.json', JSON.stringify(ourCompanies, null, 2));
console.log('Successfully updated public/data/problems.json and public/data/companies.json!');
