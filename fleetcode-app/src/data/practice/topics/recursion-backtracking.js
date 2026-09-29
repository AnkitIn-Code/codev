/**
 * Topic 11: Recursion & Backtracking
 */

export const recursionBacktracking = {
  id: 'recursion-backtracking',
  order: 11,
  name: 'Recursion & Backtracking',
  icon: '🔄',
  description: 'Exhaustive state-space search exploring all candidate configurations, making choices, pruning invalid states, and backtracking.',
  patterns: [
    {
      id: 'backtracking-core',
      name: 'Recursion & Backtracking',
      topicId: 'recursion-backtracking',
      signals: ['Generate all combinations / permutations', 'Subsets with constraints', 'Tree search with rollback on invalid branches', 'Base case + recursive step'],
      coreIdea: 'Explore state space recursively: choose an option, recurse to deeper state, and un-choose (backtrack) to restore state for sibling branches.',
      dataStructure: 'Recursion Call Stack',
      questions: [
        {
          id: 'rec-fibonacci',
          title: 'Fibonacci',
          slug: 'fibonacci-number',
          difficulty: 'Easy',
          patternId: 'backtracking-core',
          hints: {
            recognition: 'Compute F(n) where F(n) = F(n-1) + F(n-2).',
            structure: 'Base cases: F(0) = 0, F(1) = 1. Recurse or memoize.',
            skeleton: 'function fib(n, memo = {}) {\n  if (n <= 1) return n;\n  if (memo[n]) return memo[n];\n  return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);\n}',
          },
        },
        {
          id: 'rec-palindrome-string',
          title: 'Check if String is Palindrome',
          slug: 'check-if-string-is-palindrome',
          // GFG recursive palindrome check
          url: 'https://www.geeksforgeeks.org/problems/palindrome-string0817/1',
          difficulty: 'Easy',
          patternId: 'backtracking-core',
          hints: {
            recognition: 'Determine if a string is a palindrome using recursion.',
            structure: 'Compare first and last characters. If equal, recurse on s[1..n-2]. Base: length ≤ 1 → true.',
            skeleton: 'function isPal(s, l, r) {\n  if (l >= r) return true;\n  if (s[l] !== s[r]) return false;\n  return isPal(s, l + 1, r - 1);\n}\nreturn isPal(s, 0, s.length - 1);',
          },
        },
        {
          id: 'rec-check-sorted-array',
          title: 'Check if Array is Sorted (Recursive)',
          slug: 'check-sorted-array',
          // GFG recursive sorted check
          url: 'https://www.geeksforgeeks.org/problems/check-if-an-array-is-sorted0701/1',
          difficulty: 'Easy',
          patternId: 'backtracking-core',
          hints: {
            recognition: 'Check if array is sorted in ascending order using recursion.',
            structure: 'Base: length ≤ 1 → true. Recursive: arr[0] ≤ arr[1] && isSorted(arr.slice(1)).',
            skeleton: 'function isSorted(arr, n) {\n  if (n <= 1) return true;\n  return arr[n-2] <= arr[n-1] && isSorted(arr, n-1);\n}\nreturn isSorted(arr, arr.length);',
          },
        },
        {
          id: 'rec-sum-of-digits',
          title: 'Sum of Digits (Recursive)',
          slug: 'sum-of-digits',
          // GFG recursive digit sum
          url: 'https://www.geeksforgeeks.org/problems/sum-of-digits1742/1',
          difficulty: 'Easy',
          patternId: 'backtracking-core',
          hints: {
            recognition: 'Find sum of digits of a number using recursion.',
            structure: 'Base: n < 10 → n. Recursive: (n % 10) + sumDigits(Math.floor(n / 10)).',
            skeleton: 'function sumDigits(n) {\n  if (n < 10) return n;\n  return (n % 10) + sumDigits(Math.floor(n / 10));\n}',
          },
        },
        {
          id: 'rec-powx-n',
          title: 'Pow(x, n)',
          slug: 'powx-n',
          difficulty: 'Medium',
          patternId: 'backtracking-core',
          hints: {
            recognition: 'Compute x raised to power n in O(log n) time using recursion.',
            structure: 'Binary exponentiation: if n is 0 return 1. If n is negative invert x. Recurse on n/2: if even half*half, if odd half*half*x.',
            skeleton: 'function myPow(x, n) {\n  if (n === 0) return 1;\n  if (n < 0) return 1 / myPow(x, -n);\n  const half = myPow(x, Math.floor(n / 2));\n  return n % 2 === 0 ? half * half : half * half * x;\n}',
          },
        },
        {
          id: 'rec-generate-parentheses',
          title: 'Generate Parentheses',
          slug: 'generate-parentheses',
          difficulty: 'Medium',
          patternId: 'backtracking-core',
          hints: {
            recognition: 'Generate all combinations of n pairs of well-formed parentheses.',
            structure: 'Backtrack with open count and close count. Can add ( if open < n; can add ) if close < open.',
            skeleton: 'const res = [];\nfunction backtrack(curr, open, close) {\n  if (curr.length === 2 * n) { res.push(curr); return; }\n  if (open < n) backtrack(curr + "(", open + 1, close);\n  if (close < open) backtrack(curr + ")", open, close + 1);\n}\nbacktrack("", 0, 0);\nreturn res;',
          },
        },
        {
          id: 'rec-letter-combinations',
          title: 'Letter Combinations',
          slug: 'letter-combinations-of-a-phone-number',
          difficulty: 'Medium',
          patternId: 'backtracking-core',
          hints: {
            recognition: 'All possible letter combinations that a phone number digit string could represent.',
            structure: 'Map each digit 2-9 to characters. Recurse per digit index, iterating mapped characters.',
            skeleton: 'const map = { 2: "abc", 3: "def", 4: "ghi", 5: "jkl", 6: "mno", 7: "pqrs", 8: "tuv", 9: "wxyz" };\nconst res = [];\nfunction dfs(idx, path) {\n  if (idx === digits.length) { res.push(path); return; }\n  for (const c of map[digits[idx]]) dfs(idx + 1, path + c);\n}\nif (digits) dfs(0, "");\nreturn res;',
          },
        },
        {
          id: 'rec-permutations',
          title: 'Permutations',
          slug: 'permutations',
          difficulty: 'Medium',
          patternId: 'backtracking-core',
          hints: {
            recognition: 'Generate all possible permutations of an array of distinct integers.',
            structure: 'Backtrack with boolean array used[i] or in-place swapping of elements.',
            skeleton: 'const res = [], used = new Array(nums.length).fill(false);\nfunction backtrack(path) {\n  if (path.length === nums.length) { res.push([...path]); return; }\n  for (let i = 0; i < nums.length; i++) {\n    if (used[i]) continue;\n    used[i] = true;\n    path.push(nums[i]);\n    backtrack(path);\n    path.pop();\n    used[i] = false;\n  }\n}\nbacktrack([]);\nreturn res;',
          },
        },
        {
          id: 'rec-combination-sum',
          title: 'Combination Sum',
          slug: 'combination-sum',
          difficulty: 'Medium',
          patternId: 'backtracking-core',
          hints: {
            recognition: 'Unique combinations where candidates sum to target (same number chosen unlimited times).',
            structure: 'Sort candidates. Pass start index i so candidates[i] can be reused, but previous indices skipped.',
            skeleton: 'const res = [];\nfunction backtrack(remain, start, path) {\n  if (remain === 0) { res.push([...path]); return; }\n  for (let i = start; i < candidates.length; i++) {\n    if (candidates[i] > remain) break;\n    path.push(candidates[i]);\n    backtrack(remain - candidates[i], i, path);\n    path.pop();\n  }\n}\ncandidates.sort((a, b) => a - b);\nbacktrack(target, 0, []);\nreturn res;',
          },
        },
        {
          id: 'rec-palindrome-partitioning',
          title: 'Palindrome Partitioning',
          slug: 'palindrome-partitioning',
          difficulty: 'Medium',
          patternId: 'backtracking-core',
          hints: {
            recognition: 'Partition string such that every substring of the partition is a palindrome.',
            structure: 'For start index, loop end from start to s.length. If s[start..end] is palindrome, recurse on end + 1.',
            skeleton: 'const res = [];\nfunction backtrack(start, path) {\n  if (start === s.length) { res.push([...path]); return; }\n  for (let end = start; end < s.length; end++) {\n    if (isPal(s, start, end)) {\n      path.push(s.slice(start, end + 1));\n      backtrack(end + 1, path);\n      path.pop();\n    }\n  }\n}\nbacktrack(0, []);\nreturn res;',
          },
        },
      ],
    },
  ],
};
