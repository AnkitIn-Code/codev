/**
 * Topic 23: Union-Find (Disjoint Set Union)
 */

export const unionFindTopic = {
  id: 'union-find',
  order: 23,
  name: 'Union-Find (DSU)',
  icon: '🔗',
  description:
    'Disjoint Set Union with path compression and union-by-rank. Efficiently answers "are two nodes connected?" and detects redundant connections in O(α(N)) time.',
  patterns: [
    /* ── 1. Core DSU ─────────────────────────────────────────────────── */
    {
      id: 'dsu-core',
      name: 'DSU — Path Compression & Union by Rank',
      topicId: 'union-find',
      signals: [
        'Dynamic connectivity queries: are nodes in same component?',
        'Find and remove the redundant edge that forms a cycle',
        'Group elements with equivalence relations',
        'Count connected components dynamically as edges are added',
      ],
      coreIdea:
        'find(x): follow parents to root; path compress by pointing directly to root. union(x, y): connect smaller-rank tree under larger-rank root. DSU answers connected queries in near-constant time.',
      dataStructure: 'Parent + Rank Arrays',
      questions: [
        {
          id: 'dsu-redundant',
          title: 'Redundant Connection',
          slug: 'redundant-connection',
          difficulty: 'Medium',
          patternId: 'dsu-core',
          hints: {
            recognition: 'Find the extra edge that creates a cycle in an undirected graph.',
            structure: 'DSU: for each edge, if both endpoints already have the same root, this edge is redundant.',
            skeleton:
              'const parent=Array.from({length:n+1},(_,i)=>i),rank=new Array(n+1).fill(0);\nfunction find(x){return parent[x]===x?x:parent[x]=find(parent[x]);}\nfunction union(x,y){const [rx,ry]=[find(x),find(y)]; if(rx===ry) return false; rank[rx]>rank[ry]?parent[ry]=rx:rank[rx]<rank[ry]?parent[rx]=ry:(parent[ry]=rx,rank[rx]++); return true;}\nfor (const [u,v] of edges) if (!union(u,v)) return [u,v];',
          },
        },
        {
          id: 'dsu-num-components',
          title: 'Number of Connected Components in an Undirected Graph',
          slug: 'number-of-connected-components-in-an-undirected-graph',
          url: 'https://www.geeksforgeeks.org/problems/number-of-connected-components-in-an-undirected-graph/1',
          difficulty: 'Medium',
          patternId: 'dsu-core',
          hints: {
            recognition: 'Count connected components as edges are inserted.',
            structure: 'Start with n components; decrement each time union succeeds (different roots).',
            skeleton:
              'let components=n;\nfor (const [u,v] of edges) if (union(u,v)) components--;\nreturn components;',
          },
        },
        {
          id: 'dsu-accounts-merge',
          title: 'Accounts Merge',
          slug: 'accounts-merge',
          difficulty: 'Medium',
          patternId: 'dsu-core',
          hints: {
            recognition: 'Merge accounts sharing any email; group all emails per person.',
            structure: 'Map email → first account index; DSU union all emails of same account; group by root.',
            skeleton:
              'const emailToId=new Map();\nfor (let i=0;i<accounts.length;i++)\n  for (let j=1;j<accounts[i].length;j++) {\n    if (!emailToId.has(accounts[i][j])) emailToId.set(accounts[i][j],i);\n    union(i,emailToId.get(accounts[i][j]));\n  }\n// Group emails by find(i), sort each group',
          },
        },
        {
          id: 'dsu-valid-tree',
          title: 'Graph Valid Tree',
          slug: 'graph-valid-tree',
          url: 'https://www.geeksforgeeks.org/problems/is-it-a-tree/1',
          difficulty: 'Medium',
          patternId: 'dsu-core',
          hints: {
            recognition: 'Check if n nodes and given edges form a valid tree (connected, acyclic).',
            structure: 'DSU: any edge merging same component → cycle → not a tree. Final check: one component.',
            skeleton:
              'for (const [u,v] of edges) if (!union(u,v)) return false;\nreturn new Set(Array.from({length:n},(_,i)=>find(i))).size===1;',
          },
        },
      ],
    },

    /* ── 2. Weighted / Extended DSU ───────────────────────────────────── */
    {
      id: 'dsu-extended',
      name: 'Weighted DSU & Grid Connectivity',
      topicId: 'union-find',
      signals: [
        'Smallest string with swaps / reachable character exchanges',
        'Connect cells as water fills (offline union-find)',
        'Stones on same row or column can be removed',
        'Making graph connected with minimum edge additions',
      ],
      coreIdea:
        'Apply DSU on indices/positions; use the root of a component to represent the entire group. For grid problems, map 2D coordinates to 1D indices.',
      dataStructure: 'DSU on indices',
      questions: [
        {
          id: 'dsu-remove-stones',
          title: 'Most Stones Removed with Same Row or Column',
          slug: 'most-stones-removed-with-same-row-or-column',
          difficulty: 'Medium',
          patternId: 'dsu-extended',
          hints: {
            recognition: 'Remove stone if it shares row or column with another; max removals.',
            structure: 'Union stones sharing rows/cols; answer = n − number of components.',
            skeleton:
              'const parent=new Map();\nfunction find(x){if(!parent.has(x))parent.set(x,x);return parent.get(x)===x?x:parent.set(x,find(parent.get(x)))&&find(x);}\nfunction union(x,y){parent.set(find(x),find(y));}\nfor (const [r,c] of stones) union(r,c+10001);\nconst roots=new Set(stones.map(([r,c])=>find(r)));\nreturn stones.length-roots.size;',
          },
        },
        {
          id: 'dsu-smallest-string-swaps',
          title: 'Smallest String With Swaps',
          slug: 'smallest-string-with-swaps',
          difficulty: 'Medium',
          patternId: 'dsu-extended',
          hints: {
            recognition: 'Indices in same component can be freely rearranged; sort each group.',
            structure: 'Union swap pairs; group indices by root; sort characters in each group and place back.',
            skeleton:
              'for (const [a,b] of pairs) union(a,b);\nconst groups=new Map();\nfor (let i=0;i<s.length;i++) {\n  const r=find(i);\n  if(!groups.has(r)) groups.set(r,[]);\n  groups.get(r).push(s[i]);\n}\nfor (const [,chars] of groups) chars.sort();\nconst res=s.split("");\nconst idx=new Map();\nfor (let i=0;i<s.length;i++) {\n  const r=find(i),g=groups.get(r);\n  res[i]=g[idx.get(r)||0]; idx.set(r,(idx.get(r)||0)+1);\n}\nreturn res.join("");',
          },
        },
      ],
    },
  ],
};
