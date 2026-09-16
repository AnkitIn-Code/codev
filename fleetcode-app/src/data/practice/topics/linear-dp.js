/**
 * Topic 15: Linear DP
 */

export const linearDP = {
  id: 'linear-dp',
  order: 15,
  name: 'Linear DP',
  icon: '📏',
  description: 'Sequential decision processes, longest increasing subsequences, stock trading state machines, and array prefixes.',
  patterns: [
    {
      id: 'linear-decision-dp',
      name: 'Linear DP',
      topicId: 'linear-dp',
      signals: ['Longest subsequence meeting criteria', 'Finite state machine (buy/sell/cooldown)', 'Decisions depending on prior indices j < i'],
      coreIdea: 'State at index i depends on scanning all previous indices j < i (O(N^2) for LIS) or constant number of holding/sold states (O(N) for stocks).',
      dataStructure: '1D Array / State Variables',
      questions: [
        {
          id: 'ldp-maximum-subarray',
          title: 'Maximum Subarray',
          slug: 'maximum-subarray',
          difficulty: 'Medium',
          patternId: 'linear-decision-dp',
          hints: {
            recognition: 'dp[i] = max subarray ending at index i.',
            structure: 'dp[i] = Math.max(nums[i], nums[i] + dp[i-1]).',
            skeleton: 'let maxEndingHere = nums[0], maxSoFar = nums[0];\nfor (let i = 1; i < nums.length; i++) {\n  maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);\n  maxSoFar = Math.max(maxSoFar, maxEndingHere);\n}\nreturn maxSoFar;',
          },
        },
        {
          id: 'ldp-maximum-product-subarray',
          title: 'Maximum Product Subarray',
          slug: 'maximum-product-subarray',
          difficulty: 'Medium',
          patternId: 'linear-decision-dp',
          hints: {
            recognition: 'dp[i] tracks max and min product ending at i.',
            structure: 'Negatives flip min and max. Swap on negative multiplier.',
            skeleton: 'let curMax = nums[0], curMin = nums[0], res = nums[0];\nfor (let i = 1; i < nums.length; i++) {\n  const x = nums[i];\n  if (x < 0) [curMax, curMin] = [curMin, curMax];\n  curMax = Math.max(x, curMax * x);\n  curMin = Math.min(x, curMin * x);\n  res = Math.max(res, curMax);\n}\nreturn res;',
          },
        },
        {
          id: 'ldp-lis',
          title: 'Longest Increasing Subsequence',
          slug: 'longest-increasing-subsequence',
          difficulty: 'Medium',
          patternId: 'linear-decision-dp',
          hints: {
            recognition: 'Find length of longest strictly increasing subsequence in array.',
            structure: 'dp[i] is length of LIS ending at i. For each j < i where nums[j] < nums[i], dp[i] = max(dp[i], dp[j] + 1).',
            skeleton: 'const dp = new Array(nums.length).fill(1);\nlet maxLen = 1;\nfor (let i = 1; i < nums.length; i++) {\n  for (let j = 0; j < i; j++) {\n    if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);\n  }\n  maxLen = Math.max(maxLen, dp[i]);\n}\nreturn maxLen;',
          },
        },
        {
          id: 'ldp-number-of-lis',
          title: 'Number of Longest Increasing Subsequences',
          slug: 'number-of-longest-increasing-subsequence',
          difficulty: 'Medium',
          patternId: 'linear-decision-dp',
          hints: {
            recognition: 'Count total number of subsequences achieving the maximum LIS length.',
            structure: 'Maintain two arrays: lengths[i] and count[i]. When lengths[j] + 1 === lengths[i], accumulate count[i] += count[j].',
            skeleton: 'const len = new Array(n).fill(1), cnt = new Array(n).fill(1);\n// update len[i] and cnt[i] for all j < i',
          },
        },
        {
          id: 'ldp-best-time-stock',
          title: 'Best Time to Buy and Sell Stock',
          slug: 'best-time-to-buy-and-sell-stock',
          difficulty: 'Easy',
          patternId: 'linear-decision-dp',
          hints: {
            recognition: 'Single transaction maximizing profit prices[sell] - prices[buy].',
            structure: 'Maintain minPrice seen so far. At each day, profit = price - minPrice.',
            skeleton: 'let minPrice = Infinity, maxProfit = 0;\nfor (const p of prices) {\n  minPrice = Math.min(minPrice, p);\n  maxProfit = Math.max(maxProfit, p - minPrice);\n}\nreturn maxProfit;',
          },
        },
        {
          id: 'ldp-best-time-stock-ii',
          title: 'Best Time to Buy and Sell Stock II',
          slug: 'best-time-to-buy-and-sell-stock-ii',
          difficulty: 'Medium',
          patternId: 'linear-decision-dp',
          hints: {
            recognition: 'Unlimited transactions allowed to maximize profit.',
            structure: 'Greedy summation of every positive price increase: if prices[i] > prices[i-1] add difference.',
            skeleton: 'let profit = 0;\nfor (let i = 1; i < prices.length; i++) {\n  if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];\n}\nreturn profit;',
          },
        },
      ],
    },
  ],
};
