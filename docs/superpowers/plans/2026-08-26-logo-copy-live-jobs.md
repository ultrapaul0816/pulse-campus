# Logo, alumni language, and live jobs implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Quiet company-logo decoration, clarify alumni availability, and keep the live-jobs feed visible in the primary workspace.

**Architecture:** Preserve the existing single-file reactive prototype. Add behavior assertions to the browser acceptance harness, then change the template/CSS/state labels in `index.html` and keep the existing job-arrival and radar motion systems intact.

**Tech Stack:** Static HTML, declarative custom elements, inline JavaScript/CSS, browser acceptance harness.

**Spec:** `docs/superpowers/specs/2026-08-26-logo-copy-live-jobs.md`

## Global Constraints

- Work directly on the user-approved local `main` prototype; do not create a branch or worktree.
- Preserve the active radar sweep and selected-signal tracking.
- Keep the existing slow linear job crawl, interaction pause, and reduced-motion behavior.
- Do not modify or replace existing logo assets.

---

### Task 1: Acceptance coverage

**Files:**
- Modify: `tests/prototype-ui.html`

**Interfaces:**
- Consumes: rendered campus DOM from `index.html`
- Produces: browser-visible pass/fail assertions for logo state, alumni copy, and live-jobs placement

- [x] **Step 1: Add assertions for neutral logo tiles and a discrete availability dot**
- [x] **Step 2: Add assertions for human alumni language and absence of user-facing seat counts**
- [x] **Step 3: Add assertions that the market rail follows progress in document order and stays visible with an inspector open**
- [x] **Step 4: Run the browser harness and verify the new assertions fail for the expected current behavior**

### Task 2: Logo and alumni-language implementation

**Files:**
- Modify: `index.html`
- Modify: `README.md`

**Interfaces:**
- Consumes: existing `dock`, `companyDirectory`, and `pp` view-model objects
- Produces: neutral logo surfaces, explicit availability dots, and human-facing availability labels

- [x] **Step 1: Make loaded logo images cover their fallback and give all ordinary tiles the same neutral edge**
- [x] **Step 2: Add an availability-dot state without changing selected/new-company states**
- [x] **Step 3: Replace user-facing person-as-seat language with alumnus, alumni, or contact language**
- [x] **Step 4: Run the browser harness and verify the logo/copy assertions pass**

### Task 3: Live-jobs rail placement

**Files:**
- Modify: `index.html`
- Modify: `tests/prototype-ui.html`

**Interfaces:**
- Consumes: existing `tapeSequences`, live-arrival queue, and market interaction handlers
- Produces: an in-flow market rail directly below outreach progress that is never shelved by inspector state

- [x] **Step 1: Move the claimed-user market rail below outreach progress**
- [x] **Step 2: Remove inspector shelving while retaining direct-interaction pauses**
- [x] **Step 3: Update toast geometry and rail-visibility assertions for the in-flow location**
- [x] **Step 4: Run the full harness at 1366x768 and visually inspect the main campus and selected-company states**

### Task 4: Final verification

**Files:**
- Verify: `index.html`
- Verify: `tests/prototype-ui.html`
- Verify: `README.md`

**Interfaces:**
- Consumes: completed prototype
- Produces: fresh acceptance results and a user-reviewable local preview

- [x] **Step 1: Run the full browser acceptance harness and confirm zero failures**
- [x] **Step 2: Inspect the desktop first-load and selected-company screenshots for clipping, overlap, and state clarity**
- [x] **Step 3: Review the git diff and report local-only status without committing or pushing**
