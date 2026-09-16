/**
 * Topic 8: Stack
 */

export const stackTopic = {
  id: 'stack',
  order: 8,
  name: 'Stack',
  icon: '🥞',
  description: 'LIFO data structure pattern for parsing, matching parentheses, monotonic spans, and greedy digit manipulation.',
  patterns: [
    {
      id: 'stack-core',
      name: 'Stack & Monotonic Stack',
      topicId: 'stack',
      signals: ['Matching nested pairs (brackets)', 'Next greater/smaller element queries', 'Adjacent deduplication', 'Path evaluation'],
      coreIdea: 'Push elements to stack; pop when matching criteria met or when monotonic invariant (increasing/decreasing order) is violated.',
      dataStructure: 'Stack / Array',
      questions: [
        {
          id: 'stk-remove-adj-dup',
          title: 'Remove Adjacent Duplicates',
          slug: 'remove-all-adjacent-duplicates-in-string',
          difficulty: 'Easy',
          patternId: 'stack-core',
          hints: {
            recognition: 'Repeatedly remove two adjacent matching characters until none remain.',
            structure: 'Stack holds output characters. If top of stack matches current character, pop; else push.',
            skeleton: 'const stack = [];\nfor (const c of s) {\n  if (stack.length && stack[stack.length - 1] === c) stack.pop();\n  else stack.push(c);\n}\nreturn stack.join("");',
          },
        },
        {
          id: 'stk-valid-parentheses',
          title: 'Valid Parentheses',
          slug: 'valid-parentheses',
          difficulty: 'Easy',
          patternId: 'stack-core',
          hints: {
            recognition: 'Determine if string of brackets (), {}, [] is valid.',
            structure: 'Push closing bracket when opening bracket is encountered; on closing bracket, check stack.pop() === bracket.',
            skeleton: 'const map = { "(": ")", "{": "}", "[": "]" }, stack = [];\nfor (const c of s) {\n  if (map[c]) stack.push(map[c]);\n  else if (stack.pop() !== c) return false;\n}\nreturn stack.length === 0;',
          },
        },
        {
          id: 'stk-reverse-string',
          title: 'Reverse a String',
          slug: 'reverse-string',
          difficulty: 'Easy',
          patternId: 'stack-core',
          hints: {
            recognition: 'Reverse characters using LIFO property or two pointers.',
            structure: 'Push all chars to stack, then pop in reverse order.',
            skeleton: 'const stack = [...s];\nfor (let i = 0; i < s.length; i++) {\n  s[i] = stack.pop();\n}',
          },
        },
        {
          id: 'stk-next-greater-ii',
          title: 'Next Greater Element II',
          slug: 'next-greater-element-ii',
          difficulty: 'Medium',
          patternId: 'stack-core',
          hints: {
            recognition: 'Next greater element in circular array for each element.',
            structure: 'Monotonic stack storing indices. Iterate through array twice (2 * n - 1 down to 0).',
            skeleton: 'const n = nums.length, res = new Array(n).fill(-1), stack = [];\nfor (let i = 2 * n - 1; i >= 0; i--) {\n  const num = nums[i % n];\n  while (stack.length && stack[stack.length - 1] <= num) stack.pop();\n  if (i < n && stack.length) res[i] = stack[stack.length - 1];\n  stack.push(num);\n}\nreturn res;',
          },
        },
        {
          id: 'stk-daily-temperatures',
          title: 'Daily Temperatures',
          slug: 'daily-temperatures',
          difficulty: 'Medium',
          patternId: 'stack-core',
          hints: {
            recognition: 'Number of days to wait until a warmer temperature.',
            structure: 'Monotonic decreasing stack of indices. While current temp > temp at stack top, pop and compute day diff.',
            skeleton: 'const res = new Array(temperatures.length).fill(0), stack = [];\nfor (let i = 0; i < temperatures.length; i++) {\n  while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n    const prev = stack.pop();\n    res[prev] = i - prev;\n  }\n  stack.push(i);\n}\nreturn res;',
          },
        },
        {
          id: 'stk-remove-nodes-ll',
          title: 'Remove Nodes From Linked List',
          slug: 'remove-nodes-from-linked-list',
          difficulty: 'Medium',
          patternId: 'stack-core',
          hints: {
            recognition: 'Remove every node which has a node with greater value to its right.',
            structure: 'Monotonic decreasing stack of nodes, or reverse list, filter smaller, reverse back.',
            skeleton: 'const stack = [];\nlet curr = head;\nwhile (curr) {\n  while (stack.length && stack[stack.length - 1].val < curr.val) stack.pop();\n  stack.push(curr);\n  curr = curr.next;\n}\nfor (let i = 0; i < stack.length - 1; i++) stack[i].next = stack[i + 1];\nstack[stack.length - 1].next = null;\nreturn stack[0];',
          },
        },
        {
          id: 'stk-remove-adj-dup-ii',
          title: 'Remove Adjacent Duplicates II',
          slug: 'remove-all-adjacent-duplicates-in-string-ii',
          difficulty: 'Medium',
          patternId: 'stack-core',
          hints: {
            recognition: 'Remove k consecutive identical characters from string.',
            structure: 'Stack of tuples [char, count]. Increment count; if count === k, pop tuple.',
            skeleton: 'const stack = [];\nfor (const c of s) {\n  if (stack.length && stack[stack.length - 1][0] === c) {\n    stack[stack.length - 1][1]++;\n    if (stack[stack.length - 1][1] === k) stack.pop();\n  } else {\n    stack.push([c, 1]);\n  }\n}\nreturn stack.map(([c, count]) => c.repeat(count)).join("");',
          },
        },
        {
          id: 'stk-simplify-path',
          title: 'Simplify Path',
          slug: 'simplify-path',
          difficulty: 'Medium',
          patternId: 'stack-core',
          hints: {
            recognition: 'Simplify Unix-style file path containing . and ..',
            structure: 'Split on "/", ignore "" and ".". Pop on "..", push directory names.',
            skeleton: 'const parts = path.split("/"), stack = [];\nfor (const p of parts) {\n  if (p === "" || p === ".") continue;\n  if (p === "..") { if (stack.length) stack.pop(); }\n  else stack.push(p);\n}\nreturn "/" + stack.join("/");',
          },
        },
        {
          id: 'stk-remove-k-digits',
          title: 'Remove K Digits',
          slug: 'remove-k-digits',
          difficulty: 'Medium',
          patternId: 'stack-core',
          hints: {
            recognition: 'Remove k digits from number string to form the smallest possible number.',
            structure: 'Greedy monotonic increasing stack. While k > 0 and current digit < stack top, pop.',
            skeleton: 'const stack = [];\nfor (const d of num) {\n  while (k > 0 && stack.length && stack[stack.length - 1] > d) {\n    stack.pop(); k--;\n  }\n  stack.push(d);\n}\nwhile (k-- > 0) stack.pop();\nconst res = stack.join("").replace(/^0+/, "");\nreturn res === "" ? "0" : res;',
          },
        },
      ],
    },
  ],
};
