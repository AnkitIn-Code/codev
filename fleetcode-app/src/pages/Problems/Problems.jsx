import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProblemTable from '../../components/ProblemTable/ProblemTable';
import { useProblems } from '../../hooks/useProblems';
import './Problems.css';

export default function Problems() {
  const { problems, loading } = useProblems();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch]       = useState(searchParams.get('search') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [topicFilter, setTopicFilter] = useState(searchParams.get('topic') || '');

  const filtered = useMemo(() => {
    let list = problems;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.Title?.toLowerCase().includes(q));
    }
    if (difficulty) {
      list = list.filter(p => p.Difficulty === difficulty);
    }
    if (topicFilter) {
      list = list.filter(p => (p.TopicTags || []).includes(topicFilter));
    }
    return list;
  }, [problems, search, difficulty, topicFilter]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const params = {};
    if (search)     params.search = search;
    if (difficulty) params.difficulty = difficulty;
    if (topicFilter) params.topic = topicFilter;
    setSearchParams(params);
  }, [search, difficulty, topicFilter, setSearchParams]);

  const clearFilters = () => {
    setSearch(''); setDifficulty(''); setTopicFilter('');
    setSearchParams({});
  };

  const easy   = problems.filter(p => p.Difficulty === 'Easy').length;
  const medium = problems.filter(p => p.Difficulty === 'Medium').length;
  const hard   = problems.filter(p => p.Difficulty === 'Hard').length;

  return (
    <div className="problems-page">
      {/* Header */}
      <div className="section-header">
        <h1>Problems</h1>
        <p>
          {problems.length.toLocaleString()}+ problems &middot;&nbsp;
          <span className="diff-easy-text">{easy} Easy</span>&nbsp;&middot;&nbsp;
          <span className="diff-medium-text">{medium} Medium</span>&nbsp;&middot;&nbsp;
          <span className="diff-hard-text">{hard} Hard</span>
        </p>
      </div>

      {/* Filters */}
      <form className="problems-filters" onSubmit={handleSearch}>
        <div className="filter-search-wrap">
          <svg className="filter-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="filter-search-input"
            placeholder="Search problems..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
        >
          <option value="">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {topicFilter && (
          <div className="filter-active-tag">
            <span>Topic: {topicFilter}</span>
            <button type="button" onClick={() => setTopicFilter('')}>✕</button>
          </div>
        )}

        <button type="submit" className="btn btn-primary">Filter</button>

        {(search || difficulty || topicFilter) && (
          <button type="button" className="btn btn-outline" onClick={clearFilters}>
            Clear
          </button>
        )}
      </form>

      {/* Result count */}
      {(search || difficulty || topicFilter) && !loading && (
        <div className="problems-result-count">
          Showing {filtered.length.toLocaleString()} of {problems.length.toLocaleString()} problems
        </div>
      )}

      {/* Table */}
      <ProblemTable problems={filtered} loading={loading} />
    </div>
  );
}
