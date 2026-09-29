import { useState, useMemo, useEffect, useRef } from 'react';
import { CODEX_PROBLEMS, CODEX_CATEGORIES } from '../../../data/practice/codexData.js';
import { useTheme } from '../../../context/ThemeContext';
import './CodexTab.css';

/* ─── LocalStorage Keys ─────────────────────────────────────────────────── */
const LS_SOLVED_KEY = 'embers_codex_solved_v1';
const LS_STARRED_KEY = 'embers_codex_starred_v1';
const LS_SIDEBAR_KEY = 'embers_codex_sidebar_v1';

/* ─── Difficulty Order for Sorting ─────────────────────────────────────── */
const DIFF_WEIGHT = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

/* ─── SVG Icons ─────────────────────────────────────────────────────────── */
const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const StarIcon = ({ filled }) => (
  <svg
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill={filled ? '#f59e0b' : 'none'}
    stroke={filled ? '#f59e0b' : 'currentColor'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const FunnelIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const ResetIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#ef4743" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const MaximizeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const MinimizeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

/* ─── Switch Component ──────────────────────────────────────────────────── */
function Switch({ checked, onChange, activeColor = 'bg-[#2cbb5d]' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`embers-switch ${checked ? `embers-switch--on ${activeColor}` : ''}`}
    >
      <span className="embers-switch-thumb" />
    </button>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
export default function CodexTab() {
  const { theme, toggleTheme } = useTheme();

  // State: Solved & Starred stored in localStorage
  const [solvedMap, setSolvedMap] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_SOLVED_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [starredMap, setStarredMap] = useState(() => {
    try {
      const saved = localStorage.getItem(LS_STARRED_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // State: UI toggles
  const [selectedCategory, setSelectedCategory] = useState(null); // null = "All Topics"
  const [searchQuery, setSearchQuery] = useState('');
  const [hideSolved, setHideSolved] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [leetCodeOnly, setLeetCodeOnly] = useState(false);
  const [interviewMode, setInterviewMode] = useState(false);
  const [diffFilter, setDiffFilter] = useState('all'); // 'all' | 'Easy' | 'Medium' | 'Hard'
  const [sortDiff, setSortDiff] = useState('none'); // 'none' | 'easy_hard' | 'hard_easy'

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem(LS_SIDEBAR_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [confirmModal, setConfirmModal] = useState(null); // null | 'reset_progress' | 'clear_stars'

  const filterRef = useRef(null);

  // Exit fullscreen on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  // Close filter popover on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setIsFilterOpen(false);
      }
    }
    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // Persist solvedMap
  const toggleSolved = (id) => {
    setSolvedMap(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(LS_SOLVED_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Persist starredMap
  const toggleStarred = (id) => {
    setStarredMap(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(LS_STARRED_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      try {
        localStorage.setItem(LS_SIDEBAR_KEY, String(next));
      } catch {}
      return next;
    });
  };

  // Check if any filter is active
  const hasActiveFilters = hideSolved || starredOnly || leetCodeOnly || interviewMode || diffFilter !== 'all' || sortDiff !== 'none';

  // Reset all filters
  const resetAllFilters = () => {
    setHideSolved(false);
    setStarredOnly(false);
    setLeetCodeOnly(false);
    setInterviewMode(false);
    setDiffFilter('all');
    setSortDiff('none');
  };

  // Danger zone action handler
  const handleDangerConfirm = () => {
    if (confirmModal === 'reset_progress') {
      setSolvedMap({});
      try {
        localStorage.removeItem(LS_SOLVED_KEY);
      } catch {}
    } else if (confirmModal === 'clear_stars') {
      setStarredMap({});
      setStarredOnly(false);
      try {
        localStorage.removeItem(LS_STARRED_KEY);
      } catch {}
    }
    setConfirmModal(null);
  };

  // Statistics calculation based on Interview Mode vs Total
  const stats = useMemo(() => {
    const list = interviewMode ? CODEX_PROBLEMS.filter(p => p.isInterview) : CODEX_PROBLEMS;
    const total = list.length;
    let solvedCount = 0;
    const byDiffTotal = { Easy: 0, Medium: 0, Hard: 0 };
    const byDiffSolved = { Easy: 0, Medium: 0, Hard: 0 };

    for (const p of list) {
      byDiffTotal[p.difficulty]++;
      if (solvedMap[p.id]) {
        solvedCount++;
        byDiffSolved[p.difficulty]++;
      }
    }

    const percentage = total > 0 ? Math.round((solvedCount / total) * 100) : 0;

    return {
      total,
      solvedCount,
      byDiffTotal,
      byDiffSolved,
      percentage,
    };
  }, [interviewMode, solvedMap]);

  // Total counts for danger zone
  const totalSolvedCount = useMemo(() => {
    return Object.values(solvedMap).filter(Boolean).length;
  }, [solvedMap]);

  const totalStarredCount = useMemo(() => {
    return Object.values(starredMap).filter(Boolean).length;
  }, [starredMap]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const cat of CODEX_CATEGORIES) {
      if (interviewMode) {
        counts[cat] = CODEX_PROBLEMS.filter(p => p.category === cat && p.isInterview).length;
      } else {
        counts[cat] = CODEX_PROBLEMS.filter(p => p.category === cat).length;
      }
    }
    return counts;
  }, [interviewMode]);

  // Filtered & Sorted Problem List
  const displayedProblems = useMemo(() => {
    let result = CODEX_PROBLEMS;

    // Filter by Topic / Category
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filter: Interview mode
    if (interviewMode) {
      result = result.filter(p => p.isInterview);
    }

    // Filter: Hide solved
    if (hideSolved) {
      result = result.filter(p => !solvedMap[p.id]);
    }

    // Filter: Starred only
    if (starredOnly) {
      result = result.filter(p => Boolean(starredMap[p.id]));
    }

    // Filter: LeetCode only
    if (leetCodeOnly) {
      result = result.filter(p => p.url && p.url.includes('leetcode.com'));
    }

    // Filter: Difficulty
    if (diffFilter !== 'all') {
      result = result.filter(p => p.difficulty === diffFilter);
    }

    // Filter: Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => p.title.toLowerCase().includes(q));
    }

    // Sort: by difficulty
    if (sortDiff === 'easy_hard') {
      result = [...result].sort((a, b) => {
        const wa = DIFF_WEIGHT[a.difficulty] || 2;
        const wb = DIFF_WEIGHT[b.difficulty] || 2;
        if (wa !== wb) return wa - wb;
        return a.id - b.id;
      });
    } else if (sortDiff === 'hard_easy') {
      result = [...result].sort((a, b) => {
        const wa = DIFF_WEIGHT[a.difficulty] || 2;
        const wb = DIFF_WEIGHT[b.difficulty] || 2;
        if (wa !== wb) return wb - wa;
        return a.id - b.id;
      });
    }

    return result;
  }, [selectedCategory, interviewMode, hideSolved, starredOnly, leetCodeOnly, diffFilter, searchQuery, sortDiff, solvedMap, starredMap]);

  // Donut SVG circumference calculation
  const radius = 17;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.percentage / 100) * circumference;

  return (
    <div className={`embers-root ${sidebarCollapsed ? 'embers-root--sidebar-collapsed' : ''} ${isFullscreen ? 'embers-root--fullscreen' : ''}`}>
      {/* ─── Sidebar ──────────────────────────────────────────────────────── */}
      <aside className={`embers-sidebar ${sidebarCollapsed ? 'embers-sidebar--collapsed' : ''}`}>
        {/* Header */}
        <div className="embers-sidebar-header">
          {!sidebarCollapsed && <h1 className="embers-sidebar-title">Codex</h1>}
          <button
            type="button"
            className="embers-collapse-btn"
            onClick={toggleSidebar}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>

        {/* Progress Card (hidden when collapsed) */}
        {!sidebarCollapsed && (
          <div className="embers-progress-card">
            <div className="embers-donut-wrap">
              <svg viewBox="0 0 44 44" className="embers-donut-svg">
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  className="embers-donut-bg"
                />
                <circle
                  cx="22"
                  cy="22"
                  r={radius}
                  className="embers-donut-fill"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <span className="embers-donut-text">{stats.percentage}%</span>
            </div>

            <div className="embers-stats-list">
              <div className="embers-stat-row embers-stat-solved">
                <span className="embers-stat-label">Solved</span>
                <span className="embers-stat-val">{stats.solvedCount}/{stats.total}</span>
              </div>
              <div className="embers-stat-row embers-stat-easy">
                <span className="embers-stat-label">Easy</span>
                <span className="embers-stat-val">{stats.byDiffSolved.Easy}/{stats.byDiffTotal.Easy}</span>
              </div>
              <div className="embers-stat-row embers-stat-med">
                <span className="embers-stat-label">Med.</span>
                <span className="embers-stat-val">{stats.byDiffSolved.Medium}/{stats.byDiffTotal.Medium}</span>
              </div>
              <div className="embers-stat-row embers-stat-hard">
                <span className="embers-stat-label">Hard</span>
                <span className="embers-stat-val">{stats.byDiffSolved.Hard}/{stats.byDiffTotal.Hard}</span>
              </div>
            </div>
          </div>
        )}

        {/* Topics Section */}
        <div className="embers-topics-wrap">
          {!sidebarCollapsed && <div className="embers-topics-heading">TOPICS</div>}
          <nav className="embers-topics-nav" aria-label="Codex topics">
            {/* All Topics / Interview Core */}
            <button
              type="button"
              className={`embers-topic-item ${selectedCategory === null ? 'embers-topic-item--active' : ''}`}
              onClick={() => setSelectedCategory(null)}
              title={interviewMode ? "Interview Core" : "All Topics"}
            >
              <span className="embers-topic-name">
                {sidebarCollapsed ? (interviewMode ? 'INT' : 'ALL') : (interviewMode ? 'Interview Core' : 'All Topics')}
              </span>
              <span className="embers-topic-badge">{stats.total}</span>
            </button>

            {/* Individual Categories */}
            {CODEX_CATEGORIES.map(cat => {
              const count = categoryCounts[cat] || 0;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  className={`embers-topic-item ${isActive ? 'embers-topic-item--active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                  title={cat}
                >
                  <span className="embers-topic-name">
                    {sidebarCollapsed ? cat.slice(0, 3).toUpperCase() : cat}
                  </span>
                  <span className="embers-topic-badge">{count}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* ─── Main Content ─────────────────────────────────────────────────── */}
      <main className="embers-main">
        {/* Top Control Bar */}
        <div className="embers-topbar">
          {/* Search Box */}
          <div className="embers-search-box">
            <span className="embers-search-icon"><SearchIcon /></span>
            <input
              type="text"
              className="embers-search-input"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="embers-search-clear"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="embers-topbar-actions" ref={filterRef}>
            {/* Filter Toggle Button */}
            <button
              type="button"
              className={`embers-icon-btn ${isFilterOpen || hasActiveFilters ? 'embers-icon-btn--active' : ''}`}
              onClick={() => setIsFilterOpen(prev => !prev)}
              title="Filters & Options"
              aria-label="Toggle filters menu"
            >
              <FunnelIcon />
              {hasActiveFilters && <span className="embers-filter-dot" />}
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              className={`embers-icon-btn ${isFullscreen ? 'embers-icon-btn--active' : ''}`}
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit full screen (Esc)" : "Full screen mode"}
              aria-label={isFullscreen ? "Exit full screen" : "Full screen mode"}
            >
              {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              className="embers-icon-btn"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* ─── Filter Popover ────────────────────────────────────────── */}
            {isFilterOpen && (
              <div className="embers-filter-popover" role="dialog" aria-label="Problem Filters">
                {/* Popover Header */}
                <div className="embers-filter-header">
                  <span className="embers-filter-title">FILTERS</span>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="embers-reset-all-btn"
                      onClick={resetAllFilters}
                    >
                      Reset all
                    </button>
                  )}
                </div>

                {/* Switch Toggles */}
                <div className="embers-filter-switches">
                  <div className="embers-switch-row">
                    <span className="embers-switch-label">Hide solved</span>
                    <Switch
                      checked={hideSolved}
                      onChange={() => setHideSolved(prev => !prev)}
                    />
                  </div>

                  <div className="embers-switch-row">
                    <span className="embers-switch-label">Starred only</span>
                    <Switch
                      checked={starredOnly}
                      onChange={() => setStarredOnly(prev => !prev)}
                    />
                  </div>

                  <div className="embers-switch-row">
                    <span className="embers-switch-label">LeetCode only</span>
                    <Switch
                      checked={leetCodeOnly}
                      onChange={() => setLeetCodeOnly(prev => !prev)}
                    />
                  </div>

                  <div className="embers-switch-row">
                    <span className="embers-switch-label">Interview mode</span>
                    <Switch
                      checked={interviewMode}
                      onChange={() => setInterviewMode(prev => !prev)}
                      activeColor="bg-[#f59e0b]"
                    />
                  </div>
                </div>

                <div className="embers-filter-divider" />

                {/* Show Difficulty (Segmented Pills) */}
                <div className="embers-diff-filter-section">
                  <div className="embers-section-subhead">Show difficulty</div>
                  <div className="embers-diff-pills">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'Easy', label: 'Easy' },
                      { id: 'Medium', label: 'Med.' },
                      { id: 'Hard', label: 'Hard' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        className={`embers-diff-pill-btn ${diffFilter === tab.id ? `embers-diff-pill-btn--active embers-diff-pill-btn--${tab.id.toLowerCase()}` : ''}`}
                        onClick={() => setDiffFilter(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="embers-filter-divider" />

                {/* Sort by Difficulty */}
                <div className="embers-sort-row">
                  <span className="embers-switch-label">Sort by difficulty</span>
                  <button
                    type="button"
                    className={`embers-sort-btn ${sortDiff !== 'none' ? 'embers-sort-btn--active' : ''}`}
                    onClick={() => {
                      setSortDiff(curr => {
                        if (curr === 'none') return 'easy_hard';
                        if (curr === 'easy_hard') return 'hard_easy';
                        return 'none';
                      });
                    }}
                  >
                    <span>
                      {sortDiff === 'none' && 'Off'}
                      {sortDiff === 'easy_hard' && 'Easy → Hard'}
                      {sortDiff === 'hard_easy' && 'Hard → Easy'}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`embers-sort-arrow ${sortDiff === 'hard_easy' ? 'rotate-180' : ''}`}
                    >
                      {sortDiff === 'none' ? (
                        <>
                          <path d="M7 15l5 5 5-5" />
                          <path d="M7 9l5-5 5 5" />
                        </>
                      ) : (
                        <path d="M12 19V5M5 12l7-7 7 7" />
                      )}
                    </svg>
                  </button>
                </div>

                <div className="embers-filter-divider" />

                {/* Danger Zone */}
                <div className="embers-danger-section">
                  <div className="embers-danger-heading">DANGER ZONE</div>
                  <div className="embers-danger-buttons">
                    <button
                      type="button"
                      disabled={totalStarredCount === 0}
                      className={`embers-danger-btn ${totalStarredCount === 0 ? 'embers-danger-btn--disabled' : ''}`}
                      onClick={() => {
                        setConfirmModal('clear_stars');
                        setIsFilterOpen(false);
                      }}
                    >
                      <span className="embers-danger-btn-left">
                        <TrashIcon />
                        <span>Clear all stars</span>
                      </span>
                      <span className="embers-danger-count">{totalStarredCount}</span>
                    </button>

                    <button
                      type="button"
                      disabled={totalSolvedCount === 0}
                      className={`embers-danger-btn ${totalSolvedCount === 0 ? 'embers-danger-btn--disabled' : ''}`}
                      onClick={() => {
                        setConfirmModal('reset_progress');
                        setIsFilterOpen(false);
                      }}
                    >
                      <span className="embers-danger-btn-left">
                        <ResetIcon />
                        <span>Reset progress</span>
                      </span>
                      <span className="embers-danger-count">{totalSolvedCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Problems Table ─────────────────────────────────────────────── */}
        <div className="embers-table-container">
          <table className="embers-table">
            <thead>
              <tr className="embers-table-head-row">
                <th className="embers-th embers-th-check" title="Solved status">
                  <span className="embers-th-icon"><CheckIcon /></span>
                </th>
                <th className="embers-th embers-th-star" title="Favorite problem">
                  <span className="embers-th-icon"><StarIcon filled={false} /></span>
                </th>
                <th className="embers-th embers-th-title">TITLE</th>
                <th className="embers-th embers-th-diff">DIFFICULTY</th>
              </tr>
            </thead>
            <tbody>
              {displayedProblems.length === 0 ? (
                <tr>
                  <td colSpan="4" className="embers-empty-cell">
                    <div className="embers-empty-wrap">
                      <div className="embers-empty-title">No problems found</div>
                      <p className="embers-empty-desc">
                        No problems match your current search or filter criteria.
                      </p>
                      {hasActiveFilters && (
                        <button
                          type="button"
                          className="embers-empty-reset-btn"
                          onClick={resetAllFilters}
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                displayedProblems.map((p) => {
                  const isSolved = Boolean(solvedMap[p.id]);
                  const isStarred = Boolean(starredMap[p.id]);

                  return (
                    <tr
                      key={p.id}
                      className={`embers-row ${isSolved ? 'embers-row--solved' : ''}`}
                    >
                      {/* Solved Checkbox */}
                      <td className="embers-td embers-td-check">
                        <button
                          type="button"
                          className={`embers-check-btn ${isSolved ? 'embers-check-btn--solved' : ''}`}
                          onClick={() => toggleSolved(p.id)}
                          title={isSolved ? "Mark as unsolved" : "Mark as solved"}
                          aria-label={isSolved ? "Mark unsolved" : "Mark solved"}
                        >
                          <CheckIcon />
                        </button>
                      </td>

                      {/* Star Favorite */}
                      <td className="embers-td embers-td-star">
                        <button
                          type="button"
                          className={`embers-star-btn ${isStarred ? 'embers-star-btn--active' : ''}`}
                          onClick={() => toggleStarred(p.id)}
                          title={isStarred ? "Remove star" : "Add star"}
                          aria-label={isStarred ? "Remove star" : "Add star"}
                        >
                          <StarIcon filled={isStarred} />
                        </button>
                      </td>

                      {/* Title Link */}
                      <td className="embers-td embers-td-title">
                        <div className="embers-title-cell-wrap">
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`embers-title-link ${isSolved ? 'embers-title-link--solved' : ''}`}
                          >
                            {p.title}
                          </a>
                        </div>
                      </td>

                      {/* Difficulty */}
                      <td className="embers-td embers-td-diff">
                        <span className={`embers-diff-badge embers-diff-badge--${p.difficulty.toLowerCase()}`}>
                          {p.difficulty === 'Medium' ? 'Med.' : p.difficulty}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* ─── Danger Zone Confirmation Modal ───────────────────────────────── */}
      {confirmModal && (
        <div className="embers-modal-overlay" role="dialog" aria-modal="true">
          <div className="embers-modal-card">
            <div className="embers-modal-header">
              <span className="embers-modal-warning-icon">
                <WarningIcon />
              </span>
              <h2 className="embers-modal-title">
                {confirmModal === 'reset_progress' ? 'Reset All Progress?' : 'Clear All Stars?'}
              </h2>
            </div>
            <p className="embers-modal-desc">
              {confirmModal === 'reset_progress'
                ? 'This will permanently unmark all your solved problems and reset your overall progress counter to 0%. This action cannot be undone.'
                : 'This will permanently remove the star from all your starred problems. This action cannot be undone.'}
            </p>
            <div className="embers-modal-actions">
              <button
                type="button"
                className="embers-modal-cancel-btn"
                onClick={() => setConfirmModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="embers-modal-confirm-btn"
                onClick={handleDangerConfirm}
              >
                {confirmModal === 'reset_progress' ? 'Reset All Progress' : 'Clear All Stars'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
