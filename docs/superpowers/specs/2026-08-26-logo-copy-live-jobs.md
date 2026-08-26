# Logo, alumni language, and live jobs design

## Goal

Make the campus radar easier to read on first load by quieting company logos, using human language for alumni availability, and placing live jobs inside the primary viewport.

## Approved design

- Company logos sit on plain white tiles with one neutral edge. Loaded images fully cover the colored fallback, so fallback brand colors appear only when an image is unavailable.
- A small teal status dot communicates that alumni are available. Teal outlines and motion are reserved for the selected company or a newly arrived company.
- User-facing copy says `1 alumnus available`, `2 alumni available`, `No alumni available yet`, and `Contact 1 of 2`. It does not describe people as seats.
- The journey step is `Alumni available`.
- The live-jobs rail appears immediately below outreach progress and before the radar/inspector workspace.
- The rail remains visible and moving while a company inspector is open. A full-screen modal may cover it while the modal owns focus. The rail still pauses for direct pointer or keyboard interaction and respects reduced motion.
- The radar remains the product's signature animated element.

## Layout

```text
Header
Outreach progress
Live jobs rail
Radar | Company inspector
```
