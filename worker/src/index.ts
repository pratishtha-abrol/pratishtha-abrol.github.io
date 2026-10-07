import { buildDigest, purgeOld } from './digest';
import { sendMail } from './email';
import { escapeHtml as h, clip, cleanPath, cleanRef, deviceOf, isBot, referrerHost, visitorId, type Env } from './util';

const INTENTS = new Set(['hiring', 'project', 'hello']);
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/;

function corsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin') ?? '';
  const allowed = env.ALLOWED_ORIGINS.split(',').map((s) => s.trim());
  return allowed.includes(origin)
    ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' }
    : {};
}

const reply = (status: number, request: Request, env: Env, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(request, env), ...(body === undefined ? {} : { 'Content-Type': 'application/json' }) },
  });

async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  const text = await request.text();
  if (text.length > 8_000) return null;
  try {
    const v = JSON.parse(text);
    return v && typeof v === 'object' ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

async function context(request: Request, env: Env) {
  const ua = request.headers.get('User-Agent') ?? '';
  const ip = request.headers.get('CF-Connecting-IP') ?? '';
  const cf = (request as Request & { cf?: IncomingRequestCfProperties }).cf;
  return {
    ua,
    vid: await visitorId(ip, ua, env.IP_SALT),
    country: clip(cf?.country, 2),
    region: clip(cf?.region, 80),
    city: clip(cf?.city, 80),
    org: clip(cf?.asOrganization, 120),
    device: deviceOf(ua),
  };
}

async function recordEvent(request: Request, env: Env, type: 'view' | 'click'): Promise<Response> {
  const body = await readJson(request);
  if (!body) return reply(400, request, env);
  const c = await context(request, env);
  // Bots, and anything from an origin that isn't ours, are acknowledged but not stored.
  if (isBot(c.ua) || Object.keys(corsHeaders(request, env)).length === 0) return reply(204, request, env);
  const path = cleanPath(body.p);
  if (!path) return reply(400, request, env);
  const recent = await env.DB.prepare('SELECT COUNT(*) n FROM events WHERE vid = ? AND ts > ?')
    .bind(c.vid, Math.floor(Date.now() / 1000) - 600)
    .first<{ n: number }>();
  if ((recent?.n ?? 0) > 120) return reply(204, request, env);
  const hosts = env.SITE_HOSTS.split(',').map((s) => s.trim());
  await env.DB.prepare(
    'INSERT INTO events (ts, type, path, ref, referrer, target, vid, country, region, city, org, device) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
  )
    .bind(
      Math.floor(Date.now() / 1000),
      type,
      path,
      cleanRef(body.r),
      type === 'view' ? referrerHost(body.rf, hosts) : null,
      type === 'click' ? clip(body.t, 40) : null,
      c.vid,
      c.country,
      c.region,
      c.city,
      c.org,
      c.device,
    )
    .run();
  return reply(204, request, env);
}

async function recordIntro(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const body = await readJson(request);
  if (!body) return reply(400, request, env, { error: 'Invalid request.' });
  const c = await context(request, env);
  if (Object.keys(corsHeaders(request, env)).length === 0) return reply(403, request, env, { error: 'Forbidden.' });

  // Spam traps: a filled hidden field or an instant submit looks like a bot. Pretend it worked.
  if (clip(body.hp, 50) !== null || Number(body.t) < 3000 || isBot(c.ua)) return reply(200, request, env, { ok: true });

  const name = clip(body.name, 100);
  const email = clip(body.email, 200);
  const intent = clip(body.intent, 20);
  if (!name || !email || !EMAIL_RE.test(email) || !intent || !INTENTS.has(intent)) {
    return reply(422, request, env, { error: 'Please add your name, a valid email and what this is about.' });
  }
  const company = clip(body.company, 120);
  const message = clip(body.message, 2000);

  const recent = await env.DB.prepare('SELECT COUNT(*) n FROM intros WHERE vid = ? AND ts > ?')
    .bind(c.vid, Math.floor(Date.now() / 1000) - 3600)
    .first<{ n: number }>();
  if ((recent?.n ?? 0) >= 3) return reply(429, request, env, { error: 'Too many messages. Please email me directly.' });

  const ref = cleanRef(body.r);
  const path = cleanPath(body.p);
  await env.DB.prepare(
    'INSERT INTO intros (ts, name, email, company, intent, message, ref, path, vid, country, city, org) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
  )
    .bind(Math.floor(Date.now() / 1000), name, email, company, intent, message, ref, path, c.vid, c.country, c.city, c.org)
    .run();

  const where = [c.city, c.country].filter(Boolean).join(', ') || 'unknown location';
  const label = { hiring: "I'm hiring", project: 'I have a project', hello: 'Just saying hi' }[intent];
  ctx.waitUntil(
    sendMail(env, {
      subject: `New intro: ${name}${company ? ` (${company})` : ''}, ${label}`,
      replyTo: email,
      text: `${name} <${email}>\n${label}${company ? ` · ${company}` : ''}${ref ? ` · via ref=${ref}` : ''}\n\n${message ?? '(no message)'}\n\n${where}${c.org ? ` (${c.org})` : ''}`,
      html: `<div style="font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;max-width:560px">
<h2 style="margin:0 0 4px">${h(name)}</h2>
<p style="margin:0 0 12px;color:#4b5563">&lt;${h(email)}&gt; · ${h(label ?? '')}${company ? ` · ${h(company)}` : ''}${ref ? ` · via ref=${h(ref)}` : ''}</p>
<p style="white-space:pre-wrap;margin:0 0 16px">${message ? h(message) : '<em>No message.</em>'}</p>
<p style="margin:0;color:#6b7280;font-size:12px">${h(where)}${c.org ? ` · ${h(c.org)}` : ''}. Just hit reply to answer ${h(name)}.</p></div>`,
    }).catch((e) => console.error('instant intro email failed', e)),
  );
  return reply(200, request, env, { ok: true });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (request.method === 'OPTIONS') return reply(204, request, env);

    if (env.DEV_ROUTES === '1' && url.pathname === '/__digest') {
      const mail = await buildDigest(env);
      return new Response(url.searchParams.has('text') ? mail.text : mail.html, {
        headers: { 'Content-Type': url.searchParams.has('text') ? 'text/plain; charset=utf-8' : 'text/html; charset=utf-8' },
      });
    }
    if (env.DEV_ROUTES === '1' && url.pathname === '/__seed' && request.method === 'POST') {
      const rows = (await request.json()) as Array<Record<string, string | number | null>>;
      await env.DB.batch(
        rows.map((r) =>
          env.DB.prepare('INSERT INTO events (ts, type, path, ref, referrer, target, vid, country, region, city, org, device) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').bind(
            r.ts, r.type, r.path, r.ref ?? null, r.referrer ?? null, r.target ?? null, r.vid, r.country ?? null, r.region ?? null, r.city ?? null, r.org ?? null, r.device ?? 'desktop',
          ),
        ),
      );
      return new Response(`seeded ${rows.length}`);
    }

    if (request.method === 'POST' && url.pathname === '/admin/digest') {
      const token = (request.headers.get('Authorization') ?? '').replace(/^Bearer /, '');
      if (!env.ADMIN_TOKEN || token !== env.ADMIN_TOKEN) return new Response('Unauthorized', { status: 401 });
      await sendMail(env, await buildDigest(env));
      return new Response('Digest sent.\n');
    }

    if (request.method === 'POST') {
      if (url.pathname === '/v') return recordEvent(request, env, 'view');
      if (url.pathname === '/c') return recordEvent(request, env, 'click');
      if (url.pathname === '/i') return recordIntro(request, env, ctx);
    }
    if (url.pathname === '/health') return new Response('ok');
    return new Response('Not found', { status: 404 });
  },

  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      (async () => {
        await sendMail(env, await buildDigest(env));
        await purgeOld(env);
      })(),
    );
  },
};
