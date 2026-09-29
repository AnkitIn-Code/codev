/**
 * Topic 25: Monotonic Stack / Queue
 */

export const monotonicStackTopic = {
  id: 'monotonic-stack',
  order: 25,
  name: 'Monotonic Stack / Queue',
  icon: '📉',
  description:
    'A stack or deque maintained in a strictly increasing or decreasing order. The go-to pattern for "next greater/smaller element", histogram area, and sliding window maximum.',
  patterns: [
    /* ── 1. Monotonic Stack ───────────────────────────────────────────── */
    {
      id: 'mono-stack',
      name: 'Monotonic Stack (Next Greater / Smaller)',
      topicId: 'monotonic-stack',
      signals: [
        'For each element, find the next greater / smaller element',
        'Largest rectangle / maximum area under a histogram',
        'Spans, stock prices, or temperatures that form "wait until bigger" queries',
        '"Immediately to the right / left that is bigger / smaller"',
      ],
      coreIdea:
        'Maintain a stack of indices in monotonically decreasing order (for Next Greater). When a new element exceeds the top, pop and record answer. Push new element. O(N) overall.',
      dataStructure: 'Stack (indices)',
      questions: [
        {
          id: 'mono-daily-temperatures',
          title: 'Daily Temperatures',
          slug: 'daily-temperatures',
          difficulty: 'Medium',
          patternId: 'mono-stack',
          hints: {
            recognition: 'For each day, how many days until a warmer temperature?',
            structure: 'Monotonic decreasing stack of indices; pop when hotter day found, record gap.',
            skeleton:
              'const ans=new Array(n).fill(0),stack=[];\nfor (let i=0;i<n;i++) {\n  while(stack.length&&temps[stack.at(-1)]<temps[i]) ans[stack.at(-1)]=i-stack.pop();\n  stack.push(i);\n}\nreturn ans;',
          },
        },
        {
          id: 'mono-next-greater',
          title: 'Next Greater Element I',
          slug: 'next-greater-element-i',
          difficulty: 'Easy',
          patternId: 'mono-stack',
          hints: {
            recognition: 'For nums1 elements, find next greater in nums2.',
            structure: 'Build NGE map for nums2 using monotonic stack; look up each nums1 element.',
            skeleton:
              'const map=new Map(),stack=[];\nfor (const n of nums2) {\n  while(stack.length&&stack.at(-1)<n) map.set(stack.pop(),n);\n  stack.push(n);\n}\nreturn nums1.map(n=>map.get(n)??-1);',
          },
        },
        {
          id: 'mono-largest-rectangle',
          title: 'Largest Rectangle in Histogram',
          slug: 'largest-rectangle-in-histogram',
          difficulty: 'Hard',
          patternId: 'mono-stack',
          hints: {
            recognition: 'Maximum area rectangle in histogram.',
            structure: 'Monotonic increasing stack of indices; on pop, width = i − stack.top − 1; area = heights[popped] × width.',
            skeleton:
              'const stack=[],heights=[...h,0]; let max=0;\nfor (let i=0;i<heights.length;i++) {\n  while(stack.length&&heights[stack.at(-1)]>heights[i]) {\n    const h2=heights[stack.pop()];\n    const w=stack.length?i-stack.at(-1)-1:i;\n    max=Math.max(max,h2*w);\n  }\n  stack.push(i);\n}\nreturn max;',
          },
        },
        {
          id: 'mono-trapping-rain',
          title: 'Trapping Rain Water',
          slug: 'trapping-rain-water',
          difficulty: 'Hard',
          patternId: 'mono-stack',
          hints: {
            recognition: 'How much water is trapped between elevation bars.',
            structure: 'Two-pointer: left and right tracking maxLeft and maxRight; water = min(maxL,maxR) − height.',
            skeleton:
              'let l=0,r=n-1,maxL=0,maxR=0,water=0;\nwhile(l<r) {\n  if (height[l]<=height[r]) { height[l]>=maxL?maxL=height[l]:water+=maxL-height[l]; l++; }\n  else { height[r]>=maxR?maxR=height[r]:water+=maxR-height[r]; r--; }\n}\nreturn water;',
          },
        },
        {
          id: 'mono-sum-subarray-mins',
          title: 'Sum of Subarray Minimums',
          slug: 'sum-of-subarray-minimums',
          difficulty: 'Medium',
          patternId: 'mono-stack',
          hints: {
            recognition: 'Sum of min(subarray) for all subarrays.',
            structure: 'For each element as minimum, find previous smaller (left) and next smaller-or-equal (right). Count = left × right subarrays.',
            skeleton:
              'const MOD=1e9+7,n=arr.length,stack=[];\nconst left=new Array(n),right=new Array(n);\nfor (let i=0;i<n;i++){while(stack.length&&arr[stack.at(-1)]>=arr[i])stack.pop();left[i]=stack.length?i-stack.at(-1)-1:i+1;stack.push(i);}\nstack.length=0;\nfor (let i=n-1;i>=0;i--){while(stack.length&&arr[stack.at(-1)]>arr[i])stack.pop();right[i]=stack.length?stack.at(-1)-i:n-i;stack.push(i);}\nreturn arr.reduce((sum,a,i)=>(sum+BigInt(a)*BigInt(left[i])*BigInt(right[i]))%BigInt(MOD),0n).toString()|0;',
          },
        },
      ],
    },

    /* ── 2. Monotonic Deque (Sliding Window) ──────────────────────────── */
    {
      id: 'mono-deque',
      name: 'Monotonic Deque (Sliding Window Max/Min)',
      topicId: 'monotonic-stack',
      signals: [
        'Sliding window maximum or minimum in O(N)',
        'Window constraint that "jumps" based on deque front',
        'Jump game / reach with deque-managed reach window',
        'Max in every window of size k',
      ],
      coreIdea:
        'Maintain a deque of indices in decreasing order of values. Front = current window max. Evict front if out of window. Evict tail if new element is larger (useless for future windows).',
      dataStructure: 'Deque (double-ended queue of indices)',
      questions: [
        {
          id: 'dq-sliding-window-max',
          title: 'Sliding Window Maximum',
          slug: 'sliding-window-maximum',
          difficulty: 'Hard',
          patternId: 'mono-deque',
          hints: {
            recognition: 'Maximum in every subarray of size k.',
            structure: 'Deque keeps indices in decreasing value order; front = max; evict stale front when i-deque[0] >= k.',
            skeleton:
              'const dq=[],res=[];\nfor (let i=0;i<nums.length;i++) {\n  while(dq.length&&dq[0]<=i-k) dq.shift();\n  while(dq.length&&nums[dq.at(-1)]<nums[i]) dq.pop();\n  dq.push(i);\n  if (i>=k-1) res.push(nums[dq[0]]);\n}\nreturn res;',
          },
        },
        {
          id: 'dq-jump-game-vi',
          title: 'Jump Game VI',
          slug: 'jump-game-vi',
          difficulty: 'Medium',
          patternId: 'mono-deque',
          hints: {
            recognition: 'From index i jump 1..k steps; maximise dp[n-1].',
            structure: 'dp[i] = nums[i] + max(dp[i-k..i-1]). Use deque to get window max in O(1).',
            skeleton:
              'const dp=[...nums],dq=[0];\nfor (let i=1;i<n;i++) {\n  while(dq.length&&dq[0]<i-k) dq.shift();\n  dp[i]+=dp[dq[0]];\n  while(dq.length&&dp[dq.at(-1)]<=dp[i]) dq.pop();\n  dq.push(i);\n}\nreturn dp[n-1];',
          },
        },
        {
          id: 'dq-longest-subarray-limit',
          title: 'Longest Continuous Subarray With Absolute Diff ≤ Limit',
          slug: 'longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit',
          difficulty: 'Medium',
          patternId: 'mono-deque',
          hints: {
            recognition: 'Longest subarray where max − min ≤ limit.',
            structure: 'Two deques (max-deque, min-deque); shrink left when max−min > limit.',
            skeleton:
              'const maxDq=[],minDq=[]; let l=0,res=0;\nfor (let r=0;r<nums.length;r++) {\n  while(maxDq.length&&nums[maxDq.at(-1)]<=nums[r]) maxDq.pop(); maxDq.push(r);\n  while(minDq.length&&nums[minDq.at(-1)]>=nums[r]) minDq.pop(); minDq.push(r);\n  while(nums[maxDq[0]]-nums[minDq[0]]>limit) { l++; if(maxDq[0]<l)maxDq.shift(); if(minDq[0]<l)minDq.shift(); }\n  res=Math.max(res,r-l+1);\n}\nreturn res;',
          },
        },
      ],
    },
  ],
};
