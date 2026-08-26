# Pulse Campus design tokens

## Colour

| Token | Value | Role |
|---|---:|---|
| `--ink` | `#000000` | Canvas |
| `--surface` | `#141414` | Primary panels and controls |
| `--surface-raised` | `#181818` | Menus and raised surfaces |
| `--line` | `#3f3f46` | Decorative separation |
| `--line-strong` | `#5c6e74` | Interactive boundaries |
| `--pulse` | `#08a4b8` | Cognavi action and live signal |
| `--pulse-bright` | `#3ad6c9` | Fresh activity and positive emphasis |
| `--text` | `#fcfcfc` | Primary text |
| `--text-soft` | `#c5d4d8` | Supporting text |
| `--text-muted` | `#8aa0a6` | Utility labels |

## Typography

- Display and body: Inter, system fallback.
- Signals and utility data: IBM Plex Mono, monospace fallback.
- Actionable and decision-relevant text: 11px minimum; prefer 12–14px.
- Body copy: 14–16px with 1.45–1.55 line height.

## Shape and motion

- Card radius: `16px`; nested card radius: `12px`; pills: `999px`.
- Strong entrance easing: `cubic-bezier(0.23,1,0.32,1)`.
- Strong on-screen movement easing: `cubic-bezier(0.77,0,0.175,1)`.
- Press feedback: `160ms`; state colour changes: `140ms`; popovers and toasts: `180ms`; inspector panels: `220ms`.
- Radar acquisition: `280ms` strong ease-out using transform and opacity; job arrival: `240ms` strong ease-out.
- The rare daily-drop sequence uses `360ms` entrances with `50ms` stagger steps.
- Continuous motion is limited to the idle radar and a slow, linear market crawl. The crawl pauses on hover, keyboard focus, and pointer contact, remains manually scrollable, stops in task mode, and becomes static for reduced-motion users.
- Opening panels use one radar-lock moment rather than scattered decoration. Live jobs receive one entrance and a temporary `New` treatment; queued arrivals do not move the rail while it is being used.
