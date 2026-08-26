# Pulse Campus end-to-end evidence flow

## Objective

Turn the current screen collection into one understandable TPO journey:

```text
Find campus → verify office → understand the product → explore freely
→ acquire a company signal → understand why it fits the campus
→ inspect a specific role → connect batch evidence
→ let AI prepare reviewed actions → watch delivery complete
```

This remains a front-end prototype. Validation, AI preparation, student data, and delivery are visibly labelled as simulated where needed; the interface must not imply a live backend operation.

## Product decision

Company discovery is not a Pro gate.

### Free

- Search and verify one campus office.
- Explore every employer, current role, alumni count, and campus-match explanation.
- Connect a sample 2027 batch and inspect why students may match.
- Start three individual alumni introductions per day.

### Pro

- Turn evidence into a reviewed action plan.
- Prepare distinct introductions for every available alumnus at a selected company.
- Prepare a batch opportunity brief from the same evidence.
- Review all drafts together, choose recipients, and send once.
- See queued, sending, and sent states; Pro does not auto-send.

The upgrade message is: **Explore is free. Pro turns evidence into coordinated action.**

## Considered approaches

### Evidence-led staged flow — selected

Keep the radar as the home surface and progressively assemble evidence inside the inspector. A company builds a campus-match constellation; a role narrows it into requirements, campus evidence, alumni evidence, and batch readiness. Pro begins only after evidence is visible.

This preserves exploration, explains every transition, and gives motion a product meaning.

### Copy-only patch — rejected

Adding explanatory paragraphs to the existing job and match dialogs would not repair the broken transition or make Pro materially different.

### Full wizard — rejected

A linear multi-page wizard would explain the sequence but suppress free exploration, which is the strongest part of the radar concept.

## Visual system

### Palette

- Void: `#000000` — canvas and radar space.
- Instrument: `#141414` — panels and controls.
- Pulse: `#08A4B8` — selected state and active paths.
- Signal: `#3AD6C9` — verified evidence and successful delivery.
- Skill: `#8BD7FF` — role skills and curriculum evidence.
- Text: `#FCFCFC`, with `#8AA0A6` for supporting evidence.

### Type

- Inter for product decisions, actions, and explanatory copy.
- IBM Plex Mono for evidence labels, state transitions, timestamps, and live instrumentation.

### Layout

```text
Header / plan state
Outreach progress
Live jobs
┌───────────────────────┬─────────────────────────────────┐
│ Active radar          │ Evidence or action inspector    │
│ company acquisition   │ company → role → plan → send    │
└───────────────────────┴─────────────────────────────────┘
```

### Signature interaction

When a company is selected, three evidence paths assemble from separate nodes into a central campus-company match:

```text
Curriculum ─┐
Alumni roles ├── Campus match ── Live role
Hiring data ─┘
```

Lines draw once; nodes resolve in sequence; the radar continues sweeping. This is called the **match constellation**, not a decorative skill tree. It explains why the company may matter.

## Flow design

### 1. Landing

Headline: **Find the path from your campus to a company.**

Supporting copy promises three concrete outcomes: see where alumni work, understand why roles fit, and coordinate outreach. Campus search remains the only primary control. A compact `Explore free · Pro coordinates action` note previews the business model without interrupting the task.

### 2. Office verification

The claim form asks for name, placement role, and work email. It states that this prototype simulates work-domain verification.

After `Verify work email`, an in-panel sequence runs:

1. Check work domain.
2. Match campus office.
3. Secure campus graph.

Reduced motion shows the final verified state without animated movement.

### 3. Welcome calibration

The welcome panel shows real demo counts for the selected campus:

- employers mapped;
- alumni available on Pulse;
- warm live roles.

It states the boundary explicitly:

- `Free: explore all evidence + 3 introductions/day`;
- `Pro: AI plans and reviewed batch outreach`.

Primary action: `Enter campus radar`.

### 4. Company acquisition

Selecting a company keeps the radar active and opens a company inspector. Before alumni actions, it shows:

- company alumni count;
- available alumni count;
- live-role count;
- animated match constellation with three evidence paths;
- plain-language conclusion such as `Strongest path: CSE/ECE → data and software roles`.

The constellation is evidence, not a numerical prediction. It must not claim a scientifically calculated score.

Free users can inspect all details and start one introduction. Pro users see `Build AI action plan` after the evidence.

### 5. Specific job evidence

Every job click opens that exact job and carries its stream. It never opens an empty or unrelated filter.

The role inspector answers `Why might this fit this campus?` before presenting a student action:

- role requirement extracted from eligibility;
- relevant campus departments and their share;
- alumni already at the employer;
- current student-data readiness.

The first action is `Connect 2027 batch evidence`, not `Recommend my 2027`.

### 6. Batch evidence

Before a sheet is connected, the dialog explains which fields matter: department, skills, eligibility, and consent.

After the demo sheet is connected, it shows a restrained shortlist and explicit reasons per student. The headline is `Potential matches to review`, never `students to recommend`. No student is sent or recommended automatically.

Free action: copy a batch opportunity brief.

Pro action: add the evidence and shortlist to an AI action plan.

### 7. Pro explanation

The Pro panel opens with:

**Everything you explored stays free.**

It then demonstrates the coordinated output for the current campus/company:

- alumni introductions prepared;
- batch opportunity brief prepared;
- evidence attached;
- one reviewed send.

An unlocked Pro chip reads `Pro · AI actions`, not only an infinity symbol.

### 8. AI preparation

Starting a Pro action plan runs a short staged sequence in the inspector:

1. Read campus evidence.
2. Draft distinct alumni introductions.
3. Draft the batch opportunity brief.
4. Ready for review.

The review shows each draft, recipient type, evidence used, and selection state. Nothing sends before the user clicks `Send reviewed plan`.

### 9. Sending and delivery

Sending does not collapse into a toast. A delivery panel keeps the user oriented:

- each selected item begins `Queued`;
- a restrained teal beam moves through the row during `Sending`;
- the row resolves to `Sent` with a timestamp;
- the final state says `Plan sent · replies will appear in Inbox`.

The underlying radar continues to sweep. Reduced motion removes travel animation but preserves status progression and completion copy.

## State model

Add transient state without changing the persisted demo contract unnecessarily:

- `onboardingStage`: `null | validating | welcome`;
- `validationStep`: integer `0..3`;
- `selectedJobId`: exact job being inspected;
- `matchBuildKey`: changes when a company or job acquisition should replay once;
- `planStage`: `null | analysing | drafting | ready | sending | sent`;
- `sendItems`: `{ id, label, kind, status }[]` where status is `queued | sending | sent`.

Persist claimed campus, Pro state, inbox, and sent outcomes. Reset transient animation stages on load so the user never reopens into a half-finished animation.

## Error and edge states

- Invalid work email: explain that the prototype expects a campus-domain email; keep entered values.
- Company without a live role: constellation uses curriculum, alumni, and sector evidence; no job CTA is fabricated.
- No available alumni: exploration and role evidence remain free; Pro cannot draft alumni outreach for that company.
- No batch sheet: show data requirements and a demo connection action; never claim student-level matching.
- Empty draft selection: disable sending and explain that at least one reviewed item must be selected.

## Accessibility and motion

- All state changes have text equivalents and polite live-region updates.
- Focus moves into validation, welcome, match, plan, and delivery dialogs.
- Keyboard targets remain at least 40 px.
- `prefers-reduced-motion` removes path drawing, beam travel, scale, and sweeping flourishes from new surfaces.
- Ambient radar motion never communicates the only version of a fact.

## Acceptance criteria

1. A new user can complete landing → campus → verification → welcome → radar without a dead end.
2. Welcome explains Free and Pro in one view.
3. Clicking a company visibly assembles at least three evidence paths while the radar stays active.
4. Clicking Data Analyst opens Data Analyst directly with the IT stream and non-empty evidence.
5. The first student action says `Connect 2027 batch evidence`; `Recommend my 2027` is absent.
6. Connected demo data shows potential matches with explicit reasons and no auto-recommend claim.
7. Locked Pro states that exploration remains free and quantifies the coordinated actions Pro adds.
8. AI preparation visibly progresses to a review containing alumni drafts and a batch brief.
9. Sending visibly progresses queued → sending → sent and creates inbox/today outcomes only for selected items.
10. Full browser acceptance, reduced-motion coverage, and console checks pass at 1366×768.
