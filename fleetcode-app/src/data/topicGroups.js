// 16 topic categories based on user's specification
// Ordered in logical learning sequence

export const TOPIC_CATEGORIES = [
  {
    id: 'array-sequence',
    title: 'Array & Sequence Techniques',
    icon: '🧱',
    color: '#3b82f6',
    subtopics: [
      { name: 'Array',          count: 2204, difficulty: 'Med-Hard' },
      { name: 'Two Pointers',   count: 251,  difficulty: 'Medium' },
      { name: 'Sliding Window', count: 162,  difficulty: 'Med-Hard' },
      { name: 'Prefix Sum',     count: 246,  difficulty: 'Medium' },
      { name: 'Matrix',         count: 277,  difficulty: 'Med-Hard' },
    ],
  },
  {
    id: 'string',
    title: 'String',
    icon: '🔤',
    color: '#10b981',
    subtopics: [
      { name: 'String',          count: 874, difficulty: 'Med-Hard' },
      { name: 'String Matching', count: 37,  difficulty: 'Med-Hard' },
      { name: 'Rolling Hash',    count: 33,  difficulty: 'Hard' },
      { name: 'Suffix Array',    count: 9,   difficulty: 'Hard' },
    ],
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    icon: '🔗',
    color: '#6366f1',
    subtopics: [
      { name: 'Linked List',        count: 81, difficulty: 'Easy' },
      { name: 'Doubly-Linked List', count: 13, difficulty: 'Easy' },
    ],
  },
  {
    id: 'stack-queue',
    title: 'Stack & Queue',
    icon: '📚',
    color: '#f59e0b',
    subtopics: [
      { name: 'Stack',            count: 179, difficulty: 'Medium' },
      { name: 'Queue',            count: 58,  difficulty: 'Easy' },
      { name: 'Monotonic Stack',  count: 72,  difficulty: 'Med-Hard' },
      { name: 'Monotonic Queue',  count: 25,  difficulty: 'Hard' },
    ],
  },
  {
    id: 'searching',
    title: 'Searching',
    icon: '🔍',
    color: '#8b5cf6',
    subtopics: [
      { name: 'Binary Search', count: 349, difficulty: 'Med-Hard' },
      { name: 'Quickselect',   count: 8,   difficulty: 'Med-Hard' },
    ],
  },
  {
    id: 'sorting',
    title: 'Sorting',
    icon: '↕️',
    color: '#14b8a6',
    subtopics: [
      { name: 'Sorting',       count: 502, difficulty: 'Med-Hard' },
      { name: 'Merge Sort',    count: 16,  difficulty: 'Medium' },
      { name: 'Bucket Sort',   count: 6,   difficulty: 'Medium' },
      { name: 'Counting Sort', count: 10,  difficulty: 'Easy' },
      { name: 'Radix Sort',    count: 3,   difficulty: 'Medium' },
      { name: 'Shell',         count: 4,   difficulty: 'Easy' },
    ],
  },
  {
    id: 'hashing',
    title: 'Hashing',
    icon: '#️⃣',
    color: '#ec4899',
    subtopics: [
      { name: 'Hash Table',   count: 788, difficulty: 'Easy' },
      { name: 'Hash Function',count: 43,  difficulty: 'Medium' },
    ],
  },
  {
    id: 'recursion-backtracking',
    title: 'Recursion, Backtracking & Divide-and-Conquer',
    icon: '🔄',
    color: '#f97316',
    subtopics: [
      { name: 'Recursion',           count: 50,  difficulty: 'Medium' },
      { name: 'Backtracking',        count: 111, difficulty: 'Med-Hard' },
      { name: 'Divide and Conquer',  count: 66,  difficulty: 'Med-Hard' },
    ],
  },
  {
    id: 'trees',
    title: 'Trees',
    icon: '🌲',
    color: '#22c55e',
    subtopics: [
      { name: 'Tree',                 count: 264, difficulty: 'Med-Hard' },
      { name: 'Binary Tree',          count: 179, difficulty: 'Med-Hard' },
      { name: 'Binary Search Tree',   count: 41,  difficulty: 'Med-Hard' },
      { name: 'Segment Tree',         count: 80,  difficulty: 'Hard' },
      { name: 'Binary Indexed Tree',  count: 48,  difficulty: 'Hard' },
      { name: 'Trie',                 count: 60,  difficulty: 'Med-Hard' },
    ],
  },
  {
    id: 'heap',
    title: 'Heap',
    icon: '⛏️',
    color: '#a855f7',
    subtopics: [
      { name: 'Heap (Priority Queue)', count: 212, difficulty: 'Med-Hard' },
    ],
  },
  {
    id: 'graph',
    title: 'Graph',
    icon: '🕸️',
    color: '#ef4444',
    subtopics: [
      { name: 'Graph',                         count: 189, difficulty: 'Hard' },
      { name: 'Depth-First Search',            count: 338, difficulty: 'Med-Hard' },
      { name: 'Breadth-First Search',          count: 257, difficulty: 'Med-Hard' },
      { name: 'Topological Sort',              count: 38,  difficulty: 'Med-Hard' },
      { name: 'Union Find',                    count: 98,  difficulty: 'Med-Hard' },
      { name: 'Shortest Path',                 count: 41,  difficulty: 'Hard' },
      { name: 'Minimum Spanning Tree',         count: 6,   difficulty: 'Hard' },
      { name: 'Strongly Connected Component',  count: 3,   difficulty: 'Hard' },
      { name: 'Biconnected Component',         count: 1,   difficulty: 'Hard' },
      { name: 'Eulerian Circuit',              count: 3,   difficulty: 'Hard' },
    ],
  },
  {
    id: 'dynamic-programming',
    title: 'Dynamic Programming',
    icon: '🧮',
    color: '#0ea5e9',
    subtopics: [
      { name: 'Dynamic Programming', count: 668, difficulty: 'Hard' },
      { name: 'Memoization',         count: 42,  difficulty: 'Med-Hard' },
    ],
  },
  {
    id: 'greedy',
    title: 'Greedy',
    icon: '💰',
    color: '#d97706',
    subtopics: [
      { name: 'Greedy', count: 483, difficulty: 'Med-Hard' },
    ],
  },
  {
    id: 'math-number-theory',
    title: 'Math, Number Theory & Combinatorics',
    icon: '🔢',
    color: '#64748b',
    subtopics: [
      { name: 'Math',                    count: 684, difficulty: 'Med-Hard' },
      { name: 'Number Theory',           count: 95,  difficulty: 'Hard' },
      { name: 'Combinatorics',           count: 63,  difficulty: 'Hard' },
      { name: 'Game Theory',             count: 30,  difficulty: 'Hard' },
      { name: 'Geometry',                count: 45,  difficulty: 'Hard' },
      { name: 'Bit Manipulation',        count: 282, difficulty: 'Hard' },
      { name: 'Bitmask',                 count: 56,  difficulty: 'Hard' },
      { name: 'Brainteaser',             count: 21,  difficulty: 'Hard' },
      { name: 'Probability and Statistics', count: 7, difficulty: 'Hard' },
      { name: 'Randomized',              count: 12,  difficulty: 'Hard' },
      { name: 'Rejection Sampling',      count: 2,   difficulty: 'Medium' },
      { name: 'Reservoir Sampling',      count: 4,   difficulty: 'Medium' },
      { name: 'Line Sweep',              count: 5,   difficulty: 'Hard' },
      { name: 'Counting',                count: 200, difficulty: 'Medium' },
      { name: 'Enumeration',             count: 149, difficulty: 'Medium' },
    ],
  },
  {
    id: 'design',
    title: 'Design / Data Structure Design',
    icon: '🏛️',
    color: '#475569',
    subtopics: [
      { name: 'Design',       count: 132, difficulty: 'Med-Hard' },
      { name: 'Data Stream',  count: 21,  difficulty: 'Hard' },
      { name: 'Iterator',     count: 9,   difficulty: 'Medium' },
      { name: 'Ordered Set',  count: 78,  difficulty: 'Hard' },
      { name: 'Concurrency',  count: 9,   difficulty: 'Hard' },
    ],
  },
  {
    id: 'other',
    title: 'Other / Not Core DSA',
    icon: '📦',
    color: '#94a3b8',
    subtopics: [
      { name: 'Simulation', count: 209, difficulty: 'Medium' },
      { name: 'Database',   count: 291, difficulty: 'Medium' },
      { name: 'Interactive',count: 23,  difficulty: 'Medium' },
    ],
  },
];

// Flat list of all subtopics for lookup
export const ALL_TOPICS_FLAT = TOPIC_CATEGORIES.flatMap(c =>
  c.subtopics.map(s => ({ ...s, categoryId: c.id, categoryTitle: c.title }))
);

// Map topic name → { difficulty, categoryId }
export const TOPIC_META = {};
ALL_TOPICS_FLAT.forEach(t => {
  TOPIC_META[t.name] = { difficulty: t.difficulty, categoryId: t.categoryId };
});

// Topic name → URL slug
export function topicToSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
// Slug → topic name (reverse lookup)
export function slugToTopicName(slug) {
  const found = ALL_TOPICS_FLAT.find(t => topicToSlug(t.name) === slug);
  return found ? found.name : null;
}
