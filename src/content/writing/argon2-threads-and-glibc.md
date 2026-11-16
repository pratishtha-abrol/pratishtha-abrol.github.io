---
title: "Fifty logins killed my server, and the fix was in how Linux gives memory back"
description: "Argon2 as an availability risk, then a glibc malloc quirk that turned a concurrency cap into per-thread memory retention."
date: 2026-11-16
---

*Found while load-testing [Ferrum](/infra/#ferrum) on Kubernetes with a 256 MiB memory limit.*

I ran a load test that was supposed to measure how fast an API accepts events. Instead it measured how fast the API could be killed.

Every request failed. The pods were being OOM-killed within seconds. Nothing in the event path allocates that much memory. It was the part of the test nobody was watching: users registering and logging in.

Cause 1: the password hash was doing exactly what it was designed to do.

Argon2 is memory-hard on purpose. That's how it resists GPU cracking. The library default is 64 MiB per hash. Registration and login are unauthenticated, so anyone can start as many hashes as the server will accept. 40 simultaneous logins on a 40-thread pool is 40 x 64 MiB, about 2.5 GiB, in a container limited to 256 MiB. This is not just a load-test artefact. It's a way to take the service down without credentials.

So I bounded it three ways: a lower cost per hash (OWASP's minimum profile, 19 MiB), a cap of 4 concurrent hashes per process, and a per-IP rate limit on those two endpoints. Old hashes still verify because the parameters live inside each hash, so no forced password reset.

Then it still got OOM-killed.

(Part of that was my own mistake: my "fixed" image was never deployed, because the local cluster silently kept the old image for the same tag. I now use a unique tag per build, and I check which image digest the pod is actually running.)

But even with the fix really deployed, the maths didn't work. Four concurrent hashes at 19 MiB should top out around 76 MiB.

I measured inside the real container. With 4 threads: 124 MiB peak, as predicted. With 40 threads: 806 MiB. Only 4 hashes could run at a time, yet memory scaled with the number of threads.

Cause 2: freed memory that glibc keeps.

With many threads, glibc's malloc gives each thread its own arena. Normally a big allocation like 19 MiB is mmap'd and returned to the OS when freed. But the mmap threshold is dynamic: after you free a large mmap'd block, glibc raises the threshold, so later large allocations come from the arena heap instead, and freed arena memory is retained. Forty threads taking turns on four hashing slots ends up with a freed 19 MiB block parked in every arena.

Two environment variables fixed it:

- MALLOC_ARENA_MAX=2 -> 143 MiB
- MALLOC_MMAP_THRESHOLD_=1048576 (setting it explicitly disables the dynamic behaviour) -> 106 MiB

From 806 MiB to 106 MiB, same code, same load.

What I'm taking from it:
1. Memory-hard hashing on an unauthenticated endpoint is an availability risk. Bound cost, concurrency and request rate.
2. Cap the resource, not the threads. My semaphore limited CPU parallelism but the allocator turned it into per-thread retention.
3. Measure on the target OS. This didn't reproduce on my Mac at all. It needed a Linux container with a memory limit.
4. Resource limits are a gift. Without one, this would have been a slow node and an unexplained cloud bill instead of a clear OOMKilled.

## Why set allocator variables in the image?

Both settings are properties of the runtime, not of the code, and they only matter on Linux with glibc, which is exactly what the container runs and exactly what a developer laptop does not. Baking them into the image means every environment gets the same behaviour, and the memory limit in the manifest stays honest (do not go below about 256 Mi, noted in the chart values).

## Read more

- [Engineering note 04: the password that ate the memory](https://github.com/ferrum-webhooks/docs/blob/main/engineering/04-argon2-memory.md)
- [Gateway repo](https://github.com/ferrum-webhooks/ferrum-webhook-gateway)
