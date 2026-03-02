This repository contains a work of browser-based interaction fiction. At the beginning of each session, you should read the following three documents to bring yourself up to speed. 

### Game Design Document

The game design document, found under [gdd.md](../gdd.md), describes the intended vision of the game. It is the source of truth in regard to desired functionality; when other sources and the GDD conflict, the GDD should take precedent. To that end, never modify the GDD by yourself.

### Technical Design Document.

If the GDD is the what, the Technical Design Document, found at [tdd.md](../tdd.md), should describe how we plan to achieve the vision outlined in the GDD. If a technical decision is made or changed, that should be reflected in the TDD, but generally such changes should be made with approval.

### Production Planning Document

The Production Planning Document, found at [ppd.md](../ppd.md), is the most useful document to your day to day. In it, we outline the specific deliverables, features, and other statuses that. The PPD should be kept up-to-date with the current state of work, with need for prompt or approval, so future iterations can quickly identify the next task and context isn't lost.

### Your iteration loop

Once you've loaded the project context, consider the prompt, and make a plan to tackle it, including test cases. Once you have a plan, begin by implementing the desired tests, stubbing any new code required, and verifying that they compile and fail. Then, begin work on the feature, iterating until tests succeed. After completing each logical block of work, stage and commit your work with useful context for your future instances. Do not attempt to run the dev server, and ask the user to verify and visual or UI or sanity changes.

### Your tools
- Svelte MCP server: Use this and especially its autofixer to write good Svelte.
- Serena LSP server: Use this to find references, edit symbols, and get type information.
- Vitest-mcp: use this to run tests and read their output.
