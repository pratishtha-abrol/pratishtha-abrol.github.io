---
title: "At 200 users my API didn't slow down. It stopped."
description: "A circular wait between a database connection pool and a thread pool, found by shrinking the problem to a 20-line reproduction."
date: 2026-11-16
---

*Found while load-testing [Ferrum](/infra/#ferrum)'s ingest API.*

I was load-testing an API and watching the usual curve. 10 clients: fine. 50 clients: fine. 200 clients: 59 requests completed in 30 seconds, and a wall of "connection pool limit reached" errors.

That's not a degradation curve. That's a cliff. And CPU was idle during the stall, which is the signature of a deadlock, not overload.

I went down three wrong paths first:

1. "The database pool is too small." Making it bigger only moved the cliff.
2. "Closing the session needs a thread and threads are exhausted." I made that dependency async. It helped a little, and the stall stayed.
3. "Size the pool to match the thread count." Logic says nobody would wait. It still wasn't enough, and I eventually worked out why.

What cracked it was shrinking the problem. A load test takes minutes and a cluster. The bug only needs a tiny database pool, a tiny thread pool, and more concurrent requests than either. I wrote a script that fires 120 concurrent requests at the app with a pool of 4 connections and 6 threads. The old code: 6 of 120 succeeded, in 57 seconds. Now I could iterate in a second instead of ten minutes.

The cause was a circular wait. In this framework a synchronous request needs a thread three times: to resolve dependencies, to run the handler, and to serialise the response. The database connection is checked out during the handler but only released at teardown, after serialisation.

So a request finishes its query and sits on a connection, waiting for a thread to serialise its response. Meanwhile every thread is occupied by other requests that are waiting for a connection. Connections wait for threads, threads wait for connections. Nobody moves until a timeout fires, then it happens again with the next wave.

That also explains why a bigger pool only hides it: whenever a request can hold one scarce resource while waiting for another, there's a cycle, and enough concurrency will walk it.

The fix is a rule, not a number: never hold a connection while waiting for anything else. The handler now releases its database session in its own thread before it returns. I enforced it in a custom route class, so a new endpoint can't forget. I also cut the pool timeout from 30 s to 5 s and turned a timeout into a 503 with Retry-After. An overloaded service should say so quickly instead of hanging its callers.

After the fix, the same 120 requests finish in 0.2 seconds, with zero connections left checked out.

One honest footnote: when I later reverted each of the three changes one at a time, none individually brought the collapse back. The original failure needed several conditions at once. I wrote that in the notes rather than pretend one change was the hero.

What I took away:
- Draw the wait-for graph of your request path. If a bounded resource can be held while waiting for another, you have a deadlock waiting for load.
- Resizing hides cycles. Ordering removes them.
- Reproduce at the smallest scale you can.
- Be suspicious of a fix that "should" work.

## Why a route class instead of fixing each endpoint?

The rule is "release the connection before waiting for anything else". A rule that every handler has to remember will be forgotten by the next endpoint, so it lives in one custom route class, and a test checks that every synchronous route is registered through it. A structural check costs nothing and keeps the fix from rotting.

## Read more

- [Engineering note 05: the deadlock](https://github.com/ferrum-webhooks/docs/blob/main/engineering/05-connection-pool-deadlock.md)
- [The probe script](https://github.com/ferrum-webhooks/ferrum-webhook-gateway/blob/main/scripts/pool_probe.py)
