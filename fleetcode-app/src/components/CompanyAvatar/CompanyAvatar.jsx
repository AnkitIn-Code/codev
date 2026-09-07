import { useState, useEffect } from 'react';
import { companyFaviconUrl, companyInitials } from '../../utils/helpers';
import './CompanyAvatar.css';

const BRAND_COLORS = {
  'Google': '#4285F4',
  'Amazon': '#FF9900',
  'Microsoft': '#00A4EF',
  'Meta': '#1877F2',
  'Facebook': '#1877F2',
  'Apple': '#555555',
  'Uber': '#000000',
  'Bloomberg': '#0062FF',
  'Goldman Sachs': '#5989B5',
  'Adobe': '#FF0000',
  'Salesforce': '#00A1E0',
  'IBM': '#054ADA',
  'LinkedIn': '#0A66C2',
  'Netflix': '#E50914',
  'Twitter': '#1DA1F2',
  'Spotify': '#1DB954',
  'NVIDIA': '#76B900',
  'PayPal': '#003087',
  'Oracle': '#C74634',
  'TCS': '#003366',
  'Infosys': '#007CC3',
  'Wipro': '#3B5998',
};

function stringToColor(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  const colors = [
    '#6366f1', '#3b82f6', '#10b981', '#f59e0b',
    '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6',
    '#06b6d4', '#d946ef', '#f97316', '#84cc16'
  ];
  return colors[Math.abs(hash) % colors.length];
}

/**
 * Robust, high-fidelity Company Avatar.
 * Loads verified domain favicon via Google S2, auto-filters blank/16px placeholder globes,
 * and falls back gracefully to a custom monogram badge with branded colors.
 */
export default function CompanyAvatar({ name = '', size = 36, className = '', style = {} }) {
  const [imgFailed, setImgFailed] = useState(false);
  const favicon = companyFaviconUrl(name);

  // Always reset error state when company name prop changes
  useEffect(() => {
    setImgFailed(false);
  }, [name]);

  const brandColor = BRAND_COLORS[name] || stringToColor(name);
  const fontSize = Math.max(Math.round(size * 0.38), 10);

  if (favicon && !imgFailed) {
    return (
      <div
        className={`company-avatar-wrap ${className}`}
        style={{ width: size, height: size, minWidth: size, ...style }}
      >
        <img
          src={favicon}
          alt={name}
          loading="lazy"
          className="company-avatar-img"
          onLoad={(e) => {
            // Google S2 returns a 16x16 default grey globe icon for unknown domains.
            // When detected, fall back to our high-res colored monogram!
            if (e.target.naturalWidth <= 16 && e.target.naturalHeight <= 16) {
              setImgFailed(true);
            }
          }}
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`company-avatar-wrap company-avatar-fallback ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        background: brandColor,
        fontSize,
        ...style,
      }}
      title={name}
    >
      <span className="company-avatar-initials">{companyInitials(name)}</span>
    </div>
  );
}
