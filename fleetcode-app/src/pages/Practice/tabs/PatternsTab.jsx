import { useState, useMemo, useEffect } from 'react';
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

function lcUrl(slug) {
  return `https://leetcode.com/problems/${slug}/`;
}

function difficultyClass(d = '') {
  return d.toLowerCase();
}

export default function PatternsTab({ filterTopicId, onClearTopicFilter }) {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(filterTopicId || 'all');
  const [diffFilter, setDiffFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'clean' | 'weak' | 'unattempted'
  const [openHintsMap, setOpenHintsMap] = useState({});
  const [collapsedTopics, setCollapsedTopics] = useState({});
  const [activeModalQuestion, setActiveModalQuestion] = useState(null);
  const [randomNotice, setRandomNotice] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Sync prop filter
  useEffect(() => {
    if (filterTopicId) setSelectedTopic(filterTopicId);
  }, [filterTopicId]);

  // Reactive store updates
  useEffect(() => {
    function onUpdate() {
      setRefreshKey(k => k + 1);
    }
    window.addEventListener('fc-practice-updated', onUpdate);
    return () => window.removeEventListener('fc-practice-updated', onUpdate);
  }, []);

  // Map of questionId / slug -> latest attempt
  const latestAttempts = useMemo(() => {
    const attempts = getAttempts();
    const map = {};
    for (let i = 0; i < attempts.length; i++) {
      const a = attempts[i];
      if (a.questionId) map[a.questionId] = a;
      if (a.slug) map[a.slug] = a;
    }
    return map;
  }, [refreshKey]);

  // Helper to look up attempt by question
  function getAttemptForQuestion(q) {
    if (!q) return null;
    return latestAttempts[q.id] || (q.slug ? latestAttempts[q.slug] : null);
  }

  // Compute global stats
  const stats = useMemo(() => {
    let totalQuestions = 0;
    let cleanCount = 0;
    let weakCount = 0;

    for (const topic of ALL_TOPICS) {
      for (const pattern of topic.patterns) {
        for (const q of pattern.questions) {
          totalQuestions++;
          const outcome = getAttemptForQuestion(q)?.outcome;
          if (outcome === 'clean') cleanCount++;
          else if (outcome === 'hinted' || outcome === 'failed') weakCount++;
        }
      }
    }

    return { totalQuestions, cleanCount, weakCount };
  }, [latestAttempts]);



  // Handle clicking question checkbox: toggle off if done, or open completion modal if undone
  function handleCheckboxClick(question, pattern, topic) {
    const current = getAttemptForQuestion(question)?.outcome;
    if (current === 'clean' || current === 'hinted') {
      const planDate = todayISO();
      resetQuestionAttempts(question.id);
      if (question.slug) resetQuestionAttempts(question.slug);
      updatePlanQuestion(planDate, question.id, false);
      if (question.slug) updatePlanQuestion(planDate, question.slug, false);
    } else {
      setActiveModalQuestion({ question, pattern, topic });
    }
  }

  function handleModalSave(data) {
    if (!activeModalQuestion) return;
    const { question, pattern, topic } = activeModalQuestion;
    const planDate = todayISO();

    logAttempt({
      questionId: question.id,
      title: question.title,
      slug: question.slug,
      difficulty: question.difficulty,
      patternId: pattern.id,
      patternName: pattern.name,
      topicId: topic.id,
      topicName: topic.name,
      outcome: data.outcome,
      stuckReason: data.stuckReason,
      note: data.note,
      minutes: data.minutes,
      date: planDate,
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

  // Pick a random pattern question to practice
  function handlePickRandomPattern() {
    const unsolved = [];
    for (const topic of ALL_TOPICS) {
      for (const pattern of topic.patterns) {
        for (const q of pattern.questions) {
          const outcome = getAttemptForQuestion(q)?.outcome;
          if (outcome !== 'clean') {
            unsolved.push({ question: q, pattern, topic });
          }
        }
      }
    }

    const pool = unsolved.length > 0 ? unsolved : ALL_TOPICS.flatMap(t => t.patterns.flatMap(p => p.questions.map(q => ({ question: q, pattern: p, topic: t }))));
    if (pool.length === 0) return;

    const randomIndex = Math.floor(Math.random() * pool.length);
    const chosen = pool[randomIndex];

    setSelectedTopic('all');
    setCollapsedTopics(prev => ({ ...prev, [chosen.topic.id]: false }));
    setRandomNotice(`Picked: ${chosen.question.title} (${chosen.topic.name})`);
    setTimeout(() => setRandomNotice(null), 4000);

    setTimeout(() => {
      const el = document.getElementById(`q-${chosen.question.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('pt-q-card--highlighted');
        setTimeout(() => {
          el.classList.remove('pt-q-card--highlighted');
        }, 2500);
      }
    }, 150);
  }

  function toggleHints(qId) {
    setOpenHintsMap(prev => ({ ...prev, [qId]: !prev[qId] }));
  }

  function toggleTopicCollapse(topicId) {
    setCollapsedTopics(prev => ({ ...prev, [topicId]: !prev[topicId] }));
  }

  function collapseAll() {
    const all = {};
    for (const t of ALL_TOPICS) all[t.id] = true;
    setCollapsedTopics(all);
  }

  function expandAll() {
    setCollapsedTopics({});
  }

  // Filtered topics and questions
  const filteredTopics = useMemo(() => {
    const q = search.trim().toLowerCase();
    const result = [];

    for (const topic of ALL_TOPICS) {
      if (selectedTopic !== 'all' && topic.id !== selectedTopic) continue;

      const matchedPatterns = [];

      for (const pattern of topic.patterns) {
        const matchedQuestions = pattern.questions.filter(question => {
          // Difficulty filter
          if (diffFilter !== 'all' && question.difficulty.toLowerCase() !== diffFilter) return false;

          // Status filter
          const outcome = getAttemptForQuestion(question)?.outcome;
          if (statusFilter === 'clean' && outcome !== 'clean') return false;
          if (statusFilter === 'weak' && outcome !== 'hinted' && outcome !== 'failed') return false;
          if (statusFilter === 'unattempted' && outcome) return false;

          // Search query
          if (q) {
            const haystack = `${topic.order}. ${topic.name} ${question.title} ${question.hints?.recognition || ''} ${question.hints?.structure || ''}`.toLowerCase();
            if (!haystack.includes(q)) return false;
          }

          return true;
        });

        if (matchedQuestions.length > 0) {
          matchedPatterns.push({
            ...pattern,
            questions: matchedQuestions,
          });
        }
      }

      if (matchedPatterns.length > 0) {
        // Calculate topic progress
        const allTopicQuestions = topic.patterns.flatMap(p => p.questions);
        const topicClean = allTopicQuestions.filter(question => getAttemptForQuestion(question)?.outcome === 'clean').length;

        result.push({
          ...topic,
          patterns: matchedPatterns,
          totalQuestionsInTopic: allTopicQuestions.length,
          cleanCountInTopic: topicClean,
        });
      }
    }

    return result;
  }, [search, selectedTopic, diffFilter, statusFilter, latestAttempts]);

  return (
    <div className="patterns-tab">
      {/* ── Top stats bar ─────────────────────────────────────────────────── */}
      <div className="pt-stats-bar">
        <div className="pt-stats-left">
          <div className="pt-stat-pill">
            <span className="pt-stat-val">20</span>
            <span className="pt-stat-lbl">Topics</span>
          </div>
          <div className="pt-stat-pill">
            <span className="pt-stat-val">{stats.totalQuestions}</span>
            <span className="pt-stat-lbl">Curated Problems</span>
          </div>
          <div className="pt-stat-pill pt-stat-pill--clean">
            <span className="pt-stat-val">{stats.cleanCount}</span>
            <span className="pt-stat-lbl">Mastered (Clean)</span>
          </div>
          {stats.weakCount > 0 && (
            <div className="pt-stat-pill pt-stat-pill--weak">
              <span className="pt-stat-val">{stats.weakCount}</span>
              <span className="pt-stat-lbl">Needs Work</span>
            </div>
          )}
        </div>

        <div className="pt-stats-right">
          <button
            type="button"
            className="pt-random-pattern-btn"
            onClick={handlePickRandomPattern}
            title="Randomly pick an unsolved pattern question to practice"
          >
            🎲 Random Pattern Question
          </button>
          <button type="button" className="pt-collapse-btn" onClick={expandAll} title="Expand all topics">
            Expand All
          </button>
          <button type="button" className="pt-collapse-btn" onClick={collapseAll} title="Collapse all topics">
            Collapse All
          </button>
        </div>
      </div>

      {/* Random Question Toast */}
      {randomNotice && (
        <div className="pt-random-toast" role="status" aria-live="polite">
          <span>🎯 {randomNotice}</span>
        </div>
      )}

      {/* ── Search & Filter Controls ──────────────────────────────────────── */}
      <div className="pt-controls">
        <div className="pt-search-row">
          <div className="pt-search-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="pt-search-icon">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="patterns-search"
              type="text"
              className="pt-search-input"
              placeholder="Search problems by name, pattern, topic, or keywords..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search problems"
            />
            {search && (
              <button type="button" className="pt-search-clear" onClick={() => setSearch('')}>
                ×
              </button>
            )}
          </div>

          {/* Difficulty filter buttons */}
          <div className="pt-filter-group" role="group" aria-label="Filter by difficulty">
            {['all', 'easy', 'medium', 'hard'].map(d => (
              <button
                key={d}
                type="button"
                className={`pt-filter-btn pt-filter-btn--${d} ${diffFilter === d ? 'pt-filter-btn--active' : ''}`}
                onClick={() => setDiffFilter(d)}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>

          {/* Status filter buttons */}
          <div className="pt-filter-group" role="group" aria-label="Filter by status">
            {[
              { id: 'all', label: 'All' },
              { id: 'clean', label: '✓ Solved' },
              { id: 'weak', label: '⚠️ Weak' },
              { id: 'unattempted', label: 'Unsolved' },
            ].map(s => (
              <button
                key={s.id}
                type="button"
                className={`pt-filter-btn ${statusFilter === s.id ? 'pt-filter-btn--active' : ''}`}
                onClick={() => setStatusFilter(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Topic Selector Pills (All 20 Topics) ──────────────────────────── */}
        <div className="pt-topic-pills-bar" role="group" aria-label="Select topic">
          <button
            type="button"
            className={`pt-topic-pill ${selectedTopic === 'all' ? 'pt-topic-pill--active' : ''}`}
            onClick={() => {
              setSelectedTopic('all');
              if (onClearTopicFilter) onClearTopicFilter();
            }}
          >
            All Topics (20)
          </button>
          {ALL_TOPICS.map(t => (
            <button
              key={t.id}
              type="button"
              className={`pt-topic-pill ${selectedTopic === t.id ? 'pt-topic-pill--active' : ''}`}
              onClick={() => setSelectedTopic(t.id)}
            >
              <span className="pt-pill-order">{t.order}.</span> {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Topic Sections List ───────────────────────────────────────────── */}
      <div className="pt-topics-container">
        {filteredTopics.length === 0 ? (
          <div className="pt-no-results">
            <div className="pt-no-results-icon">🔍</div>
            <h3>No matching problems found</h3>
            <p>Try adjusting your search query, difficulty, or status filter.</p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setSearch('');
                setSelectedTopic('all');
                setDiffFilter('all');
                setStatusFilter('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredTopics.map(topic => {
            const isCollapsed = collapsedTopics[topic.id];
            const questions = topic.patterns.flatMap(p => p.questions);
            const cleanCount = topic.cleanCountInTopic || 0;
            const totalCount = topic.totalQuestionsInTopic || questions.length;
            const pct = Math.round((cleanCount / totalCount) * 100);

            return (
              <section key={topic.id} className="pt-topic-section" id={`topic-section-${topic.id}`}>
                {/* Section Header */}
                <div
                  className="pt-section-header"
                  onClick={() => toggleTopicCollapse(topic.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && toggleTopicCollapse(topic.id)}
                >
                  <div className="pt-section-header-left">
                    <span className="pt-section-num">{String(topic.order).padStart(2, '0')}</span>
                    <span className="pt-section-icon">{topic.icon}</span>
                    <div className="pt-section-title-wrap">
                      <h2 className="pt-section-title">{topic.order}. {topic.name}</h2>
                      <p className="pt-section-desc">{topic.description}</p>
                    </div>
                  </div>

                  <div className="pt-section-header-right">
                    <div className="pt-topic-progress">
                      <span className="pt-progress-text">
                        <strong>{cleanCount}</strong> / {totalCount} completed
                      </span>
                      <div className="pt-progress-track" title={`${pct}% completed`}>
                        <div className="pt-progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <span className={`pt-collapse-arrow ${isCollapsed ? 'pt-collapse-arrow--collapsed' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* Section Body / Problem List */}
                {!isCollapsed && (
                  <div className="pt-section-body">
                    {topic.patterns.map(pattern => (
                      <div key={pattern.id} className="pt-pattern-block">
                        {pattern.signals && pattern.signals.length > 0 && (
                          <div className="pt-pattern-signals">
                            <span className="pt-signals-title">Signals:</span>
                            {pattern.signals.map((sig, sIdx) => (
                              <span key={sIdx} className="pt-signal-chip">• {sig}</span>
                            ))}
                          </div>
                        )}

                        <div className="pt-q-list">
                          {pattern.questions.map(question => {
                            const isHintsOpen = !!openHintsMap[question.id];
                            const attempt = getAttemptForQuestion(question);
                            const outcome = attempt?.outcome;
                            const isClean = outcome === 'clean';
                            const isHinted = outcome === 'hinted';
                            const isStuck = outcome === 'failed';

                            return (
                              <div
                                key={question.id}
                                className={`pt-q-card ${isClean ? 'pt-q-card--clean' : isHinted ? 'pt-q-card--hinted' : isStuck ? 'pt-q-card--stuck' : ''}`}
                                id={`q-${question.id}`}
                              >
                                <div className="pt-q-row">
                                  {/* Left: Checkbox + Title + LeetCode Link */}
                                  <div className="pt-q-left">
                                    <button
                                      type="button"
                                      className={`pt-checkbox ${isClean ? 'pt-checkbox--clean' : isHinted ? 'pt-checkbox--hinted' : ''}`}
                                      onClick={() => handleCheckboxClick(question, pattern, topic)}
                                      title={isClean ? 'Cleanly solved (Click to uncheck)' : isHinted ? 'Completed with hints (Click to uncheck)' : 'Click to check off and log completion'}
                                      aria-label={`Mark ${question.title} as completed`}
                                    >
                                      {isClean && (
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                          <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                      )}
                                      {isHinted && <span className="pt-checkbox-hint-dot">💡</span>}
                                    </button>
                                    <a
                                      href={lcUrl(question.slug)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="pt-q-title"
                                      title="Open on LeetCode"
                                    >
                                      {question.title}
                                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="pt-q-ext">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                        <polyline points="15 3 21 3 21 9" />
                                        <line x1="10" y1="14" x2="21" y2="3" />
                                      </svg>
                                    </a>
                                  </div>

                                  {/* Right: Difficulty + Status + Action Buttons */}
                                  <div className="pt-q-right">
                                    <span className={`badge ${difficultyClass(question.difficulty)}`}>
                                      {question.difficulty}
                                    </span>

                                    {/* Hints Drawer Button */}
                                    {question.hints && (
                                      <button
                                        type="button"
                                        className={`pt-btn-hint ${isHintsOpen ? 'pt-btn-hint--active' : ''}`}
                                        onClick={() => toggleHints(question.id)}
                                        aria-expanded={isHintsOpen}
                                        title="Toggle intuition and code skeleton"
                                      >
                                        💡 Hints {isHintsOpen ? '▲' : '▼'}
                                      </button>
                                    )}

                                    {/* Dynamic Status Badge (initially Not Attempted, changes with checkbox selection) */}
                                    <button
                                      type="button"
                                      className={`pt-status-pill ${
                                        isClean ? 'pt-status-pill--clean' :
                                        isHinted ? 'pt-status-pill--hinted' :
                                        isStuck ? 'pt-status-pill--stuck' :
                                        'pt-status-pill--unattempted'
                                      }`}
                                      onClick={() => handleCheckboxClick(question, pattern, topic)}
                                      title={
                                        isClean ? 'Solved cleanly. Click to reset or change.' :
                                        isHinted ? 'Solved with hints. Click to reset or change.' :
                                        isStuck ? 'Marked stuck. Click to update completion.' :
                                        'Not attempted. Click to log completion.'
                                      }
                                    >
                                      {isClean && '✓ Solved'}
                                      {isHinted && '💡 Hinted'}
                                      {isStuck && '❌ Stuck'}
                                      {!isClean && !isHinted && !isStuck && 'Not Attempted'}
                                    </button>
                                  </div>
                                </div>

                                {/* Hints Collapsible Drawer */}
                                {isHintsOpen && question.hints && (
                                  <div className="pt-q-hints-drawer">
                                    {question.hints.recognition && (
                                      <div className="pt-hint-segment">
                                        <span className="pt-hint-label">Pattern Recognition</span>
                                        <p className="pt-hint-text">{question.hints.recognition}</p>
                                      </div>
                                    )}
                                    {question.hints.structure && (
                                      <div className="pt-hint-segment">
                                        <span className="pt-hint-label">Core Strategy / Invariant</span>
                                        <p className="pt-hint-text">{question.hints.structure}</p>
                                      </div>
                                    )}
                                    {question.hints.skeleton && (
                                      <div className="pt-hint-segment">
                                        <span className="pt-hint-label">Algorithm Skeleton</span>
                                        <pre className="pt-hint-code"><code>{question.hints.skeleton}</code></pre>
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
              </section>
            );
          })
        )}
      </div>

      {/* Completion Modal */}
      {activeModalQuestion && (
        <LogAttemptModal
          questionItem={{
            id: activeModalQuestion.question.id,
            title: activeModalQuestion.question.title,
            slug: activeModalQuestion.question.slug,
            difficulty: activeModalQuestion.question.difficulty,
            patternName: activeModalQuestion.pattern.name,
            topicName: activeModalQuestion.topic.name,
          }}
          onSave={handleModalSave}
          onCancel={() => setActiveModalQuestion(null)}
        />
      )}
    </div>
  );
}
