import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import ProblemTable from '../../components/ProblemTable/ProblemTable';
import CompanyAvatar from '../../components/CompanyAvatar/CompanyAvatar';
import { useProblems } from '../../hooks/useProblems';
import { useCompanies } from '../../hooks/useCompanies';
import { slugToDisplayName } from '../../utils/helpers';
import './CompanyDetail.css';

export default function CompanyDetail() {
  const { slug } = useParams();
  const { problems, loading: pLoading } = useProblems();
  const { companies, loading: cLoading } = useCompanies();

  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');

  // Find matching company (slug → name)
  const company = useMemo(() => {
    if (!companies.length) return null;
    return companies.find(c => {
      const cSlug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return cSlug === slug;
    });
  }, [companies, slug]);

  const companyName = company?.name || slugToDisplayName(slug);

  // Company problems: only problems where this company is listed
  const companyProblems = useMemo(() => {
    if (!company) return [];
    return problems.filter(p =>
      (p.CompanyList || []).some(c => c.toLowerCase() === companyName.toLowerCase())
    );
  }, [problems, company, companyName]);

  // Filter
  const filtered = useMemo(() => {
    let list = companyProblems;
    if (difficulty) list = list.filter(p => p.Difficulty === difficulty);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.Title?.toLowerCase().includes(q));
    }
    return list;
  }, [companyProblems, difficulty, search]);

  const loading = pLoading || cLoading;

  const easyCnt   = companyProblems.filter(p => p.Difficulty === 'Easy').length;
  const medCnt    = companyProblems.filter(p => p.Difficulty === 'Medium').length;
  const hardCnt   = companyProblems.filter(p => p.Difficulty === 'Hard').length;

  return (
    <div className="cd-page">
      {/* Back */}
      <div className="cd-back">
        <Link to="/companies">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Companies
        </Link>
      </div>

      {/* Hero */}
      <div className="cd-hero">
        <CompanyAvatar name={companyName} size={52} />
        <div className="cd-hero-text">
          <h1>{companyName} Interview Questions ({companyProblems.length})</h1>
          <p>Practice real interview problems from {companyName}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="cd-filters">
        {/* Difficulty pills */}
        <div className="cd-diff-pills">
          {[
            { label: 'All', value: '', count: companyProblems.length },
            { label: 'Easy', value: 'Easy', count: easyCnt },
            { label: 'Medium', value: 'Medium', count: medCnt },
            { label: 'Hard', value: 'Hard', count: hardCnt },
          ].map(d => (
            <button
              key={d.value}
              className={`cd-diff-pill ${difficulty === d.value ? 'cd-diff-pill--active' : ''}`}
              data-diff={d.value || 'all'}
              onClick={() => setDifficulty(d.value)}
            >
              {d.label} <span className="cd-pill-count">{d.count}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="cd-search-wrap">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="cd-search"
            placeholder={`Search ${companyName} problems`}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" style={{ marginLeft: 8 }}>Search</button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="spinner">Loading problems…</div>
      ) : !company ? (
        <div className="cd-not-found">
          <p>Company "<strong>{companyName}</strong>" not found in our database.</p>
          <Link to="/companies" className="btn btn-primary" style={{ marginTop: 16 }}>← Back to Companies</Link>
        </div>
      ) : (
        <ProblemTable problems={filtered} loading={false} />
      )}
    </div>
  );
}
