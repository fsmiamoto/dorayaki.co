---
title: "If you have a good engine, don't bloat the chassis"
date: "2026-04-26"
tags: [ai, agents]
---

![Image comparing Claude Code and Pi.dev](/images/claude-code-vs-pi.png)

Recently, I've been enjoying a relatively unknown coding agent harness called [Pi](https://pi.dev).

One of its main selling points is its simplicity out of the box:

- No MCP
- No subagents
- No permission pop-ups
- Only 4 tools: read, write, edit, bash

At first, I couldn't explain exactly why, but it felt like a breath of fresh air after waking up every day to yet another Claude Code feature.

Don't get me wrong: I still think Claude Code is solid, and some of the new features are definitely interesting. The problem is that they're there whether you want them or not.

To put some numbers on it: did you know that Claude Code now has around **70** slash commands?

And that comes at a cost. More code means more bugs, bigger binaries, larger `.zip` files of leaked code, and more vulnerabilities.

So until they finally release Claude Mythos that will “rekt” all vulnerabilities in existence (🙃), why not just keep it simple?

And that reminds me of a relatively unknown philosophy that feels more relevant than ever: [suckless](https://suckless.org/).

> The more lines of code you have removed, the more progress you have made. As the number of lines of code in your software shrinks, the more skilled you have become and the less your software sucks.

suckless advocates for minimal and extensible software, which is exactly what I found in Pi. I don't have to keep thinking, "How do I turn this off?" every time I use it.

With Pi, I add exactly what I want, when I want, and that's it.

> Primitives, not features.  

— from the [Pi website](https://pi.dev)

You're not limited to what Anthropic gives you. You can just write an extension — or, more realistically, ask Pi to write it. The harness is highly optimized for this meta-building loop: it knows about itself, and it even comes with a `/reload` command so you can test your extension live.

If you've ever used software like [dwm](https://dwm.suckless.org/) or [st](https://st.suckless.org/), Pi feels like home when you can "just patch it" out of the box.

Another advantage of a provider-agnostic tool like Pi is that you're not tied to Claude and its [operational issues](https://www.anthropic.com/engineering/april-23-postmortem). No one is perfect, of course, but being able to switch to something like GPT-5.5 mid-session is definitely a plus. Or even use your locally deployed Gemma 4, all with the same setup, keybindings, prompts, and skills minus the bloat.

So next time the Claude API is down, how about giving Pi a shot?
