/**
 * Topic 16: Grid DP
 */

export const gridDP = {
  id: 'grid-dp',
  order: 16,
  name: 'Grid DP',
  icon: '🗺️',
  description: 'Two-dimensional matrix dynamic programming moving down and right, obstacle avoidance, and backward health optimization.',
  patterns: [
    {
      id: 'grid-dp-core',
      name: 'Grid DP',
      topicId: 'grid-dp',
      signals: ['Paths in 2D grid moving only Down and Right', 'Minimum/maximum path sum across grid', 'Bottom-up triangle navigation', 'Dungeon health constraints'],
      coreIdea: 'dp[r][c] depends on top neighbor dp[r-1][c] and left neighbor dp[r][c-1]. For Dungeon Game, work backwards from bottom-right target.',
      dataStructure: '2D Grid / 1D Row Vector',
      questions: [
        {
          id: 'gdp-unique-paths',
          title: 'Unique Paths',
          slug: 'unique-paths',
          difficulty: 'Medium',
          patternId: 'grid-dp-core',
          hints: {
            recognition: 'Robot moving from top-left to bottom-right of m x n grid.',
            structure: 'dp[r][c] = dp[r-1][c] + dp[r][c-1]. Can optimize to single 1D row array.',
            skeleton: 'const dp = new Array(n).fill(1);\nfor (let r = 1; r < m; r++) {\n  for (let c = 1; c < n; c++) dp[c] += dp[c - 1];\n}\nreturn dp[n - 1];',
          },
        },
        {
          id: 'gdp-unique-paths-ii',
          title: 'Unique Paths II',
          slug: 'unique-paths-ii',
          difficulty: 'Medium',
          patternId: 'grid-dp-core',
          hints: {
            recognition: 'Unique paths with obstacles (1 = obstacle, 0 = space).',
            structure: 'If cell is obstacle, dp[c] = 0. Otherwise dp[c] += dp[c - 1].',
            skeleton: 'const dp = new Array(n).fill(0); dp[0] = 1;\nfor (let r = 0; r < m; r++) {\n  for (let c = 0; c < n; c++) {\n    if (obstacleGrid[r][c] === 1) dp[c] = 0;\n    else if (c > 0) dp[c] += dp[c - 1];\n  }\n}\nreturn dp[n - 1];',
          },
        },
        {
          id: 'gdp-minimum-path-sum',
          title: 'Minimum Path Sum',
          slug: 'minimum-path-sum',
          difficulty: 'Medium',
          patternId: 'grid-dp-core',
          hints: {
            recognition: 'Find path from top-left to bottom-right minimizing sum of numbers.',
            structure: 'dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1]). In-place update possible.',
            skeleton: 'for (let r = 0; r < m; r++) {\n  for (let c = 0; c < n; c++) {\n    if (r === 0 && c === 0) continue;\n    if (r === 0) grid[r][c] += grid[r][c - 1];\n    else if (c === 0) grid[r][c] += grid[r - 1][c];\n    else grid[r][c] += Math.min(grid[r - 1][c], grid[r][c - 1]);\n  }\n}\nreturn grid[m - 1][n - 1];',
          },
        },
        {
          id: 'gdp-triangle',
          title: 'Triangle',
          slug: 'triangle',
          difficulty: 'Medium',
          patternId: 'grid-dp-core',
          hints: {
            recognition: 'Minimum path sum from top to bottom of triangle moving to adjacent numbers in row below.',
            structure: 'Bottom-up: dp[i] = triangle[r][i] + Math.min(dp[i], dp[i + 1]).',
            skeleton: 'const dp = [...triangle[triangle.length - 1]];\nfor (let r = triangle.length - 2; r >= 0; r--) {\n  for (let c = 0; c <= r; c++) {\n    dp[c] = triangle[r][c] + Math.min(dp[c], dp[c + 1]);\n  }\n}\nreturn dp[0];',
          },
        },
        {
          id: 'gdp-dungeon-game',
          title: 'Dungeon Game',
          slug: 'dungeon-game',
          difficulty: 'Hard',
          patternId: 'grid-dp-core',
          hints: {
            recognition: 'Minimum initial health needed for knight to reach princess at bottom-right.',
            structure: 'Backward DP from destination (m-1, n-1) to (0, 0). dp[r][c] = Math.max(1, min(dp[r+1][c], dp[r][c+1]) - dungeon[r][c]).',
            skeleton: 'const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(Infinity));\ndp[m][n - 1] = 1; dp[m - 1][n] = 1;\nfor (let r = m - 1; r >= 0; r--) {\n  for (let c = n - 1; c >= 0; c--) {\n    const need = Math.min(dp[r + 1][c], dp[r][c + 1]) - dungeon[r][c];\n    dp[r][c] = need <= 0 ? 1 : need;\n  }\n}\nreturn dp[0][0];',
          },
        },
      ],
    },
  ],
};
