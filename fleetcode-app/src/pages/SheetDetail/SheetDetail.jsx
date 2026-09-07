import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProblemTable from '../../components/ProblemTable/ProblemTable';
import { useProblems } from '../../hooks/useProblems';
import { useSolvedProblems } from '../../hooks/useSolvedProblems';
import { getSheetById, SHEETS_DATA } from '../../data/sheetsData';
import { leetcodeUrl } from '../../utils/helpers';
import sheetsProblemsData from '../../data/sheetsProblems.json';
import './SheetDetail.css';

export default function SheetDetail() {
  const { id } = useParams();
  const { problems, loading: pLoading } = useProblems();
  const { solved, isSolved } = useSolvedProblems();

  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');
  const [isFollowed, setIsFollowed] = useState(false);
  const [toast, setToast] = useState('');

  // Find sheet metadata
  const sheet = useMemo(() => {
    let s = getSheetById(id);
    if (!s && id === 'striver-sde-sheet') s = getSheetById('striver-sde');
    if (!s && id === 'striver-sde') s = getSheetById('striver-sde-sheet');
    if (!s) {
      // Look in custom sheets
      const all = [...SHEETS_DATA.official, ...SHEETS_DATA.community];
      s = all.find(item => item.id.toLowerCase() === id.toLowerCase());
    }
    return s || {
      id,
      title: id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      description: 'Curated list of coding interview practice problems.',
      problems: 0,
      followers: 10,
    };
  }, [id]);

  // Toast helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // Map sheet problems
  const sheetProblems = useMemo(() => {
    if (!problems.length) return [];

    // 1. Check if we have pre-scraped sheet problems from talentd.in
    const scrapedList = sheetsProblemsData[id] || sheetsProblemsData[id.toLowerCase()];
    if (scrapedList && scrapedList.length > 0) {
      const pBySlug = new Map(problems.map(p => [p.Slug, p]));
      const pById = new Map(problems.map(p => [p['#'], p]));

      return scrapedList.map((item, idx) => {
        const fullProb = pBySlug.get(item.slug) || pById.get(item.id);
        if (fullProb) {
          return fullProb;
        }
        // Fallback to item itself formatted
        return {
          '#': item.id || idx + 1,
          Title: item.title,
          Slug: item.slug,
          Difficulty: item.difficulty || 'Medium',
          TopicTags: item.tags || [],
          CompanyList: [],
          CompanyCount: 0,
        };
      });
    }

    // 2. Check if sheet has curated slug set
    if (sheet.slugs) {
      return problems.filter(p => sheet.slugs.has(p.Slug));
    }

    // 3. Check if company filter
    if (sheet.companyFilter) {
      return problems.filter(p =>
        (p.CompanyList || []).some(c => c.toLowerCase() === sheet.companyFilter.toLowerCase())
      );
    }

    // 4. Default: first N problems
    const limit = sheet.problems || sheet.useFirst || 75;
    return problems.slice(0, limit);
  }, [id, sheet, problems]);

  // Filter by difficulty and search
  const filteredProblems = useMemo(() => {
    let list = sheetProblems;
    if (difficulty) {
      list = list.filter(p => (p.Difficulty || '').toLowerCase() === difficulty.toLowerCase());
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => (p.Title || p.title || '').toLowerCase().includes(q));
    }
    return list;
  }, [sheetProblems, difficulty, search]);

  // Difficulty totals
  const totalCount = sheetProblems.length;
  const easyTotal = sheetProblems.filter(p => (p.Difficulty || '').toLowerCase() === 'easy').length;
  const medTotal  = sheetProblems.filter(p => (p.Difficulty || '').toLowerCase() === 'medium').length;
  const hardTotal = sheetProblems.filter(p => (p.Difficulty || '').toLowerCase() === 'hard').length;

  // Solved counts
  const solvedCount = sheetProblems.filter(p => isSolved(p)).length;
  const easySolved  = sheetProblems.filter(p => (p.Difficulty || '').toLowerCase() === 'easy' && isSolved(p)).length;
  const medSolved   = sheetProblems.filter(p => (p.Difficulty || '').toLowerCase() === 'medium' && isSolved(p)).length;
  const hardSolved  = sheetProblems.filter(p => (p.Difficulty || '').toLowerCase() === 'hard' && isSolved(p)).length;

  const leftCount = Math.max(0, totalCount - solvedCount);
  const progressPct = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;
  const easyPct = easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0;
  const medPct  = medTotal > 0 ? Math.round((medSolved / medTotal) * 100) : 0;
  const hardPct = hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0;

  // First unsolved problem for Practice button
  const nextUnsolvedProblem = sheetProblems.find(p => !isSolved(p)) || sheetProblems[0];

  const handlePractice = () => {
    if (nextUnsolvedProblem) {
      const slug = nextUnsolvedProblem.Slug || nextUnsolvedProblem.slug || nextUnsolvedProblem.title_slug;
      window.open(leetcodeUrl(slug), '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Sheet link copied to clipboard!');
  };

  const handleClone = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Sheet cloned to your library!');
  };

  const toggleFollow = () => {
    setIsFollowed(prev => !prev);
    showToast(!isFollowed ? 'Followed sheet!' : 'Unfollowed sheet');
  };

  const isOfficial = SHEETS_DATA.official.some(s => s.id === sheet.id || s.id === id);

  return (
    <div className="sheet-detail-page">
      {/* Toast Notification */}
      {toast && <div className="sd-toast">{toast}</div>}

      {/* Hero Banner with Breadcrumbs & Progress */}
      <div className="sd-hero-banner">
        <div className="sd-hero-container">
          <div className="sd-hero-left">
            {/* Breadcrumbs */}
            <nav className="sd-breadcrumbs">
              <Link to="/sheets">Sheets</Link>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              <span className="sd-crumb-active">{sheet.title}</span>
              <span className={`sd-badge-tag ${isOfficial ? 'sd-badge-official' : 'sd-badge-community'}`}>
                {isOfficial ? 'Official' : 'Community'}
              </span>
            </nav>

            <h1 className="sd-sheet-title">{sheet.title}</h1>
            <p className="sd-sheet-desc">{sheet.description}</p>

            {/* Author & Problem Stats Row */}
            <div className="sd-sheet-meta-row">
              <span className="sd-meta-author">FleetCode Curators</span>
              <span className="sd-meta-dot">·</span>
              <span className="sd-meta-count">{totalCount} problems</span>
              <span className="sd-meta-dot">·</span>
              <span className="sd-meta-easy">{easyTotal} Easy</span>
              <span className="sd-meta-dot">·</span>
              <span className="sd-meta-med">{medTotal} Med</span>
              <span className="sd-meta-dot">·</span>
              <span className="sd-meta-hard">{hardTotal} Hard</span>
            </div>

            {/* Action Buttons */}
            <div className="sd-action-row">
              <button className="sd-btn-practice" onClick={handlePractice}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Practice
              </button>

              <button
                className={`sd-btn-action ${isFollowed ? 'sd-btn-followed' : ''}`}
                onClick={toggleFollow}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={isFollowed ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                {isFollowed ? 'Following' : 'Follow'}
                <span className="sd-btn-count">{(sheet.followers || 20) + (isFollowed ? 1 : 0)}</span>
              </button>

              <button className="sd-btn-action" onClick={handleClone}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                Clone
              </button>

              <button className="sd-btn-action sd-btn-icon-only" onClick={handleShare} title="Share sheet">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="18" cy="5" r="3"/>
                  <circle cx="6" cy="12" r="3"/>
                  <circle cx="18" cy="19" r="3"/>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Progress Card */}
          <div className="sd-progress-card">
            <div className="sd-progress-header">
              <span className="sd-progress-label">Progress</span>
              <span className="sd-progress-pct">{progressPct}%</span>
            </div>
            <div className="sd-progress-track">
              <div className="sd-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="sd-progress-sub">
              <span><strong>{solvedCount}</strong> solved</span>
              <span><strong>{leftCount}</strong> left</span>
            </div>

            <div className="sd-progress-bars">
              <div className="sd-pbar-row">
                <span className="sd-pbar-lbl sd-pbar-easy">Easy</span>
                <div className="sd-pbar-track">
                  <div className="sd-pbar-fill sd-pbar-fill-easy" style={{ width: `${easyPct}%` }} />
                </div>
                <span className="sd-pbar-val">{easySolved}/{easyTotal}</span>
              </div>
              <div className="sd-pbar-row">
                <span className="sd-pbar-lbl sd-pbar-med">Medium</span>
                <div className="sd-pbar-track">
                  <div className="sd-pbar-fill sd-pbar-fill-med" style={{ width: `${medPct}%` }} />
                </div>
                <span className="sd-pbar-val">{medSolved}/{medTotal}</span>
              </div>
              <div className="sd-pbar-row">
                <span className="sd-pbar-lbl sd-pbar-hard">Hard</span>
                <div className="sd-pbar-track">
                  <div className="sd-pbar-fill sd-pbar-fill-hard" style={{ width: `${hardPct}%` }} />
                </div>
                <span className="sd-pbar-val">{hardSolved}/{hardTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="sd-content">
        {/* Filter controls row */}
        <div className="sd-filter-row">
          <div className="sd-diff-tabs">
            <button
              className={`sd-diff-tab ${difficulty === '' ? 'sd-diff-tab--active' : ''}`}
              onClick={() => setDifficulty('')}
            >
              All ({totalCount})
            </button>
            <button
              className={`sd-diff-tab ${difficulty === 'Easy' ? 'sd-diff-tab--active' : ''}`}
              onClick={() => setDifficulty(d => d === 'Easy' ? '' : 'Easy')}
            >
              Easy ({easyTotal})
            </button>
            <button
              className={`sd-diff-tab ${difficulty === 'Medium' ? 'sd-diff-tab--active' : ''}`}
              onClick={() => setDifficulty(d => d === 'Medium' ? '' : 'Medium')}
            >
              Medium ({medTotal})
            </button>
            <button
              className={`sd-diff-tab ${difficulty === 'Hard' ? 'sd-diff-tab--active' : ''}`}
              onClick={() => setDifficulty(d => d === 'Hard' ? '' : 'Hard')}
            >
              Hard ({hardTotal})
            </button>
          </div>

          <div className="sd-search-controls">
            <div className="sd-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sd-search-icon">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                className="sd-search-input"
                placeholder="Search problems..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className="sd-btn-practice-inline" onClick={handlePractice}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Practice
            </button>
          </div>
        </div>

        {/* Problems Table */}
        <div className="sd-table-card">
          <ProblemTable problems={filteredProblems} loading={pLoading} showStatus={true} />
        </div>
      </div>
    </div>
  );
}
