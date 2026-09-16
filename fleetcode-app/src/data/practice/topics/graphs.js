/**
 * Topic 13: Graphs
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
      signals: ['Grid exploration (islands/regions)', 'Dependencies / prerequisite ordering', 'Shortest path in unweighted graph', 'Bipartite / coloring check', 'Cycle detection'],
      coreIdea: 'Represent graph as adjacency list. Traverse with DFS (recursion + visited set) or BFS (queue + visited set). Use in-degrees for Kahn topological sort.',
      dataStructure: 'Adjacency List / Queue / Set',
      questions: [
        {
          id: 'graph-adj-list-clone',
          title: 'Adjacency List',
          slug: 'clone-graph',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Deep copy of connected undirected graph using adjacency list.',
            structure: 'Hash map of originalNode -> clonedNode. DFS/BFS traverses and clones neighbors.',
            skeleton: 'const visited = new Map();\nfunction clone(node) {\n  if (!node) return null;\n  if (visited.has(node)) return visited.get(node);\n  const copy = { val: node.val, neighbors: [] };\n  visited.set(node, copy);\n  for (const n of node.neighbors) copy.neighbors.push(clone(n));\n  return copy;\n}\nreturn clone(node);',
          },
        },
        {
          id: 'graph-dfs-keys-rooms',
          title: 'DFS',
          slug: 'keys-and-rooms',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Visit all rooms with keys found in rooms.',
            structure: 'Standard DFS tracking visited rooms.',
            skeleton: 'const visited = new Set([0]);\nfunction dfs(room) {\n  for (const key of rooms[room]) {\n    if (!visited.has(key)) {\n      visited.add(key);\n      dfs(key);\n    }\n  }\n}\ndfs(0);\nreturn visited.size === rooms.length;',
          },
        },
        {
          id: 'graph-bfs-rotting-oranges',
          title: 'BFS',
          slug: 'rotting-oranges',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Multi-source BFS spreading minute by minute until no fresh oranges remain.',
            structure: 'Queue initialized with all rotten oranges. Level-order BFS tracks elapsed minutes.',
            skeleton: 'const q = []; let fresh = 0, mins = 0;\n// Push all rotten [r, c] into q, count fresh\n// Multi-source BFS spreading 4-directionally while q.length && fresh > 0',
          },
        },
        {
          id: 'graph-number-of-islands',
          title: 'Number of Islands',
          slug: 'number-of-islands',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Count 4-directionally connected components of "1"s.',
            structure: 'Loop through grid cells. When "1" is encountered, increment count and DFS/BFS to sink the island (mark "0").',
            skeleton: 'let count = 0;\nfunction sink(r, c) {\n  if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== "1") return;\n  grid[r][c] = "0";\n  sink(r+1, c); sink(r-1, c); sink(r, c+1); sink(r, c-1);\n}\nfor (let r = 0; r < m; r++) {\n  for (let c = 0; c < n; c++) {\n    if (grid[r][c] === "1") { count++; sink(r, c); }\n  }\n}\nreturn count;',
          },
        },
        {
          id: 'graph-number-of-provinces',
          title: 'Number of Provinces',
          slug: 'number-of-provinces',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Count connected components in adjacency matrix.',
            structure: 'Visited boolean array. For each unvisited node, increment provinces count and DFS.',
            skeleton: 'const visited = new Set(); let count = 0;\nfunction dfs(i) {\n  for (let j = 0; j < isConnected.length; j++) {\n    if (isConnected[i][j] && !visited.has(j)) { visited.add(j); dfs(j); }\n  }\n}\nfor (let i = 0; i < isConnected.length; i++) {\n  if (!visited.has(i)) { count++; visited.add(i); dfs(i); }\n}\nreturn count;',
          },
        },
        {
          id: 'graph-rotting-oranges-2',
          title: 'Rotting Oranges',
          slug: 'rotting-oranges',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Simulate infection spread level-by-level.',
            structure: 'BFS queue records elapsed time increments until fresh count drops to 0.',
            skeleton: 'const dirs = [[0,1],[0,-1],[1,0],[-1,0]];\nwhile (q.length && fresh > 0) {\n  const size = q.length;\n  for (let i = 0; i < size; i++) {\n    const [r, c] = q.shift();\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {\n        grid[nr][nc] = 2; fresh--; q.push([nr, nc]);\n      }\n    }\n  }\n  mins++;\n}\nreturn fresh === 0 ? mins : -1;',
          },
        },
        {
          id: 'graph-cycle-undirected',
          title: 'Cycle Detection (Undirected)',
          slug: 'is-graph-bipartite',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Check if an undirected graph contains a cycle or self-loop.',
            structure: 'DFS passing parent node. If neighbor visited and neighbor !== parent, cycle detected.',
            skeleton: 'function hasCycle(node, parent) {\n  visited.add(node);\n  for (const n of adj[node]) {\n    if (!visited.has(n)) { if (hasCycle(n, node)) return true; }\n    else if (n !== parent) return true;\n  }\n  return false;\n}',
          },
        },
        {
          id: 'graph-cycle-directed',
          title: 'Cycle Detection (Directed)',
          slug: 'course-schedule',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Detect cycles in directed graph (e.g. impossible prerequisite schedules).',
            structure: 'Three-color DFS: 0=unvisited, 1=visiting (on current path -> cycle!), 2=visited.',
            skeleton: 'const state = new Array(numCourses).fill(0);\nfunction hasCycle(i) {\n  if (state[i] === 1) return true;\n  if (state[i] === 2) return false;\n  state[i] = 1;\n  for (const next of adj[i]) if (hasCycle(next)) return true;\n  state[i] = 2;\n  return false;\n}\nfor (let i = 0; i < numCourses; i++) if (hasCycle(i)) return false;\nreturn true;',
          },
        },
        {
          id: 'graph-topological-sort',
          title: 'Topological Sort',
          slug: 'course-schedule-ii',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Order courses respecting all prerequisites (Kahn algorithm).',
            structure: 'Calculate in-degrees. Queue holds nodes with in-degree 0. Dequeue, push to order, decrement neighbor in-degrees.',
            skeleton: 'const inDegree = new Array(numCourses).fill(0), adj = Array.from({ length: numCourses }, () => []);\nfor (const [dest, src] of prerequisites) { adj[src].push(dest); inDegree[dest]++; }\nconst q = [], order = [];\nfor (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) q.push(i);\nwhile (q.length) {\n  const u = q.shift(); order.push(u);\n  for (const v of adj[u]) if (--inDegree[v] === 0) q.push(v);\n}\nreturn order.length === numCourses ? order : [];',
          },
        },
        {
          id: 'graph-bipartite-graph',
          title: 'Bipartite Graph',
          slug: 'is-graph-bipartite',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: '2-colorability check: can graph vertices be partitioned into two sets with no intra-set edges?',
            structure: 'BFS/DFS 2-coloring. Color current 1, neighbor -1. If neighbor has same color, not bipartite.',
            skeleton: 'const color = new Array(graph.length).fill(0);\nfor (let i = 0; i < graph.length; i++) {\n  if (color[i] !== 0) continue;\n  const q = [i]; color[i] = 1;\n  while (q.length) {\n    const u = q.shift();\n    for (const v of graph[u]) {\n      if (color[v] === 0) { color[v] = -color[u]; q.push(v); }\n      else if (color[v] === color[u]) return false;\n    }\n  }\n}\nreturn true;',
          },
        },
        {
          id: 'graph-surrounded-regions',
          title: 'Surrounded Regions',
          slug: 'surrounded-regions',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Capture all regions of "O" that are completely surrounded by "X".',
            structure: 'Border-connected "O"s cannot be captured. DFS from all border "O"s marking safe "#". Then flip remaining "O" to "X" and safe "#" back to "O".',
            skeleton: '// 1. Traverse borders: if "O", DFS mark "#"\n// 2. Scan entire grid: if "O" -> "X", if "#" -> "O"',
          },
        },
        {
          id: 'graph-shortest-path-unweighted',
          title: 'Shortest Path (Unweighted)',
          slug: 'shortest-path-in-binary-matrix',
          difficulty: 'Medium',
          patternId: 'graphs-core',
          hints: {
            recognition: 'Shortest clear path from top-left to bottom-right in binary matrix (8-directional).',
            structure: 'BFS queue tracks [r, c, distance]. First time target is dequeued gives shortest path.',
            skeleton: 'if (grid[0][0] !== 0 || grid[n-1][n-1] !== 0) return -1;\nconst q = [[0, 0, 1]]; grid[0][0] = 1;\nwhile (q.length) {\n  const [r, c, d] = q.shift();\n  if (r === n - 1 && c === n - 1) return d;\n  // check all 8 directions\n}\nreturn -1;',
          },
        },
      ],
    },
  ],
};
