# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev          # start dev server (Vite)
yarn build        # type-check + build (runs generate:og first)
yarn lint         # ESLint
yarn preview      # preview production build locally
```

No test suite exists. Verify changes with `yarn build` (TypeScript + Vite).

## Environment

Copy `.env.local` and set:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

The app works without Supabase — `isSupabaseConfigured` guards all Supabase calls and every hook falls back to localStorage.

## Architecture

**Single-page app** (React 19 + Vite + TypeScript) deployed on Vercel. Two routes: `/` (`App.tsx`) and `/leaderboard` (`Leaderboard.tsx`). The `vercel.json` SPA rewrite redirects all paths to `index.html`.

### Core concept
The app tells São Paulo tech workers whether it's lunchtime or happy hour right now. Two modes (`lunch` / `drink`) each have a time window. A seeded daily RNG picks one restaurant/bar per day deterministically from the list.

**Seeded suggestion logic** (`App.tsx` → `getSuggestionIndicesForDate`): derives a numeric seed from the BRT date string (`YYYY-MM-DD`), runs it through a 32-bit Mulberry32-style RNG, and picks indices into the `restaurants` and `bars` arrays. Both indices are derived from the same seed in sequence, so `lunch` and `drink` always show *different* places.

### Timezone
**All date strings must use BRT (UTC-3, `America/Sao_Paulo`), never UTC.** The utility is `src/lib/date.ts → getBRTDateStr(date?)`. Using `new Date().toISOString().slice(0,10)` is wrong — after 21:00 BRT the UTC date is already the next day.

### Data flow
- `useRestaurants` — fetches from Supabase `restaurants` table on mount; initialises with hardcoded fallback arrays from `src/data/restaurants.ts` (114 lunch + 8 drink entries). Restaurant list edits go through the Supabase dashboard, not code.
- `useUser` — stores a UUID fingerprint in `localStorage['jahpod-fingerprint']`; looks up / creates a row in `users` by fingerprint; exposes `identify(name)` which creates the Supabase record and is gated by `NameModal`.
- `useGameStats` — localStorage-only streak/visit/rating state (`localStorage['jahpod-stats']`). Streak increments only if `lastVisitDate` is yesterday (BRT).
- `useWeekHistory` — fetches the user's last 7 days of visits + ratings from Supabase. Used only for `visited` / `rating` status; **restaurant names in the week history are always re-derived from the seeded RNG** (mode-aware), not stored names.
- `useVotes` — votes for *tomorrow*'s restaurant; upserts `(user_id, vote_for_date)`.
- `useNotifications` — browser `Notification` API; fires at 11:25 and 17:55 local time via a 60s interval.

### Supabase schema (`supabase/schema.sql`)
Five tables: `users`, `visits`, `ratings`, `votes`, `restaurants`. All have RLS enabled with public-access policies (no auth). Run the SQL file in the Supabase dashboard SQL editor to initialise or reset the schema.

### PWA
`public/manifest.json` + `public/sw.js` (registered in `main.tsx`). The service worker caches static assets for offline use.

### Styling
One CSS file per route: `App.css` for the main view, inline styles in `Leaderboard.tsx`. Mobile-first with a single breakpoint at `480px`. Background colour (`#d32f2f` red / `#00c853` green) transitions on `canGo` state, applied directly to `document.body` via `useEffect`.


## Workflow Orchestration

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately 
- Don't keep pushing.
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep the main context window clean.
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- Capture Lessons: Update AGENT.md with any change in approach the user has asked you to make.
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until the mistake rate drops.
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself, "Would a staff engineer approve this?"
- Run tests, check logs, and demonstrate correctness.

### 5. Demand Elegance (Balanced)
- For non-trivial changes, pause and ask, "Is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes 
- Don't over-engineer.
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report, just fix it. Don't ask for hand-holding
- Point at logs, errors, and failing tests. 
- Then resolve them.
- Zero context switching required from the user
- Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write a plan to `tasks/todo.md` with checkable items.
2. **Verify Plan**: Check in before starting implementation.
3. **Track Progress**: Mark items complete as you go.
4. **Explain Changes**: High-level summary at each step.
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.

## Context Efficiency

### Subagent Discipline

**Context-aware delegation:**
 - Under ~50k context: prefer inline work for tasks under ~5 tool calls.
 - Over ~50k context: prefer subagents for self-contained tasks, even simple ones — the per-call token tax on large contexts adds up fast.

When using subagents, include output rules: "Final response under 2000 characters. List outcomes, not process."
Never call TaskOutput twice for the same subagent. If it times out, increase the timeout — don't re-read.

### File Reading
Read files with purpose. Before reading a file, know what you're looking for.
Use Grep to locate relevant sections before reading entire large files.
Never re-read a file you've already read in this session.
For files over 500 lines, use offset/limit to read only the relevant section.

### Responses
Don't echo back file contents you just read — the user can see them.
Don't narrate tool calls ("Let me read the file..." / "Now I'll edit..."). Just do it.
Keep explanations proportional to complexity. Simple changes need one sentence, not three paragraphs.

**Tables — STRICT RULES (apply everywhere, always):**
- Markdown tables: use minimum separator (`|-|-|`). Never pad with repeated hyphens (`|---|---|`).
- NEVER use box-drawing / ASCII-art tables with characters like `┌`, `┬`, `─`, `│`, `└`, `┘`, `├`, `┤`, `┼`. These are completely banned.
- No exceptions. Not for "clarity", not for alignment, not for terminal output.