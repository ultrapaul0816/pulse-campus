# Pulse Campus

Desktop-first **TPO first-session mock** for Cognavi Pulse. A placement office claims their college, sees where last year’s batch already works, reveals a few people who are on Pulse, and asks them to help place **2027**.

No backend. Seeded demo data. Session in `localStorage`. Not the full University OS (`cognavi-university` — leave that repo alone).

**Live (current design prototype):** https://ultrapaul0816.github.io/pulse-campus/  
**Vanilla SPA (previous implementation):** https://ultrapaul0816.github.io/pulse-campus/app/  
**Repo:** https://github.com/ultrapaul0816/pulse-campus

The root page is the design-canvas prototype (`index.html` + `support.js`) with momentum, radar pings, daily drop, market tape, campus report, and a threaded inbox. It reads `app/data.js` and `app/graph.js`. The earlier IIFE mock still lives in `app/`. Handoff notes: `prototype/HANDOFF.md`.

---

## What to sell

Placement **via alumni**, not “an alumni network.”

Find the path from campus evidence to a company action. See where alumni work, understand why roles fit, and coordinate reviewed outreach. **2027 is the batch to brief.** 2026 status is still incomplete — do not pretend it is ready.

Copy must stay honest: Pulse can see **counts** from public professional profiles, and **names** only for people who joined Pulse. Do not say companies are chasing the campus. Do not invent PII. Do not send the TPO to LinkedIn hunt.

---

## First-session loop (this is the product)

1. **Find the campus path** — search and pick a college from the single primary control.
2. **Claim the office** — name, placement role, and work email. The prototype visibly simulates work-domain verification: check domain → match campus office → secure campus graph. A guest does **not** get another university’s graph.
3. **Welcome, then radar** — the welcome calibration shows mapped employers, available alumni, and warm roles; Free remains evidence exploration with 3 introductions/day, while Pro adds reviewed AI plans and batch outreach. Then employers appear as dots, with logos in the dock. A teal status dot means alumni are available.
4. **Click a company** — campus-match evidence appears before available alumni by role, branch, class year, and city. **No legal names.** Live jobs sit alongside them.
5. **Hello on Pulse** — Free starts 3 connections/day. Pro prepares a tailored draft for every available alumnus at the selected company, then sends only after one explicit review.
6. **After they reply** — a second Pulse ask: HR intro / two profiles / placement pipeline.
7. **Inbox** — threads stay unnamed. **Next day** (demo) lands replies.

Three chips: *Company → Alumni available → Pulse message*.

### Cold start vs this mock

Many real campuses have **nobody** on Pulse. Do not invent a roster. The radar is company **counts**. Invite **2027** is the only day-one work they already do (the list they mail). Alumni paste is optional later in **File**; names appear when those people join.

For the **clickable demo**, the mock seeds a few people as already on Pulse at the largest employers (Infosys, Bosch, TCS, then L&T, Denso, Zoho) so a TPO can complete reveal → ask in one sitting. That seed is `seedCampusPulse()` in `app/app.js`. It runs only when `onPulse` is empty.

---

## Product decisions that still stand

| Decision | Detail |
|---|---|
| Desktop first | Click a radar/dock point, side inspector. Not hover. Not a mobile story-sheet (later). |
| Two doors | TPO this mock. Alumni signup later. |
| No top tabs | Do not bring back Work / Students / Market / File as chrome tabs. File is a **drawer** from the college chip after claim. |
| Outreach | Free: **3 connections/day, campus-wide**. Pro: reviewed bulk outreach to every selected alumnus available on Pulse. Public-profile counts are never treated as contactable people. |
| Jobs | Live roles are unmetered **Open now**. Pulse market intelligence + college affinity — not a fake 3-JD tank. Internships are a last Internshala **snapshot** (feed dead since Jun 2025). |
| Ask | After a name is open. Pulse delivers. Inbox for replies. |
| 2027 vs 2026 | Brief 2027. 2026 is incomplete. |
| Names | Never invent. Demo names are synthesised in `graph.js` and only visible when their key is in `state.onPulse`. |
| LinkedIn person-search | Rejected (accuracy + DPDP + TPO work). |
| Radar views | Both axes mean something in both views. **Signal** (default) = relationship space: angle = sector wedge (rim labels), radius = signal band — alumni-on-Pulse inner, hiring-now middle, counts-only outer (bands agree with the dock ranking; a deterministic relaxation pass keeps 44px targets from swallowing neighbours). **Distance** (free toggle, corner control) = physical space: real km from campus to each employer's nearest known site, north up, log rings at 10/50/250/1,000 km. |
| Distance zoom | Picking a Pro range (≤50/≤250 km) re-anchors the ring scale so the limit becomes the outer ring; dots animate, out-of-range companies slide off the rim along their real bearing, the hub shrinks, and the dock + count line filter to in-range. **City cluster focus** (Pro chips, e.g. "Bengaluru · 13") re-centers the radar on that city with a 1/5/25 km scale and shows the way back ("campus is 280 km SE"). Sites within ~3 km of a city centre drop the km number and spread around the hub — city-level coordinates must not fake precision. |
| Geo data | Site coordinates come from the College Catchment Explorer dataset plus curated city-level sites for majors (`app/geo.js`) — distances are real, never invented; a company with no geo record sits dimmed at the rim as "location unverified". |
| Visual | Grok-dark UI, Cognavi teal `#08a4b8`. Radar dots, not logos (logos clip/blur on the sweep). Dock logos sit in white padded tiles; tiny favicons fall back to initials. |

---

## Run locally

From the **repo root** (needed so the prototype can load `./support.js` and `./app/data.js`):

```bash
python3 -m http.server 3020 --bind 127.0.0.1
```

- Prototype (designs): http://127.0.0.1:3020/
- Vanilla SPA: http://127.0.0.1:3020/app/
- UI acceptance checks: http://127.0.0.1:3020/tests/prototype-ui.html

**Reset demo** in the header clears `localStorage` and starts over.

Query: `?hold=1` holds the old scan animation if you ever re-enable that scene.

After CSS/JS edits, bump the `?v=` query on the matching tag in `app/index.html` or the browser will keep a stale file.

---

## Repo layout

```
index.html        Design-canvas prototype (current TPO designs). STORAGE = pulse-campus:dc:v2
support.js        Prototype runtime (generated). Do not hand-edit.
app/index.html    Vanilla IIFE SPA (previous implementation)
app/styles.css    Grok dark + teal
app/data.js       14 colleges, employer counts, jobs j1–j27 (some intern: true)
app/graph.js      buildEmployment, role books, COMPANY_DOMAINS, logoHTML / logoSrc
app/geo.js        campus + company-site coordinates, haversine/bearing, nearestSite (distance radar view)
app/logos/        local PNG marks (`{domain}.png`) — used by prototype and SPA
app/app.js        IIFE SPA. STORAGE = pulse-campus:tpo:v8. LOOKS_MAX = 3
prototype/HANDOFF.md   Notes from the design drop (momentum, tape, daily drop, inbox)
tests/prototype-ui.html Browser acceptance checks for responsive layout, contrast, targets, motion, and inspector containment
mood.md / voice.md / tokens.md   Prototype brand, copy, and design-system guidance
.github/workflows/pages.yml   deploys root prototype + app/ to GitHub Pages
```

### Prototype extras (root `index.html`)

- **Onboarding** — simulated work-email validation and a pre-radar welcome are transient UI state; saved v2 demo fixtures reopen at a stable surface, never half-way through a verification animation
- **Momentum bar** — climbs on visit (+3), reveal (+10), ask (+14), reply (+20)
- **Radar pings** — every ~5s, floating signal labels + sonar echo
- **Company dock** — the twelve most actionable employers, ranked by fresh arrival, available alumni, hiring activity, and alumni count; every employer remains a radar dot and is available in a searchable, filtered `View all` directory
- **Task mode** — opening an inspector keeps the radar sweep, selected-company lock, and live-jobs rail active while pausing only transient ping bursts
- **Daily drop** — full-screen 3-look moment, overnight joins, fresh tape
- **Market tape** — an in-flow rail below outreach progress with compact logo-led roles ordered newest-first, slow idle crawl, simulated live arrival that temporarily promotes its company in the dock, and Pro filters (My branches / Warm paths / Today)
- **Pro action panel** — company and job evidence remain free; Pro turns the selected evidence into a coordinated review plan
- **AI preparation** — simulated stages read evidence, draft distinct alumni introductions, add an exact-job batch opportunity brief, then expose selected/skipped review rows; this step never sends
- **Signal acquisition** — inspectors and dialogs resolve through a one-shot 280ms radar lock/beam; reduced motion receives a restrained fade
- **Two-lens radar** — corner Signal/Distance toggle. Signal: sector wedges + signal bands (on Pulse / hiring / counts). Distance: real bearing + log-scaled km to the nearest site (site named in the inspector while in distance view), Pro range zoom and Pro city-cluster focus, animated dot transitions (disabled under reduced motion)
- **Campus report** — sector mix, cities, CTC bands, principal brief
- **Inbox** — threads, timestamps, Send 2 profiles, Nudge
- **Job evidence** — exact role and stream, then Connect 2027 batch evidence or Copy role brief
- Japan-linked filter dropped in the prototype (data still in `data.js`)

### Data / graph

- `data.js` — colleges (id, short, city, NIRF, alumni, departments, companies by type). NIT Trichy (`nitt`) has 27 employers.
- `graph.js` — turns company counts × role book into people. Keys look like `Bosch|Quality Engineer|Rohit V.` or `Bosch|Quality Engineer|0` for synthesised rows. Logos: `app/logos/{domain}.png` copied from **Pulse** (`logoUrl` on `/api/companies`, CI3 + Pulse S3). Favicon then initials if missing.
- Live jobs in `data.js` are illustrative of Pulse/market cuts, not a live API. The prototype simulates one incoming Bosch role; production will replace that timer with a real stream. College affinity = **counts**, not verified names.

### State (`app.js`)

- `localStorage` key: `pulse-campus:tpo:v8`
- Important fields: `collegeId`, `claimed`, `looks`, `onPulse[]`, `unlocked[]`, `today[]`, `inbox[]`, `inspectCompany` / `inspectName` / `inspectRole`, `askOpen`, `day`
- Guest until Reveal/claim. Claim form sits on the person card.
- Bump `STORAGE` if you change the default shape and old sessions would break.

---

## How an agent should extend this

- Keep the TPO loop obvious. If a TPO cannot see **who** to ask and **what to click next**, the change failed.
- Company card is not the job board. People on Pulse come first. Jobs are “Open now” under the person/company.
- Do not reintroduce a jobs tank, hover popovers as the desktop path, or LinkedIn as the ask channel.
- Do not auto-mail anyone. Pro may prepare and select a batch, but the TPO must review and explicitly send it.
- Prefer editing `app/app.js` + `app/styles.css` + `app/graph.js`. Cache-bust in `index.html`.
- Verify in a browser (desktop 1440×900). Isolated profile / Reset demo so leftover `localStorage` does not mix sessions.
- Also verify the 1366×768 short-laptop layout and run `tests/prototype-ui.html` before considering a UI pass complete.
- Alumni door and mobile story-sheet are **later**, not this mock.

---

## Honest limits of the data

- Counts are illustrative of Pulse affinity, not a production dump.
- LinkedIn jobs intelligence exists in Cognavi’s world (~7k/day historically); this mock does not call S3.
- Internshala internship rows are a snapshot. Label them as such.
- Distance-view coordinates are city/site-level (catchment dataset + curated majors), so distances are real to within a few km — good enough for "can we run a drive there", not for routing.
- NIRF-flavoured college list. No Japanese employers as the campus graph (Japan corridor is a hiring *destination* for some people, not the employer set on Indian campuses).

---

## Not built yet

Alumni login, batch rooms, real Pulse API, invite tick-up that joins names in the **same** session (paste alumni → File → they join on **next day** in the demo), mobile.
