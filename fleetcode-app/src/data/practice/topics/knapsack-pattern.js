/**
 * Topic 17: Knapsack Pattern
 */

export const knapsackPattern = {
  id: 'knapsack-pattern',
  order: 17,
  name: 'Knapsack Pattern',
  icon: '🎒',
  description: '0/1 Knapsack (choose at most once, iterate weight backwards) and Unbounded Knapsack (choose repeatedly, iterate weight forwards).',
  patterns: [
    {
      id: 'knapsack-core',
      name: 'Knapsack Pattern',
      topicId: 'knapsack-pattern',
      signals: ['Subset sum matching capacity', 'Partitioning arrays into equal halves', 'Making change with limited or unlimited coins'],
      coreIdea: '0/1 Knapsack: loop items outer, loop capacity backwards (w down to weight[i]). Unbounded: loop capacity forwards (weight[i] up to W).',
      dataStructure: '1D DP Array',
      questions: [
        {
          id: 'knap-partition-equal-subset',
          title: 'Partition Equal Subset Sum',
          slug: 'partition-equal-subset-sum',
          difficulty: 'Medium',
          patternId: 'knapsack-core',
          hints: {
            recognition: 'Partition array into two subsets with equal sum. Target = totalSum / 2.',
            structure: '0/1 Knapsack: boolean dp array of size target + 1. Iterate w from target down to num.',
            skeleton: 'const sum = nums.reduce((a, b) => a + b, 0);\nif (sum % 2 !== 0) return false;\nconst target = sum / 2, dp = new Array(target + 1).fill(false);\ndp[0] = true;\nfor (const n of nums) {\n  for (let w = target; w >= n; w--) dp[w] = dp[w] || dp[w - n];\n}\nreturn dp[target];',
          },
        },
        {
          id: 'knap-target-sum',
          title: 'Target Sum',
          slug: 'target-sum',
          difficulty: 'Medium',
          patternId: 'knapsack-core',
          hints: {
            recognition: 'Assign + or - to each integer to sum to target.',
            structure: 'Transform to subset sum: P - N = target and P + N = sum -> P = (target + sum) / 2. Count subsets summing to P.',
            skeleton: 'const sum = nums.reduce((a, b) => a + b, 0);\nif ((target + sum) % 2 !== 0 || Math.abs(target) > sum) return 0;\nconst s = (target + sum) / 2, dp = new Array(s + 1).fill(0);\ndp[0] = 1;\nfor (const n of nums) {\n  for (let w = s; w >= n; w--) dp[w] += dp[w - n];\n}\nreturn dp[s];',
          },
        },
        {
          id: 'knap-coin-change',
          title: 'Coin Change',
          slug: 'coin-change',
          difficulty: 'Medium',
          patternId: 'knapsack-core',
          hints: {
            recognition: 'Fewest coins needed to make up amount (unbounded knapsack).',
            structure: 'dp[w] = min coins for amount w. Loop w from coin up to amount: dp[w] = min(dp[w], 1 + dp[w - coin]).',
            skeleton: 'const dp = new Array(amount + 1).fill(Infinity);\ndp[0] = 0;\nfor (const c of coins) {\n  for (let w = c; w <= amount; w++) dp[w] = Math.min(dp[w], 1 + dp[w - c]);\n}\nreturn dp[amount] === Infinity ? -1 : dp[amount];',
          },
        },
        {
          id: 'knap-coin-change-ii',
          title: 'Coin Change II',
          slug: 'coin-change-ii',
          difficulty: 'Medium',
          patternId: 'knapsack-core',
          hints: {
            recognition: 'Number of combinations that make up amount (unbounded knapsack combinations).',
            structure: 'Coins outer loop to ensure combinations (not permutations): dp[w] += dp[w - c].',
            skeleton: 'const dp = new Array(amount + 1).fill(0);\ndp[0] = 1;\nfor (const c of coins) {\n  for (let w = c; w <= amount; w++) dp[w] += dp[w - c];\n}\nreturn dp[amount];',
          },
        },
        {
          id: 'knap-01-classic',
          title: '0/1 Knapsack (Classic)',
          slug: 'ones-and-zeroes',
          difficulty: 'Medium',
          patternId: 'knapsack-core',
          hints: {
            recognition: 'Classic 0/1 knapsack with two resource dimensions (m zeros and n ones).',
            structure: '2D DP iterated backwards for both dimensions: for i from m down to zeros; for j from n down to ones.',
            skeleton: 'const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\nfor (const s of strs) {\n  const [z, o] = count(s);\n  for (let i = m; i >= z; i--) {\n    for (let j = n; j >= o; j--) dp[i][j] = Math.max(dp[i][j], 1 + dp[i - z][j - o]);\n  }\n}\nreturn dp[m][n];',
          },
        },
        {
          id: 'knap-unbounded-classic',
          title: 'Unbounded Knapsack',
          slug: 'coin-change',
          difficulty: 'Medium',
          patternId: 'knapsack-core',
          hints: {
            recognition: 'Items have values and weights, can be picked unlimited times.',
            structure: 'dp[w] = max(dp[w], value + dp[w - weight]) iterating capacity forward.',
            skeleton: 'const dp = new Array(W + 1).fill(0);\nfor (let i = 0; i < n; i++) {\n  for (let w = wt[i]; w <= W; w++) dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);\n}\nreturn dp[W];',
          },
        },
      ],
    },
  ],
};
