import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_TOPICS } from '../../data/practice/index.js';
import { todayISO } from '../../lib/practice/store.js';
import './MockOA.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_DURATION_MIN = 90; // 90 minutes
const DIFFICULTY_MIX = [
  { difficulty: 'Easy',   count: 1 },
  { difficulty: 'Medium', count: 2 },
  { difficulty: 'Hard',   count: 1 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function lcUrl(slug) { return `https://leetcode.com/problems/${slug}/`; }

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Question selection ───────────────────────────────────────────────────────

function selectMockQuestions(allTopics, seed) {
  const rng = mulberry32(seed);
  const allQuestions = allTopics.flatMap(t =>
    t.patterns.flatMap(p => p.questions.map(q => ({ ...q, topicId: t.id, patternId: p.id, topicName: t.name, patternName: p.name })))
  );

  const selected = [];
  for (const { difficulty, count } of DIFFICULTY_MIX) {
    const pool = shuffle(allQuestions.filter(q => q.difficulty === difficulty), rng);
    selected.push(...pool.slice(0, count));
  }
  return shuffle(selected, rng); // shuffle final order so difficulty isn't obvious
}

// ─── Countdown Timer ──────────────────────────────────────────────────────────

function CountdownTimer({ totalSeconds, started, onExpire }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!started) return;
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); onExpire(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [started, onExpire]);

  const pct = remaining / totalSeconds;
  const urgency = pct < 0.2 ? 'urgent' : pct < 0.4 ? 'warning' : 'normal';

  return (
    <div className={`mock-timer mock-timer--${urgency}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="mock-timer-time">{formatTime(remaining)}</span>
      {urgency === 'urgent' && <span className="mock-timer-warn">⚡ Time almost up</span>}
    </div>
  );
}

// ─── Score Modal ──────────────────────────────────────────────────────────────

function ScoreModal({ questions, outcomes, onClose }) {
  const solved   = Object.values(outcomes).filter(o => o === 'solved').length;
  const partial  = Object.values(outcomes).filter(o => o === 'partial').length;
  const unsolved = questions.length - solved - partial;

  const score = solved * 10 + partial * 4;
  const max   = questions.length * 10;

  const grade =
    score >= max * 0.9 ? 'S' :
    score >= max * 0.7 ? 'A' :
    score >= max * 0.5 ? 'B' :
    score >= max * 0.3 ? 'C' : 'F';

  const gradeColor = { S: '#22c55e', A: '#86efac', B: '#fbbf24', C: '#f97316', F: '#ef4444' };

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="score-modal">
        <div className="score-modal-header">
          <h2 className="score-modal-title">OA Complete 🎉</h2>
        </div>

        <div className="score-modal-body">
          <div className="score-grade" style={{ color: gradeColor[grade] }}>{grade}</div>
          <div className="score-breakdown">
            <div className="score-stat">
              <span className="score-stat-num" style={{ color: '#22c55e' }}>{solved}</span>
              <span className="score-stat-label">Solved</span>
            </div>
            <div className="score-stat">
              <span className="score-stat-num" style={{ color: '#fbbf24' }}>{partial}</span>
              <span className="score-stat-label">Partial</span>
            </div>
            <div className="score-stat">
              <span className="score-stat-num" style={{ color: '#ef4444' }}>{unsolved}</span>
              <span className="score-stat-label">Unsolved</span>
            </div>
            <div className="score-stat">
              <span className="score-stat-num">{score}/{max}</span>
              <span className="score-stat-label">Score</span>
            </div>
          </div>

          <div className="score-questions">
            {questions.map(q => {
              const outcome = outcomes[q.id] || 'unsolved';
              return (
                <div key={q.id} className="score-qrow">
                  <span className={`score-outcome-icon score-outcome-icon--${outcome}`}>
                    {outcome === 'solved' ? '✅' : outcome === 'partial' ? '⚡' : '❌'}
                  </span>
                  <a href={lcUrl(q.slug)} target="_blank" rel="noopener noreferrer" className="score-qlink">
                    {q.title}
                  </a>
                  <span className="score-diff-badge">{q.difficulty}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="score-modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose} id="score-close-btn">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main MockOA ───────────────────────────────────────────────────────────────

const PHASES = ['config', 'active', 'review'];

export default function MockOA() {
  const navigate = useNavigate();
  const [phase, setPhase]         = useState('config');
  const [duration, setDuration]   = useState(DEFAULT_DURATION_MIN);
  const [questions, setQuestions] = useState([]);
  const [started, setStarted]     = useState(false);
  const [expired, setExpired]     = useState(false);
  const [outcomes, setOutcomes]   = useState({});
  const [showScore, setShowScore] = useState(false);

  const seed = useMemo(() => todayISO().split('-').join('').charCodeAt(0) * 997, []);

  function startSession() {
    const qs = selectMockQuestions(ALL_TOPICS, seed + duration);
    setQuestions(qs);
    setOutcomes(Object.fromEntries(qs.map(q => [q.id, 'unsolved'])));
    setPhase('active');
    setStarted(true);
  }

  const handleExpire = useCallback(() => {
    setExpired(true);
    setPhase('review');
  }, []);

  function markOutcome(questionId, outcome) {
    setOutcomes(prev => ({ ...prev, [questionId]: outcome }));
  }

  function submitSession() {
    setShowScore(true);
  }

  // ── Config screen ──────────────────────────────────────────────────────────

  if (phase === 'config') {
    return (
      <div className="mock-page">
        <div className="mock-config-card">
          <button type="button" className="mock-back-btn" onClick={() => navigate('/practice')}>
            ← Back
          </button>
          <div className="mock-config-icon">🎯</div>
          <h2 className="mock-config-title">Mock OA Mode</h2>
          <p className="mock-config-desc">
            Simulates a real online assessment: timed, cold start, no hints.
            4 questions — 1 Easy · 2 Medium · 1 Hard.
          </p>

          <div className="mock-config-field">
            <label className="mock-config-label" htmlFor="mock-duration">Duration (minutes)</label>
            <div className="mock-duration-options">
              {[60, 90, 120].map(d => (
                <button
                  key={d}
                  id={`mock-duration-${d}`}
                  type="button"
                  className={`mock-duration-btn ${duration === d ? 'mock-duration-btn--active' : ''}`}
                  onClick={() => setDuration(d)}
                >
                  {d}m
                </button>
              ))}
              <input
                id="mock-duration"
                type="number"
                min="15"
                max="240"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="mock-duration-input"
                aria-label="Custom duration"
              />
            </div>
          </div>

          <div className="mock-config-rules">
            <div className="mock-rule">⏱ Timer visible but can be hidden</div>
            <div className="mock-rule">🚫 No hints — treat it like the real thing</div>
            <div className="mock-rule">📝 Self-report: Solved / Partial / Unsolved</div>
            <div className="mock-rule">💾 Results saved to history</div>
          </div>

          <button
            type="button"
            className="btn btn-primary mock-start-btn"
            onClick={startSession}
            id="mock-start-btn"
          >
            Start OA →
          </button>
        </div>
      </div>
    );
  }

  // ── Active / Review screen ─────────────────────────────────────────────────

  return (
    <div className="mock-page">
      <div className="mock-session">
        {/* Header */}
        <div className="mock-session-header">
          <div className="mock-session-title-group">
            <span className="mock-session-label">🎯 Mock OA</span>
            {expired && <span className="mock-expired-badge">⏰ Time Up</span>}
          </div>

          <CountdownTimer
            totalSeconds={duration * 60}
            started={started && phase === 'active'}
            onExpire={handleExpire}
          />

          <div className="mock-session-controls">
            {phase === 'active' && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => { setPhase('review'); }}
                id="mock-finish-early-btn"
              >
                Finish Early
              </button>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="mock-questions">
          {questions.map((q, i) => (
            <div key={q.id} className="mock-qcard" id={`mock-q-${q.id}`}>
              <div className="mock-qcard-num">Q{i + 1}</div>
              <div className="mock-qcard-body">
                <div className="mock-qcard-title-row">
                  <a
                    href={lcUrl(q.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mock-qcard-title"
                    id={`mock-qlink-${q.id}`}
                  >
                    {q.title}
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mock-qcard-ext">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                  <span className={`badge ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                </div>

                {/* Outcome buttons — only shown in review phase or when expired */}
                {(phase === 'review' || expired) && (
                  <div className="mock-outcome-btns">
                    {[
                      { id: 'solved',   label: '✅ Solved',   desc: 'Correct, accepted solution' },
                      { id: 'partial',  label: '⚡ Partial',  desc: 'Made progress but not AC' },
                      { id: 'unsolved', label: '❌ Unsolved', desc: 'Couldn\'t complete it' },
                    ].map(o => (
                      <button
                        key={o.id}
                        id={`mock-outcome-${q.id}-${o.id}`}
                        type="button"
                        className={`mock-outcome-btn ${outcomes[q.id] === o.id ? 'mock-outcome-btn--active' : ''}`}
                        onClick={() => markOutcome(q.id, o.id)}
                      >
                        <span className="mock-outcome-label">{o.label}</span>
                        <span className="mock-outcome-desc">{o.desc}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        {(phase === 'review' || expired) && (
          <div className="mock-submit-bar">
            <p className="mock-submit-hint">Self-report your result for each question, then submit.</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={submitSession}
              id="mock-submit-btn"
            >
              Submit Session
            </button>
          </div>
        )}
      </div>

      {showScore && (
        <ScoreModal
          questions={questions}
          outcomes={outcomes}
          onClose={() => navigate('/practice')}
        />
      )}
    </div>
  );
}
