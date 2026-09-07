import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCompanies } from '../../hooks/useCompanies';
import { companyToSlug } from '../../utils/helpers';
import CompanyAvatar from '../../components/CompanyAvatar/CompanyAvatar';
import './Companies.css';

const POPULAR_COMPANIES = [
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Apple', 'Uber',
  'Bloomberg', 'Goldman Sachs', 'Adobe', 'TCS', 'Infosys', 'Salesforce',
];

const FEATURED_INTERVIEWS = [
  { name: 'Google',       desc: 'Graph algorithms, DP, system design' },
  { name: 'Amazon',       desc: 'Arrays, BFS/DFS, OOP design' },
  { name: 'Microsoft',    desc: 'Data structures, algorithms, problem-solving' },
  { name: 'Meta',         desc: 'Graphs, strings, optimization' },
  { name: 'Apple',        desc: 'Clean code, efficiency, linked lists' },
  { name: 'Goldman Sachs',desc: 'Math, DP, greedy algorithms' },
  { name: 'Adobe',        desc: 'Trees, recursion, backtracking' },
  { name: 'Uber',         desc: 'Graphs, BFS, design problems' },
  { name: 'Bloomberg',    desc: 'Stacks, queues, hash maps' },
];

const PAGE_SIZE = 40;

function getPaginationRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total-4, total-3, total-2, total-1, total];
  return [1, '…', current-1, current, current+1, '…', total];
}

export default function Companies() {
  const { companies, loading } = useCompanies();
  const [search, setSearch]   = useState('');
  const [sort, setSort]       = useState('count'); // 'count' | 'name'
  const [page, setPage]       = useState(1);

  const popularData = useMemo(() => {
    return POPULAR_COMPANIES.map(name => {
      const c = companies.find(x => x.name.toLowerCase() === name.toLowerCase());
      return c ? { name: c.name, count: c.count } : { name, count: 0 };
    });
  }, [companies]);

  const filtered = useMemo(() => {
    let list = companies;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q));
    }
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [companies, search, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const totalMappings = useMemo(() => companies.reduce((s, c) => s + c.count, 0), [companies]);

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setPage(1);
  }

  function handleSortChange(e) {
    setSort(e.target.value);
    setPage(1);
  }

  function scrollToCompanies() {
    const el = document.getElementById('companies-list-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  if (loading) return <div className="spinner" style={{ paddingTop: 100 }}>Loading companies…</div>;

  const pages = getPaginationRange(page, totalPages);

  return (
    <div className="companies-page">
      {/* Breadcrumb */}
      <div className="companies-breadcrumb">
        <Link to="/">FleetCode</Link>
        <span className="sep">›</span>
        <span>Companies</span>
      </div>

      {/* Header */}
      <div className="companies-header">
        <div>
          <h1>Company-wise Interview Questions</h1>
          <p>Practice coding problems asked in real interviews at {companies.length}+ companies.<br />
             Pick a company to see their most frequently asked questions.</p>
        </div>
        <div className="companies-stats-row">
          <div className="companies-stat">
            <span className="stat-num">{companies.length}+</span>
            <span className="stat-label">Companies</span>
          </div>
          <div className="companies-stat-divider" />
          <div className="companies-stat">
            <span className="stat-num">{totalMappings.toLocaleString()}+</span>
            <span className="stat-label">Question Mappings</span>
          </div>
          <div className="companies-stat-divider" />
          <div className="companies-stat">
            <span className="stat-num">3,500+</span>
            <span className="stat-label">Unique Problems</span>
          </div>
        </div>
      </div>

      {/* Popular Companies */}
      <div className="companies-section">
        <h2 className="companies-section-title">Popular Companies</h2>
        <div className="popular-grid">
          {popularData.map(c => (
            <Link
              key={c.name}
              to={`/companies/${companyToSlug(c.name)}`}
              className="popular-card"
            >
              <CompanyAvatar name={c.name} size={38} />
              <div>
                <div className="popular-name">{c.name}</div>
                <div className="popular-count">{c.count.toLocaleString()} problems</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* How to prepare */}
      <div className="companies-how-to">
        <h2>How to Prepare for Company-Specific Coding Interviews</h2>
        <p>
          Each tech company has patterns in the coding problems they ask during interviews. By studying company-specific
          questions, you can focus on the topics and problem types that matter most for your target company.
          FleetCode tracks which problems are asked at {companies.length}+ companies, updated regularly from real interview data.
        </p>
        <p>
          Start by selecting a company above. Focus on the most frequently asked problems first, then work through problems
          by difficulty — Easy to build confidence, Medium for core preparation, and Hard for competitive edge.
        </p>
      </div>

      {/* Top company interview links */}
      <div className="companies-section">
        <h2 className="companies-section-title">Top Company Interview Questions</h2>
        <div className="featured-grid">
          {FEATURED_INTERVIEWS.map(c => (
            <Link key={c.name} to={`/companies/${companyToSlug(c.name)}`} className="featured-link">
              <CompanyAvatar name={c.name} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="featured-name">{c.name} Interview Questions</div>
                <div className="featured-desc">{c.desc}</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Full list with Pagination */}
      <div className="companies-section" id="companies-list-section">
        <h2 className="companies-section-title">All {companies.length} Companies</h2>
        <div className="companies-search-bar">
          <div className="companies-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)'}}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search 650+ companies (e.g. Google, Databricks, Uber)..."
              value={search}
              onChange={handleSearchChange}
              className="companies-search-input"
            />
            {search && (
              <button
                type="button"
                className="companies-search-clear"
                onClick={() => { setSearch(''); setPage(1); }}
              >
                ✕
              </button>
            )}
          </div>
          <select className="filter-select" value={sort} onChange={handleSortChange}>
            <option value="count">Most questions</option>
            <option value="name">A → Z</option>
          </select>
        </div>

        <div className="companies-list-header">
          <span>Found {filtered.length} {filtered.length === 1 ? 'company' : 'companies'} {search && `matching "${search}"`}</span>
          {totalPages > 1 && (
            <span className="companies-page-counter">Page {page} of {totalPages}</span>
          )}
        </div>

        <div className="companies-list">
          <div className="companies-list-cols">
            <span>Company</span>
            <span>Problems</span>
          </div>
          {paginated.map(c => (
            <Link
              key={c.name}
              to={`/companies/${companyToSlug(c.name)}`}
              className="company-list-row"
            >
              <div className="company-list-left">
                <CompanyAvatar name={c.name} size={30} />
                <span className="company-list-name">{c.name}</span>
              </div>
              <div className="company-list-right">
                <span className="company-list-count">{c.count.toLocaleString()}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="company-list-arrow">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            </Link>
          ))}

          {paginated.length === 0 && (
            <div className="companies-empty">
              <span>🔍</span>
              <p>No companies found matching "{search}"</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination companies-pagination">
            <span className="pagination-info">
              Showing {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()} companies
            </span>
            <div className="pagination-controls">
              <button
                type="button"
                className="page-btn"
                disabled={page === 1}
                onClick={() => {
                  setPage(p => Math.max(1, p - 1));
                  scrollToCompanies();
                }}
                aria-label="Previous page"
              >
                ‹
              </button>
              {pages.map((p, i) =>
                p === '…' ? (
                  <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    className={`page-btn ${p === page ? 'page-btn--active' : ''}`}
                    onClick={() => {
                      setPage(p);
                      scrollToCompanies();
                    }}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                type="button"
                className="page-btn"
                disabled={page === totalPages}
                onClick={() => {
                  setPage(p => Math.min(totalPages, p + 1));
                  scrollToCompanies();
                }}
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
