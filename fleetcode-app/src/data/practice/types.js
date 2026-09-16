/**
 * @file types.js
 * Practice module — data model documentation.
 * All objects flowing through this module conform to these JSDoc typedefs.
 */

/**
 * @typedef {'Easy' | 'Medium' | 'Hard'} Difficulty
 */

/**
 * Three-level progressive hint system.
 * @typedef {Object} Hints
 * @property {string} recognition  L1 — what signal in the problem statement points to this pattern family
 * @property {string} structure    L2 — which DS/technique, and *why* this one fits
 * @property {string} skeleton     L3 — approach outline + target complexity
 */

/**
 * A single practice question.
 * @typedef {Object} Question
 * @property {string}     id          Unique kebab-case id  e.g. "koko-eating-bananas"
 * @property {string}     title       Display name
 * @property {string}     slug        LeetCode slug → https://leetcode.com/problems/{slug}/
 * @property {Difficulty} difficulty
 * @property {string}     patternId   Foreign key → Pattern.id
 * @property {Hints}      hints
 */

/**
 * A concrete algorithmic pattern within a topic.
 * `signals` is the most important field — specific phrases from problem statements
 * that indicate this pattern, NOT restatements of the pattern name.
 *
 * BAD:  "Use binary search on the answer"
 * GOOD: "asks for minimum/maximum value that satisfies a condition"
 *
 * @typedef {Object} Pattern
 * @property {string}     id            Unique kebab-case id  e.g. "binary-search-on-answer"
 * @property {string}     topicId       Foreign key → Topic.id
 * @property {string}     name          Display name
 * @property {string[]}   signals       2–4 phrases from problem text that indicate this pattern
 * @property {string}     coreIdea      1–2 sentence essence of the pattern
 * @property {string}     dataStructure DS used (or "None beyond input" for in-place approaches)
 * @property {Question[]} questions     2–3 curated problems, easiest first
 */

/**
 * A DSA topic grouping multiple patterns.
 * @typedef {Object} Topic
 * @property {string}    id       Unique kebab-case id  e.g. "searching-sorting"
 * @property {string}    name     Display name
 * @property {number}    order    Display order (ascending)
 * @property {Pattern[]} patterns
 */

// ─── Attempt / Progress types ────────────────────────────────────────────────

/**
 * @typedef {'clean' | 'hinted' | 'failed'} Outcome
 */

/**
 * Why the user got stuck (only present when outcome !== 'clean').
 * @typedef {'no-approach' | 'implementation' | 'edge-cases' | 'complexity'} StuckReason
 */

/**
 * A single logged practice attempt.
 * @typedef {Object} Attempt
 * @property {string}       questionId
 * @property {string}       patternId
 * @property {string}       topicId
 * @property {string}       date            ISO date string  e.g. "2026-09-16"
 * @property {Outcome}      outcome
 * @property {0|1|2|3}      hintsUsed       Incremented each time a hint card is revealed
 * @property {StuckReason}  [stuckReason]   Only for 'hinted' or 'failed'
 * @property {number}       [minutes]       Optional time taken
 * @property {string}       [note]          One-line key insight, free text
 * @property {string}       nextReviewDate  ISO date string — computed from outcome
 */

// ─── Daily Plan types ─────────────────────────────────────────────────────────

/**
 * A question row inside a daily plan section, augmented with UI state.
 * @typedef {Object} PlanQuestion
 * @property {string}   questionId
 * @property {string}   patternId
 * @property {string}   topicId
 * @property {boolean}  done          Checkbox state
 * @property {boolean}  patternHidden True for Section A (random practice)
 */

/**
 * One generated daily plan.
 * @typedef {Object} DailyPlan
 * @property {string}         date         ISO date  e.g. "2026-09-16"
 * @property {PlanQuestion[]} randomPractice  Section A — 7 questions
 * @property {PlanQuestion[]} weakAreas       Section B — 4 questions
 * @property {PlanQuestion[]} dpFocus         Section C — 2 questions
 * @property {string}         dpSubtopicId    Which DP subtopic today
 * @property {number}         dpDayIndex      Position in the 10-day rotation (1-indexed)
 * @property {string}         dpNextSubtopicId
 * @property {'normal'|'mock'|'revisit'} mode  Saturday=mock, Sunday=revisit, else normal
 */

// ─── Pattern stats (computed, not stored) ────────────────────────────────────

/**
 * Per-pattern statistics derived from attempt history.
 * @typedef {Object} PatternStats
 * @property {string}  patternId
 * @property {number}  attempts            Total logged
 * @property {number}  clean               Count with outcome=clean
 * @property {number}  hinted              Count with outcome=hinted
 * @property {number}  failed              Count with outcome=failed
 * @property {number}  weakness            0–1 (higher = weaker)
 * @property {number}  staleness           0–0.30 staleness bonus
 * @property {number}  priority            weakness + staleness
 * @property {string|null} lastAttemptDate ISO date or null
 * @property {string|null} nextReviewDate  Earliest due date across questions
 */
