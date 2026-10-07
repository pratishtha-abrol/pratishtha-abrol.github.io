// Fills the LOCAL dev database with two weeks of fake traffic so you can preview the digest:
//   npm run dev            (terminal 1)
//   node scripts/seed-dev.mjs   then open http://localhost:8787/__digest
const base = process.env.WORKER ?? 'http://localhost:8787';
const now = Math.floor(Date.now() / 1000);
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const pages = ['/', '/', '/', '/infra/', '/infra/', '/backend/', '/ai/', '/research/'];
const refs = [null, null, null, 'linkedin', 'cv-pdf', 'acme-application', 'globex-application'];
const referrers = [null, null, 'linkedin.com', 'github.com', 'google.com', 't.co'];
const places = [
  ['IN', 'Hyderabad'], ['IN', 'Bengaluru'], ['US', 'San Francisco'], ['GB', 'London'], ['DE', 'Berlin'], ['US', 'Austin'],
];
const orgs = [
  'Reliance Jio Infocomm Limited', 'Bharti Airtel', 'Comcast Cable', 'Acme Corporation', 'Globex Inc', 'Oracle Corporation', 'Amazon.com, Inc.',
];
const rows = [];
for (let d = 0; d < 14; d++) {
  const visits = d < 7 ? 6 + Math.floor(Math.random() * 14) : 4 + Math.floor(Math.random() * 8);
  for (let v = 0; v < visits; v++) {
    const [country, city] = pick(places);
    const vid = Math.random().toString(16).slice(2, 18);
    const ts = now - d * 86400 - Math.floor(Math.random() * 80000);
    const ref = pick(refs);
    const org = pick(orgs);
    const device = pick(['desktop', 'desktop', 'mobile', 'tablet']);
    const n = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < n; i++)
      rows.push({ ts: ts + i * 40, type: 'view', path: i === 0 ? pick(pages) : pick(pages), ref, referrer: i === 0 ? pick(referrers) : null, vid, country, city, org, device });
    if (Math.random() < 0.25) rows.push({ ts: ts + 120, type: 'click', path: '/infra/', target: pick(['resume-infra', 'resume-research', 'email', 'linkedin', 'github']), ref, vid, country, city, org, device });
  }
}
const res = await fetch(`${base}/__seed`, { method: 'POST', body: JSON.stringify(rows) });
console.log(await res.text());
