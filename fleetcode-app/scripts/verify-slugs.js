#!/usr/bin/env node
/**
 * @file verify-slugs.js
 * Fetches every LeetCode problem slug from the practice question bank
 * and reports any that return a non-200 status code.
 *
 * Usage:  node scripts/verify-slugs.js
 * Requires Node.js 18+ (native fetch) or Node 16 with --experimental-fetch.
 *
 * Output: prints OK / FAIL for each slug, then a summary at the end.
 */

import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ─── Because the topic files are ES modules with JSDoc types, we need to
//     extract slugs without running through a bundler.
//     Approach: regex-extract all slug: '...' lines from the source files. ──

const __dirname = dirname(fileURLToPath(import.meta.url));
const topicsDir = join(__dirname, '..', 'src', 'data', 'practice', 'topics');

import { readdirSync } from 'fs';

const files = readdirSync(topicsDir).filter(f => f.endsWith('.js'));

const slugRegex = /slug:\s*['"]([a-z0-9-]+)['"]/g;
const slugSet = new Set();

for (const file of files) {
  const src = readFileSync(join(topicsDir, file), 'utf8');
  let match;
  while ((match = slugRegex.exec(src)) !== null) {
    slugSet.add(match[1]);
  }
}

const slugs = [...slugSet].sort();
console.log(`\nVerifying ${slugs.length} unique slugs against LeetCode...\n`);

const BASE = 'https://leetcode.com/problems/';
const CONCURRENCY = 5; // be polite — don't hammer their CDN
const DELAY_MS = 300;

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkSlug(slug) {
  const url = `${BASE}${slug}/`;
  try {
    const res = await fetch(url, {
      method: 'HEAD',
      headers: { 'User-Agent': 'FleetCode-SlugVerifier/1.0' },
      redirect: 'follow',
    });
    return { slug, status: res.status, ok: res.status === 200 };
  } catch (err) {
    return { slug, status: 'ERROR', ok: false, error: err.message };
  }
}

async function runInBatches(items, batchSize, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
    if (i + batchSize < items.length) {
      await delay(DELAY_MS);
    }
  }
  return results;
}

const results = await runInBatches(slugs, CONCURRENCY, checkSlug);

const failed = results.filter(r => !r.ok);
const passed = results.filter(r => r.ok);

console.log('─'.repeat(60));
for (const r of results) {
  const icon = r.ok ? '✅' : '❌';
  const extra = r.error ? ` (${r.error})` : '';
  console.log(`${icon}  ${r.status}  ${r.slug}${extra}`);
}

console.log('\n' + '─'.repeat(60));
console.log(`✅ Passed: ${passed.length}`);
console.log(`❌ Failed: ${failed.length}`);

if (failed.length > 0) {
  console.log('\nFailed slugs (fix these):');
  for (const r of failed) {
    console.log(`  - ${r.slug}  (status: ${r.status})`);
  }
  process.exit(1);
} else {
  console.log('\nAll slugs verified ✓');
}
