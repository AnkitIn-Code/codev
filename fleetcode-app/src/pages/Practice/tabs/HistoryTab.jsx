import { useState, useMemo, useEffect } from 'react';
import { getAttempts, logAttempt, clearAttempts, todayISO } from '../../../lib/practice/store.js';
import { ALL_TOPICS, getQuestionById, getPatternById, getTopicById } from '../../../data/practice/index.js';
import { useProblems } from '../../../hooks/useProblems.js';
import './HistoryTab.css';

const STUCK_LABELS = {
  'no-approach':    'Missed Pattern Recognition',
  'implementation': 'Implementation / Coding',
  'edge-cases':     'Edge & Corner Cases',
  'complexity':     'Time / Space Complexity',
};

function lcUrl(slug) {
  if (!slug) return 'https://leetcode.com/problemset/';
  return `https://leetcode.com/problems/${slug}/`;
}

function difficultyClass(d = '') {
  return (d || 'medium').toLowerCase();
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function resolveAttemptDetails(attempt, problemsMap = {}) {
  // 1. Check curated questions
  const curatedQ = getQuestionById(attempt.questionId);
  const curatedPattern = getPatternById(attempt.patternId);
  const curatedTopic = getTopicById(attempt.topicId);

  // 2. Look up in 4,023 problems pool if not in curated list
  let poolProblem = null;
  if (!curatedQ && problemsMap) {
    const rawId = attempt.questionId ? String(attempt.questionId).replace(/^prob-/, '').trim() : '';
    poolProblem =
      (rawId ? problemsMap[rawId] : null) ||
      (attempt.num != null ? problemsMap[String(attempt.num)] : null) ||
      (attempt.slug ? problemsMap[attempt.slug.toLowerCase()] : null);
  }

  const title =
    curatedQ?.title ||
    (attempt.title && !attempt.title.startsWith('prob-') ? attempt.title : null) ||
    poolProblem?.Title ||
    attempt.title ||
    (attempt.questionId && !attempt.questionId.startsWith('prob-') ? attempt.questionId : (poolProblem ? poolProblem.Title : 'Problem #' + (poolProblem?.['#'] || '')));

  const slug =
    curatedQ?.slug ||
    poolProblem?.Slug ||
    attempt.slug ||
    '';

  const difficulty =
    curatedQ?.difficulty ||
    poolProblem?.Difficulty ||
    attempt.difficulty ||
    'Medium';

  // Topic resolution: derive real topic tag instead of generic 'DSA'
  const poolTopicTag = poolProblem?.TopicTags?.[0];
  const topicName =
    curatedTopic?.name ||
    poolTopicTag ||
    (attempt.topicName && attempt.topicName !== 'DSA' ? attempt.topicName : null) ||
    (curatedPattern ? 'DSA Pattern' : (poolProblem ? 'Algorithms' : 'DSA'));

  // Pattern resolution: derive actual technique/tags
  const poolPatternTag = poolProblem?.TopicTags && poolProblem.TopicTags.length > 1
    ? poolProblem.TopicTags.slice(0, 2).join(' • ')
    : poolTopicTag;

  const patternName =
    curatedPattern?.name ||
    poolPatternTag ||
    (attempt.patternName && attempt.patternName !== 'Pattern Technique' ? attempt.patternName : null) ||
    'Core Pattern';

  const hasRealInfo = Boolean(
    curatedQ ||
    poolProblem ||
    (attempt.title && !attempt.title.startsWith('prob-')) ||
    (attempt.slug && attempt.slug !== attempt.questionId)
  );

  return {
    ...attempt,
    resolvedTitle: title,
    resolvedSlug: slug,
    resolvedDifficulty: difficulty,
    resolvedTopicName: topicName,
    resolvedPatternName: patternName,
    hasRealInfo,
  };
}

export default function HistoryTab() {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [expandedMap, setExpandedMap] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  const { problems, loading: problemsLoading } = useProblems();

  // Fast problem lookup map by #, id, and slug
  const problemsMap = useMemo(() => {
    const map = {};
    if (!Array.isArray(problems)) return map;
    for (const p of problems) {
      if (p['#'] != null) map[String(p['#'])] = p;
      if (p.id != null) map[String(p.id)] = p;
      if (p.Slug) map[p.Slug.toLowerCase()] = p;
    }
    return map;
  }, [problems]);

  // Reactive store listener
  useEffect(() => {
    function onUpdate() {
      setRefreshKey(k => k + 1);
    }
    window.addEventListener('fc-practice-updated', onUpdate);
    return () => window.removeEventListener('fc-practice-updated', onUpdate);
  }, []);

  // Fetch all attempts with resolved metadata
  const allResolved = useMemo(() => {
    const raw = getAttempts();
    return raw
      .map(att => resolveAttemptDetails(att, problemsMap))
      .filter(item => item.hasRealInfo || item.note) // Omit empty/corrupt test orphans
      .sort((a, b) => b.date.localeCompare(a.date) || (b.questionId || '').localeCompare(a.questionId || ''));
  }, [refreshKey, problemsMap]);

  // Filter by search query and topic
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allResolved.filter(item => {
      // Topic filter
      if (selectedTopic !== 'all') {
        const matchesTopic =
          item.topicId === selectedTopic ||
          item.resolvedTopicName.toLowerCase().includes(selectedTopic.toLowerCase());
        if (!matchesTopic) return false;
      }

      // Search query
      if (q) {
        const text = [
          item.resolvedTitle,
          item.resolvedTopicName,
          item.resolvedPatternName,
          item.note || '',
          item.stuckReason || '',
          item.resolvedDifficulty,
        ].join(' ').toLowerCase();

        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [allResolved, search, selectedTopic]);

  // Separate into 2 lists: Solved Completely (Left) and Review & Missed Patterns (Right)
  const cleanList = useMemo(() => {
    return filtered.filter(a => a.outcome === 'clean');
  }, [filtered]);

  const weakList = useMemo(() => {
    return filtered.filter(a => a.outcome === 'hinted' || a.outcome === 'failed');
  }, [filtered]);

  // Overall statistics
  const totalAttempts = allResolved.length;
  const totalClean    = allResolved.filter(a => a.outcome === 'clean').length;
  const totalWeak     = allResolved.filter(a => a.outcome === 'hinted' || a.outcome === 'failed').length;
  const cleanRate     = totalAttempts > 0 ? Math.round((totalClean / totalAttempts) * 100) : 0;

  function toggleExpand(key) {
    setExpandedMap(prev => ({ ...prev, [key]: !prev[key] }));
  }

  // Clear all history
  function handleClearHistory() {
    if (window.confirm('Are you sure you want to clear your practice history? This will delete all logged attempts and reset your history.')) {
      clearAttempts();
      setRefreshKey(k => k + 1);
    }
  }

  // Mark a weak question as cleanly solved
  function handleMarkClean(item, e) {
    if (e) e.stopPropagation();
    logAttempt({
      questionId: item.questionId,
      title: item.resolvedTitle,
      slug: item.resolvedSlug,
      difficulty: item.resolvedDifficulty,
      patternId: item.patternId,
      patternName: item.resolvedPatternName,
      topicId: item.topicId,
      topicName: item.resolvedTopicName,
      outcome: 'clean',
      date: todayISO(),
    });

    if (item.resolvedSlug) {
      try {
        const raw = localStorage.getItem('fc-solved-problems');
        const set = new Set(raw ? JSON.parse(raw) : []);
        set.add(item.resolvedSlug);
        localStorage.setItem('fc-solved-problems', JSON.stringify(Array.from(set)));
        window.dispatchEvent(new Event('fc-solved-updated'));
      } catch {}
    }
  }

  return (
    <div className="history-tab">
      {/* ── Top Summary Strip (Muted & Calm) ──────────────────────────────── */}
      <div className="history-summary-strip">
        <div className="history-stat-box">
          <span className="history-stat-count">{totalAttempts}</span>
          <span className="history-stat-name">Total Attempted</span>
        </div>
        <div className="history-stat-box history-stat-box--clean">
          <span className="history-stat-count">{totalClean}</span>
          <span className="history-stat-name">Solved Completely</span>
        </div>
        <div className="history-stat-box history-stat-box--weak">
          <span className="history-stat-count">{totalWeak}</span>
          <span className="history-stat-name">Review & Missed Patterns</span>
        </div>
        <div className="history-stat-box">
          <span className="history-stat-count">{cleanRate}%</span>
          <span className="history-stat-name">Clean Solved Rate</span>
        </div>
      </div>

      {/* ── Filter Controls ───────────────────────────────────────────────── */}
      <div className="history-toolbar">
        <div className="history-search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="history-search-icon">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="history-search-input"
            placeholder="Search problems, topics, notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="history-search-input"
          />
          {search && (
            <button
              type="button"
              className="history-search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="history-topic-select-wrap">
          <select
            className="history-topic-select"
            value={selectedTopic}
            onChange={e => setSelectedTopic(e.target.value)}
            id="history-topic-filter"
            aria-label="Filter by Topic"
          >
            <option value="all">All Topics (20)</option>
            {ALL_TOPICS.map(t => (
              <option key={t.id} value={t.id}>
                {t.order}. {t.name}
              </option>
            ))}
          </select>
        </div>

        {allResolved.length > 0 && (
          <button
            type="button"
            className="history-clear-btn"
            onClick={handleClearHistory}
            title="Clear all saved problem attempts and reset history"
            id="history-clear-all-btn"
          >
            🗑️ Clear History
          </button>
        )}
      </div>

      {/* ── Empty State if no problems saved yet ───────────────────────────── */}
      {allResolved.length === 0 && (
        <div className="history-empty-banner">
          <span className="history-empty-icon">🍃</span>
          <div className="history-empty-content">
            <h4>No problem attempts recorded yet</h4>
            <p>
              Your history is clean. Solve questions in the <strong>Today</strong> or <strong>Patterns</strong> tab and check them off to track your solved problems, missed patterns, and reflection notes here.
            </p>
          </div>
        </div>
      )}

      {/* ── Two-Column Split Layout ───────────────────────────────────────── */}
      <div className="history-split-grid">
        {/* ── LEFT COLUMN: Solved Completely (Clean) ──────────────────────── */}
        <div className="history-column">
          <div className="history-col-header">
            <div className="history-col-title-row">
              <span className="history-col-title">Solved Completely</span>
              <span className="history-col-counter">{cleanList.length}</span>
            </div>
            <span className="history-col-desc">Problems solved on your own without hints</span>
          </div>

          <div className="history-list">
            {cleanList.length === 0 ? (
              <div className="history-empty-item">
                <span>No clean solves recorded yet</span>
              </div>
            ) : (
              cleanList.map((item, idx) => {
                const itemKey = `clean-${item.questionId}-${idx}`;
                const isExpanded = !!expandedMap[itemKey];

                return (
                  <div key={itemKey} className={`hrow ${isExpanded ? 'hrow--expanded' : ''}`}>
                    {/* Compact Primary Row */}
                    <div className="hrow-main" onClick={() => toggleExpand(itemKey)}>
                      <div className="hrow-left">
                        <span className="hrow-icon-clean">✓</span>
                        <a
                          href={lcUrl(item.resolvedSlug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hrow-title"
                          onClick={e => e.stopPropagation()}
                          title="Solve on LeetCode"
                        >
                          {item.resolvedTitle}
                        </a>
                        <span className="hrow-topic-chip" title="Related Topic">
                          {item.resolvedTopicName}
                        </span>
                      </div>

                      <div className="hrow-right">
                        <span className={`badge ${difficultyClass(item.resolvedDifficulty)}`}>
                          {item.resolvedDifficulty}
                        </span>
                        <button
                          type="button"
                          className="hrow-expand-btn"
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? '▲' : '▼'}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="hrow-details">
                        <div className="hrow-details-grid">
                          <div>
                            <span className="hrow-detail-label">Topic:</span>
                            <span className="hrow-detail-val">{item.resolvedTopicName}</span>
                          </div>
                          <div>
                            <span className="hrow-detail-label">Pattern:</span>
                            <span className="hrow-detail-val">{item.resolvedPatternName}</span>
                          </div>
                          <div>
                            <span className="hrow-detail-label">Solved On:</span>
                            <span className="hrow-detail-val">{formatDate(item.date)}</span>
                          </div>
                          {item.minutes && (
                            <div>
                              <span className="hrow-detail-label">Time:</span>
                              <span className="hrow-detail-val">{item.minutes}m</span>
                            </div>
                          )}
                        </div>
                        <div className="hrow-details-actions">
                          <a
                            href={lcUrl(item.resolvedSlug)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hrow-link-btn"
                          >
                            Open on LeetCode ↗
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Review & Missed Patterns (Hinted & Stuck) ──────── */}
        <div className="history-column">
          <div className="history-col-header">
            <div className="history-col-title-row">
              <span className="history-col-title">Review & Missed Patterns</span>
              <span className="history-col-counter history-col-counter--weak">{weakList.length}</span>
            </div>
            <span className="history-col-desc">Problems where hints were needed · Click to view reflections & missed patterns</span>
          </div>

          <div className="history-list">
            {weakList.length === 0 ? (
              <div className="history-empty-item">
                <span>No missed patterns recorded yet</span>
              </div>
            ) : (
              weakList.map((item, idx) => {
                const itemKey = `weak-${item.questionId}-${idx}`;
                const isExpanded = !!expandedMap[itemKey];
                const isFailed = item.outcome === 'failed';

                return (
                  <div key={itemKey} className={`hrow ${isExpanded ? 'hrow--expanded' : ''} ${isFailed ? 'hrow--failed' : 'hrow--hinted'}`}>
                    {/* Compact Primary Row: Problem Name + Topic Tag + Status */}
                    <div className="hrow-main" onClick={() => toggleExpand(itemKey)}>
                      <div className="hrow-left">
                        <span className="hrow-icon-status" title={isFailed ? 'Could not solve' : 'Used hints'}>
                          {isFailed ? '❌' : '💡'}
                        </span>
                        <a
                          href={lcUrl(item.resolvedSlug)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hrow-title"
                          onClick={e => e.stopPropagation()}
                          title="Solve on LeetCode"
                        >
                          {item.resolvedTitle}
                        </a>
                        <span className="hrow-topic-chip" title="Related Topic">
                          {item.resolvedTopicName}
                        </span>
                      </div>

                      <div className="hrow-right">
                        <span className={`badge ${difficultyClass(item.resolvedDifficulty)}`}>
                          {item.resolvedDifficulty}
                        </span>
                        <button
                          type="button"
                          className="hrow-expand-btn"
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? '▲' : '▼'}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Details: Missed Pattern, Reason, Reflection Comment */}
                    {isExpanded && (
                      <div className="hrow-details">
                        <div className="hrow-details-grid">
                          <div>
                            <span className="hrow-detail-label">Topic:</span>
                            <span className="hrow-detail-val hrow-detail-val--topic">{item.resolvedTopicName}</span>
                          </div>
                          <div>
                            <span className="hrow-detail-label">Missed Pattern:</span>
                            <span className="hrow-detail-val hrow-detail-val--pattern">{item.resolvedPatternName}</span>
                          </div>
                          {item.stuckReason && (
                            <div>
                              <span className="hrow-detail-label">Stuck Reason:</span>
                              <span className="hrow-detail-val hrow-detail-val--reason">
                                {STUCK_LABELS[item.stuckReason] || item.stuckReason}
                              </span>
                            </div>
                          )}
                          <div>
                            <span className="hrow-detail-label">Attempted:</span>
                            <span className="hrow-detail-val">{formatDate(item.date)}</span>
                          </div>
                        </div>

                        {/* Reflection Comment */}
                        <div className="hrow-reflection-box">
                          <span className="hrow-reflection-label">
                            Why hint was used (Your reflection):
                          </span>
                          <p className="hrow-reflection-text">
                            {item.note ? `"${item.note}"` : 'No reflection note provided for this attempt.'}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="hrow-details-actions">
                          <a
                            href={lcUrl(item.resolvedSlug)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hrow-link-btn"
                          >
                            Retry on LeetCode ↗
                          </a>
                          <button
                            type="button"
                            className="hrow-clean-btn"
                            onClick={(e) => handleMarkClean(item, e)}
                            title="Mark this problem as solved cleanly"
                          >
                            ✓ Mark Solved Cleanly
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
