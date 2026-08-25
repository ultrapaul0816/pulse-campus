# Pulse Campus

Desktop-first **TPO first-session mock** for Cognavi Pulse. A placement office claims their college, sees where last year’s batch already works, reveals a few people who are on Pulse, and asks them to help place **2027**.

No backend. Seeded demo data. Session in `localStorage`. Not the full University OS (`cognavi-university` — leave that repo alone).

**Live:** https://ultrapaul0816.github.io/pulse-campus/  
**Repo:** https://github.com/ultrapaul0816/pulse-campus

---

## What to sell

Placement **via alumni**, not “an alumni network.”

Where last year’s batch works → use them for this year’s. **2027 is the batch to brief.** 2026 status is still incomplete — do not pretend it is ready.

Copy must stay honest: Pulse can see **counts** from public professional profiles, and **names** only for people who joined Pulse. Do not say companies are chasing the campus. Do not invent PII. Do not send the TPO to LinkedIn hunt.

---

## First-session loop (this is the product)

1. **Which campus** — search, pick a college (NIT Trichy is the default demo).
2. **Radar** — 27 employers as dots. Sharp logos live in the dock under the radar, with a headcount under each tile. **Teal-ringed tiles already have someone on Pulse.**
3. **Click a company** (dock or radar). If anyone from this campus is on Pulse there, the side card opens **that person**, not a job board.
4. **See who** — even while the legal name is sealed you can identify the seat: role, city, department, class year.
5. **Reveal the name** — first time, claim the placement office; after that, spend a **look** (3 per campus per day).
6. **Ask on Pulse** — the message composer opens on reveal. Pulse writes, the TPO sends, Pulse delivers. Not college email. Not LinkedIn-primary. Not auto-mail.
7. **Inbox** — replies (demo: advance a day). **Today** tray holds who you looked at.

Four chips under the dock track the step: *Click a company → See who → Reveal the name → Ask on Pulse*.

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
| Looks | **3 names/day, campus-wide**, not 3 contacts per company. Counts are always free. |
| Jobs | Live roles are unmetered **Open now**. Pulse market intelligence + college affinity — not a fake 3-JD tank. Internships are a last Internshala **snapshot** (feed dead since Jun 2025). |
| Ask | After a name is open. Pulse delivers. Inbox for replies. |
| 2027 vs 2026 | Brief 2027. 2026 is incomplete. |
| Names | Never invent. Demo names are synthesised in `graph.js` and only visible when their key is in `state.onPulse`. |
| LinkedIn person-search | Rejected (accuracy + DPDP + TPO work). |
| Visual | Grok-dark UI, Cognavi teal `#08a4b8`. Radar dots, not logos (logos clip/blur on the sweep). Dock logos sit in white padded tiles; tiny favicons fall back to initials. |

---

## Run locally

```bash
cd app
python3 -m http.server 3020 --bind 127.0.0.1
```

Open http://127.0.0.1:3020/

**Reset demo** in the header clears `localStorage` and starts over.

Query: `?hold=1` holds the old scan animation if you ever re-enable that scene.

After CSS/JS edits, bump the `?v=` query on the matching tag in `app/index.html` or the browser will keep a stale file.

---

## Repo layout

```
app/index.html    shell, Inter + IBM Plex Mono, cache-busted asset tags
app/styles.css    Grok dark + teal
app/data.js       14 colleges, employer counts, jobs j1–j27 (some intern: true)
app/graph.js      buildEmployment, role books, COMPANY_DOMAINS, logoHTML
app/app.js        IIFE SPA. STORAGE = pulse-campus:tpo:v8. LOOKS_MAX = 3
.github/workflows/pages.yml   deploys app/ to GitHub Pages on push to main
```

### Data / graph

- `data.js` — colleges (id, short, city, NIRF, alumni, departments, companies by type). NIT Trichy (`nitt`) has 27 employers.
- `graph.js` — turns company counts × role book into people. Keys look like `Bosch|Quality Engineer|Rohit V.` or `Bosch|Quality Engineer|0` for synthesised rows.
- Live jobs in `data.js` are illustrative of Pulse/market cuts, not a live API. College affinity = **counts**, not verified names.

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
- Do not auto-mail anyone.
- Prefer editing `app/app.js` + `app/styles.css` + `app/graph.js`. Cache-bust in `index.html`.
- Verify in a browser (desktop 1440×900). Isolated profile / Reset demo so leftover `localStorage` does not mix sessions.
- Alumni door and mobile story-sheet are **later**, not this mock.

---

## Honest limits of the data

- Counts are illustrative of Pulse affinity, not a production dump.
- LinkedIn jobs intelligence exists in Cognavi’s world (~7k/day historically); this mock does not call S3.
- Internshala internship rows are a snapshot. Label them as such.
- NIRF-flavoured college list. No Japanese employers as the campus graph (Japan corridor is a hiring *destination* for some people, not the employer set on Indian campuses).

---

## Not built yet

Alumni login, batch rooms, real Pulse API, invite tick-up that joins names in the **same** session (paste alumni → File → they join on **next day** in the demo), mobile.
