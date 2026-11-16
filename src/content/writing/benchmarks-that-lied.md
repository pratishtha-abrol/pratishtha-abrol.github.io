---
title: "My first benchmark results were wrong in three different ways"
description: "A sleeping laptop, a zombie process and two workloads mixed into one test: how the harness learned to check its own preconditions."
date: 2026-11-16
---

*From benchmarking [Ferrum](/infra/#ferrum) on a single laptop.*

Performance numbers are easy to produce and hard to trust. My first set looked great and was wrong three independent ways. The corrections changed my conclusions.

1. The laptop went to sleep mid-run.
One run reported a maximum latency of about 1,000 seconds. The service log had a 12,000 second gap. Sleep froze the clock my test was using. Now the harness keeps the machine awake and checks the logs for gaps.

2. A zombie answered for the new process.
My harness started a new server, polled the health endpoint, saw "up" and carried on. But the port was still held by a server left over from an earlier aborted run, and it answered the health check.

Even worse, an orphaned worker from days earlier had quietly joined the queue's consumer group and was processing messages. It made delivery look faster, it made retry timing look like it ignored its configuration (the orphan had default settings), and it inflated my before/after comparison to +41%. Measured cleanly, it was +31%.

The harness now verifies it owns the listening port, and refuses to start if any untracked copies of the system are running.

3. I benchmarked two things as if they were one.
I measured API ingest while a worker was also running. With a single worker its backlog grew, and its database work competed with ingest. For a while my "optimised" build looked slower than the original. Once I isolated the two and measured each alone, then together, the picture made sense.

A reporting bug on top: the load tool computed throughput over the whole run including warm-up, which understated it by about 20%. I now compute it from request counts in the measurement window.

How I measure now:
- Isolate one thing at a time, then the whole.
- Interleave variants (A B A B...), repeat, and report mean +/- standard deviation. Single runs differed by more than some of the effects I was measuring.
- Use a closed model (fixed clients) to find capacity, and an open model (fixed arrival rate) to measure latency under load. Closed-loop clients slow down when the server does and hide overload.
- Be explicit about what you didn't measure. My write-up has an unexplained 66-second outlier from a single request in about 9,800, with a note that the logs needed to diagnose it were overwritten by the next stage. It stays in as an open question.

The clean results: about 990 events/s with four API processes, single-digit millisecond p95 up to 900/s, and a knee between 900 and 1,200/s where a queue builds. All on one laptop with the load generator, database and receiver sharing the same cores, so conservative.

Most of the time on this investigation went into making the harness verify its own preconditions: right process, right port, machine awake, no strays, correct units, and fail loudly if not.

If you only take one thing: a benchmark harness that can't prove it's measuring what you think it is, isn't a benchmark. It's a random number generator with a nice chart.

## Why report such modest, laptop-only numbers?

Because they can be reproduced and explained. Every table in the repository comes from a script, the raw output is committed, variants are interleaved and repeated, and the limits are written next to the results: everything shared the same cores, one 66 second outlier is unexplained, and end-to-end throughput at 1,000 events/s was not measured. A smaller claim that survives scrutiny is worth more than a bigger one that does not.

## Read more

- [Engineering note 06: ingest performance](https://github.com/ferrum-webhooks/docs/blob/main/engineering/06-ingest-performance.md)
- [Benchmark scripts](https://github.com/ferrum-webhooks/infra/tree/main/bench)
