import type { Env } from './util';

export interface Mail {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

/** Sends through Resend's HTTP API. Without a key (local dev) the mail is logged instead. */
export async function sendMail(env: Env, mail: Mail): Promise<void> {
  if (!env.RESEND_API_KEY) {
    if (env.DEV_ROUTES === '1') {
      console.log(`[dev] email not sent (no RESEND_API_KEY): ${mail.subject}\n${mail.text}`);
      return;
    }
    throw new Error('RESEND_API_KEY is not set');
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: [env.DIGEST_TO],
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
}
