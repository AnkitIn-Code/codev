/**
 * Topic 18: String DP
 */

export const stringDP = {
  id: 'string-dp',
  order: 18,
  name: 'String DP',
  icon: '📝',
  description: 'Two-string alignment, Longest Common Subsequences, Edit Distances, and Palindromic interval decompositions.',
  patterns: [
    {
      id: 'string-dp-core',
      name: 'String DP',
      topicId: 'string-dp',
      signals: ['Two strings alignment / matching', 'Edit operations (insert, delete, replace)', 'Distinct subsequence matching count', 'Interleaving strings verification'],
      coreIdea: 'dp[i][j] represents solution for prefixes s1[0..i-1] and s2[0..j-1]. If s1[i-1] === s2[j-1], transition from dp[i-1][j-1]; else transition from adjacent operations.',
      dataStructure: '2D DP Matrix',
      questions: [
        {
          id: 'sdp-lcs',
          title: 'Longest Common Subsequence',
          slug: 'longest-common-subsequence',
          difficulty: 'Medium',
          patternId: 'string-dp-core',
          hints: {
            recognition: 'Length of longest subsequence common to text1 and text2.',
            structure: 'If text1[i-1] === text2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]; else max(dp[i-1][j], dp[i][j-1]).',
            skeleton: 'const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\nfor (let i = 1; i <= m; i++) {\n  for (let j = 1; j <= n; j++) {\n    if (text1[i - 1] === text2[j - 1]) dp[i][j] = 1 + dp[i - 1][j - 1];\n    else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);\n  }\n}\nreturn dp[m][n];',
          },
        },
        {
          id: 'sdp-longest-palindromic-subseq',
          title: 'Longest Palindromic Subsequence',
          slug: 'longest-palindromic-subsequence',
          difficulty: 'Medium',
          patternId: 'string-dp-core',
          hints: {
            recognition: 'Length of longest subsequence of string s that reads same forwards and backwards.',
            structure: 'LCS between s and reverse(s), or interval DP: dp[i][j] for substring s[i..j].',
            skeleton: 'const n = s.length, dp = Array.from({ length: n }, () => new Array(n).fill(0));\nfor (let i = n - 1; i >= 0; i--) {\n  dp[i][i] = 1;\n  for (let j = i + 1; j < n; j++) {\n    if (s[i] === s[j]) dp[i][j] = 2 + dp[i + 1][j - 1];\n    else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);\n  }\n}\nreturn dp[0][n - 1];',
          },
        },
        {
          id: 'sdp-edit-distance',
          title: 'Edit Distance',
          slug: 'edit-distance',
          difficulty: 'Medium',
          patternId: 'string-dp-core',
          hints: {
            recognition: 'Minimum number of operations (insert, delete, replace) to convert word1 to word2.',
            structure: 'If matching, dp[i][j] = dp[i-1][j-1]; else 1 + min(insert dp[i][j-1], delete dp[i-1][j], replace dp[i-1][j-1]).',
            skeleton: 'const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\nfor (let i = 0; i <= m; i++) dp[i][0] = i;\nfor (let j = 0; j <= n; j++) dp[0][j] = j;\nfor (let i = 1; i <= m; i++) {\n  for (let j = 1; j <= n; j++) {\n    if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n    else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n  }\n}\nreturn dp[m][n];',
          },
        },
        {
          id: 'sdp-distinct-subsequences',
          title: 'Distinct Subsequences',
          slug: 'distinct-subsequences',
          difficulty: 'Hard',
          patternId: 'string-dp-core',
          hints: {
            recognition: 'Number of distinct subsequences of s which equals t.',
            structure: 'dp[i][j] is number of matching subsequences. If s[i-1] === t[j-1], can match (dp[i-1][j-1]) or skip (dp[i-1][j]).',
            skeleton: 'const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\nfor (let i = 0; i <= m; i++) dp[i][0] = 1;\nfor (let i = 1; i <= m; i++) {\n  for (let j = 1; j <= n; j++) {\n    dp[i][j] = dp[i - 1][j] + (s[i - 1] === t[j - 1] ? dp[i - 1][j - 1] : 0);\n  }\n}\nreturn dp[m][n];',
          },
        },
        {
          id: 'sdp-interleaving-string',
          title: 'Interleaving String',
          slug: 'interleaving-string',
          difficulty: 'Medium',
          patternId: 'string-dp-core',
          hints: {
            recognition: 'Determine whether s3 is formed by interleaving s1 and s2.',
            structure: 'dp[i][j] = (dp[i-1][j] && s1[i-1] === s3[i+j-1]) || (dp[i][j-1] && s2[j-1] === s3[i+j-1]).',
            skeleton: 'if (s1.length + s2.length !== s3.length) return false;\nconst dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));\ndp[0][0] = true;\n// fill first row and col, then loop i and j\nreturn dp[m][n];',
          },
        },
      ],
    },
  ],
};
