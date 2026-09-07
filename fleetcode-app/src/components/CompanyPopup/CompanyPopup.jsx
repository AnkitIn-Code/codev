import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyToSlug } from '../../utils/helpers';
import './CompanyPopup.css';

/**
 * Modal showing all companies for a given problem.
 * @param {string} problemTitle - title of the problem
 * @param {string[]} companies  - list of company names
 * @param {Function} onClose    - called to close the popup
 */
export default function CompanyPopup({ problemTitle, companies, onClose }) {
  const navigate = useNavigate();
  const popupRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  function handleCompanyClick(company) {
    onClose();
    navigate(`/companies/${companyToSlug(company)}`);
  }

  function handleOverlayClick(e) {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose();
    }
  }

  return (
    <div className="overlay" onClick={handleOverlayClick}>
      <div className="company-popup" ref={popupRef}>
        {/* Header */}
        <div className="company-popup-header">
          <div>
            <p className="company-popup-label">Companies asking</p>
            <h2 className="company-popup-title">{problemTitle}</h2>
          </div>
          <button className="company-popup-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Count */}
        <div className="company-popup-meta">
          <span className="company-popup-count">{companies.length}</span>
          <span className="company-popup-meta-label"> companies ask this problem</span>
        </div>

        {/* Company chips */}
        <div className="company-popup-grid">
          {companies.map(company => (
            <button
              key={company}
              className="company-chip"
              onClick={() => handleCompanyClick(company)}
              title={`View all ${company} problems`}
            >
              {company}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
