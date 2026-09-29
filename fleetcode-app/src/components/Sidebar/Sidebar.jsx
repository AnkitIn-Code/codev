import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useSolvedProblems } from '../../hooks/useSolvedProblems';
import { useProblems } from '../../hooks/useProblems';
import './Sidebar.css';

const NAV = [
  {
    group: 'CORE',
    items: [
      {
        to: '/',
        end: true,
        label: 'Dashboard',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
          </svg>
        ),
      },
      {
        to: '/problems',
        label: 'Problems',
        badge: '4,023',
        badgeStyle: 'count',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        ),
      },
      {
        to: '/sheets',
        label: 'DSA Sheets',
        badge: '10',
        badgeStyle: 'hot',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        ),
      },
    ],
  },
  {
    group: 'EXPLORE',
    items: [
      {
        to: '/topics',
        label: 'Topics',
        badge: '16',
        badgeStyle: 'count',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
        ),
      },
      {
        to: '/companies',
        label: 'Companies',
        badge: '659+',
        badgeStyle: 'count',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18" />
            <path d="M5 21V7l8-4v18" />
            <path d="M19 21V11l-6-4" />
            <path d="M9 9h1" /><path d="M9 13h1" /><path d="M9 17h1" />
          </svg>
        ),
      },
      {
        to: '/practice',
        label: 'Practice',
        badge: 'NEW',
        badgeStyle: 'new',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar({ collapsed: propCollapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
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
    <aside className={`sb ${isCollapsed ? 'sb--collapsed' : ''} ${mobileOpen ? 'sb--mobile-open' : ''}`}>

      {/* ── Brand Header ────────────────────────────────────── */}
      <div className="sb-head">
        <Link to="/" className="sb-brand" onClick={onCloseMobile}>
          <div className="sb-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="sbLg1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="sbLg2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="url(#sbLg1)" />
              <path d="M2 17L12 22L22 17" stroke="url(#sbLg2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="url(#sbLg2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {!isCollapsed && (
            <span className="sb-brand-name">
              Fleet<span className="sb-brand-accent">Code</span>
              <span className="sb-brand-ver">v2</span>
            </span>
          )}
        </Link>

        {mobileOpen ? (
          <button className="sb-close" onClick={onCloseMobile} aria-label="Close menu">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : (
          <button className="sb-toggle" onClick={toggleCollapse} title={isCollapsed ? 'Expand' : 'Collapse'} aria-label="Toggle sidebar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {isCollapsed
                ? <polyline points="9 18 15 12 9 6" />
                : <polyline points="15 18 9 12 15 6" />}
            </svg>
          </button>
        )}
      </div>

      {/* ── Scroll Area ─────────────────────────────────────── */}
      <div className="sb-scroll">

        {NAV.map(({ group, items }) => (
          <div className="sb-group" key={group}>
            {!isCollapsed && <div className="sb-group-label">{group}</div>}
            {items.map(({ to, end, label, badge, badgeStyle, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onCloseMobile}
                className={({ isActive }) => `sb-item${isActive ? ' sb-item--active' : ''}`}
                title={isCollapsed ? label : undefined}
              >
                <span className="sb-item-icon">{icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="sb-item-label">{label}</span>
                    {badge && <span className={`sb-pill sb-pill--${badgeStyle}`}>{badge}</span>}
                  </>
                )}
                {isCollapsed && badge && badgeStyle === 'new' && (
                  <span className="sb-collapsed-dot" />
                )}
              </NavLink>
            ))}
          </div>
        ))}

        {/* ── Progress Card ───────────────────────────────── */}
        {!isCollapsed && (
          <div className="sb-progress">
            <div className="sb-progress-head">
              <span className="sb-progress-label">YOUR PROGRESS</span>
              <span className="sb-progress-pct">{solvedPercent}%</span>
            </div>
            <div className="sb-progress-track">
              <div className="sb-progress-fill" style={{ width: `${Math.max(1, solvedPercent)}%` }} />
            </div>
            <div className="sb-progress-meta">
              <span><strong>{solvedCount}</strong> / {totalProblems.toLocaleString()} solved</span>
              <span className="sb-streak">🔥 1d</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer ──────────────────────────────────────────── */}
      <div className="sb-foot">
        {!isCollapsed ? (
          <div className="sb-theme-row">
            <button
              className={`sb-theme-btn${theme === 'light' ? ' sb-theme-btn--on' : ''}`}
              onClick={() => theme !== 'light' && toggleTheme()}
              title="Light"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              Light
            </button>
            <button
              className={`sb-theme-btn${theme === 'dark' ? ' sb-theme-btn--on' : ''}`}
              onClick={() => theme !== 'dark' && toggleTheme()}
              title="Dark"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              Dark
            </button>
          </div>
        ) : (
          <button className="sb-theme-icon" onClick={toggleTheme} title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        )}

        {!isCollapsed && (
          <div className="sb-user">
            <div className="sb-avatar">FC</div>
            <div className="sb-user-info">
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
