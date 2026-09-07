import { useState, useEffect } from 'react';

export function useSolvedProblems() {
  const [solved, setSolved] = useState(() => {
    try {
      const data = localStorage.getItem('fc-solved-problems');
      return data ? new Set(JSON.parse(data)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleSolved = (slugOrId) => {
    if (!slugOrId) return;
    const key = String(slugOrId);
    setSolved(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      try {
        localStorage.setItem('fc-solved-problems', JSON.stringify(Array.from(next)));
        window.dispatchEvent(new Event('fc-solved-updated'));
      } catch {}
      return next;
    });
  };

  const isSolved = (problem) => {
    if (!problem) return false;
    return (
      (problem.Slug && solved.has(problem.Slug)) ||
      (problem['#'] != null && solved.has(String(problem['#']))) ||
      (problem.id != null && solved.has(String(problem.id)))
    );
  };

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const data = localStorage.getItem('fc-solved-problems');
        setSolved(data ? new Set(JSON.parse(data)) : new Set());
      } catch {}
    };
    window.addEventListener('fc-solved-updated', handleUpdate);
    return () => window.removeEventListener('fc-solved-updated', handleUpdate);
  }, []);

  return { solved, toggleSolved, isSolved };
}
