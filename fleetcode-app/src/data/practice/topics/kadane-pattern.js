/**
 * Topic 4: Kadane Pattern
 */

export const kadanePattern = {
  id: 'kadane-pattern',
  order: 4,
  name: 'Kadane Pattern',
  icon: '📈',
  description: 'Linear time dynamic programming technique to find maximum or minimum sum subsegments.',
  patterns: [
    {
      id: 'kadane-core',
      name: 'Kadane Pattern',
      topicId: 'kadane-pattern',
      signals: ['Contiguous subarray with max or min sum', 'Circular subarray max sum', 'Tracking max and min simultaneously (product)'],
      coreIdea: 'At each position, decide whether to extend the previous subarray or start fresh from current element: curr = max(num, curr + num).',
      dataStructure: 'Array',
      questions: [
        {
          id: 'kadane-max-subarray',
          title: 'Maximum Subarray',
          slug: 'maximum-subarray',
          difficulty: 'Medium',
          patternId: 'kadane-core',
          hints: {
            recognition: 'Find contiguous subarray which has largest sum.',
            structure: 'curr = Math.max(num, curr + num); max = Math.max(max, curr).',
            skeleton: 'let curr = nums[0], max = nums[0];\nfor (let i = 1; i < nums.length; i++) {\n  curr = Math.max(nums[i], curr + nums[i]);\n  max = Math.max(max, curr);\n}\nreturn max;',
          },
        },
        {
          id: 'kadane-min-subarray-sum',
          title: 'Minimum Subarray Sum',
          slug: 'maximum-subarray',
          difficulty: 'Easy',
          patternId: 'kadane-core',
          hints: {
            recognition: 'Find contiguous subarray which has smallest sum.',
            structure: 'Inverted Kadane: curr = Math.min(num, curr + num); min = Math.min(min, curr).',
            skeleton: 'let curr = nums[0], min = nums[0];\nfor (let i = 1; i < nums.length; i++) {\n  curr = Math.min(nums[i], curr + nums[i]);\n  min = Math.min(min, curr);\n}\nreturn min;',
          },
        },
        {
          id: 'kadane-max-product-subarray',
          title: 'Maximum Product Subarray',
          slug: 'maximum-product-subarray',
          difficulty: 'Medium',
          patternId: 'kadane-core',
          hints: {
            recognition: 'Find contiguous subarray with largest product (negative times negative can become positive).',
            structure: 'Track both maxProd and minProd at each step. Swap them when multiplying by negative number.',
            skeleton: 'let res = nums[0], curMax = nums[0], curMin = nums[0];\nfor (let i = 1; i < nums.length; i++) {\n  const num = nums[i];\n  if (num < 0) [curMax, curMin] = [curMin, curMax];\n  curMax = Math.max(num, curMax * num);\n  curMin = Math.min(num, curMin * num);\n  res = Math.max(res, curMax);\n}\nreturn res;',
          },
        },
        {
          id: 'kadane-max-sum-one-deletion',
          title: 'Max Subarray Sum with One Deletion',
          slug: 'maximum-subarray-sum-with-one-deletion',
          difficulty: 'Medium',
          patternId: 'kadane-core',
          hints: {
            recognition: 'Maximum subarray sum allowing at most one element deleted.',
            structure: 'Maintain two states: noDelete (standard Kadane) and oneDelete (either delete current element or extend previous deleted sum).',
            skeleton: 'let noDel = nums[0], oneDel = 0, res = nums[0];\nfor (let i = 1; i < nums.length; i++) {\n  oneDel = Math.max(noDel, oneDel + nums[i]);\n  noDel = Math.max(nums[i], noDel + nums[i]);\n  res = Math.max(res, noDel, oneDel);\n}\nreturn res;',
          },
        },
        {
          id: 'kadane-max-absolute-sum',
          title: 'Maximum Absolute Sum',
          slug: 'maximum-absolute-sum-of-any-subarray',
          difficulty: 'Medium',
          patternId: 'kadane-core',
          hints: {
            recognition: 'Maximum absolute sum of any subarray |sum(nums[i..j])|.',
            structure: 'Result is max of maximum subarray sum and absolute of minimum subarray sum.',
            skeleton: 'let maxS = 0, minS = 0, curMax = 0, curMin = 0;\nfor (const x of nums) {\n  curMax = Math.max(x, curMax + x);\n  maxS = Math.max(maxS, curMax);\n  curMin = Math.min(x, curMin + x);\n  minS = Math.min(minS, curMin);\n}\nreturn Math.max(maxS, Math.abs(minS));',
          },
        },
        {
          id: 'kadane-max-circular-subarray',
          title: 'Maximum Circular Subarray',
          slug: 'maximum-sum-circular-subarray',
          difficulty: 'Medium',
          patternId: 'kadane-core',
          hints: {
            recognition: 'Maximum subarray sum on circular buffer.',
            structure: 'Two cases: subarray is non-wrapping (standard max) or wrapping (totalSum - minSubarraySum). Edge case when all negative.',
            skeleton: 'let total = 0, curMax = 0, maxSub = nums[0], curMin = 0, minSub = nums[0];\nfor (const x of nums) {\n  curMax = Math.max(x, curMax + x); maxSub = Math.max(maxSub, curMax);\n  curMin = Math.min(x, curMin + x); minSub = Math.min(minSub, curMin);\n  total += x;\n}\nreturn maxSub > 0 ? Math.max(maxSub, total - minSub) : maxSub;',
          },
        },
      ],
    },
  ],
};
