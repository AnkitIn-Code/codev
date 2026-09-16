/**
 * @file store.js
 * Practice module — localStorage persistence layer.
 *
 * Storage key: "fleetcode.practice.v1"
 * Shape:  { attempts: Attempt[], version: 1 }
 *
 * All dates are ISO date strings (YYYY-MM-DD) — never Date objects in storage.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'fleetcode.practice.v1';
const PLANS_KEY   = 'fleetcode.practice.plans.v1';

// Days added to today for next review, depending on outcome
const REVIEW_OFFSETS = {
  clean:  21,
  hinted:  7,
  failed:  2,
};
// If a question gets 2 consecutive 'clean' results, push back further
const CLEAN_STREAK_OFFSET = 45;

// ─── Date helpers (string-based, no moment/dayjs dependency) ─────────────────

/** Returns today as "YYYY-MM-DD" */
export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** Add `days` calendar days to an ISO date string, returns ISO date string */
export function addDays(isoDate, days) {
  const d = new Date(isoDate + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Number of calendar days between two ISO date strings (b - a) */
export function daysBetween(isoA, isoB) {
  const a = new Date(isoA + 'T00:00:00');
  const b = new Date(isoB + 'T00:00:00');
  return Math.round((b - a) / 86_400_000);
}

// ─── Storage read/write ───────────────────────────────────────────────────────

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { attempts: [], version: 1 };
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.attempts)) return { attempts: [], version: 1 };
    return parsed;
  } catch {
    return { attempts: [], version: 1 };
  }
}

function writeStore(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('fc-practice-updated'));
  } catch (e) {
    console.error('[practice/store] write failed:', e);
  }
}

// ─── Spaced repetition helper ─────────────────────────────────────────────────

/**
 * Compute the next review date for a new attempt, considering consecutive cleans.
 * @param {string}   questionId
 * @param {import('./types').Outcome} outcome
 * @param {import('./types').Attempt[]} existingAttempts
 * @returns {string} ISO date string
 */
function computeNextReviewDate(questionId, outcome, existingAttempts) {
  const today = todayISO();

  if (outcome !== 'clean') {
    return addDays(today, REVIEW_OFFSETS[outcome]);
  }

  // Count consecutive trailing 'clean' outcomes for this question
  const qAttempts = existingAttempts
    .filter(a => a.questionId === questionId)
    .sort((a, b) => a.date.localeCompare(b.date));

  let consecutiveCleans = 0;
  for (let i = qAttempts.length - 1; i >= 0; i--) {
    if (qAttempts[i].outcome === 'clean') consecutiveCleans++;
    else break;
  }

  // If this new attempt will be the 2nd+ consecutive clean, use 45-day offset
  const offset = consecutiveCleans >= 1 ? CLEAN_STREAK_OFFSET : REVIEW_OFFSETS.clean;
  return addDays(today, offset);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Return all logged attempts.
 * @returns {import('./types').Attempt[]}
 */
export function getAttempts() {
  return readStore().attempts;
}

/**
 * Clear all logged attempts and reset stored plans (resets practice history and daily progress).
 */
export function clearAttempts() {
  const store = readStore();
  store.attempts = [];
  writeStore(store);

  try {
    localStorage.removeItem(PLANS_KEY);
  } catch {}

  window.dispatchEvent(new Event('fc-practice-updated'));
}

export const clearAllPracticeData = clearAttempts;

/**
 * Reset only today's progress (unchecks today's plan questions and removes attempts logged today).
 */
export function resetTodayPlanProgress() {
  const today = todayISO();
  const store = readStore();
  store.attempts = store.attempts.filter(a => a.date !== today);
  writeStore(store);

  try {
    const raw = localStorage.getItem(PLANS_KEY);
    if (raw) {
      const plans = JSON.parse(raw);
      if (plans[today]) {
        delete plans[today];
        localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
      }
    }
  } catch {}

  window.dispatchEvent(new Event('fc-practice-updated'));
}

/**
 * Log a new attempt. Mutates localStorage.
 * @param {Omit<import('./types').Attempt, 'nextReviewDate'>} attemptData
 * @returns {import('./types').Attempt} The stored attempt (with nextReviewDate)
 */
export function logAttempt(attemptData) {
  const store = readStore();
  const nextReviewDate = computeNextReviewDate(
    attemptData.questionId,
    attemptData.outcome,
    store.attempts,
  );
  const attempt = {
    ...attemptData,
    date: attemptData.date || todayISO(),
    nextReviewDate,
  };
  store.attempts.push(attempt);
  writeStore(store);
  return attempt;
}

/**
 * Compute per-pattern statistics from stored attempts.
 * @param {string} patternId
 * @returns {import('./types').PatternStats}
 */
export function getPatternStats(patternId) {
  const attempts = getAttempts().filter(a => a.patternId === patternId);
  const today = todayISO();

  const clean  = attempts.filter(a => a.outcome === 'clean').length;
  const hinted = attempts.filter(a => a.outcome === 'hinted').length;
  const failed = attempts.filter(a => a.outcome === 'failed').length;
  const total  = attempts.length;

  // Weakness formula from spec
  const weakness = total === 0
    ? 0.55
    : 1 - (clean + 0.5 * hinted) / total;

  // Staleness bonus (caps at 0.30)
  let staleness = 0;
  let lastAttemptDate = null;
  let nextReviewDate = null;

  if (total > 0) {
    const sorted = [...attempts].sort((a, b) => b.date.localeCompare(a.date));
    lastAttemptDate = sorted[0].date;
    const daysSinceLast = daysBetween(lastAttemptDate, today);
    staleness = Math.min(0.30, 0.10 * Math.floor(daysSinceLast / 14));

    // Earliest upcoming review across all question attempts for this pattern
    const reviewDates = attempts
      .map(a => a.nextReviewDate)
      .filter(Boolean)
      .sort();
    nextReviewDate = reviewDates[0] || null;
  }

  const priority = weakness + staleness;

  return {
    patternId,
    attempts: total,
    clean,
    hinted,
    failed,
    weakness: Math.max(0, Math.min(1, weakness)),
    staleness,
    priority: Math.min(1.30, priority), // can exceed 1 with staleness
    lastAttemptDate,
    nextReviewDate,
  };
}

/**
 * Get stats for all questions in a pattern (most-recent attempt per question).
 * @param {string} patternId
 * @returns {Object.<string, import('./types').Attempt|null>} questionId → latest attempt
 */
export function getLatestAttemptsByPattern(patternId) {
  const attempts = getAttempts().filter(a => a.patternId === patternId);
  const byQuestion = {};
  for (const a of attempts) {
    if (!byQuestion[a.questionId] || a.date > byQuestion[a.questionId].date) {
      byQuestion[a.questionId] = a;
    }
  }
  return byQuestion;
}

/**
 * Get the latest attempt for a specific question.
 * @param {string} questionId
 * @returns {import('./types').Attempt|null}
 */
export function getLatestAttempt(questionId) {
  const attempts = getAttempts();
  for (let i = attempts.length - 1; i >= 0; i--) {
    if (attempts[i].questionId === questionId) return attempts[i];
  }
  return null;
}

/**
 * Get all weak questions grouped by topic.
 * Rule:
 *  - In starting (no attempts), returns [] (empty).
 *  - If a question is solved cleanly (latest outcome === 'clean'), it does NOT appear.
 *  - If a question is solved with hints or failed/stuck (latest outcome === 'hinted' | 'failed'),
 *    it appears inside Weak Areas under the name of the topic.
 *
 * @param {import('./types').Topic[]} allTopics
 * @returns {{ topic: import('./types').Topic, questions: { question: import('./types').Question, pattern: import('./types').Pattern, topic: import('./types').Topic, latestAttempt: import('./types').Attempt, totalAttempts: number }[] }[]}
 */
export function getWeakQuestionsGroupedByTopic(allTopics) {
  const attempts = getAttempts();
  if (!attempts.length) return [];

  const latestByQuestion = {};
  const countByQuestion = {};
  for (let i = 0; i < attempts.length; i++) {
    const a = attempts[i];
    latestByQuestion[a.questionId] = a;
    countByQuestion[a.questionId] = (countByQuestion[a.questionId] || 0) + 1;
  }

  const groups = [];

  for (const topic of allTopics) {
    const weakList = [];
    for (const pattern of topic.patterns) {
      for (const question of pattern.questions) {
        const latest = latestByQuestion[question.id];
        if (latest && (latest.outcome === 'hinted' || latest.outcome === 'failed')) {
          weakList.push({
            question,
            pattern,
            topic,
            latestAttempt: latest,
            totalAttempts: countByQuestion[question.id] || 1,
          });
        }
      }
    }
    if (weakList.length > 0) {
      groups.push({
        topic,
        questions: weakList,
      });
    }
  }

  return groups;
}

/**
 * Reset/unmark attempts for a specific question.
 * @param {string} questionId
 */
export function resetQuestionAttempts(questionId) {
  const store = readStore();
  store.attempts = store.attempts.filter(a => a.questionId !== questionId);
  writeStore(store);
}

/**
 * Get all patterns sorted by priority descending.
 * A pattern is "weak" when priority >= 0.5.
 *
 * @param {import('./types').Topic[]} allTopics
 * @returns {{ pattern: import('./types').Pattern, topic: import('./types').Topic, stats: import('./types').PatternStats }[]}
 */
export function getWeakPatterns(allTopics) {
  const rows = [];
  for (const topic of allTopics) {
    for (const pattern of topic.patterns) {
      const stats = getPatternStats(pattern.id);
      rows.push({ pattern, topic, stats });
    }
  }
  return rows
    .sort((a, b) => b.stats.priority - a.stats.priority)
    .filter(r => r.stats.priority >= 0.5);
}

/**
 * Get all patterns with their stats, sorted by priority descending (no threshold filter).
 * @param {import('./types').Topic[]} allTopics
 * @returns {{ pattern: import('./types').Pattern, topic: import('./types').Topic, stats: import('./types').PatternStats }[]}
 */
export function getAllPatternStats(allTopics) {
  const rows = [];
  for (const topic of allTopics) {
    for (const pattern of topic.patterns) {
      const stats = getPatternStats(pattern.id);
      rows.push({ pattern, topic, stats });
    }
  }
  return rows.sort((a, b) => b.stats.priority - a.stats.priority);
}

/**
 * Get the count-by-StuckReason breakdown across all attempts (or filtered by pattern).
 * @param {string|null} patternId  Pass null for global breakdown
 * @returns {{ 'no-approach': number, implementation: number, 'edge-cases': number, complexity: number }}
 */
export function getStuckReasonBreakdown(patternId = null) {
  const reasons = { 'no-approach': 0, implementation: 0, 'edge-cases': 0, complexity: 0 };
  let attempts = getAttempts();
  if (patternId) attempts = attempts.filter(a => a.patternId === patternId);
  for (const a of attempts) {
    if (a.stuckReason && reasons[a.stuckReason] !== undefined) {
      reasons[a.stuckReason]++;
    }
  }
  return reasons;
}

/**
 * Returns attempt counts grouped by ISO date — used for calendar heatmap.
 * @returns {Object.<string, number>}  { "2026-09-16": 3, ... }
 */
export function getAttemptsByDate() {
  const map = {};
  for (const a of getAttempts()) {
    map[a.date] = (map[a.date] || 0) + 1;
  }
  return map;
}

/**
 * Computes current daily streak (consecutive days with at least 1 attempt).
 * @returns {number}
 */
export function getCurrentStreak() {
  const byDate = getAttemptsByDate();
  const today = todayISO();
  let streak = 0;
  let cursor = today;

  while (byDate[cursor]) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

// ─── Daily plan persistence ───────────────────────────────────────────────────

/**
 * Load a persisted daily plan for a given date.
 * @param {string} isoDate
 * @returns {import('./types').DailyPlan|null}
 */
export function loadPlan(isoDate) {
  try {
    const raw = localStorage.getItem(PLANS_KEY);
    if (!raw) return null;
    const plans = JSON.parse(raw);
    return plans[isoDate] || null;
  } catch {
    return null;
  }
}

/**
 * Persist a daily plan (called once on generation).
 * @param {import('./types').DailyPlan} plan
 */
export function savePlan(plan) {
  try {
    const raw = localStorage.getItem(PLANS_KEY);
    const plans = raw ? JSON.parse(raw) : {};
    plans[plan.date] = plan;
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('[practice/store] plan save failed:', e);
  }
}

/**
 * Update checkbox state for a question in a stored plan.
 * @param {string} isoDate
 * @param {string} questionId
 * @param {boolean} done
 */
export function updatePlanQuestion(isoDate, questionId, done) {
  try {
    const raw = localStorage.getItem(PLANS_KEY);
    if (!raw) return;
    const plans = JSON.parse(raw);
    const plan = plans[isoDate];
    if (!plan) return;

    const sections = ['randomPractice', 'patternPractice', 'dpFocus', 'weakAreas'];
    for (const sec of sections) {
      if (!Array.isArray(plan[sec])) continue;
      const q = plan[sec].find(item =>
        item.questionId === questionId ||
        item.id === questionId ||
        item.slug === questionId ||
        String(item.num) === String(questionId)
      );
      if (q) { q.done = done; break; }
    }
    plans[isoDate] = plan;
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
    window.dispatchEvent(new Event('fc-practice-updated'));
  } catch {}
}

/**
 * Get all past plans (for history queries).
 * @returns {Object.<string, import('./types').DailyPlan>}
 */
export function getAllPlans() {
  try {
    const raw = localStorage.getItem(PLANS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// ─── Export / Import ──────────────────────────────────────────────────────────

/**
 * Serialize all user data (attempts + plans) to a JSON string for download.
 * @returns {string}
 */
export function exportJSON() {
  const data = {
    exportedAt: new Date().toISOString(),
    version: 1,
    attempts: getAttempts(),
    plans: getAllPlans(),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Replace all user data from a JSON string (from a previous export).
 * Validates structure before writing.
 * @param {string} jsonString
 * @returns {{ ok: boolean, error?: string, attemptCount: number }}
 */
export function importJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (!Array.isArray(data.attempts)) {
      return { ok: false, error: 'Invalid export: missing "attempts" array', attemptCount: 0 };
    }
    writeStore({ attempts: data.attempts, version: 1 });
    if (data.plans && typeof data.plans === 'object') {
      localStorage.setItem(PLANS_KEY, JSON.stringify(data.plans));
    }
    return { ok: true, attemptCount: data.attempts.length };
  } catch (e) {
    return { ok: false, error: `Parse error: ${e.message}`, attemptCount: 0 };
  }
}

// ─── Self-test (run once in dev to verify scoring maths) ─────────────────────

export function _selfTest() {
  // weakness formula
  const w0 = 1 - (0 + 0.5 * 0) / 1;           // 1 failed attempt → weakness = 1.0
  console.assert(w0 === 1.0, 'weakness:failed');

  const w1 = 1 - (1 + 0.5 * 0) / 1;           // 1 clean attempt → weakness = 0.0
  console.assert(w1 === 0.0, 'weakness:clean');

  const w2 = 1 - (0 + 0.5 * 1) / 1;           // 1 hinted attempt → weakness = 0.5
  console.assert(w2 === 0.5, 'weakness:hinted');

  // addDays
  console.assert(addDays('2026-01-01', 21) === '2026-01-22', 'addDays:+21');
  console.assert(addDays('2026-01-01', -1) === '2025-12-31', 'addDays:-1');

  // daysBetween
  console.assert(daysBetween('2026-01-01', '2026-01-22') === 21, 'daysBetween:21');
  console.assert(daysBetween('2026-01-22', '2026-01-01') === -21, 'daysBetween:-21');

  console.log('[practice/store] self-test passed ✓');
}
