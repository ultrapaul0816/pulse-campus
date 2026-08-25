# Pulse Campus — handoff notes
Date: 2026-08-25
Repo: ultrapaul0816/pulse-campus (branch: main, app/)

## What's in this package
- `Pulse Campus.dc.html` — the full updated prototype (single file; open directly in a browser). Requires `support.js` alongside it.
- `support.js` — runtime the prototype loads.
- `app/` — original repo source copied for reference (unchanged).

## Changes since last sync (all in Pulse Campus.dc.html)
- Momentum bar: climbs per action (visit +3, reveal +10, ask +14, reply +20)
- Radar pings every ~5s with floating signal labels + sonar echo blips
- Daily drop: full-screen 3-look moment, alumni-joined-overnight counts, fresh tape drops
- Market tape: bottom job ticker (role, company, city, CTC, age, source); warm-path glow; Pro-locked filters (My branches / Warm paths / Today)
- Campus report toggle: sector mix, cities, CTC bands, Pro-blurred week deltas, one-click principal brief
- Inbox: threaded messages with timestamps, replies, "Send 2 profiles", "Nudge" while waiting
- Job cards: "Match my 2027" (upload → matches + sample + framed brief), "Copy brief"

## Decisions
- Dropped Japan-linked filter (data retained, easy to restore)
- Text-first ticker, no logo tiles
- Company click → "See who" card (honest step flow)
- Signal labels on radar pings for credibility

## Open items
- Real logo capture (Clearbit blocked in prototype env; fine in production)
- Inbox reply timing / nudge UX refinement
- Radar ping frequency (~5s) — validate "believable activity without noise"

## Suggested commit
Place `Pulse Campus.dc.html` + `support.js` in a `prototype/` folder (or wherever design prototypes live) and commit:
"prototype: gamified TPO campus radar — momentum, daily drop, tape, report, inbox"
