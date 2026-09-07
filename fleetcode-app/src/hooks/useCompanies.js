import { useState, useEffect } from 'react';

let cachedCompanies = null;

export function useCompanies() {
  const [companies, setCompanies] = useState(cachedCompanies || []);
  const [loading, setLoading] = useState(!cachedCompanies);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cachedCompanies) {
      setCompanies(cachedCompanies);
      setLoading(false);
      return;
    }
    fetch('/data/companies.json?v=659&t=' + Date.now())
      .then(r => r.json())
      .then(data => {
        cachedCompanies = data;
        setCompanies(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { companies, loading, error };
}
