import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TodayTab    from './tabs/TodayTab';
import PatternsTab from './tabs/PatternsTab';
import HistoryTab  from './tabs/HistoryTab';
import './Practice.css';

const TABS = [
  { id: 'today',    label: 'Today',    icon: '📅' },
  { id: 'patterns', label: 'Patterns', icon: '🧩' },
  { id: 'history',  label: 'History',  icon: '🗓️' },
];

export default function Practice() {
  const [activeTab, setActiveTab] = useState('today');
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="practice-page">
      <header className="practice-header">
        <div className="practice-header-left">
          <div className="practice-badge">
            <span className="practice-dot" />
            Pattern-Driven Mastery
          </div>
          <h1 className="practice-title">Practice Hub</h1>
          <p className="practice-subtitle">
            12 Daily Curated Goals · 20 DSA Patterns · Deep Performance & Hint History
          </p>
        </div>
        <div className="practice-header-right">
          <button
            type="button"
            className="btn btn-outline practice-mock-btn"
            onClick={() => navigate('/practice/mock')}
            id="practice-btn-mock"
          >
            🎯 Launch Mock OA
          </button>
        </div>
      </header>

      {/* Tab Bar */}
      <nav className="practice-tabs" role="tablist" aria-label="Practice sections">
        {TABS.map(tab => (
          <button
            key={tab.id}
            id={`practice-tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`practice-tab-btn ${activeTab === tab.id ? 'practice-tab-btn--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="practice-tab-icon">{tab.icon}</span>
            <span className="practice-tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Tab Content */}
      <div className="practice-tab-content">
        {activeTab === 'today'    && <TodayTab />}
        {activeTab === 'patterns' && (
          <PatternsTab
            filterTopicId={selectedTopicId}
            onClearTopicFilter={() => setSelectedTopicId(null)}
          />
        )}
        {activeTab === 'history'  && <HistoryTab />}
      </div>
    </div>
  );
}
