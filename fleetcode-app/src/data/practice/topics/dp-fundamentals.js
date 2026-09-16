/**
 * Topic 14: DP Fundamentals (1D DP)
 */

export const dpFundamentals = {
  id: 'dp-fundamentals',
  order: 14,
  name: 'DP Fundamentals (1D DP)',
  icon: '🧱',
  description: 'Foundational 1-dimensional Dynamic Programming: state transitions, base cases, and rolling variable space optimization.',
  patterns: [
    {
      id: '1d-dp',
      name: 'DP Fundamentals (1D DP)',
      topicId: 'dp-fundamentals',
      signals: ['Count ways to reach state i', 'Optimal cost choosing from last 1 or 2 steps', 'Linear recurrences'],
      coreIdea: 'Define dp[i] as the answer for subproblem of size i. Transition depends on dp[i-1] and dp[i-2]. Optimize space from O(N) to O(1).',
      dataStructure: '1D Array / Rolling Variables',
      questions: [
        {
          id: 'dp1-fibonacci',
          title: 'Fibonacci Number',
          slug: 'fibonacci-number',
          difficulty: 'Easy',
          patternId: '1d-dp',
          hints: {
            recognition: 'dp[i] = dp[i-1] + dp[i-2] with base cases 0 and 1.',
            structure: 'Iterative rolling state with two variables.',
            skeleton: 'if (n <= 1) return n;\nlet a = 0, b = 1;\nfor (let i = 2; i <= n; i++) {\n  const c = a + b; a = b; b = c;\n}\nreturn b;',
          },
        },
        {
          id: 'dp1-climbing-stairs',
          title: 'Climbing Stairs',
          slug: 'climbing-stairs',
          difficulty: 'Easy',
          patternId: '1d-dp',
          hints: {
            recognition: 'Climb 1 or 2 steps at a time to reach step n.',
            structure: 'ways(n) = ways(n-1) + ways(n-2). Identical recurrence to Fibonacci.',
            skeleton: 'if (n <= 2) return n;\nlet a = 1, b = 2;\nfor (let i = 3; i <= n; i++) {\n  const c = a + b; a = b; b = c;\n}\nreturn b;',
          },
        },
        {
          id: 'dp1-min-cost-climbing',
          title: 'Min Cost Climbing Stairs',
          slug: 'min-cost-climbing-stairs',
          difficulty: 'Easy',
          patternId: '1d-dp',
          hints: {
            recognition: 'Minimum cost to reach top starting from step 0 or step 1.',
            structure: 'dp[i] = cost[i] + Math.min(dp[i-1], dp[i-2]).',
            skeleton: 'let a = cost[0], b = cost[1];\nfor (let i = 2; i < cost.length; i++) {\n  const c = cost[i] + Math.min(a, b);\n  a = b; b = c;\n}\nreturn Math.min(a, b);',
          },
        },
        {
          id: 'dp1-house-robber',
          title: 'House Robber',
          slug: 'house-robber',
          difficulty: 'Medium',
          patternId: '1d-dp',
          hints: {
            recognition: 'Maximize loot without robbing two adjacent houses.',
            structure: 'At house i: either skip it (keep loot up to i-1) or rob it (nums[i] + loot up to i-2).',
            skeleton: 'let robPrev = 0, skipPrev = 0;\nfor (const n of nums) {\n  const cur = Math.max(skipPrev + n, robPrev);\n  skipPrev = robPrev;\n  robPrev = cur;\n}\nreturn robPrev;',
          },
        },
        {
          id: 'dp1-house-robber-ii',
          title: 'House Robber II',
          slug: 'house-robber-ii',
          difficulty: 'Medium',
          patternId: '1d-dp',
          hints: {
            recognition: 'Houses are arranged in a circle: first and last house are adjacent.',
            structure: 'Run linear House Robber twice: once on nums[0..n-2], once on nums[1..n-1]. Return maximum.',
            skeleton: 'if (nums.length === 1) return nums[0];\nreturn Math.max(robRange(nums, 0, n - 2), robRange(nums, 1, n - 1));',
          },
        },
        {
          id: 'dp1-delete-and-earn',
          title: 'Delete and Earn',
          slug: 'delete-and-earn',
          difficulty: 'Medium',
          patternId: '1d-dp',
          hints: {
            recognition: 'Taking num x deletes all occurrences of x - 1 and x + 1.',
            structure: 'Aggregate total points per value into count array. Reduces directly to House Robber problem.',
            skeleton: 'const maxVal = Math.max(...nums);\nconst points = new Array(maxVal + 1).fill(0);\nfor (const n of nums) points[n] += n;\n// Run House Robber DP on points array',
          },
        },
      ],
    },
  ],
};
