import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useSolvedProblems } from '../../hooks/useSolvedProblems';
import { useProblems } from '../../hooks/useProblems';
import './Sidebar.css';

export default function Sidebar({ collapsed: propCollapsed, onToggleCollapse }) {
  const { theme, toggleTheme } = useTheme();
  const { solved } = useSolvedProblems();
  const { problems = [] } = useProblems();
  const [internalCollapsed, setInternalCollapsed] = useState(false);

  const isCollapsed = propCollapsed !== undefined ? propCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed(c => !c));

  const totalProblems = problems.length || 4023;
  const solvedCount = solved ? solved.size : 0;
  const solvedPercent = totalProblems > 0 ? ((solvedCount / totalProblems) * 100).toFixed(1) : 0;

  return (
    <aside className={`sb-container ${isCollapsed ? 'sb-collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sb-header">
        <div className="sb-brand">
          <div className="sb-logo-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="sbGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="sbGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#sbGrad1)" />
              <path d="M2 17L12 22L22 17" stroke="url(#sbGrad2)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="url(#sbGrad2)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="sb-brand-text">
              <span className="sb-brand-title">Fleet<span className="sb-brand-highlight">Code</span></span>
              <span className="sb-brand-pill">v2.0</span>
            </div>
          )}
        </div>

        <button
          className="sb-collapse-toggle"
          onClick={toggleCollapse}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label="Toggle sidebar width"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {isCollapsed ? (
              <polyline points="9 18 15 12 9 6" />
            ) : (
              <polyline points="15 18 9 12 15 6" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="sb-scroll-area">
        {/* Core Section */}
        <div className="sb-group">
          {!isCollapsed && <div className="sb-group-label">MAIN</div>}
          <NavLink
            to="/"
            end
            className={({ isActive }) => `sb-item ${isActive ? 'sb-item--active' : ''}`}
            title="Dashboard"
          >
            <span className="sb-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </span>
            {!isCollapsed && <span className="sb-item-label">Dashboard</span>}
          </NavLink>

          <NavLink
            to="/problems"
            className={({ isActive }) => `sb-item ${isActive ? 'sb-item--active' : ''}`}
            title="Problems"
          >
            <span className="sb-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </span>
            {!isCollapsed && (
              <>
                <span className="sb-item-label">Problems</span>
                <span className="sb-badge sb-badge-subtle">{totalProblems.toLocaleString()}</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/sheets"
            className={({ isActive }) => `sb-item ${isActive ? 'sb-item--active' : ''}`}
            title="DSA Sheets"
          >
            <span className="sb-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </span>
            {!isCollapsed && (
              <>
                <span className="sb-item-label">DSA Sheets</span>
                <span className="sb-badge sb-badge-flame">🔥 10</span>
              </>
            )}
          </NavLink>
        </div>

        {/* Explore Section */}
        <div className="sb-group">
          {!isCollapsed && <div className="sb-group-label">EXPLORE & PREP</div>}
          <NavLink
            to="/topics"
            className={({ isActive }) => `sb-item ${isActive ? 'sb-item--active' : ''}`}
            title="Topics"
          >
            <span className="sb-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </span>
            {!isCollapsed && (
              <>
                <span className="sb-item-label">Topics</span>
                <span className="sb-badge sb-badge-subtle">16 Tracks</span>
              </>
            )}
          </NavLink>

          <NavLink
            to="/companies"
            className={({ isActive }) => `sb-item ${isActive ? 'sb-item--active' : ''}`}
            title="Companies"
          >
            <span className="sb-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21h18" />
                <path d="M5 21V7l8-4v18" />
                <path d="M19 21V11l-6-4" />
                <path d="M9 9h1" />
                <path d="M9 13h1" />
                <path d="M9 17h1" />
              </svg>
            </span>
            {!isCollapsed && (
              <>
                <span className="sb-item-label">Companies</span>
                <span className="sb-badge sb-badge-subtle">659+</span>
              </>
            )}
          </NavLink>
        </div>

        {/* Live Progress Card */}
        {!isCollapsed && (
          <div className="sb-progress-card">
            <div className="sb-pcard-header">
              <span className="sb-pcard-title">SOLVED PROGRESS</span>
              <span className="sb-pcard-pct">{solvedPercent}%</span>
            </div>
            <div className="sb-pcard-bar">
              <div className="sb-pcard-fill" style={{ width: `${Math.max(1, solvedPercent)}%` }} />
            </div>
            <div className="sb-pcard-info">
              <span><strong>{solvedCount}</strong> / {totalProblems.toLocaleString()} solved</span>
              <span className="sb-pcard-streak">🔥 1d</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="sb-footer">
        {/* Segmented Theme Switcher */}
        {!isCollapsed ? (
          <div className="sb-theme-segmented">
            <button
              className={`sb-theme-seg-btn ${theme === 'light' ? 'sb-theme-seg-btn--active' : ''}`}
              onClick={() => theme !== 'light' && toggleTheme()}
              title="Light Mode"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              Light
            </button>
            <button
              className={`sb-theme-seg-btn ${theme === 'dark' ? 'sb-theme-seg-btn--active' : ''}`}
              onClick={() => theme !== 'dark' && toggleTheme()}
              title="Dark Mode"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              Dark
            </button>
          </div>
        ) : (
          <button className="sb-theme-icon-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        )}

        {/* User Card */}
        {!isCollapsed && (
          <div className="sb-user-card">
            <div className="sb-user-avatar">
              <span>FC</span>
            </div>
            <div className="sb-user-details">
              <span className="sb-user-name">Candidate</span>
              <span className="sb-user-status">
                <span className="sb-status-dot" /> Online
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
