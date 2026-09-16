/**
 * Topic 2: Fast & Slow Pointers
 */

export const fastSlowPointers = {
  id: 'fast-slow-pointers',
  order: 2,
  name: 'Fast & Slow Pointers',
  icon: '🐢🐇',
  description: 'Floyd’s Cycle-Finding Algorithm using pointers moving at different speeds to detect cycles and middle elements.',
  patterns: [
    {
      id: 'fast-slow-core',
      name: 'Fast & Slow Pointers',
      topicId: 'fast-slow-pointers',
      signals: ['Cycle detection in linked list/array', 'Finding midpoint of linked list', 'Mathematical sequence convergence / loop'],
      coreIdea: 'Advance slow by 1 step and fast by 2 steps. If a cycle exists, they must collide in O(N) time and O(1) space.',
      dataStructure: 'Linked List / Array',
      questions: [
        {
          id: 'fsp-ll-cycle',
          title: 'Linked List Cycle',
          slug: 'linked-list-cycle',
          difficulty: 'Easy',
          patternId: 'fast-slow-core',
          hints: {
            recognition: 'Determine if a linked list has a cycle without modifying it.',
            structure: 'Slow moves 1 step, fast moves 2 steps. If fast meets slow, cycle exists.',
            skeleton: 'let slow = head, fast = head;\nwhile (fast && fast.next) {\n  slow = slow.next;\n  fast = fast.next.next;\n  if (slow === fast) return true;\n}\nreturn false;',
          },
        },
        {
          id: 'fsp-start-ll-cycle',
          title: 'Start of Linked List Cycle',
          slug: 'linked-list-cycle-ii',
          difficulty: 'Medium',
          patternId: 'fast-slow-core',
          hints: {
            recognition: 'Find the node where the cycle begins in a linked list.',
            structure: 'After slow and fast collide, reset slow to head. Advance both 1 step at a time; intersection is cycle start.',
            skeleton: 'let slow = head, fast = head;\nwhile (fast && fast.next) {\n  slow = slow.next; fast = fast.next.next;\n  if (slow === fast) {\n    slow = head;\n    while (slow !== fast) { slow = slow.next; fast = fast.next; }\n    return slow;\n  }\n}\nreturn null;',
          },
        },
        {
          id: 'fsp-happy-number',
          title: 'Happy Number',
          slug: 'happy-number',
          difficulty: 'Easy',
          patternId: 'fast-slow-core',
          hints: {
            recognition: 'Determine if number reaches 1 by repeatedly replacing it with sum of squared digits.',
            structure: 'Treat digit-square sum as next pointer in an implicit linked list. Use slow and fast.',
            skeleton: 'function sumSq(n) { let s = 0; while (n) { s += (n % 10)**2; n = Math.floor(n / 10); } return s; }\nlet slow = n, fast = sumSq(n);\nwhile (fast !== 1 && slow !== fast) {\n  slow = sumSq(slow);\n  fast = sumSq(sumSq(fast));\n}\nreturn fast === 1;',
          },
        },
        {
          id: 'fsp-find-duplicate',
          title: 'Find Duplicate Number',
          slug: 'find-the-duplicate-number',
          difficulty: 'Medium',
          patternId: 'fast-slow-core',
          hints: {
            recognition: 'Array of n + 1 integers between 1 and n containing duplicate, solve in O(1) extra space without modifying array.',
            structure: 'Interpret nums[i] as next pointer: i -> nums[i]. Find intersection then cycle start.',
            skeleton: 'let slow = nums[0], fast = nums[0];\ndo {\n  slow = nums[slow];\n  fast = nums[nums[fast]];\n} while (slow !== fast);\nslow = nums[0];\nwhile (slow !== fast) {\n  slow = nums[slow];\n  fast = nums[fast];\n}\nreturn slow;',
          },
        },
        {
          id: 'fsp-middle-ll',
          title: 'Middle of the Linked List',
          slug: 'middle-of-the-linked-list',
          difficulty: 'Easy',
          patternId: 'fast-slow-core',
          hints: {
            recognition: 'Find middle node of singly linked list in one pass.',
            structure: 'When fast reaches end, slow is at the middle node.',
            skeleton: 'let slow = head, fast = head;\nwhile (fast && fast.next) {\n  slow = slow.next;\n  fast = fast.next.next;\n}\nreturn slow;',
          },
        },
        {
          id: 'fsp-palindrome-ll',
          title: 'Palindrome Linked List',
          slug: 'palindrome-linked-list',
          difficulty: 'Easy',
          patternId: 'fast-slow-core',
          hints: {
            recognition: 'Check if a singly linked list is a palindrome in O(N) time and O(1) space.',
            structure: 'Find middle using fast/slow, reverse second half, compare node by node.',
            skeleton: 'let slow = head, fast = head;\nwhile (fast && fast.next) { slow = slow.next; fast = fast.next.next; }\nlet prev = null, curr = slow;\nwhile (curr) { const nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; }\nlet p1 = head, p2 = prev;\nwhile (p2) { if (p1.val !== p2.val) return false; p1 = p1.next; p2 = p2.next; }\nreturn true;',
          },
        },
        {
          id: 'fsp-reorder-list',
          title: 'Reorder List',
          slug: 'reorder-list',
          difficulty: 'Medium',
          patternId: 'fast-slow-core',
          hints: {
            recognition: 'Reorder list L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 ... in place.',
            structure: 'Split list at middle with fast/slow, reverse second half, merge the two halves alternately.',
            skeleton: 'let slow = head, fast = head;\nwhile (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }\nlet prev = null, curr = slow.next; slow.next = null;\nwhile (curr) { const nxt = curr.next; curr.next = prev; prev = curr; curr = nxt; }\nlet p1 = head, p2 = prev;\nwhile (p2) { const t1 = p1.next, t2 = p2.next; p1.next = p2; p2.next = t1; p1 = t1; p2 = t2; }',
          },
        },
        {
          id: 'fsp-cycle-circular-array',
          title: 'Cycle in Circular Array',
          slug: 'circular-array-loop',
          difficulty: 'Medium',
          patternId: 'fast-slow-core',
          hints: {
            recognition: 'Detect cycle of length > 1 moving strictly forward or strictly backward in circular array.',
            structure: 'For each index, run fast and slow pointers checking same direction invariant. Mark visited.',
            skeleton: 'function nextIdx(i, val) { const n = nums.length; return ((i + val) % n + n) % n; }\nfor (let i = 0; i < nums.length; i++) {\n  if (nums[i] === 0) continue;\n  let slow = i, fast = i, isForward = nums[i] > 0;\n  while (true) {\n    slow = nextIdx(slow, nums[slow]);\n    fast = nextIdx(fast, nums[fast]);\n    fast = nextIdx(fast, nums[fast]);\n    if (slow === fast) return true;\n  }\n}',
          },
        },
      ],
    },
  ],
};
