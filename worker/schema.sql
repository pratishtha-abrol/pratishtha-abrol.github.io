-- Run once: npm run db:init:local  /  npm run db:init:remote
CREATE TABLE IF NOT EXISTS events (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  ts       INTEGER NOT NULL,   -- unix seconds
  type     TEXT NOT NULL,      -- 'view' | 'click'
  path     TEXT NOT NULL,
  ref      TEXT,               -- ?ref= tag from a tagged link
  referrer TEXT,               -- referrer hostname only
  target   TEXT,               -- click target id (clicks only)
  vid      TEXT NOT NULL,      -- daily-salted hash: never the IP itself
  country  TEXT,
  region   TEXT,
  city     TEXT,
  org      TEXT,               -- network/organisation name from the IP
  device   TEXT                -- mobile | tablet | desktop
);
CREATE INDEX IF NOT EXISTS idx_events_ts ON events (ts);
CREATE INDEX IF NOT EXISTS idx_events_vid_ts ON events (vid, ts);

CREATE TABLE IF NOT EXISTS intros (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  ts      INTEGER NOT NULL,
  name    TEXT NOT NULL,
  email   TEXT NOT NULL,
  company TEXT,
  intent  TEXT NOT NULL,
  message TEXT,
  ref     TEXT,
  path    TEXT,
  vid     TEXT NOT NULL,
  country TEXT,
  city    TEXT,
  org     TEXT
);
CREATE INDEX IF NOT EXISTS idx_intros_ts ON intros (ts);
CREATE INDEX IF NOT EXISTS idx_intros_vid_ts ON intros (vid, ts);
