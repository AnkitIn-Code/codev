import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  // Search filter
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
      {/* Breadcrumb */}
      <div className="topics-breadcrumb">
        <Link to="/">FleetCode</Link>
        <span className="sep">›</span>
        <span>Topics</span>
      </div>

      {/* Header */}
      <div className="topics-page-header">
        <div className="topics-title-wrap">
          <h1>
            Topics <span className="topics-count-badge">({totalTopics})</span>
          </h1>
          <p className="topics-subtitle">
            Master each topic systematically · Click <strong>Practice →</strong> on any topic to practice its questions
          </p>
        </div>

        <div className="topics-toolbar">
          <div className="topics-search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="search-icon">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search topics or subtopics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="topics-search-input"
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

          <div className="topics-actions">
            <button type="button" className="topics-btn-secondary" onClick={expandAll}>
              Expand All
            </button>
            <button type="button" className="topics-btn-secondary" onClick={collapseAll}>
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Topics Table Container */}
      <div className="topics-table-wrapper">
        <table className="topics-table">
          <thead>
            <tr>
              <th className="th-topic">TOPIC</th>
              <th className="th-problems">PROBLEMS</th>
              <th className="th-difficulty">DIFFICULTY</th>
              <th className="th-progress">PROGRESS</th>
              <th className="th-action">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category, catIndex) => {
              const isOpen = expanded.has(category.id);
              const categoryTotal = category.subtopics.reduce((acc, s) => acc + s.count, 0);
              const categorySolved = category.subtopics.reduce(
                (acc, s) => acc + (topicSolvedMap[s.name] || 0),
                0
              );
              const categoryPct = categoryTotal > 0 ? Math.round((categorySolved / categoryTotal) * 100) : 0;

              return (
                <CategoryBlock
                  key={category.id}
                  category={category}
                  catIndex={catIndex}
                  isOpen={isOpen}
                  categoryTotal={categoryTotal}
                  categorySolved={categorySolved}
                  categoryPct={categoryPct}
                  topicSolvedMap={topicSolvedMap}
                  onToggle={() => toggleCategory(category.id)}
                  onPractice={handlePractice}
                />
              );
            })}
          </tbody>
        </table>

        {filteredCategories.length === 0 && (
          <div className="topics-empty">
            <span>🔍</span>
            <p>No topics found matching "{search}"</p>
            <button type="button" className="btn btn-outline" onClick={() => setSearch('')}>
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryBlock({
  category,
  catIndex,
  isOpen,
  categoryTotal,
  categorySolved,
  categoryPct,
  topicSolvedMap,
  onToggle,
  onPractice,
}) {
  return (
    <>
      {/* Category Parent Header Row */}
      <tr className={`category-header-row ${isOpen ? 'category-header-row--open' : ''}`} onClick={onToggle}>
        <td colSpan={5} className="category-header-cell">
          <div className="cat-row-flex">
            <div className="cat-row-left">
              <span className="cat-num">{catIndex + 1}.</span>
              <span className="cat-icon" style={{ color: category.color }}>{category.icon}</span>
              <span className="cat-title">{category.title}</span>
              <span className="cat-badge">{category.subtopics.length} topics</span>
              <span className="cat-prob-count">{categoryTotal.toLocaleString()} problems</span>
            </div>

            <div className="cat-row-right">
              {categorySolved > 0 && (
                <div className="cat-solved-tag">
                  {categorySolved} / {categoryTotal} ({categoryPct}%)
                </div>
              )}
              <div className={`cat-chevron-icon ${isOpen ? 'cat-chevron-icon--open' : ''}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>
        </td>
      </tr>

      {/* Subtopic Rows with Tab-Spaced Indentation */}
      {isOpen &&
        category.subtopics.map((sub, idx) => {
          const isLast = idx === category.subtopics.length - 1;
          const solved = topicSolvedMap[sub.name] || 0;
          const pct = sub.count > 0 ? Math.round((solved / sub.count) * 100) : 0;

          return (
            <tr
              key={sub.name}
              className={`subtopic-row ${isLast ? 'subtopic-row--last' : ''}`}
              onClick={() => onPractice(sub.name)}
            >
              {/* TOPIC Cell with Tab Space Indentation */}
              <td className="td-topic">
                <div className="subtopic-tab-indent">
                  <span className="tab-branch-symbol">{isLast ? '└──' : '├──'}</span>
                  <span className="subtopic-label">{sub.name}</span>
                </div>
              </td>

              {/* PROBLEMS Cell */}
              <td className="td-problems">
                <strong>{sub.count.toLocaleString()}</strong>
              </td>

              {/* DIFFICULTY Cell */}
              <td className="td-difficulty">
                <span className={`diff-tag diff-${sub.difficulty.toLowerCase().replace(/[^a-z]/g, '-')}`}>
                  {sub.difficulty}
                </span>
              </td>

              {/* PROGRESS Cell */}
              <td className="td-progress">
                <div className="prog-container">
                  <div className="prog-bar-track">
                    <div className="prog-bar-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <span className="prog-text">{pct}%</span>
                </div>
              </td>

              {/* ACTION Cell */}
              <td className="td-action">
                <button
                  type="button"
                  className="practice-link-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPractice(sub.name);
                  }}
                >
                  Practice →
                </button>
              </td>
            </tr>
          );
        })}
    </>
  );
}
