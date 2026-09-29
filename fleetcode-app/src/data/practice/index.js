/**
 * @file index.js
 * Aggregates all curated practice topics into a single ordered array.
 *
 * Topics 1-13  : Core data-structure / algorithm patterns
 * Topic  14    : Dynamic Programming (unified — 8 named patterns)
 * Topics 15-20 : NEW topics (Greedy, Trie, Union-Find, Bit Manipulation,
 *                Monotonic Stack, Sorting, Segment Tree)
 *
 * NOTE: The old separate DP files (dp-fundamentals, linear-dp, grid-dp,
 *       knapsack-pattern, string-dp, advanced-dp, bonus-advanced-dp) are
 *       replaced by the unified `dynamic-programming` topic.
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
// Unified DP (replaces 7 old DP topic files)
import { dynamicProgramming }    from './topics/dynamic-programming.js';
// New topics
import { greedyAlgorithms }      from './topics/greedy.js';
import { trieTopic }             from './topics/trie.js';
import { unionFindTopic }        from './topics/union-find.js';
import { bitManipulation }       from './topics/bit-manipulation.js';
import { monotonicStackTopic }   from './topics/monotonic-stack.js';
import { sortingTopic }          from './topics/sorting.js';
import { segmentTreeTopic }      from './topics/segment-tree.js';

/**
 * All practice topics, ordered by their `order` field.
 * @type {import('./types').Topic[]}
 */
export const ALL_TOPICS = [
  twoPointers,           // 1
  fastSlowPointers,      // 2
  slidingWindow,         // 3
  kadanePattern,         // 4
  prefixSum,             // 5
  mergeIntervals,        // 6
  linkedListReversal,    // 7
  stackTopic,            // 8
  binarySearch,          // 9
  heapTopic,             // 10
  recursionBacktracking, // 11
  treesTopic,            // 12
  graphsTopic,           // 13
  dynamicProgramming,    // 14  ← unified DP
  greedyAlgorithms,      // 21 → sorted to 15
  trieTopic,             // 22 → sorted to 16
  unionFindTopic,        // 23 → sorted to 17
  bitManipulation,       // 24 → sorted to 18
  monotonicStackTopic,   // 25 → sorted to 19
  sortingTopic,          // 26 → sorted to 20
  segmentTreeTopic,      // 27 → sorted to 21
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
