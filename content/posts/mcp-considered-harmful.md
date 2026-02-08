---
title: "CLIs over Tools: MCP considered harmful?"
date: "2026-02-06"
tags: ["coding", "ai"]
---

![A small robot standing at a fork in the road, choosing between MCP and CLIs](/images/mcp-considered-harmful.png)

Whenever faced with the question about how to give an Agent a new capability, I still often hear:

> Oh, what if we build an MCP server for this?

This post aims to discourage that.

Instead, we should be relying more on CLIs and letting our agents use Bash - something they are really good at.

## Why MCP is not ideal

If you've interacted with any Coding Agent, you might be familiar with the concept of [Context Rot](https://research.trychroma.com/context-rot).

The core idea is that model performance **degrades significantly as context window increases** — even on simple tasks. 

This creates an optimization problem: provide the agent with the context it needs using as few tokens as possible.

MCP is particularly harmful here because it loads **all tool definitions into your context window upfront**, even when you don't need them. Even [Anthropic's engineering team](https://www.anthropic.com/engineering/code-execution-with-mcp) already 
acknowledged this problem.

Popular servers like [Playwright](https://github.com/microsoft/playwright-mcp) can consume 13,700 tokens just with the definitions.

This means you're consuming valuable context window without doing any valuable work.

## What should I use instead?

The core idea to tackle this is **progressive disclosure**, which essentially means we give the agent more details about something **only when it needs it**.

The main emerging pattern for this are [Agent Skills](https://agentskills.io/home), where instead of including all the details in the context window upfront, 
we include just a small description that hints to the Agent when it should use that skill.

But we can also start with an even simpler approach: using your `AGENTS.md` file you can nudge your agent to use some CLI when it needs to accomplish some task.

For example, let's say you want your agent to be able to create GitHub pull requests for you. Instead of using the GitHub MCP server, you can do something like:

```md
# AGENTS.md
[...]

# Pull Request
- Whenever you need to create a pull request, use the `gh` CLI with the `pr` subcommand. Check the details of how to do it with `--help`

[...]
```

This pattern is simple but a powerful way to save on tokens and make sure your agent knows how to do something only when it needs it.

To scale this further, you can then build a proper Skill, with more details for any particular need you have. Here's an example:

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

## Composability

Beyond valuable token savings that progressive disclosure brings, using CLI instead of MCP brings another major benefit: **composability**.

CLIs already speak a universal interface — stdin, stdout, stderr, exit codes - and every major service (probably) already has one.

This means your agent is able to compose it with other CLI tools and code to achieve a particular goal, something which is not straightforward with MCP.

Let's say you want to fetch your GitHub issues and extract some information by running some script.

When we rely on MCP tools, you can't avoid the model calling something like `get_issue`, bringing all the details into its context just to then call the script.

This bloats your context window unnecessarily as you probably only care about the output of your script, not the input which contains all the issue data.

If we let our agent just use Bash and CLI, it can then come up with something like this:
```bash
gh issue list --json number,title,labels,updatedAt --limit 50 \
  | python3 extract.py \
```

## So can I just drop MCP completely?

If you find an existing CLI that accomplishes what you need out of an MCP server, I'd say yes — unless you want it for some specific reason.

For example, in [ReAgent](https://github.com/fsmiamoto/reagent) MCP server, I
use the stateful nature to boot an HTTP server alongside the MCP server. This
reduces friction as users don't have to do anything extra to be able to see
code reviews in their browser.

Of course, there's a ton of other MCP features (and issues) I'm not mentioning here so your mileage may vary.

## Wrap up

The core idea of this post builds on [Mario Zechner's excellent post](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/), but I wanted to also nudge people to just write more CLIs.

By building a CLI instead of an MCP server, not only you get the ability to use it for ad-hoc tasks on your terminal, but you also get a powerful way to give your agent new capabilities as well.

So next time you're thinking of writing an MCP server, how about you build a CLI instead?

### References
- [Context Rot paper from Chroma](https://research.trychroma.com/context-rot)
- [Mario Zechner — "What if you don't need MCP?"](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/)
- [Agent Skills specification](https://agentskills.io/home)
- [Anthropic — "Code execution with MCP"](https://www.anthropic.com/engineering/code-execution-with-mcp)
