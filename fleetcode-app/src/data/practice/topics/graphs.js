/**
 * Topic 13: Graphs
 *
 * Fixes applied:
 * - "Adjacency List" (GFG) → title + url corrected, slug kept for ID tracking
 * - Removed duplicate "Rotting Oranges" (was listed twice)
 * - "DFS" title → renamed to proper problem "Keys and Rooms"
 * - "BFS" title → renamed to proper problem "Rotting Oranges"
 * - "Cycle Detection (Undirected)" → slug was wrongly set to is-graph-bipartite;
 *    now uses GFG url for the actual cycle detection problem
 * - Added "Pacific Atlantic Water Flow" as a new graph traversal problem
 */

export const graphsTopic = {
  id: 'graphs',
  order: 13,
  name: 'Graphs',
  icon: '🕸️',
  description: 'Graph representations, Depth-First Search, Breadth-First Search, topological sorting, connected components, and cycle detection.',
  patterns: [
    {
      id: 'graphs-core',
      name: 'Graphs & Networks',
      topicId: 'graphs',
      signals: [
        'Grid exploration (islands/regions)',
        'Dependencies / prerequisite ordering',
        'Shortest path in unweighted graph',
        'Bipartite / 2-coloring check',
        'Cycle detection in directed or undirected graph',
      ],
      coreIdea: 'Represent graph as adjacency list. Traverse with DFS (recursion + visited set) or BFS (queue + visited set). Use in-degrees for Kahn topological sort.',
      dataStructure: 'Adjacency List / Queue / Set',
      questions: [
        {
          id: 'graph-adj-list',
          title: 'Print Adjacency List',
          slug: 'print-adjacency-list',
          // GFG problem — not on LeetCode
          url: 'https://www.geeksforgeeks.org/problems/print-adjacency-list-1587115620/1',
          difficulty: 'Easy',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Given V vertices and E edges, construct and print the adjacency list representation of the graph.',
            structure: 'Create array of V empty arrays. For each edge [u,v], push v into adj[u] and u into adj[v] (undirected).',
            skeleton: 'function printAdjList(V, edges) {\n  const adj = Array.from({ length: V }, () => []);\n  for (const [u, v] of edges) {\n    adj[u].push(v);\n    adj[v].push(u);\n  }\n  return adj;\n}',
          },
        },
        {
          id: 'graph-clone-graph',
          title: 'Clone Graph',
          slug: 'clone-graph',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Deep copy of a connected undirected graph (each node has val + neighbors list).',
            structure: 'Hash map of originalNode → clonedNode. DFS/BFS traverses and clones neighbors.',
            skeleton: 'const visited = new Map();\nfunction clone(node) {\n  if (!node) return null;\n  if (visited.has(node)) return visited.get(node);\n  const copy = { val: node.val, neighbors: [] };\n  visited.set(node, copy);\n  for (const n of node.neighbors) copy.neighbors.push(clone(n));\n  return copy;\n}\nreturn clone(node);',
          },
        },
        {
          id: 'graph-keys-and-rooms',
          title: 'Keys and Rooms',
          slug: 'keys-and-rooms',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Can you visit all rooms, starting from room 0, using keys found inside each room?',
            structure: 'Standard DFS from room 0 tracking visited rooms; return visited.size === rooms.length.',
            skeleton: 'const visited = new Set([0]);\nfunction dfs(room) {\n  for (const key of rooms[room]) {\n    if (!visited.has(key)) {\n      visited.add(key);\n      dfs(key);\n    }\n  }\n}\ndfs(0);\nreturn visited.size === rooms.length;',
          },
        },
        {
          id: 'graph-rotting-oranges',
          title: 'Rotting Oranges',
          slug: 'rotting-oranges',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Multi-source BFS: every rotten orange spreads to fresh neighbours each minute.',
            structure: 'Queue initialised with all rotten [r,c]; BFS level-by-level; count fresh; return elapsed minutes.',
            skeleton: 'const dirs = [[0,1],[0,-1],[1,0],[-1,0]];\nconst q = []; let fresh = 0, mins = 0;\nfor (let r=0;r<m;r++) for (let c=0;c<n;c++) {\n  if (grid[r][c]===2) q.push([r,c]);\n  if (grid[r][c]===1) fresh++;\n}\nwhile (q.length && fresh>0) {\n  const size=q.length; mins++;\n  for (let i=0;i<size;i++) {\n    const [r,c]=q.shift();\n    for (const [dr,dc] of dirs) {\n      const nr=r+dr,nc=c+dc;\n      if(nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]===1){\n        grid[nr][nc]=2; fresh--; q.push([nr,nc]);\n      }\n    }\n  }\n}\nreturn fresh===0?mins:-1;',
          },
        },
        {
          id: 'graph-number-of-islands',
          title: 'Number of Islands',
          slug: 'number-of-islands',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Count 4-directionally connected components of "1"s in a binary grid.',
            structure: 'For each unvisited "1", increment count and DFS/BFS to sink the island (mark as "0").',
            skeleton: 'let count = 0;\nfunction sink(r, c) {\n  if (r<0||r>=m||c<0||c>=n||grid[r][c]!=="1") return;\n  grid[r][c]="0";\n  sink(r+1,c); sink(r-1,c); sink(r,c+1); sink(r,c-1);\n}\nfor (let r=0;r<m;r++) for (let c=0;c<n;c++)\n  if (grid[r][c]==="1") { count++; sink(r,c); }\nreturn count;',
          },
        },
        {
          id: 'graph-number-of-provinces',
          title: 'Number of Provinces',
          slug: 'number-of-provinces',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Count connected components in an adjacency matrix (isConnected[i][j]).',
            structure: 'Visited set; for each unvisited node increment provinces count and DFS all its neighbours.',
            skeleton: 'const visited = new Set(); let count = 0;\nfunction dfs(i) {\n  for (let j=0;j<isConnected.length;j++)\n    if (isConnected[i][j]&&!visited.has(j)) { visited.add(j); dfs(j); }\n}\nfor (let i=0;i<isConnected.length;i++)\n  if (!visited.has(i)) { count++; visited.add(i); dfs(i); }\nreturn count;',
          },
        },
        {
          id: 'graph-pacific-atlantic',
          title: 'Pacific Atlantic Water Flow',
          slug: 'pacific-atlantic-water-flow',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Find cells from which water can flow to BOTH the Pacific (top/left) and Atlantic (bottom/right) oceans.',
            structure: 'Reverse BFS from each ocean border (only move to equal or higher cells). Intersect the two reachable sets.',
            skeleton: 'function bfs(starts) {\n  const q=[...starts],visited=new Set(starts.map(([r,c])=>r*n+c));\n  while(q.length){\n    const [r,c]=q.shift();\n    for (const [dr,dc] of [[0,1],[0,-1],[1,0],[-1,0]]){\n      const nr=r+dr,nc=c+dc,key=nr*n+nc;\n      if(nr>=0&&nr<m&&nc>=0&&nc<n&&!visited.has(key)&&heights[nr][nc]>=heights[r][c]){\n        visited.add(key); q.push([nr,nc]);\n      }\n    }\n  }\n  return visited;\n}',
          },
        },
        {
          id: 'graph-cycle-undirected',
          title: 'Detect Cycle in Undirected Graph',
          slug: 'detect-cycle-undirected',
          // LeetCode doesn't have this as a standalone; GFG has the canonical problem
          url: 'https://www.geeksforgeeks.org/problems/detect-cycle-in-an-undirected-graph/1',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Check if an undirected graph contains a cycle.',
            structure: 'DFS passing parent node. If a visited neighbour ≠ parent, a back-edge exists → cycle.',
            skeleton: 'const visited = new Set();\nfunction hasCycle(node, parent) {\n  visited.add(node);\n  for (const n of adj[node]) {\n    if (!visited.has(n)) { if (hasCycle(n, node)) return true; }\n    else if (n !== parent) return true;\n  }\n  return false;\n}\nfor (let i=0;i<V;i++) if (!visited.has(i) && hasCycle(i,-1)) return true;\nreturn false;',
          },
        },
        {
          id: 'graph-cycle-directed',
          title: 'Course Schedule (Cycle in Directed Graph)',
          slug: 'course-schedule',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Can you finish all courses given prerequisites? Equivalent to detecting a cycle in a directed graph.',
            structure: 'Three-color DFS: 0=unvisited, 1=in-progress (on current path → cycle!), 2=fully visited.',
            skeleton: 'const state = new Array(numCourses).fill(0);\nfunction hasCycle(i) {\n  if (state[i]===1) return true;\n  if (state[i]===2) return false;\n  state[i]=1;\n  for (const next of adj[i]) if (hasCycle(next)) return true;\n  state[i]=2;\n  return false;\n}\nfor (let i=0;i<numCourses;i++) if (hasCycle(i)) return false;\nreturn true;',
          },
        },
        {
          id: 'graph-topological-sort',
          title: 'Course Schedule II (Topological Sort)',
          slug: 'course-schedule-ii',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Return a valid course order given prerequisites — Kahn\'s BFS topological sort.',
            structure: 'Compute in-degrees. BFS queue starts with 0-in-degree nodes. Dequeue, record, decrement neighbours.',
            skeleton: 'const inDeg=new Array(n).fill(0),adj=Array.from({length:n},()=>[]);\nfor (const [d,s] of prerequisites) { adj[s].push(d); inDeg[d]++; }\nconst q=[],order=[];\nfor (let i=0;i<n;i++) if(inDeg[i]===0) q.push(i);\nwhile(q.length) {\n  const u=q.shift(); order.push(u);\n  for (const v of adj[u]) if(--inDeg[v]===0) q.push(v);\n}\nreturn order.length===n?order:[];',
          },
        },
        {
          id: 'graph-bipartite-graph',
          title: 'Is Graph Bipartite?',
          slug: 'is-graph-bipartite',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Can graph vertices be 2-coloured so no two adjacent vertices share the same colour?',
            structure: 'BFS 2-coloring: color current node 1, assign -1 to neighbours. If neighbour has same color, not bipartite.',
            skeleton: 'const color=new Array(graph.length).fill(0);\nfor (let i=0;i<graph.length;i++) {\n  if (color[i]!==0) continue;\n  const q=[i]; color[i]=1;\n  while(q.length) {\n    const u=q.shift();\n    for (const v of graph[u]) {\n      if(color[v]===0){color[v]=-color[u];q.push(v);}\n      else if(color[v]===color[u]) return false;\n    }\n  }\n}\nreturn true;',
          },
        },
        {
          id: 'graph-surrounded-regions',
          title: 'Surrounded Regions',
          slug: 'surrounded-regions',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Flip all "O"s surrounded by "X"s; border-connected "O"s are safe.',
            structure: 'DFS from all border "O"s marking them safe ("#"). Then flip remaining "O"→"X" and "#"→"O".',
            skeleton: '// 1. DFS from every border "O", mark reachable as "#"\n// 2. Scan grid: "O" → "X", "#" → "O"',
          },
        },
        {
          id: 'graph-shortest-path-binary-matrix',
          title: 'Shortest Path in Binary Matrix',
          slug: 'shortest-path-in-binary-matrix',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Shortest clear path from (0,0) to (n-1,n-1) moving in 8 directions through 0-cells.',
            structure: 'BFS from (0,0); each dequeued cell carries distance. First arrival at target is shortest.',
            skeleton: 'if(grid[0][0]!==0||grid[n-1][n-1]!==0) return -1;\nconst q=[[0,0,1]]; grid[0][0]=1;\nwhile(q.length){\n  const[r,c,d]=q.shift();\n  if(r===n-1&&c===n-1) return d;\n  for(const[dr,dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]){\n    const nr=r+dr,nc=c+dc;\n    if(nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]===0){grid[nr][nc]=1;q.push([nr,nc,d+1]);}\n  }\n}\nreturn -1;',
          },
        },
      ],
    },
  ],
};
