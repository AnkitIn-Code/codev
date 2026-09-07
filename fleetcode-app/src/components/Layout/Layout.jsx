import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import { useTheme } from '../../context/ThemeContext';
import './Layout.css';

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className={`layout ${collapsed ? 'layout-collapsed' : ''} ${mobileOpen ? 'layout-mobile-open' : ''}`}>
      {/* Mobile Top Header (only visible on <= 860px) */}
      <header className="layout-mobile-bar">
        <button
          type="button"
          className="layout-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>

        <Link to="/" className="layout-mobile-brand">
          <div className="layout-mobile-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#6366f1" />
              <path d="M2 17L12 22L22 17" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="layout-mobile-title">Fleet<span className="layout-mobile-highlight">Code</span></span>
        </Link>

        <button
          type="button"
          className="layout-mobile-theme-btn"
          onClick={toggleTheme}
          title="Toggle Theme"
          aria-label="Toggle dark/light theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      {/* Backdrop overlay for mobile drawer */}
      {mobileOpen && (
        <div
          className="layout-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar with mobile drawer support */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className="layout-main">
        {children}
      </main>
    </div>
  );
}
