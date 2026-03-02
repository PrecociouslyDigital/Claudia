# Claudia Project Overview

**Purpose:** Browser-based interaction fiction / chat app game (SvelteKit + Svelte 5)

**Tech stack:** SvelteKit, Svelte 5 (runes), TypeScript, Vitest + vitest-browser-svelte (Playwright/Chromium), fast-check (v4) for test arbitraries

**Key commands:**

- `npm run test` — run all tests (non-interactive)
- `npm run test:unit` — run tests in watch mode
- `npm run check` — svelte-check + TypeScript
- `npm run lint` — prettier + eslint
- `npm run format` — prettier write

**Test layout:** All tests live in `src/test/`, mirroring the source tree:

- `src/test/utils/arb.ts` — fast-check arbitraries for game types
- `src/test/lib/` — component tests
- `src/test/routes/` — page tests

**Important paths:**

- `src/lib/types.ts` — core types (ChatUser, ChatComponentState, ChatAppState, Markdown/md)
- `src/lib/state.svelte.ts` — shared reactive singleton (appState)
- `src/lib/chat/`, `src/lib/selector/`, `src/lib/input/` — component folders
- `src/routes/+page.svelte` — main page

**Test approach:** Use `fc.sample(arb, 1)[0]` (single draw) not `fc.assert`; browser rendering too slow for multi-run. fc.alpha() removed in fc v4 — use `fc.stringMatching(/^[a-z]{3,16}$/)` instead.
