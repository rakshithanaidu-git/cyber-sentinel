export interface AnalysisResult {
  url: string;
  threatScore: number;
  threatLevel: 'safe' | 'low' | 'medium' | 'high' | 'critical';
  features: FeatureAnalysis[];
  timestamp: Date;
  summary: string;
}

export interface FeatureAnalysis {
  name: string;
  detected: boolean;
  severity: 'info' | 'warning' | 'danger';
  description: string;
}

// Suspicious TLDs commonly used in phishing
const SUSPICIOUS_TLDS = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.work', '.click', '.link', '.info'];

// Legitimate brands often impersonated
const BRAND_KEYWORDS = ['paypal', 'apple', 'google', 'microsoft', 'amazon', 'netflix', 'facebook', 'instagram', 'twitter', 'bank', 'secure', 'login', 'account', 'verify', 'update', 'confirm'];

// Suspicious URL patterns
const SUSPICIOUS_PATTERNS = [
  /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/, // IP address
  /@/, // @ symbol in URL
  /https?:\/\/[^\/]*-[^\/]*-[^\/]*\./, // Multiple hyphens
  /[а-яА-Яа-яёЁ]/, // Cyrillic characters (homograph attack)
  /xn--/, // Punycode
  /login|signin|verify|secure|account|update|confirm|suspend/i, // Phishing keywords
  /\.(php|asp|aspx)\?/i, // Suspicious query patterns
  /%[0-9a-fA-F]{2}/, // URL encoding
];

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    return urlObj.hostname;
  } catch {
    return url;
  }
}

function hasIPAddress(url: string): boolean {
  return /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url);
}

function hasSuspiciousTLD(url: string): boolean {
  const domain = extractDomain(url).toLowerCase();
  return SUSPICIOUS_TLDS.some(tld => domain.endsWith(tld));
}

function hasBrandKeyword(url: string): boolean {
  const domain = extractDomain(url).toLowerCase();
  return BRAND_KEYWORDS.some(brand => 
    domain.includes(brand) && !domain.startsWith(brand + '.')
  );
}

function hasExcessiveSubdomains(url: string): boolean {
  const domain = extractDomain(url);
  const parts = domain.split('.');
  return parts.length > 4;
}

function hasLongDomain(url: string): boolean {
  const domain = extractDomain(url);
  return domain.length > 50;
}

function hasAtSymbol(url: string): boolean {
  return url.includes('@');
}

function hasHomographCharacters(url: string): boolean {
  return /[а-яА-ЯёЁ]|xn--/.test(url);
}

function hasSuspiciousKeywords(url: string): boolean {
  return /login|signin|verify|secure|account|update|confirm|suspend|password|credential/i.test(url);
}

function hasHTTPOnly(url: string): boolean {
  return url.toLowerCase().startsWith('http://');
}

function hasPortNumber(url: string): boolean {
  return /:\d{2,5}\//.test(url);
}

function hasEncodedCharacters(url: string): boolean {
  return /%[0-9a-fA-F]{2}/.test(url);
}

function hasShortenerPattern(url: string): boolean {
  const shorteners = ['bit.ly', 'tinyurl', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 'adf.ly', 'j.mp'];
  const domain = extractDomain(url).toLowerCase();
  return shorteners.some(s => domain.includes(s));
}

export function analyzeURL(url: string): AnalysisResult {
  const features: FeatureAnalysis[] = [];
  let score = 0;

  // IP Address Detection
  if (hasIPAddress(url)) {
    features.push({
      name: 'IP Address URL',
      detected: true,
      severity: 'danger',
      description: 'URL uses IP address instead of domain name'
    });
    score += 25;
  }

  // Suspicious TLD
  if (hasSuspiciousTLD(url)) {
    features.push({
      name: 'Suspicious TLD',
      detected: true,
      severity: 'warning',
      description: 'Domain uses a TLD commonly associated with phishing'
    });
    score += 15;
  }

  // Brand Impersonation
  if (hasBrandKeyword(url)) {
    features.push({
      name: 'Brand Impersonation',
      detected: true,
      severity: 'danger',
      description: 'URL contains brand names that may indicate impersonation'
    });
    score += 20;
  }

  // Excessive Subdomains
  if (hasExcessiveSubdomains(url)) {
    features.push({
      name: 'Excessive Subdomains',
      detected: true,
      severity: 'warning',
      description: 'URL has unusually many subdomains'
    });
    score += 10;
  }

  // Long Domain
  if (hasLongDomain(url)) {
    features.push({
      name: 'Abnormal Domain Length',
      detected: true,
      severity: 'warning',
      description: 'Domain name is unusually long'
    });
    score += 10;
  }

  // @ Symbol
  if (hasAtSymbol(url)) {
    features.push({
      name: '@ Symbol Detected',
      detected: true,
      severity: 'danger',
      description: 'URL contains @ symbol which can be used to obscure real destination'
    });
    score += 25;
  }

  // Homograph Attack
  if (hasHomographCharacters(url)) {
    features.push({
      name: 'Homograph Characters',
      detected: true,
      severity: 'danger',
      description: 'URL contains characters that look similar to Latin letters'
    });
    score += 30;
  }

  // Suspicious Keywords
  if (hasSuspiciousKeywords(url)) {
    features.push({
      name: 'Suspicious Keywords',
      detected: true,
      severity: 'warning',
      description: 'URL contains phishing-related keywords'
    });
    score += 15;
  }

  // HTTP Only
  if (hasHTTPOnly(url)) {
    features.push({
      name: 'Insecure Protocol',
      detected: true,
      severity: 'warning',
      description: 'URL uses HTTP instead of HTTPS'
    });
    score += 10;
  }

  // Port Number
  if (hasPortNumber(url)) {
    features.push({
      name: 'Non-Standard Port',
      detected: true,
      severity: 'warning',
      description: 'URL uses a non-standard port number'
    });
    score += 15;
  }

  // URL Encoding
  if (hasEncodedCharacters(url)) {
    features.push({
      name: 'URL Encoding',
      detected: true,
      severity: 'info',
      description: 'URL contains encoded characters that may hide malicious content'
    });
    score += 5;
  }

  // URL Shortener
  if (hasShortenerPattern(url)) {
    features.push({
      name: 'URL Shortener',
      detected: true,
      severity: 'warning',
      description: 'URL uses a shortening service which hides the real destination'
    });
    score += 15;
  }

  // Add safe features if nothing detected
  if (features.length === 0) {
    features.push({
      name: 'Standard Domain',
      detected: false,
      severity: 'info',
      description: 'No suspicious domain patterns detected'
    });
    features.push({
      name: 'Secure Protocol',
      detected: false,
      severity: 'info',
      description: 'URL uses HTTPS encryption'
    });
  }

  // Cap score at 100
  score = Math.min(score, 100);

  // Determine threat level
  let threatLevel: AnalysisResult['threatLevel'];
  let summary: string;

  if (score === 0) {
    threatLevel = 'safe';
    summary = 'No phishing indicators detected. URL appears legitimate.';
  } else if (score <= 20) {
    threatLevel = 'low';
    summary = 'Minor suspicious patterns detected. Exercise normal caution.';
  } else if (score <= 45) {
    threatLevel = 'medium';
    summary = 'Multiple suspicious indicators found. Verify the source before proceeding.';
  } else if (score <= 70) {
    threatLevel = 'high';
    summary = 'High probability of phishing. Do not enter any personal information.';
  } else {
    threatLevel = 'critical';
    summary = 'Critical threat detected. This URL shows strong indicators of a phishing attempt.';
  }

  return {
    url,
    threatScore: score,
    threatLevel,
    features,
    timestamp: new Date(),
    summary
  };
}
