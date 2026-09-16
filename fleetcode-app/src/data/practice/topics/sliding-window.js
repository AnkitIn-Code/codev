/**
 * Topic 3: Sliding Window
 */

export const slidingWindow = {
  id: 'sliding-window',
  order: 3,
  name: 'Sliding Window',
  icon: '🪟',
  description: 'Maintain a running subsegment window over contiguous sequence, expanding right and shrinking left to satisfy constraints.',
  patterns: [
    {
      id: 'sliding-window-core',
      name: 'Sliding Window',
      topicId: 'sliding-window',
      signals: ['Contiguous subarray/substring problems', 'Size K window calculations', 'Longest/shortest substring matching condition'],
      coreIdea: 'Maintain window [left, right]. Expand right to include elements; shrink left when constraint is violated (variable) or window size hits K (fixed).',
      dataStructure: 'Array / String / Hash Map',
      questions: [
        {
          id: 'sw-max-sum-size-k',
          title: 'Maximum Sum Subarray of Size K',
          slug: 'maximum-average-subarray-i',
          difficulty: 'Easy',
          patternId: 'sliding-window-core',
          hints: {
            recognition: 'Fixed window size K. Find max sum or average of all length-K subarrays.',
            structure: 'Calculate sum of first K elements. Slide window 1 position right: add nums[i], subtract nums[i - k].',
            skeleton: 'let sum = 0;\nfor (let i = 0; i < k; i++) sum += nums[i];\nlet maxSum = sum;\nfor (let i = k; i < nums.length; i++) {\n  sum += nums[i] - nums[i - k];\n  maxSum = Math.max(maxSum, sum);\n}\nreturn maxSum;',
          },
        },
        {
          id: 'sw-min-size-subarray-sum',
          title: 'Minimum Size Subarray Sum',
          slug: 'minimum-size-subarray-sum',
          difficulty: 'Medium',
          patternId: 'sliding-window-core',
          hints: {
            recognition: 'Find minimal length of contiguous subarray with sum >= target.',
            structure: 'Dynamic window: expand right, while sum >= target update minLen and shrink left.',
            skeleton: 'let left = 0, sum = 0, minLen = Infinity;\nfor (let right = 0; right < nums.length; right++) {\n  sum += nums[right];\n  while (sum >= target) {\n    minLen = Math.min(minLen, right - left + 1);\n    sum -= nums[left++];\n  }\n}\nreturn minLen === Infinity ? 0 : minLen;',
          },
        },
        {
          id: 'sw-longest-k-distinct',
          title: 'Longest Substring with K Distinct',
          slug: 'longest-substring-with-at-most-k-distinct-characters',
          difficulty: 'Medium',
          patternId: 'sliding-window-core',
          hints: {
            recognition: 'Longest substring containing at most k distinct characters.',
            structure: 'Window with frequency map. Shrink left when map size > k.',
            skeleton: 'const map = new Map();\nlet left = 0, maxLen = 0;\nfor (let right = 0; right < s.length; right++) {\n  map.set(s[right], (map.get(s[right]) || 0) + 1);\n  while (map.size > k) {\n    const count = map.get(s[left]) - 1;\n    if (count === 0) map.delete(s[left]); else map.set(s[left], count);\n    left++;\n  }\n  maxLen = Math.max(maxLen, right - left + 1);\n}\nreturn maxLen;',
          },
        },
        {
          id: 'sw-fruits-baskets',
          title: 'Fruits into Baskets',
          slug: 'fruit-into-baskets',
          difficulty: 'Medium',
          patternId: 'sliding-window-core',
          hints: {
            recognition: 'Equivalent to longest subarray containing at most 2 distinct integers.',
            structure: 'Sliding window with frequency map of at most 2 keys.',
            skeleton: 'const map = new Map();\nlet left = 0, maxFruits = 0;\nfor (let right = 0; right < fruits.length; right++) {\n  map.set(fruits[right], (map.get(fruits[right]) || 0) + 1);\n  while (map.size > 2) {\n    const c = map.get(fruits[left]) - 1;\n    if (c === 0) map.delete(fruits[left]); else map.set(fruits[left], c);\n    left++;\n  }\n  maxFruits = Math.max(maxFruits, right - left + 1);\n}\nreturn maxFruits;',
          },
        },
        {
          id: 'sw-longest-no-repeating',
          title: 'Longest Substring Without Repeating',
          slug: 'longest-substring-without-repeating-characters',
          difficulty: 'Medium',
          patternId: 'sliding-window-core',
          hints: {
            recognition: 'Find length of longest substring without duplicate characters.',
            structure: 'Store last seen index of each char. When s[right] seen at idx >= left, jump left = idx + 1.',
            skeleton: 'const lastSeen = new Map();\nlet left = 0, maxLen = 0;\nfor (let right = 0; right < s.length; right++) {\n  if (lastSeen.has(s[right])) left = Math.max(left, lastSeen.get(s[right]) + 1);\n  lastSeen.set(s[right], right);\n  maxLen = Math.max(maxLen, right - left + 1);\n}\nreturn maxLen;',
          },
        },
        {
          id: 'sw-longest-repeating-char-replace',
          title: 'Longest Repeating Character Replacement',
          slug: 'longest-repeating-character-replacement',
          difficulty: 'Medium',
          patternId: 'sliding-window-core',
          hints: {
            recognition: 'Change at most k characters to make all characters in substring identical.',
            structure: 'Window length - maxFrequencyInWindow <= k. If violated, shrink left.',
            skeleton: 'const counts = {};\nlet left = 0, maxFreq = 0, maxLen = 0;\nfor (let right = 0; right < s.length; right++) {\n  counts[s[right]] = (counts[s[right]] || 0) + 1;\n  maxFreq = Math.max(maxFreq, counts[s[right]]);\n  while ((right - left + 1) - maxFreq > k) {\n    counts[s[left]]--;\n    left++;\n  }\n  maxLen = Math.max(maxLen, right - left + 1);\n}\nreturn maxLen;',
          },
        },
        {
          id: 'sw-max-consecutive-ones-iii',
          title: 'Max Consecutive Ones III',
          slug: 'max-consecutive-ones-iii',
          difficulty: 'Medium',
          patternId: 'sliding-window-core',
          hints: {
            recognition: 'Longest subarray of 1s if you can flip at most k zeros.',
            structure: 'Count zeros in window. If zeros > k, shrink from left until zeros <= k.',
            skeleton: 'let left = 0, zeros = 0, maxLen = 0;\nfor (let right = 0; right < nums.length; right++) {\n  if (nums[right] === 0) zeros++;\n  while (zeros > k) {\n    if (nums[left] === 0) zeros--;\n    left++;\n  }\n  maxLen = Math.max(maxLen, right - left + 1);\n}\nreturn maxLen;',
          },
        },
        {
          id: 'sw-min-window-substring',
          title: 'Minimum Window Substring',
          slug: 'minimum-window-substring',
          difficulty: 'Hard',
          patternId: 'sliding-window-core',
          hints: {
            recognition: 'Smallest substring of s containing all characters of t.',
            structure: 'Maintain required character counts and matched count. Once matched == needed, shrink left.',
            skeleton: 'const need = {}, window = {};\nfor (const c of t) need[c] = (need[c] || 0) + 1;\nlet have = 0, required = Object.keys(need).length, left = 0, res = [-1, -1], minLen = Infinity;\nfor (let right = 0; right < s.length; right++) {\n  const c = s[right];\n  window[c] = (window[c] || 0) + 1;\n  if (need[c] && window[c] === need[c]) have++;\n  while (have === required) {\n    if (right - left + 1 < minLen) { minLen = right - left + 1; res = [left, right]; }\n    window[s[left]]--;\n    if (need[s[left]] && window[s[left]] < need[s[left]]) have--;\n    left++;\n  }\n}\nreturn res[0] === -1 ? "" : s.slice(res[0], res[1] + 1);',
          },
        },
        {
          id: 'sw-permutation-string',
          title: 'Permutation in String',
          slug: 'permutation-in-string',
          difficulty: 'Medium',
          patternId: 'sliding-window-core',
          hints: {
            recognition: 'Check if s2 contains any permutation of s1 as a substring.',
            structure: 'Fixed window of size s1.length. Compare character count arrays.',
            skeleton: 'if (s1.length > s2.length) return false;\nconst c1 = new Array(26).fill(0), c2 = new Array(26).fill(0);\nfor (let i = 0; i < s1.length; i++) { c1[s1.charCodeAt(i)-97]++; c2[s2.charCodeAt(i)-97]++; }\nlet matches = 0;\nfor (let i = 0; i < 26; i++) if (c1[i] === c2[i]) matches++;\nfor (let r = s1.length; r < s2.length; r++) {\n  if (matches === 26) return true;\n  // slide window update matches\n}\nreturn matches === 26;',
          },
        },
        {
          id: 'sw-find-all-anagrams',
          title: 'Find All Anagrams',
          slug: 'find-all-anagrams-in-a-string',
          difficulty: 'Medium',
          patternId: 'sliding-window-core',
          hints: {
            recognition: 'Find all start indices of p\'s anagrams in s.',
            structure: 'Fixed size sliding window of length p.length comparing freq map of window to p.',
            skeleton: 'const res = [], countP = {}, window = {};\nfor (const c of p) countP[c] = (countP[c] || 0) + 1;\n// slide window across s, compare frequencies, push left index if match',
          },
        },
        {
          id: 'sw-substring-concat-all-words',
          title: 'Substring with Concatenation of All Words',
          slug: 'substring-with-concatenation-of-all-words',
          difficulty: 'Hard',
          patternId: 'sliding-window-core',
          hints: {
            recognition: 'Find starting indices of substring concatenating each word in words exactly once.',
            structure: 'Each word has same length L. Run sliding window on L distinct offsets (0 to L-1).',
            skeleton: 'const wordLen = words[0].length, totalLen = wordLen * words.length, res = [];\n// for offset 0 to wordLen - 1: maintain word frequency window of size totalLen',
          },
        },
        {
          id: 'sw-count-subarray-least-k-max',
          title: 'Count Subarray with least k max element',
          slug: 'count-subarrays-where-max-element-appears-at-least-k-times',
          difficulty: 'Medium',
          patternId: 'sliding-window-core',
          hints: {
            recognition: 'Count subarrays where maximum element of array appears at least k times.',
            structure: 'Find max element. Maintain sliding window counting occurrences of max. When count >= k, all subarrays ending at right starting before or at left are valid.',
            skeleton: 'const maxVal = Math.max(...nums);\nlet left = 0, count = 0, ans = 0;\nfor (let right = 0; right < nums.length; right++) {\n  if (nums[right] === maxVal) count++;\n  while (count >= k) {\n    if (nums[left] === maxVal) count--;\n    left++;\n  }\n  ans += left;\n}\nreturn ans;',
          },
        },
      ],
    },
  ],
};
