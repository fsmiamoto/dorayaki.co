---
title: "Ralph Wiggum: How to actually let your agent code for hours"
date: "2026-02-28"
tags: [learning,agents]
---

In the last couple of months, the [Ralph Wiggum](https://ghuntley.com/ralph/) technique has gained quite a bit of popularity.

![Ralph Wiggum coding](/images/ralph.png)

The core idea is incredibly simple and surprisingly powerful: just run your coding agent in a bash loop.

Although at first this might seem nonsensical, given how well the models have been evolving, this actually makes sense. 
They are great at "figuring things out" without too much hand-holding, so we can just ask them to pick the most important task, work on it and quit.
So the loop actually ensures we continue to make progress while each iteration has a fresh context window to work on.

Trying it out on an internal prototype at work gave me surprising results. I was able to let the agent code the entire application from
scratch, write [AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html) code, implement the entire logic of some Lambdas, set up an Aurora Serverless database, apply migrations, and more — all by itself.

This was when it finally clicked for me that, given the right harness, these models can actually be left to work for hours and hours, just like they promise in their marketing. You do have to give it permisisons through some YOLO mode though, so using [least privilege credentials](https://en.wikipedia.org/wiki/Principle_of_least_privilege) and [sandboxing](https://github.com/fsmiamoto/sb) come in handy.

What's also cool about Ralph is that, as the author frames it, it is a **technique** not a tool itself. This means there's no "official way" of doing it, although
hundreds of implementations have popped up including ones from Anthropic, Cursor and other agent harness providers.

Up until now, I was mostly relying on shell scripts to do the plumbing but figured why not try to build my own tool for it, and that's what I did with [Ralfinho](https://github.com/fsmiamoto/ralfinho/tree/main)

This one is building on top of the [pi](https://pi.dev) coding agent - a tool I've been loving to work with recently. 

The cool thing is that you learn how the different tools interact with the models and pick up the nuance between them. Like for example, Claude Code cannot give you a stream of output in a raw text format in non-TUI mode so you have to rely on JSON mode which is terrible to read for humans and forces you into building **something**.

As most things in engineering, building your own version is the best way to learn it and to paraphrase pi: There are many Ralph Wiggum implementations, but this one is mine.

## Links

- [Ralph Wiggum technique](https://ghuntley.com/ralph/)
- [pi coding agent](https://pi.dev)
- [ralfinho - my Ralph Wiggum implementation](https://github.com/fsmiamoto/ralfinho/tree/main)
- [sb - My sandboxing tool](https://github.com/fsmiamoto/sb)
