export interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  SITE_HOSTS: string;
  DIGEST_TO: string;
  FROM_EMAIL: string;
  IP_SALT: string;
  RESEND_API_KEY?: string;
  /** "1" only under `npm run dev`: enables /__digest and /__seed. */
  DEV_ROUTES?: string;
}

export const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const clip = (v: unknown, max: number): string | null => {
  if (typeof v !== 'string') return null;
  const t = v.trim().slice(0, max);
  return t === '' ? null : t;
};

/** Tag from a ?ref= link: lowercase letters, digits and . _ ~ - only. */
export const cleanRef = (v: unknown): string | null => {
  const t = clip(v, 60)?.toLowerCase();
  return t && /^[a-z0-9._~-]+$/.test(t) ? t : null;
};

export const cleanPath = (v: unknown): string | null => {
  const t = clip(v, 200);
  return t && t.startsWith('/') && !/[\s<>"']/.test(t) ? t : null;
};

/** Referrer URL → hostname, or null for direct/internal/garbage. */
export const referrerHost = (v: unknown, siteHosts: string[]): string | null => {
  const t = clip(v, 500);
  if (!t) return null;
  try {
    const host = new URL(t).hostname.toLowerCase().replace(/^www\./, '');
    return siteHosts.some((h) => h.replace(/^www\./, '') === host) ? null : host;
  } catch {
    return null;
  }
};

export const deviceOf = (ua: string): 'mobile' | 'tablet' | 'desktop' =>
  /iPad|Tablet/i.test(ua) ? 'tablet' : /Mobi|Android|iPhone/i.test(ua) ? 'mobile' : 'desktop';

const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|wget|python|node-fetch|axios|go-http|java\//i;
export const isBot = (ua: string) => ua === '' || BOT.test(ua);

/** Daily-salted hash of IP + user agent: tells repeat visits within a day apart, stores nothing identifying. */
export async function visitorId(ip: string, ua: string, salt: string): Promise<string> {
  const day = new Date().toISOString().slice(0, 10);
  const data = new TextEncoder().encode(`${ip}|${ua}|${day}|${salt}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)]
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Networks that are just consumer ISPs, mobile carriers or cloud hosts: not interesting in the digest. */
const NOISE_ORG =
  /telecom|broadband|comcast|verizon|at&t|spectrum|cox |charter|jio|airtel|bharti|vodafone|idea cellular|bsnl|act fibernet|hathway|tata (comm|tele)|you broadband|cable|wireless|mobile|cellular|internet|isp|fiber|fibre|vpn|proxy|hosting|cloud|amazon|aws|google|microsoft|azure|digitalocean|linode|ovh|hetzner|cloudflare|apple|starlink|t-mobile|orange|telef[oó]nica|deutsche telekom|bt |sky |virgin/i;
export const isNotableOrg = (org: string) => !NOISE_ORG.test(org);

export const SITE_TAG = 'ref';
