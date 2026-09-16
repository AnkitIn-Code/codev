/**
 * @file index.js
 * Aggregates all 20 curated practice topics into a single ordered array.
 * Import this wherever you need the full topic/pattern/question tree.
 */

import { twoPointers }           from './topics/two-pointers.js';
import { fastSlowPointers }      from './topics/fast-slow-pointers.js';
import { slidingWindow }         from './topics/sliding-window.js';
import { kadanePattern }         from './topics/kadane-pattern.js';
import { prefixSum }             from './topics/prefix-sum.js';
import { mergeIntervals }        from './topics/merge-intervals.js';
import { linkedListReversal }    from './topics/linked-list-reversal.js';
import { stackTopic }            from './topics/stack.js';
import { binarySearch }          from './topics/binary-search.js';
import { heapTopic }             from './topics/heap.js';
import { recursionBacktracking } from './topics/recursion-backtracking.js';
import { treesTopic }            from './topics/trees.js';
import { graphsTopic }           from './topics/graphs.js';
import { dpFundamentals }        from './topics/dp-fundamentals.js';
import { linearDP }              from './topics/linear-dp.js';
import { gridDP }                from './topics/grid-dp.js';
import { knapsackPattern }       from './topics/knapsack-pattern.js';
import { stringDP }              from './topics/string-dp.js';
import { advancedDP }            from './topics/advanced-dp.js';
import { bonusAdvancedDP }       from './topics/bonus-advanced-dp.js';

/**
 * All 20 practice topics, ordered by their `order` field.
 * @type {import('./types').Topic[]}
 */
export const ALL_TOPICS = [
  twoPointers,
  fastSlowPointers,
  slidingWindow,
  kadanePattern,
  prefixSum,
  mergeIntervals,
  linkedListReversal,
  stackTopic,
  binarySearch,
  heapTopic,
  recursionBacktracking,
  treesTopic,
  graphsTopic,
  dpFundamentals,
  linearDP,
  gridDP,
  knapsackPattern,
  stringDP,
  advancedDP,
  bonusAdvancedDP,
].sort((a, b) => a.order - b.order);

/**
 * Flat map of all patterns across all topics.
 * @type {import('./types').Pattern[]}
 */
export const ALL_PATTERNS = ALL_TOPICS.flatMap(t => t.patterns);

/**
 * Flat map of all questions across all topics and patterns.
 * @type {import('./types').Question[]}
 */
export const ALL_QUESTIONS = ALL_PATTERNS.flatMap(p => p.questions);

/**
 * Look up a pattern by its ID.
 * @param {string} patternId
 * @returns {import('./types').Pattern | undefined}
 */
export function getPatternById(patternId) {
  return ALL_PATTERNS.find(p => p.id === patternId);
}

/**
 * Look up a topic by its ID.
 * @param {string} topicId
 * @returns {import('./types').Topic | undefined}
 */
export function getTopicById(topicId) {
  return ALL_TOPICS.find(t => t.id === topicId);
}

/**
 * Look up a question by its ID.
 * @param {string} questionId
 * @returns {import('./types').Question | undefined}
 */
export function getQuestionById(questionId) {
  return ALL_QUESTIONS.find(q => q.id === questionId);
}

/**
 * Get all questions in a given pattern.
 * @param {string} patternId
 * @returns {import('./types').Question[]}
 */
export function getQuestionsByPattern(patternId) {
  return ALL_QUESTIONS.filter(q => q.patternId === patternId);
}
