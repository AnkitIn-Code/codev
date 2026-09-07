import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProblems } from '../../hooks/useProblems';
import { useSolvedProblems } from '../../hooks/useSolvedProblems';
import { useCompanies } from '../../hooks/useCompanies';
import sheetsProblemsData from '../../data/sheetsProblems.json';
import { TOPIC_CATEGORIES, topicToSlug } from '../../data/topicGroups';
import { leetcodeUrl, difficultyClass } from '../../utils/helpers';
import './Dashboard.css';

const SHOWCASE_SHEETS = [
  {
    id: 'neetcode-250',
    title: 'NeetCode 250',
    tag: 'Flagship 2026',
    desc: 'The complete modern roadmap covering every algorithmic interview archetype.',
    icon: '🚀',
    accent: '#6366f1',
  },
  {
    id: 'blind-75',
    title: 'Blind 75',
    tag: 'Highest ROI',
    desc: 'The legendary, battle-tested 75 core LeetCode problems curated for top tech.',
    icon: '🎯',
    accent: '#ef4444',
  },
  {
    id: 'striver-sde',
    title: 'Striver SDE Sheet',
    tag: 'FAANG Classic',
    desc: 'Top 115 coding interview challenges curated specifically for SDE roles.',
    icon: '📋',
    accent: '#8b5cf6',
  },
  {
    id: 'top-interview-150',
    title: 'Top Interview 150',
    tag: 'Official Standard',
    desc: 'LeetCode’s handpicked master collection of must-solve interview questions.',
    icon: '🏆',
    accent: '#f59e0b',
  },
];

const TOP_COMPANIES = [
  { name: 'Google',        slug: 'google',        count: 2322, color: '#4285F4', initials: 'GO' },
  { name: 'Amazon',        slug: 'amazon',        count: 1986, color: '#FF9900', initials: 'AM' },
  { name: 'Microsoft',     slug: 'microsoft',     count: 1386, color: '#00A4EF', initials: 'MS' },
  { name: 'Meta',          slug: 'meta',          count: 1380, color: '#1877F2', initials: 'ME' },
  { name: 'Bloomberg',     slug: 'bloomberg',     count: 1212, color: '#0062FF', initials: 'BB' },
  { name: 'Apple',         slug: 'apple',         count: 303,  color: '#8E8E93', initials: 'AP' },
  { name: 'Uber',          slug: 'uber',          count: 620,  color: '#000000', initials: 'UB' },
  { name: 'Netflix',       slug: 'netflix',       count: 280,  color: '#E50914', initials: 'NF' },
];

const STRATEGY_TIPS = [
  {
    title: 'Two Pointers & Sliding Window',
    rule: 'N ≤ 10⁵ with subarray/pair queries',
    desc: 'Reduces brute force O(N²) to optimal O(N) by maintaining monotonic boundary conditions.',
    tag: 'Array Pattern',
  },
  {
    title: 'Binary Search On Answer Range',
    rule: 'Monotonic search space f(x)',
    desc: 'If valid(k) is monotonic, binary search over [low, high] in O(log(range) · cost).',
    tag: 'Search Pattern',
  },
  {
    title: 'Monotonic Stack / Queue',
    rule: 'Next Greater / Smaller element',
    desc: 'Keep indices sorted inside stack to answer next boundary problems in amortized O(N).',
    tag: 'Stack Pattern',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { problems = [], loading: problemsLoading } = useProblems();
  const { companies = [] } = useCompanies();
  const { isSolved, toggleSolved } = useSolvedProblems();

  // Search filter for quick company lookup
  const [companyQuery, setCompanyQuery] = useState('');

  // Daily problem state
  const [dailyIndexOverride, setDailyIndexOverride] = useState(null);

  // Compute stats
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
      totalEasy: tEasy || 958,
      totalMed: tMed || 2096,
      totalHard: tHard || 962,
    };
  }, [problems, isSolved]);

  const totalProblems = problems.length || 4023;
  const overallPercentage = Math.round((solvedCount / totalProblems) * 100);

  // Problem of the Day
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
    // Pick an unsolved problem if available
    const unsolved = problems.filter(p => !isSolved(p));
    const pool = unsolved.length > 0 ? unsolved : problems;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    if (chosen?.Slug) {
      window.open(leetcodeUrl(chosen.Slug), '_blank', 'noopener,noreferrer');
    }
  }

  // Filtered companies for quick search
  const filteredCompanies = useMemo(() => {
    const q = companyQuery.trim().toLowerCase();
    if (!q) return TOP_COMPANIES;
    const source = companies.length > 0 ? companies : TOP_COMPANIES;
    return source
      .filter(c => c.name.toLowerCase().includes(q))
      .slice(0, 8)
      .map(c => ({
        name: c.name,
        slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
        count: c.count,
        color: TOP_COMPANIES.find(tc => tc.name.toLowerCase() === c.name.toLowerCase())?.color || '#6366f1',
        initials: c.name.slice(0, 2).toUpperCase(),
      }));
  }, [companyQuery, companies]);

  return (
    <div className="dash-container">
      {/* ── 1. Top Cockpit Header & Live Stats ── */}
      <section className="dash-cockpit">
        <div className="dash-cockpit-info">
          <div className="dash-cockpit-pill">
            <span className="cockpit-pulse-dot" />
            <span>LeetCode 2026 Interview Cockpit</span>
          </div>
          <h1 className="dash-cockpit-title">
            Ship Code. <span className="text-gradient">Ace Interviews.</span>
          </h1>
          <p className="dash-cockpit-sub">
            Direct access to {totalProblems.toLocaleString()} curated problems, 659 company question archives, and battle-tested roadmaps.
          </p>

          <div className="dash-cockpit-actions">
            <Link to="/problems" className="btn btn-primary dash-action-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Practice Problems
            </Link>
            <button type="button" onClick={handleRandomProblem} className="btn btn-secondary dash-action-btn">
              <span>🎲</span> Pick Random
            </button>
            <Link to="/sheets" className="btn btn-outline dash-action-btn">
              <span>📋</span> DSA Sheets
            </Link>
          </div>
        </div>

        {/* Live Mastery Radar Card */}
        <div className="dash-mastery-card">
          <div className="mastery-header">
            <div className="mastery-title-wrap">
              <span className="mastery-icon">⚡</span>
              <div>
                <div className="mastery-title">Your Progress Center</div>
                <div className="mastery-sub">Real-time local sync</div>
              </div>
            </div>
            <div className="mastery-badge">
              <span>🔥</span> {solvedCount > 0 ? `${solvedCount} Solved` : 'Start Streak'}
            </div>
          </div>

          <div className="mastery-bar-container">
            <div className="mastery-bar-header">
              <span>Total Solved</span>
              <strong>{solvedCount} <span className="text-muted">/ {totalProblems.toLocaleString()}</span> ({overallPercentage}%)</strong>
            </div>
            <div className="mastery-progress-track">
              <div
                className="mastery-progress-fill"
                style={{ width: `${Math.min(overallPercentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="mastery-breakdown">
            <div className="breakdown-col breakdown-easy">
              <div className="breakdown-label">Easy</div>
              <div className="breakdown-value">{solvedEasy} <small>/ {totalEasy}</small></div>
              <div className="breakdown-bar">
                <div style={{ width: `${totalEasy ? (solvedEasy / totalEasy) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="breakdown-col breakdown-med">
              <div className="breakdown-label">Medium</div>
              <div className="breakdown-value">{solvedMed} <small>/ {totalMed}</small></div>
              <div className="breakdown-bar">
                <div style={{ width: `${totalMed ? (solvedMed / totalMed) * 100 : 0}%` }} />
              </div>
            </div>
            <div className="breakdown-col breakdown-hard">
              <div className="breakdown-label">Hard</div>
              <div className="breakdown-value">{solvedHard} <small>/ {totalHard}</small></div>
              <div className="breakdown-bar">
                <div style={{ width: `${totalHard ? (solvedHard / totalHard) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Two-Column Focus Hub: Problem of the Day & Quick Strategy ── */}
      <section className="dash-grid-split">
        {/* Daily Problem Spotlight */}
        <div className="dash-card dash-daily-spotlight">
          <div className="daily-badge-row">
            <span className="daily-tag">
              <span className="daily-sparkle">✨</span> Problem of the Day
            </span>
            <button
              type="button"
              className="daily-shuffle-btn"
              onClick={handleShuffleDaily}
              title="Get another problem"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Shuffle
            </button>
          </div>

          {dailyProblem ? (
            <div className="daily-content">
              <div className="daily-title-row">
                <h3 className="daily-title">
                  <span className="daily-num">#{dailyProblem['#'] || dailyProblem.id || '—'}</span> {dailyProblem.Title}
                </h3>
                <span className={`badge ${difficultyClass(dailyProblem.Difficulty)}`}>
                  {dailyProblem.Difficulty}
                </span>
              </div>

              {/* Tags and Companies */}
              <div className="daily-meta-wrap">
                {dailyProblem.CompanyList && dailyProblem.CompanyList.length > 0 && (
                  <div className="daily-meta-group">
                    <span className="meta-group-label">Asked at:</span>
                    <div className="daily-meta-chips">
                      {dailyProblem.CompanyList.slice(0, 4).map(c => (
                        <span key={c} className="company-mini-tag">🏢 {c}</span>
                      ))}
                      {dailyProblem.CompanyList.length > 4 && (
                        <span className="company-mini-extra">+{dailyProblem.CompanyList.length - 4}</span>
                      )}
                    </div>
                  </div>
                )}

                {dailyProblem.TopicTags && dailyProblem.TopicTags.length > 0 && (
                  <div className="daily-meta-group">
                    <span className="meta-group-label">Topics:</span>
                    <div className="daily-meta-chips">
                      {dailyProblem.TopicTags.slice(0, 3).map(t => (
                        <Link key={t} to={`/topics/${topicToSlug(t)}`} className="topic-mini-tag">
                          {t}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="daily-actions">
                <a
                  href={leetcodeUrl(dailyProblem.Slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary daily-solve-btn"
                >
                  Solve on LeetCode
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
                <button
                  type="button"
                  className={`btn daily-status-btn ${isSolved(dailyProblem) ? 'daily-status-btn--solved' : ''}`}
                  onClick={() => toggleSolved(dailyProblem.Slug || dailyProblem['#'])}
                >
                  {isSolved(dailyProblem) ? '✓ Solved' : '○ Mark as Solved'}
                </button>
              </div>
            </div>
          ) : (
            <div className="daily-loading">
              <div className="spinner-small" />
              <span>Fetching challenge...</span>
            </div>
          )}
        </div>

        {/* Strategy Cheat Code Card */}
        <div className="dash-card dash-strategy-card">
          <div className="strategy-header">
            <span className="strategy-icon">💡</span>
            <div>
              <h3 className="strategy-title">Interview Pattern Insights</h3>
              <p className="strategy-sub">Key intuition patterns tested in FAANG screens</p>
            </div>
          </div>

          <div className="strategy-items">
            {STRATEGY_TIPS.map((tip, i) => (
              <div key={i} className="strategy-item">
                <div className="strategy-item-top">
                  <span className="strategy-name">{tip.title}</span>
                  <span className="strategy-tag">{tip.tag}</span>
                </div>
                <div className="strategy-rule">Trigger: <code>{tip.rule}</code></div>
                <div className="strategy-desc">{tip.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Curated DSA Roadmaps (Flagship Sheets) ── */}
      <section className="dash-section">
        <div className="section-head-bar">
          <div>
            <h2 className="section-title">Curated DSA Sheets</h2>
            <p className="section-desc">Structured learning paths tested by over 500k+ software engineers</p>
          </div>
          <Link to="/sheets" className="section-link">
            View all 10 sheets →
          </Link>
        </div>

        <div className="sheets-cards-grid">
          {SHOWCASE_SHEETS.map(sheet => {
            const sheetProblems = sheetsProblemsData[sheet.id] || [];
            const sheetSolved = sheetProblems.filter(p => isSolved(p)).length;
            const sheetTotal = sheetProblems.length || 1;
            const sheetPct = Math.round((sheetSolved / sheetTotal) * 100);

            return (
              <Link key={sheet.id} to={`/sheets/${sheet.id}`} className="sheet-card-link">
                <div className="sheet-card" style={{ '--card-accent': sheet.accent }}>
                  <div className="sheet-card-top">
                    <div className="sheet-card-icon" style={{ background: `${sheet.accent}15` }}>
                      {sheet.icon}
                    </div>
                    <span className="sheet-card-pill">{sheet.tag}</span>
                  </div>

                  <h3 className="sheet-card-title">{sheet.title}</h3>
                  <p className="sheet-card-desc">{sheet.desc}</p>

                  <div className="sheet-card-progress">
                    <div className="sheet-progress-label">
                      <span>Progress</span>
                      <strong>{sheetSolved} / {sheetTotal} ({sheetPct}%)</strong>
                    </div>
                    <div className="sheet-progress-bar">
                      <div
                        className="sheet-progress-fill"
                        style={{ width: `${Math.max(sheetPct, 0)}%`, background: sheet.accent }}
                      />
                    </div>
                  </div>

                  <div className="sheet-card-footer">
                    <span>{sheetProblems.length} Problems</span>
                    <span className="sheet-card-arrow">
                      Practice →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── 4. Target Company Interview Radar ── */}
      <section className="dash-section">
        <div className="section-head-bar">
          <div>
            <h2 className="section-title">Target Company Archives</h2>
            <p className="section-desc">Direct archives of problems asked in real technical phone screens & on-sites</p>
          </div>
          <Link to="/companies" className="section-link">
            Browse all 659 companies →
          </Link>
        </div>

        {/* Company Quick Search */}
        <div className="company-search-wrap">
          <svg className="company-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="company-search-input"
            placeholder="Search company (e.g. Google, Amazon, Uber, Microsoft, Apple)..."
            value={companyQuery}
            onChange={(e) => setCompanyQuery(e.target.value)}
          />
          {companyQuery && (
            <button
              type="button"
              className="company-search-clear"
              onClick={() => setCompanyQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        <div className="companies-cards-grid">
          {filteredCompanies.map(c => (
            <Link key={c.slug} to={`/companies/${c.slug}`} className="company-card">
              <div className="company-avatar" style={{ background: c.color || '#6366f1' }}>
                {c.initials}
              </div>
              <div className="company-info">
                <div className="company-name">{c.name}</div>
                <div className="company-count">{c.count?.toLocaleString() || '100+'} questions</div>
              </div>
              <svg className="company-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 5. Core Topic Mastery Tracks ── */}
      <section className="dash-section">
        <div className="section-head-bar">
          <div>
            <h2 className="section-title">Core Algorithm Tracks</h2>
            <p className="section-desc">Organized pedagogical progression from fundamental data structures to advanced DP</p>
          </div>
          <Link to="/topics" className="section-link">
            Explore all 16 categories →
          </Link>
        </div>

        <div className="topics-tracks-grid">
          {TOPIC_CATEGORIES.slice(0, 6).map(cat => (
            <div key={cat.id} className="topic-track-card" style={{ '--cat-color': cat.color }}>
              <div className="topic-track-head">
                <span className="topic-track-icon">{cat.icon}</span>
                <div>
                  <h3 className="topic-track-title">{cat.title}</h3>
                  <div className="topic-track-count">
                    {cat.subtopics.reduce((sum, s) => sum + s.count, 0).toLocaleString()} problems
                  </div>
                </div>
              </div>

              <div className="topic-track-chips">
                {cat.subtopics.slice(0, 4).map(sub => (
                  <Link
                    key={sub.name}
                    to={`/topics/${topicToSlug(sub.name)}`}
                    className="topic-track-chip"
                  >
                    <span>{sub.name}</span>
                    <small>({sub.count})</small>
                  </Link>
                ))}
              </div>

              <div className="topic-track-footer">
                <Link to={`/topics/${topicToSlug(cat.subtopics[0].name)}`} className="topic-track-start">
                  Start Track →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
