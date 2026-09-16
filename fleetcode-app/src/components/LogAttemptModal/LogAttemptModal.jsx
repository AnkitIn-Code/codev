import { useState } from 'react';
import './LogAttemptModal.css';

const OUTCOMES = [
  { id: 'clean',  icon: '✅', label: 'Solved Cleanly',        desc: 'Solved independently with no hints' },
  { id: 'hinted', icon: '💡', label: 'Used Hints / Solution', desc: 'Needed a hint, tutorial, or solution peek' },
  { id: 'failed', icon: '❌', label: 'Could Not Solve',         desc: 'Got stuck and could not get it working' },
];

const STUCK_REASONS = [
  { id: 'no-approach',    label: 'Missed Pattern Recognition' },
  { id: 'implementation', label: 'Implementation / Coding' },
  { id: 'edge-cases',     label: 'Edge & Corner Cases' },
  { id: 'complexity',     label: 'Time / Space Complexity' },
];

export default function LogAttemptModal({ questionItem, onSave, onCancel }) {
  const [outcome, setOutcome] = useState('clean');
  const [stuckReason, setStuckReason] = useState('no-approach');
  const [note, setNote] = useState('');
  const [minutes, setMinutes] = useState('');

  const isNotClean = outcome === 'hinted' || outcome === 'failed';

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      outcome,
      stuckReason: isNotClean ? stuckReason : null,
      note: isNotClean ? note.trim() : (note.trim() || null),
      minutes: minutes ? parseInt(minutes, 10) : null,
    });
  }

  return (
    <div className="log-modal-overlay" role="dialog" aria-modal="true">
      <div className="log-modal-card">
        <div className="log-modal-header">
          <div className="log-modal-title-group">
            <span className="log-modal-subtitle">Log Problem Completion</span>
            <h3 className="log-modal-title">
              {questionItem.num != null && `#${questionItem.num}. `}{questionItem.title}
            </h3>
          </div>
          <button type="button" className="log-modal-close" onClick={onCancel} aria-label="Close dialog">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="log-modal-form">
          {/* Outcome Radio Options */}
          <div className="log-modal-section">
            <label className="log-modal-label">How did you solve this problem?</label>
            <div className="log-outcome-grid">
              {OUTCOMES.map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={`log-outcome-choice ${outcome === opt.id ? 'log-outcome-choice--active log-outcome-choice--' + opt.id : ''}`}
                  onClick={() => setOutcome(opt.id)}
                >
                  <span className="log-choice-icon">{opt.icon}</span>
                  <div className="log-choice-text">
                    <span className="log-choice-label">{opt.label}</span>
                    <span className="log-choice-desc">{opt.desc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* If Used Hints or Not Solved: Ask why + Comment */}
          {isNotClean && (
            <div className="log-modal-feedback-box">
              <div className="log-modal-section">
                <label className="log-modal-label">
                  What caused the difficulty or missed pattern?
                </label>
                <div className="log-reasons-grid">
                  {STUCK_REASONS.map(r => (
                    <button
                      key={r.id}
                      type="button"
                      className={`log-reason-pill ${stuckReason === r.id ? 'log-reason-pill--active' : ''}`}
                      onClick={() => setStuckReason(r.id)}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="log-modal-section">
                <label className="log-modal-label">
                  Why did you use that hint? (Your reflection):
                </label>
                <textarea
                  className="log-modal-textarea"
                  rows={3}
                  placeholder="e.g. I didn't realize we could use two pointers from opposite ends because the array was sorted; needed a nudge on shrinking the window..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
                <span className="log-modal-hint-caption">
                  This reflection will be saved in your <strong>History</strong> review section to help you revisit missed patterns.
                </span>
              </div>
            </div>
          )}

          {/* Time spent */}
          <div className="log-modal-row">
            <div className="log-modal-section">
              <label className="log-modal-label">Time spent (minutes, optional):</label>
              <input
                type="number"
                min="1"
                max="240"
                className="log-modal-input"
                placeholder="e.g. 25"
                value={minutes}
                onChange={e => setMinutes(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="log-modal-actions">
            <button type="button" className="btn btn-outline" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary log-modal-submit-btn">
              ✓ Save & Complete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
