import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { topicToSlug } from '../../data/topicGroups';
import './TopicPopup.css';

/**
 * Modal showing all topics tagged for a given problem.
 * @param {string}   problemTitle - title of the problem
 * @param {string[]} topics       - array of topic tag names
 * @param {Function} onClose      - called to close the popup
 */
export default function TopicPopup({ problemTitle, topics = [], onClose }) {
  const navigate = useNavigate();
  const popupRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent background body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  function handleTopicClick(topic) {
    onClose();
    navigate(`/topics/${topicToSlug(topic)}`);
  }

  function handleOverlayClick(e) {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose();
    }
  }

  return (
    <div className="tp-overlay" onClick={handleOverlayClick}>
      <div className="tp-modal" ref={popupRef}>
        {/* Header */}
        <div className="tp-header">
          <div>
            <p className="tp-label">Topics tagged on</p>
            <h2 className="tp-title">{problemTitle}</h2>
          </div>
          <button className="tp-close-btn" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Count Metadata */}
        <div className="tp-meta">
          <span className="tp-count-badge">{topics.length}</span>
          <span className="tp-meta-text">topic{topics.length !== 1 ? 's' : ''} associated with this problem</span>
        </div>

        {/* Topics Grid */}
        <div className="tp-grid">
          {topics.map(topic => (
            <button
              key={topic}
              className="tp-chip"
              onClick={() => handleTopicClick(topic)}
              title={`View all ${topic} problems`}
            >
              <span className="tp-chip-icon">🏷️</span>
              <span className="tp-chip-name">{topic}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="tp-chip-arrow">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
