/**
 * Topic 7: Linked List Reversal
 */

export const linkedListReversal = {
  id: 'linked-list-reversal',
  order: 7,
  name: 'Linked List Reversal',
  icon: '🔗',
  description: 'In-place pointer manipulation to reverse entire or segmented portions of a singly linked list.',
  patterns: [
    {
      id: 'll-reversal-core',
      name: 'Linked List Reversal',
      topicId: 'linked-list-reversal',
      signals: ['Reverse list in-place', 'Reverse sublist from m to n', 'K-group reversal', 'Rotating nodes'],
      coreIdea: 'Use prev, curr, and next pointers to reverse direction of .next links one node at a time with O(1) auxiliary space.',
      dataStructure: 'Linked List',
      questions: [
        {
          id: 'llr-reverse-linked-list',
          title: 'Reverse Linked List',
          slug: 'reverse-linked-list',
          difficulty: 'Easy',
          patternId: 'll-reversal-core',
          hints: {
            recognition: 'Reverse a singly linked list iteratively in O(1) space.',
            structure: 'Maintain prev=null, curr=head. Save next = curr.next, redirect curr.next = prev, slide prev and curr.',
            skeleton: 'let prev = null, curr = head;\nwhile (curr) {\n  const next = curr.next;\n  curr.next = prev;\n  prev = curr;\n  curr = next;\n}\nreturn prev;',
          },
        },
        {
          id: 'llr-reverse-linked-list-ii',
          title: 'Reverse Linked List II',
          slug: 'reverse-linked-list-ii',
          difficulty: 'Medium',
          patternId: 'll-reversal-core',
          hints: {
            recognition: 'Reverse nodes from position left to right only.',
            structure: 'Advance to node before left (pre). In-place link redirection right - left times.',
            skeleton: 'const dummy = { next: head };\nlet pre = dummy;\nfor (let i = 1; i < left; i++) pre = pre.next;\nlet curr = pre.next;\nfor (let i = 0; i < right - left; i++) {\n  const nxt = curr.next;\n  curr.next = nxt.next;\n  nxt.next = pre.next;\n  pre.next = nxt;\n}\nreturn dummy.next;',
          },
        },
        {
          id: 'llr-swap-nodes-pairs',
          title: 'Swap Nodes in Pairs',
          slug: 'swap-nodes-in-pairs',
          difficulty: 'Medium',
          patternId: 'll-reversal-core',
          hints: {
            recognition: 'Swap every two adjacent nodes in-place without changing values.',
            structure: 'Dummy node before head. In each iteration, swap first and second node pointers.',
            skeleton: 'const dummy = { next: head };\nlet prev = dummy;\nwhile (prev.next && prev.next.next) {\n  const first = prev.next, second = prev.next.next;\n  first.next = second.next;\n  second.next = first;\n  prev.next = second;\n  prev = first;\n}\nreturn dummy.next;',
          },
        },
        {
          id: 'llr-reverse-nodes-k-group',
          title: 'Reverse Nodes in K Group',
          slug: 'reverse-nodes-in-k-group',
          difficulty: 'Hard',
          patternId: 'll-reversal-core',
          hints: {
            recognition: 'Reverse nodes in blocks of size k; leave trailing group < k untouched.',
            structure: 'Check if k nodes remain ahead. If so, reverse those k nodes and connect with previous group.',
            skeleton: 'let count = 0, node = head;\nwhile (node && count < k) { node = node.next; count++; }\nif (count < k) return head;\nlet prev = null, curr = head;\nfor (let i = 0; i < k; i++) {\n  const nxt = curr.next; curr.next = prev; prev = curr; curr = nxt;\n}\nhead.next = reverseKGroup(curr, k);\nreturn prev;',
          },
        },
        {
          id: 'llr-reverse-nodes-even-groups',
          title: 'Reverse Nodes in Even Length Groups',
          slug: 'reverse-nodes-in-even-length-groups',
          difficulty: 'Medium',
          patternId: 'll-reversal-core',
          hints: {
            recognition: 'Group sizes grow 1, 2, 3... reverse only groups with an even number of nodes.',
            structure: 'Determine actual length of current group. If length is even, reverse in place; otherwise leave intact.',
            skeleton: 'let prev = head, groupLen = 2;\nwhile (prev.next) {\n  let cur = prev.next, len = 0;\n  while (cur && len < groupLen) { cur = cur.next; len++; }\n  if (len % 2 === 0) { /* reverse len nodes */ }\n  else { for (let i = 0; i < len; i++) prev = prev.next; }\n  groupLen++;\n}',
          },
        },
        {
          id: 'llr-rotate-list',
          title: 'Rotate List',
          slug: 'rotate-list',
          difficulty: 'Medium',
          patternId: 'll-reversal-core',
          hints: {
            recognition: 'Rotate the list to the right by k places.',
            structure: 'Compute list length. Connect tail to head to form ring. Break ring at length - (k % length).',
            skeleton: 'if (!head || !head.next || k === 0) return head;\nlet len = 1, tail = head;\nwhile (tail.next) { tail = tail.next; len++; }\ntail.next = head;\nk = k % len;\nfor (let i = 0; i < len - k; i++) tail = tail.next;\nconst newHead = tail.next;\ntail.next = null;\nreturn newHead;',
          },
        },
      ],
    },
  ],
};
