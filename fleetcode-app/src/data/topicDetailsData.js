// Comprehensive editorial content and prerequisites for each topic in FleetCode
// Matches the exact style, tone, and depth requested by user.

export const TOPIC_DETAILS = {
  'Array': {
    about: `An Array is one of the most fundamental data structures in computer science. It stores a collection of elements in contiguous memory locations and allows constant-time access using an index. Because of its simplicity and efficiency, arrays are often the first data structure taught in Data Structures and Algorithms (DSA) and serve as the foundation for solving a huge variety of algorithmic problems.

In coding interviews, array questions are extremely common. Companies like Google, Amazon, Meta, and Microsoft frequently test candidates on array manipulation because these problems reveal how well you understand time complexity, memory usage, and algorithmic thinking. Mastering array techniques helps you solve a wide range of interview questions efficiently and often forms the base for more advanced topics.

Array problems typically revolve around recognizing patterns and applying the right technique. Some of the most common approaches include:
• Using the two pointer technique to process elements from both ends efficiently (see Two Pointers).
• Optimizing subarray calculations with Prefix Sum.
• Maintaining dynamic ranges of elements with Sliding Window.
• Speeding up lookups using Hash Table techniques.
• Applying Binary Search on sorted arrays to reduce time complexity from O(n) to O(log n).

You should reach for arrays whenever you need fast indexed access, efficient iteration, or when working with sequences of data such as numbers, characters, or objects. Many advanced problems across dynamic programming, greedy algorithms, and graph preprocessing also rely on arrays as their underlying storage.

FleetCode provides 2111 Array practice problems ranging from beginner-friendly exercises to advanced interview-level challenges. By practicing these questions and learning the common patterns, you will build the intuition needed to quickly identify optimal solutions during real coding interviews.`,
    prerequisites: [
      {
        id: 1,
        name: 'Hash Table',
        slug: 'hash-table',
        desc: 'Hash tables are frequently combined with arrays to track frequencies, complements, or previously seen values. This approach turns many O(n^2) array problems into O(n) solutions.'
      },
      {
        id: 2,
        name: 'Prefix Sum',
        slug: 'prefix-sum',
        desc: 'Prefix sums allow constant-time range queries on arrays. This technique is essential for solving subarray sum problems, cumulative counts, and optimization questions.'
      },
      {
        id: 3,
        name: 'Two Pointers',
        slug: 'two-pointers',
        desc: 'Many array interview problems use the two-pointer technique to scan from both ends or maintain two moving indices. Learning this pattern helps optimize problems like pair sums, partitioning, and sorted array processing.'
      },
      {
        id: 4,
        name: 'Binary Search',
        slug: 'binary-search',
        desc: 'Binary search is commonly applied to sorted arrays. Understanding this technique helps solve search, boundary, and optimization problems with logarithmic time complexity.'
      },
      {
        id: 5,
        name: 'Sliding Window',
        slug: 'sliding-window',
        desc: 'Sliding window builds directly on arrays and helps solve subarray and substring problems efficiently. It reduces nested loops to linear time by maintaining a dynamic window over the array.'
      }
    ],
    relatedTopics: ['Hash Table', 'Sorting', 'Dynamic Programming', 'Greedy', 'Math', 'Binary Search'],
    faq: [
      {
        q: 'Are Array and Matrix problems related?',
        a: 'Yes. A matrix is essentially a 2D array, meaning many array techniques still apply. Traversal patterns, prefix sums, and sliding window concepts often extend naturally to matrix-based problems.'
      },
      {
        q: 'What is the best way to learn Array in DSA?',
        a: 'Start by understanding basic operations such as traversal, insertion, and deletion. Then practice pattern-based problems like two pointers, prefix sums, and sliding windows. Solving 5-10 problems per pattern and reviewing optimized solutions helps build strong intuition.'
      },
      {
        q: 'Is Array an important topic for FAANG interviews?',
        a: 'Yes, arrays are one of the most frequently tested topics in FAANG-style coding interviews. Many problems involving strings, matrices, and sliding windows are fundamentally array problems. Strong array skills often translate into faster solutions for other algorithm categories.'
      },
      {
        q: 'What are common Array patterns in coding interviews?',
        a: 'The most common array patterns include two pointers, sliding window, prefix sum, hashing with arrays, and binary search on sorted arrays. Recognizing which pattern applies to a problem often reduces complexity from O(n^2) to O(n) or O(log n).'
      }
    ]
  },

  'String': {
    about: `A String is a sequential collection of characters stored contiguously in memory. Because virtually all real-world applications handle text, textual data parsing, and sequence manipulation, string algorithms are a cornerstone of computer science and technical problem solving.

In technical interviews, string problems test your core competence in pointers, memory allocation, substring management, and pattern matching. Top tech companies frequently evaluate candidates on string parsing because these questions test edge cases (empty strings, unicode, leading/trailing whitespace) and require clean, robust code without off-by-one errors.

String problems commonly revolve around specific high-impact patterns:
• Scanning and searching with Two Pointers (e.g. palindrome verification, reverse operations).
• Maintaining variable-length substrings using Sliding Window (e.g. longest substring without repeating characters).
• Fast character frequency counting using Hash Table techniques.
• Linear pattern matching using String Matching algorithms (KMP, Z-algorithm, Rabin-Karp).
• Sequence compression and encoding strategies.

Reach for string manipulation techniques whenever you are validating input, matching sequences, tokenizing sentences, or building parsers. Many dynamic programming challenges (like Edit Distance and Longest Common Subsequence) are also founded directly on string transformations.

FleetCode provides 874 String practice problems ranging from beginner-level palindrome checks to intricate string parsing and automata challenges.`,
    prerequisites: [
      {
        id: 1,
        name: 'Array',
        slug: 'array',
        desc: 'Strings are fundamentally arrays of characters. Understanding array indexing and slicing is mandatory for string manipulation.'
      },
      {
        id: 2,
        name: 'Hash Table',
        slug: 'hash-table',
        desc: 'Character frequency maps (or 26-element arrays) allow O(1) character lookup, anagram validation, and duplicate detection.'
      },
      {
        id: 3,
        name: 'Two Pointers',
        slug: 'two-pointers',
        desc: 'Two pointers allow scanning strings from both ends or checking symmetrical properties like palindromes in O(n) time and O(1) space.'
      },
      {
        id: 4,
        name: 'Sliding Window',
        slug: 'sliding-window',
        desc: 'Sliding window is the gold standard for substring problems, eliminating quadratic nested loops when finding optimal substrings.'
      },
      {
        id: 5,
        name: 'Dynamic Programming',
        slug: 'dynamic-programming',
        desc: 'Many complex string problems (such as edit distance, regex matching, and LCS) require 2D dynamic programming tables.'
      }
    ],
    relatedTopics: ['Hash Table', 'Dynamic Programming', 'Sliding Window', 'Two Pointers', 'String Matching', 'Trie'],
    faq: [
      {
        q: 'Why are strings immutable in some languages like Java and Python?',
        a: 'String immutability provides thread safety, security in network/database connections, and allows hash code caching. In interviews, remember that concatenating immutable strings in a loop takes O(n^2) time; use StringBuilder or list joins instead.'
      },
      {
        q: 'What is the difference between a substring and a subsequence?',
        a: 'A substring is a contiguous sequence of characters within a string (e.g. "abc" in "xabcy"). A subsequence maintains relative order but does not need to be contiguous (e.g. "acy" in "xabcy").'
      },
      {
        q: 'When should I use KMP over simple two pointers?',
        a: 'Use KMP (Knuth-Morris-Pratt) or Rabin-Karp when searching for a pattern P within text T where worst-case O(N*M) naive search would time out and linear O(N+M) guaranteed performance is required.'
      }
    ]
  },

  'Two Pointers': {
    about: `The Two Pointers technique is an algorithmic pattern where two indices iterate across one or more sequential data structures simultaneously. By coordinating the movement of both pointers based on mathematical invariants or problem constraints, you can systematically prune redundant search spaces.

In coding interviews, two pointer questions are among the most popular because they demonstrate whether a candidate can optimize a brute force O(n^2) nested loop down to an optimal O(n) linear-time solution with O(1) auxiliary space. Interviewers look for clean boundary handling and correct pointer update conditions.

Two pointer problems primarily fall into three classic strategies:
• Opposing Direction Pointers: Starting one pointer at index 0 and another at index n-1, moving toward each other (used in 2Sum on sorted array, Container With Most Water, Palindrome verification).
• Same Direction (Fast and Slow) Pointers: Moving at different velocities or with conditional delays (used in cycle detection, removing duplicates in-place, middle of linked list).
• Merge Two Sequences: Maintaining a pointer in each of two sorted collections (used in Merge Sorted Array and intersection problems).

Reach for two pointers whenever your input is sorted or when you are tasked with partitioning, swapping, or finding pairs/triplets with specific sums.

FleetCode provides 251 Two Pointers practice problems spanning all difficulty tiers from fundamental warmups to advanced multi-pointer interval questions.`,
    prerequisites: [
      {
        id: 1,
        name: 'Array',
        slug: 'array',
        desc: 'Direct random access via index arithmetic is required to increment, decrement, and swap pointer positions in O(1) time.'
      },
      {
        id: 2,
        name: 'Sorting',
        slug: 'sorting',
        desc: 'Most two-pointer patterns require the input array to be sorted so that moving a pointer guarantees a predictable increase or decrease in values.'
      },
      {
        id: 3,
        name: 'Binary Search',
        slug: 'binary-search',
        desc: 'Binary search shares the same foundational concept of monotonic search space reduction used in two pointers.'
      },
      {
        id: 4,
        name: 'Linked List',
        slug: 'linked-list',
        desc: 'Fast and slow pointer techniques (Floyd cycle finding) are essential for detecting cycles and finding list midpoints without length counting.'
      },
      {
        id: 5,
        name: 'Sliding Window',
        slug: 'sliding-window',
        desc: 'Sliding window is a natural evolution of two pointers where the distance between the two pointers defines an active contiguous window.'
      }
    ],
    relatedTopics: ['Array', 'Sliding Window', 'Binary Search', 'Sorting', 'Linked List', 'Greedy'],
    faq: [
      {
        q: 'Does Two Pointers always require sorted input?',
        a: 'Not always. Opposing pointers for pair sums require sorted arrays, but fast-and-slow pointers (cycle detection) and in-place partition pointers (Dutch National Flag) work on unsorted collections.'
      },
      {
        q: 'How does Two Pointers differ from Sliding Window?',
        a: 'In Two Pointers, the pointers often move toward each other or scan independently. In Sliding Window, both pointers move in the same direction to expand or shrink a contiguous subarray satisfying a condition.'
      }
    ]
  },

  'Sliding Window': {
    about: `The Sliding Window technique is an algorithmic pattern designed to perform operations on a specific window (contiguous subarray or substring) that expands, contracts, or slides across an array or string. By reusing computations from overlapping windows, it avoids redundant nested iterations.

In coding interviews, sliding window questions are among the most frequently asked medium-to-hard interview problems at Meta, Google, and Amazon. Mastering this pattern demonstrates you can recognize rolling state transitions and maintain running aggregates (such as sums, distinct counts, or frequency hashes) in amortized O(1) per step.

Sliding window implementations generally fall into two primary formats:
• Fixed-Size Window: The window length k remains constant; as the right boundary advances, the left boundary advances identically, updating the running sum or max (e.g. Maximum Sum Subarray of Size K).
• Dynamic / Variable-Size Window: The right pointer expands the window until a condition is broken, then the left pointer contracts the window until the condition is restored (e.g. Longest Substring Without Repeating Characters, Minimum Window Substring).

Reach for sliding window whenever the problem asks for the longest, shortest, or optimal contiguous subsegment matching a monotonic criteria.

FleetCode provides 162 Sliding Window practice problems designed to build deep pattern intuition from beginner to hard interview challenges.`,
    prerequisites: [
      {
        id: 1,
        name: 'Array',
        slug: 'array',
        desc: 'Sliding windows operate directly on indexed sequence buffers, requiring constant-time access to element values.'
      },
      {
        id: 2,
        name: 'Two Pointers',
        slug: 'two-pointers',
        desc: 'A sliding window is defined by left and right pointers moving in the same direction with amortized 2N total steps.'
      },
      {
        id: 3,
        name: 'Hash Table',
        slug: 'hash-table',
        desc: 'Frequency maps maintain counts of items inside the active window to detect duplicates or verify character presence in O(1).'
      },
      {
        id: 4,
        name: 'Prefix Sum',
        slug: 'prefix-sum',
        desc: 'Prefix sums and sliding windows solve related subarray problems; knowing when to use each is an essential interview skill.'
      },
      {
        id: 5,
        name: 'Monotonic Queue',
        slug: 'monotonic-queue',
        desc: 'For sliding window maximum/minimum queries in O(n) time, a monotonic deque maintains candidates in sorted order.'
      }
    ],
    relatedTopics: ['Two Pointers', 'Array', 'Hash Table', 'String', 'Monotonic Queue', 'Prefix Sum'],
    faq: [
      {
        q: 'Can Sliding Window handle negative numbers for sum constraints?',
        a: 'No. When array elements can be negative, expanding the window does not monotonically increase the sum. In such cases, use Prefix Sum + Hash Table instead.'
      },
      {
        q: 'Why is dynamic sliding window O(N) even with a nested while loop?',
        a: 'Because the left and right pointers only advance forward and each element is visited at most twice (once added by right, once removed by left), achieving amortized O(N) runtime.'
      }
    ]
  },

  'Prefix Sum': {
    about: `Prefix Sum is a precomputation technique where an auxiliary array stores the cumulative sum of elements from the beginning up to each index. This allows any subsequent range sum query between indices L and R to be evaluated in exact O(1) constant time as prefix[R] - prefix[L - 1].

In coding interviews, prefix sums are tested frequently because they represent a core optimization paradigm: trading O(n) preprocessing time and space to convert repetitive O(n) range computations into immediate O(1) lookups. Interviewers love combining prefix sums with hash maps to solve tricky subarray sum problems.

Common prefix sum techniques include:
• 1D Range Queries: Precomputing cumulative sums to answer queries in O(1) time.
• Prefix Sum + Hash Map: Storing previous prefix sums to find subarrays whose sum equals target k in O(n) time (e.g. Subarray Sum Equals K).
• 2D Matrix Prefix Sum: Extending the concept to 2D grids using inclusion-exclusion principles to query rectangular submatrix sums in O(1).
• Difference Arrays: The inverse of prefix sums, allowing range updates in O(1) followed by a single prefix sweep.

Reach for prefix sums whenever you encounter problems involving static range queries, subarray sums, parity balances, or cumulative frequency counts.

FleetCode provides 246 Prefix Sum practice problems spanning array, matrix, and tree applications.`,
    prerequisites: [
      {
        id: 1,
        name: 'Array',
        slug: 'array',
        desc: 'Prefix sums are computed sequentially over arrays by setting prefix[i] = prefix[i-1] + arr[i].'
      },
      {
        id: 2,
        name: 'Hash Table',
        slug: 'hash-table',
        desc: 'Pairing prefix sums with a hash map of frequencies enables O(n) solutions for subarray sum and divisible sum questions.'
      },
      {
        id: 3,
        name: 'Two Pointers',
        slug: 'two-pointers',
        desc: 'Understanding two pointer ranges helps formulate the L and R boundary subtractions correctly without off-by-one errors.'
      },
      {
        id: 4,
        name: 'Matrix',
        slug: 'matrix',
        desc: 'Extending prefix sums to 2D matrices requires calculating subgrid areas using inclusion-exclusion math.'
      },
      {
        id: 5,
        name: 'Binary Indexed Tree',
        slug: 'binary-indexed-tree',
        desc: 'When arrays are mutable (elements are updated dynamically), Fenwick trees or Segment Trees replace static prefix sum arrays.'
      }
    ],
    relatedTopics: ['Array', 'Hash Table', 'Matrix', 'Sliding Window', 'Binary Indexed Tree', 'Math'],
    faq: [
      {
        q: 'Why is prefix sum preferable to sliding window for Subarray Sum Equals K?',
        a: 'Because sliding window requires monotonic expansion (all positive numbers). If the array contains zeros or negative numbers, only prefix sum with a frequency hash map can find all valid subarrays in O(n).'
      },
      {
        q: 'What is a difference array?',
        a: 'A difference array is the dual of prefix sums. It allows you to add a value x to an entire range [L, R] in O(1) time by modifying diff[L] += x and diff[R+1] -= x, then taking the prefix sum at the end.'
      }
    ]
  },

  'Binary Search': {
    about: `Binary Search is an efficient divide-and-conquer search algorithm that finds the position of a target value within a sorted collection in O(log n) time. By comparing the target to the middle element, it eliminates half of the remaining search space at every step.

In coding interviews, binary search is one of the most tested algorithms across all top tech companies. Beyond basic lookup, interviewers use binary search to evaluate your ability to formulate monotonic predicate functions and handle tricky off-by-one boundaries (such as choosing between low <= high or low < high).

Core binary search paradigms in technical interviews include:
• Standard Binary Search: Finding exact target values or insertion positions in sorted arrays.
• Lower Bound & Upper Bound: Locating the first or last occurrence of duplicates, or the transition point in a boolean condition.
• Rotated Sorted Arrays: Identifying which half of a rotated array is uniformly sorted to determine which branch to discard.
• Binary Search on Answer: Transforming optimization problems ("find the minimum maximum...") into verification problems using monotonic check functions.

Reach for binary search whenever an array is sorted, or whenever an answer space has a monotonic property where all values <= X are invalid and all values > X are valid.

FleetCode provides 349 Binary Search practice problems ranging from standard indexing to complex capacity optimization problems.`,
    prerequisites: [
      {
        id: 1,
        name: 'Array',
        slug: 'array',
        desc: 'Binary search requires O(1) random access by index to jump to the midpoint element in constant time.'
      },
      {
        id: 2,
        name: 'Sorting',
        slug: 'sorting',
        desc: 'The fundamental prerequisite for binary search is sorted order or a monotonic decision property over the search space.'
      },
      {
        id: 3,
        name: 'Divide and Conquer',
        slug: 'divide-and-conquer',
        desc: 'Binary search is the quintessential divide-and-conquer algorithm that reduces problem size by half at each iteration.'
      },
      {
        id: 4,
        name: 'Two Pointers',
        slug: 'two-pointers',
        desc: 'Binary search maintains two pointers (low and high) to define the active candidate boundaries.'
      },
      {
        id: 5,
        name: 'Math',
        slug: 'math',
        desc: 'Calculating mid = low + (high - low) / 2 prevents integer overflow in fixed-width numeric representations.'
      }
    ],
    relatedTopics: ['Array', 'Sorting', 'Two Pointers', 'Divide and Conquer', 'Math', 'Greedy'],
    faq: [
      {
        q: 'Why should I write mid = low + (high - low) / 2 instead of (low + high) / 2?',
        a: 'In languages with fixed integer sizes (like Java or C++), (low + high) can exceed the maximum integer limit and cause signed overflow, resulting in a negative index.'
      },
      {
        q: 'What is Binary Search on Answer?',
        a: 'It is a technique for optimization problems (e.g. Koko Eating Bananas, Split Array Largest Sum) where you binary search over possible answer values and use a greedy check function to see if a candidate answer is feasible.'
      }
    ]
  },

  'Dynamic Programming': {
    about: `Dynamic Programming (DP) is an algorithmic paradigm that solves complex optimization problems by breaking them down into simpler overlapping subproblems, solving each subproblem once, and storing their solutions in a lookup table.

In software engineering interviews, Dynamic Programming problems are widely considered among the most intellectually challenging. Top companies like Google, Meta, and Microsoft use DP questions to assess candidates' analytical rigor, state-space exploration, and recursive mathematical modeling.

Mastering DP in interviews revolves around identifying two key characteristics:
1. Optimal Substructure: An optimal solution to the problem contains optimal solutions to its subproblems.
2. Overlapping Subproblems: The same subproblems are solved repeatedly in a naive recursion tree.

Key DP formulation patterns include:
• 1D DP: State depends on a single linear index (e.g. Climbing Stairs, House Robber, Coin Change).
• 2D Grid / Matrix DP: Paths through matrices and subgrid optimizations (e.g. Unique Paths, Minimum Path Sum).
• Two-Sequence / String DP: Aligning or transforming two strings (e.g. Longest Common Subsequence, Edit Distance).
• Knapsack Variants: 0/1 Knapsack, Unbounded Knapsack, and Target Sum subsets.
• Interval and Tree DP: Dynamic state transitions over intervals or tree branches.

FleetCode provides hundreds of curated DP practice problems to help you build rock-solid pattern recognition from memoization down to space-optimized tabulation.`,
    prerequisites: [
      {
        id: 1,
        name: 'Recursion',
        slug: 'recursion',
        desc: 'DP begins with defining a recursive relation; understanding base cases and call stacks is vital.'
      },
      {
        id: 2,
        name: 'Memoization',
        slug: 'memoization',
        desc: 'Memoization caches recursive call results in a hash map or array to eliminate exponential branching.'
      },
      {
        id: 3,
        name: 'Array',
        slug: 'array',
        desc: 'Bottom-up tabulation stores state transitions sequentially in 1D or 2D DP arrays.'
      },
      {
        id: 4,
        name: 'Math',
        slug: 'math',
        desc: 'Formulating recurrence relations requires mathematical induction and combinatorics thinking.'
      },
      {
        id: 5,
        name: 'Greedy',
        slug: 'greedy',
        desc: 'Understanding why greedy fails on overlapping choices clarifies when dynamic programming is strictly necessary.'
      }
    ],
    relatedTopics: ['Recursion', 'Memoization', 'Array', 'Math', 'Greedy', 'Bitmask'],
    faq: [
      {
        q: 'Should I write Top-Down (Memoization) or Bottom-Up (Tabulation)?',
        a: 'In interviews, start with Top-Down recursion + memoization because it is often more intuitive to conceptualize. Then optimize to Bottom-Up tabulation if space optimization is needed.'
      },
      {
        q: 'How do I know if a problem needs DP?',
        a: 'Look for phrases like "find the maximum/minimum", "count the number of ways", or "is it possible to...". If choices at each step influence future choices with overlapping subproblems, DP is the prime candidate.'
      }
    ]
  },

  'Graph': {
    about: `A Graph is a non-linear data structure consisting of a finite set of vertices (nodes) interconnected by edges. Graphs can model virtually any discrete system of relationships, including computer networks, social connections, state machines, dependency hierarchies, and geographic road maps.

In engineering interviews, graph questions are among the most realistic and frequently evaluated topics. Companies like Google, Uber, Amazon, and LinkedIn use graph problems to gauge candidates' conceptual models of traversal, shortest path calculation, topological sequencing, and connectivity validation.

Core graph algorithms tested in technical interviews include:
• Traversal Fundamentals: Breadth-First Search (BFS) for shortest paths in unweighted graphs and Depth-First Search (DFS) for component traversal and cycle detection.
• Topological Sort: Ordering tasks with prerequisites using Kahn's algorithm (in-degrees) or DFS post-order.
• Disjoint Set Union (Union-Find): Checking connected components and cycle formation in undirected graphs with near O(1) inverse Ackermann complexity.
• Shortest Path Algorithms: Dijkstra for non-negative weighted graphs and Bellman-Ford for graphs with negative weights.
• Minimum Spanning Trees (MST): Prim and Kruskal algorithms for connecting all nodes with minimum total edge weight.

FleetCode provides comprehensive Graph practice problems spanning matrix-as-graph representations, adjacency lists, and weighted network topologies.`,
    prerequisites: [
      {
        id: 1,
        name: 'Breadth-First Search',
        slug: 'breadth-first-search',
        desc: 'BFS uses a FIFO queue to explore nodes level-by-level, making it the premier algorithm for shortest path in unweighted graphs.'
      },
      {
        id: 2,
        name: 'Depth-First Search',
        slug: 'depth-first-search',
        desc: 'DFS uses recursion or a stack to plunge deep into branches before backtracking, ideal for connected components and cycle detection.'
      },
      {
        id: 3,
        name: 'Union Find',
        slug: 'union-find',
        desc: 'Disjoint Set Union (DSU) tracks connected components and detects cycles in undirected graphs with near-constant time operations.'
      },
      {
        id: 4,
        name: 'Topological Sort',
        slug: 'topological-sort',
        desc: 'Topological sorting linearly orders vertices of Directed Acyclic Graphs (DAGs) according to prerequisite dependencies.'
      },
      {
        id: 5,
        name: 'Shortest Path',
        slug: 'shortest-path',
        desc: 'Shortest path algorithms (like Dijkstra and Bellman-Ford) compute minimum cost routes across weighted edges.'
      }
    ],
    relatedTopics: ['Depth-First Search', 'Breadth-First Search', 'Union Find', 'Topological Sort', 'Shortest Path', 'Tree'],
    faq: [
      {
        q: 'How do I represent a graph in coding interviews?',
        a: 'An Adjacency List (Map<Integer, List<Integer>> or vector<vector<int>>) is preferred because it takes O(V + E) space and allows efficient neighbor iteration. Use an Adjacency Matrix only for very dense graphs or small fixed-size grids.'
      },
      {
        q: 'When should I use BFS instead of DFS for graphs?',
        a: 'Use BFS when finding the shortest path or minimum number of moves in an unweighted graph, or when expanding outward in concentric waves. Use DFS when searching for paths, cycles, or exhaustive state space backtracking.'
      }
    ]
  },

  'Tree': {
    about: `A Tree is a hierarchical, non-linear data structure consisting of nodes connected by directed or undirected edges, with a designated root node and no cycles. Because hierarchical data occurs everywhere in computing (DOM trees, AST parsers, filesystems, and databases), tree structures are fundamental to computer science.

In tech interviews, tree problems are ubiquitous. They appear in nearly every coding screen because they directly test a candidate's grasp of recursive thinking, traversal mechanics, and spatial induction without requiring overly verbose boilerplate code.

Core tree interview concepts include:
• Traversal Patterns: Preorder (Root, Left, Right), Inorder (Left, Root, Right), Postorder (Left, Right, Root), and Level-Order (BFS queue traversal).
• Properties & Metrics: Computing maximum depth, diameter, balance factors, path sums, and Lowest Common Ancestor (LCA).
• Binary Search Trees (BST): Utilizing the BST invariant (left < root < right) to achieve logarithmic search, insertion, and deletion.
• Tree Construction & Serialization: Reconstructing trees from traversal combinations (Preorder + Inorder) or serializing trees into string representations.

FleetCode provides hundreds of curated Tree practice problems from simple depth calculations to complex tree dynamic programming and serialization challenges.`,
    prerequisites: [
      {
        id: 1,
        name: 'Recursion',
        slug: 'recursion',
        desc: 'Tree algorithms are inherently recursive because subtrees are themselves smaller trees with identical structural properties.'
      },
      {
        id: 2,
        name: 'Binary Tree',
        slug: 'binary-tree',
        desc: 'Binary trees restrict each node to at most two children (left and right), forming the basis for BSTs, heaps, and expression trees.'
      },
      {
        id: 3,
        name: 'Depth-First Search',
        slug: 'depth-first-search',
        desc: 'DFS traversal strategies explore tree branches to leaf nodes and return aggregated properties up the call stack.'
      },
      {
        id: 4,
        name: 'Breadth-First Search',
        slug: 'breadth-first-search',
        desc: 'BFS level-order traversal visits nodes level by level using a queue, solving shallowest node and view problems.'
      },
      {
        id: 5,
        name: 'Stack',
        slug: 'stack',
        desc: 'Iterative tree traversals utilize explicit stacks to simulate the recursive call stack and avoid stack overflow.'
      }
    ],
    relatedTopics: ['Binary Tree', 'Depth-First Search', 'Breadth-First Search', 'Recursion', 'Binary Search Tree', 'Trie'],
    faq: [
      {
        q: 'Why does Inorder Traversal produce sorted output on a BST?',
        a: 'Because in a Binary Search Tree, all nodes in the left subtree are smaller than the root, and all nodes in the right subtree are larger. Inorder visits Left, then Root, then Right, directly visiting values in ascending order.'
      },
      {
        q: 'What is the Lowest Common Ancestor (LCA)?',
        a: 'The LCA of two nodes p and q in a tree is the deepest node that has both p and q as descendants (where a node can be a descendant of itself).'
      }
    ]
  },

  'Linked List': {
    about: `A Linked List is a linear collection of data elements called nodes, where each node contains a value and a reference (pointer) to the next node in the sequence. Unlike arrays, linked lists do not store elements in contiguous memory locations, allowing O(1) dynamic insertions and deletions without reallocation or element shifting.

In coding interviews, linked list problems test your pointer precision, memory management, and edge-case discipline. Interviewers use linked list questions to see how well you handle pointer reassignments without creating cycles, memory leaks, or Null Pointer Exceptions.

Key linked list interview patterns include:
• Sentinel / Dummy Head: Initializing a dummy node before the head to simplify edge cases like deleting the head or merging lists.
• Fast and Slow Pointers (Tortoise and Hare): Finding list midpoints in a single pass and detecting cycles (Floyd's algorithm).
• In-Place Reversal: Iteratively reversing pointer directions (e.g. Reverse Linked List, Reverse in K-Group) using previous, current, and next pointers.
• Merging & Sorting: Combining multiple sorted lists (Merge K Sorted Lists using heaps or divide-and-conquer).

FleetCode provides 81 Linked List practice problems covering singly-linked, doubly-linked, and circular list variations.`,
    prerequisites: [
      {
        id: 1,
        name: 'Two Pointers',
        slug: 'two-pointers',
        desc: 'Fast and slow pointer strategies are essential for cycle detection and finding list midpoints in O(n) time and O(1) space.'
      },
      {
        id: 2,
        name: 'Recursion',
        slug: 'recursion',
        desc: 'Linked lists can be reversed and verified recursively by treating head.next as the head of a smaller sub-list.'
      },
      {
        id: 3,
        name: 'Stack',
        slug: 'stack',
        desc: 'Stacks allow processing linked lists in reverse order when backwards traversal pointers are not available.'
      },
      {
        id: 4,
        name: 'Hash Table',
        slug: 'hash-table',
        desc: 'Hash tables map original nodes to cloned nodes in complex structures like Copy List with Random Pointer.'
      },
      {
        id: 5,
        name: 'Doubly-Linked List',
        slug: 'doubly-linked-list',
        desc: 'Doubly-linked lists with prev and next pointers form the underlying engine of LRU Cache and LFU Cache designs.'
      }
    ],
    relatedTopics: ['Two Pointers', 'Recursion', 'Stack', 'Doubly-Linked List', 'Hash Table', 'Design'],
    faq: [
      {
        q: 'Why should I always use a dummy node in linked list problems?',
        a: 'A dummy (sentinel) node eliminates special edge case checks when adding or deleting the first node of the list, allowing uniform pointer operations.'
      },
      {
        q: 'How do you detect a cycle in a linked list?',
        a: 'Use Floyd\'s Cycle Detection (Tortoise and Hare): advance a slow pointer by 1 step and a fast pointer by 2 steps. If they meet, a cycle exists; if fast reaches null, no cycle exists.'
      }
    ]
  },

  'Stack': {
    about: `A Stack is a fundamental linear data structure that adheres to the Last-In, First-Out (LIFO) principle. Elements can only be added (pushed) or removed (popped) from the top of the stack, ensuring strict O(1) time complexity for both primary operations.

In coding interviews, stacks are indispensable for tracking nested structures, evaluating algebraic expressions, matching balanced pairs, and managing function execution lifecycles. Top companies test stacks to evaluate whether you understand how to unwind historical state efficiently.

Essential stack patterns evaluated in interviews include:
• Balanced Parentheses & Matching: Validating nested delimiters by matching closing tokens against the top of the stack.
• Monotonic Stack: Maintaining elements in strictly increasing or decreasing order to find the Next Greater Element or Largest Rectangle in Histogram in linear time.
• Expression Parsing: Evaluating postfix, infix, and prefix mathematical expressions (Reverse Polish Notation, Basic Calculator).
• Undo / History Operations: Implementing browser history, text editor undo buffers, or min-element tracking in O(1) space.

FleetCode provides 179 Stack practice problems ranging from basic bracket matching to advanced monotonic stack geometry challenges.`,
    prerequisites: [
      {
        id: 1,
        name: 'Array',
        slug: 'array',
        desc: 'Dynamic arrays (ArrayList, vector, list) provide the standard amortized O(1) push and pop backing store for stacks.'
      },
      {
        id: 2,
        name: 'Monotonic Stack',
        slug: 'monotonic-stack',
        desc: 'Monotonic stacks maintain sorted ordering inside the stack to answer next greater/smaller element queries in O(n).'
      },
      {
        id: 3,
        name: 'Recursion',
        slug: 'recursion',
        desc: 'Every recursive algorithm inherently uses the system call stack; understanding stacks demystifies recursion.'
      },
      {
        id: 4,
        name: 'Queue',
        slug: 'queue',
        desc: 'Contrasting LIFO (stack) with FIFO (queue) is essential for implementing two-stack queues or two-queue stacks.'
      },
      {
        id: 5,
        name: 'Dynamic Programming',
        slug: 'dynamic-programming',
        desc: 'Stacks are frequently combined with DP to store state boundaries during string and histogram parsing.'
      }
    ],
    relatedTopics: ['Monotonic Stack', 'Array', 'Recursion', 'Queue', 'String', 'Design'],
    faq: [
      {
        q: 'How can I design a Min-Stack with O(1) getMin()?',
        a: 'Maintain two stacks: a primary stack for values and an auxiliary min-stack that records the current minimum at each push step.'
      },
      {
        q: 'When should I use a Monotonic Stack?',
        a: 'Whenever a problem asks for the "next greater element", "previous smaller element", "daily temperatures", or involves area calculations over bars (like histograms).'
      }
    ]
  },

  'Sorting': {
    about: `Sorting is the computational process of rearranging a collection of items into a specific ascending or descending order. As one of the most thoroughly analyzed topics in computer science, sorting algorithms demonstrate fundamental tradeoffs between time complexity, auxiliary space, algorithmic stability, and cache locality.

In technical interviews, sorting is frequently used as a decisive preprocessing step. Sorting transforms chaotic, unordered inputs into ordered sequences, enabling fast binary search, two-pointer scanning, interval merging, and greedy selections.

Key sorting algorithms and concepts evaluated in interviews include:
• Comparison Sorts: Quick Sort (O(n log n) average), Merge Sort (O(n log n) stable), and Heap Sort (O(n log n) in-place).
• Non-Comparison Linear Sorts: Counting Sort, Bucket Sort, and Radix Sort (O(n + k) time for constrained integer ranges).
• Custom Comparators: Sorting objects, tuples, and intervals by multiple criteria (e.g. sorting intervals by start time ascending and end time descending).
• Stability: Ensuring elements with equal keys preserve their original relative order.

FleetCode provides 502 Sorting practice problems spanning sorting fundamentals, interval problems, and greedy array ordering.`,
    prerequisites: [
      {
        id: 1,
        name: 'Array',
        slug: 'array',
        desc: 'Sorting algorithms operate on indexed memory buffers, executing comparisons and in-place element swaps.'
      },
      {
        id: 2,
        name: 'Divide and Conquer',
        slug: 'divide-and-conquer',
        desc: 'Optimal O(n log n) comparison sorts (Merge Sort, Quick Sort) partition arrays into subproblems and combine sorted results.'
      },
      {
        id: 3,
        name: 'Binary Search',
        slug: 'binary-search',
        desc: 'Sorting an array enables O(log n) binary search lookups and lower/upper bound range queries.'
      },
      {
        id: 4,
        name: 'Two Pointers',
        slug: 'two-pointers',
        desc: 'Sorting unlocks opposing two-pointer strategies for finding target pair sums and triplet combinations in O(n).'
      },
      {
        id: 5,
        name: 'Heap (Priority Queue)',
        slug: 'heap-priority-queue',
        desc: 'Binary heaps implement Heap Sort and efficiently solve Top-K Frequent Elements and Kth Largest Element problems.'
      }
    ],
    relatedTopics: ['Array', 'Binary Search', 'Two Pointers', 'Divide and Conquer', 'Greedy', 'Heap (Priority Queue)'],
    faq: [
      {
        q: 'Why is comparison-based sorting lower bounded by O(n log n)?',
        a: 'Because distinguishing between all n! possible permutations requires a decision tree of height at least log2(n!) ≈ n log n comparisons.'
      },
      {
        q: 'What is a stable sort and when does it matter?',
        a: 'A sort is stable if it preserves the relative order of elements with equal keys. This matters when multi-tier sorting (e.g. sorting by name, then by grade).'
      }
    ]
  },

  'Hash Table': {
    about: `A Hash Table (Hash Map) is an associative data structure that stores key-value pairs and uses a mathematical hash function to compute an index into an array of buckets, enabling average-case O(1) time complexity for insertions, deletions, and lookups.

In software engineering interviews, Hash Tables are undeniably the single most frequently utilized data structure. Tech interviewers look for candidates who intuitively recognize when a hash table can trade O(n) space to dramatically reduce runtime complexity from quadratic O(n^2) to linear O(n).

Core interview patterns utilizing Hash Tables include:
• Frequency Counting: Mapping items to their occurrence counts (e.g. Valid Anagram, Top K Frequent Elements).
• Complement / Difference Lookup: Storing seen values to find pairs that sum to a target in a single pass (e.g. Two Sum).
• Grouping / Anagram Categorization: Using canonical keys (like sorted character strings or tuple counts) to cluster related items.
• Fast Deduplication: Using Hash Sets to detect cycle loops and repeated elements in O(1).

FleetCode provides 788 Hash Table practice problems covering everything from classic pair searches to custom hash design and caching architectures.`,
    prerequisites: [
      {
        id: 1,
        name: 'Array',
        slug: 'array',
        desc: 'Under the hood, a hash table is backed by an array of buckets indexed by the output of a hash function.'
      },
      {
        id: 2,
        name: 'String',
        slug: 'string',
        desc: 'Strings are the most common keys stored in hash tables, requiring efficient polynomial rolling hash functions.'
      },
      {
        id: 3,
        name: 'Sorting',
        slug: 'sorting',
        desc: 'Sorting keys or values is often used in conjunction with hashing to produce canonical representations.'
      },
      {
        id: 4,
        name: 'Two Pointers',
        slug: 'two-pointers',
        desc: 'Hash tables and two pointers are the two primary competing techniques for solving pair-sum and subarray problems.'
      },
      {
        id: 5,
        name: 'Design',
        slug: 'design',
        desc: 'Designing HashMap, HashSet, or LRU Cache combines hash tables with doubly linked lists to achieve O(1) operations.'
      }
    ],
    relatedTopics: ['Array', 'String', 'Sorting', 'Two Pointers', 'Design', 'Prefix Sum'],
    faq: [
      {
        q: 'How are hash collisions handled?',
        a: 'Collisions are commonly resolved using Separate Chaining (linked lists or balanced BSTs in each bucket, as in Java 8+) or Open Addressing (linear probing, quadratic probing, or double hashing).'
      },
      {
        q: 'What is the worst-case time complexity of a Hash Table?',
        a: 'Worst-case is O(n) if all keys hash to the same bucket (or O(log n) in Java 8+ where bucket lists convert to red-black trees when length exceeds 8).'
      }
    ]
  },
};

// Dynamic helper to generate complete structured details for any of the 71 topics
export function getTopicDetails(topicName, count = 100, category = '') {
  if (TOPIC_DETAILS[topicName]) {
    return TOPIC_DETAILS[topicName];
  }

  // Generate robust, tailored content matching the exact format
  const about = `${topicName} is a vital concept in Data Structures and Algorithms (DSA). It provides specialized computational primitives designed to organize, process, and optimize algorithmic workflows efficiently.

In technical interviews at top engineering companies like Google, Amazon, Meta, and Microsoft, ${topicName} questions are evaluated to test candidates' problem-solving intuition, edge-case handling, and algorithmic optimization skills. Mastery of ${topicName} allows you to transform brute-force approaches into time- and space-optimal solutions.

Problems in ${topicName} typically revolve around recognizing core recurring patterns:
• Identifying the structural invariants and constraints governing ${topicName}.
• Applying optimal traversal and query strategies to reduce unnecessary computation.
• Integrating auxiliary structures like Hash Tables, Two Pointers, or Heaps for fast lookups.
• Formulating state transitions or divide-and-conquer decompositions.
• Pruning invalid branches early to achieve optimal runtime complexity.

You should reach for ${topicName} whenever your problem exhibits natural dependencies, hierarchical or sequential arrangements, or when state tracking enables sub-problem reuse.

FleetCode provides ${count} ${topicName} practice problems ranging from beginner-friendly foundations to advanced interview-level challenges. By practicing these questions and learning the common patterns, you will build the intuition needed to quickly identify optimal solutions during real coding interviews.`;

  const prerequisites = [
    {
      id: 1,
      name: 'Array',
      slug: 'array',
      desc: `Arrays provide the fundamental contiguous indexed memory and sequential traversal base required across ${topicName} implementations.`
    },
    {
      id: 2,
      name: 'Hash Table',
      slug: 'hash-table',
      desc: `Hash tables provide O(1) lookups and state caching, frequently paired with ${topicName} to optimize runtime complexity from O(n^2) to O(n).`
    },
    {
      id: 3,
      name: 'Two Pointers',
      slug: 'two-pointers',
      desc: `Two-pointer scanning and window techniques allow efficient boundary tracking and monotonic search space reduction in ${topicName}.`
    },
    {
      id: 4,
      name: 'Binary Search',
      slug: 'binary-search',
      desc: `Binary search enables logarithmic O(log n) optimization over ordered subsets or answer ranges within ${topicName} problems.`
    },
    {
      id: 5,
      name: 'Recursion',
      slug: 'recursion',
      desc: `Recursive formulation and backtracking allow systematic subproblem decomposition and state exploration for ${topicName}.`
    }
  ];

  const relatedTopics = ['Array', 'Hash Table', 'Two Pointers', 'Binary Search', 'Dynamic Programming', 'Sorting'];

  const faq = [
    {
      q: `What is the most effective strategy to master ${topicName}?`,
      a: `Begin by mastering the core definitions and fundamental operations. Then solve 5-10 standard pattern problems on FleetCode, focusing on understanding time/space complexities and boundary conditions before attempting advanced interview challenges.`
    },
    {
      q: `How frequently does ${topicName} appear in coding interviews?`,
      a: `${topicName} questions frequently appear in technical screens at Tier-1 companies because they reveal your core understanding of computational efficiency, clean code organization, and algorithmic trade-offs.`
    },
    {
      q: `What are common pitfalls when solving ${topicName} questions?`,
      a: `The most frequent pitfalls include overlooking boundary edge cases (empty inputs, single elements, off-by-one indices) and choosing a brute-force approach when an auxiliary data structure could yield a linear or logarithmic solution.`
    }
  ];

  return { about, prerequisites, relatedTopics, faq };
}
