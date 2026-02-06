---
title: "CLIs over Tools: MCP considered harmful"
date: "2026-02-06"
tags: ["coding", "ai"]
---

Whenever faced with the question about how to give an Agent a capability or more context, I still often hear:

> Oh, what if we build an MCP server for this?

This post aims to discourage that.

Instead, we should be building more CLIs and letting our agents use Bash (something they are really good at).

## Why MCP is not ideal

If you've interacted with any Coding Agent, you might be familiar with the concept of [Context Rot](https://research.trychroma.com/context-rot).

The Chroma team studied 18 leading LLMs and found that model performance **degrades significantly as input length increases** — even on simple tasks. More importantly, distractors (irrelevant information in context) compound the problem: even a single distractor reduces performance, and the effect gets worse at longer input lengths.

This creates an optimization problem: provide the agent with the context it needs using as few tokens as possible.

MCP is particularly harmful here because it loads **all tool definitions into your context window upfront**, even when you don't need them. And the numbers are staggering:

- A popular GitHub MCP server injects **93 tool definitions** consuming **~55,000 tokens** before you even ask a question
- Playwright MCP uses **~13,700 tokens**, Chrome DevTools MCP around **~18,000 tokens**

If we think of 200k token context windows, you could be using half of your budget **before even starting any work**.

## What should I use instead?

In most cases, you should build an [agent skill](https://agentskills.io/home) that just calls a CLI.

Skills solve the context pollution problem through **progressive disclosure**: at startup, the agent loads only the skill's name and one-line description. The full instructions are loaded into context **only when the agent actually needs them**. 
This means you can have hundreds of skills available while only paying a small amount of tokens.

Here's a short example of a skill:

```md
 ---
  name: github-issues
  description: Create, list, and manage GitHub issues using the gh CLI.
  allowed-tools:
    - Bash
    - Read
    - Grep
  user-invocable: true
  ---

  # GitHub Issues Skill

  You manage GitHub issues using the `gh` CLI tool.

  ## Available Actions

  - **List issues**: `gh issue list`
  - **Create issue**: `gh issue create --title "..." --body "..."`
  - **View issue**: `gh issue view <number>`
  - **Close issue**: `gh issue close <number>`
  - **Add labels**: `gh issue edit <number> --add-label "bug"`

  ## Rules

  - Always confirm with the user before creating or closing issues.
  - Use `gh auth status` to verify authentication if a command fails.
  - Format issue bodies with markdown for readability.
  - When listing issues, default to showing open issues unless the user specifies otherwise.

  ## Example Workflows

  **Creating a bug report:**
  gh issue create --title "Fix login timeout" --body "## Description\nLogin times out after 5s on slow connections.\n\n## Steps to Reproduce\n1. Throttle network\n2. Attempt login"

  **Listing issues by label:**
  gh issue list --label "bug" --state open

```

If you want to be extra frugal, you can have separate agent configurations with separate skills for each of your use cases.

## Composability

Beyond token savings, we get another major benefit: **composability**.

CLIs already speak a universal interface — stdin, stdout, stderr, exit codes - and  every major service (probably) already has one: `gh`, `aws`, `kubectl`, `docker`, `terraform`.

Let's say you want to fetch your GitHub issues and prioritize them by running some script.

When we rely on MCP tools, you can't avoid the model calling something like `get_issue`, bringing all the details into its context just to then call the script. Each issue is a round-trip through the model.

With Bash + CLIs, your agent can just write:

```bash
gh issue list --json number,title,labels,updatedAt --limit 50 \
  | python3 prioritize.py \
  | head -10
```

No round-trips to the model, no context bloat — just data flowing through pipes.

[Mario Zechner demonstrated this](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/) by replacing the Playwright MCP server with four simple Node.js scripts. 
The README for his tools consumes **225 tokens** compared to Playwright MCP's 13,700 — a **98% reduction**.

## So can I just drop MCP completely?

For most cases, I'd say yes — unless you need the server for authentication or a stateful connection.

For example, in my [Reagent](https://github.com/fsmiamoto/reagent) MCP server, I use the stateful nature of the server to boot an HTTP server alongside it, so users get a the local server running without extra friction.

[Anthropic's own engineering team](https://www.anthropic.com/engineering/code-execution-with-mcp) acknowledged this problem, proposing code execution as a way to reduce MCP token usage from 150,000 to 2,000 tokens — a 98.7% reduction. Their key insight is the same: **progressive disclosure beats upfront loading**.

## Wrap up

The core idea of this post builds on [Mario Zechner's excellent post](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/), but I wanted to also nudge people to just write more CLIs.

The protocol you use is just plumbing. What matters is giving your agent the right context at the right time — and a well-designed CLI behind a skill does that far better than a bloated MCP server.

So next time you're thinking of writing an MCP server, how about you just build a CLI?

### References
- [Context Rot paper from Chroma](https://research.trychroma.com/context-rot)
- [Mario Zechner — "What if you don't need MCP?"](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)
- [Agent Skills specification](https://agentskills.io/home)
- [Anthropic — "Code execution with MCP"](https://www.anthropic.com/engineering/code-execution-with-mcp)
