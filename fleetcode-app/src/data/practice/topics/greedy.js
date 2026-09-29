/**
 * Topic 21: Greedy Algorithms
 */

export const greedyAlgorithms = {
  id: 'greedy',
  order: 21,
  name: 'Greedy Algorithms',
  icon: '💰',
  description:
    'Make locally optimal choices at each step to reach a globally optimal solution. Covers interval scheduling, jump games, task assignment, and gas circuit problems.',
  patterns: [
    /* ── 1. Interval Scheduling Greedy ─────────────────────────────────── */
    {
      id: 'greedy-intervals',
      name: 'Interval Scheduling Greedy',
      topicId: 'greedy',
      signals: [
        'Select maximum non-overlapping intervals',
        'Minimum number of arrows / platforms / meeting rooms',
        'Sort by end time then greedily select',
        'Erasing overlapping intervals',
      ],
      coreIdea:
        'Sort intervals by end time. Greedily pick intervals that start after the last selected end. For minimum deletions: total − maximum non-overlapping count.',
      dataStructure: 'Sorted Array',
      questions: [
        {
          id: 'gr-non-overlapping',
          title: 'Non-overlapping Intervals',
          slug: 'non-overlapping-intervals',
          difficulty: 'Medium',
          patternId: 'greedy-intervals',
          hints: {
            recognition: 'Remove minimum intervals to make rest non-overlapping.',
            structure: 'Sort by end; greedily count non-overlapping; answer = total − count.',
            skeleton:
              'intervals.sort((a,b)=>a[1]-b[1]);\nlet keep=0,end=-Infinity;\nfor (const [s,e] of intervals) if (s>=end) { keep++; end=e; }\nreturn intervals.length-keep;',
          },
        },
        {
          id: 'gr-min-arrows',
          title: 'Minimum Number of Arrows to Burst Balloons',
          slug: 'minimum-number-of-arrows-to-burst-balloons',
          difficulty: 'Medium',
          patternId: 'greedy-intervals',
          hints: {
            recognition: 'Minimum arrows to burst all balloon intervals [x_start, x_end].',
            structure: 'Sort by end; one arrow at end covers all overlapping balloons; move end when gap found.',
            skeleton:
              'points.sort((a,b)=>a[1]-b[1]);\nlet arrows=1,end=points[0][1];\nfor (let i=1;i<points.length;i++)\n  if (points[i][0]>end) { arrows++; end=points[i][1]; }\nreturn arrows;',
          },
        },
        {
          id: 'gr-meeting-rooms-ii',
          title: 'Meeting Rooms II',
          slug: 'meeting-rooms-ii',
          url: 'https://www.geeksforgeeks.org/problems/attend-all-meetings-ii/1',
          difficulty: 'Medium',
          patternId: 'greedy-intervals',
          hints: {
            recognition: 'Minimum meeting rooms needed for all intervals.',
            structure: 'Sort starts and ends separately; two-pointer sweep counting concurrent meetings.',
            skeleton:
              'const starts=intervals.map(i=>i[0]).sort((a,b)=>a-b);\nconst ends=intervals.map(i=>i[1]).sort((a,b)=>a-b);\nlet rooms=0,maxRooms=0,j=0;\nfor (let i=0;i<starts.length;i++) {\n  if (starts[i]<ends[j]) rooms++;\n  else j++;\n  maxRooms=Math.max(maxRooms,rooms);\n}\nreturn maxRooms;',
          },
        },
      ],
    },

    /* ── 2. Jump / Reach Greedy ─────────────────────────────────────────── */
    {
      id: 'greedy-jump',
      name: 'Jump / Reach Greedy',
      topicId: 'greedy',
      signals: [
        'Can you reach the last index?',
        'Minimum jumps to reach end',
        'Track furthest reachable index at each step',
        'Level-based jump counting',
      ],
      coreIdea:
        'Track the furthest index reachable from current position. When you exhaust current "reach", increment jumps and extend reach. For reachability, check if furthest ever covers last index.',
      dataStructure: 'Single Pass with Variables',
      questions: [
        {
          id: 'gr-jump-game',
          title: 'Jump Game',
          slug: 'jump-game',
          difficulty: 'Medium',
          patternId: 'greedy-jump',
          hints: {
            recognition: 'Can you reach the last index from position 0?',
            structure: 'Track maxReach = max(maxReach, i + nums[i]); if i > maxReach, stuck.',
            skeleton:
              'let reach=0;\nfor (let i=0;i<nums.length;i++) {\n  if (i>reach) return false;\n  reach=Math.max(reach,i+nums[i]);\n}\nreturn true;',
          },
        },
        {
          id: 'gr-jump-game-ii',
          title: 'Jump Game II',
          slug: 'jump-game-ii',
          difficulty: 'Medium',
          patternId: 'greedy-jump',
          hints: {
            recognition: 'Minimum jumps to reach last index.',
            structure: 'BFS-like levels: when i passes current end, extend to farthest, increment jumps.',
            skeleton:
              'let jumps=0,curEnd=0,farthest=0;\nfor (let i=0;i<nums.length-1;i++) {\n  farthest=Math.max(farthest,i+nums[i]);\n  if (i===curEnd) { jumps++; curEnd=farthest; }\n}\nreturn jumps;',
          },
        },
        {
          id: 'gr-jump-game-vii',
          title: 'Jump Game VII',
          slug: 'jump-game-vii',
          difficulty: 'Medium',
          patternId: 'greedy-jump',
          hints: {
            recognition: 'Jump minJump to maxJump steps; can only land on "0"s.',
            structure: 'Sliding window BFS: track reachable count in [i-maxJump, i-minJump].',
            skeleton:
              'const reach=new Array(s.length).fill(false); reach[0]=true;\nlet cnt=0,curReach=0;\nfor (let i=1;i<s.length;i++) {\n  if (i>=minJump) cnt+=(reach[i-minJump]?1:0);\n  if (i>maxJump) cnt-=(reach[i-maxJump-1]?1:0);\n  if (cnt>0&&s[i]==="0") reach[i]=true;\n}\nreturn reach[s.length-1];',
          },
        },
      ],
    },

    /* ── 3. Greedy Assignment / Gas Station ─────────────────────────────── */
    {
      id: 'greedy-assign',
      name: 'Task Assignment & Gas Circuit',
      topicId: 'greedy',
      signals: [
        'Assign tasks to minimise max time or meeting deadlines',
        'Gas station circuit completion',
        'Candy distribution with neighbour constraints',
        'Can we distribute with minimum resources?',
      ],
      coreIdea:
        'For gas circuit: if cumulative tank < 0 at any station, that station cannot be the start; try next. For candy: two passes left→right and right→left ensuring local constraints.',
      dataStructure: 'Array + Greedy Variables',
      questions: [
        {
          id: 'gr-gas-station',
          title: 'Gas Station',
          slug: 'gas-station',
          difficulty: 'Medium',
          patternId: 'greedy-assign',
          hints: {
            recognition: 'Find starting gas station to complete circular route.',
            structure: 'If total gas ≥ total cost, solution exists. Reset start and tank whenever tank drops below 0.',
            skeleton:
              'let total=0,tank=0,start=0;\nfor (let i=0;i<gas.length;i++) {\n  total+=gas[i]-cost[i]; tank+=gas[i]-cost[i];\n  if (tank<0) { start=i+1; tank=0; }\n}\nreturn total>=0?start:-1;',
          },
        },
        {
          id: 'gr-candy',
          title: 'Candy',
          slug: 'candy',
          difficulty: 'Hard',
          patternId: 'greedy-assign',
          hints: {
            recognition: 'Each child gets ≥1 candy; higher-rated child gets more than neighbours.',
            structure: 'Left→right pass: if ratings[i]>ratings[i-1], candies[i]=candies[i-1]+1. Right→left pass: candies[i]=max(candies[i],candies[i+1]+1).',
            skeleton:
              'const c=new Array(n).fill(1);\nfor (let i=1;i<n;i++) if (ratings[i]>ratings[i-1]) c[i]=c[i-1]+1;\nfor (let i=n-2;i>=0;i--) if (ratings[i]>ratings[i+1]) c[i]=Math.max(c[i],c[i+1]+1);\nreturn c.reduce((a,b)=>a+b,0);',
          },
        },
        {
          id: 'gr-task-scheduler',
          title: 'Task Scheduler',
          slug: 'task-scheduler',
          difficulty: 'Medium',
          patternId: 'greedy-assign',
          hints: {
            recognition: 'Minimum time to finish all tasks with cooldown n between same tasks.',
            structure: 'Most frequent task determines idle slots: (maxFreq-1)*(n+1)+countOfMaxFreqTasks.',
            skeleton:
              'const freq=new Array(26).fill(0);\nfor (const t of tasks) freq[t.charCodeAt(0)-65]++;\nconst maxF=Math.max(...freq);\nconst maxCount=freq.filter(f=>f===maxF).length;\nreturn Math.max(tasks.length,(maxF-1)*(n+1)+maxCount);',
          },
        },
        {
          id: 'gr-two-city-scheduling',
          title: 'Two City Scheduling',
          slug: 'two-city-scheduling',
          difficulty: 'Medium',
          patternId: 'greedy-assign',
          hints: {
            recognition: 'Send n people to city A, n to city B minimising total cost.',
            structure: 'Sort by (costA - costB); first n go to A (biggest savings), rest to B.',
            skeleton:
              'costs.sort((a,b)=>(a[0]-a[1])-(b[0]-b[1]));\nreturn costs.reduce((sum,c,i)=>sum+(i<n?c[0]:c[1]),0);',
          },
        },
      ],
    },
  ],
};
