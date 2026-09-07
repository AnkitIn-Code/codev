import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProblemTable from '../../components/ProblemTable/ProblemTable';
import { useProblems } from '../../hooks/useProblems';
import { slugToTopicName, TOPIC_CATEGORIES, ALL_TOPICS_FLAT, topicToSlug } from '../../data/topicGroups';
import { getTopicDetails } from '../../data/topicDetailsData';
import './TopicDetail.css';

export default function TopicDetail() {
  const { slug } = useParams();
  const { problems, loading } = useProblems();
  const [difficulty, setDifficulty] = useState('');
  const [search, setSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(() => new Set([0])); // First FAQ open by default

  const topicName = slugToTopicName(slug);
  const topicMeta = topicName ? ALL_TOPICS_FLAT.find(t => t.name === topicName) : null;

  // Filter problems by topic
  const topicProblems = useMemo(() => {
    if (!topicName) return [];
    return problems.filter(p => (p.TopicTags || []).includes(topicName));
  }, [problems, topicName]);

  // Apply difficulty + search filters
  const filtered = useMemo(() => {
    let list = topicProblems;
    if (difficulty) list = list.filter(p => p.Difficulty === difficulty);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.Title?.toLowerCase().includes(q));
    }
    return list;
  }, [topicProblems, difficulty, search]);

  // Difficulty counts
  const easyCnt = topicProblems.filter(p => p.Difficulty === 'Easy').length;
  const medCnt  = topicProblems.filter(p => p.Difficulty === 'Medium').length;
  const hardCnt = topicProblems.filter(p => p.Difficulty === 'Hard').length;

  // Category
  const category = topicMeta
    ? TOPIC_CATEGORIES.find(c => c.id === topicMeta.categoryId)
    : null;

  // Get rich editorial content, prerequisites, and FAQs
  const details = useMemo(() => {
    if (!topicName) return null;
    return getTopicDetails(topicName, topicProblems.length || 100, category?.title || '');
  }, [topicName, topicProblems.length, category]);

  // Co-occurrence related topics if none explicitly defined
  const relatedTopics = useMemo(() => {
    if (!topicName || !details) return [];
    if (details.relatedTopics && details.relatedTopics.length > 0) {
      return details.relatedTopics.map(name => {
        const matchCount = problems.filter(p =>
          (p.TopicTags || []).includes(topicName) && (p.TopicTags || []).includes(name)
        ).length;
        return { name, count: matchCount || null };
      });
    }

    const coCount = {};
    topicProblems.forEach(p => {
      (p.TopicTags || []).forEach(t => {
        if (t !== topicName) coCount[t] = (coCount[t] || 0) + 1;
      });
    });
    return Object.entries(coCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [problems, topicProblems, topicName, details]);

  const toggleFaq = (idx) => {
    setExpandedFaq(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (!topicName) {
    return (
      <div className="td-page">
        <div className="td-not-found">
          <p>Topic "<strong>{slug}</strong>" not found.</p>
          <Link to="/topics" className="btn btn-primary" style={{ marginTop: 16 }}>← Back to Topics</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="td-page">
      {/* Back to Topics Button */}
      <div className="td-back">
        <Link to="/topics" className="td-back-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Topics
        </Link>
        {category && (
          <span className="td-back-category">
            in <strong>{category.title}</strong>
          </span>
        )}
      </div>

      {/* Header with Title, Counts, Difficulty Pills and Search */}
      <div className="td-header">
        <div className="td-header-left">
          <div className="td-title-row">
            <h1>{topicName} Problems <span className="td-header-count">({topicProblems.length.toLocaleString()})</span></h1>
          </div>
          <p className="td-header-subtitle">Master fundamental patterns, optimize complexity, and solve interview questions.</p>

          {/* Difficulty Filter Pills */}
          <div className="td-diff-pills">
            {[
              { label: 'All', value: '', count: topicProblems.length },
              { label: 'Easy', value: 'Easy', count: easyCnt },
              { label: 'Medium', value: 'Medium', count: medCnt },
              { label: 'Hard', value: 'Hard', count: hardCnt },
            ].map(d => (
              <button
                key={d.value}
                className={`td-diff-pill ${difficulty === d.value ? 'td-diff-pill--active' : ''}`}
                onClick={() => setDifficulty(d.value)}
              >
                {d.label}
                <span className="td-pill-count">{d.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="td-header-right">
          <div className="td-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="td-search-icon">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              className="td-search"
              placeholder={`Search ${topicName} problems...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => {}}>Search</button>
        </div>
      </div>

      {/* Top 2-Column Overview: About [Topic] (Left) & Prerequisites (Right) */}
      <div className="td-overview-grid">
        {/* Left Card: About */}
        <div className="td-card td-about-card">
          <div className="td-card-header">
            <span className="td-badge-kicker">OVERVIEW</span>
            <h2>About {topicName}</h2>
          </div>
          <div className="td-about-text">
            {details.about.split('\n\n').map((para, i) => {
              if (para.includes('•')) {
                const lines = para.split('\n');
                return (
                  <div key={i} className="td-about-bullet-block">
                    {lines.map((line, j) => {
                      if (line.trim().startsWith('•')) {
                        return (
                          <div key={j} className="td-bullet-item">
                            <span className="td-bullet-dot">▸</span>
                            <span>{renderFormattedText(line.replace(/^•\s*/, ''))}</span>
                          </div>
                        );
                      }
                      return <p key={j} className="td-bullet-lead">{line}</p>;
                    })}
                  </div>
                );
              }
              return <p key={i}>{renderFormattedText(para)}</p>;
            })}
          </div>
        </div>

        {/* Right Card: Prerequisites */}
        <div className="td-card td-prereq-card">
          <div className="td-card-header">
            <span className="td-badge-kicker">FOUNDATIONS</span>
            <h2>Prerequisites</h2>
            <p className="td-prereq-subtitle">Core techniques frequently combined with {topicName}.</p>
          </div>

          <div className="td-prereq-list">
            {details.prerequisites.map(item => (
              <div key={item.id} className="td-prereq-row">
                <div className="td-prereq-badge">{item.id}</div>
                <div className="td-prereq-body">
                  <Link to={`/topics/${item.slug || topicToSlug(item.name)}`} className="td-prereq-link">
                    {item.name}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                  <p className="td-prereq-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle: Problem Table */}
      <div className="td-table-section">
        <div className="td-table-header-bar">
          <h3>{topicName} Practice Questions ({filtered.length.toLocaleString()})</h3>
          <span className="td-table-hint">Click any question or "Solve" to practice on LeetCode</span>
        </div>
        <ProblemTable problems={filtered} loading={loading} showStatus={true} />
      </div>

      {/* Bottom Section: The 3 Cards from the Reference Photo */}
      <div className="td-bottom-grid">
        {/* 1. Practice by Difficulty */}
        <div className="td-bottom-card td-diff-card">
          <div className="td-bcard-head">
            <h3 className="td-bcard-title">Practice by Difficulty</h3>
            <p className="td-bcard-sub">Start Easy, progress to Hard.</p>
          </div>
          <div className="td-diff-action-list">
            <button
              className={`td-diff-box td-diff-box-easy ${difficulty === 'Easy' ? 'td-diff-box--active' : ''}`}
              onClick={() => setDifficulty(d => d === 'Easy' ? '' : 'Easy')}
            >
              <div className="td-diff-box-icon td-icon-e">E</div>
              <div className="td-diff-box-meta">
                <span className="td-diff-box-name">Easy</span>
                <span className="td-diff-box-count">{easyCnt.toLocaleString()} problems</span>
              </div>
            </button>

            <button
              className={`td-diff-box td-diff-box-medium ${difficulty === 'Medium' ? 'td-diff-box--active' : ''}`}
              onClick={() => setDifficulty(d => d === 'Medium' ? '' : 'Medium')}
            >
              <div className="td-diff-box-icon td-icon-m">M</div>
              <div className="td-diff-box-meta">
                <span className="td-diff-box-name">Medium</span>
                <span className="td-diff-box-count">{medCnt.toLocaleString()} problems</span>
              </div>
            </button>

            <button
              className={`td-diff-box td-diff-box-hard ${difficulty === 'Hard' ? 'td-diff-box--active' : ''}`}
              onClick={() => setDifficulty(d => d === 'Hard' ? '' : 'Hard')}
            >
              <div className="td-diff-box-icon td-icon-h">H</div>
              <div className="td-diff-box-meta">
                <span className="td-diff-box-name">Hard</span>
                <span className="td-diff-box-count">{hardCnt.toLocaleString()} problems</span>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Related Topics */}
        <div className="td-bottom-card td-related-card">
          <div className="td-bcard-head">
            <h3 className="td-bcard-title">Related Topics</h3>
            <p className="td-bcard-sub">Frequently appear alongside {topicName}.</p>
          </div>
          <div className="td-related-cloud">
            {relatedTopics.map(t => (
              <Link
                key={t.name}
                to={`/topics/${topicToSlug(t.name)}`}
                className="td-related-tag-btn"
              >
                <span className="td-tag-emoji">🏷️</span>
                <span className="td-tag-text">{t.name}</span>
                {t.count && <span className="td-tag-count">{t.count}</span>}
              </Link>
            ))}
          </div>
        </div>

        {/* 3. FAQ */}
        <div className="td-bottom-card td-faq-card">
          <div className="td-bcard-head">
            <h3 className="td-bcard-title">FAQ</h3>
            <p className="td-bcard-sub">Common questions about {topicName}.</p>
          </div>
          <div className="td-faq-accordion">
            {details.faq.map((item, idx) => {
              const isOpen = expandedFaq.has(idx);
              return (
                <div key={idx} className={`td-faq-block ${isOpen ? 'td-faq-block--open' : ''}`}>
                  <button className="td-faq-question" onClick={() => toggleFaq(idx)}>
                    <span>{item.q}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className={`td-faq-chevron ${isOpen ? 'td-faq-chevron--open' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {isOpen && <p className="td-faq-answer">{item.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to highlight terms or links in text
function renderFormattedText(text) {
  // Replace links like [Title](url) or terms with internal links
  const parts = [];
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  let lastIdx = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.substring(lastIdx, match.index));
    }
    const label = match[1];
    const targetUrl = match[2];
    const slugMatch = targetUrl.match(/topics\/([a-zA-Z0-9_-]+)/);
    const dest = slugMatch ? `/topics/${slugMatch[1]}` : `/topics/${topicToSlug(label)}`;
    parts.push(
      <Link key={match.index} to={dest} className="td-inline-link">
        {label}
      </Link>
    );
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < text.length) {
    parts.push(text.substring(lastIdx));
  }

  return parts;
}
