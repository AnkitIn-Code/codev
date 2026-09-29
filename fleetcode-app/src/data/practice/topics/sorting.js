/**
 * Topic 26: Sorting Algorithms & Patterns
 */

export const sortingTopic = {
  id: 'sorting',
  order: 26,
  name: 'Sorting Algorithms',
  icon: '🔢',
  description:
    'Custom sort, merge sort divide-and-conquer, counting sort, and sort-then-apply patterns. Covers the classic coding interview sort-based tricks.',
  patterns: [
    /* ── 1. Custom Comparator Sort ─────────────────────────────────────── */
    {
      id: 'sort-custom',
      name: 'Custom Comparator Sort',
      topicId: 'sorting',
      signals: [
        'Sort by multiple criteria (e.g., end time, then start time)',
        'Largest number formed by concatenating integers',
        'Sort by frequency then lexicographic order',
        '"arrange" or "order" with a non-trivial rule',
      ],
      coreIdea:
        'Define a comparator function. For string concatenation ordering: compare b+a vs a+b. For multi-key: primary key first, secondary for ties.',
      dataStructure: 'Sorted Array',
      questions: [
        {
          id: 'sort-largest-number',
          title: 'Largest Number',
          slug: 'largest-number',
          difficulty: 'Medium',
          patternId: 'sort-custom',
          hints: {
            recognition: 'Arrange integers to form largest possible number.',
            structure: 'Custom comparator: (a,b) => (b+a) - (a+b) as strings.',
            skeleton:
              'nums.sort((a,b)=>(b+""+a).localeCompare(a+""+b));\nif (nums[0]===0) return "0";\nreturn nums.join("");',
          },
        },
        {
          id: 'sort-sort-colors',
          title: 'Sort Colors (Dutch National Flag)',
          slug: 'sort-colors',
          difficulty: 'Medium',
          patternId: 'sort-custom',
          hints: {
            recognition: 'Sort array of 0s, 1s, 2s in-place in one pass.',
            structure: 'Three pointers: low (boundary of 0s), mid (current), high (boundary of 2s).',
            skeleton:
              'let lo=0,mid=0,hi=nums.length-1;\nwhile(mid<=hi){\n  if(nums[mid]===0){[nums[lo],nums[mid]]=[nums[mid],nums[lo]];lo++;mid++;}\n  else if(nums[mid]===1) mid++;\n  else {[nums[mid],nums[hi]]=[nums[hi],nums[mid]];hi--;}\n}',
          },
        },
        {
          id: 'sort-sort-array-by-parity',
          title: 'Sort Array By Parity',
          slug: 'sort-array-by-parity',
          difficulty: 'Easy',
          patternId: 'sort-custom',
          hints: {
            recognition: 'Move all even integers before odd integers.',
            structure: 'Two-pointer swap: left scans for odd, right scans for even, swap.',
            skeleton:
              'let l=0,r=nums.length-1;\nwhile(l<r){\n  while(l<r&&nums[l]%2===0)l++;\n  while(l<r&&nums[r]%2===1)r--;\n  if(l<r)[nums[l],nums[r]]=[nums[r],nums[l]];\n}\nreturn nums;',
          },
        },
      ],
    },

    /* ── 2. Merge Sort Divide & Conquer ────────────────────────────────── */
    {
      id: 'sort-merge-dc',
      name: 'Merge Sort & Divide and Conquer',
      topicId: 'sorting',
      signals: [
        'Count inversions in an array',
        '"How many pairs (i,j) with i<j satisfy a condition?"',
        'Divide array in half, solve each half, merge results',
        'Count during merge step (important pairs)',
      ],
      coreIdea:
        'During the merge step, when right-half element is placed before left-half elements, all remaining left-half elements form inversions/count-pairs with it. Accumulate the count during merge.',
      dataStructure: 'Recursive + Temp Array',
      questions: [
        {
          id: 'sort-count-inversions',
          title: 'Count Inversions',
          slug: 'count-inversions',
          // Classic GFG merge-sort inversion count problem
          url: 'https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1',
          difficulty: 'Medium',
          patternId: 'sort-merge-dc',
          hints: {
            recognition: 'Count pairs (i,j) where i<j but nums[i]>nums[j] — inversions.',
            structure: 'Merge sort: each time right element crosses left elements, add remaining left count.',
            skeleton:
              'function mergeSort(arr) {\n  if (arr.length<=1) return [arr,0];\n  const mid=arr.length>>1;\n  let [left,lc]=mergeSort(arr.slice(0,mid));\n  let [right,rc]=mergeSort(arr.slice(mid));\n  const merged=[]; let i=0,j=0,inv=lc+rc;\n  while(i<left.length&&j<right.length) {\n    if(left[i]<=right[j]) merged.push(left[i++]);\n    else {merged.push(right[j++]); inv+=left.length-i;}\n  }\n  return [[...merged,...left.slice(i),...right.slice(j)],inv];\n}',
          },
        },
        {
          id: 'sort-reverse-pairs',
          title: 'Reverse Pairs',
          slug: 'reverse-pairs',
          difficulty: 'Hard',
          patternId: 'sort-merge-dc',
          hints: {
            recognition: 'Count pairs (i, j) where i < j and nums[i] > 2 * nums[j].',
            structure: 'Merge sort divide-and-conquer: before merging two sorted halves, count pairs satisfying nums[i] > 2 * nums[j] using two pointers in O(n).',
            skeleton:
              'function countReversePairs(arr) {\n  // In merge step, for each i in left half, advance j in right half while nums[i] > 2 * nums[j]\n  // count += (j - (mid + 1))\n}',
          },
        },
        {
          id: 'sort-912-sort-array',
          title: 'Sort an Array (Merge Sort Implementation)',
          slug: 'sort-an-array',
          difficulty: 'Medium',
          patternId: 'sort-merge-dc',
          hints: {
            recognition: 'Implement merge sort from scratch (O(N log N)).',
            structure: 'Divide at midpoint; recursively sort each half; merge back.',
            skeleton:
              'function mergeSort(l,r){\n  if(l>=r) return;\n  const m=(l+r)>>1;\n  mergeSort(l,m); mergeSort(m+1,r);\n  merge(l,m,r);\n}\nfunction merge(l,m,r){\n  const tmp=[];\n  let i=l,j=m+1;\n  while(i<=m&&j<=r) nums[i]<=nums[j]?tmp.push(nums[i++]):tmp.push(nums[j++]);\n  while(i<=m) tmp.push(nums[i++]);\n  while(j<=r) tmp.push(nums[j++]);\n  for(let k=l;k<=r;k++) nums[k]=tmp[k-l];\n}',
          },
        },
      ],
    },

    /* ── 3. Counting / Bucket Sort ─────────────────────────────────────── */
    {
      id: 'sort-count',
      name: 'Counting Sort & Bucket Sort',
      topicId: 'sorting',
      signals: [
        'Sort integers in range [0..k] in O(N+k)',
        '"Top k frequent" elements',
        'Relative sort by custom frequency array',
        'Sort characters by frequency',
      ],
      coreIdea:
        'Count occurrences in an array; accumulate for positions (counting sort). For "top k frequent": bucket by frequency index; scan from highest bucket down.',
      dataStructure: 'Frequency Array / Bucket Array',
      questions: [
        {
          id: 'sort-top-k-frequent',
          title: 'Top K Frequent Elements',
          slug: 'top-k-frequent-elements',
          difficulty: 'Medium',
          patternId: 'sort-count',
          hints: {
            recognition: 'Return k most frequent elements; O(N log N) or better.',
            structure: 'Count freq; bucket by freq index (bucket[freq] = list of elements); scan from end.',
            skeleton:
              'const freq=new Map();\nfor (const n of nums) freq.set(n,(freq.get(n)||0)+1);\nconst buckets=new Array(nums.length+1).fill(null).map(()=>[]);\nfor (const [n,f] of freq) buckets[f].push(n);\nconst res=[];\nfor (let i=buckets.length-1;i>=0&&res.length<k;i--) res.push(...buckets[i]);\nreturn res.slice(0,k);',
          },
        },
        {
          id: 'sort-frequency-sort',
          title: 'Sort Characters By Frequency',
          slug: 'sort-characters-by-frequency',
          difficulty: 'Medium',
          patternId: 'sort-count',
          hints: {
            recognition: 'Sort string characters in decreasing order of frequency.',
            structure: 'Count freq; sort by frequency desc; rebuild string.',
            skeleton:
              'const freq=new Map();\nfor (const c of s) freq.set(c,(freq.get(c)||0)+1);\nreturn [...freq.entries()].sort((a,b)=>b[1]-a[1]).map(([c,n])=>c.repeat(n)).join("");',
          },
        },
        {
          id: 'sort-relative-sort',
          title: 'Relative Sort Array',
          slug: 'relative-sort-array',
          difficulty: 'Easy',
          patternId: 'sort-count',
          hints: {
            recognition: 'Sort arr1 so elements appear in same relative order as arr2; rest sorted ascending.',
            structure: 'Map arr2 elements to their rank; sort arr1 by rank; elements not in arr2 go to end sorted.',
            skeleton:
              'const rank=new Map(arr2.map((v,i)=>[v,i]));\nreturn arr1.sort((a,b)=>{\n  const ra=rank.has(a)?rank.get(a):arr2.length+a;\n  const rb=rank.has(b)?rank.get(b):arr2.length+b;\n  return ra-rb;\n});',
          },
        },
      ],
    },
  ],
};
