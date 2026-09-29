/**
 * Topic 24: Bit Manipulation
 */

export const bitManipulation = {
  id: 'bit-manipulation',
  order: 24,
  name: 'Bit Manipulation',
  icon: '⚙️',
  description:
    'Exploit binary representation for O(1) tricks: XOR for duplicate detection, bitmask subsets, bit counting, and power-of-two checks.',
  patterns: [
    /* ── 1. XOR Tricks ─────────────────────────────────────────────────── */
    {
      id: 'bit-xor',
      name: 'XOR Tricks (Cancel-Out Properties)',
      topicId: 'bit-manipulation',
      signals: [
        'Find the one element that appears odd number of times',
        'Two numbers appear once; rest appear twice',
        'XOR of a range [1..n] using cycle pattern',
        '"cancel-out duplicates" phrasing',
      ],
      coreIdea:
        'x XOR x = 0 and x XOR 0 = x. XOR all elements: duplicates cancel, leaving the unique element. For two unique elements, split on a set bit into two groups.',
      dataStructure: 'No extra space',
      questions: [
        {
          id: 'bit-single-number',
          title: 'Single Number',
          slug: 'single-number',
          difficulty: 'Easy',
          patternId: 'bit-xor',
          hints: {
            recognition: 'All numbers appear twice except one; find that one.',
            structure: 'XOR all: pairs cancel → only the unique element remains.',
            skeleton: 'return nums.reduce((a,b)=>a^b,0);',
          },
        },
        {
          id: 'bit-single-number-ii',
          title: 'Single Number II',
          slug: 'single-number-ii',
          difficulty: 'Medium',
          patternId: 'bit-xor',
          hints: {
            recognition: 'All numbers appear three times except one; find it without division.',
            structure: 'For each bit position, sum all bits mod 3; remainder is the unique number\'s bit.',
            skeleton:
              'let res=0;\nfor (let b=0;b<32;b++) {\n  let sum=0;\n  for (const n of nums) sum+=(n>>b)&1;\n  res|=((sum%3)<<b);\n}\nreturn res;',
          },
        },
        {
          id: 'bit-single-number-iii',
          title: 'Single Number III',
          slug: 'single-number-iii',
          difficulty: 'Medium',
          patternId: 'bit-xor',
          hints: {
            recognition: 'Two numbers appear once; rest appear twice.',
            structure: 'XOR all → xor of two uniques. Find a set bit; split all nums into two groups; XOR each group.',
            skeleton:
              'let xor=nums.reduce((a,b)=>a^b);\nconst diff=xor&(-xor);\nlet a=0;\nfor (const n of nums) if (n&diff) a^=n;\nreturn [a,xor^a];',
          },
        },
        {
          id: 'bit-missing-number',
          title: 'Missing Number',
          slug: 'missing-number',
          difficulty: 'Easy',
          patternId: 'bit-xor',
          hints: {
            recognition: 'Find missing number in [0..n]; XOR with indices.',
            structure: 'XOR all indices 0..n with all nums; pairs cancel; missing remains.',
            skeleton:
              'let res=nums.length;\nfor (let i=0;i<nums.length;i++) res^=i^nums[i];\nreturn res;',
          },
        },
      ],
    },

    /* ── 2. Bit Counting & Masks ───────────────────────────────────────── */
    {
      id: 'bit-count-mask',
      name: 'Bit Counting & Bitmask Subsets',
      topicId: 'bit-manipulation',
      signals: [
        'Count set bits in all numbers 0..n (dp or popcount)',
        'Check if number is power of 2',
        'Enumerate all subsets of a set',
        'Bit reversal or swap tricks',
      ],
      coreIdea:
        'Counting bits: dp[i] = dp[i>>1] + (i&1). Power of 2: (n & (n-1)) === 0. Subset enumeration: from full_mask down, next subset = (sub-1) & mask.',
      dataStructure: 'DP Array / Bitmask Integer',
      questions: [
        {
          id: 'bit-counting-bits',
          title: 'Counting Bits',
          slug: 'counting-bits',
          difficulty: 'Easy',
          patternId: 'bit-count-mask',
          hints: {
            recognition: 'Count 1-bits in every number from 0 to n.',
            structure: 'dp[i] = dp[i >> 1] + (i & 1). Right-shift drops last bit; &1 checks it.',
            skeleton:
              'const dp=new Array(n+1).fill(0);\nfor (let i=1;i<=n;i++) dp[i]=dp[i>>1]+(i&1);\nreturn dp;',
          },
        },
        {
          id: 'bit-number-of-1-bits',
          title: 'Number of 1 Bits',
          slug: 'number-of-1-bits',
          difficulty: 'Easy',
          patternId: 'bit-count-mask',
          hints: {
            recognition: 'Count set bits (popcount / Hamming weight) of 32-bit integer.',
            structure: 'n & (n-1) removes the lowest set bit; count until n becomes 0.',
            skeleton:
              'let count=0;\nwhile(n) { n&=n-1; count++; }\nreturn count;',
          },
        },
        {
          id: 'bit-power-of-two',
          title: 'Power of Two',
          slug: 'power-of-two',
          difficulty: 'Easy',
          patternId: 'bit-count-mask',
          hints: {
            recognition: 'Is n a power of 2? Powers of 2 have exactly one set bit.',
            structure: 'n > 0 && (n & (n-1)) === 0.',
            skeleton: 'return n > 0 && (n & (n - 1)) === 0;',
          },
        },
        {
          id: 'bit-subsets',
          title: 'Subsets',
          slug: 'subsets',
          difficulty: 'Medium',
          patternId: 'bit-count-mask',
          hints: {
            recognition: 'Return all 2^n subsets of an array using bitmask enumeration.',
            structure: 'For mask 0 to (1<<n)-1: bit i set means nums[i] is in subset.',
            skeleton:
              'const res=[];\nfor (let mask=0;mask<(1<<nums.length);mask++) {\n  const sub=[];\n  for (let i=0;i<nums.length;i++) if (mask&(1<<i)) sub.push(nums[i]);\n  res.push(sub);\n}\nreturn res;',
          },
        },
        {
          id: 'bit-reverse-bits',
          title: 'Reverse Bits',
          slug: 'reverse-bits',
          difficulty: 'Easy',
          patternId: 'bit-count-mask',
          hints: {
            recognition: 'Reverse the 32-bit binary representation of a number.',
            structure: 'Shift out LSB of n, shift it into result from MSB side, repeat 32 times.',
            skeleton:
              'let res=0;\nfor (let i=0;i<32;i++) { res=(res<<1)|(n&1); n>>>=1; }\nreturn res>>>0;',
          },
        },
      ],
    },
  ],
};
