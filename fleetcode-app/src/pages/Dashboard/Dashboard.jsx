import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProblems } from '../../hooks/useProblems';
import { useSolvedProblems } from '../../hooks/useSolvedProblems';
import sheetsProblemsData from '../../data/sheetsProblems.json';
import { topicToSlug } from '../../data/topicGroups';
import { leetcodeUrl, difficultyClass } from '../../utils/helpers';
import './Dashboard.css';

const FEATURED_SHEETS = [
  { id: 'neetcode-250', title: 'NeetCode 250', tag: 'Flagship', icon: '🚀' },
  { id: 'blind-75', title: 'Blind 75', tag: 'Highest ROI', icon: '🎯' },
  { id: 'striver-sde', title: 'Striver SDE Sheet', tag: 'FAANG Classic', icon: '📋' },
  { id: 'top-interview-150', title: 'Top Interview 150', tag: 'Standard', icon: '🏆' },
];

const TOP_COMPANIES = [
  { name: 'Google',    slug: 'google',    count: '2,325', color: '#4285F4' },
  { name: 'Amazon',    slug: 'amazon',    count: '1,986', color: '#FF9900' },
  { name: 'Microsoft', slug: 'microsoft', count: '1,386', color: '#00A4EF' },
  { name: 'Meta',      slug: 'meta',      count: '1,380', color: '#1877F2' },
  { name: 'Bloomberg', slug: 'bloomberg', count: '1,212', color: '#0062FF' },
  { name: 'Apple',     slug: 'apple',     count: '303',   color: '#8E8E93' },
  { name: 'Uber',      slug: 'uber',      count: '620',   color: '#111827' },
  { name: 'Netflix',   slug: 'netflix',   count: '280',   color: '#E50914' },
];

export default function Dashboard() {
  const { problems = [] } = useProblems();
  const { isSolved, toggleSolved } = useSolvedProblems();
  const [dailyIndexOverride, setDailyIndexOverride] = useState(null);

  // Stats calculation
  const { solvedCount, solvedEasy, solvedMed, solvedHard, totalEasy, totalMed, totalHard } = useMemo(() => {
    let sCount = 0;
    let sEasy = 0;
    let sMed = 0;
    let sHard = 0;
    let tEasy = 0;
    let tMed = 0;
    let tHard = 0;

    for (let i = 0; i < problems.length; i++) {
      const p = problems[i];
      const diff = (p.Difficulty || '').toLowerCase();
      if (diff === 'easy') tEasy++;
      else if (diff === 'medium') tMed++;
      else if (diff === 'hard') tHard++;

      if (isSolved(p)) {
        sCount++;
        if (diff === 'easy') sEasy++;
        else if (diff === 'medium') sMed++;
        else if (diff === 'hard') sHard++;
      }
    }

    return {
      solvedCount: sCount,
      solvedEasy: sEasy,
      solvedMed: sMed,
      solvedHard: sHard,
      totalEasy: tEasy || 959,
      totalMed: tMed || 2101,
      totalHard: tHard || 963,
    };
  }, [problems, isSolved]);

  const totalProblems = problems.length || 4023;
  const overallPercentage = totalProblems > 0 ? ((solvedCount / totalProblems) * 100).toFixed(1) : 0;

  // Daily problem
  const dailyProblem = useMemo(() => {
    if (!problems.length) return null;
    if (dailyIndexOverride !== null && problems[dailyIndexOverride]) {
      return problems[dailyIndexOverride];
    }
    const d = new Date();
    const daySeed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    return problems[daySeed % problems.length];
  }, [problems, dailyIndexOverride]);

  function handleShuffleDaily() {
    if (!problems.length) return;
    const randomIndex = Math.floor(Math.random() * problems.length);
    setDailyIndexOverride(randomIndex);
  }

  function handleRandomProblem() {
    if (!problems.length) return;
    const unsolved = problems.filter(p => !isSolved(p));
    const pool = unsolved.length > 0 ? unsolved : problems;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    if (chosen?.Slug) {
      window.open(leetcodeUrl(chosen.Slug), '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div className="dash-container">
      {/* ── 1. Minimal Header ── */}
      <header className="dash-header">
        <div className="dash-header-left">
          <div className="dash-badge">
            <span className="dash-dot" /> FleetCode 2026
          </div>
          <h1 className="dash-title">Dashboard</h1>
          <p className="dash-subtitle">
            {totalProblems.toLocaleString()} problems &middot; 659 companies &middot; 10 curated sheets
          </p>
        </div>
        <div className="dash-header-actions">
          <button type="button" onClick={handleRandomProblem} className="btn btn-outline dash-btn-random">
            🎲 Pick Random
          </button>
          <Link to="/problems" className="btn btn-primary dash-btn-practice">
            Practice Problems →
          </Link>
        </div>
      </header>

      {/* ── 2. Minimal Metrics Grid ── */}
      <div className="dash-metrics-grid">
        <div className="dash-metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Solved</span>
            <span className="metric-badge">{overallPercentage}%</span>
          </div>
          <div className="metric-number">
            {solvedCount} <span className="metric-sub">/ {totalProblems.toLocaleString()}</span>
          </div>
          <div className="metric-progress-track">
            <div className="metric-progress-bar bar-total" style={{ width: `${Math.max(solvedCount ? 2 : 0, overallPercentage)}%` }} />
          </div>
        </div>

        <div className="dash-metric-card">
          <div className="metric-header">
            <span className="metric-label">Easy</span>
            <span className="metric-diff-tag tag-easy">Easy</span>
          </div>
          <div className="metric-number">
            {solvedEasy} <span className="metric-sub">/ {totalEasy}</span>
          </div>
          <div className="metric-progress-track">
            <div className="metric-progress-bar bar-easy" style={{ width: `${totalEasy ? (solvedEasy / totalEasy) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="dash-metric-card">
          <div className="metric-header">
            <span className="metric-label">Medium</span>
            <span className="metric-diff-tag tag-medium">Medium</span>
          </div>
          <div className="metric-number">
            {solvedMed} <span className="metric-sub">/ {totalMed}</span>
          </div>
          <div className="metric-progress-track">
            <div className="metric-progress-bar bar-medium" style={{ width: `${totalMed ? (solvedMed / totalMed) * 100 : 0}%` }} />
          </div>
        </div>

        <div className="dash-metric-card">
          <div className="metric-header">
            <span className="metric-label">Hard</span>
            <span className="metric-diff-tag tag-hard">Hard</span>
          </div>
          <div className="metric-number">
            {solvedHard} <span className="metric-sub">/ {totalHard}</span>
          </div>
          <div className="metric-progress-track">
            <div className="metric-progress-bar bar-hard" style={{ width: `${totalHard ? (solvedHard / totalHard) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {/* ── 3. Main Split: Daily Problem & Top Sheets ── */}
      <div className="dash-main-split">
        {/* Daily Problem Card */}
        <div className="dash-daily-card">
          <div className="daily-card-top">
            <div className="daily-badge-wrap">
              <span className="daily-sparkle">✨</span>
              <span className="daily-badge-label">Problem of the Day</span>
            </div>
            <button
              type="button"
              className="daily-shuffle-btn"
              onClick={handleShuffleDaily}
              title="Shuffle problem"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Shuffle
            </button>
          </div>

          {dailyProblem ? (
            <div className="daily-body">
              <div className="daily-header-row">
                <h2 className="daily-title">
                  <span className="daily-num">#{dailyProblem['#'] || dailyProblem.id}.</span> {dailyProblem.Title}
                </h2>
                <span className={`badge ${difficultyClass(dailyProblem.Difficulty)}`}>
                  {dailyProblem.Difficulty}
                </span>
              </div>

              <div className="daily-tags-wrap">
                {dailyProblem.CompanyList && dailyProblem.CompanyList.length > 0 && (
                  <div className="daily-tag-group">
                    <span className="daily-tag-label">Companies:</span>
                    <div className="daily-chips">
                      {dailyProblem.CompanyList.slice(0, 4).map(c => (
                        <span key={c} className="daily-chip company-chip">
                          {c}
                        </span>
                      ))}
                      {dailyProblem.CompanyList.length > 4 && (
                        <span className="daily-chip-more">+{dailyProblem.CompanyList.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}

                {dailyProblem.TopicTags && dailyProblem.TopicTags.length > 0 && (
                  <div className="daily-tag-group">
                    <span className="daily-tag-label">Topics:</span>
                    <div className="daily-chips">
                      {dailyProblem.TopicTags.slice(0, 3).map(t => (
                        <Link key={t} to={`/topics/${topicToSlug(t)}`} className="daily-chip topic-chip">
                          {t}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="daily-actions-row">
                <a
                  href={leetcodeUrl(dailyProblem.Slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary daily-solve-btn"
                >
                  Solve on LeetCode ↗
                </a>
                <button
                  type="button"
                  className={`btn daily-status-toggle ${isSolved(dailyProblem) ? 'daily-status--solved' : ''}`}
                  onClick={() => toggleSolved(dailyProblem.Slug || dailyProblem['#'])}
                >
                  {isSolved(dailyProblem) ? '✓ Solved' : 'Mark as Solved'}
                </button>
              </div>
            </div>
          ) : (
            <div className="daily-loading">Loading challenge...</div>
          )}
        </div>

        {/* Featured Sheets Card */}
        <div className="dash-sheets-card">
          <div className="sheets-card-top">
            <h3 className="sheets-card-title">Curated Sheets</h3>
            <Link to="/sheets" className="sheets-view-all">
              All 10 Sheets →
            </Link>
          </div>

          <div className="sheets-list">
            {FEATURED_SHEETS.map(sheet => {
              const list = sheetsProblemsData[sheet.id] || [];
              const solved = list.filter(p => isSolved(p)).length;
              const total = list.length || 1;
              const pct = Math.round((solved / total) * 100);

              return (
                <Link key={sheet.id} to={`/sheets/${sheet.id}`} className="sheet-row-item">
                  <div className="sheet-row-icon">{sheet.icon}</div>
                  <div className="sheet-row-main">
                    <div className="sheet-row-title-wrap">
                      <span className="sheet-row-title">{sheet.title}</span>
                      <span className="sheet-row-tag">{sheet.tag}</span>
                    </div>
                    <div className="sheet-row-progress-wrap">
                      <div className="sheet-row-track">
                        <div className="sheet-row-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="sheet-row-count">{solved}/{total}</span>
                    </div>
                  </div>
                  <span className="sheet-row-arrow">›</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 4. Minimal Target Companies Shortcuts ── */}
      <div className="dash-companies-strip">
        <div className="companies-strip-top">
          <h3 className="companies-strip-title">Target Company Archives</h3>
          <Link to="/companies" className="companies-view-all">
            Browse all 659 companies →
          </Link>
        </div>

        <div className="companies-pills-row">
          {TOP_COMPANIES.map(c => (
            <Link key={c.slug} to={`/companies/${c.slug}`} className="company-pill">
              <span className="company-pill-dot" style={{ background: c.color }} />
              <span className="company-pill-name">{c.name}</span>
              <span className="company-pill-count">{c.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
