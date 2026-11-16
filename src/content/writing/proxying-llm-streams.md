---
title: "The same bytes, 350 ms later: lessons from proxying an LLM stream"
description: "Flushing, time-to-first-token, cancellation and mutation testing in a Go gateway for self-hosted language models."
date: 2026-11-16
---

*From [Crucible](/ai/#crucible), my self-hosted LLM gateway (in progress).*

I'm building a gateway that sits in front of self-hosted language models. Forwarding bytes is the easy part. The hard part is that a model's answer isn't a response, it's a stream, and the user experience is the timing of that stream.

Four things I learned, each with a measurement.

1. Flushing is the product.
My first proxy read each server-sent event and wrote it to the client. It worked. Then I tested it with an upstream that stamps every event with its send time, and a client that records when each one arrives.

I had forgotten one line, the Flush call. 20,000 events arrived in about 300 bursts of 67 instead of one at a time. Median delay per event went from 0.1 ms to 350 ms. Go's HTTP server buffers writes (about 5 KiB here) and only releases them when the buffer fills or the handler returns. For a web page that's an optimisation. For a token stream it turns smooth typing into lumps.

My rule: write the event, flush it, then look inside it. Measurement (counting tokens, finding the first one) happens after the bytes are already on their way, so it can never delay one. Parsing every event costs about 1.3 microseconds. The whole gateway adds about 74 microseconds per event, against a budget of 2 ms.

2. "Time to first token" is not the first event.
My first latency numbers were wonderful: 3 ms. And meaningless. The model server sends an initial empty role marker before it has even processed your prompt. The real first token arrives after prefill. TTFT has to be measured at the first event with actual content. I wrote a test where the first token is delayed by 150 ms and asserted TTFT is at least that.

3. When the user leaves, the model should stop.
Generating tokens is compute, and a disconnected client makes it wasted compute. In Go, passing the incoming request's context into the outgoing request is enough. I checked it against the real server's log: hang up at 1.000 s, cancel at the same instant, slot released 15 ms later, 105 of 600 tokens generated.

4. Failing before vs after the first byte is different.
Before streaming starts, a failure is a proper HTTP status (502 or 504). After it starts, the 200 has already gone out, so the only honest signal is an in-band error event and no closing "done" sentinel. Sending the sentinel would make a broken answer look complete.

The part I like best: my first test suite passed on the first run, which is suspicious. So I broke the code on purpose (no flush, no context propagation, count the empty role event as first token). Two mutations were caught. One survived: nothing tested my TTFT definition. A test suite you've never seen fail is a hypothesis, not evidence.

## Why Go, and why treat every backend as an OpenAI-compatible black box?

Go gives one goroutine per stream, flushing and context cancellation in the standard library, and a small static binary. Treating each model server as an OpenAI-compatible black box means swapping llama.cpp for vLLM is configuration, at the cost of anything that needs engine internals. Both are recorded as short decision records in the repository.

## Read more

- [Crucible repository](https://github.com/pratishtha-abrol/crucible)
