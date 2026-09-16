/**
 * Topic 5: Prefix Sum
 */

export const prefixSum = {
  id: 'prefix-sum',
  order: 5,
  name: 'Prefix Sum',
  icon: '➕',
  description: 'Precomputing cumulative sums to answer range sum queries in O(1) time and find subarray conditions with hash maps.',
  patterns: [
    {
      id: 'prefix-sum-core',
      name: 'Prefix Sum',
      topicId: 'prefix-sum',
      signals: ['Range sum queries', 'Subarrays with sum equal to or divisible by K', 'Balancing counts (e.g. 0s and 1s)'],
      coreIdea: 'Any range sum subarray sum(i..j) = prefix[j] - prefix[i-1]. Pair with hash map to store frequencies/indices of prior prefix sums.',
      dataStructure: 'Array / Hash Map',
      questions: [
        {
          id: 'ps-subarray-sum-k',
          title: 'Subarray Sum Equals K',
          slug: 'subarray-sum-equals-k',
          difficulty: 'Medium',
          patternId: 'prefix-sum-core',
          hints: {
            recognition: 'Total number of continuous subarrays whose sum equals k (can contain negative numbers).',
            structure: 'Hash map stores prefix sum counts: map.get(currSum - k). Initialize map with {0: 1}.',
            skeleton: 'const map = new Map([[0, 1]]);\nlet sum = 0, count = 0;\nfor (const n of nums) {\n  sum += n;\n  if (map.has(sum - k)) count += map.get(sum - k);\n  map.set(sum, (map.get(sum) || 0) + 1);\n}\nreturn count;',
          },
        },
        {
          id: 'ps-pivot-index',
          title: 'Pivot Index',
          slug: 'find-pivot-index',
          difficulty: 'Easy',
          patternId: 'prefix-sum-core',
          hints: {
            recognition: 'Index where sum of numbers to the left equals sum of numbers to the right.',
            structure: 'Calculate total sum. Left sum starts at 0. At index i, right sum = total - left - nums[i].',
            skeleton: 'const total = nums.reduce((a, b) => a + b, 0);\nlet left = 0;\nfor (let i = 0; i < nums.length; i++) {\n  if (left === total - left - nums[i]) return i;\n  left += nums[i];\n}\nreturn -1;',
          },
        },
        {
          id: 'ps-subarrays-divisible-k',
          title: 'Subarrays Divisible by K',
          slug: 'subarray-sums-divisible-by-k',
          difficulty: 'Medium',
          patternId: 'prefix-sum-core',
          hints: {
            recognition: 'Number of non-empty subarrays that have a sum divisible by k.',
            structure: 'Store remainder counts in map/array: remainder = ((sum % k) + k) % k.',
            skeleton: 'const rem = new Array(k).fill(0);\nrem[0] = 1;\nlet sum = 0, count = 0;\nfor (const n of nums) {\n  sum = ((sum + n) % k + k) % k;\n  count += rem[sum];\n  rem[sum]++;\n}\nreturn count;',
          },
        },
        {
          id: 'ps-contiguous-array',
          title: 'Contiguous Array',
          slug: 'contiguous-array',
          difficulty: 'Medium',
          patternId: 'prefix-sum-core',
          hints: {
            recognition: 'Maximum length of a contiguous subarray with equal number of 0 and 1.',
            structure: 'Transform 0 to -1. Find longest subarray with sum = 0 using hash map of first seen indices.',
            skeleton: 'const map = new Map([[0, -1]]);\nlet sum = 0, maxLen = 0;\nfor (let i = 0; i < nums.length; i++) {\n  sum += nums[i] === 1 ? 1 : -1;\n  if (map.has(sum)) maxLen = Math.max(maxLen, i - map.get(sum));\n  else map.set(sum, i);\n}\nreturn maxLen;',
          },
        },
        {
          id: 'ps-shortest-subarray-k',
          title: 'Shortest Subarray K',
          slug: 'shortest-subarray-with-sum-at-least-k',
          difficulty: 'Hard',
          patternId: 'prefix-sum-core',
          hints: {
            recognition: 'Shortest non-empty subarray with sum at least k where elements can be negative.',
            structure: 'Prefix sums with monotonic deque of increasing prefix sums to maintain optimal left bounds.',
            skeleton: 'const P = [0]; for (const x of nums) P.push(P[P.length - 1] + x);\nconst deque = []; let ans = Infinity;\nfor (let y = 0; y < P.length; y++) {\n  while (deque.length && P[y] - P[deque[0]] >= k) ans = Math.min(ans, y - deque.shift());\n  while (deque.length && P[y] <= P[deque[deque.length - 1]]) deque.pop();\n  deque.push(y);\n}\nreturn ans === Infinity ? -1 : ans;',
          },
        },
        {
          id: 'ps-count-range-sum',
          title: 'Count Range Sum',
          slug: 'count-of-range-sum',
          difficulty: 'Hard',
          patternId: 'prefix-sum-core',
          hints: {
            recognition: 'Count subarrays whose sums lie in [lower, upper] inclusive.',
            structure: 'Prefix sums + merge sort or Fenwick tree. During merge sort, count pairs satisfying lower <= P[j] - P[i] <= upper.',
            skeleton: 'const P = [0]; for (const x of nums) P.push(P[P.length-1] + x);\nfunction countWhileMergeSort(lo, hi) {\n  if (hi - lo <= 1) return 0;\n  const mid = (lo + hi) >> 1;\n  let count = countWhileMergeSort(lo, mid) + countWhileMergeSort(mid, hi);\n  let j = mid, k = mid;\n  for (let i = lo; i < mid; i++) {\n    while (k < hi && P[k] - P[i] < lower) k++;\n    while (j < hi && P[j] - P[i] <= upper) j++;\n    count += j - k;\n  }\n  // merge step\n  return count;\n}',
          },
        },
      ],
    },
  ],
};
