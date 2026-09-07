import { useState, useEffect } from 'react';

let cachedProblems = null;

export function useProblems() {
  const [problems, setProblems] = useState(cachedProblems || []);
  const [loading, setLoading] = useState(!cachedProblems || cachedProblems.length !== 4023);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedProblems && cachedProblems.length === 4023) {
      setProblems(cachedProblems);
      setLoading(false);
      return;
    }
    fetch('/data/problems.json?v=4023&t=' + Date.now())
      .then(r => r.json())
      .then(data => {
        cachedProblems = data;
        setProblems(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { problems, loading, error };
}
