# Pulse Campus end-to-end evidence flow implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a coherent front-end journey from campus discovery and simulated verification through evidence-led company/job matching, reviewed AI preparation, and visible delivery.

**Architecture:** Extend the existing single-component prototype with explicit onboarding, selected-job, plan-preparation, and delivery states. Reuse the current radar, inspector, Pro, inbox, and browser harness; add focused view-model builders and motion classes rather than creating a parallel application.

**Tech Stack:** Static HTML, custom declarative renderer, inline JavaScript/CSS, browser acceptance harness.

**Spec:** `docs/superpowers/specs/2026-08-26-end-to-end-evidence-flow-design.md`

## Global constraints

- Work on the user-approved local `main`; do not create a branch, commit, or push.
- Preserve all existing user changes and logo assets.
- Keep company and job exploration free.
- Pro means AI preparation, reviewed batch action, and delivery visibility; it does not gate the employer directory.
- Keep the radar active during company, role, plan, and delivery states.
- Label validation, AI, data connection, and delivery as simulated where a live backend would be required.
- Respect `prefers-reduced-motion` on every new motion surface.

---

### Task 1: Onboarding state machine

**Files:**
- Modify: `tests/prototype-ui.html`
- Modify: `index.html`
- Modify: `README.md`

**Interfaces:**
- Consumes: `scene`, `collegeId`, `profile`, `claimed`, `claimStep`
- Produces: `onboardingStage`, `validationStep`, `startValidation()`, `enterRadar()`

- [ ] **Step 1:** Add browser assertions that campus selection leads to a claim form with role and work email.
- [ ] **Step 2:** Add browser assertions for visible simulated validation steps and a welcome panel that explains Free and Pro.
- [ ] **Step 3:** Run the harness and confirm the new onboarding assertions fail because validation and welcome states do not exist.
- [ ] **Step 4:** Add transient onboarding defaults, timer cleanup, validation sequencing, welcome rendering, and `Enter campus radar`.
- [ ] **Step 5:** Run the harness and confirm the onboarding path passes without regressing landing geometry.

### Task 2: Company match constellation

**Files:**
- Modify: `tests/prototype-ui.html`
- Modify: `index.html`

**Interfaces:**
- Consumes: selected company, campus departments, company roles, live jobs
- Produces: `companyEvidence(company)`, `.match-constellation`, `.evidence-path`, and an evidence conclusion

- [ ] **Step 1:** Add assertions for three evidence paths, a plain-language conclusion, and active radar motion after company selection.
- [ ] **Step 2:** Run the harness and confirm the constellation assertions fail while the existing radar assertions remain green.
- [ ] **Step 3:** Build the company evidence view model from current demo data and render the staged constellation before actions.
- [ ] **Step 4:** Add line/node motion, live-region completion, and reduced-motion fallbacks.
- [ ] **Step 5:** Run the harness and confirm company evidence passes.

### Task 3: Exact job and batch-evidence flow

**Files:**
- Modify: `tests/prototype-ui.html`
- Modify: `index.html`

**Interfaces:**
- Consumes: `PULSE_CAMPUS.jobs`, campus departments, employer counts, `sheetUploaded`
- Produces: `selectedJobId`, `openJob(job)`, `jobEvidence(job)`, and evidence-led batch dialog

- [ ] **Step 1:** Add assertions that clicking the Infosys Data Analyst row opens that exact job with IT evidence and no empty filter.
- [ ] **Step 2:** Add assertions that the first action is `Connect 2027 batch evidence` and no `Recommend my 2027` control exists.
- [ ] **Step 3:** Run the harness and confirm both assertions fail against the current general jobs-browser transition.
- [ ] **Step 4:** Add `selectedJobId`, centralize every job click through `openJob(job)`, and render exact role evidence.
- [ ] **Step 5:** Replace the match dialog with data-requirement and potential-match states that show explicit reasons.
- [ ] **Step 6:** Run the harness and confirm exact-job and batch-evidence behavior passes.

### Task 4: Pro value and AI preparation

**Files:**
- Modify: `tests/prototype-ui.html`
- Modify: `index.html`
- Modify: `README.md`

**Interfaces:**
- Consumes: selected company/job evidence, available alumni, `pro`, `bulkSelected`
- Produces: clarified Pro panel, `planStage`, `planItems`, `startAIPlan()`, reviewed plan inspector

- [ ] **Step 1:** Add assertions that locked Pro preserves free exploration and describes quantified coordinated outputs.
- [ ] **Step 2:** Add assertions for analysing → drafting → ready state progression and a review containing alumni introductions plus a batch brief.
- [ ] **Step 3:** Run the harness and confirm the new Pro preparation assertions fail.
- [ ] **Step 4:** Rewrite the Pro value panel and active chip copy around coordinated action rather than access.
- [ ] **Step 5:** Build the simulated AI preparation sequence and reviewed plan rows using current alumni and job evidence.
- [ ] **Step 6:** Run the harness and confirm Pro explanation and preparation pass.

### Task 5: Animated reviewed delivery

**Files:**
- Modify: `tests/prototype-ui.html`
- Modify: `index.html`

**Interfaces:**
- Consumes: selected reviewed `planItems`
- Produces: `sendItems`, `sendPlan()`, queued/sending/sent statuses, inbox/today rows, final delivery state

- [ ] **Step 1:** Add assertions that `Send reviewed plan` opens a visible delivery surface and does not collapse to a toast.
- [ ] **Step 2:** Add assertions for queued → sending → sent progression and final Inbox guidance.
- [ ] **Step 3:** Run the harness and confirm delivery assertions fail.
- [ ] **Step 4:** Implement staged delivery timers, animated beam rows, final state, and selected-item persistence.
- [ ] **Step 5:** Add reduced-motion rules that remove travel while preserving status progression.
- [ ] **Step 6:** Run the harness and confirm delivery behavior passes.

### Task 6: Full-flow critique and verification

**Files:**
- Verify: `index.html`
- Verify: `tests/prototype-ui.html`
- Verify: `README.md`

**Interfaces:**
- Consumes: completed prototype flow
- Produces: locally reviewable final state and evidence-backed completion report

- [ ] **Step 1:** Run the complete browser harness at 1366×768 and confirm zero failures.
- [ ] **Step 2:** Walk landing → validation → welcome → company → role → batch evidence → Pro plan → delivery in the browser.
- [ ] **Step 3:** Capture and critique first-load, company evidence, job evidence, plan review, and sent states.
- [ ] **Step 4:** Fix Critical and Important findings with failing regression checks first.
- [ ] **Step 5:** Run independent product/design and code reviews; resolve all Critical and Important findings.
- [ ] **Step 6:** Run `git diff --check`, inspect console logs, and leave the local preview open without committing or pushing.
