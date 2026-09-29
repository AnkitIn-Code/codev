import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { useTheme } from '../../context/ThemeContext';
import './Layout.css';

/* Map routes to page metadata */
const PAGE_META = {
  '/':            { title: 'Dashboard',      desc: 'Your interview preparation hub' },
  '/problems':    { title: 'Problems',        desc: 'Browse all 4,000+ LeetCode problems' },
  '/topics':      { title: 'Topics',          desc: 'Explore topics and tracks' },
  '/companies':   { title: 'Companies',       desc: 'Company-specific question banks' },
  '/sheets':      { title: 'DSA Sheets',      desc: 'Curated problem sets for interview prep' },
  '/practice':    { title: 'DSA Practice',    desc: 'Pattern navigator & curated problem codex' },
};

function getPageMeta(pathname) {
  if (pathname.startsWith('/topics/'))    return { title: 'Topic Detail',   desc: 'Deep dive into a topic' };
  if (pathname.startsWith('/companies/')) return { title: 'Company',        desc: 'Company question bank' };
  if (pathname.startsWith('/sheets/'))    return { title: 'Sheet',          desc: 'Curated problem set' };
  if (pathname.startsWith('/practice/'))  return { title: 'Mock Assessment', desc: 'Timed coding assessment' };
  return PAGE_META[pathname] || { title: 'FleetCode', desc: '' };
}

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const meta = getPageMeta(location.pathname);

  return (
    <div className={`lyt ${collapsed ? 'lyt--collapsed' : ''} ${mobileOpen ? 'lyt--mobile-open' : ''}`}>

      {/* ── Mobile Top Bar ─────────────────────────────────── */}
      <header className="lyt-mobile-bar">
        <button
          type="button"
          className="lyt-ham"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
            ) : (
              <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>
            )}
          </svg>
        </button>
        <Link to="/" className="lyt-mobile-brand">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#6366f1" />
            <path d="M2 17L12 22L22 17" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Fleet<strong>Code</strong></span>
        </Link>
        <button type="button" className="lyt-mobile-theme" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      {/* ── Mobile Backdrop ─────────────────────────────────── */}
      {mobileOpen && (
        <div className="lyt-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />
      )}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* ── Main Content ────────────────────────────────────── */}
      <main className="lyt-main">
        {/* Desktop top header bar */}
        <div className="lyt-topbar">
          <div className="lyt-topbar-left">
            <h1 className="lyt-page-title">{meta.title}</h1>
            {meta.desc && <span className="lyt-page-desc">{meta.desc}</span>}
          </div>
          <div className="lyt-topbar-right">
            <div className="lyt-topbar-streak" title="Daily streak">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
              </svg>
              1 day streak
            </div>
            <div className="lyt-topbar-avatar" title="Candidate">
              FC
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="lyt-content">
          {children}
        </div>
      </main>
    </div>
  );
}
