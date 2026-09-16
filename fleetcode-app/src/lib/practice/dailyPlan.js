/**
 * @file dailyPlan.js
 * Practice module — deterministic daily plan generator targeting 12 questions daily:
 *  - 6 Random DSA questions (from the 4023 problem pool, DSA only, unsolved)
 *  - 4 Pattern questions (from 4 different DSA pattern topics, unsolved)
 *  - 2 DP questions (from 2 strictly different DP patterns, unsolved)
 */

import { loadPlan, savePlan, todayISO, daysBetween } from './store.js';

export const DP_TOPIC_IDS = [
  'dp-fundamentals',
  'linear-dp',
  'grid-dp',
  'knapsack-pattern',
  'string-dp',
  'advanced-dp',
  'bonus-advanced-dp',
];

const NON_DSA_TAGS = new Set(['Database', 'Shell', 'Concurrency']);

// ─── Seeded RNG (mulberry32) ──────────────────────────────────────────────────

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dateToSeed(isoDate, salt = 0) {
  let hash = salt;
  for (let i = 0; i < isoDate.length; i++) {
    hash = (Math.imul(31, hash) + isoDate.charCodeAt(i)) | 0;
  }
  return hash;
}

export function makeRNG(isoDate, salt = 0) {
  return mulberry32(dateToSeed(isoDate, salt));
}

function isoDateFromDate(date) {
  return date.toISOString().slice(0, 10);
}

// ─── Solved Questions Lookup ──────────────────────────────────────────────────

/**
 * Returns a Set of lowercase slugs, numbers, and IDs that are already solved.
 */
export function getSolvedKeysSet() {
  const set = new Set();

  // 1. From fc-solved-problems (app-wide solved list)
  try {
    const raw = localStorage.getItem('fc-solved-problems');
    if (raw) {
      const arr = JSON.parse(raw);
      for (const item of arr) {
        if (item != null) set.add(String(item).trim().toLowerCase());
      }
    }
  } catch {}

  // 2. From practice store (attempts marked 'clean')
  try {
    const raw = localStorage.getItem('fleetcode.practice.v1');
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.attempts)) {
        for (const a of data.attempts) {
          if (a.outcome === 'clean' && a.questionId) {
            set.add(String(a.questionId).trim().toLowerCase());
          }
          if (a.outcome === 'clean' && a.slug) {
            set.add(String(a.slug).trim().toLowerCase());
          }
        }
      }
    }
  } catch {}

  return set;
}

// ─── DSA Filter ───────────────────────────────────────────────────────────────

export function isDsaProblem(p) {
  if (!p) return false;
  const tags = p.TopicTags || [];
  if (!Array.isArray(tags) || tags.length === 0) return false;
  return tags.some(t => !NON_DSA_TAGS.has(t));
}

// ─── Section 1: 6 Random DSA Questions (from 4023 pool) ───────────────────────

export function buildRandomDsaPractice(allProblems, solvedSet, rng, count = 6) {
  if (!Array.isArray(allProblems) || allProblems.length === 0) return [];

  const candidates = allProblems.filter(p => {
    if (!isDsaProblem(p)) return false;

    const slug = (p.Slug || '').trim().toLowerCase();
    const num = String(p['#']);
    const id = p.id != null ? String(p.id).trim().toLowerCase() : null;

    if (slug && solvedSet.has(slug)) return false;
    if (num && solvedSet.has(num)) return false;
    if (id && solvedSet.has(id)) return false;

    return true;
  });

  if (candidates.length === 0) {
    return allProblems.filter(isDsaProblem).slice(0, count).map(formatProblemForPlan);
  }

  // Shuffle using seeded RNG
  const shuffled = [...candidates];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Balanced mix scaled to count (for 10: 3 Easy, 5 Medium, 2 Hard)
  const easy = shuffled.filter(p => p.Difficulty === 'Easy');
  const med  = shuffled.filter(p => p.Difficulty === 'Medium');
  const hard = shuffled.filter(p => p.Difficulty === 'Hard');

  function pickFrom(list, n) {
    const free = list.filter(p => !p.PaidOnly);
    const pool = free.length >= n ? free : list;
    return pool.slice(0, n);
  }

  const easyTarget = Math.max(1, Math.round(count * 0.3));
  const medTarget  = Math.max(1, Math.round(count * 0.5));
  const hardTarget = Math.max(1, count - easyTarget - medTarget);

  const pickedEasy = pickFrom(easy, easyTarget);
  const pickedMed  = pickFrom(med, medTarget);
  const pickedHard = pickFrom(hard, hardTarget);

  const picked = [...pickedEasy, ...pickedMed, ...pickedHard];

  if (picked.length < count) {
    const pickedNums = new Set(picked.map(p => p['#']));
    for (const p of shuffled) {
      if (picked.length >= count) break;
      if (!pickedNums.has(p['#'])) {
        picked.push(p);
        pickedNums.add(p['#']);
      }
    }
  }

  return picked.slice(0, count).map(formatProblemForPlan);
}

function formatProblemForPlan(p) {
  return {
    id: `prob-${p['#']}`,
    questionId: `prob-${p['#']}`,
    num: p['#'],
    title: p.Title,
    slug: p.Slug,
    difficulty: p.Difficulty || 'Medium',
    tags: p.TopicTags || [],
    acceptance: p.AcceptanceRate,
    done: false,
    sectionType: 'random',
    is4023: true,
  };
}

// ─── Section 2: 4 Pattern Questions (from 4 different pattern topics) ─────────

export function buildPatternPractice(allTopics, solvedSet, rng, count = 4) {
  // Topics 1 to 13 are non-DP pattern topics
  const nonDpTopics = allTopics.filter(t => !DP_TOPIC_IDS.includes(t.id) && !t.id.includes('dp'));
  if (!nonDpTopics.length) return [];

  // Shuffle topics using RNG to select 4 distinct topics
  const shuffledTopics = [...nonDpTopics];
  for (let i = shuffledTopics.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffledTopics[i], shuffledTopics[j]] = [shuffledTopics[j], shuffledTopics[i]];
  }

  const selectedQuestions = [];
  const chosenTopicIds = new Set();

  for (const topic of shuffledTopics) {
    if (selectedQuestions.length >= count) break;
    if (chosenTopicIds.has(topic.id)) continue;

    const pattern = topic.patterns?.[0];
    if (!pattern || !pattern.questions || !pattern.questions.length) continue;

    // Filter questions in this pattern that are NOT yet solved
    const unsolved = pattern.questions.filter(q => {
      const slug = (q.slug || '').trim().toLowerCase();
      const id = (q.id || '').trim().toLowerCase();
      return !solvedSet.has(slug) && !solvedSet.has(id);
    });

    const pool = unsolved.length > 0 ? unsolved : pattern.questions;
    const randomIndex = Math.floor(rng() * pool.length);
    const chosenQ = pool[randomIndex];

    if (chosenQ) {
      selectedQuestions.push({
        id: chosenQ.id,
        questionId: chosenQ.id,
        title: chosenQ.title,
        slug: chosenQ.slug,
        difficulty: chosenQ.difficulty,
        patternId: pattern.id,
        patternName: pattern.name || topic.name,
        topicId: topic.id,
        topicName: topic.name,
        hints: chosenQ.hints,
        done: false,
        sectionType: 'pattern',
      });
      chosenTopicIds.add(topic.id);
    }
  }

  return selectedQuestions;
}

// ─── Section 3: 2 DP Questions (from 2 different DP patterns) ─────────────────

export function buildDifferentPatternDpFocus(allTopics, solvedSet, rng, count = 2) {
  const dpTopics = allTopics.filter(t => DP_TOPIC_IDS.includes(t.id) || t.id.includes('dp'));
  if (dpTopics.length < count) return [];

  // Shuffle DP topics using RNG to select 2 distinct patterns
  const shuffledTopics = [...dpTopics];
  for (let i = shuffledTopics.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffledTopics[i], shuffledTopics[j]] = [shuffledTopics[j], shuffledTopics[i]];
  }

  const selectedQuestions = [];
  const chosenTopicIds = new Set();

  for (const topic of shuffledTopics) {
    if (selectedQuestions.length >= count) break;
    if (chosenTopicIds.has(topic.id)) continue;

    const pattern = topic.patterns?.[0];
    if (!pattern || !pattern.questions || !pattern.questions.length) continue;

    // Filter questions in this pattern that are NOT yet solved
    const unsolved = pattern.questions.filter(q => {
      const slug = (q.slug || '').trim().toLowerCase();
      const id = (q.id || '').trim().toLowerCase();
      return !solvedSet.has(slug) && !solvedSet.has(id);
    });

    const pool = unsolved.length > 0 ? unsolved : pattern.questions;
    const randomIndex = Math.floor(rng() * pool.length);
    const chosenQ = pool[randomIndex];

    if (chosenQ) {
      selectedQuestions.push({
        id: chosenQ.id,
        questionId: chosenQ.id,
        title: chosenQ.title,
        slug: chosenQ.slug,
        difficulty: chosenQ.difficulty,
        patternId: pattern.id,
        patternName: pattern.name || topic.name,
        topicId: topic.id,
        topicName: topic.name,
        hints: chosenQ.hints,
        done: false,
        sectionType: 'dp',
      });
      chosenTopicIds.add(topic.id);
    }
  }

  return selectedQuestions;
}

// ─── Plan Generator ───────────────────────────────────────────────────────────

/**
 * Generate (or retrieve) the daily plan.
 * Total 8 questions = 6 Random DSA + 2 DP Questions (from distinct DP patterns).
 */
export function generatePlan(date, allTopics, allProblems = [], forceRegenerate = false) {
  const isoDate = typeof date === 'string' ? date : isoDateFromDate(date);

  // Return existing plan if already generated and valid for the 8-question structure (6 Random + 2 DP)
  if (!forceRegenerate) {
    const existing = loadPlan(isoDate);
    if (
      existing &&
      Array.isArray(existing.randomPractice) &&
      existing.randomPractice.length === 6 &&
      Array.isArray(existing.dpFocus) &&
      existing.dpFocus.length === 2
    ) {
      return existing;
    }
  }

  const solvedSet = getSolvedKeysSet();
  const rng = makeRNG(isoDate);

  const randomPractice = buildRandomDsaPractice(allProblems, solvedSet, rng, 6);
  const dpFocus        = buildDifferentPatternDpFocus(allTopics, solvedSet, rng, 2);

  const plan = {
    date: isoDate,
    randomPractice,
    dpFocus,
    mode: 'normal',
  };

  savePlan(plan);
  return plan;
}

/**
 * Returns today's plan, generating if needed.
 */
export function getTodaysPlan(allTopics, allProblems = [], forceRegenerate = false) {
  return generatePlan(todayISO(), allTopics, allProblems, forceRegenerate);
}

/**
 * Count total questions in a plan (6 + 2 = 8).
 */
export function planTotalQuestions(plan) {
  if (!plan) return 8;
  return (
    (plan.randomPractice?.length || 0) +
    (plan.dpFocus?.length || 0)
  );
}

/**
 * Count completed questions in a plan.
 */
export function planDoneCount(plan) {
  if (!plan) return 0;
  return [
    ...(plan.randomPractice || []),
    ...(plan.dpFocus || []),
  ].filter(q => q.done).length;
}

/**
 * Get the DP subtopic display name from an ID.
 */
export function dpSubtopicName(id) {
  const names = {
    'dp-fundamentals': 'DP Fundamentals (1D DP)',
    'linear-dp': 'Linear DP',
    'grid-dp': 'Grid DP',
    'knapsack-pattern': 'Knapsack Pattern',
    'string-dp': 'String DP',
    'advanced-dp': 'Advanced DP',
    'bonus-advanced-dp': 'Bonus Advanced DP',
  };
  return names[id] || id;
}
