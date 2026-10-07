import { escapeHtml as h, isNotableOrg, type Env } from './util';
import type { Mail } from './email';

const WEEK = 7 * 24 * 3600;

interface Row {
  [k: string]: string | number | null;
}

async function all(db: D1Database, sql: string, ...binds: unknown[]): Promise<Row[]> {
  return (await db.prepare(sql).bind(...binds).all<Row>()).results;
}

const n = (count: unknown, one: string, many = one + 's') => `${count} ${Number(count) === 1 ? one : many}`;
const fmtDate = (ts: number) =>
  new Date(ts * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const fmtDateTime = (ts: number) =>
  new Date(ts * 1000).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' UTC';

const INTENT: Record<string, string> = {
  hiring: "I'm hiring",
  project: 'I have a project',
  hello: 'Just saying hi',
};

function delta(now: number, prev: number): string {
  if (prev === 0) return now === 0 ? '' : ' (new)';
  const pct = Math.round(((now - prev) / prev) * 100);
  return ` (${pct >= 0 ? '+' : ''}${pct}% vs last week)`;
}

export async function buildDigest(env: Env, nowSec = Math.floor(Date.now() / 1000)): Promise<Mail> {
  const from = nowSec - WEEK;
  const prevFrom = from - WEEK;
  const db = env.DB;
  const W = 'ts >= ? AND ts < ?';

  const [
    views, prevViews, dailyUniques, byDay, pages, refs, referrers, places, cities, devices, clicks, orgs, intros,
  ] = await Promise.all([
    all(db, `SELECT COUNT(*) c FROM events WHERE type='view' AND ${W}`, from, nowSec),
    all(db, `SELECT COUNT(*) c FROM events WHERE type='view' AND ${W}`, prevFrom, from),
    all(db, `SELECT COUNT(*) c FROM (SELECT DISTINCT vid, date(ts,'unixepoch') d FROM events WHERE type='view' AND ${W})`, from, nowSec),
    all(db, `SELECT date(ts,'unixepoch') d, COUNT(*) c FROM events WHERE type='view' AND ${W} GROUP BY d ORDER BY d`, from, nowSec),
    all(db, `SELECT path, COUNT(*) c, COUNT(DISTINCT vid) u FROM events WHERE type='view' AND ${W} GROUP BY path ORDER BY c DESC LIMIT 10`, from, nowSec),
    all(db, `SELECT ref, COUNT(*) c, COUNT(DISTINCT vid) u, MAX(ts) last FROM events WHERE type='view' AND ref IS NOT NULL AND ${W} GROUP BY ref ORDER BY c DESC LIMIT 20`, from, nowSec),
    all(db, `SELECT referrer, COUNT(*) c FROM events WHERE type='view' AND referrer IS NOT NULL AND ${W} GROUP BY referrer ORDER BY c DESC LIMIT 10`, from, nowSec),
    all(db, `SELECT country, COUNT(DISTINCT vid) u, COUNT(*) c FROM events WHERE type='view' AND country IS NOT NULL AND ${W} GROUP BY country ORDER BY u DESC LIMIT 10`, from, nowSec),
    all(db, `SELECT city, country, COUNT(DISTINCT vid) u FROM events WHERE type='view' AND city IS NOT NULL AND ${W} GROUP BY city, country ORDER BY u DESC LIMIT 10`, from, nowSec),
    all(db, `SELECT device, COUNT(*) c FROM events WHERE type='view' AND ${W} GROUP BY device ORDER BY c DESC`, from, nowSec),
    all(db, `SELECT target, COUNT(*) c, COUNT(DISTINCT vid) u FROM events WHERE type='click' AND ${W} GROUP BY target ORDER BY c DESC`, from, nowSec),
    all(db, `SELECT org, COUNT(*) c, COUNT(DISTINCT vid) u, MAX(city) city, MAX(country) country FROM events WHERE type='view' AND org IS NOT NULL AND ${W} GROUP BY org ORDER BY c DESC LIMIT 60`, from, nowSec),
    all(db, `SELECT * FROM intros WHERE ${W} ORDER BY ts`, from, nowSec),
  ]);

  const nViews = Number(views[0]?.c ?? 0);
  const nPrev = Number(prevViews[0]?.c ?? 0);
  const nUniques = Number(dailyUniques[0]?.c ?? 0);
  const notable = orgs.filter((o) => isNotableOrg(String(o.org))).slice(0, 10);
  const range = `${fmtDate(from)} – ${fmtDate(nowSec - 1)}`;

  // ---------- plain text ----------
  const lines: string[] = [];
  const section = (t: string) => lines.push('', t.toUpperCase(), '-'.repeat(t.length));
  const list = (rows: Row[], f: (r: Row) => string, empty = 'Nothing this week.') =>
    lines.push(...(rows.length ? rows.map((r) => `  ${f(r)}`) : [`  ${empty}`]));

  lines.push(`Site digest, ${range}`);
  lines.push(`${nViews} page views${delta(nViews, nPrev)}, about ${nUniques} daily-unique visitors, ${intros.length} intro${intros.length === 1 ? '' : 's'}.`);
  section('Intros');
  if (intros.length === 0) lines.push('  None this week.');
  for (const i of intros) {
    lines.push(
      `  ${fmtDateTime(Number(i.ts))}  ${i.name} <${i.email}>`,
      `    ${INTENT[String(i.intent)] ?? i.intent}${i.company ? ` · ${i.company}` : ''}${i.ref ? ` · via ref=${i.ref}` : ''}`,
      ...(i.message ? [`    "${String(i.message).replace(/\s+/g, ' ')}"`] : []),
      `    from ${[i.city, i.country].filter(Boolean).join(', ') || 'unknown location'}${i.org ? ` (${i.org})` : ''}`,
    );
  }
  section('Tagged links (?ref=)');
  list(refs, (r) => `${r.ref}: ${r.c} views, ${r.u} visitors, last ${fmtDateTime(Number(r.last))}`, 'No tagged visits.');
  section('Clicks');
  list(clicks, (r) => `${r.target}: ${r.c} (${n(r.u, 'visitor')})`, 'No tracked clicks.');
  section('Top pages');
  list(pages, (r) => `${r.path}: ${n(r.c, 'view')}, ${n(r.u, 'visitor')}`);
  section('Where from');
  list(referrers, (r) => `${r.referrer}: ${r.c}`, 'No external referrers.');
  list(places, (r) => `${r.country}: ${n(r.u, 'visitor')}`);
  lines.push('  Cities: ' + (cities.map((r) => `${r.city} (${r.u})`).join(', ') || 'none'));
  section('Networks worth a look');
  list(notable, (r) => `${r.org}: ${n(r.u, 'visitor')}, ${n(r.c, 'view')}${r.city ? ` (${r.city}, ${r.country})` : ''}`, 'Nothing stands out.');
  section('Devices');
  list(devices, (r) => `${r.device}: ${r.c}`);
  const text = lines.join('\n');

  // ---------- HTML ----------
  const max = Math.max(1, ...byDay.map((d) => Number(d.c)));
  const table = (rows: Row[], cols: Array<[string, (r: Row) => string]>, empty: string) =>
    rows.length === 0
      ? `<p style="margin:0;color:#6b7280">${h(empty)}</p>`
      : `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px">${rows
          .map(
            (r) =>
              `<tr>${cols
                .map(([, f], i) => `<td style="padding:6px ${i === 0 ? '12px 6px 0' : '0 6px 12px'};border-bottom:1px solid #eceff3;${i === 0 ? '' : 'text-align:right;color:#4b5563;white-space:nowrap'}">${h(f(r))}</td>`)
                .join('')}</tr>`,
          )
          .join('')}</table>`;
  const card = (title: string, body: string) =>
    `<div style="margin:0 0 28px"><h2 style="margin:0 0 10px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#6b7280">${h(title)}</h2>${body}</div>`;

  const introHtml =
    intros.length === 0
      ? `<p style="margin:0;color:#6b7280">None this week.</p>`
      : intros
          .map(
            (i) => `<div style="border:1px solid #e5e7eb;border-left:4px solid #0f766e;border-radius:8px;padding:14px 16px;margin:0 0 12px">
<div style="font-weight:700">${h(String(i.name))} <span style="font-weight:400;color:#4b5563">&lt;${h(String(i.email))}&gt;</span></div>
<div style="color:#0f766e;font-size:13px;margin:2px 0 8px">${h(INTENT[String(i.intent)] ?? String(i.intent))}${i.company ? ` · ${h(String(i.company))}` : ''}${i.ref ? ` · via ref=${h(String(i.ref))}` : ''}</div>
${i.message ? `<div style="white-space:pre-wrap">${h(String(i.message))}</div>` : ''}
<div style="color:#6b7280;font-size:12px;margin-top:8px">${h(fmtDateTime(Number(i.ts)))} · ${h([i.city, i.country].filter(Boolean).join(', ') || 'unknown location')}${i.org ? ` · ${h(String(i.org))}` : ''}</div></div>`,
          )
          .join('');

  const dayBars = byDay
    .map((d) => {
      const w = Math.max(2, Math.round((Number(d.c) / max) * 100));
      return `<tr><td style="padding:3px 10px 3px 0;font-size:12px;color:#6b7280;white-space:nowrap">${h(fmtDate(Date.parse(String(d.d)) / 1000))}</td><td style="width:100%"><div style="height:10px;width:${w}%;background:#0f766e;border-radius:3px"></div></td><td style="padding-left:10px;font-size:12px;color:#4b5563">${d.c}</td></tr>`;
    })
    .join('');

  const html = `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#111827">
<div style="max-width:640px;margin:0 auto;padding:24px 16px">
<div style="background:#fff;border-radius:14px;padding:28px 28px 8px">
<div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#6b7280">Site digest · ${h(range)}</div>
<div style="font-size:34px;font-weight:700;margin:6px 0 2px">${nViews} <span style="font-size:16px;font-weight:400;color:#4b5563">page views${h(delta(nViews, nPrev))}</span></div>
<div style="color:#4b5563;margin:0 0 26px">about ${nUniques} daily-unique visitors · ${intros.length} intro${intros.length === 1 ? '' : 's'} · ${clicks.reduce((n, c) => n + Number(c.c), 0)} tracked clicks</div>
${card('Intros', introHtml)}
${card('Views by day', byDay.length ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${dayBars}</table>` : '<p style="margin:0;color:#6b7280">No views.</p>')}
${card('Tagged links (?ref=)', table(refs, [['ref', (r) => String(r.ref)], ['views', (r) => `${n(r.c, 'view')} · ${n(r.u, 'visitor')} · last ${fmtDateTime(Number(r.last))}`]], 'No tagged visits.'))}
${card('Tracked clicks', table(clicks, [['target', (r) => String(r.target)], ['n', (r) => `${r.c} (${n(r.u, 'visitor')})`]], 'No tracked clicks.'))}
${card('Top pages', table(pages, [['path', (r) => String(r.path)], ['n', (r) => `${n(r.c, 'view')} · ${n(r.u, 'visitor')}`]], 'No views.'))}
${card('Referrers', table(referrers, [['host', (r) => String(r.referrer)], ['n', (r) => String(r.c)]], 'No external referrers.'))}
${card('Countries', table(places, [['country', (r) => String(r.country)], ['n', (r) => `${r.u} visitors`]], 'None.'))}
${card('Cities', table(cities, [['city', (r) => `${r.city}, ${r.country}`], ['n', (r) => n(r.u, 'visitor')]], 'None.'))}
${card('Networks worth a look', table(notable, [['org', (r) => String(r.org)], ['n', (r) => `${n(r.u, 'visitor')} · ${n(r.c, 'view')}${r.city ? ` · ${r.city}` : ''}`]], 'Nothing stands out.'))}
${card('Devices', table(devices, [['device', (r) => String(r.device)], ['n', (r) => String(r.c)]], 'None.'))}
<p style="font-size:12px;color:#9ca3af;margin:0 0 20px">Counts are a floor: ad blockers and Do-Not-Track visitors aren't recorded. Sent by your pa-site-stats Worker.</p>
</div></div></body></html>`;

  return {
    subject: `Site digest ${range}: ${nViews} views, ${intros.length} intro${intros.length === 1 ? '' : 's'}`,
    html,
    text,
  };
}

/** Delete raw events older than 90 days (intros are kept until you delete them). */
export async function purgeOld(env: Env, nowSec = Math.floor(Date.now() / 1000)): Promise<void> {
  await env.DB.prepare('DELETE FROM events WHERE ts < ?').bind(nowSec - 90 * 24 * 3600).run();
}
