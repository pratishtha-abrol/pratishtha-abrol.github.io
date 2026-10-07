# pa-site-stats

A small Cloudflare Worker that records page views and clicks (no cookies, no stored
IPs), receives the "Introduce yourself" form, emails you each intro straight away,
and emails a digest of the week every **Sunday 09:00 IST** (03:30 UTC).

Endpoints: `POST /v` (view), `POST /c` (click), `POST /i` (intro form),
`POST /admin/digest` (send the digest now; needs `ADMIN_TOKEN`), `GET /health`.

## One-time setup

You need free accounts at **Cloudflare** and **Resend** (sign up to Resend with
`pratishthaabrol@gmail.com`: until you own a domain, Resend only delivers to the
account's own address, which is what we want).

```bash
cd worker
npm install
npx wrangler login                        # opens a browser
npx wrangler d1 create pa-site-stats      # prints a database_id
#   → paste it into wrangler.toml (database_id = "...")
npm run db:init:remote                    # creates the tables

npx wrangler secret put RESEND_API_KEY    # from resend.com → API Keys
npx wrangler secret put IP_SALT           # e.g. output of: openssl rand -hex 32
npx wrangler secret put ADMIN_TOKEN       # e.g. output of: openssl rand -hex 16

npm run deploy                            # prints https://pa-site-stats.<you>.workers.dev
curl https://pa-site-stats.<you>.workers.dev/health   # → ok
```

Then switch the site on: GitHub repo → **Settings → Secrets and variables → Actions →
Variables → New repository variable** `PUBLIC_STATS_ENDPOINT` = the Worker URL, and
re-run the "Deploy to GitHub Pages" workflow. Until that variable exists the site
sends nothing and the form and footer link are hidden.

Check email delivery without waiting for Sunday:

```bash
curl -X POST https://pa-site-stats.<you>.workers.dev/admin/digest \
  -H "Authorization: Bearer <your ADMIN_TOKEN>"
```

When the custom domain exists, change `FROM_EMAIL` in `wrangler.toml` to an address on a domain you've verified in Resend, and re-deploy.

## Local development

```bash
cd worker
npm run db:init:local
npm run dev                  # http://localhost:8787 (emails are logged, not sent)
node scripts/seed-dev.mjs    # two weeks of fake traffic
open http://localhost:8787/__digest        # preview the digest (add ?text for plain text)
```

To test the site against it, from the repo root:
`PUBLIC_STATS_ENDPOINT=http://localhost:8787 npm run build && npm run preview`, then
run `localStorage.setItem('statsDebug','1')` in the browser console (localhost is
ignored otherwise).

## What is stored

`events` (views and clicks) and `intros` in D1: see `schema.sql`. Events older than
90 days are deleted each Sunday. Intros are kept until you delete them:

```bash
npx wrangler d1 execute pa-site-stats --remote --command "DELETE FROM intros WHERE email = 'x@y.z'"
```

Bots, requests from other origins and spam-trap hits are not stored. All visitor
text is HTML-escaped in emails.
