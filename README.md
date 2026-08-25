# Pulse Campus

Clickable TPO mock: a placement office claims their college, Pulse looks up alumni already on the graph, then they see company mix and live engineering / IT jobs.

No backend. Seeded demo data. Session in `localStorage`.

## Run locally

```bash
cd app
python3 -m http.server 3020 --bind 127.0.0.1
```

Open [http://127.0.0.1:3020/](http://127.0.0.1:3020/)

## GitHub

Repo: [github.com/ultrapaul0816/pulse-campus](https://github.com/ultrapaul0816/pulse-campus)

```bash
git clone https://github.com/ultrapaul0816/pulse-campus.git
cd pulse-campus/app
python3 -m http.server 3020 --bind 127.0.0.1
```

GitHub Pages (after the first Actions run): [ultrapaul0816.github.io/pulse-campus](https://ultrapaul0816.github.io/pulse-campus/)

Use **Reset demo** in the header to start over.

## What this is

The first-use moment for a TPO — not the full University OS.

1. Search and claim a college
2. Credential verification, then welcome — office claimed
3. Radar scan while Pulse matches alumni
4. Briefing: alumni count, Japan corridor, company types, first moves
5. Work: where alumni work, how many, which positions. Named rosters cost daily looks (3). The tank empties on purpose.
6. Students: 2027 intake on Pulse vs still missing
7. Market jobs: Engineering and IT, with “alumni work here” badges
8. Principal briefing as a one-page overlay

Alumni login, batch chat, and invites are intentionally not built yet. The briefing has a teaser so the flywheel is visible.

## Honest framing

Copy says who Pulse can already see. It does not say companies are chasing the campus.
