// Generates public/og/*.png (1200×630) with headless Chrome. No npm dependencies.
// Usage: node scripts/generate-og.mjs   (set CHROME=/path/to/chrome if not on macOS default)
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const pages = [
  { file: 'index', title: 'Pratishtha Abrol', accent: '#E48BF2', path: '' },
  { file: 'infra', title: 'Platform & Reliability Engineer', accent: '#6EE7A8', path: '/infra' },
  { file: 'backend', title: 'Backend & Full-stack', accent: '#7CC4FA', path: '/backend' },
  { file: 'ai', title: 'AI Infrastructure', accent: '#C4A7FF', path: '/ai' },
  { file: 'research', title: 'Quantum Information Research', accent: '#F2B866', path: '/research' },
];

const html = ({ title, accent, path }) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@700&display=swap">
<style>
html,body{margin:0;width:1200px;height:630px;background:#0E1116;color:#E6EAF0;overflow:hidden}
.card{box-sizing:border-box;width:1200px;height:630px;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;font-family:'IBM Plex Sans',sans-serif}
.logo{font-family:'IBM Plex Mono',monospace;font-weight:500;font-size:30px}
.dot{color:${accent}}.path{color:#8C96A5}
h1{margin:0;font-size:84px;line-height:1.05;letter-spacing:-0.02em;max-width:980px}
.name{font-size:34px;font-weight:700;color:#B4BDC9;margin-bottom:20px;letter-spacing:0}
.rule{width:120px;height:6px;background:${accent};margin-top:40px}
</style></head><body><div class="card">
<div class="logo">pratishtha<span class="dot">.</span>abrol<span class="path">${path}</span></div>
<div>${title === "Pratishtha Abrol" ? "" : '<div class="name">Pratishtha Abrol</div>'}<h1>${title.replace(/&/g, '&amp;')}</h1><div class="rule"></div></div>
</div></body></html>`;

const dir = join(tmpdir(), 'og-gen');
mkdirSync(dir, { recursive: true });
mkdirSync('public/og', { recursive: true });
for (const p of pages) {
  const src = join(dir, `${p.file}.html`);
  writeFileSync(src, html(p));
  execFileSync(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--virtual-time-budget=5000',
    '--window-size=1200,630', `--screenshot=public/og/${p.file}.png`, `file://${src}`,
  ], { stdio: 'ignore' });
  console.log('wrote public/og/' + p.file + '.png');
}
rmSync(dir, { recursive: true, force: true });
