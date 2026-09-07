// Utility functions

// Convert problem slug to LeetCode URL
export function leetcodeUrl(slug) {
  return `https://leetcode.com/problems/${slug}/`;
}

// Convert company name to URL-friendly slug
export function companyToSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Convert slug back to display name (best-effort from companies list)
export function slugToDisplayName(slug) {
  return slug
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Truncate text
export function truncate(str, len = 40) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

// Difficulty color class
export function difficultyClass(difficulty) {
  const d = (difficulty || '').toLowerCase();
  if (d === 'easy') return 'easy';
  if (d === 'medium') return 'medium';
  if (d === 'hard') return 'hard';
  return '';
}

// Extensive mapping of company names to their primary website domains
const COMPANY_DOMAIN_MAP = {
  'Google': 'google.com',
  'Amazon': 'amazon.com',
  'Microsoft': 'microsoft.com',
  'Meta': 'meta.com',
  'Facebook': 'meta.com',
  'Apple': 'apple.com',
  'Bloomberg': 'bloomberg.com',
  'Uber': 'uber.com',
  'TikTok': 'tiktok.com',
  'Tiktok': 'tiktok.com',
  'ByteDance': 'bytedance.com',
  'Oracle': 'oracle.com',
  'Goldman Sachs': 'goldmansachs.com',
  'Adobe': 'adobe.com',
  'Salesforce': 'salesforce.com',
  'IBM': 'ibm.com',
  'LinkedIn': 'linkedin.com',
  'Zoho': 'zoho.com',
  'Flipkart': 'flipkart.com',
  'Visa': 'visa.com',
  'Mastercard': 'mastercard.com',
  'Walmart Labs': 'walmart.com',
  'Walmart': 'walmart.com',
  'Accenture': 'accenture.com',
  'NVIDIA': 'nvidia.com',
  'Nvidia': 'nvidia.com',
  'Yandex': 'yandex.com',
  'PayPal': 'paypal.com',
  'Paypal': 'paypal.com',
  'Snapchat': 'snapchat.com',
  'Snap': 'snap.com',
  'Citadel': 'citadel.com',
  'Cisco': 'cisco.com',
  'PhonePe': 'phonepe.com',
  'Snowflake': 'snowflake.com',
  'De Shaw': 'deshaw.com',
  'D.E. Shaw': 'deshaw.com',
  'TCS': 'tcs.com',
  'Tata Consultancy Services': 'tcs.com',
  'Infosys': 'infosys.com',
  'Wipro': 'wipro.com',
  'Cognizant': 'cognizant.com',
  'Capgemini': 'capgemini.com',
  'Netflix': 'netflix.com',
  'Twitter': 'twitter.com',
  'X': 'x.com',
  'Atlassian': 'atlassian.com',
  'Shopify': 'shopify.com',
  'Stripe': 'stripe.com',
  'Airbnb': 'airbnb.com',
  'DoorDash': 'doordash.com',
  'Lyft': 'lyft.com',
  'Spotify': 'spotify.com',
  'Pinterest': 'pinterest.com',
  'Palantir': 'palantir.com',
  'Palantir Technologies': 'palantir.com',
  'Databricks': 'databricks.com',
  'Twilio': 'twilio.com',
  'Dropbox': 'dropbox.com',
  'Robinhood': 'robinhood.com',
  'Coinbase': 'coinbase.com',
  'Reddit': 'reddit.com',
  'Roblox': 'roblox.com',
  'Intel': 'intel.com',
  'AMD': 'amd.com',
  'Qualcomm': 'qualcomm.com',
  'Broadcom': 'broadcom.com',
  'Zoom': 'zoom.us',
  'Tesla': 'tesla.com',
  'Morgan Stanley': 'morganstanley.com',
  'JPMorgan': 'jpmorgan.com',
  'J.P. Morgan': 'jpmorgan.com',
  'Barclays': 'barclays.com',
  'Deutsche Bank': 'db.com',
  'Bank of America': 'bankofamerica.com',
  'American Express': 'americanexpress.com',
  'Intuit': 'intuit.com',
  'eBay': 'ebay.com',
  'Etsy': 'etsy.com',
  'Splunk': 'splunk.com',
  'ServiceNow': 'servicenow.com',
  'Workday': 'workday.com',
  'Square': 'squareup.com',
  'Block': 'block.xyz',
  'Instacart': 'instacart.com',
  'Samsung': 'samsung.com',
  'Sony': 'sony.com',
  'Dell': 'dell.com',
  'HP': 'hp.com',
  'VMware': 'vmware.com',
  'HubSpot': 'hubspot.com',
  'Zillow': 'zillow.com',
  'Expedia': 'expediagroup.com',
  'Booking.com': 'booking.com',
  'Palo Alto Networks': 'paloaltonetworks.com',
  'CrowdStrike': 'crowdstrike.com',
  'Cloudflare': 'cloudflare.com',
  'Akamai': 'akamai.com',
  'Roku': 'roku.com',
  'Wayfair': 'wayfair.com',
  'Target': 'target.com',
  'Rakuten': 'rakuten.com',
  'Alibaba': 'alibaba.com',
  'Tencent': 'tencent.com',
  'Baidu': 'baidu.com',
  'Grab': 'grab.com',
  'Shopee': 'shopee.com',
  'Swiggy': 'swiggy.com',
  'Zomato': 'zomato.com',
  'Paytm': 'paytm.com',
  'MakeMyTrip': 'makemytrip.com',
  'Media.net': 'media.net',
  'Directi': 'directi.com',
  'InMobi': 'inmobi.com',
  'Jio': 'jio.com',
  'Airtel': 'airtel.in',
  'HCL': 'hcltech.com',
  'Tech Mahindra': 'techmahindra.com',
  'L&T': 'larsentoubro.com',
  'Mindtree': 'ltimindtree.com',
  'EPAM': 'epam.com',
  'Luxoft': 'luxoft.com',
  'Virtusa': 'virtusa.com',
  'Persistent': 'persistent.com',
  'Coforge': 'coforge.com',
  'Jane Street': 'janestreet.com',
  'Two Sigma': 'twosigma.com',
  'Hudson River Trading': 'hudsonrivertrading.com',
  'Jump Trading': 'jumptrading.com',
  'Optiver': 'optiver.com',
  'IMC': 'imc.com',
  'DRW': 'drw.com',
  'Flow Traders': 'flowtraders.com',
  'Susquehanna': 'sig.com',
  'Akuna Capital': 'akunacapital.com',
  'Point72': 'point72.com',
  'Millennium': 'mlp.com',
  'BlackRock': 'blackrock.com',
  'Fidelity': 'fidelity.com',
  'Vanguard': 'vanguard.com',
  'Charles Schwab': 'schwab.com',
  'Capital One': 'capitalone.com',
  'Discover': 'discover.com',
  'Synchrony': 'synchrony.com',
  'Western Union': 'westernunion.com',
  'DocuSign': 'docusign.com',
  'Slack': 'slack.com',
  'Asana': 'asana.com',
  'Monday.com': 'monday.com',
  'Notion': 'notion.so',
  'Figma': 'figma.com',
  'Canva': 'canva.com',
  'GitLab': 'gitlab.com',
  'GitHub': 'github.com',
  'HashiCorp': 'hashicorp.com',
  'Elastic': 'elastic.co',
  'MongoDB': 'mongodb.com',
  'Redis': 'redis.io',
  'Neo4j': 'neo4j.com',
  'Confluent': 'confluent.io',
  'Datadog': 'datadoghq.com',
  'New Relic': 'newrelic.com',
  'Dynatrace': 'dynatrace.com',
  'PagerDuty': 'pagerduty.com',
};

// Get company favicon via Google S2, with dictionary and intelligent fallback
export function companyFaviconUrl(companyName) {
  if (!companyName) return null;
  const trimmed = companyName.trim();
  
  // 1. Direct dictionary match
  if (COMPANY_DOMAIN_MAP[trimmed]) {
    return `https://www.google.com/s2/favicons?domain=${COMPANY_DOMAIN_MAP[trimmed]}&sz=64`;
  }
  
  // 2. Case-insensitive dictionary lookup
  const lower = trimmed.toLowerCase();
  for (const [key, domain] of Object.entries(COMPANY_DOMAIN_MAP)) {
    if (key.toLowerCase() === lower) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    }
  }

  // 3. Intelligent domain derivation (remove common suffixes like Labs, Technologies, etc.)
  const cleaned = lower
    .replace(/\b(labs|technologies|technology|tech|systems|networks|software|solutions|corporation|inc|llc|group|global|services|consulting|holdings|enterprises)\b/g, '')
    .trim()
    .replace(/[^a-z0-9]/g, '');

  if (cleaned.length >= 2) {
    return `https://www.google.com/s2/favicons?domain=${cleaned}.com&sz=64`;
  }

  return null;
}

// Generate initials avatar for companies without favicons
export function companyInitials(name) {
  if (!name) return '?';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Format large numbers
export function formatNumber(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return String(num);
}
