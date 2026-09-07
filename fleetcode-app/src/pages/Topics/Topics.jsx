import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOPIC_CATEGORIES, topicToSlug } from '../../data/topicGroups';
import { useProblems } from '../../hooks/useProblems';
import { useSolvedProblems } from '../../hooks/useSolvedProblems';
import './Topics.css';

export default function Topics() {
  const navigate = useNavigate();
  const { problems = [] } = useProblems();
  const { isSolved } = useSolvedProblems();

  // All categories open by default
  const [expanded, setExpanded] = useState(() => new Set(TOPIC_CATEGORIES.map(c => c.id)));
  const [search, setSearch] = useState('');

  const totalTopics = TOPIC_CATEGORIES.reduce((s, c) => s + c.subtopics.length, 0);

  // Precompute solved counts per topic name
  const topicSolvedMap = useMemo(() => {
    const map = {};
    for (let i = 0; i < problems.length; i++) {
      const p = problems[i];
      if (isSolved(p)) {
        const tags = p.TopicTags || p.tags || [];
        for (let j = 0; j < tags.length; j++) {
          const t = tags[j];
          map[t] = (map[t] || 0) + 1;
        }
      }
    }
    return map;
  }, [problems, isSolved]);

  function toggleCategory(id) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function expandAll() {
    setExpanded(new Set(TOPIC_CATEGORIES.map(c => c.id)));
  }

  function collapseAll() {
    setExpanded(new Set());
  }

  function handlePractice(topicName) {
    navigate(`/topics/${topicToSlug(topicName)}`);
  }

  // Filter categories and subtopics based on search query
  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TOPIC_CATEGORIES;

    return TOPIC_CATEGORIES.map(cat => {
      const catMatches = cat.title.toLowerCase().includes(q);
      const matchingSubtopics = cat.subtopics.filter(sub =>
        sub.name.toLowerCase().includes(q)
      );

      if (catMatches) {
        return cat;
      }
      if (matchingSubtopics.length > 0) {
        return { ...cat, subtopics: matchingSubtopics };
      }
      return null;
    }).filter(Boolean);
  }, [search]);

  return (
    <div className="topics-page">
      {/* ── Page Header ── */}
      <header className="topics-header">
        <div className="topics-header-left">
          <h1 className="topics-title">Topics</h1>
          <p className="topics-subtitle">
            {totalTopics} topics grouped into 16 categories, ordered in recommended sequence of learning.
          </p>
        </div>

        <div className="topics-header-actions">
          <div className="topics-search-wrap">
            <svg className="topics-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="topics-search-input"
              placeholder="Search topics..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                className="topics-search-clear"
                onClick={() => setSearch('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="topics-expand-buttons">
            <button type="button" className="btn btn-outline topics-btn-ctrl" onClick={expandAll}>
              Expand All
            </button>
            <button type="button" className="btn btn-outline topics-btn-ctrl" onClick={collapseAll}>
              Collapse All
            </button>
          </div>
        </div>
      </header>

      {/* ── Categories List ── */}
      <div className="topics-categories-container">
        {filteredCategories.map((category, idx) => {
          const isOpen = expanded.has(category.id);
          const categoryTotal = category.subtopics.reduce((acc, s) => acc + s.count, 0);
          const categorySolved = category.subtopics.reduce(
            (acc, s) => acc + (topicSolvedMap[s.name] || 0),
            0
          );
          const categoryPct = categoryTotal > 0 ? Math.round((categorySolved / categoryTotal) * 100) : 0;

          return (
            <div key={category.id} className="topic-category-block">
              {/* Category Header with Simple Numbering */}
              <div
                className="category-heading-row"
                onClick={() => toggleCategory(category.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleCategory(category.id);
                  }
                }}
              >
                <div className="chr-left">
                  <h2 className="category-title">
                    <span className="category-num">{idx + 1}.</span> {category.title}
                  </h2>
                  <span className="category-problems-pill">
                    {categoryTotal.toLocaleString()} problems
                  </span>
                </div>

                <div className="chr-right">
                  {categorySolved > 0 && (
                    <span className="category-solved-count">
                      {categorySolved} / {categoryTotal} ({categoryPct}%)
                    </span>
                  )}
                  <span className="category-toggle-indicator">
                    {isOpen ? '−' : '+'}
                  </span>
                </div>
              </div>

              {/* Tab-Indented Subtopics Table */}
              {isOpen && (
                <div className="subtopics-tab-wrapper">
                  <table className="subtopics-table">
                    <thead>
                      <tr>
                        <th className="th-subtopic">SUBTOPIC</th>
                        <th className="th-problems">PROBLEMS</th>
                        <th className="th-difficulty">DIFFICULTY</th>
                        <th className="th-progress">PROGRESS</th>
                        <th className="th-action">ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.subtopics.map(sub => {
                        const solved = topicSolvedMap[sub.name] || 0;
                        const pct = sub.count > 0 ? Math.round((solved / sub.count) * 100) : 0;

                        return (
                          <tr
                            key={sub.name}
                            className="subtopic-table-row"
                            onClick={() => handlePractice(sub.name)}
                          >
                            <td className="td-subtopic">
                              <span className="subtopic-name-bold">{sub.name}</span>
                            </td>
                            <td className="td-problems">
                              <span className="subtopic-prob-number">{sub.count.toLocaleString()}</span>
                            </td>
                            <td className="td-difficulty">
                              <span className={`diff-tag diff-${(sub.difficulty || 'medium').toLowerCase().replace(/[^a-z]/g, '-')}`}>
                                {sub.difficulty}
                              </span>
                            </td>
                            <td className="td-progress">
                              <div className="subtopic-prog-wrap">
                                <div className="subtopic-prog-track">
                                  <div
                                    className="subtopic-prog-fill"
                                    style={{ width: `${Math.min(pct, 100)}%` }}
                                  />
                                </div>
                                <span className="subtopic-prog-text">{pct}%</span>
                              </div>
                            </td>
                            <td className="td-action">
                              <button
                                type="button"
                                className="subtopic-practice-button"
                                onClick={e => {
                                  e.stopPropagation();
                                  handlePractice(sub.name);
                                }}
                              >
                                Practice →
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}

        {filteredCategories.length === 0 && (
          <div className="topics-empty">
            <span className="topics-empty-icon">🔍</span>
            <h3>No topics found</h3>
            <p>We couldn't find any topics matching "{search}".</p>
            <button type="button" className="btn btn-outline" onClick={() => setSearch('')}>
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
