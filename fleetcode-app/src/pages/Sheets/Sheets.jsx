import { Link } from 'react-router-dom';
import { SHEETS_DATA, SHEETS_STATS } from '../../data/sheetsData';
import './Sheets.css';

export default function Sheets() {
  return (
    <div className="sheets-page">
      {/* Header */}
      <div className="section-header sheets-header-row">
        <div>
          <h1>DSA Sheets</h1>
          <p>Practice with Blind 75, NeetCode 150, Striver SDE and more curated problem lists</p>
        </div>
        <div className="sheets-header-stats">
          <span><strong>{SHEETS_STATS.official}</strong> Official</span>
          <span className="sheets-stat-sep">·</span>
          <span><strong>{SHEETS_STATS.community}</strong> Community</span>
          <span className="sheets-stat-sep">·</span>
          <span><strong>{SHEETS_STATS.total_problems}</strong> Problems</span>
        </div>
      </div>

      <div className="sheets-body">
        {/* Official Sheets */}
        <section className="sheets-section">
          <div className="sheets-section-header">
            <span className="sheets-crown">👑</span>
            <h2>Official Sheets</h2>
            <span className="sheets-curator">Curated by FleetCode</span>
          </div>
          <div className="sheets-grid">
            {SHEETS_DATA.official.map(sheet => (
              <SheetCard key={sheet.id} sheet={sheet} />
            ))}
          </div>
        </section>

        {/* Community Sheets */}
        <section className="sheets-section">
          <div className="sheets-section-header">
            <span className="sheets-crown">👥</span>
            <h2>Community Sheets</h2>
            <span className="sheets-curator">Community curated</span>
          </div>
          <div className="sheets-grid">
            {SHEETS_DATA.community.map(sheet => (
              <SheetCard key={sheet.id} sheet={sheet} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function SheetCard({ sheet }) {
  return (
    <Link to={`/sheets/${sheet.id}`} className="sheet-card" style={{ textDecoration: 'none' }}>
      <div className="sheet-card-icon" style={{ background: sheet.iconBg + '20', color: sheet.iconBg }}>
        <span>{sheet.icon}</span>
      </div>
      <div className="sheet-card-body">
        <h3 className="sheet-card-title">{sheet.title}</h3>
        <p className="sheet-card-desc">{sheet.description}</p>
        <div className="sheet-card-footer">
          <div className="sheet-card-stats">
            <span className="sheet-problems">{sheet.problems} problems</span>
            {sheet.followers != null && (
              <span className="sheet-followers">{sheet.followers} followers</span>
            )}
          </div>
          {sheet.cta && <span className="sheet-cta">{sheet.cta}</span>}
        </div>
      </div>
    </Link>
  );
}
