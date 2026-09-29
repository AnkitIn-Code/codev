import { useState, useMemo, useEffect, useRef } from 'react';
import { ALL_TOPICS } from '../../../data/practice/index.js';
import {
  getAttempts,
  logAttempt,
  resetQuestionAttempts,
  updatePlanQuestion,
  todayISO,
} from '../../../lib/practice/store.js';
import LogAttemptModal from '../../../components/LogAttemptModal/LogAttemptModal.jsx';
import './PatternsTab.css';

/* ─── helpers ─────────────────────────────────────────────────────────── */
function lcUrl(slug) { return `https://leetcode.com/problems/${slug}/`; }
function questionUrl(q) { return q.url || lcUrl(q.slug); }
function getPlatform(q) {
  if (q.url) {
    if (q.url.includes('geeksforgeeks.org')) return { label: 'GFG', title: 'Open on GeeksforGeeks', isCustom: true };
    if (q.url.includes('lintcode.com')) return { label: 'LintCode', title: 'Open on LintCode', isCustom: true };
    return { label: 'External', title: 'Open problem link', isCustom: true };
  }
  return { label: 'LeetCode', title: 'Open on LeetCode', isCustom: false };
}
function diffCls(d = '') { return d.toLowerCase(); }

/* ─── icons ─────────────────────────────────────────────────────────────── */
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const ExtIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════════════════ */
export default function PatternsTab({ filterTopicId, onClearTopicFilter }) {
  const [search, setSearch] = useState('');
  const [activeTopic, setActiveTopic] = useState(filterTopicId || ALL_TOPICS[0]?.id || '');
  const [diffFilter, setDiffFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openHintsMap, setOpenHintsMap] = useState({});
  const [activeModalQuestion, setActiveModalQuestion] = useState(null);
  const [randomNotice, setRandomNotice] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [sidebarSearch, setSidebarSearch] = useState('');
  const contentRef = useRef(null);

  /* ── Sync prop filter ─────────────────────────────────────────────────── */
  useEffect(() => {
    if (filterTopicId) setActiveTopic(filterTopicId);
  }, [filterTopicId]);

  /* ── Reactive store updates ───────────────────────────────────────────── */
  useEffect(() => {
    const onUpdate = () => setRefreshKey(k => k + 1);
    window.addEventListener('fc-practice-updated', onUpdate);
    return () => window.removeEventListener('fc-practice-updated', onUpdate);
  }, []);

  /* ── Attempts map ─────────────────────────────────────────────────────── */
  const latestAttempts = useMemo(() => {
    const attempts = getAttempts();
    const map = {};
    for (const a of attempts) {
      if (a.questionId) map[a.questionId] = a;
      if (a.slug) map[a.slug] = a;
    }
    return map;
  }, [refreshKey]);

  function getAttempt(q) {
    if (!q) return null;
    return latestAttempts[q.id] || (q.slug ? latestAttempts[q.slug] : null);
  }

  /* ── Global stats ─────────────────────────────────────────────────────── */
  const globalStats = useMemo(() => {
    let total = 0, clean = 0, weak = 0;
    for (const topic of ALL_TOPICS)
      for (const pattern of topic.patterns)
        for (const q of pattern.questions) {
          total++;
          const o = getAttempt(q)?.outcome;
          if (o === 'clean') clean++;
          else if (o === 'hinted' || o === 'failed') weak++;
        }
    return { total, clean, weak, pct: total ? Math.round((clean / total) * 100) : 0 };
  }, [latestAttempts]);

  /* ── Per-topic stats ──────────────────────────────────────────────────── */
  const topicStats = useMemo(() => {
    const map = {};
    for (const topic of ALL_TOPICS) {
      let total = 0, clean = 0;
      for (const p of topic.patterns)
        for (const q of p.questions) { total++; if (getAttempt(q)?.outcome === 'clean') clean++; }
      map[topic.id] = { total, clean, pct: total ? Math.round((clean / total) * 100) : 0 };
    }
    return map;
  }, [latestAttempts]);

  /* ── Active topic data ────────────────────────────────────────────────── */
  const activeTopicData = useMemo(() => ALL_TOPICS.find(t => t.id === activeTopic), [activeTopic]);

  /* ── Filtered patterns for active topic ──────────────────────────────── */
  const filteredPatterns = useMemo(() => {
    if (!activeTopicData) return [];
    const q = search.trim().toLowerCase();
    return activeTopicData.patterns
      .map(pattern => {
        const filtered = pattern.questions.filter(question => {
          if (diffFilter !== 'all' && question.difficulty.toLowerCase() !== diffFilter) return false;
          const outcome = getAttempt(question)?.outcome;
          if (statusFilter === 'clean' && outcome !== 'clean') return false;
          if (statusFilter === 'weak' && outcome !== 'hinted' && outcome !== 'failed') return false;
          if (statusFilter === 'unattempted' && outcome) return false;
          if (q) {
            const hay = `${question.title} ${question.hints?.recognition || ''} ${question.hints?.structure || ''}`.toLowerCase();
            if (!hay.includes(q)) return false;
          }
          return true;
        });
        return filtered.length ? { ...pattern, questions: filtered } : null;
      })
      .filter(Boolean);
  }, [activeTopicData, search, diffFilter, statusFilter, latestAttempts]);

  /* ── Sidebar topic list ───────────────────────────────────────────────── */
  const sidebarTopics = useMemo(() => {
    if (!sidebarSearch.trim()) return ALL_TOPICS;
    const q = sidebarSearch.toLowerCase();
    return ALL_TOPICS.filter(t => t.name.toLowerCase().includes(q));
  }, [sidebarSearch]);

  /* ── Handlers ─────────────────────────────────────────────────────────── */
  function handleCheckboxClick(question, pattern, topic) {
    const current = getAttempt(question)?.outcome;
    if (current === 'clean' || current === 'hinted') {
      const d = todayISO();
      resetQuestionAttempts(question.id);
      if (question.slug) resetQuestionAttempts(question.slug);
      updatePlanQuestion(d, question.id, false);
      if (question.slug) updatePlanQuestion(d, question.slug, false);
    } else {
      setActiveModalQuestion({ question, pattern, topic: activeTopicData });
    }
  }

  function handleModalSave(data) {
    if (!activeModalQuestion) return;
    const { question, pattern, topic } = activeModalQuestion;
    const planDate = todayISO();
    logAttempt({
      questionId: question.id, title: question.title, slug: question.slug,
      difficulty: question.difficulty, patternId: pattern.id, patternName: pattern.name,
      topicId: topic.id, topicName: topic.name,
      outcome: data.outcome, stuckReason: data.stuckReason, note: data.note,
      minutes: data.minutes, date: planDate,
    });
    const isCompleted = data.outcome !== 'failed';
    updatePlanQuestion(planDate, question.id, isCompleted);
    if (question.slug) updatePlanQuestion(planDate, question.slug, isCompleted);
    if (data.outcome === 'clean' && question.slug) {
      try {
        const raw = localStorage.getItem('fc-solved-problems');
        const set = new Set(raw ? JSON.parse(raw) : []);
        set.add(question.slug);
        localStorage.setItem('fc-solved-problems', JSON.stringify(Array.from(set)));
        window.dispatchEvent(new Event('fc-solved-updated'));
      } catch {}
    }
    setActiveModalQuestion(null);
  }

  function handleRandomQuestion() {
    const unsolved = [];
    for (const topic of ALL_TOPICS)
      for (const pattern of topic.patterns)
        for (const q of pattern.questions)
          if (getAttempt(q)?.outcome !== 'clean') unsolved.push({ question: q, pattern, topic });
    const pool = unsolved.length > 0 ? unsolved : ALL_TOPICS.flatMap(t => t.patterns.flatMap(p => p.questions.map(q => ({ question: q, pattern: p, topic: t }))));
    if (!pool.length) return;
    const chosen = pool[Math.floor(Math.random() * pool.length)];
    setActiveTopic(chosen.topic.id);
    setSearch('');
    setDiffFilter('all');
    setStatusFilter('all');
    setRandomNotice(`🎯 Picked: ${chosen.question.title}`);
    setTimeout(() => setRandomNotice(null), 4000);
    setTimeout(() => {
      const el = document.getElementById(`q-${chosen.question.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ptnav-q--pulse');
        setTimeout(() => el.classList.remove('ptnav-q--pulse'), 2000);
      }
    }, 200);
  }

  function toggleHints(qId) {
    setOpenHintsMap(p => ({ ...p, [qId]: !p[qId] }));
  }

  /* ─── Scroll content to top when topic changes ─────────────────────── */
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activeTopic]);

  /* ═════════════════════════════════════════════════════════════════════
     Render
     ═════════════════════════════════════════════════════════════════════ */
  return (
    <div className="ptnav-root">

      {/* ══ LEFT SIDEBAR ══════════════════════════════════════════════ */}
      <aside className="ptnav-sidebar">

        {/* Sidebar header */}
        <div className="ptnav-sidebar-header">
          <div className="ptnav-brand">
            <span className="ptnav-brand-icon">📚</span>
            <div>
              <div className="ptnav-brand-title">DSA Patterns</div>
              <div className="ptnav-brand-sub">{ALL_TOPICS.length} topics · {globalStats.total} problems</div>
            </div>
          </div>

          {/* Global progress ring */}
          <div className="ptnav-global-ring" title={`${globalStats.pct}% mastered`}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="4" />
              <circle
                cx="26" cy="26" r="22" fill="none"
                stroke="url(#ringGrad)" strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - globalStats.pct / 100)}`}
                transform="rotate(-90 26 26)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="ptnav-ring-label">
              <div className="ptnav-ring-pct">{globalStats.pct}%</div>
            </div>
          </div>
        </div>

        {/* Mini global stats */}
        <div className="ptnav-global-stats">
          <div className="ptnav-gstat">
            <span className="ptnav-gstat-val" style={{ color: '#34d399' }}>{globalStats.clean}</span>
            <span className="ptnav-gstat-lbl">Mastered</span>
          </div>
          <div className="ptnav-gstat-sep" />
          <div className="ptnav-gstat">
            <span className="ptnav-gstat-val" style={{ color: '#fb7185' }}>{globalStats.weak}</span>
            <span className="ptnav-gstat-lbl">Needs Work</span>
          </div>
          <div className="ptnav-gstat-sep" />
          <div className="ptnav-gstat">
            <span className="ptnav-gstat-val">{globalStats.total - globalStats.clean - globalStats.weak}</span>
            <span className="ptnav-gstat-lbl">Untouched</span>
          </div>
        </div>

        {/* Sidebar search */}
        <div className="ptnav-sidebar-search-wrap">
          <SearchIcon />
          <input
            className="ptnav-sidebar-search"
            placeholder="Find topic…"
            value={sidebarSearch}
            onChange={e => setSidebarSearch(e.target.value)}
          />
        </div>

        {/* Topic list */}
        <nav className="ptnav-topic-list">
          {sidebarTopics.map(topic => {
            const s = topicStats[topic.id];
            const isActive = topic.id === activeTopic;
            const barWidth = s.pct;
            return (
              <button
                key={topic.id}
                className={`ptnav-topic-item ${isActive ? 'ptnav-topic-item--active' : ''}`}
                onClick={() => {
                  setActiveTopic(topic.id);
                  if (onClearTopicFilter) onClearTopicFilter();
                }}
              >
                <div className="ptnav-topic-item-top">
                  <span className="ptnav-topic-icon">{topic.icon}</span>
                  <span className="ptnav-topic-name">{topic.name}</span>
                  <span className="ptnav-topic-count">{s.clean}/{s.total}</span>
                </div>
                <div className="ptnav-topic-bar-track">
                  <div
                    className="ptnav-topic-bar-fill"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </button>
            );
          })}
        </nav>

        {/* Random button */}
        <div className="ptnav-sidebar-footer">
          <button className="ptnav-random-btn" onClick={handleRandomQuestion}>
            🎲 Random Problem
          </button>
        </div>
      </aside>

      {/* ══ MAIN CONTENT ══════════════════════════════════════════════ */}
      <main className="ptnav-content" ref={contentRef}>

        {/* Random notice */}
        {randomNotice && (
          <div className="ptnav-toast" role="status">{randomNotice}</div>
        )}

        {activeTopicData ? (
          <>


            {/* Filter bar */}
            <div className="ptnav-filter-bar">
              <div className="ptnav-search-wrap">
                <SearchIcon />
                <input
                  id="patterns-search"
                  type="text"
                  className="ptnav-search-input"
                  placeholder="Search questions, hints, patterns…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && (
                  <button className="ptnav-search-clear" onClick={() => setSearch('')}>×</button>
                )}
              </div>

              <div className="ptnav-filter-group">
                {['all', 'easy', 'medium', 'hard'].map(d => (
                  <button
                    key={d}
                    className={`ptnav-flt-btn ptnav-flt-btn--${d} ${diffFilter === d ? 'ptnav-flt-btn--active' : ''}`}
                    onClick={() => setDiffFilter(d)}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>

              <div className="ptnav-filter-group">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'clean', label: '✓ Solved' },
                  { id: 'weak', label: '⚠ Weak' },
                  { id: 'unattempted', label: 'Unsolved' },
                ].map(s => (
                  <button
                    key={s.id}
                    className={`ptnav-flt-btn ${statusFilter === s.id ? 'ptnav-flt-btn--active' : ''}`}
                    onClick={() => setStatusFilter(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Patterns list */}
            {filteredPatterns.length === 0 ? (
              <div className="ptnav-empty">
                <div className="ptnav-empty-icon">🔍</div>
                <h3>No matching questions</h3>
                <p>Try clearing the search or changing filters.</p>
                <button
                  className="ptnav-empty-reset"
                  onClick={() => { setSearch(''); setDiffFilter('all'); setStatusFilter('all'); }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="ptnav-patterns-list">
                {filteredPatterns.map((pattern, patIdx) => (
                  <div key={pattern.id} className="ptnav-pattern-section" id={`pattern-${pattern.id}`}>

                    {/* Pattern header */}
                    <div className="ptnav-pattern-header">
                      <div className="ptnav-pattern-header-left">
                        <span className="ptnav-pattern-num">
                          {String(patIdx + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <div className="ptnav-pattern-name">{pattern.name}</div>
                          {pattern.coreIdea && (
                            <div className="ptnav-pattern-idea">{pattern.coreIdea}</div>
                          )}
                        </div>
                      </div>
                      <div className="ptnav-pattern-header-right">
                        <span className="ptnav-pattern-ds">{pattern.dataStructure}</span>
                        <span className="ptnav-pattern-qcount">{pattern.questions.length} problems</span>
                      </div>
                    </div>

                    {/* Signals */}
                    {pattern.signals?.length > 0 && (
                      <div className="ptnav-signals">
                        <span className="ptnav-signals-label">Signals:</span>
                        {pattern.signals.map((sig, i) => (
                          <span key={i} className="ptnav-signal-chip">{sig}</span>
                        ))}
                      </div>
                    )}

                    {/* Question rows */}
                    <div className="ptnav-q-table">
                      {pattern.questions.map((question, qIdx) => {
                        const attempt = getAttempt(question);
                        const outcome = attempt?.outcome;
                        const isClean = outcome === 'clean';
                        const isHinted = outcome === 'hinted';
                        const isStuck = outcome === 'failed';
                        const isHintsOpen = !!openHintsMap[question.id];
                        const statusKey = isClean ? 'clean' : isHinted ? 'hinted' : isStuck ? 'stuck' : 'none';
                        const platform = getPlatform(question);

                        return (
                          <div
                            key={question.id}
                            id={`q-${question.id}`}
                            className={`ptnav-q ptnav-q--${statusKey}`}
                          >
                            <div className="ptnav-q-row">
                              {/* Index */}
                              <span className="ptnav-q-idx">{qIdx + 1}</span>

                              {/* Checkbox */}
                              <button
                                className={`ptnav-cb ptnav-cb--${statusKey}`}
                                onClick={() => handleCheckboxClick(question, pattern, activeTopicData)}
                                title={isClean ? 'Click to unmark' : 'Log attempt'}
                                aria-label={`Mark ${question.title}`}
                              >
                                {isClean && <CheckIcon />}
                                {isHinted && <span style={{ fontSize: '9px' }}>💡</span>}
                              </button>

                              {/* Title + link */}
                              <a
                                href={questionUrl(question)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`ptnav-q-title ptnav-q-title--${statusKey}`}
                                title={platform.title}
                              >
                                {question.title}
                                {platform.isCustom && (
                                  <span className="ptnav-platform-tag" title={platform.title}>
                                    {platform.label}
                                  </span>
                                )}
                                <ExtIcon />
                              </a>

                              {/* Right side */}
                              <div className="ptnav-q-meta">
                                <span className={`badge ptnav-badge ${diffCls(question.difficulty)}`}>
                                  {question.difficulty}
                                </span>

                                {question.hints && (
                                  <button
                                    className={`ptnav-hint-btn ${isHintsOpen ? 'ptnav-hint-btn--open' : ''}`}
                                    onClick={() => toggleHints(question.id)}
                                    aria-expanded={isHintsOpen}
                                  >
                                    💡 Hints {isHintsOpen ? '▲' : '▼'}
                                  </button>
                                )}

                                <button
                                  className={`ptnav-status ptnav-status--${statusKey}`}
                                  onClick={() => handleCheckboxClick(question, pattern, activeTopicData)}
                                >
                                  {isClean && '✓ Solved'}
                                  {isHinted && '💡 Hinted'}
                                  {isStuck && '✕ Stuck'}
                                  {!isClean && !isHinted && !isStuck && 'Attempt'}
                                </button>
                              </div>
                            </div>

                            {/* Hints drawer */}
                            {isHintsOpen && question.hints && (
                              <div className="ptnav-hints-drawer">
                                {question.hints.recognition && (
                                  <div className="ptnav-hint-block">
                                    <span className="ptnav-hint-label">🎯 Pattern Recognition</span>
                                    <p className="ptnav-hint-text">{question.hints.recognition}</p>
                                  </div>
                                )}
                                {question.hints.structure && (
                                  <div className="ptnav-hint-block">
                                    <span className="ptnav-hint-label">🧠 Core Strategy</span>
                                    <p className="ptnav-hint-text">{question.hints.structure}</p>
                                  </div>
                                )}
                                {question.hints.skeleton && (
                                  <div className="ptnav-hint-block">
                                    <span className="ptnav-hint-label">📐 Algorithm Skeleton</span>
                                    <pre className="ptnav-hint-code"><code>{question.hints.skeleton}</code></pre>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="ptnav-empty">
            <div className="ptnav-empty-icon">👈</div>
            <h3>Select a topic from the sidebar</h3>
          </div>
        )}
      </main>

      {/* Modal */}
      {activeModalQuestion && (
        <LogAttemptModal
          questionItem={{
            id: activeModalQuestion.question.id,
            title: activeModalQuestion.question.title,
            slug: activeModalQuestion.question.slug,
            difficulty: activeModalQuestion.question.difficulty,
            patternName: activeModalQuestion.pattern.name,
            topicName: activeTopicData?.name,
          }}
          onSave={handleModalSave}
          onCancel={() => setActiveModalQuestion(null)}
        />
      )}
    </div>
  );
}
