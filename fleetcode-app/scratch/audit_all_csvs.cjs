const fs = require('fs');
const path = require('path');

const repoPath = 'C:/Users/AnkitYdv/.gemini/antigravity-ide/brain/b453163b-ea15-40a3-a7fb-e4d433a9fa64/scratch/leetcode-companywise';
const entries = fs.readdirSync(repoPath, { withFileTypes: true });
const companyDirs = entries.filter(e => e.isDirectory() && e.name !== '.git' && e.name !== 'src').map(e => e.name);

const ourProblems = JSON.parse(fs.readFileSync('public/data/problems.json'));
const idMap = new Map();
const slugMap = new Map();
ourProblems.forEach(p => {
  if (p['#'] != null) idMap.set(String(p['#']), p);
  if (p.Slug) slugMap.set(p.Slug, p);
});

console.log('Scanning all 659 company directories for all.csv...');

const repoProblemsMap = new Map(); // id -> { id, url, title, difficulty, acceptance, maxFreq, companies: [] }
let totalCsvRows = 0;

for (const dir of companyDirs) {
  const csvPath = path.join(repoPath, dir, 'all.csv');
  if (!fs.existsSync(csvPath)) continue;
  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.trim().split('\n');
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    totalCsvRows++;

    // CSV format: ID,URL,Title,Difficulty,Acceptance %,Frequency %
    // Title can contain commas if quoted or unquoted
    const firstComma = line.indexOf(',');
    const secondComma = line.indexOf(',', firstComma + 1);
    const lastComma = line.lastIndexOf(',');
    const secondLastComma = line.lastIndexOf(',', lastComma - 1);
    const thirdLastComma = line.lastIndexOf(',', secondLastComma - 1);

    if (firstComma === -1 || secondComma === -1 || lastComma === -1) continue;

    const idStr = line.substring(0, firstComma).trim();
    const url = line.substring(firstComma + 1, secondComma).trim();
    let title = line.substring(secondComma + 1, thirdLastComma).trim();
    if (title.startsWith('"') && title.endsWith('"')) {
      title = title.slice(1, -1);
    }
    const diff = line.substring(thirdLastComma + 1, secondLastComma).trim();
    const accStr = line.substring(secondLastComma + 1, lastComma).replace('%', '').trim();
    const freqStr = line.substring(lastComma + 1).replace('%', '').trim();

    const id = parseInt(idStr);
    const numAcc = parseFloat(accStr);
    const numFreq = parseFloat(freqStr);
    const slug = url.split('/').filter(Boolean).pop();

    if (!repoProblemsMap.has(idStr)) {
      repoProblemsMap.set(idStr, {
        id,
        url,
        slug,
        title,
        difficulty: diff,
        acceptance: isNaN(numAcc) ? null : numAcc,
        maxFreq: isNaN(numFreq) ? 0 : numFreq,
        companies: [dir]
      });
    } else {
      const item = repoProblemsMap.get(idStr);
      if (!isNaN(numFreq) && numFreq > item.maxFreq) item.maxFreq = numFreq;
      if (!item.companies.includes(dir)) item.companies.push(dir);
    }
  }
}

console.log('Total problem rows in all CSVs:', totalCsvRows);
console.log('Unique problems across all 659 companies in repo:', repoProblemsMap.size);

const missingFromOurApp = [];
for (const [idStr, item] of repoProblemsMap) {
  if (!idMap.has(idStr) && !slugMap.has(item.slug)) {
    missingFromOurApp.push(item);
  }
}

console.log('Problems in GitHub repo but missing from our app:', missingFromOurApp.length);
if (missingFromOurApp.length > 0) {
  console.log('Sample missing problems:', missingFromOurApp.slice(0, 15));
}

// Save frequency map for enrichment
const freqData = {};
for (const [idStr, item] of repoProblemsMap) {
  freqData[idStr] = {
    maxFreq: item.maxFreq,
    companies: item.companies,
    acceptance: item.acceptance
  };
}
fs.writeFileSync('scratch/repo_frequencies.json', JSON.stringify({
  missingCount: missingFromOurApp.length,
  missing: missingFromOurApp,
  freqData
}, null, 2));

console.log('Audit complete. Saved to scratch/repo_frequencies.json');
