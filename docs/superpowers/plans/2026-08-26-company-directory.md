# Company Directory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the radar useful at any college size by showing twelve ranked company logos, while retaining every employer in the radar and a searchable animated directory.

**Architecture:** The root design-canvas component will derive one ranked company list from existing campus, Pulse-seat, job, and live-arrival state. The first twelve entries feed the compact dock; the same ordered list feeds a modal directory filtered by user-controlled state. Existing radar dots continue to render every employer.

**Tech Stack:** Vanilla HTML/CSS, Design Canvas `DCLogic`, seeded data from `app/data.js` and `app/graph.js`, browser acceptance harness in `tests/prototype-ui.html`.

**Spec:** Approved conversation design: twelve visible companies, contactable alumni and hiring activity prioritized, full count retained, searchable/filterable View all panel, temporary `NEW` promotion, compact market rail.

## Global Constraints

- Work directly on the explicitly approved local `main` branch; do not pull, commit, push, or deploy.
- Preserve all existing uncommitted work and edit only the root prototype, its acceptance test, and handoff documentation.
- Radar dots represent every employer; detailed dock logos are capped at twelve.
- Public-profile counts remain counts; only `state.onPulse` people are contactable.
- New motion must use the existing radar-acquisition language and respect `prefers-reduced-motion`.

---

### Task 1: Ranked twelve-company dock

**Files:**
- Modify: `index.html`
- Test: `tests/prototype-ui.html`

**Interfaces:**
- Consumes: `emp.companies`, `pulsePeople(company)`, `window.PULSE_CAMPUS.jobs`, `state.newJobId`.
- Produces: `rankCompanies(companies)`, `dock`, `coCountLine`, and dock item fields `isNew` / `motionClass`.

- [ ] **Step 1: Write the failing acceptance checks**

Add checks asserting exactly twelve `.dock-button` elements, all employer radar buttons remain present, the summary says `Showing 12 of 27 employers`, and every dock mark is no larger than 30px.

- [ ] **Step 2: Run the browser harness to verify it fails**

Run the local acceptance page and expect failures for the new cap, summary, and compact mark checks.

- [ ] **Step 3: Implement the ranking and capped render**

Add `rankCompanies(companies)` with deterministic priority: currently promoted company, contactable Pulse seat count, live-job presence, alumni count, original order. Map only `.slice(0, 12)` to `dock`; leave `radarCos` unchanged.

- [ ] **Step 4: Run the browser harness to verify the dock checks pass**

Expect the new dock checks to pass while all prior acceptance checks remain green.

### Task 2: Searchable radar directory

**Files:**
- Modify: `index.html`
- Test: `tests/prototype-ui.html`

**Interfaces:**
- Consumes: the ranked list from Task 1 and transient component state `companyQuery`, `companyFilter`, `overlay`.
- Produces: `showCompanyDirectory`, `companyDirectory`, `companyFilters`, `onOpenCompanyDirectory`, `onCompanyQuery`, and `onCloseOverlay`.

- [ ] **Step 1: Write the failing interaction checks**

Click `View all 27 employers`; assert an accessible dialog opens with `signal-acquiring`, the market tape is shelved, `Hiring now`, `Alumni available`, and `All companies` controls exist, and searching `Thermax` leaves one matching company result that opens the existing company inspector.

- [ ] **Step 2: Run the browser harness to verify it fails**

Expect failure because the View all action and directory do not yet exist.

- [ ] **Step 3: Implement the bounded directory overlay**

Add default/load/persist-safe query and filter state, a View all button, and an overlay using the existing one-shot acquisition beam. Filter real ranked company objects and reuse `openCompany(name)` after closing the overlay.

- [ ] **Step 4: Run the browser harness to verify the directory checks pass**

Expect the directory search and inspector handoff checks to pass with no regression.

### Task 3: Temporary live promotion and compact market rail

**Files:**
- Modify: `index.html`
- Modify: `README.md`
- Test: `tests/prototype-ui.html`

**Interfaces:**
- Consumes: `state.newJobId`, existing seven-second arrival timer, `.market-job-logo`.
- Produces: `NEW` dock badge/arrival class and an 18px market logo with tighter vertical padding.

- [ ] **Step 1: Write the failing visual behavior checks**

After the simulated job arrival, assert Bosch is dock-ranked and has a visible `NEW` badge; assert market logos are at most 18px and the market rail is no taller than 48px; include the directory promotion class in reduced-motion coverage.

- [ ] **Step 2: Run the browser harness to verify it fails**

Expect failures for the absent dock badge and the current 22px market logos.

- [ ] **Step 3: Implement the arrival treatment and documentation**

Attach `dock-company-new` and `NEW` to the temporarily promoted company, shrink market logos and rail padding, add reduced-motion handling, and document the dock cap/ranking/directory behavior in `README.md`.

- [ ] **Step 4: Run full verification**

Run all browser acceptance checks at 1366x768, then inspect the prototype at 1440x900 and 1366x768 for clipping, hierarchy, focus visibility, and motion quality.
