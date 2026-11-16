---
title: "\"Exactly once\" doesn't exist, so I killed my own workers"
description: "Leases, atomic claims, a crash matrix and a real kill -9: how Ferrum guarantees at-least-once delivery."
date: 2026-11-16
---

*Part of my [Ferrum](/infra/#ferrum) webhook platform: the delivery half of the pipeline.*

A worker takes a job off a queue, calls a customer's server, writes down the result, and tells the queue it's done.

A process can die between any two of those steps. So can the network. And the system has to be sure of three things at once: never forget a job, never run two attempts at the same time, and accept that sometimes the customer will see the same request twice.

"Exactly once" isn't on offer. The honest goal is at-least-once, with duplicates that are cheap and bounded.

My first version used a queue pop that removes the item. Crash anywhere afterwards and the job is gone. It also slept between retries, which pinned a worker for the whole wait and meant a shutdown signal couldn't be honoured until the sleep ended.

What I ended up with:

- A queue that keeps unacknowledged messages (Redis Streams with a consumer group). A crashed worker's work is still there.
- Acknowledge only after the result is committed to the database.
- A short atomic claim on each job: one UPDATE that flips it from pending to in-flight with a 60 second lease. A duplicate message can't cause two simultaneous attempts, because the second claimer updates zero rows.
- A sweeper that reclaims messages that have been idle for 90 seconds, i.e. whose owner is presumably dead.
- Retries are a timestamp in the database, not a sleep in a process. A scheduler moves due jobs back into the pipeline. Nothing waits, and a restart forgets nothing.

Two small rules took me longer than anything else:

1. The reclaim timeout must be longer than the lease. Otherwise a message can be reclaimed while the old owner still legitimately holds the job, the new worker's claim fails, it decides "someone else has this" and acknowledges it, and nobody owns the job any more.
2. A claim that fails because a live lease exists is "busy", not "already done". Done jobs get acknowledged. Busy ones don't, so if the lease holder dies the message is still there.

I wrote the crash matrix as a table: every place a process can die, what state is left behind, what recovers it, and the outcome. Only one row ends in a duplicate: the worker made the request, then died before recording the result. The system genuinely cannot know whether the customer processed it. That's irreducible, so every message carries a stable ID the receiver can use to deduplicate.

Then I tested it for real. With shortened timers I ran kill -9 on a worker mid-request. A replacement picked the job up and finished it 2.6 seconds later. The receiver saw two requests, the second one was the recovery. (One observation, not a distribution, and I say so in the write-up.)

I also ran 12 workers racing for one job on a real Postgres. Exactly one HTTP request went out.

Takeaway: when you can't prevent duplicates, give every unit of work an identity, make the claim atomic, and write down every crash point before you claim you're safe.

## Why Redis Streams and Postgres together?

The stream gives me a pending-entries list, so a crashed consumer's work is still visible and can be reclaimed. Postgres stays the system of record for state, schedule and lease, so there is one place to look and one place to repair. Retries are a column (`next_retry_at`), not a Redis sorted set, because a second source of truth would need reconciling after every Redis loss. The price is retry timing precision of about a second, which is irrelevant for backoffs of 5 to 40 seconds.

## Read more

- [Engineering note 02: delivery pipeline](https://github.com/ferrum-webhooks/docs/blob/main/engineering/02-delivery-pipeline.md)
- [Engineering note 03: retries without sleeping](https://github.com/ferrum-webhooks/docs/blob/main/engineering/03-retries.md)
- [Worker repo](https://github.com/ferrum-webhooks/ferrum-webhook-worker)
