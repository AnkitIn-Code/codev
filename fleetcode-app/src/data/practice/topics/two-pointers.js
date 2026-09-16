/**
 * Topic 1: Two Pointers
 */

export const twoPointers = {
  id: 'two-pointers',
  order: 1,
  name: 'Two Pointers',
  icon: '👉👈',
  description: 'Technique using two pointers to traverse data structures from opposite ends or at different speeds.',
  patterns: [
    {
      id: 'two-pointers-core',
      name: 'Two Pointers',
      topicId: 'two-pointers',
      signals: ['Sorted array searching pairs', 'In-place array rearrangement', 'Meeting from opposite ends', 'Triplets/quadruplets sum'],
      coreIdea: 'Use two pointers starting at opposite boundaries (or same side) moving inward based on comparison with target to achieve O(N) or O(N^2) instead of brute-force.',
      dataStructure: 'Array / String',
      questions: [
        {
          id: 'tp-pair-target-sum',
          title: 'Pair with Target Sum',
          slug: 'two-sum-ii-input-array-is-sorted',
          difficulty: 'Easy',
          patternId: 'two-pointers-core',
          hints: {
            recognition: 'Sorted array where two numbers must sum to target.',
            structure: 'Start left = 0, right = n - 1. If sum == target return indices; if sum < target left++; if sum > target right--.',
            skeleton: 'let left = 0, right = nums.length - 1;\nwhile (left < right) {\n  const sum = nums[left] + nums[right];\n  if (sum === target) return [left + 1, right + 1];\n  if (sum < target) left++;\n  else right--;\n}',
          },
        },
        {
          id: 'tp-rearrange-01',
          title: 'Rearrange 0 and 1',
          slug: 'sort-colors',
          difficulty: 'Medium',
          patternId: 'two-pointers-core',
          hints: {
            recognition: 'Array with only 0s and 1s (or 0, 1, 2) that must be partitioned in-place.',
            structure: 'Two pointers left and right. Swap 0 to left and 1 (or 2) to right in one pass.',
            skeleton: 'let left = 0, right = nums.length - 1;\nwhile (left < right) {\n  while (left < right && nums[left] === 0) left++;\n  while (left < right && nums[right] === 1) right--;\n  if (left < right) {\n    [nums[left], nums[right]] = [nums[right], nums[left]];\n    left++; right--;\n  }\n}',
          },
        },
        {
          id: 'tp-remove-duplicates',
          title: 'Remove Duplicates',
          slug: 'remove-duplicates-from-sorted-array',
          difficulty: 'Easy',
          patternId: 'two-pointers-core',
          hints: {
            recognition: 'In-place removal of duplicates from sorted array.',
            structure: 'Slow-fast pointers: slow marks position of last unique element, fast scans forward.',
            skeleton: 'let slow = 0;\nfor (let fast = 1; fast < nums.length; fast++) {\n  if (nums[fast] !== nums[slow]) {\n    slow++;\n    nums[slow] = nums[fast];\n  }\n}\nreturn slow + 1;',
          },
        },
        {
          id: 'tp-squaring-sorted-array',
          title: 'Squaring a Sorted Array',
          slug: 'squares-of-a-sorted-array',
          difficulty: 'Easy',
          patternId: 'two-pointers-core',
          hints: {
            recognition: 'Sorted array containing negative and positive numbers; result squares must be sorted.',
            structure: 'Largest squares are at the extremes. Compare left^2 and right^2, place larger at back of result.',
            skeleton: 'const res = new Array(n);\nlet left = 0, right = n - 1, p = n - 1;\nwhile (left <= right) {\n  const l2 = nums[left] ** 2, r2 = nums[right] ** 2;\n  if (l2 > r2) { res[p--] = l2; left++; }\n  else { res[p--] = r2; right--; }\n}\nreturn res;',
          },
        },
        {
          id: 'tp-triplet-sum-zero',
          title: 'Triplet Sum to Zero',
          slug: '3sum',
          difficulty: 'Medium',
          patternId: 'two-pointers-core',
          hints: {
            recognition: 'Find all unique triplets [a, b, c] such that a + b + c = 0.',
            structure: 'Sort array. Fix nums[i], then use two pointers left=i+1, right=n-1. Skip duplicates.',
            skeleton: 'nums.sort((a, b) => a - b);\nfor (let i = 0; i < nums.length - 2; i++) {\n  if (i > 0 && nums[i] === nums[i - 1]) continue;\n  let l = i + 1, r = nums.length - 1;\n  while (l < r) {\n    const sum = nums[i] + nums[l] + nums[r];\n    if (sum === 0) { res.push([nums[i], nums[l], nums[r]]); while (nums[l] === nums[l+1]) l++; while (nums[r] === nums[r-1]) r--; l++; r--; }\n    else if (sum < 0) l++;\n    else r--;\n  }\n}',
          },
        },
        {
          id: 'tp-triplet-sum-close',
          title: 'Triplet Sum Close to Target',
          slug: '3sum-closest',
          difficulty: 'Medium',
          patternId: 'two-pointers-core',
          hints: {
            recognition: 'Triplet whose sum is closest to given target.',
            structure: 'Sort array. For each i, run two pointers. Keep track of closest diff Math.abs(sum - target).',
            skeleton: 'nums.sort((a, b) => a - b);\nlet closest = nums[0] + nums[1] + nums[2];\nfor (let i = 0; i < n - 2; i++) {\n  let l = i + 1, r = n - 1;\n  while (l < r) {\n    const sum = nums[i] + nums[l] + nums[r];\n    if (Math.abs(sum - target) < Math.abs(closest - target)) closest = sum;\n    if (sum < target) l++; else r--;\n  }\n}',
          },
        },
        {
          id: 'tp-triplets-smaller-sum',
          title: 'Triplets with Smaller Sum',
          slug: '3sum-smaller',
          difficulty: 'Medium',
          patternId: 'two-pointers-core',
          hints: {
            recognition: 'Count triplets with nums[i] + nums[j] + nums[k] < target.',
            structure: 'Sort array. When sum < target, all pairs between left and right also sum < target (count += right - left).',
            skeleton: 'nums.sort((a, b) => a - b);\nlet count = 0;\nfor (let i = 0; i < n - 2; i++) {\n  let l = i + 1, r = n - 1;\n  while (l < r) {\n    if (nums[i] + nums[l] + nums[r] < target) { count += r - l; l++; }\n    else r--;\n  }\n}',
          },
        },
        {
          id: 'tp-subarrays-product-k',
          title: 'Subarrays with Product < K',
          slug: 'subarray-product-less-than-k',
          difficulty: 'Medium',
          patternId: 'two-pointers-core',
          hints: {
            recognition: 'Contiguous subarrays where product of all elements is strictly less than k.',
            structure: 'Two-pointer sliding window. Maintain prod *= nums[right]; while (prod >= k) prod /= nums[left++]; ans += right - left + 1.',
            skeleton: 'if (k <= 1) return 0;\nlet prod = 1, left = 0, ans = 0;\nfor (let right = 0; right < nums.length; right++) {\n  prod *= nums[right];\n  while (prod >= k) prod /= nums[left++];\n  ans += right - left + 1;\n}',
          },
        },
        {
          id: 'tp-dutch-national-flag',
          title: 'Dutch National Flag',
          slug: 'sort-colors',
          difficulty: 'Medium',
          patternId: 'two-pointers-core',
          hints: {
            recognition: 'Sort array containing 0s, 1s, and 2s in-place in a single pass.',
            structure: 'Three pointers: low, mid, high. Swap 0 to low, 2 to high, advance mid on 1.',
            skeleton: 'let low = 0, mid = 0, high = nums.length - 1;\nwhile (mid <= high) {\n  if (nums[mid] === 0) { [nums[low], nums[mid]] = [nums[mid], nums[low]]; low++; mid++; }\n  else if (nums[mid] === 1) { mid++; }\n  else { [nums[mid], nums[high]] = [nums[high], nums[mid]]; high--; }\n}',
          },
        },
        {
          id: 'tp-4sum',
          title: '4 Sum',
          slug: '4sum',
          difficulty: 'Medium',
          patternId: 'two-pointers-core',
          hints: {
            recognition: 'Four elements summing to target with no duplicates.',
            structure: 'Sort array. Double loop for i and j, then two pointers left and right. Skip duplicates at every layer.',
            skeleton: 'nums.sort((a,b)=>a-b);\nfor (let i=0; i<n-3; i++) {\n  if (i > 0 && nums[i] === nums[i-1]) continue;\n  for (let j=i+1; j<n-2; j++) {\n    if (j > i+1 && nums[j] === nums[j-1]) continue;\n    let l = j+1, r = n-1;\n    while (l < r) {\n      const sum = nums[i] + nums[j] + nums[l] + nums[r];\n      if (sum === target) { res.push([nums[i], nums[j], nums[l], nums[r]]); l++; r--; }\n      else if (sum < target) l++; else r--;\n    }\n  }\n}',
          },
        },
        {
          id: 'tp-backspace-string-compare',
          title: 'Backspace String Compare',
          slug: 'backspace-string-compare',
          difficulty: 'Easy',
          patternId: 'two-pointers-core',
          hints: {
            recognition: 'Compare two strings with # backspaces in O(1) space.',
            structure: 'Traverse backwards from end of both strings using skip counters for #.',
            skeleton: 'let i = s.length - 1, j = t.length - 1;\nwhile (i >= 0 || j >= 0) {\n  i = getNextValidCharIndex(s, i);\n  j = getNextValidCharIndex(t, j);\n  if (i < 0 && j < 0) return true;\n  if (i < 0 || j < 0 || s[i] !== t[j]) return false;\n  i--; j--;\n}',
          },
        },
        {
          id: 'tp-min-window-sort',
          title: 'Minimum Window Sort',
          slug: 'shortest-unsorted-continuous-subarray',
          difficulty: 'Medium',
          patternId: 'two-pointers-core',
          hints: {
            recognition: 'Find the shortest contiguous subarray that, if sorted, sorts the whole array.',
            structure: 'Scan left-to-right to find last element < running max (end). Scan right-to-left to find first element > running min (start).',
            skeleton: 'let max = -Infinity, end = -1;\nfor (let i = 0; i < n; i++) {\n  if (nums[i] < max) end = i; else max = nums[i];\n}\nlet min = Infinity, start = 0;\nfor (let i = n - 1; i >= 0; i--) {\n  if (nums[i] > min) start = i; else min = nums[i];\n}\nreturn end === -1 ? 0 : end - start + 1;',
          },
        },
      ],
    },
  ],
};
