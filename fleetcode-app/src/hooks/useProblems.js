import { useState, useEffect } from 'react';

let cachedProblems = null;

export function useProblems() {
  const [problems, setProblems] = useState(cachedProblems || []);
  const [loading, setLoading] = useState(!cachedProblems);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedProblems) {
      setProblems(cachedProblems);
      setLoading(false);
      return;
    }
    fetch('/data/problems.json?v=4023')
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
