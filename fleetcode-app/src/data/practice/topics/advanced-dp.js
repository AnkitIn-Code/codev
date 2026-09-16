/**
 * Topic 19: Advanced DP
 */

export const advancedDP = {
  id: 'advanced-dp',
  order: 19,
  name: 'Advanced DP',
  icon: '⚡',
  description: 'Patience sorting O(N log N) LIS optimization and interval DP with bottom-up subsegment splitting.',
  patterns: [
    {
      id: 'advanced-dp-core',
      name: 'Advanced DP',
      topicId: 'advanced-dp',
      signals: ['LIS in O(N log N) time', 'Interval DP splitting subsegments [i, j] around last chosen pivot k', 'Balloons popping / matrix chain multiplication'],
      coreIdea: 'Combine DP with binary search (patience sorting tails array), or iterate over interval length len from 1 to N and choose optimal final split pivot k.',
      dataStructure: 'Tails Array / Interval Matrix',
      questions: [
        {
          id: 'adp-lis-nlogn',
          title: 'Longest Increasing Subsequence (O(n log n) optimization)',
          slug: 'longest-increasing-subsequence',
          difficulty: 'Medium',
          patternId: 'advanced-dp-core',
          hints: {
            recognition: 'Find LIS in O(n log n) time using patience sorting.',
            structure: 'Maintain array tails where tails[i] is smallest tail of all increasing subsequences of length i+1. Binary search insertion point for each number.',
            skeleton: 'const tails = [];\nfor (const x of nums) {\n  let l = 0, r = tails.length;\n  while (l < r) {\n    const mid = (l + r) >> 1;\n    if (tails[mid] < x) l = mid + 1; else r = mid;\n  }\n  tails[l] = x;\n}\nreturn tails.length;',
          },
        },
        {
          id: 'adp-burst-balloons',
          title: 'Burst Balloons',
          slug: 'burst-balloons',
          difficulty: 'Hard',
          patternId: 'advanced-dp-core',
          hints: {
            recognition: 'Burst balloons to maximize coins nums[i-1] * nums[i] * nums[i+1].',
            structure: 'Interval DP: think in reverse — which balloon is burst LAST in range (i, j)? dp[i][j] = max(dp[i][k] + dp[k][j] + nums[i]*nums[k]*nums[j]).',
            skeleton: 'const A = [1, ...nums, 1], n = A.length;\nconst dp = Array.from({ length: n }, () => new Array(n).fill(0));\nfor (let len = 2; len < n; len++) {\n  for (let l = 0; l < n - len; l++) {\n    const r = l + len;\n    for (let k = l + 1; k < r; k++) {\n      dp[l][r] = Math.max(dp[l][r], dp[l][k] + dp[k][r] + A[l] * A[k] * A[r]);\n    }\n  }\n}\nreturn dp[0][n - 1];',
          },
        },
      ],
    },
  ],
};
