/**
 * Topic 6: Merge Intervals
 */

export const mergeIntervals = {
  id: 'merge-intervals',
  order: 6,
  name: 'Merge Intervals',
  icon: '📅',
  description: 'Technique dealing with overlapping time intervals, scheduling, and range intersections by sorting by start or end time.',
  patterns: [
    {
      id: 'intervals-core',
      name: 'Merge Intervals',
      topicId: 'merge-intervals',
      signals: ['Overlapping schedules/events', 'Finding gaps between busy periods', 'Merging overlapping ranges'],
      coreIdea: 'Sort intervals by start time. Two intervals [s1, e1] and [s2, e2] overlap if s2 <= e1; merge by setting end = max(e1, e2).',
      dataStructure: 'Array of Intervals / Min-Heap',
      questions: [
        {
          id: 'mi-merge-intervals',
          title: 'Merge Intervals',
          slug: 'merge-intervals',
          difficulty: 'Medium',
          patternId: 'intervals-core',
          hints: {
            recognition: 'Given collection of intervals, merge all overlapping intervals.',
            structure: 'Sort by start time. If current start <= previous end, merge: prev.end = max(prev.end, curr.end).',
            skeleton: 'intervals.sort((a, b) => a[0] - b[0]);\nconst res = [intervals[0]];\nfor (let i = 1; i < intervals.length; i++) {\n  const prev = res[res.length - 1], curr = intervals[i];\n  if (curr[0] <= prev[1]) prev[1] = Math.max(prev[1], curr[1]);\n  else res.push(curr);\n}\nreturn res;',
          },
        },
        {
          id: 'mi-insert-interval',
          title: 'Insert Interval',
          slug: 'insert-interval',
          difficulty: 'Medium',
          patternId: 'intervals-core',
          hints: {
            recognition: 'Insert newInterval into sorted non-overlapping intervals and merge if necessary.',
            structure: 'Three stages: add all intervals ending before newInterval starts, merge overlaps with newInterval, add remaining.',
            skeleton: 'const res = []; let i = 0;\nwhile (i < n && intervals[i][1] < newInterval[0]) res.push(intervals[i++]);\nwhile (i < n && intervals[i][0] <= newInterval[1]) {\n  newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n  newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n  i++;\n}\nres.push(newInterval);\nwhile (i < n) res.push(intervals[i++]);\nreturn res;',
          },
        },
        {
          id: 'mi-interval-intersection',
          title: 'Interval Intersection',
          slug: 'interval-list-intersections',
          difficulty: 'Medium',
          patternId: 'intervals-core',
          hints: {
            recognition: 'Find intersection of two closed interval lists.',
            structure: 'Two pointers i, j. Overlap is [max(start1, start2), min(end1, end2)]. Advance the pointer with smaller end time.',
            skeleton: 'let i = 0, j = 0; const res = [];\nwhile (i < firstList.length && j < secondList.length) {\n  const lo = Math.max(firstList[i][0], secondList[j][0]);\n  const hi = Math.min(firstList[i][1], secondList[j][1]);\n  if (lo <= hi) res.push([lo, hi]);\n  if (firstList[i][1] < secondList[j][1]) i++; else j++;\n}\nreturn res;',
          },
        },
        {
          id: 'mi-overlapping-intervals',
          title: 'Non-overlapping Intervals',
          slug: 'non-overlapping-intervals',
          difficulty: 'Medium',
          patternId: 'intervals-core',
          hints: {
            recognition: 'Find minimum number of intervals to remove to make remainder non-overlapping.',
            structure: 'Greedy interval scheduling: sort by end time. Always keep interval that finishes earliest.',
            skeleton: 'intervals.sort((a, b) => a[1] - b[1]);\nlet end = -Infinity, removed = 0;\nfor (const [s, e] of intervals) {\n  if (s >= end) end = e;\n  else removed++;\n}\nreturn removed;',
          },
        },
        {
          id: 'mi-minimum-meeting-rooms',
          title: 'Minimum Meeting Rooms (Meeting Rooms II)',
          slug: 'meeting-rooms-ii',
          url: 'https://www.geeksforgeeks.org/problems/attend-all-meetings-ii/1',
          difficulty: 'Medium',
          patternId: 'intervals-core',
          hints: {
            recognition: 'Find minimum conference rooms required so no meetings overlap.',
            structure: 'Extract starts and ends, sort separately. Two pointers: if start < end room++; else endPtr++.',
            skeleton: 'const starts = intervals.map(x => x[0]).sort((a, b) => a - b);\nconst ends = intervals.map(x => x[1]).sort((a, b) => a - b);\nlet rooms = 0, e = 0;\nfor (let s = 0; s < starts.length; s++) {\n  if (starts[s] < ends[e]) rooms++;\n  else e++;\n}\nreturn rooms;',
          },
        },
        {
          id: 'mi-maximum-cpu-load',
          title: 'Maximum CPU Load (Car Pooling)',
          slug: 'car-pooling',
          difficulty: 'Medium',
          patternId: 'intervals-core',
          hints: {
            recognition: 'Trips/jobs have [load, start, end]. Find peak combined load at any point in time.',
            structure: 'Line sweep / difference array ordered by timestamp. Add load when job starts, subtract load when job ends.',
            skeleton: 'const events = [];\nfor (const [load, s, e] of trips) {\n  events.push([s, load]);\n  events.push([e, -load]);\n}\nevents.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]);\nlet maxLoad = 0, curLoad = 0;\nfor (const [, load] of events) {\n  curLoad += load;\n  maxLoad = Math.max(maxLoad, curLoad);\n}\nreturn maxLoad;',
          },
        },
        {
          id: 'mi-employee-free-time',
          title: 'Employee Free Time',
          slug: 'employee-free-time',
          url: 'https://www.lintcode.com/problem/850/',
          difficulty: 'Hard',
          patternId: 'intervals-core',
          hints: {
            recognition: 'Find common free time intervals for all employees.',
            structure: 'Flatten and merge all work intervals. Gaps between merged working intervals are the free times.',
            skeleton: 'const all = schedule.flat().sort((a, b) => a.start - b.start);\nconst res = [];\nlet prevEnd = all[0].end;\nfor (let i = 1; i < all.length; i++) {\n  if (all[i].start > prevEnd) res.push({ start: prevEnd, end: all[i].start });\n  prevEnd = Math.max(prevEnd, all[i].end);\n}\nreturn res;',
          },
        },
      ],
    },
  ],
};
