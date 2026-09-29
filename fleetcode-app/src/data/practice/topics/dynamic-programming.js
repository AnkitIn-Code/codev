/**
 * Topic 14: Dynamic Programming
 * Merged from: dp-fundamentals, linear-dp, grid-dp, knapsack-pattern,
 *              string-dp, advanced-dp, bonus-advanced-dp
 * Patterns: 1D DP · LIS & Subarray · Knapsack · Partition DP ·
 *            Grid DP · String / 2D DP · Interval DP · Bitmask & Tree DP
 */

export const dynamicProgramming = {
  id: 'dynamic-programming',
  order: 14,
  name: 'Dynamic Programming',
  icon: '🧩',
  description:
    'Master every DP archetype: 1D recurrences, subsequence DP, knapsack variants, partition DP, 2D grid/string alignment, interval DP, and advanced bitmask & tree DP.',
  patterns: [
    /* ── 1. 1D / House Robber DP ───────────────────────────────────────── */
    {
      id: 'dp-1d',
      name: '1D DP (Linear Recurrence)',
      topicId: 'dynamic-programming',
      signals: [
        'Count ways to reach step / tile / cell',
        'Optimal cost picking from last 1 or 2 positions',
        'Cannot pick adjacent elements',
        'Rolling variable space-optimisable recurrence',
      ],
      coreIdea:
        'Define dp[i] as answer for sub-problem of size i. Transition depends on dp[i−1] (and maybe dp[i−2]). Compress O(N) array to O(1) rolling variables.',
      dataStructure: '1D Array → Rolling Variables',
      questions: [
        {
          id: 'dp1-climbing-stairs',
          title: 'Climbing Stairs',
          slug: 'climbing-stairs',
          difficulty: 'Easy',
          patternId: 'dp-1d',
          hints: {
            recognition: 'Reach step n climbing 1 or 2 steps; count ways.',
            structure: 'ways(n) = ways(n-1) + ways(n-2). Fibonacci recurrence.',
            skeleton:
              'if (n <= 2) return n;\nlet a = 1, b = 2;\nfor (let i = 3; i <= n; i++) { const c = a + b; a = b; b = c; }\nreturn b;',
          },
        },
        {
          id: 'dp1-min-cost-climbing',
          title: 'Min Cost Climbing Stairs',
          slug: 'min-cost-climbing-stairs',
          difficulty: 'Easy',
          patternId: 'dp-1d',
          hints: {
            recognition: 'Each step has a cost; minimise total to reach top.',
            structure: 'dp[i] = cost[i] + min(dp[i-1], dp[i-2]).',
            skeleton:
              'let a = cost[0], b = cost[1];\nfor (let i = 2; i < cost.length; i++) {\n  const c = cost[i] + Math.min(a, b); a = b; b = c;\n}\nreturn Math.min(a, b);',
          },
        },
        {
          id: 'dp1-house-robber',
          title: 'House Robber',
          slug: 'house-robber',
          difficulty: 'Medium',
          patternId: 'dp-1d',
          hints: {
            recognition: 'Maximise loot; cannot rob adjacent houses.',
            structure: 'At house i: skip (keep dp[i-1]) or rob (nums[i] + dp[i-2]).',
            skeleton:
              'let robPrev = 0, skipPrev = 0;\nfor (const n of nums) {\n  const cur = Math.max(skipPrev + n, robPrev);\n  skipPrev = robPrev; robPrev = cur;\n}\nreturn robPrev;',
          },
        },
        {
          id: 'dp1-house-robber-ii',
          title: 'House Robber II',
          slug: 'house-robber-ii',
          difficulty: 'Medium',
          patternId: 'dp-1d',
          hints: {
            recognition: 'Houses in a circle; first and last are adjacent.',
            structure: 'Run linear rob twice: nums[0..n-2] and nums[1..n-1]; return max.',
            skeleton:
              'function robRange(arr) {\n  let a = 0, b = 0;\n  for (const n of arr) { const c = Math.max(b, a + n); a = b; b = c; }\n  return b;\n}\nreturn Math.max(robRange(nums.slice(0, -1)), robRange(nums.slice(1)));',
          },
        },
        {
          id: 'dp1-delete-and-earn',
          title: 'Delete and Earn',
          slug: 'delete-and-earn',
          difficulty: 'Medium',
          patternId: 'dp-1d',
          hints: {
            recognition: 'Taking value x deletes all x-1 and x+1 occurrences.',
            structure: 'Aggregate points[x] = x × freq(x). Run House Robber on points array.',
            skeleton:
              'const maxVal = Math.max(...nums);\nconst pts = new Array(maxVal + 1).fill(0);\nfor (const n of nums) pts[n] += n;\n// House Robber DP on pts',
          },
        },
        {
          id: 'dp1-decode-ways',
          title: 'Decode Ways',
          slug: 'decode-ways',
          difficulty: 'Medium',
          patternId: 'dp-1d',
          hints: {
            recognition: 'Count ways to decode numeric string into letters A=1…Z=26.',
            structure: 'dp[i] = ways to decode s[0..i-1]. One-digit valid: dp[i] += dp[i-1]; two-digit 10-26: dp[i] += dp[i-2].',
            skeleton:
              'let prev2 = 1, prev1 = s[0] !== "0" ? 1 : 0;\nfor (let i = 2; i <= n; i++) {\n  let cur = 0;\n  if (s[i-1] !== "0") cur += prev1;\n  const two = Number(s.slice(i-2, i));\n  if (two >= 10 && two <= 26) cur += prev2;\n  prev2 = prev1; prev1 = cur;\n}\nreturn prev1;',
          },
        },
      ],
    },

    /* ── 2. LIS / Subarray DP ─────────────────────────────────────────── */
    {
      id: 'dp-lis-subarray',
      name: 'LIS & Subarray DP',
      topicId: 'dynamic-programming',
      signals: [
        'Longest strictly increasing subsequence',
        'Maximum subarray / subarray product',
        'Finite state machine: buy / sell / cooldown',
        'Decisions depending on prior index j < i',
      ],
      coreIdea:
        'LIS: dp[i] = length of longest increasing subsequence ending at i; scan all j < i for O(N²) or use patience-sort binary search for O(N log N). Subarray: dp[i] = best ending at i, reset when beneficial.',
      dataStructure: '1D Array / Tails Array (binary search)',
      questions: [
        {
          id: 'lis-maximum-subarray',
          title: 'Maximum Subarray',
          slug: 'maximum-subarray',
          difficulty: 'Medium',
          patternId: 'dp-lis-subarray',
          hints: {
            recognition: 'Contiguous subarray with largest sum (Kadane\'s).',
            structure: 'curMax = max(nums[i], curMax + nums[i]); update global max.',
            skeleton:
              'let cur = nums[0], best = nums[0];\nfor (let i = 1; i < nums.length; i++) {\n  cur = Math.max(nums[i], cur + nums[i]);\n  best = Math.max(best, cur);\n}\nreturn best;',
          },
        },
        {
          id: 'lis-maximum-product-subarray',
          title: 'Maximum Product Subarray',
          slug: 'maximum-product-subarray',
          difficulty: 'Medium',
          patternId: 'dp-lis-subarray',
          hints: {
            recognition: 'Negatives can flip max and min; track both.',
            structure: 'Swap curMax/curMin when current element is negative.',
            skeleton:
              'let curMax = nums[0], curMin = nums[0], res = nums[0];\nfor (let i = 1; i < nums.length; i++) {\n  const x = nums[i];\n  if (x < 0) [curMax, curMin] = [curMin, curMax];\n  curMax = Math.max(x, curMax * x);\n  curMin = Math.min(x, curMin * x);\n  res = Math.max(res, curMax);\n}\nreturn res;',
          },
        },
        {
          id: 'lis-lis-nlogn',
          title: 'Longest Increasing Subsequence',
          slug: 'longest-increasing-subsequence',
          difficulty: 'Medium',
          patternId: 'dp-lis-subarray',
          hints: {
            recognition: 'Length of longest strictly increasing subsequence.',
            structure: 'Patience sort: maintain tails array; binary search insertion point for each element.',
            skeleton:
              'const tails = [];\nfor (const x of nums) {\n  let l = 0, r = tails.length;\n  while (l < r) { const m = (l+r)>>1; tails[m] < x ? l=m+1 : r=m; }\n  tails[l] = x;\n}\nreturn tails.length;',
          },
        },
        {
          id: 'lis-best-time-stock',
          title: 'Best Time to Buy and Sell Stock',
          slug: 'best-time-to-buy-and-sell-stock',
          difficulty: 'Easy',
          patternId: 'dp-lis-subarray',
          hints: {
            recognition: 'Single transaction: maximise prices[sell] − prices[buy].',
            structure: 'Track minPrice seen so far; profit = price − minPrice.',
            skeleton:
              'let min = Infinity, profit = 0;\nfor (const p of prices) { min = Math.min(min, p); profit = Math.max(profit, p - min); }\nreturn profit;',
          },
        },
        {
          id: 'lis-best-time-stock-iii',
          title: 'Best Time to Buy and Sell Stock III',
          slug: 'best-time-to-buy-and-sell-stock-iii',
          difficulty: 'Hard',
          patternId: 'dp-lis-subarray',
          hints: {
            recognition: 'At most 2 transactions; maximise profit.',
            structure: 'Track buy1, profit1, buy2, profit2 state machines.',
            skeleton:
              'let buy1 = -Infinity, sell1 = 0, buy2 = -Infinity, sell2 = 0;\nfor (const p of prices) {\n  buy1 = Math.max(buy1, -p);\n  sell1 = Math.max(sell1, buy1 + p);\n  buy2 = Math.max(buy2, sell1 - p);\n  sell2 = Math.max(sell2, buy2 + p);\n}\nreturn sell2;',
          },
        },
        {
          id: 'lis-russian-doll',
          title: 'Russian Doll Envelopes',
          slug: 'russian-doll-envelopes',
          difficulty: 'Hard',
          patternId: 'dp-lis-subarray',
          hints: {
            recognition: 'Sort by width asc, height desc; then LIS on heights.',
            structure: 'Descending height for same width prevents counting same-width envelopes.',
            skeleton:
              'envelopes.sort((a,b) => a[0]-b[0] || b[1]-a[1]);\nconst tails = [];\nfor (const [,h] of envelopes) {\n  let l=0,r=tails.length;\n  while(l<r){const m=(l+r)>>1; tails[m]<h?l=m+1:r=m;}\n  tails[l]=h;\n}\nreturn tails.length;',
          },
        },
      ],
    },

    /* ── 3. Knapsack DP ───────────────────────────────────────────────── */
    {
      id: 'dp-knapsack',
      name: 'Knapsack DP (0/1 & Unbounded)',
      topicId: 'dynamic-programming',
      signals: [
        'Subset sum matching a target capacity',
        'Each item used at most once → iterate backwards',
        'Items reusable → iterate forwards (unbounded)',
        'Partition array into equal-sum halves',
      ],
      coreIdea:
        '0/1 Knapsack: outer loop = items, inner loop = capacity downward. Unbounded: inner loop = capacity upward. Both build a 1D boolean or value dp array.',
      dataStructure: '1D DP Array',
      questions: [
        {
          id: 'knap-partition-equal',
          title: 'Partition Equal Subset Sum',
          slug: 'partition-equal-subset-sum',
          difficulty: 'Medium',
          patternId: 'dp-knapsack',
          hints: {
            recognition: 'Can array be partitioned into two equal-sum subsets?',
            structure: '0/1 Knapsack boolean dp; target = totalSum/2; iterate capacity downward.',
            skeleton:
              'const sum = nums.reduce((a,b)=>a+b,0);\nif (sum%2) return false;\nconst t = sum/2, dp = new Array(t+1).fill(false); dp[0]=true;\nfor (const n of nums) for (let w=t; w>=n; w--) dp[w]=dp[w]||dp[w-n];\nreturn dp[t];',
          },
        },
        {
          id: 'knap-target-sum',
          title: 'Target Sum',
          slug: 'target-sum',
          difficulty: 'Medium',
          patternId: 'dp-knapsack',
          hints: {
            recognition: 'Assign + or − to reach target; count ways.',
            structure: 'Transform: subset sum P = (target+sum)/2; count 0/1 knapsack ways.',
            skeleton:
              'const sum = nums.reduce((a,b)=>a+b,0);\nif ((target+sum)%2 || Math.abs(target)>sum) return 0;\nconst s=(target+sum)/2, dp=new Array(s+1).fill(0); dp[0]=1;\nfor (const n of nums) for (let w=s;w>=n;w--) dp[w]+=dp[w-n];\nreturn dp[s];',
          },
        },
        {
          id: 'knap-coin-change',
          title: 'Coin Change',
          slug: 'coin-change',
          difficulty: 'Medium',
          patternId: 'dp-knapsack',
          hints: {
            recognition: 'Fewest coins to make up amount; coins reusable (unbounded).',
            structure: 'dp[w] = min coins; loop capacity upward: dp[w] = min(dp[w], 1+dp[w-coin]).',
            skeleton:
              'const dp = new Array(amount+1).fill(Infinity); dp[0]=0;\nfor (const c of coins) for (let w=c; w<=amount; w++) dp[w]=Math.min(dp[w],1+dp[w-c]);\nreturn dp[amount]===Infinity?-1:dp[amount];',
          },
        },
        {
          id: 'knap-coin-change-ii',
          title: 'Coin Change II',
          slug: 'coin-change-ii',
          difficulty: 'Medium',
          patternId: 'dp-knapsack',
          hints: {
            recognition: 'Count combinations making up amount (unbounded, order doesn\'t matter).',
            structure: 'Coins outer, capacity forward ensures combinations not permutations.',
            skeleton:
              'const dp = new Array(amount+1).fill(0); dp[0]=1;\nfor (const c of coins) for (let w=c; w<=amount; w++) dp[w]+=dp[w-c];\nreturn dp[amount];',
          },
        },
        {
          id: 'knap-last-stone-ii',
          title: 'Last Stone Weight II',
          slug: 'last-stone-weight-ii',
          difficulty: 'Medium',
          patternId: 'dp-knapsack',
          hints: {
            recognition: 'Minimise difference of two groups (0/1 knapsack subset sum).',
            structure: 'Find largest subset sum ≤ totalSum/2; answer = totalSum − 2×dp.',
            skeleton:
              'const sum = stones.reduce((a,b)=>a+b,0);\nconst t = Math.floor(sum/2), dp = new Array(t+1).fill(false); dp[0]=true;\nfor (const s of stones) for (let w=t;w>=s;w--) dp[w]=dp[w]||dp[w-s];\nfor (let i=t;i>=0;i--) if (dp[i]) return sum-2*i;',
          },
        },
        {
          id: 'knap-perfect-squares',
          title: 'Perfect Squares',
          slug: 'perfect-squares',
          difficulty: 'Medium',
          patternId: 'dp-knapsack',
          hints: {
            recognition: 'Minimum perfect squares summing to n (unbounded knapsack).',
            structure: 'Precompute squares ≤ n; dp[w] = min(dp[w], 1+dp[w-sq]).',
            skeleton:
              'const dp = new Array(n+1).fill(Infinity); dp[0]=0;\nfor (let i=1;i*i<=n;i++) for (let w=i*i;w<=n;w++) dp[w]=Math.min(dp[w],1+dp[w-i*i]);\nreturn dp[n];',
          },
        },
      ],
    },

    /* ── 4. Partition DP ──────────────────────────────────────────────── */
    {
      id: 'dp-partition',
      name: 'Partition DP',
      topicId: 'dynamic-programming',
      signals: [
        'Split array / string into k parts minimising cost',
        'Word break: can input be segmented into dictionary words',
        'Minimum / maximum cost of splitting at every valid cut',
        'Palindrome partitioning with minimum cuts',
      ],
      coreIdea:
        'dp[i] = optimal answer for the prefix of length i. For each i, try every split point j < i. Cost often includes a sub-problem lookup (dp[j]) plus cost of adding the segment [j,i].',
      dataStructure: '1D DP Array',
      questions: [
        {
          id: 'part-word-break',
          title: 'Word Break',
          slug: 'word-break',
          difficulty: 'Medium',
          patternId: 'dp-partition',
          hints: {
            recognition: 'Can string s be segmented using dictionary words?',
            structure: 'dp[i] = true if s[0..i-1] is segmentable. For each i, try all j<i where dp[j] && s[j..i-1] in dict.',
            skeleton:
              'const wordSet = new Set(wordDict), dp = new Array(s.length+1).fill(false); dp[0]=true;\nfor (let i=1;i<=s.length;i++)\n  for (let j=0;j<i;j++)\n    if (dp[j] && wordSet.has(s.slice(j,i))) { dp[i]=true; break; }\nreturn dp[s.length];',
          },
        },
        {
          id: 'part-word-break-ii',
          title: 'Word Break II',
          slug: 'word-break-ii',
          difficulty: 'Hard',
          patternId: 'dp-partition',
          hints: {
            recognition: 'Return all valid sentence segmentations.',
            structure: 'Memoised recursion: DFS from index 0; at each step try all valid prefix words.',
            skeleton:
              'const memo = new Map(), dict = new Set(wordDict);\nfunction dfs(start) {\n  if (memo.has(start)) return memo.get(start);\n  if (start === s.length) return [""];\n  const res = [];\n  for (let end=start+1;end<=s.length;end++) {\n    const w=s.slice(start,end);\n    if (dict.has(w)) for (const rest of dfs(end)) res.push(w+(rest?" "+rest:""));\n  }\n  memo.set(start,res); return res;\n}\nreturn dfs(0);',
          },
        },
        {
          id: 'part-palindrome-partition-min',
          title: 'Palindrome Partitioning II',
          slug: 'palindrome-partitioning-ii',
          difficulty: 'Hard',
          patternId: 'dp-partition',
          hints: {
            recognition: 'Minimum cuts to partition s into all-palindrome substrings.',
            structure: 'Expand palindromes from centres; for each palindrome s[l..r] update dp[r] = min(dp[r], (l==0?0:dp[l-1]+1)).',
            skeleton:
              'const n=s.length, dp=Array.from({length:n},(_,i)=>i);\nfor (let c=0;c<n;c++) {\n  for (let [l,r]of[[c,c],[c,c+1]]) {\n    while(l>=0&&r<n&&s[l]===s[r]) {\n      dp[r]=Math.min(dp[r],l===0?0:dp[l-1]+1);\n      l--;r++;\n    }\n  }\n}\nreturn dp[n-1];',
          },
        },
        {
          id: 'part-integer-break',
          title: 'Integer Break',
          slug: 'integer-break',
          difficulty: 'Medium',
          patternId: 'dp-partition',
          hints: {
            recognition: 'Break n into at least 2 positive integers to maximise product.',
            structure: 'dp[i] = max product for integer i. For each j<i: dp[i] = max(dp[i], j*(i-j), j*dp[i-j]).',
            skeleton:
              'const dp = new Array(n+1).fill(0); dp[1]=1;\nfor (let i=2;i<=n;i++)\n  for (let j=1;j<i;j++)\n    dp[i]=Math.max(dp[i],j*(i-j),j*dp[i-j]);\nreturn dp[n];',
          },
        },
      ],
    },

    /* ── 5. Grid DP ───────────────────────────────────────────────────── */
    {
      id: 'dp-grid',
      name: 'Grid DP (2D Matrix)',
      topicId: 'dynamic-programming',
      signals: [
        'Paths in 2D grid moving only Down and Right',
        'Minimum / maximum path sum across grid',
        'Bottom-up triangle path',
        'Health / constraint backward DP from target cell',
      ],
      coreIdea:
        'dp[r][c] depends on top dp[r-1][c] and left dp[r][c-1]. For backward problems (Dungeon Game) iterate from bottom-right to top-left.',
      dataStructure: '2D Grid → 1D Row Array',
      questions: [
        {
          id: 'gdp-unique-paths',
          title: 'Unique Paths',
          slug: 'unique-paths',
          difficulty: 'Medium',
          patternId: 'dp-grid',
          hints: {
            recognition: 'Robot top-left to bottom-right; count paths.',
            structure: 'dp[r][c] = dp[r-1][c] + dp[r][c-1]; compress to 1D row.',
            skeleton:
              'const dp = new Array(n).fill(1);\nfor (let r=1;r<m;r++) for (let c=1;c<n;c++) dp[c]+=dp[c-1];\nreturn dp[n-1];',
          },
        },
        {
          id: 'gdp-min-path-sum',
          title: 'Minimum Path Sum',
          slug: 'minimum-path-sum',
          difficulty: 'Medium',
          patternId: 'dp-grid',
          hints: {
            recognition: 'Minimise sum along path from top-left to bottom-right.',
            structure: 'In-place: grid[r][c] += min(grid[r-1][c], grid[r][c-1]).',
            skeleton:
              'for (let r=0;r<m;r++) for (let c=0;c<n;c++) {\n  if (r===0&&c===0) continue;\n  if (r===0) grid[r][c]+=grid[r][c-1];\n  else if (c===0) grid[r][c]+=grid[r-1][c];\n  else grid[r][c]+=Math.min(grid[r-1][c],grid[r][c-1]);\n}\nreturn grid[m-1][n-1];',
          },
        },
        {
          id: 'gdp-dungeon-game',
          title: 'Dungeon Game',
          slug: 'dungeon-game',
          difficulty: 'Hard',
          patternId: 'dp-grid',
          hints: {
            recognition: 'Minimum initial health to reach princess; backward DP.',
            structure: 'dp[r][c] = max(1, min(dp[r+1][c], dp[r][c+1]) − dungeon[r][c]).',
            skeleton:
              'const dp=Array.from({length:m+1},()=>new Array(n+1).fill(Infinity));\ndp[m][n-1]=1; dp[m-1][n]=1;\nfor (let r=m-1;r>=0;r--) for (let c=n-1;c>=0;c--) {\n  const need=Math.min(dp[r+1][c],dp[r][c+1])-dungeon[r][c];\n  dp[r][c]=need<=0?1:need;\n}\nreturn dp[0][0];',
          },
        },
        {
          id: 'gdp-maximal-square',
          title: 'Maximal Square',
          slug: 'maximal-square',
          difficulty: 'Medium',
          patternId: 'dp-grid',
          hints: {
            recognition: 'Largest square containing only 1s in binary matrix.',
            structure: 'dp[r][c] = min(dp[r-1][c], dp[r][c-1], dp[r-1][c-1]) + 1 when matrix[r][c]==="1".',
            skeleton:
              'let max=0;\nfor (let r=0;r<m;r++) for (let c=0;c<n;c++) {\n  if (matrix[r][c]==="1") {\n    dp[r][c]=Math.min(dp[r-1]?.[c]??0, dp[r]?.[c-1]??0, dp[r-1]?.[c-1]??0)+1;\n    max=Math.max(max,dp[r][c]);\n  }\n}\nreturn max*max;',
          },
        },
        {
          id: 'gdp-triangle',
          title: 'Triangle',
          slug: 'triangle',
          difficulty: 'Medium',
          patternId: 'dp-grid',
          hints: {
            recognition: 'Minimum-sum path from top to bottom of triangle.',
            structure: 'Bottom-up: dp[i] = triangle[r][i] + min(dp[i], dp[i+1]).',
            skeleton:
              'const dp=[...triangle[triangle.length-1]];\nfor (let r=triangle.length-2;r>=0;r--)\n  for (let c=0;c<=r;c++) dp[c]=triangle[r][c]+Math.min(dp[c],dp[c+1]);\nreturn dp[0];',
          },
        },
      ],
    },

    /* ── 6. String / 2D Alignment DP ─────────────────────────────────── */
    {
      id: 'dp-string',
      name: 'String / 2D Alignment DP',
      topicId: 'dynamic-programming',
      signals: [
        'Two strings: align, match, edit, interleave',
        'Edit operations: insert, delete, replace',
        'Longest common subsequence / substring',
        'Count distinct subsequence occurrences',
      ],
      coreIdea:
        'dp[i][j] represents answer for prefixes s1[0..i-1] and s2[0..j-1]. Match: dp[i][j] from dp[i-1][j-1]; mismatch: try dp[i-1][j], dp[i][j-1], dp[i-1][j-1].',
      dataStructure: '2D DP Matrix',
      questions: [
        {
          id: 'sdp-lcs',
          title: 'Longest Common Subsequence',
          slug: 'longest-common-subsequence',
          difficulty: 'Medium',
          patternId: 'dp-string',
          hints: {
            recognition: 'Length of longest subsequence common to both strings.',
            structure: 'Match → 1+dp[i-1][j-1]; else max(dp[i-1][j], dp[i][j-1]).',
            skeleton:
              'const dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));\nfor (let i=1;i<=m;i++) for (let j=1;j<=n;j++)\n  dp[i][j]=text1[i-1]===text2[j-1]?1+dp[i-1][j-1]:Math.max(dp[i-1][j],dp[i][j-1]);\nreturn dp[m][n];',
          },
        },
        {
          id: 'sdp-edit-distance',
          title: 'Edit Distance',
          slug: 'edit-distance',
          difficulty: 'Medium',
          patternId: 'dp-string',
          hints: {
            recognition: 'Minimum insert/delete/replace operations to convert word1 to word2.',
            structure: 'Match → dp[i-1][j-1]; else 1 + min(insert, delete, replace).',
            skeleton:
              'const dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));\nfor (let i=0;i<=m;i++) dp[i][0]=i;\nfor (let j=0;j<=n;j++) dp[0][j]=j;\nfor (let i=1;i<=m;i++) for (let j=1;j<=n;j++)\n  dp[i][j]=word1[i-1]===word2[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);\nreturn dp[m][n];',
          },
        },
        {
          id: 'sdp-longest-palindromic-subseq',
          title: 'Longest Palindromic Subsequence',
          slug: 'longest-palindromic-subsequence',
          difficulty: 'Medium',
          patternId: 'dp-string',
          hints: {
            recognition: 'Length of longest subsequence of s that is a palindrome.',
            structure: 'LCS between s and reverse(s), or interval DP on s[i..j].',
            skeleton:
              'const n=s.length,dp=Array.from({length:n},()=>new Array(n).fill(0));\nfor (let i=n-1;i>=0;i--) { dp[i][i]=1;\n  for (let j=i+1;j<n;j++)\n    dp[i][j]=s[i]===s[j]?2+dp[i+1][j-1]:Math.max(dp[i+1][j],dp[i][j-1]);\n}\nreturn dp[0][n-1];',
          },
        },
        {
          id: 'sdp-distinct-subsequences',
          title: 'Distinct Subsequences',
          slug: 'distinct-subsequences',
          difficulty: 'Hard',
          patternId: 'dp-string',
          hints: {
            recognition: 'Count distinct ways s contains t as a subsequence.',
            structure: 'Match: dp[i][j] = dp[i-1][j] + dp[i-1][j-1]; else dp[i-1][j].',
            skeleton:
              'const dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));\nfor (let i=0;i<=m;i++) dp[i][0]=1;\nfor (let i=1;i<=m;i++) for (let j=1;j<=n;j++)\n  dp[i][j]=dp[i-1][j]+(s[i-1]===t[j-1]?dp[i-1][j-1]:0);\nreturn dp[m][n];',
          },
        },
        {
          id: 'sdp-interleaving-string',
          title: 'Interleaving String',
          slug: 'interleaving-string',
          difficulty: 'Medium',
          patternId: 'dp-string',
          hints: {
            recognition: 'Check if s3 is an interleaving of s1 and s2.',
            structure: 'dp[i][j] = can form s3[0..i+j-1] using s1[0..i-1] and s2[0..j-1].',
            skeleton:
              'if (s1.length+s2.length!==s3.length) return false;\nconst dp=Array.from({length:m+1},()=>new Array(n+1).fill(false));\ndp[0][0]=true;\nfor (let i=0;i<=m;i++) for (let j=0;j<=n;j++) {\n  if (i>0) dp[i][j]||=dp[i-1][j]&&s1[i-1]===s3[i+j-1];\n  if (j>0) dp[i][j]||=dp[i][j-1]&&s2[j-1]===s3[i+j-1];\n}\nreturn dp[m][n];',
          },
        },
      ],
    },

    /* ── 7. Interval DP ───────────────────────────────────────────────── */
    {
      id: 'dp-interval',
      name: 'Interval DP',
      topicId: 'dynamic-programming',
      signals: [
        'Remove or merge elements in a subsegment [i, j] for max/min score',
        'Which element is processed LAST in a range?',
        'Balloon popping / matrix chain / stone merging',
        'Iterate over interval length, then left endpoint',
      ],
      coreIdea:
        'dp[i][j] = best answer for sub-array [i, j]. Outer loop: length from 2 to N. Inner: left endpoint l. Try each pivot k in (l, r): dp[l][r] = max/min(dp[l][k] + dp[k][r] + cost).',
      dataStructure: '2D Interval Matrix',
      questions: [
        {
          id: 'int-burst-balloons',
          title: 'Burst Balloons',
          slug: 'burst-balloons',
          difficulty: 'Hard',
          patternId: 'dp-interval',
          hints: {
            recognition: 'Burst balloons to maximise coins nums[i-1]*nums[i]*nums[i+1].',
            structure: 'Reverse thinking: pick which balloon is LAST burst in [l, r]; dp[l][r] = max over k: dp[l][k]+dp[k][r]+A[l]*A[k]*A[r].',
            skeleton:
              'const A=[1,...nums,1],n=A.length,dp=Array.from({length:n},()=>new Array(n).fill(0));\nfor (let len=2;len<n;len++) for (let l=0;l<n-len;l++) {\n  const r=l+len;\n  for (let k=l+1;k<r;k++)\n    dp[l][r]=Math.max(dp[l][r],dp[l][k]+dp[k][r]+A[l]*A[k]*A[r]);\n}\nreturn dp[0][n-1];',
          },
        },
        {
          id: 'int-strange-printer',
          title: 'Strange Printer',
          slug: 'strange-printer',
          difficulty: 'Hard',
          patternId: 'dp-interval',
          hints: {
            recognition: 'Minimum turns to print string; each turn prints one character repeated.',
            structure: 'dp[i][j] = min turns for s[i..j]. If s[i]===s[k], dp[i][k] saved one turn: dp[i][j]=min(dp[i][k-1]+dp[k][j]) for k where s[k]===s[i].',
            skeleton:
              'const n=s.length,dp=Array.from({length:n},(_,i)=>new Array(n).fill(0).map((_,j)=>j-i+1));\nfor (let len=2;len<=n;len++) for (let i=0;i<=n-len;i++) {\n  const j=i+len-1; dp[i][j]=dp[i][j-1]+1;\n  for (let k=i;k<j;k++) if(s[k]===s[j]) dp[i][j]=Math.min(dp[i][j],(k+1>j?0:dp[k+1][j-1]||0)+dp[i][k]);\n}\nreturn dp[0][n-1];',
          },
        },
        {
          id: 'int-minimum-cost-tree',
          title: 'Minimum Cost Tree From Leaf Values',
          slug: 'minimum-cost-tree-from-leaf-values',
          difficulty: 'Medium',
          patternId: 'dp-interval',
          hints: {
            recognition: 'Build BST from leaf array; minimise sum of all non-leaf nodes.',
            structure: 'Interval DP or Monotonic Stack (greedy). dp[l][r] = min over k: dp[l][k]+dp[k+1][r]+max(l..k)*max(k+1..r).',
            skeleton:
              '// Monotonic stack approach (O(N)):\nconst stack=[Infinity],res=[];\nfor (const n of arr) {\n  while(stack[stack.length-1]<=n) {\n    const mid=stack.pop();\n    res.push(mid*Math.min(stack[stack.length-1],n));\n  }\n  stack.push(n);\n}\nwhile(stack.length>1) { const a=stack.pop(); res.push(a*stack[stack.length-1]); }\nreturn res.reduce((a,b)=>a+b,0);',
          },
        },
        {
          id: 'int-stone-game-vii',
          title: 'Stone Game VII',
          slug: 'stone-game-vii',
          difficulty: 'Medium',
          patternId: 'dp-interval',
          hints: {
            recognition: 'Two players; take from either end; score = sum of remaining stones.',
            structure: 'dp[i][j] = max score difference for current player on stones[i..j]. prefix sums for range sum.',
            skeleton:
              'const n=stones.length,pre=new Array(n+1).fill(0);\nfor (let i=0;i<n;i++) pre[i+1]=pre[i]+stones[i];\nconst dp=Array.from({length:n},()=>new Array(n).fill(0));\nfor (let len=2;len<=n;len++) for (let i=0;i<=n-len;i++) {\n  const j=i+len-1,sum=pre[j+1]-pre[i];\n  dp[i][j]=Math.max(sum-stones[i]-dp[i+1][j],sum-stones[j]-dp[i][j-1]);\n}\nreturn dp[0][n-1];',
          },
        },
      ],
    },

    /* ── 8. Bitmask & Tree DP ─────────────────────────────────────────── */
    {
      id: 'dp-bitmask-tree',
      name: 'Bitmask & Tree DP',
      topicId: 'dynamic-programming',
      signals: [
        'Visit / assign all N ≤ 20 items optimally (bitmask DP)',
        'DP on tree: postorder returns multi-state tuple',
        'Cannot rob directly-linked tree nodes',
        'Assign workers to tasks / match nodes optimally',
      ],
      coreIdea:
        'Bitmask DP: dp[mask][last] = cost for visiting subset encoded in mask ending at node last. Tree DP: DFS returns [doRoot, skipRoot] tuples; combine in postorder.',
      dataStructure: 'Bitmask Array / Tree Tuple',
      questions: [
        {
          id: 'bm-house-robber-iii',
          title: 'House Robber III',
          slug: 'house-robber-iii',
          difficulty: 'Medium',
          patternId: 'dp-bitmask-tree',
          hints: {
            recognition: 'Tree of houses; directly linked nodes cannot both be robbed.',
            structure: 'Postorder: return [rob, skip]. rob = val+leftSkip+rightSkip; skip = max(leftRob,leftSkip)+max(rightRob,rightSkip).',
            skeleton:
              'function dfs(node) {\n  if (!node) return [0,0];\n  const [lR,lS]=dfs(node.left),[rR,rS]=dfs(node.right);\n  return [node.val+lS+rS,Math.max(lR,lS)+Math.max(rR,rS)];\n}\nreturn Math.max(...dfs(root));',
          },
        },
        {
          id: 'bm-stock-cooldown',
          title: 'Best Time to Buy and Sell Stock with Cooldown',
          slug: 'best-time-to-buy-and-sell-stock-with-cooldown',
          difficulty: 'Medium',
          patternId: 'dp-bitmask-tree',
          hints: {
            recognition: '1-day cooldown after selling; 3 state machine states.',
            structure: 'hold=max(hold,reset-p); sold=hold+p; reset=max(reset,prevSold).',
            skeleton:
              'let hold=-Infinity,sold=0,reset=0;\nfor (const p of prices) {\n  const prevSold=sold;\n  sold=hold+p; hold=Math.max(hold,reset-p); reset=Math.max(reset,prevSold);\n}\nreturn Math.max(sold,reset);',
          },
        },
        {
          id: 'bm-shortest-superstring',
          title: 'Find the Shortest Superstring',
          slug: 'find-the-shortest-superstring',
          difficulty: 'Hard',
          patternId: 'dp-bitmask-tree',
          hints: {
            recognition: 'Concatenate all words with maximum overlap (TSP on strings).',
            structure: 'dp[mask][i] = min total length with subset mask ending at word i. Reconstruct path.',
            skeleton:
              'const n=words.length,overlap=Array.from({length:n},()=>new Array(n).fill(0));\nfor (let i=0;i<n;i++) for (let j=0;j<n;j++) if(i!==j) /* compute overlap */;\nconst dp=Array.from({length:1<<n},()=>new Array(n).fill(Infinity));\n// loop masks, prev node, next node',
          },
        },
        {
          id: 'bm-partition-k-subsets',
          title: 'Partition to K Equal Sum Subsets',
          slug: 'partition-to-k-equal-sum-subsets',
          difficulty: 'Medium',
          patternId: 'dp-bitmask-tree',
          hints: {
            recognition: 'Partition nums into k subsets each summing to total/k.',
            structure: 'Sort descending; backtracking with k buckets and pruning equal buckets.',
            skeleton:
              'const sum=nums.reduce((a,b)=>a+b); if (sum%k) return false;\nconst target=sum/k; nums.sort((a,b)=>b-a); const buckets=new Array(k).fill(0);\nfunction bt(i) {\n  if (i===nums.length) return buckets.every(b=>b===target);\n  const seen=new Set();\n  for (let j=0;j<k;j++) {\n    if (seen.has(buckets[j])||buckets[j]+nums[i]>target) continue;\n    seen.add(buckets[j]); buckets[j]+=nums[i];\n    if (bt(i+1)) return true;\n    buckets[j]-=nums[i];\n  }\n  return false;\n}\nreturn bt(0);',
          },
        },
      ],
    },
  ],
};
