import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import CompanyPopup from '../CompanyPopup/CompanyPopup';
import TopicPopup from '../TopicPopup/TopicPopup';
import { leetcodeUrl, difficultyClass } from '../../utils/helpers';
import { topicToSlug } from '../../data/topicGroups';
import { useSolvedProblems } from '../../hooks/useSolvedProblems';
import './ProblemTable.css';

const PAGE_SIZE = 50;

/**
 * Reusable problem table used on Problems page and Company detail page.
 * @param {Array}   problems     - filtered array of problem objects
 * @param {boolean} loading      - show loading state
 * @param {boolean} showStatus   - show status (solved) column
 */
export default function ProblemTable({ problems = [], loading = false, showStatus = true }) {
  const [page, setPage] = useState(1);
  const [popup, setPopup] = useState(null); // { title, companies }
  const [topicPopup, setTopicPopup] = useState(null); // { title, topics }
  const { isSolved, toggleSolved } = useSolvedProblems();

  const totalPages = Math.ceil(problems.length / PAGE_SIZE);
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return problems.slice(start, start + PAGE_SIZE);
  }, [problems, page]);

  function openPopup(e, problem) {
    e.stopPropagation();
    setPopup({ title: problem.Title, companies: problem.CompanyList || [] });
  }

  function openTopicPopup(e, problem) {
    e.stopPropagation();
    const topics = problem.TopicTags || problem.tags || [];
    setTopicPopup({ title: problem.Title || problem.title, topics });
  }

  if (loading) return <div className="spinner">Loading problems…</div>;

  return (
    <>
      {popup && (
        <CompanyPopup
          problemTitle={popup.title}
          companies={popup.companies}
          onClose={() => setPopup(null)}
        />
      )}

      {topicPopup && (
        <TopicPopup
          problemTitle={topicPopup.title}
          topics={topicPopup.topics}
          onClose={() => setTopicPopup(null)}
        />
      )}

      <div className="problem-table-wrap">
        <table className="problem-table">
          <thead>
            <tr>
              {showStatus && <th className="col-status">STATUS</th>}
              <th className="col-title">TITLE</th>
              <th className="col-acceptance">ACCEPTANCE</th>
              <th className="col-frequency">FREQUENCY</th>
              <th className="col-practice">PRACTICE</th>
              <th className="col-difficulty">DIFFICULTY</th>
              <th className="col-companies">COMPANIES</th>
              <th className="col-topics">TOPICS</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((problem) => (
              <ProblemRow
                key={problem['#'] || problem.id || problem.Slug}
                problem={problem}
                showStatus={showStatus}
                solved={isSolved(problem)}
                onToggleSolved={() => toggleSolved(problem.Slug || problem['#'])}
                onCompanyClick={(e) => openPopup(e, problem)}
                onTopicExtraClick={(e) => openTopicPopup(e, problem)}
              />
            ))}
          </tbody>
        </table>

        {problems.length === 0 && (
          <div className="problem-table-empty">
            <span>🔍</span>
            <p>No problems found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onChange={setPage} total={problems.length} />
      )}
    </>
  );
}

function ProblemRow({ problem, showStatus, solved, onToggleSolved, onCompanyClick, onTopicExtraClick }) {
  const num = problem['#'] || problem.id;
  const title = problem.Title || problem.title;
  const slug = problem.Slug || problem.slug || problem.title_slug;
  const difficulty = problem.Difficulty || problem.difficulty;
  const topics = problem.TopicTags || problem.tags || [];
  const companyList = problem.CompanyList || problem.companies || [];
  const companyCount = problem.CompanyCount || companyList.length;

  const firstCompany = companyList[0] || '';
  const extraCount = companyCount - 1;

  const visibleTopics = topics.slice(0, 2);
  const extraTopics = topics.length - 2;

  const acceptanceRate = problem.AcceptanceRate ?? problem.acceptance_rate ?? problem.acceptance;
  const rawFreq = problem.Frequency != null ? parseFloat(problem.Frequency) : (companyCount ? Math.min(100, Math.round((companyCount / 127) * 100)) : 8);
  const freq = isNaN(rawFreq) ? 8 : rawFreq;

  return (
    <tr className="problem-row">
      {showStatus && (
        <td className="col-status">
          <button
            type="button"
            className={`status-circle-btn ${solved ? 'status-circle-btn--solved' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSolved?.();
            }}
            title={solved ? 'Mark as unsolved' : 'Mark as solved'}
            aria-label={solved ? 'Solved' : 'Not solved'}
          >
            {solved && (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        </td>
      )}
      <td className="col-title">
        <span className="problem-num">{num}.</span>
        <a
          href={leetcodeUrl(slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="problem-title-link"
        >
          {title}
        </a>
      </td>
      <td className="col-acceptance">
        <span className="acceptance-rate-text">
          {acceptanceRate != null ? `${Number(acceptanceRate).toFixed(1)}%` : '—'}
        </span>
      </td>
      <td className="col-frequency">
        <div className="freq-bar-wrap" title={`Frequency: ${freq.toFixed(1)}%`}>
          <div className="freq-bar-track">
            <div
              className="freq-bar-fill"
              style={{
                width: `${Math.min(Math.max(freq, 6), 100)}%`,
                background: freq >= 75 ? '#ef4444' : freq >= 45 ? '#f59e0b' : '#3b82f6'
              }}
            />
          </div>
          <span className="freq-rate-text">{freq.toFixed(0)}%</span>
        </div>
      </td>
      <td className="col-practice">
        <a
          href={leetcodeUrl(slug)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-solve"
        >
          Solve
        </a>
      </td>
      <td className="col-difficulty">
        <span className={`badge ${difficultyClass(difficulty)}`}>{difficulty}</span>
      </td>
      <td className="col-companies">
        {companyCount > 0 ? (
          <button className="company-tag-btn" onClick={onCompanyClick}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="company-icon">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="company-tag-name">{firstCompany}</span>
            {extraCount > 0 && <span className="company-tag-extra">+{extraCount}</span>}
          </button>
        ) : (
          <span className="text-muted" style={{ fontSize: 12 }}>—</span>
        )}
      </td>
      <td className="col-topics">
        <div className="topic-tags">
          {visibleTopics.map(t => (
            <Link
              key={t}
              to={`/topics/${topicToSlug(t)}`}
              className="tag tag-link"
              onClick={e => e.stopPropagation()}
            >
              {t}
            </Link>
          ))}
          {extraTopics > 0 && (
            <button
              type="button"
              className="tag tag-extra tag-extra-btn"
              onClick={onTopicExtraClick}
              title={`View all ${topics.length} topics`}
              aria-label={`View all ${topics.length} topics`}
            >
              +{extraTopics}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function Pagination({ page, totalPages, onChange, total }) {
  const pages = getPaginationRange(page, totalPages);

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE, total)} of {total.toLocaleString()} problems
      </span>
      <div className="pagination-controls">
        <button
          className="page-btn"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          ‹
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
          ) : (
            <button
              key={p}
              className={`page-btn ${p === page ? 'page-btn--active' : ''}`}
              onClick={() => onChange(p)}
            >
              {p}
            </button>
          )
        )}
        <button
          className="page-btn"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
}

function getPaginationRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total-4, total-3, total-2, total-1, total];
  return [1, '…', current-1, current, current+1, '…', total];
}
