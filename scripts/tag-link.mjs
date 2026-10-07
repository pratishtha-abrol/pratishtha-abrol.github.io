// Makes a tagged link so the weekly digest shows where a visit came from.
//   node scripts/tag-link.mjs <tag> [path]
//   node scripts/tag-link.mjs acme-application /infra/
//   → https://pratishtha-abrol.github.io/infra/?ref=acme-application
const [tag, path = '/'] = process.argv.slice(2);
if (!tag || !/^[a-z0-9._~-]+$/i.test(tag) || tag.length > 60) {
  console.error('Usage: node scripts/tag-link.mjs <tag> [path]\nTag: letters, digits, . _ ~ - (max 60).');
  process.exit(1);
}
const base = process.env.SITE ?? 'https://pratishtha-abrol.github.io';
console.log(new URL(`${path.startsWith('/') ? path : '/' + path}?ref=${tag.toLowerCase()}`, base).href);
