---
title: "The two lines of code that lied to my users"
description: "A dual-write bug in a webhook platform, the transactional outbox that fixed it, and the tests that kill the process on purpose."
date: 2026-11-16
---

*Part of my [Ferrum](/infra/#ferrum) webhook platform. This is the bug that shaped the whole architecture.*

The most dangerous bug I found this year was two lines long, and every test I had passed.

I was building a service that accepts an event from a customer and promises to deliver it to someone else's server. The first version did the obvious thing:

1. Save the event in the database.
2. Push its ID onto a queue for a worker to pick up.

Looks fine. But there is a gap between line 1 and line 2. If the process dies there, or the queue is down, the event is saved but nobody will ever deliver it.

Worse: the code caught the queue error, logged a warning, and still told the customer "got it, 202". A promise we could not keep, made silently.

Swapping the order doesn't help. Queue first, database second, and you can deliver an event that was never stored. No ordering of two separate writes makes them atomic.

The fix is an old pattern, the transactional outbox. Don't write to the queue at all. In the same database transaction as the event, write a row that says "this still needs publishing". A small relay process reads those rows and pushes them to the queue afterwards.

Now the event and the intent to deliver it exist together or not at all. The queue became a disposable transport instead of a source of truth: wipe it, restart it, take it down, and requests still succeed. The outbox just fills up and drains when it returns.

What it costs, honestly:
- up to 200 ms of extra delay while the relay polls
- duplicate messages are possible (the relay can crash after publishing but before marking the row done), so the consumer has to tolerate them
- one more table to clean up

I chose that trade deliberately. A duplicate is cheap to handle if every message has a stable identity. A lost event is not recoverable.

The part I'm proudest of is not the pattern, it's how I tested it. The bug survived because nothing ever killed the process between two statements. So I wrote tests that do exactly that, plus one that runs six relays against a real Postgres to check every row is published exactly once (FOR UPDATE SKIP LOCKED does the work).

Side effect: batching the inserts took a request from 44 database round trips (for an event with 20 receivers) down to 5, regardless of how many receivers there are.

Lessons I'm keeping:
- Any "write to the database, then write to the queue" path is a bug until proven otherwise.
- An error you swallow becomes a promise you break.
- If you only test the happy path and the clean crash, you haven't tested the failure.

Have you hit a dual-write bug in the wild? I'd like to hear how it showed up.

## Why the outbox, and not "retry the queue write"?

Retrying the queue write only narrows the window; the process can still die between the commit and the retry. Putting the intent in the same transaction as the data is the only option where the database alone decides what exists. Redis then becomes a transport I can lose without losing events, which is also why recovery code for a wiped Redis is a small sweep rather than a replay of history.

## Read more

- [Engineering note 01: the outbox](https://github.com/ferrum-webhooks/docs/blob/main/engineering/01-outbox.md)
- [Gateway repo](https://github.com/ferrum-webhooks/ferrum-webhook-gateway)
