/**
 * Topic 22: Trie (Prefix Tree)
 */

export const trieTopic = {
  id: 'trie',
  order: 22,
  name: 'Trie (Prefix Tree)',
  icon: '🌲',
  description:
    'A tree data structure for efficient string prefix storage and retrieval. Essential for autocomplete, word search, and XOR optimisation problems.',
  patterns: [
    /* ── 1. Basic Trie Operations ─────────────────────────────────────── */
    {
      id: 'trie-basic',
      name: 'Basic Trie (Insert / Search / Prefix)',
      topicId: 'trie',
      signals: [
        'Autocomplete / prefix matching over large word sets',
        '"startsWith" or "wordExists" queries',
        'Wildcard character matching in word dictionary',
        'Store and retrieve words character-by-character',
      ],
      coreIdea:
        'Each TrieNode has children[26] (or a Map) and an isEnd flag. Insert traverses/creates nodes per character; search traverses and checks isEnd; startsWith checks traversal only.',
      dataStructure: 'TrieNode with children Map',
      questions: [
        {
          id: 'trie-implement',
          title: 'Implement Trie (Prefix Tree)',
          slug: 'implement-trie-prefix-tree',
          difficulty: 'Medium',
          patternId: 'trie-basic',
          hints: {
            recognition: 'Design insert, search, and startsWith for a dictionary of words.',
            structure: 'TrieNode = { children: new Map(), isEnd: false }. Three operations traverse char-by-char.',
            skeleton:
              'class TrieNode { constructor() { this.children=new Map(); this.isEnd=false; } }\nclass Trie {\n  constructor() { this.root=new TrieNode(); }\n  insert(w) { let n=this.root; for (const c of w) { if(!n.children.has(c)) n.children.set(c,new TrieNode()); n=n.children.get(c); } n.isEnd=true; }\n  search(w) { let n=this.root; for (const c of w) { if(!n.children.has(c)) return false; n=n.children.get(c); } return n.isEnd; }\n  startsWith(p) { let n=this.root; for (const c of p) { if(!n.children.has(c)) return false; n=n.children.get(c); } return true; }\n}',
          },
        },
        {
          id: 'trie-word-dict',
          title: 'Design Add and Search Words Data Structure',
          slug: 'design-add-and-search-words-data-structure',
          difficulty: 'Medium',
          patternId: 'trie-basic',
          hints: {
            recognition: '"." wildcard can match any letter; search must try all children at dot.',
            structure: 'Same Trie insert; search DFS: at "." try all children recursively.',
            skeleton:
              'search(word) {\n  function dfs(node, i) {\n    if (i===word.length) return node.isEnd;\n    const c=word[i];\n    if (c===".") return [...node.children.values()].some(ch=>dfs(ch,i+1));\n    return node.children.has(c)&&dfs(node.children.get(c),i+1);\n  }\n  return dfs(this.root,0);\n}',
          },
        },
        {
          id: 'trie-word-search-ii',
          title: 'Word Search II',
          slug: 'word-search-ii',
          difficulty: 'Hard',
          patternId: 'trie-basic',
          hints: {
            recognition: 'Find all words from dictionary in 2D character board.',
            structure: 'Build Trie from all words; DFS board from every cell, prune when trie path absent.',
            skeleton:
              'const trie=build(words);\nconst res=new Set();\nfunction dfs(node,r,c,path) {\n  if (r<0||r>=m||c<0||c>=n||!node.children.has(board[r][c])) return;\n  const ch=board[r][c]; const next=node.children.get(ch);\n  path+=ch; if (next.isEnd) res.add(path);\n  board[r][c]="#";\n  dfs(next,r+1,c,path);dfs(next,r-1,c,path);dfs(next,r,c+1,path);dfs(next,r,c-1,path);\n  board[r][c]=ch;\n}\nfor (let r=0;r<m;r++) for (let c=0;c<n;c++) dfs(trie.root,r,c,"");\nreturn [...res];',
          },
        },
      ],
    },

    /* ── 2. XOR Trie ─────────────────────────────────────────────────── */
    {
      id: 'trie-xor',
      name: 'XOR Trie (Bit Trie)',
      topicId: 'trie',
      signals: [
        'Maximise XOR of two numbers in array',
        'XOR queries on subarrays with prefix XOR + trie',
        'Store numbers bit-by-bit from MSB to LSB',
        'Greedily pick opposite bit for max XOR',
      ],
      coreIdea:
        'Store each number bit-by-bit (MSB first) in a binary trie. To maximise XOR with a query number, at each bit greedily go to the opposite child (1→0 or 0→1) if it exists.',
      dataStructure: 'Binary Trie (bit-level children[2])',
      questions: [
        {
          id: 'trie-max-xor',
          title: 'Maximum XOR of Two Numbers in an Array',
          slug: 'maximum-xor-of-two-numbers-in-an-array',
          difficulty: 'Medium',
          patternId: 'trie-xor',
          hints: {
            recognition: 'Find pair from nums with maximum XOR.',
            structure: 'Insert all nums into bit-trie; for each num greedily query opposite bits.',
            skeleton:
              'const root={c:[null,null]};\nfor (const n of nums) { let node=root; for (let b=31;b>=0;b--) { const bit=(n>>b)&1; if(!node.c[bit]) node.c[bit]={c:[null,null]}; node=node.c[bit]; } }\nlet max=0;\nfor (const n of nums) { let node=root,xor=0; for (let b=31;b>=0;b--) { const bit=(n>>b)&1,want=1-bit; if(node.c[want]) { xor|=(1<<b); node=node.c[want]; } else node=node.c[bit]; } max=Math.max(max,xor); }\nreturn max;',
          },
        },
        {
          id: 'trie-prefix-xor',
          title: 'Maximum XOR With an Element From Array',
          slug: 'maximum-xor-with-an-element-from-array',
          difficulty: 'Hard',
          patternId: 'trie-xor',
          hints: {
            recognition: 'Offline queries: maximise XOR of xi with any nums[j] ≤ mi.',
            structure: 'Sort queries and nums; insert eligible nums into XOR trie before processing each query.',
            skeleton:
              '// Sort queries by mi, sort nums\n// For each query in order, insert all nums[j]<=mi into XOR trie\n// Then query trie greedily for max XOR with xi',
          },
        },
      ],
    },
  ],
};
