import { useState, useMemo, useCallback, useEffect } from 'react';
import { ALL_TOPICS } from '../../../data/practice/index.js';
import { useProblems } from '../../../hooks/useProblems.js';
import {
  getTodaysPlan,
  planTotalQuestions,
  planDoneCount,
} from '../../../lib/practice/dailyPlan.js';
import {
  getAttempts,
  logAttempt,
  updatePlanQuestion,
  getCurrentStreak,
  todayISO,
  resetQuestionAttempts,
  getLatestAttempt,
  resetTodayPlanProgress,
} from '../../../lib/practice/store.js';
import LogAttemptModal from '../../../components/LogAttemptModal/LogAttemptModal.jsx';
import './TodayTab.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function difficultyClass(d) {
  if (!d) return 'medium';
  return d.toLowerCase();
}

function questionUrl(item) {
  if (!item) return 'https://leetcode.com/problemset/';
  if (item.url) return item.url;
  const slug = item.slug || (item.title ? item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '');
  return `https://leetcode.com/problems/${slug}/`;
}

// ─── Progress Ring (SVG) ──────────────────────────────────────────────────────

function ProgressRing({ done, total, size = 64 }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? done / total : 0;
  const dash = pct * circ;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="progress-ring-svg">
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth="6"
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="progress-ring-arc"
      />
      <text
        x="50%" y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fill="var(--text)"
      >
        {done}/{total}
      </text>
    </svg>
  );
}

// ─── Question Row Component ───────────────────────────────────────────────────

function QuestionRow({ questionItem, planDate, onUpdate }) {
  const [showHints, setShowHints] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const qId = questionItem.questionId || questionItem.id;
  const title = questionItem.title || 'Untitled Problem';
  const slug = questionItem.slug || '';
  const difficulty = questionItem.difficulty || 'Medium';
  const is4023 = !!questionItem.is4023;
  const tags = questionItem.tags || [];
  const patternName = questionItem.patternName || questionItem.topicName;
  const hints = questionItem.hints;

  // Retrieve current attempt state from store if any (checks both qId and slug)
  const currentAttempt = useMemo(() => {
    return getLatestAttempt(qId) || (slug ? getLatestAttempt(slug) : null);
  }, [qId, slug]);

  const isDone = !!questionItem.done || (currentAttempt != null && currentAttempt.outcome !== 'failed');

  function handleCheckboxClick() {
    if (isDone) {
      // Uncheck: clear done in plan & reset attempts for this question
      updatePlanQuestion(planDate, qId, false);
      if (slug) updatePlanQuestion(planDate, slug, false);
      resetQuestionAttempts(qId);
      if (slug) resetQuestionAttempts(slug);
      onUpdate();
    } else {
      // Open attempt modal to ask outcome and notes
      setShowModal(true);
    }
  }

  function handleSaveAttempt(data) {
    const isClean = data.outcome === 'clean';
    const isCompleted = data.outcome !== 'failed';

    // 1. Update plan question checkbox state
    updatePlanQuestion(planDate, qId, isCompleted);
    if (slug) updatePlanQuestion(planDate, slug, isCompleted);

    // 2. Derive topic & pattern from question metadata/tags so real info is always saved
    const tags = questionItem.tags || [];
    const derivedTopic = questionItem.topicName || (tags.length > 0 ? tags[0] : 'Algorithms');
    const derivedPattern = questionItem.patternName || (tags.length > 1 ? tags.slice(0, 2).join(' • ') : derivedTopic);

    // Log in practice store with all details
    logAttempt({
      questionId: qId,
      title,
      slug,
      num: questionItem.num,
      difficulty,
      patternId: questionItem.patternId || 'practice',
      patternName: derivedPattern,
      topicId: questionItem.topicId || 'practice',
      topicName: derivedTopic,
      outcome: data.outcome,
      stuckReason: data.stuckReason,
      note: data.note,
      minutes: data.minutes,
      date: todayISO(),
    });

    // 3. If clean, also sync to app-wide fc-solved-problems
    if (isClean && slug) {
      try {
        const raw = localStorage.getItem('fc-solved-problems');
        const set = new Set(raw ? JSON.parse(raw) : []);
        set.add(slug);
        if (questionItem.num != null) set.add(String(questionItem.num));
        localStorage.setItem('fc-solved-problems', JSON.stringify(Array.from(set)));
        window.dispatchEvent(new Event('fc-solved-updated'));
      } catch {}
    }

    setShowModal(false);
    onUpdate();
  }

  return (
    <>
      <div className={`qrow ${isDone ? 'qrow--done' : ''}`} id={`today-q-${qId}`}>
        {/* Checkbox */}
        <button
          type="button"
          className={`qrow-checkbox ${isDone ? 'qrow-checkbox--checked' : ''}`}
          onClick={handleCheckboxClick}
          aria-label={isDone ? 'Mark as not done' : 'Mark as done'}
          id={`qrow-check-${qId}`}
          title={isDone ? 'Click to uncheck' : 'Click to log completion'}
        >
          {isDone && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        {/* Main Body */}
        <div className="qrow-body">
          <div className="qrow-title-row">
            {questionItem.num != null && (
              <span className="qrow-num">#{questionItem.num}.</span>
            )}

            <a
              href={questionUrl(questionItem)}
              target="_blank"
              rel="noopener noreferrer"
              className="qrow-title"
              id={`qrow-link-${qId}`}
              title={questionItem.url ? 'Open problem link' : 'Solve on LeetCode'}
            >
              {title}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="qrow-ext-icon">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>

            <span className={`badge ${difficultyClass(difficulty)}`}>
              {difficulty}
            </span>

            {/* Pattern badge */}
            {patternName && (
              <span className="qrow-dp-pattern-badge">
                🧩 {patternName}
              </span>
            )}

            {/* Outcome badge if already attempted */}
            {currentAttempt && (
              <span className={`qrow-status-pill qrow-status-pill--${currentAttempt.outcome}`}>
                {currentAttempt.outcome === 'clean' && '✅ Clean'}
                {currentAttempt.outcome === 'hinted' && '💡 Used Hints'}
                {currentAttempt.outcome === 'failed' && '❌ Stuck'}
              </span>
            )}
          </div>

          {/* Tags */}
          {is4023 && tags.length > 0 && (
            <div className="qrow-meta">
              <div className="qrow-tags-wrap">
                {tags.slice(0, 3).map((tag, tIdx) => (
                  <span key={tIdx} className="qrow-tag-chip">{tag}</span>
                ))}
                {tags.length > 3 && (
                  <span className="qrow-tag-chip qrow-tag-chip--more">+{tags.length - 3}</span>
                )}
              </div>
            </div>
          )}

          {/* Hints Drawer */}
          {showHints && hints && (
            <div className="qrow-hints-box">
              {hints.recognition && (
                <div className="qrow-hint-block">
                  <span className="qrow-hint-label">Pattern Recognition</span>
                  <p className="qrow-hint-text">{hints.recognition}</p>
                </div>
              )}
              {hints.structure && (
                <div className="qrow-hint-block">
                  <span className="qrow-hint-label">Core Strategy</span>
                  <p className="qrow-hint-text">{hints.structure}</p>
                </div>
              )}
              {hints.skeleton && (
                <div className="qrow-hint-block">
                  <span className="qrow-hint-label">Algorithm Skeleton</span>
                  <pre className="qrow-hint-code"><code>{hints.skeleton}</code></pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hints action on the right */}
        {hints && (
          <div className="qrow-actions">
            <button
              type="button"
              className={`qrow-hint-btn ${showHints ? 'qrow-hint-btn--active' : ''}`}
              onClick={() => setShowHints(s => !s)}
              title="Toggle hints and code skeleton"
            >
              💡 Hints {showHints ? '▲' : '▼'}
            </button>
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <LogAttemptModal
          questionItem={questionItem}
          onSave={handleSaveAttempt}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}

// ─── Collapsible Plan Section ─────────────────────────────────────────────────

function PlanSection({ title, subtitle, badge, questions, planDate, onUpdate, icon, sectionClass = '' }) {
  const [open, setOpen] = useState(true);

  return (
    <div className={`plan-section ${sectionClass}`}>
      <button
        type="button"
        className="plan-section-header"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="plan-section-title-group">
          <div className="plan-section-title-row">
            {icon && <span className="plan-section-icon">{icon}</span>}
            <span className="plan-section-title">{title}</span>
            {badge && <span className="plan-section-badge">{badge}</span>}
          </div>
          {subtitle && <span className="plan-section-subtitle">{subtitle}</span>}
        </div>
        <div className="plan-section-right">
          <svg
            width="14" height="14"
            viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            strokeWidth="2.2"
            className={`plan-section-chevron ${open ? 'plan-section-chevron--open' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="plan-section-body">
          {!questions || questions.length === 0 ? (
            <div className="plan-section-empty">Loading questions for today...</div>
          ) : (
            questions.map((item, idx) => (
              <QuestionRow
                key={item.questionId || item.id || idx}
                questionItem={item}
                planDate={planDate}
                onUpdate={onUpdate}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Today Tab ───────────────────────────────────────────────────────────

export default function TodayTab() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { problems, loading: problemsLoading } = useProblems();

  // Re-read when store changes
  useEffect(() => {
    function onStoreUpdate() {
      setRefreshKey(k => k + 1);
    }
    window.addEventListener('fc-practice-updated', onStoreUpdate);
    return () => window.removeEventListener('fc-practice-updated', onStoreUpdate);
  }, []);

  // Generate today's plan targeting 12 questions (6 Random + 4 Pattern + 2 DP)
  const plan = useMemo(() => {
    return getTodaysPlan(ALL_TOPICS, problems || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, problems]);

  // Total target is 8 daily problems (6 Random + 2 DP Focus)
  const total = 8;

  // Compute done count dynamically:
  // 1. Problems done in today's curated plan (Random + DP)
  // 2. PLUS any pattern questions completed today in the Patterns section!
  const done = useMemo(() => {
    const countedKeys = new Set();
    let count = 0;

    // 1. Questions in today's plan that are done
    const planQuestions = [
      ...(plan.randomPractice || []),
      ...(plan.dpFocus || []),
    ];
    for (const q of planQuestions) {
      const qId = q.questionId || q.id;
      const att = getLatestAttempt(qId) || (q.slug ? getLatestAttempt(q.slug) : null);
      if (q.done || (att != null && att.outcome !== 'failed')) {
        count++;
        if (qId) countedKeys.add(String(qId).toLowerCase());
        if (q.slug) countedKeys.add(String(q.slug).toLowerCase());
      }
    }

    // 2. Any pattern questions (or other questions) completed TODAY in Patterns tab
    const today = todayISO();
    const todayAttempts = getAttempts().filter(a => a.date === today && a.outcome !== 'failed');
    for (const a of todayAttempts) {
      const idKey = a.questionId ? String(a.questionId).toLowerCase() : null;
      const slugKey = a.slug ? String(a.slug).toLowerCase() : null;
      const alreadyCounted = (idKey && countedKeys.has(idKey)) || (slugKey && countedKeys.has(slugKey));
      if (!alreadyCounted) {
        count++;
        if (idKey) countedKeys.add(idKey);
        if (slugKey) countedKeys.add(slugKey);
      }
    }

    return count;
  }, [plan, refreshKey]);

  const streak = useMemo(() => getCurrentStreak(), [refreshKey]);

  function getSectionCount(list) {
    if (!Array.isArray(list)) return 0;
    return list.filter(q => {
      const qId = q.questionId || q.id;
      const att = getLatestAttempt(qId) || (q.slug ? getLatestAttempt(q.slug) : null);
      return q.done || (att != null && att.outcome !== 'failed');
    }).length;
  }

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  function handleReroll() {
    getTodaysPlan(ALL_TOPICS, problems || [], true);
    refresh();
  }

  function handleResetProgress() {
    if (window.confirm("Reset today's practice progress and uncheck all problems for today?")) {
      resetTodayPlanProgress();
      refresh();
    }
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (problemsLoading && (!problems || problems.length === 0)) {
    return (
      <div className="today-tab">
        <div className="today-loading-state">
          <div className="today-spinner" />
          <p>Curating today's 8-problem practice plan from 4,000+ problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="today-tab">
      {/* ── Top Header Bar ─────────────────────────────────────────────────── */}
      <div className="today-header">
        <div className="today-date-group">
          <span className="today-date">{dateStr}</span>
          {streak > 0 && (
            <span className="today-streak">🔥 {streak}-day streak</span>
          )}
          <span className="today-target-pill">🎯 Daily Target: 8 Problems</span>
          <button
            type="button"
            className="today-reroll-btn"
            onClick={handleReroll}
            title="Randomly generate a new batch of unsolved questions for today"
          >
            🎲 Re-roll Questions
          </button>
          <button
            type="button"
            className="today-reset-btn"
            onClick={handleResetProgress}
            title="Reset all completed questions for today back to 0/8"
          >
            ↺ Reset Today
          </button>
        </div>
        <ProgressRing done={done} total={total} />
      </div>

      {/* ── Section 1: Random DSA Practice (6 Problems from 4023 pool) ────── */}
      <PlanSection
        title="Random DSA Practice"
        icon="🎲"
        subtitle="6 problems randomly curated from 4,000+ challenges · Only unsolved DSA problems"
        badge={plan.randomPractice?.length > 0 ? `${getSectionCount(plan.randomPractice)}/${plan.randomPractice.length}` : undefined}
        questions={plan.randomPractice || []}
        planDate={plan.date}
        onUpdate={refresh}
        sectionClass="plan-section--random"
      />

      {/* ── Section 2: Daily DP Focus (2 Problems from Distinct DP Patterns) ─ */}
      <PlanSection
        title="Daily DP Focus"
        icon="🧮"
        subtitle="2 questions from strictly different DP patterns · Only unsolved problems"
        badge={plan.dpFocus?.length > 0 ? `${getSectionCount(plan.dpFocus)}/${plan.dpFocus.length}` : undefined}
        questions={plan.dpFocus || []}
        planDate={plan.date}
        onUpdate={refresh}
        sectionClass="plan-section--dp"
      />
    </div>
  );
}
