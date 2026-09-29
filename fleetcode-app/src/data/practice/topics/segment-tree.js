/**
 * Topic 27: Segment Tree & Fenwick Tree (BIT)
 */

export const segmentTreeTopic = {
  id: 'segment-tree',
  order: 27,
  name: 'Segment Tree & Fenwick Tree',
  icon: '🌳',
  description:
    'Range query data structures: Fenwick Tree (BIT) for point-update/prefix-sum queries in O(log N), and Segment Tree for range-min/max/sum with lazy propagation.',
  patterns: [
    /* ── 1. Fenwick Tree (BIT) ─────────────────────────────────────────── */
    {
      id: 'fenwick-tree',
      name: 'Fenwick Tree / Binary Indexed Tree',
      topicId: 'segment-tree',
      signals: [
        'Point update + prefix sum query in O(log N)',
        'Count elements smaller than x seen so far (coordinate compression)',
        'Count inversions using BIT',
        'Range sum queries with frequent updates',
      ],
      coreIdea:
        'BIT stores partial sums indexed by the lowest set bit. update(i, delta): add delta to i and propagate via i += i & (-i). query(i): prefix sum via i -= i & (-i).',
      dataStructure: 'Array indexed 1..N',
      questions: [
        {
          id: 'bit-range-sum',
          title: 'Range Sum Query – Mutable',
          slug: 'range-sum-query-mutable',
          difficulty: 'Medium',
          patternId: 'fenwick-tree',
          hints: {
            recognition: 'Point update + range sum query; frequent updates.',
            structure: 'Fenwick Tree: update propagates i += i&-i; prefix query sums via i -= i&-i.',
            skeleton:
              'class BIT {\n  constructor(n){this.tree=new Array(n+1).fill(0);this.n=n;}\n  update(i,delta){for(i++;i<=this.n;i+=i&-i)this.tree[i]+=delta;}\n  query(i){let s=0;for(i++;i>0;i-=i&-i)s+=this.tree[i];return s;}\n  range(l,r){return this.query(r)-(l>0?this.query(l-1):0);}\n}',
          },
        },
        {
          id: 'bit-count-smaller-after',
          title: 'Count of Smaller Numbers After Self',
          slug: 'count-of-smaller-numbers-after-self',
          difficulty: 'Hard',
          patternId: 'fenwick-tree',
          hints: {
            recognition: 'For each element, count how many to its right are smaller.',
            structure: 'Coordinate compress; scan right to left; BIT query(val-1) = count smaller.',
            skeleton:
              '// Coordinate compress nums to [1..n]\n// Scan from right; result[i] = bit.query(compressedVal-1)\n// bit.update(compressedVal, 1)',
          },
        },
        {
          id: 'bit-count-inversions-bit',
          title: 'Count Inversions (BIT)',
          slug: 'count-inversions-bit',
          url: 'https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1',
          difficulty: 'Medium',
          patternId: 'fenwick-tree',
          hints: {
            recognition: 'Count pairs (i,j) with i<j and nums[i]>nums[j] using BIT.',
            structure: 'Scan left to right; inversions += (i - bit.query(nums[i])); then update BIT.',
            skeleton:
              '// Coordinate compress\n// For each num left→right:\n//   inversions += i - bit.query(compressed[num])\n//   bit.update(compressed[num], 1)',
          },
        },
      ],
    },

    /* ── 2. Segment Tree ───────────────────────────────────────────────── */
    {
      id: 'seg-tree',
      name: 'Segment Tree (Range Queries)',
      topicId: 'segment-tree',
      signals: [
        'Range minimum / maximum / sum queries with point or range updates',
        'Lazy propagation for range assignment queries',
        '"Paint" or "fill" range then query coverage',
        'Dynamic range max/min with updates',
      ],
      coreIdea:
        'Build segment tree bottom-up in O(N). Each node covers range [l,r] = merge of [l,mid] and [mid+1,r]. Point update in O(log N); range query in O(log N). For range updates use lazy propagation.',
      dataStructure: 'Array of size 4N',
      questions: [
        {
          id: 'seg-range-min',
          title: 'Range Minimum Query (Segment Tree)',
          slug: 'range-minimum-query',
          url: 'https://www.geeksforgeeks.org/problems/range-minimum-query/1',
          difficulty: 'Medium',
          patternId: 'seg-tree',
          hints: {
            recognition: 'Multiple point updates and range min/max queries.',
            structure: 'Build: tree[node] = min(tree[left], tree[right]). Update and query recurse on halves.',
            skeleton:
              'class SegTree {\n  constructor(n){this.n=n;this.t=new Array(4*n).fill(Infinity);}\n  build(arr,node=1,l=0,r=this.n-1){\n    if(l===r){this.t[node]=arr[l];return;}\n    const m=(l+r)>>1;\n    this.build(arr,2*node,l,m); this.build(arr,2*node+1,m+1,r);\n    this.t[node]=Math.min(this.t[2*node],this.t[2*node+1]);\n  }\n  update(i,v,node=1,l=0,r=this.n-1){\n    if(l===r){this.t[node]=v;return;}\n    const m=(l+r)>>1;\n    i<=m?this.update(i,v,2*node,l,m):this.update(i,v,2*node+1,m+1,r);\n    this.t[node]=Math.min(this.t[2*node],this.t[2*node+1]);\n  }\n  query(ql,qr,node=1,l=0,r=this.n-1){\n    if(ql<=l&&r<=qr) return this.t[node];\n    if(qr<l||r<ql) return Infinity;\n    const m=(l+r)>>1;\n    return Math.min(this.query(ql,qr,2*node,l,m),this.query(ql,qr,2*node+1,m+1,r));\n  }\n}',
          },
        },
        {
          id: 'seg-falling-squares',
          title: 'Falling Squares',
          slug: 'falling-squares',
          difficulty: 'Hard',
          patternId: 'seg-tree',
          hints: {
            recognition: 'Stack squares on x-axis; query max height in range after each drop.',
            structure: 'Coordinate compress x-positions; segment tree with lazy propagation for range-max update and range-max query.',
            skeleton:
              '// Coordinate compress all x-coords\n// Segment tree with lazy: range update (set range to max value) and range max query\n// For each square: maxBelow = query(left, right-1); update(left, right-1, maxBelow+size)',
          },
        },
        {
          id: 'seg-my-calendar-iii',
          title: 'My Calendar III',
          slug: 'my-calendar-iii',
          difficulty: 'Hard',
          patternId: 'seg-tree',
          hints: {
            recognition: 'Maximum k-booking: how many times is a time slot booked across all events?',
            structure: 'Dynamic segment tree (only create nodes on demand); range +1 update; query global max.',
            skeleton:
              '// Dynamic segment tree: nodes created lazily\n// book(start,end): range update [start,end) +1\n// Return root max after each booking',
          },
        },
      ],
    },
  ],
};
