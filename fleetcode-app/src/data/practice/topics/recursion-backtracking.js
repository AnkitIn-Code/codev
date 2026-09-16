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
          title: 'Palindrome String',
          slug: 'valid-palindrome',
          difficulty: 'Easy',
          patternId: 'backtracking-core',
          hints: {
            recognition: 'Determine if string is a palindrome recursively or with two pointers.',
            structure: 'Compare first and last alphanumeric characters. Recurse on inner substring if matching.',
            skeleton: 'function isPal(s, l, r) {\n  if (l >= r) return true;\n  if (s[l] !== s[r]) return false;\n  return isPal(s, l + 1, r - 1);\n}',
          },
        },
        {
          id: 'rec-check-sorted-array',
          title: 'Check Sorted Array',
          slug: 'check-if-array-is-sorted-and-rotated',
          difficulty: 'Easy',
          patternId: 'backtracking-core',
          hints: {
            recognition: 'Verify if array is sorted (or sorted and rotated).',
            structure: 'Count drops where nums[i] > nums[(i + 1) % n]. If drops <= 1, true.',
            skeleton: 'let drops = 0;\nfor (let i = 0; i < nums.length; i++) {\n  if (nums[i] > nums[(i + 1) % nums.length]) drops++;\n}\nreturn drops <= 1;',
          },
        },
        {
          id: 'rec-sum-of-digits',
          title: 'Sum of Digits',
          slug: 'add-digits',
          difficulty: 'Easy',
          patternId: 'backtracking-core',
          hints: {
            recognition: 'Repeatedly add all digits until result has only one digit (digital root).',
            structure: 'Digital root mathematical property: if num === 0 return 0; return 1 + (num - 1) % 9.',
            skeleton: 'if (num === 0) return 0;\nreturn 1 + ((num - 1) % 9);',
          },
        },
        {
          id: 'rec-remove-character',
          title: 'Remove Character',
          slug: 'remove-element',
          difficulty: 'Easy',
          patternId: 'backtracking-core',
          hints: {
            recognition: 'Remove all occurrences of val in-place.',
            structure: 'Pointer k keeps track of elements !== val.',
            skeleton: 'let k = 0;\nfor (let i = 0; i < nums.length; i++) {\n  if (nums[i] !== val) nums[k++] = nums[i];\n}\nreturn k;',
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
