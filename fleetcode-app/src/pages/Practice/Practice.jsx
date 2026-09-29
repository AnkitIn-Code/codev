import { useState } from 'react';
import PatternsTab from './tabs/PatternsTab';
import CodexTab    from './tabs/CodexTab';
import './Practice.css';

const TABS = [
  { id: 'patterns', label: 'Patterns', icon: '🧩' },
  { id: 'codex',    label: 'Codex',    icon: '📖' },
];

export default function Practice() {
  const [activeTab, setActiveTab] = useState('patterns');

  return (
    <div className="practice-page">
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
        {activeTab === 'patterns' && (
          <PatternsTab
            filterTopicId={null}
            onClearTopicFilter={() => {}}
          />
        )}
        {activeTab === 'codex' && <CodexTab />}
      </div>
    </div>
  );
}
