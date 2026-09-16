/**
 * Topic 20: Bonus Advanced DP (Highly Recommended)
 */

export const bonusAdvancedDP = {
  id: 'bonus-advanced-dp',
  order: 20,
  name: 'Bonus Advanced DP (Highly Recommended)',
  icon: '🏆',
  description: 'Tree DP, bitmask dynamic programming, state machine transitions, and minimum cut partitioning.',
  patterns: [
    {
      id: 'bonus-dp-core',
      name: 'Bonus Advanced DP',
      topicId: 'bonus-advanced-dp',
      signals: ['DP on Tree structures (Tree DP)', 'Bitmask representation of visited subsets (mask & (1 << i))', 'Stock trading with mandatory cooldown days', 'Minimum cut partitioning'],
      coreIdea: 'Combine dynamic programming with bit manipulation (bitmask DP for N <= 16-20) or postorder tree traversals returning multiple subtree state tuples.',
      dataStructure: 'Bitmask Array / Tree Node State Tuples',
      questions: [
        {
          id: 'badp-palindrome-partitioning-ii',
          title: 'Palindrome Partitioning II',
          slug: 'palindrome-partitioning-ii',
          difficulty: 'Hard',
          patternId: 'bonus-dp-core',
          hints: {
            recognition: 'Minimum cuts needed for a palindrome partitioning of string s.',
            structure: 'Precompute isPal[i][j]. dp[i] is min cuts for s[0..i]. If isPal[0][i] cuts=0; else min(dp[j-1] + 1) for all j <= i where s[j..i] is palindrome.',
            skeleton: 'const n = s.length, dp = new Array(n).fill(0);\n// Expand around centers to populate palindromes and update dp[r] = min(dp[r], (l === 0 ? 0 : dp[l - 1] + 1))\nreturn dp[n - 1];',
          },
        },
        {
          id: 'badp-house-robber-iii',
          title: 'House Robber III',
          slug: 'house-robber-iii',
          difficulty: 'Medium',
          patternId: 'bonus-dp-core',
          hints: {
            recognition: 'Binary tree houses; directly-linked nodes cannot both be robbed (Tree DP).',
            structure: 'Postorder traversal returns [robThisNode, skipThisNode]. rob = node.val + leftSkip + rightSkip. skip = max(leftRob, leftSkip) + max(rightRob, rightSkip).',
            skeleton: 'function dfs(node) {\n  if (!node) return [0, 0];\n  const [lRob, lSkip] = dfs(node.left), [rRob, rSkip] = dfs(node.right);\n  const rob = node.val + lSkip + rSkip;\n  const skip = Math.max(lRob, lSkip) + Math.max(rRob, rSkip);\n  return [rob, skip];\n}\nconst [rob, skip] = dfs(root);\nreturn Math.max(rob, skip);',
          },
        },
        {
          id: 'badp-stock-cooldown',
          title: 'Best Time to Buy and Sell Stock with Cooldown',
          slug: 'best-time-to-buy-and-sell-stock-with-cooldown',
          difficulty: 'Medium',
          patternId: 'bonus-dp-core',
          hints: {
            recognition: 'After selling stock, cannot buy stock on next day (cooldown 1 day).',
            structure: 'Three state machines: hold, sold, reset. hold = max(hold, reset - price); reset = max(reset, sold); sold = hold + price.',
            skeleton: 'let hold = -Infinity, sold = 0, reset = 0;\nfor (const p of prices) {\n  const prevSold = sold;\n  sold = hold + p;\n  hold = Math.max(hold, reset - p);\n  reset = Math.max(reset, prevSold);\n}\nreturn Math.max(sold, reset);',
          },
        },
        {
          id: 'badp-partition-k-subsets',
          title: 'Partition to K Equal Sum Subsets',
          slug: 'partition-to-k-equal-sum-subsets',
          difficulty: 'Medium',
          patternId: 'bonus-dp-core',
          hints: {
            recognition: 'Partition array into k subsets all having equal sum totalSum / k.',
            structure: 'Sort descending. Backtracking with bucket sums, or bitmask DP dp[mask] storing current remainder mod target.',
            skeleton: 'const sum = nums.reduce((a, b) => a + b, 0);\nif (sum % k !== 0) return false;\nconst target = sum / k;\n// Backtracking with bucket allocation and sorting descending for pruning',
          },
        },
        {
          id: 'badp-tsp-bitmask',
          title: 'Traveling Salesman Problem (Bitmask DP)',
          slug: 'find-the-shortest-superstring',
          difficulty: 'Hard',
          patternId: 'bonus-dp-core',
          hints: {
            recognition: 'Visit all vertices or concatenate all words with maximum overlap using Bitmask DP.',
            structure: 'dp[mask][i] is optimal cost visiting subset mask ending at node i. Transition by trying all unvisited neighbors.',
            skeleton: 'const n = words.length, dp = Array.from({ length: 1 << n }, () => new Array(n).fill(Infinity));\n// loop mask from 1 to (1 << n) - 1, loop last visited node i, loop next node j',
          },
        },
      ],
    },
  ],
};
