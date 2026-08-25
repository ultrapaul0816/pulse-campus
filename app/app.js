(function () {
  const STORAGE = "pulse-campus:tpo:v8";
  const LOOKS_MAX = 3;
  const DATA = window.PULSE_CAMPUS;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const holdScan = new URLSearchParams(location.search).has("hold");
  const STUDENT_NAMES = [
    ["Aditi K.", 0, "Video resume"],
    ["Rohan S.", 1, "Japanese interest"],
    ["Niharika P.", 2, "Projects"],
    ["Vivek M.", 0, null],
    ["Fatima R.", 1, "Resume"],
    ["Sanjay T.", 2, null],
    ["Keerthi L.", 3, "Skills"],
    ["Arun C.", 1, null]
  ];

  let timers = [];
  let toastTimer = null;

  const defaultState = () => ({
    scene: "landing",
    tab: "pulse",
    collegeId: null,
    collegeQuery: "",
    searchOpen: false,
    profile: { name: "", email: "", role: "Placement Head" },
    claimed: false,
    claimStep: null,
    typeId: null,
    jobStream: "engineering",
    jobQuery: "",
    japanOnly: false,
    alumniOnly: true,
    openJob: null,
    jobsOpen: false,
    jobCompany: null,
    day: 1,
    overlay: null,
    inviteKind: "alumni",
    seen: { market: false, students: false, inviteAlumni: false, inviteStudents: false, principal: false, work: false },
    looks: 0,
    looksMax: LOOKS_MAX,
    unlocked: [],
    lookLog: [],
    today: [],
    workMode: "companies",
    workCompany: null,
    workRole: null,
    workQuery: "",
    pendingRequest: null,
    missionsDone: [],
    askQuery: "",
    askSaid: "",
    askOpen: false,
    inspectCompany: null,
    inspectName: null,
    inspectRole: null,
    inspectIndex: 0,
    onPulse: [],
    invitePaste: "",
    inbox: [],
    pendingInvite: false,
    toast: ""
  });

  let state = load() || defaultState();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const next = { ...defaultState(), ...parsed, searchOpen: false, overlay: null, toast: "", askOpen: false, jobsOpen: false };
      if (["verify", "welcome", "scan"].includes(next.scene)) {
        next.scene = next.collegeId ? "campus" : "landing";
      }
      if (next.claimStep === "verify") next.claimStep = "form";
      return next;
    } catch {
      return null;
    }
  }

  function persist() {
    const copy = {
      ...state,
      searchOpen: false,
      overlay: null,
      toast: "",
      askOpen: false,
      jobsOpen: false,
      claimStep: state.claimStep === "verify" ? "form" : state.claimStep
    };
    localStorage.setItem(STORAGE, JSON.stringify(copy));
  }

  function later(fn, ms) {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));
  }

  function college() {
    return DATA.colleges.find((item) => item.id === state.collegeId) || null;
  }

  function firstName() {
    return state.profile.name.trim().split(/\s+/)[0] || "there";
  }

  function currentBatch(camp) {
    const onPulse = Math.round(camp.alumni * 0.48);
    const intake = Math.round(camp.alumni * 2.15 + 90);
    const depts = camp.departments;
    return {
      year: "2027",
      onPulse,
      intake,
      resume: Math.round(onPulse * 0.67),
      video: Math.round(onPulse * 0.28),
      skills: Math.round(onPulse * 0.58),
      japanInterest: Math.round(onPulse * 0.19),
      people: STUDENT_NAMES.map(([name, deptIdx, missing]) => ({
        name,
        dept: depts[deptIdx % depts.length][0],
        missing,
        complete: missing ? 54 + (name.length % 20) : 92
      }))
    };
  }

  function markSeen(key) {
    if (state.seen[key]) return;
    state.seen = { ...state.seen, [key]: true };
    persist();
  }

  function employment() {
    return window.buildEmployment(college());
  }

  function companyPeople(name) {
    const co = employment().companies.find((item) => item.name === name);
    return co ? co.people : [];
  }

  function pulsePeople(company) {
    return companyPeople(company).filter((p) => state.onPulse.includes(p.key));
  }

  function seedCampusPulse() {
    if (!state.collegeId || (state.onPulse && state.onPulse.length)) return;
    const keys = [];
    employment().companies.slice(0, 6).forEach((co, i) => {
      const take = i < 3 ? 2 : 1;
      (co.people || []).slice(0, take).forEach((p) => {
        if (p.key) keys.push(p.key);
      });
    });
    if (!keys.length) return;
    state.onPulse = keys;
    persist();
  }

  function inspectPerson() {
    if (!state.inspectCompany || !state.inspectName) return null;
    const list = pulsePeople(state.inspectCompany);
    if (!list.length) return null;
    return list.find((p) => p.name === state.inspectName && (!state.inspectRole || p.role === state.inspectRole))
      || list[Math.max(0, Math.min(state.inspectIndex, list.length - 1))]
      || null;
  }

  function openInspect(company, role, name) {
    state.inspectCompany = company;
    state.jobsOpen = false;
    state.tab = "pulse";
    const list = pulsePeople(company);
    if (list.length) {
      let idx = 0;
      if (name) {
        idx = list.findIndex((p) => p.name === name && (!role || p.role === role));
        if (idx < 0) idx = 0;
      }
      state.inspectIndex = idx;
      state.inspectName = list[idx].name;
      state.inspectRole = list[idx].role;
    } else {
      state.inspectIndex = 0;
      state.inspectName = null;
      state.inspectRole = null;
    }
    persist();
    render();
  }

  function inspectStep(dir) {
    const list = pulsePeople(state.inspectCompany);
    if (!list.length) return;
    state.inspectIndex = (state.inspectIndex + dir + list.length) % list.length;
    const p = list[state.inspectIndex];
    state.inspectName = p.name;
    state.inspectRole = p.role;
    persist();
    render();
  }

  function lookKey(company, role) {
    return `${company}|${role}`;
  }

  function personLookKey(person) {
    return `n:${person.company}|${person.role}|${person.name}`;
  }

  function isUnlocked(company, role) {
    return state.unlocked.includes(lookKey(company, role));
  }

  function isPersonOpen(person) {
    if (!person) return false;
    return isUnlocked(person.company, person.role) || state.unlocked.includes(personLookKey(person));
  }

  function spendLook(key, label) {
    if (state.unlocked.includes(key)) return true;
    if (state.looks <= 0) {
      state.overlay = "empty";
      render();
      return false;
    }
    state.looks -= 1;
    state.unlocked = [...state.unlocked, key];
    state.lookLog = [...state.lookLog, label];
    persist();
    if (state.looks === 0) {
      later(() => {
        state.overlay = "empty";
        render();
      }, 900);
    }
    return true;
  }

  function demandLook(company, role) {
    return spendLook(lookKey(company, role), `${company} · ${role}`);
  }

  function liveJobsFor(company) {
    if (!company) return [];
    return DATA.jobs.filter((job) => job.company === company);
  }

  function seatPattern(person) {
    const camp = college();
    const batch = currentBatch(camp);
    const co = employment().companies.find((item) => item.name === person.company);
    const nAtCo = co ? co.n : 0;
    const nAtRole = companyPeople(person.company).filter((p) => p.role === person.role).length;
    const live = liveJobsFor(person.company);
    const match = live.find((job) => job.title.toLowerCase().includes(person.role.split(" ")[0].toLowerCase())) || live[0] || null;
    const branch = person.dept && person.dept !== "Other" ? person.dept : (camp.departments[0] ? camp.departments[0][0] : "core");
    return {
      nAtCo,
      nAtRole,
      band: match ? match.ctc : "Band varies",
      city: person.city,
      branch,
      year: batch.year,
      live,
      liveN: live.length,
      internN: live.filter((job) => job.intern).length
    };
  }

  function briefText(person) {
    const camp = college();
    const seat = seatPattern(person);
    const first = person.name.split(/\s+/)[0].replace(/\./g, "");
    const liveLine = seat.liveN
      ? `Pulse can see ${seat.liveN} live role${seat.liveN === 1 ? "" : "s"} at ${person.company} now${seat.internN ? `, including ${seat.internN} internship${seat.internN === 1 ? "" : "s"}` : ""}.`
      : `Pulse is watching ${person.company} — no live req in this cut today.`;
    return `${camp.short} alumni already sit at ${person.company} as ${person.role} (${seat.nAtRole} in this seat, ${seat.nAtCo} at the company). Typical hiring in this seat: ${seat.band}, ${seat.city}. ${liveLine} Invite ${seat.year} ${seat.branch} and ask ${first} for fifteen minutes. 2026 is not ready — their status is still incomplete.`;
  }

  function nextDay() {
    clearTimers();
    const hit = state.today.find((item) => item.status === "asked");
    state.day += 1;
    state.looks = LOOKS_MAX;
    state.overlay = null;
    const reply = "Happy to take fifteen minutes with this year’s batch. Send two profiles.";
    state.inbox = state.inbox.map((item) => item.status === "asked" ? { ...item, status: "replied", reply } : item);
    if (hit) {
      state.today = state.today.map((item) => item.key === hit.key ? { ...item, status: "replied" } : item);
    }
    let joined = "";
    if (state.seen.inviteAlumni && !state.onPulse.length) {
      joinPulseDemo();
      joined = " Some alumni from this campus joined Pulse.";
    }
    persist();
    const who = hit ? ` ${hit.name.split(/\s+/)[0]} answered.` : "";
    showToast(`Day ${state.day}. ${LOOKS_MAX} names again.${who}${joined}`);
  }

  function demandPersonLook(person) {
    if (isPersonOpen(person)) {
      rememberToday(person);
      return true;
    }
    const ok = spendLook(personLookKey(person), `${person.company} · ${person.role}`);
    if (ok) rememberToday(person);
    return ok;
  }

  function rememberToday(person) {
    if (!person) return;
    const key = personLookKey(person);
    if (state.today.some((item) => item.key === key)) return;
    state.today = [{
      key,
      name: person.name,
      company: person.company,
      role: person.role,
      city: person.city,
      year: person.year,
      dept: person.dept,
      status: "idle"
    }, ...state.today];
  }

  function todayCut(person) {
    if (!person) return null;
    return state.today.find((item) => item.key === personLookKey(person)) || null;
  }

  function canClaim() {
    return Boolean(college() && state.profile.name.trim() && state.profile.email.trim());
  }

  function askDraft(person) {
    const camp = college();
    const first = person.name.split(/\s+/)[0].replace(/\./g, "");
    const branch = person.dept && person.dept !== "Other" ? `this year’s ${person.dept} batch` : "this year’s batch";
    return `${first},\n\n${camp.short}’s placement office found you on Pulse — ${person.role} at ${person.company}. We’d like fifteen minutes with ${branch}.\n\nPulse is sending this. You choose whether to answer.`;
  }

  function markAsked(person) {
    const key = personLookKey(person);
    state.today = state.today.map((item) => item.key === key ? { ...item, status: "asked" } : item);
    upsertInbox(person, "asked");
  }

  function upsertInbox(person, status, extra) {
    const key = personLookKey(person);
    const prev = state.inbox.find((item) => item.key === key) || {};
    const row = {
      key,
      name: person.name,
      company: person.company,
      role: person.role,
      status,
      askedDay: prev.askedDay || state.day,
      reply: extra && extra.reply != null ? extra.reply : (prev.reply || "")
    };
    state.inbox = [row, ...state.inbox.filter((item) => item.key !== key)];
  }

  function joinPulseDemo() {
    const keys = [];
    employment().companies.slice(0, 5).forEach((co) => {
      (co.people || []).slice(0, 2).forEach((p) => {
        if (p.key) keys.push(p.key);
      });
    });
    state.onPulse = [...new Set([...state.onPulse, ...keys])];
  }

  function briefCompany(company) {
    const camp = college();
    const batch = currentBatch(camp);
    const co = employment().companies.find((item) => item.name === company);
    const role = co && co.roles[0] ? co.roles[0][0] : "core roles";
    const live = liveJobsFor(company);
    const internN = live.filter((job) => job.intern).length;
    const branch = camp.departments[0] ? camp.departments[0][0] : "core";
    const liveLine = live.length
      ? `Pulse can see ${live.length} live role${live.length === 1 ? "" : "s"} at ${company} now${internN ? ` (internship rows are a last Internshala snapshot, not a live feed)` : ""}.`
      : `Pulse is watching ${company}.`;
    return `${camp.short} alumni already sit at ${company} — ${co ? co.n : 0} in public professional profiles (counts, not verified names). Top seat: ${role}. ${liveLine} Invite ${batch.year} ${branch}. Names appear when they join Pulse. 2026 is not ready.`;
  }

  function finishClaim() {
    clearTimers();
    state.claimed = true;
    state.claimStep = null;
    if (state.looks < 1) state.looks = LOOKS_MAX;
    const person = inspectPerson();
    if (person && !isPersonOpen(person)) {
      if (!demandPersonLook(person)) return;
    } else if (person) {
      rememberToday(person);
    }
    if (inspectPerson() && isPersonOpen(inspectPerson())) {
      state.askOpen = true;
    }
    persist();
    if (state.pendingInvite) {
      state.pendingInvite = false;
      state.overlay = "invite";
      state.inviteKind = "students";
      render();
      return;
    }
    render();
  }

  function runClaimVerify() {
    const rows = [...document.querySelectorAll(".inspect .check-row")];
    const seal = document.getElementById("claim-seal");
    if (!rows.length) {
      finishClaim();
      return;
    }
    if (reduceMotion) {
      rows.forEach((row) => {
        row.classList.add("on");
        const mark = row.querySelector(".check-mark");
        if (mark) mark.textContent = "✓";
      });
      seal?.classList.add("on");
      if (!holdScan) later(() => finishClaim(), 700);
      return;
    }
    rows.forEach((row, i) => {
      later(() => {
        row.classList.add("on");
        const mark = row.querySelector(".check-mark");
        if (mark) mark.textContent = "✓";
      }, 380 + i * 520);
    });
    later(() => seal?.classList.add("on"), 380 + rows.length * 520 + 160);
    if (!holdScan) later(() => finishClaim(), 380 + rows.length * 520 + 900);
  }

  function inboxBtn() {
    const fresh = state.inbox.filter((item) => item.status === "replied").length;
    const wait = state.inbox.filter((item) => item.status === "asked").length;
    const tag = fresh ? ` · ${fresh} new` : wait ? ` · ${wait}` : "";
    return `
      <button class="inbox-btn ${fresh ? "has-new" : ""}" type="button" data-action="open-inbox">
        Inbox${tag}
      </button>
    `;
  }

  function tankGauge(kind) {
    const jobs = kind === "jobs";
    const n = jobs ? state.jobs : state.looks;
    const max = jobs ? state.jobsMax : state.looksMax;
    const dead = n <= 0;
    const pips = Array.from({ length: max }, (_, i) =>
      `<i class="${i < n ? "" : "off"}"></i>`
    ).join("");
    return `
      <button class="fuel ${dead ? "empty-fuel" : ""}" type="button" data-action="${jobs ? "open-jobs" : "fuel"}" title="${jobs ? "Daily job descriptions. The list is free. A JD uses a job." : "Daily names. Aggregates are free. Seeing a name uses a look."}">
        <span class="fuel-label">${dead ? "Out" : (jobs ? "Jobs" : "Sees")}</span>
        <span class="fuel-pips">${pips}</span>
        <b>${n}</b>
      </button>
    `;
  }

  function clarityPct() {
    return Math.min(100, state.missionsDone.length * 16 + state.unlocked.length * 12 + (state.seen.inviteStudents ? 10 : 0) + (state.seen.principal ? 8 : 0));
  }

  function clarityChip() {
    const pct = clarityPct();
    return `
      <div class="clarity" title="How much of the faded graph this office has actually played">
        <span>Clarity</span>
        <b>${pct}%</b>
        <i><em style="width:${pct}%"></em></i>
      </div>
    `;
  }

  function completeMission(id) {
    if (state.missionsDone.includes(id)) return;
    state.missionsDone = [...state.missionsDone, id];
    persist();
  }

  function densestCompany() {
    return employment().companies[0] || null;
  }

  function japanHireCut() {
    const people = employment().companies.flatMap((co) => co.people.map((p) => ({ ...p, ctype: co.type })));
    return people.find((p) => p.ctype === "japan-mfg" && p.hiring)
      || people.find((p) => p.ctype === "japan-mfg" && /Tokyo|Yokohama|Osaka|Kobe|Nagoya/.test(p.city))
      || people.find((p) => p.hiring)
      || null;
  }

  function dealMissions(camp) {
    const top = densestCompany();
    const hire = japanHireCut();
    const mech = camp.departments.find((d) => /mech/i.test(d[0]));
    const deck = [
      {
        id: "japan-hire",
        why: "Japan corridor",
        title: hire ? `Unblur a hiring alumnus at ${hire.company}` : "Open the Japan cut",
        detail: `${camp.japan} of yours are in Japan. Pulse will not list them until you request.`,
        cost: "1 request",
        action: "mission-japan"
      },
      {
        id: "densest",
        why: "Warmest path",
        title: top ? `See who already sits at ${top.name}` : "Open the densest employer",
        detail: top ? `${top.n} alumni. Top seat: ${top.roles[0][0]}. A warm path, not a campus drive.` : "",
        cost: "1 request",
        action: "mission-dense"
      },
      {
        id: "match",
        why: "AI match",
        title: `Match 2027 ${mech ? mech[0] : "core"} to companies they already staff`,
        detail: "Not a job board. Alumni seats × this year’s branch.",
        cost: "Free",
        action: "mission-match"
      },
      {
        id: "draft",
        why: "AI draft",
        title: "Pulse writes four lines for the principal",
        detail: "You approve. Nothing sends itself. No dashboard attached.",
        cost: "Free",
        action: "mission-draft"
      },
      {
        id: "invite",
        why: "Fill the graph",
        title: "Invite 2027 who have no video resume",
        detail: "The hole in the graph is the current batch, not the alumni.",
        cost: "Free",
        action: "invite-students"
      },
      {
        id: "market-warm",
        why: "Live market",
        title: "Show jobs where alumni already work",
        detail: "Engineering and IT first. The badge is the product.",
        cost: "Free",
        action: "mission-market"
      }
    ];
    const open = deck.filter((card) => !state.missionsDone.includes(card.id));
    const hand = (open.length ? open : deck).slice(0, 3);
    return hand;
  }

  function pulseLine(camp) {
    const n = state.missionsDone.length;
    const top = densestCompany();
    const lines = [
      `I found ${camp.alumni.toLocaleString("en-IN")} of yours. I will not dump a dashboard on you. Play one cut.`,
      state.askSaid || `You played ${n} move${n === 1 ? "" : "s"}. Clarity ${clarityPct()}%. The file still exists. Pulse would rather you move.`,
      top ? `${top.name} is your densest company. That is a warm path, not a promise.` : `The graph is still faded. Request is the verb.`,
      `${camp.japan} in Japan. Most TPOs never get this as a list. You get a request, not a spreadsheet.`,
      `Useful beats complete. Open the file if someone needs Excel.`
    ];
    if (state.askSaid) return state.askSaid;
    return lines[Math.min(n, lines.length - 1)];
  }

  function typeMeta(id) {
    return DATA.companyTypes.find((item) => item.id === id);
  }

  function initials(name) {
    return name
      .replace("National Institute of Technology", "NIT")
      .replace("Institute of Science and Technology", "IST")
      .split(/\s+/)
      .filter((w) => !["of", "the", "and", "College"].includes(w))
      .slice(0, 3)
      .map((w) => w[0])
      .join("")
      .slice(0, 4);
  }

  function go(scene, extra) {
    clearTimers();
    state = { ...state, scene, searchOpen: false, overlay: null, ...(extra || {}) };
    persist();
    render();
  }

  function resetDemo() {
    localStorage.removeItem(STORAGE);
    clearTimers();
    state = defaultState();
    render();
  }

  function filteredColleges() {
    const q = state.collegeQuery.trim().toLowerCase();
    if (!q) return DATA.colleges.slice(0, 8);
    return DATA.colleges.filter((item) =>
      (item.name + " " + item.short + " " + item.city).toLowerCase().includes(q)
    );
  }

  function jobsForCampus() {
    const camp = college();
    if (!camp) return [];
    return DATA.jobs.filter((job) => {
      if (job.stream !== state.jobStream) return false;
      if (state.japanOnly && !job.japan) return false;
      const alumniCount = job.alumni[camp.id] || 0;
      if (state.alumniOnly && alumniCount < 1) return false;
      const blob = (job.title + " " + job.company + " " + job.city).toLowerCase();
      if (state.jobQuery && !blob.includes(state.jobQuery.trim().toLowerCase())) return false;
      if (state.jobCompany && job.company !== state.jobCompany) return false;
      return true;
    }).sort((a, b) => (b.alumni[camp.id] || 0) - (a.alumni[camp.id] || 0) || (b.intern ? 1 : 0) - (a.intern ? 1 : 0));
  }

  function nodeLayout(count) {
    const nodes = [];
    let i = 0;
    for (let ring = 1; ring <= 4; ring += 1) {
      const n = ring === 1 ? 6 : ring === 2 ? 10 : ring === 3 ? 12 : 14;
      for (let k = 0; k < n && i < count; k += 1) {
        const angle = ((k / n) * Math.PI * 2) - Math.PI / 2 + ring * 0.18;
        const r = 16 + ring * 8.4;
        nodes.push({
          left: 50 + r * Math.cos(angle),
          top: 50 + r * Math.sin(angle),
          kind: i % 11 === 0 ? "japan" : i % 4 === 0 ? "brass" : "pulse"
        });
        i += 1;
      }
    }
    return nodes;
  }

  function polar(index, total, radius, twist) {
    const angle = ((index / Math.max(total, 1)) * Math.PI * 2) - Math.PI / 2 + (twist || 0);
    return {
      left: 50 + radius * Math.cos(angle),
      top: 50 + radius * Math.sin(angle)
    };
  }

  function radarPeople(camp) {
    if (!camp || !state.onPulse.length) return [];
    const mixed = [];
    employment().companies.forEach((co) => {
      co.people.forEach((p) => {
        if (state.onPulse.includes(p.key) && mixed.length < 26) mixed.push(p);
      });
    });
    return mixed;
  }

  function radarCompanies(camp) {
    if (!camp) return [];
    return window.buildEmployment(camp).companies.map((item) => item.name);
  }

  function companyMarkPos(index, total) {
    let ring = 24;
    let local = index;
    let ringN = Math.min(8, total);
    if (index >= 20) {
      ring = 44;
      local = index - 20;
      ringN = Math.max(total - 20, 1);
    } else if (index >= 8) {
      ring = 34;
      local = index - 8;
      ringN = Math.min(12, total - 8);
    }
    return polar(local, ringN, ring, 0.1);
  }

  function logoDock(names, opts) {
    const mode = (opts && opts.mode) || "idle";
    const counts = {};
    const pulseN = {};
    if (state.collegeId) {
      employment().companies.forEach((c) => {
        counts[c.name] = c.n;
        pulseN[c.name] = pulsePeople(c.name).length;
      });
    }
    return `
      <div class="logo-dock" role="list">
        ${(names || []).map((name, i) => {
          const n = counts[name];
          const onP = pulseN[name] || 0;
          const label = onP
            ? `${onP} on Pulse at ${name} — click to see who`
            : (n != null ? `${n} from this campus at ${name}` : name);
          return `
          <button type="button" class="dock-item ${mode === "scan" ? "" : "settled"} ${state.inspectCompany === name ? "dock-live" : ""} ${onP ? "has-pulse" : ""}" role="listitem" data-inspect-company="${esc(name)}" title="${esc(label)}" style="animation-delay:${i * 0.02}s">
            ${window.logoHTML(name, "live")}
            ${mode === "scan" || n == null ? "" : `<span class="dock-n">${n}</span>`}
            <span class="dock-name">${esc(name)}</span>
          </button>`;
        }).join("")}
      </div>
    `;
  }

  function radarMarkup(opts) {
    const camp = college();
    const mode = opts.mode || "dots";
    const people = camp ? radarPeople(camp) : [];
    const dots = nodeLayout(42);
    const ghosted = mode === "ghost";
    const landing = mode === "landing";
    const scan = mode === "scan";
    const popClass = ghosted || landing ? "pop ghost" : "";

    return `
      <div class="radar living ${opts.recognized || ghosted || scan ? "recognized" : ""} ${landing ? "ambient" : ""}">
        <div class="radar-sweep"></div>
        <div class="radar-cross"></div>
        ${mode === "dots" ? dots.map((node, idx) => `
          <div class="node ${node.kind} ${opts.found ? "found" : ""}" style="left:${node.left}%;top:${node.top}%;" data-node="${idx}"></div>
        `).join("") : ""}
        ${!landing && camp ? radarCompanies(camp).map((name, idx, all) => {
          const pos = companyMarkPos(idx, all.length);
          const n = (employment().companies.find((c) => c.name === name) || {}).n;
          const on = state.inspectCompany === name && !state.inspectName;
          return `
            <button type="button" class="radar-co pop ${on ? "on" : ""}" style="left:${pos.left}%;top:${pos.top}%;animation-delay:${idx * 0.035}s" data-inspect-company="${esc(name)}" aria-label="${n || 0} alumni counts at ${esc(name)}">
              <span class="dot-core"></span>
            </button>
          `;
        }).join("") : ""}
        ${people.map((person, idx) => {
          const ring = 22 + (idx % 3) * 8;
          const pos = polar(idx, people.length, ring, 0.08);
          const current = inspectPerson();
          const on = current && current.company === person.company && current.name === person.name && current.role === person.role;
          const atCo = state.inspectCompany === person.company;
          return `
            <button type="button" class="radar-person ${popClass} ${on ? "on" : ""} ${atCo ? "at-co" : ""}" style="left:${pos.left}%;top:${pos.top}%;" data-inspect-company="${esc(person.company)}" data-inspect-role="${esc(person.role)}" data-inspect-name="${esc(person.name)}" ${ghosted ? "" : "tabindex='-1'"} aria-label="${esc(person.role)} at ${esc(person.company)}. ${isPersonOpen(person) ? esc(person.name) : "Name sealed"}. Open to ask on Pulse.">
              <span class="dot-core"></span>
            </button>
          `;
        }).join("")}
        <div class="radar-center">${esc(opts.center || (camp ? initials(camp.short) : "Pulse"))}</div>
      </div>
    `;
  }

  function chrome() {
    const camp = college();
    const chipInner = state.claimed
      ? `${esc(state.profile.role)} · <b>${esc(camp.short)}</b><span class="verified-pill">Verified</span>`
      : `<b>${esc(camp.short)}</b><span class="guest-pill">Guest</span>`;
    return `
      <div class="topbar">
        <div class="topbar-left">
          <div class="brand-lock">
            <span class="brand-mark"></span>
            Pulse
          </div>
          ${state.claimed ? `
            <button class="college-chip" type="button" data-action="open-file" title="Office file">
              ${chipInner}
            </button>
          ` : `
            <div class="college-chip">${chipInner}</div>
          `}
        </div>
        <div class="top-actions">
          ${state.claimed ? tankGauge("sees") : ""}
          ${state.claimed ? inboxBtn() : ""}
          <button class="btn btn-ghost-dark" type="button" data-action="reset">Reset demo</button>
        </div>
      </div>
    `;
  }

  function viewLanding() {
    const results = filteredColleges();
    return `
      <div class="scene scene-night gate">
        <div class="grain"></div>
        <div class="gate-core">
          <div class="brand-lock"><span class="brand-mark"></span> Pulse</div>
          ${radarMarkup({ mode: "landing", recognized: false, center: "Campus" })}
          <h1>Which campus.</h1>
          <p>Where last year’s batch works — and a way to use them for this year’s.</p>
          <label class="field search-wrap gate-search">
            <span>University</span>
            <input id="college-q" type="text" autocomplete="off" placeholder="NIT Trichy, VIT, COEP…" value="${esc(state.collegeQuery)}">
            ${state.searchOpen ? `
              <div class="search-list" role="listbox">
                ${results.length ? results.map((item) => `
                  <button class="search-item" type="button" data-pick="${item.id}">
                    <b>${esc(item.short)}</b>
                    <small>${esc(item.city)} · NIRF ${item.nirf} · ${item.alumni} alumni on Pulse</small>
                  </button>
                `).join("") : `<div class="search-item">No match in this demo list</div>`}
              </div>
            ` : ""}
          </label>
          <p class="fine">Demo only. Counts are illustrative. Live Pulse will replace them.</p>
        </div>
      </div>
    `;
  }

  function viewScan() {
    const camp = college();
    return `
      <div class="scene scene-night" id="scan-scene">
        <div class="grain"></div>
        <div class="scan">
          <aside class="scan-col" id="people-col">
            <h3>People appearing</h3>
          </aside>
          <div class="scan-main">
            ${radarMarkup({ mode: "scan", recognized: true, center: camp.short })}
            <div class="scan-count">
              <div class="num" id="count-num">0</div>
              <div class="num-label" id="scan-line">Opening Pulse records</div>
            </div>
          </div>
          <aside class="scan-col scan-dock" id="co-col">
            <h3>Employers</h3>
            <p class="dock-hint">Marks arrive muted. Hover to read.</p>
            ${logoDock(radarCompanies(camp), { mode: "scan" })}
          </aside>
        </div>
        <div class="scan-bar">
          <span>${esc(camp.name)}</span>
          <button class="btn btn-ghost" type="button" data-action="skip">Skip animation</button>
        </div>
      </div>
    `;
  }

  function viewVerify() {
    const camp = college();
    const email = state.profile.email.trim() || `tpo@${camp.short.toLowerCase().replace(/\s+/g, "")}.edu`;
    const rows = [
      ["email", "Work email received", email],
      ["record", "Matched to the university record", camp.name],
      ["role", "Placement-office role confirmed", state.profile.role],
      ["claim", "Office claim is unique for this campus", "You are the first on this demo"]
    ];
    return `
      <div class="scene scene-night">
        <div class="grain"></div>
        <div class="verify">
          <div class="verify-card">
            <div class="kicker">Pulse Campus · Credentials</div>
            <h1>Verifying you as ${esc(camp.short)}’s placement office.</h1>
            <div class="check-list">
              ${rows.map(([id, title, detail]) => `
                <div class="check-row" data-check="${id}">
                  <div class="check-mark"></div>
                  <div>${esc(title)}<small>${esc(detail)}</small></div>
                </div>
              `).join("")}
            </div>
            <div class="seal" id="verify-seal">Credentials<b>Verified</b></div>
          </div>
        </div>
        <div class="scan-bar">
          <span>${esc(firstName())} · ${esc(email)}</span>
          <button class="btn btn-ghost" type="button" data-action="skip-verify">Skip</button>
        </div>
      </div>
    `;
  }

  function runVerify() {
    const rows = [...document.querySelectorAll(".check-row")];
    const seal = document.getElementById("verify-seal");
    if (reduceMotion) {
      rows.forEach((row) => {
        row.classList.add("on");
        row.querySelector(".check-mark").textContent = "✓";
      });
      seal?.classList.add("on");
      if (!holdScan) later(() => go("welcome"), 900);
      return;
    }
    rows.forEach((row, i) => {
      later(() => {
        row.classList.add("on");
        const mark = row.querySelector(".check-mark");
        if (mark) mark.textContent = "✓";
      }, 450 + i * 700);
    });
    later(() => seal?.classList.add("on"), 450 + rows.length * 700 + 200);
    if (!holdScan) later(() => go("welcome"), 450 + rows.length * 700 + 1100);
  }

  function viewWelcome() {
    const camp = college();
    const batch = currentBatch(camp);
    return `
      <div class="scene scene-night welcome">
        <div class="grain"></div>
        <section class="welcome-seal">
          <div class="big-seal">
            <div class="ring">Office claimed</div>
            <strong>${esc(camp.short)}</strong>
            <em>${esc(state.profile.role)} · Verified</em>
          </div>
        </section>
        <section class="welcome-copy">
          <div class="brand-lock"><span class="brand-mark"></span> Welcome</div>
          <h1>Welcome, ${esc(firstName())}.</h1>
          <p class="verified-line">Your credentials have been verified.</p>
          <p class="lede">You are now the Pulse Campus office for ${esc(camp.name)}. This is a read of what Pulse already knows — not a promise that companies will hire this year’s batch.</p>
          <ul class="office-doors">
            <li><span>Alumni</span><div>${camp.alumni.toLocaleString("en-IN")} people from ${esc(camp.short)} already on the graph, including ${camp.japan} in Japan.</div></li>
            <li><span>Work</span><div>Where they work, how many, and the positions they hold. Named rosters use daily looks.</div></li>
            <li><span>Market</span><div>Engineering and IT jobs Pulse can see now, with a flag when your alumni already work there.</div></li>
            <li><span>Students</span><div>${batch.onPulse.toLocaleString("en-IN")} of ${batch.intake.toLocaleString("en-IN")} in the ${batch.year} intake have started a Pulse profile.</div></li>
          </ul>
          <div class="cta-row" style="margin:0">
            <button class="btn btn-pulse" type="button" data-action="open-graph" style="width:auto">Open our alumni on Pulse</button>
            <button class="btn btn-ghost" type="button" data-action="skip">Skip to the office</button>
          </div>
        </section>
      </div>
    `;
  }

  function mixCards(camp) {
    return camp.mix.map(([id, pct]) => {
      const meta = typeMeta(id);
      return `
        <button class="mix-card ${state.typeId === id ? "active" : ""}" data-type="${id}" data-accent="${meta.accent}" type="button">
          <div>
            <div class="pct">${pct}%</div>
            <div class="mix-bar"><i style="width:${pct}%"></i></div>
          </div>
          <div class="name">${esc(meta.name)}</div>
        </button>
      `;
    }).join("");
  }

  function typeDrawer(camp) {
    if (!state.typeId) return "";
    const meta = typeMeta(state.typeId);
    const companies = camp.companies[state.typeId] || [];
    const people = camp.people.filter((person) => person.type === state.typeId);
    return `
      <div class="drawer">
        <div class="drawer-head">
          <div>
            <h3>${esc(meta.name)}</h3>
            <p class="blurb">${esc(meta.blurb)}</p>
          </div>
          <button class="btn btn-ghost-dark" type="button" data-action="clear-type">Close</button>
        </div>
        <div class="company-list">
          ${companies.map(([name, n]) => `
            <div class="company-pill"><b>${esc(name)}</b><span>${n} alumni</span></div>
          `).join("")}
        </div>
        ${people.length ? `
          <div class="people">
            ${people.map((person) => `
              <div class="person">
                <div><b>${esc(person.name)}</b> · ${person.year} ${esc(person.dept)}</div>
                <div class="meta">${esc(person.role)}, ${esc(person.company)} · ${esc(person.city)}</div>
                <div>${person.hiring ? `<span class="tag tag-hire">Can hire</span>` : ""}${person.city.match(/Tokyo|Yokohama|Osaka|Kobe/) ? ` <span class="tag tag-jp">Japan</span>` : ""}</div>
              </div>
            `).join("")}
          </div>
        ` : ""}
      </div>
    `;
  }

  function firstMoves(camp) {
    const batch = currentBatch(camp);
    const items = [
      { done: true, title: "Campus office claimed", note: `${state.profile.role} · credentials verified`, action: null },
      { done: true, title: "Alumni graph opened", note: `${camp.alumni} profiles Pulse can already see`, action: "to-alumni" },
      { done: state.seen.work, title: "See where they work — company, count, position", note: "Aggregates are free. Named rosters cost a daily look.", action: "to-work" },
      { done: state.seen.market, title: "Review engineering & IT jobs", note: "Market, not campus drives already promised to you", action: "to-market" },
      { done: state.seen.students, title: `See the ${batch.year} batch on Pulse`, note: `${batch.onPulse} of ${batch.intake} have started a profile`, action: "to-students" },
      { done: state.seen.inviteStudents, title: `Invite the rest of ${batch.year}`, note: "The flywheel starts with the current intake", action: "invite-students" },
      { done: state.seen.principal, title: "Share a briefing with the principal", note: "One page. Counts, Japan corridor, market sample.", action: "principal" }
    ];
    return `
      <div class="section-head">
        <h2>First moves</h2>
        <p>This office is live. These are the next useful things, in order.</p>
      </div>
      <div class="moves">
        ${items.map((item) => `
          <button class="move ${item.done ? "done" : ""}" type="button" ${item.action ? `data-action="${item.action}"` : "disabled"}>
            <span class="dot"></span>
            <span><b>${esc(item.title)}</b><small>${esc(item.note)}</small></span>
            <span class="meta">${item.done ? "Done" : "Open"}</span>
          </button>
        `).join("")}
      </div>
    `;
  }

  function inspectHead(person, list) {
    const co = employment().companies.find((item) => item.name === person.company);
    const nAtCo = co ? co.n : list.length;
    const nAtRole = list.filter((p) => p.role === person.role).length;
    const pos = state.inspectIndex + 1;
    const type = typeMeta(person.type);
    const pipSpan = Math.min(12, list.length);
    const half = Math.floor(pipSpan / 2);
    let pipStart = Math.max(0, state.inspectIndex - half);
    const pipEnd = Math.min(list.length, pipStart + pipSpan);
    pipStart = Math.max(0, pipEnd - pipSpan);
    return `
      <div class="inspect-pips" role="tablist" aria-label="Alumni at ${esc(person.company)}">
        ${list.slice(pipStart, pipEnd).map((p, i) => {
          const idx = pipStart + i;
          return `<button type="button" class="inspect-pip ${idx === state.inspectIndex ? "on" : ""} ${isPersonOpen(p) ? "seen" : ""}" data-action="inspect-jump" data-index="${idx}" aria-label="${esc(p.role)} ${idx + 1} of ${list.length}"></button>`;
        }).join("")}
      </div>
      <div class="inspect-head">
        ${window.logoHTML(person.company, "live inspect-logo")}
        <div>
          <div class="why">${esc(type ? type.name : "Employer")}${person.hiring ? " · can hire" : ""}</div>
          <h2>${esc(person.company)}</h2>
          <p>${esc(person.role)} · ${esc(person.city)}</p>
        </div>
        <button class="inspect-x" type="button" data-action="close-inspect" aria-label="Close">×</button>
      </div>
      <div class="inspect-stats">
        <div><b>${nAtCo}</b><span>alumni here</span></div>
        <div><b>${nAtRole}</b><span>in this role</span></div>
        <div><b>${pos}/${list.length}</b><span>this company</span></div>
      </div>
    `;
  }

  function companyPanel() {
    const camp = college();
    const name = state.inspectCompany;
    const co = employment().companies.find((item) => item.name === name);
    if (!co) {
      return `
        <div class="inspect">
          <p class="lede">No affinity cut for ${esc(name || "this employer")}.</p>
          <button class="btn btn-ghost" type="button" data-action="close-inspect">Back</button>
        </div>
      `;
    }
    const type = typeMeta(co.type);
    const batch = currentBatch(camp);
    const branch = camp.departments[0] ? camp.departments[0][0] : "core";
    const live = liveJobsFor(name);
    const onP = pulsePeople(name);
    const internN = live.filter((job) => job.intern).length;
    return `
      <div class="inspect">
        <div class="inspect-head">
          ${window.logoHTML(name, "live inspect-logo")}
          <div>
            <div class="why">${esc(type ? type.name : "Employer")}</div>
            <h2>${esc(name)}</h2>
            <p>Where yours already sit</p>
          </div>
          <button class="inspect-x" type="button" data-action="close-inspect" aria-label="Close">×</button>
        </div>
        <div class="headcount">
          <b>${co.n}</b>
          <em>${esc(camp.short)} alumni work here</em>
          <small>Public-profile counts, not verified names. Names only when they join Pulse.</small>
        </div>
        <div class="inspect-stats">
          <div><b>${co.roles[0][1]}</b><span>in ${esc(co.roles[0][0])}</span></div>
          <div><b>${live.length}</b><span>live roles now</span></div>
          <div><b>${onP.length}</b><span>on Pulse</span></div>
        </div>
        ${onP.length ? `
          <div class="who-list">
            <div class="why">Who you can ask · on Pulse</div>
            ${onP.slice(0, 6).map((p) => {
              const openP = isPersonOpen(p);
              return `
              <button type="button" class="who-row ${openP ? "open" : "sealed"}" data-inspect-company="${esc(p.company)}" data-inspect-role="${esc(p.role)}" data-inspect-name="${esc(p.name)}">
                <span class="person-chip"><i>${esc(window.personInitials(p.name))}</i></span>
                <span>
                  <b>${openP ? esc(p.name) : "Name sealed"}</b>
                  <small>${esc(p.role)} · ${esc(p.dept)} · class of ${p.year} · ${esc(p.city)}</small>
                </span>
                <span class="who-go">${openP ? "Ask" : "Reveal"}</span>
              </button>`;
            }).join("")}
          </div>
        ` : `
          <p class="inspect-ok">Nobody from this campus is on Pulse at ${esc(name)} yet. Teal company tiles on the left already have someone you can reveal and ask.</p>
          <div class="who-list">
            ${employment().companies.filter((c) => pulsePeople(c.name).length).slice(0, 4).map((c) => `
              <button type="button" class="who-row" data-inspect-company="${esc(c.name)}">
                ${window.logoHTML(c.name, "live tiny")}
                <span>
                  <b>${esc(c.name)}</b>
                  <small>${pulsePeople(c.name).length} on Pulse · open to see who</small>
                </span>
                <span class="who-go">Open</span>
              </button>
            `).join("")}
          </div>
        `}
        <div class="seat-card">
          <div class="why">Seats Pulse can count</div>
          ${co.roles.slice(0, 4).map(([role, n]) => `<p>${esc(role)} · <b>${n}</b></p>`).join("")}
          <small>Brief ${esc(batch.year)} ${esc(branch)}. 2026 is still incomplete.</small>
        </div>
        ${live.length ? `
          <div class="live-cut">
            <div class="why">Open now · Pulse can see this</div>
            ${live.slice(0, 3).map((job) => `
              <button type="button" class="live-row" data-action="jobs-at" data-company="${esc(job.company)}" data-job="${esc(job.id)}">
                <span><b>${esc(job.title)}</b><small>${esc(job.city)} · ${esc(job.posted)} ago${job.intern ? " · Internship · Internshala snapshot" : ""}</small></span>
                <span class="open-now">${job.intern ? "Snapshot" : "Open now"}</span>
              </button>
            `).join("")}
          </div>
        ` : ""}
        ${internN ? `<p class="inspect-ok">Internship rows are a last Internshala snapshot. That feed is not live.</p>` : ""}
        <div class="inspect-acts">
          <button class="btn btn-pulse" type="button" data-action="open-brief">Brief ${esc(batch.year)} ${esc(branch)}</button>
          <button class="btn btn-ghost" type="button" data-action="invite-students">${state.claimed ? `Invite ${esc(batch.year)} who match` : `Claim office to invite ${esc(batch.year)}`}</button>
        </div>
      </div>
    `;
  }

  function claimFormCard(person, list) {
    const camp = college();
    const emailPh = `tpo@${camp.short.toLowerCase().replace(/\s+/g, "")}.edu`;
    return `
      <div class="inspect">
        ${inspectHead(person, list)}
        <p class="inspect-ok">Claim this placement office to see who this is — then ask them on Pulse.</p>
        <form id="claim-form" class="claim-on-card">
          <label class="field">
            <span>Your name</span>
            <input id="claim-name" type="text" value="${esc(state.profile.name)}" placeholder="Placement officer" autocomplete="name">
          </label>
          <label class="field">
            <span>Work email</span>
            <input id="claim-email" type="email" value="${esc(state.profile.email)}" placeholder="${esc(emailPh)}" autocomplete="email">
          </label>
          <label class="field">
            <span>Role</span>
            <select id="claim-role">
              ${["Placement Head", "TPO", "Placement Coordinator", "Principal / Dean"].map((role) => `
                <option ${state.profile.role === role ? "selected" : ""}>${role}</option>
              `).join("")}
            </select>
          </label>
          <button class="btn btn-pulse" type="submit" ${canClaim() ? "" : "disabled"}>Verify this office</button>
        </form>
        <p class="inspect-keys">Esc to keep looking without a name</p>
      </div>
    `;
  }

  function claimVerifyCard(person, list) {
    const camp = college();
    const email = state.profile.email.trim();
    const rows = [
      ["email", "Work email received", email],
      ["record", "Matched to the university record", camp.name],
      ["role", "Placement-office role confirmed", state.profile.role],
      ["claim", "Office claim is unique for this campus", "You are the first on this demo"]
    ];
    return `
      <div class="inspect">
        ${inspectHead(person, list)}
        <div class="check-list">
          ${rows.map(([id, title, detail]) => `
            <div class="check-row" data-check="${id}">
              <div class="check-mark"></div>
              <div>${esc(title)}<small>${esc(detail)}</small></div>
            </div>
          `).join("")}
        </div>
        <div class="seal" id="claim-seal">Credentials<b>Verified</b></div>
        <button class="btn btn-ghost" type="button" data-action="skip-claim-verify">Skip</button>
      </div>
    `;
  }

  function askCard(person, list) {
    const note = askDraft(person);
    return `
      <div class="inspect">
        ${inspectHead(person, list)}
        <div class="inspect-who">
          <span class="person-chip"><i>${esc(window.personInitials(person.name))}</i></span>
          <div>
            <b>${esc(person.name)}</b>
            <small class="seat">${esc(person.role)} · ${esc(person.city)}</small>
            <small>${esc(person.dept)} · class of ${person.year}</small>
          </div>
        </div>
        <p class="inspect-ok">This is the message. Pulse delivers it — not your college inbox.</p>
        <blockquote class="ask-note">${esc(note).replace(/\n/g, "<br>")}</blockquote>
        <button class="btn btn-pulse" type="button" data-action="send-ask">Send with Pulse</button>
        <button class="btn btn-ghost" type="button" data-action="close-ask" style="margin-top:8px">Keep looking</button>
      </div>
    `;
  }

  function inspectPanel() {
    const person = inspectPerson();
    const list = person ? pulsePeople(person.company) : companyPeople(state.inspectCompany);
    if (!person) {
      if (state.claimStep === "form") {
        return claimFormCard({
          company: state.inspectCompany,
          role: "Placement office",
          city: college().city,
          type: (employment().companies.find((c) => c.name === state.inspectCompany) || {}).type,
          hiring: false,
          name: "Office",
          dept: "",
          year: ""
        }, []);
      }
      if (state.claimStep === "verify") {
        return claimVerifyCard({
          company: state.inspectCompany,
          role: "Placement office",
          city: college().city,
          type: (employment().companies.find((c) => c.name === state.inspectCompany) || {}).type,
          hiring: false,
          name: "Office"
        }, []);
      }
      return companyPanel();
    }
    if (state.claimStep === "form") return claimFormCard(person, list);
    if (state.claimStep === "verify") return claimVerifyCard(person, list);
    if (state.askOpen && isPersonOpen(person)) return askCard(person, list);
    const open = isPersonOpen(person);
    const cut = todayCut(person);
    const asked = cut && cut.status === "asked";
    const replied = cut && cut.status === "replied";
    const seat = seatPattern(person);
    const liveBlock = seat.liveN ? `
      <div class="live-cut">
        <div class="why">Open now · Pulse can see this</div>
        ${seat.live.slice(0, 3).map((job) => `
          <button type="button" class="live-row" data-action="jobs-at" data-company="${esc(job.company)}" data-job="${esc(job.id)}">
            <span><b>${esc(job.title)}</b><small>${esc(job.city)} · ${esc(job.posted)} ago${job.intern ? " · Internship · Internshala snapshot" : ""}</small></span>
            <span class="open-now">${job.intern ? "Snapshot" : "Open now"}</span>
          </button>
        `).join("")}
        ${seat.liveN > 3 ? `<button class="btn btn-ghost" type="button" data-action="jobs-at" data-company="${esc(person.company)}">All ${seat.liveN} live at ${esc(person.company)}</button>` : ""}
      </div>
    ` : `<p class="inspect-ok">No live req at ${esc(person.company)} in this cut. The seat is still the brief.</p>`;
    const afterOpen = `
      <div class="seat-card">
        <div class="why">How they hire yours</div>
        <p>${esc(person.role)} at ${esc(person.company)} · ${esc(seat.band)} · ${esc(person.city)}</p>
        <small>${seat.nAtRole} in this seat · ${seat.nAtCo} ${esc(college().short)} alumni here · brief ${esc(seat.year)} ${esc(seat.branch)}</small>
      </div>
      ${liveBlock}
      <div class="inspect-acts">
        <button class="btn btn-ghost" type="button" data-action="open-brief">Brief ${esc(seat.year)} ${esc(seat.branch)}</button>
        <button class="btn btn-ghost" type="button" data-action="invite-students">Invite ${esc(seat.year)} who match</button>
      </div>
      ${replied ? `<p class="inspect-ok">They replied. Brief ${esc(seat.year)} or invite the match.</p>` : asked ? `<p class="inspect-ok">Asked. Pulse is delivering. They choose whether to answer.</p>` : ""}
    `;
    return `
      <div class="inspect">
        ${inspectHead(person, list)}
        ${open ? `
          <div class="inspect-who">
            <span class="person-chip"><i>${esc(window.personInitials(person.name))}</i></span>
            <div>
              <b>${esc(person.name)}</b>
              <small class="seat">${esc(person.role)} · ${esc(person.city)}</small>
              <small>${esc(person.dept)} · class of ${person.year}</small>
            </div>
          </div>
          ${!asked && !replied ? `
            <div class="ask-now">
              <p>This is the person. Ask them on Pulse to brief ${esc(seat.year)}.</p>
              <button class="btn btn-pulse" type="button" data-action="open-ask">Ask ${esc(person.name.split(/\s+/)[0])} on Pulse</button>
            </div>
          ` : ""}
          ${afterOpen}
        ` : `
          <button type="button" class="inspect-who sealed" data-action="reveal-inspect" aria-label="Name sealed. Seat is visible.">
            <span class="person-chip" aria-hidden="true"><i>${esc(window.personInitials(person.name))}</i></span>
            <div>
              <b aria-hidden="true">${esc(person.name)}</b>
              <small class="seat">${esc(person.role)} · ${esc(person.city)}</small>
              <small>${esc(person.dept)} · class of ${person.year} · on Pulse</small>
            </div>
          </button>
          <div class="ask-now">
            <p>You can already see the seat. Reveal the name, then Pulse opens the message.</p>
            <button class="btn btn-pulse" type="button" data-action="reveal-inspect">
              ${!state.claimed
                ? "Claim office to reveal and ask"
                : (state.looks < 1 ? "Out of looks today" : `Reveal name to ask · ${state.looks} left today`)}
            </button>
          </div>
        `}
        <div class="inspect-nav">
          <button class="btn btn-ghost" type="button" data-action="inspect-prev">← Previous</button>
          <span>Same company</span>
          <button class="btn btn-ghost" type="button" data-action="inspect-next">Next →</button>
        </div>
        <p class="inspect-keys">← → through ${esc(person.company)} · Enter to reveal · Esc to close</p>
      </div>
    `;
  }

  function howNext(person, open, inspecting) {
    let on = "company";
    if (inspecting && !person) on = "who";
    if (person && !open) on = "reveal";
    if (person && open) on = "ask";
    if (state.askOpen) on = "ask";
    const steps = [
      ["company", "1 · Click a company"],
      ["who", "2 · See who"],
      ["reveal", "3 · Reveal the name"],
      ["ask", "4 · Ask on Pulse"]
    ];
    return `
      <ol class="how-next">
        ${steps.map(([id, label]) => `<li class="${id === on ? "on" : ""}">${label}</li>`).join("")}
      </ol>
    `;
  }

  function officeCaption(person, open, inspecting) {
    if (state.jobsOpen) return "Live roles at employers your people already staff. Internship rows are a snapshot, not a live Internshala feed.";
    if (!inspecting) {
      return "Teal tiles already have someone on Pulse. Click one — see the seat, reveal the name, ask them.";
    }
    if (inspecting && !person) return "No one on Pulse at this company yet. Open a teal tile to see who you can ask.";
    if (state.claimStep === "form") return "Claim the office to see this name, then ask them on Pulse.";
    if (state.claimStep === "verify") return "Verifying the office. Then the name opens and you can ask.";
    if (state.askOpen) return "Edit if you want. Send with Pulse. They choose whether to answer.";
    if (open) {
      const cut = todayCut(person);
      if (cut && cut.status === "replied") return "They replied. Brief this year’s batch or invite the match.";
      if (cut && cut.status === "asked") return "Asked. Pulse is delivering.";
      return "This is the person. Ask them on Pulse.";
    }
    return "The seat is visible. Reveal the name to open the message.";
  }

  function todayTray() {
    if (!state.today.length) return "";
    return `
      <div class="today-tray">
        <span>Today</span>
        ${state.today.map((item) => `
          <button type="button" class="today-chip ${item.status}" data-inspect-company="${esc(item.company)}" data-inspect-role="${esc(item.role)}" data-inspect-name="${esc(item.name)}">
            <span class="person-chip"><i>${esc(window.personInitials(item.name))}</i></span>
            <span>
              <b>${esc(item.name)}</b>
              <small>${esc(item.company)}${item.status === "asked" ? " · Asked" : item.status === "replied" ? " · Replied" : ""}</small>
            </span>
          </button>
        `).join("")}
      </div>
    `;
  }

  function jobsPanel() {
    const camp = college();
    const jobs = jobsForCampus();
    return `
      <div class="inspect jobs-panel">
        <div class="jobs-head">
          <div>
            <div class="why">${state.jobCompany ? `Live at ${esc(state.jobCompany)}` : "Live market"} · alumni already work here</div>
            <h2>Open now</h2>
            <p>Roles Pulse can see. Affinity is which of yours already sit there.</p>
          </div>
          <button class="inspect-x" type="button" data-action="close-jobs" aria-label="Close">×</button>
        </div>
        <div class="job-toolbar compact">
          <div class="tabs">
            <button type="button" data-stream="engineering" class="${state.jobStream === "engineering" ? "active" : ""}">Engineering</button>
            <button type="button" data-stream="it" class="${state.jobStream === "it" ? "active" : ""}">IT</button>
          </div>
          <div class="chips">
            <button class="chip ${state.japanOnly ? "on" : ""}" type="button" data-toggle="japan">Japan-linked</button>
            <button class="chip ${state.alumniOnly ? "on" : ""}" type="button" data-toggle="alumni">Alumni work here</button>
          </div>
        </div>
        ${state.jobCompany ? `
          <button class="job-co-filter" type="button" data-action="clear-job-company">${esc(state.jobCompany)} · show all</button>
        ` : ""}
        <input class="job-search" id="job-q" type="search" placeholder="Role, company, city" value="${esc(state.jobQuery)}" autocomplete="off">
        <div class="jobs-list">
          ${jobs.length ? jobs.map((job) => {
            const n = job.alumni[camp.id] || 0;
            const open = state.claimed;
            return `
              <button class="job-cut ${open ? "open" : "sealed"}" type="button" data-job="${job.id}">
                <div class="job-cut-top">
                  ${window.logoHTML(job.company, "live")}
                  <div>
                    <h3>${esc(job.title)}</h3>
                    <div class="co">${esc(job.company)} · ${esc(job.city)}${job.intern ? " · Internship" : ""}</div>
                  </div>
                  <span class="open-now">Open now</span>
                </div>
                ${n ? `<div class="alumni-badge">${n} ${esc(camp.short)} alumni work here</div>` : `<div class="alumni-badge mute">No ${esc(camp.short)} alumni tagged</div>`}
                ${open ? `
                  <div class="job-meta"><span>${esc(job.ctc)}</span><span>${esc(job.exp)}</span><span>${esc(job.eligibility)}</span></div>
                  <p class="job-note">Brief ${esc(camp.short)} against this seat. Pulse does not auto-apply anyone.</p>
                ` : `<small>Claim the office to open the JD.</small>`}
              </button>
            `;
          }).join("") : `<p class="inspect-ok">No roles in this cut. Clear a filter.</p>`}
        </div>
      </div>
    `;
  }

  function pulseBody() {
    seedCampusPulse();
    const camp = college();
    const inspecting = Boolean(state.inspectCompany);
    const person = inspectPerson();
    const open = Boolean(person && isPersonOpen(person));
    const side = state.jobsOpen || inspecting;
    return `
      <div class="play ${side ? "is-inspect" : "is-idle"}">
        <div class="play-radar">
          ${radarMarkup({ mode: "ghost", recognized: true, center: camp.short })}
          ${logoDock(radarCompanies(camp))}
          <p class="co-count">${employment().companyCount} employers · teal tiles have someone you can ask</p>
          ${howNext(person, open, inspecting)}
          ${todayTray()}
          <p class="play-ghost-cap">${officeCaption(person, open, inspecting)}</p>
        </div>
        ${state.jobsOpen ? `<div class="play-deal">${jobsPanel()}</div>` : inspecting ? `<div class="play-deal">${inspectPanel()}</div>` : ""}
      </div>
    `;
  }

  function matchOverlay() {
    if (state.overlay !== "match") return "";
    const camp = college();
    const mech = camp.departments.find((d) => /mech/i.test(d[0])) || camp.departments[0];
    const warm = employment().companies.filter((co) => /japan-mfg|auto|core/.test(co.type)).slice(0, 4);
    return `
      <div class="overlay">
        <div class="request-card match-card" role="dialog">
          <div class="kicker">Pulse match · not a job board</div>
          <h3>2027 ${esc(mech[0])} → companies they already staff</h3>
          <p>${mech[1]}% of the alumni graph is ${esc(mech[0])}. These employers already have your people. Invite the batch. Request a roster. That is the whole move.</p>
          <div class="match-list">
            ${warm.map((co) => `
              <button type="button" class="match-row" data-action="mission-dense" data-company="${esc(co.name)}">
                ${window.logoHTML(co.name)}
                <span><b>${esc(co.name)}</b><small>${co.n} alumni · ${esc(co.roles[0][0])}</small></span>
                <span class="cost">Request</span>
              </button>
            `).join("")}
          </div>
          <div class="cta-row" style="margin:12px 0 0">
            <button class="btn btn-pulse" type="button" data-action="invite-students" style="width:auto">Invite 2027 ${esc(mech[0])}</button>
            <button class="btn btn-ghost" type="button" data-action="close-overlay">Keep faded</button>
          </div>
        </div>
      </div>
    `;
  }

  function draftOverlay() {
    if (state.overlay !== "draft") return "";
    const camp = college();
    const top = densestCompany();
    const batch = currentBatch(camp);
    return `
      <div class="overlay">
        <div class="request-card" role="dialog">
          <div class="kicker">Pulse draft · you approve</div>
          <h3>Four lines for the principal</h3>
          <blockquote class="draft">
            ${camp.alumni} alumni from ${camp.short} are already on Pulse — working, not a wish-list.<br><br>
            ${camp.japan} are in Japan. ${camp.hiringManagers} are in hiring or lead roles. Densest employer: ${top ? top.name + " (" + top.n + ")" : "—"}.<br><br>
            ${batch.onPulse} of ${batch.intake} in the ${batch.year} intake have started a profile. The rest are not on the graph yet.<br><br>
            I have not told students that companies are chasing them. Next: invite ${batch.year}, and request one roster where alumni already sit.
          </blockquote>
          <div class="cta-row" style="margin:0">
            <button class="btn btn-pulse" type="button" data-action="approve-draft" style="width:auto">Approve — open briefing</button>
            <button class="btn btn-ghost" type="button" data-action="close-overlay">Not yet</button>
          </div>
        </div>
      </div>
    `;
  }

  function briefingBody() {
    const camp = college();
    return `
      <div class="hero-number hero-radar">
        <div>
          <div class="kicker">Alumni Pulse can already see</div>
          <div class="num">${camp.alumni.toLocaleString("en-IN")}</div>
          <h1 style="margin-top:12px">${esc(camp.short)} is already on the graph.</h1>
          <p>${esc(firstName())}, people and employers just populated. You can see that they exist. Names and logos stay faded until the office requests to see a cut.</p>
        </div>
        <div class="brief-radar">
          ${radarMarkup({ mode: "ghost", recognized: true, center: camp.short })}
          ${logoDock(radarCompanies(camp))}
        </div>
      </div>
      <p class="ghost-note">The radar is the teaser. <b>Request to see</b> a person or a logo to unblur that roster — it uses a daily request.</p>
      <div class="stat-row">
        <div class="stat japan-stat">
          <div class="n">${camp.japan}</div>
          <div class="l">Working in Japan — the corridor most TPOs never get as a list</div>
        </div>
        <div class="stat">
          <div class="n">${camp.hiringManagers}</div>
          <div class="l">Alumni now in hiring / lead roles</div>
        </div>
        <div class="stat">
          <div class="n">${esc(camp.batches)}</div>
          <div class="l">Batch years covered</div>
        </div>
        <div class="stat">
          <div class="n">${camp.cities.length}</div>
          <div class="l">Cities with a visible cluster</div>
        </div>
      </div>
      <div class="section-head">
        <h2>Where they went</h2>
        <p>By employer type. Click a band.</p>
      </div>
      <div class="mix-grid">${mixCards(camp)}</div>
      ${typeDrawer(camp)}
      <div class="section-head" style="margin-top:28px">
        <h2>Branches on the graph</h2>
        <p>TPO-shaped, not HR-shaped.</p>
      </div>
      <div class="dept-row">
        ${camp.departments.map(([name, pct]) => `<span class="dept">${esc(name)} <b>${pct}%</b></span>`).join("")}
      </div>
      ${firstMoves(camp)}
      <div class="cta-row">
        <button class="btn btn-ink" type="button" data-action="to-work">See where they work</button>
        <button class="btn btn-ghost-dark" type="button" data-action="to-market">See engineering & IT jobs in the market</button>
        <button class="btn btn-ghost-dark" type="button" data-action="invite-alumni">Invite alumni to claim their batch</button>
        <button class="btn btn-ghost-dark" type="button" data-action="principal">Brief the principal</button>
      </div>
    `;
  }

  function studentsBody() {
    const camp = college();
    const batch = currentBatch(camp);
    const pct = Math.round((batch.onPulse / batch.intake) * 100);
    return `
      <div class="hero-number">
        <div>
          <div class="kicker">${batch.year} intake on Pulse</div>
          <div class="num">${batch.onPulse.toLocaleString("en-IN")}</div>
        </div>
        <div>
          <h1>${pct}% of this year’s class has started a profile.</h1>
          <p>${batch.intake.toLocaleString("en-IN")} in the ${batch.year} intake. The rest are not on the graph yet — that is the TPO’s next motion, not a Cognavi scrape. Completeness below is only among students who already signed up.</p>
        </div>
      </div>
      <div class="stat-row">
        <div class="stat">
          <div class="n">${batch.intake.toLocaleString("en-IN")}</div>
          <div class="l">${batch.year} intake (indicative)</div>
        </div>
        <div class="stat">
          <div class="n">${Math.round((batch.resume / batch.onPulse) * 100)}%</div>
          <div class="l">On Pulse with a resume</div>
        </div>
        <div class="stat">
          <div class="n">${Math.round((batch.video / batch.onPulse) * 100)}%</div>
          <div class="l">With a video resume</div>
        </div>
        <div class="stat japan-stat">
          <div class="n">${batch.japanInterest}</div>
          <div class="l">Marked interest in Japan</div>
        </div>
      </div>
      <div class="section-head">
        <h2>Profile completeness</h2>
        <p>Among the ${batch.onPulse} already on Pulse.</p>
      </div>
      <div class="bars">
        ${[
          ["Resume", batch.resume],
          ["Skills", batch.skills],
          ["Video resume", batch.video],
          ["Japan interest", batch.japanInterest]
        ].map(([label, n]) => `
          <div class="bar-row">
            <span>${esc(label)} <b>${n} / ${batch.onPulse}</b></span>
            <div class="bar-track"><i style="width:${Math.round((n / batch.onPulse) * 100)}%"></i></div>
          </div>
        `).join("")}
      </div>
      <div class="section-head">
        <h2>People the office can already brief</h2>
        <p>Last initial only. Missing field is the next ask — not a score for the student.</p>
      </div>
      <div class="drawer">
        ${batch.people.map((person) => `
          <div class="person">
            <div><b>${esc(person.name)}</b> · ${esc(person.dept)} · ${batch.year}</div>
            <div class="meta">${person.complete}% complete${person.missing ? ` · needs ${esc(person.missing).toLowerCase()}` : ""}</div>
            <div>${person.missing ? `<span class="tag">${esc(person.missing)}</span>` : `<span class="tag">Ready to brief</span>`}</div>
          </div>
        `).join("")}
      </div>
      <div class="cta-row">
        <button class="btn btn-ink" type="button" data-action="invite-students">Invite the rest of ${batch.year}</button>
        <button class="btn btn-ghost-dark" type="button" data-action="to-market">See jobs they could be briefed on</button>
      </div>
    `;
  }

  function jobBoard() {
    const camp = college();
    const jobs = jobsForCampus();
    return `
      <div class="hero-number" style="align-items:start">
        <div>
          <div class="kicker">Market Pulse can see</div>
          <h1>Engineering and IT roles, first.</h1>
        </div>
        <p>These are jobs in the market — not campus drives already promised to you. Where your alumni already work, we say so. That is a warm path, not a placement guarantee.</p>
      </div>
      <div class="job-toolbar">
        <div class="tabs">
          <button type="button" data-stream="engineering" class="${state.jobStream === "engineering" ? "active" : ""}">Engineering</button>
          <button type="button" data-stream="it" class="${state.jobStream === "it" ? "active" : ""}">IT</button>
        </div>
        <div class="chips">
          <button class="chip ${state.japanOnly ? "on" : ""}" type="button" data-toggle="japan">Japan-linked</button>
          <button class="chip ${state.alumniOnly ? "on" : ""}" type="button" data-toggle="alumni">Alumni work here</button>
        </div>
        <input class="job-search" id="job-q" type="search" placeholder="Role, company, city" value="${esc(state.jobQuery)}">
      </div>
      <div class="job-board">
        ${jobs.length ? jobs.map((job) => {
          const n = job.alumni[camp.id] || 0;
          const open = state.openJob === job.id;
          return `
            <button class="job ${open ? "open" : ""}" type="button" data-job="${job.id}">
              <div class="job-top">
                <span>${esc(job.city)} · ${esc(job.posted)} ago</span>
                <span>${job.japan ? "Japan-linked" : job.stream}</span>
              </div>
              <h3>${esc(job.title)}</h3>
              <div class="co">${esc(job.company)}</div>
              <div class="job-meta">
                <span>${esc(job.ctc)}</span>
                <span>${esc(job.exp)}</span>
                <span>${esc(job.eligibility)}</span>
              </div>
              ${n ? `<div class="alumni-badge">${n} ${esc(camp.short)} alumni work here</div>` : `<div class="alumni-badge" style="background:#eef3f5;color:#5e717a">No ${esc(camp.short)} alumni tagged yet</div>`}
              <div class="job-detail">
                Matching on Pulse would use student skills and consent — this mock stops at visibility. A TPO can brief students about the role; Cognavi does not auto-apply anyone.
              </div>
            </button>
          `;
        }).join("") : `<div class="empty">No roles in this cut. Clear a filter.</div>`}
      </div>
    `;
  }

  function alumniDirectory() {
    const camp = college();
    return `
      <div class="hero-number">
        <div>
          <div class="kicker">Visible profiles</div>
          <h1>People, not a pie chart.</h1>
        </div>
        <p>Last initial only in this mock. Live Pulse would honour what each alumnus made visible to the campus. Chat and group rooms wait for the alumni door — TPO can invite, not message them as a feed.</p>
      </div>
      <div class="mix-grid">${mixCards(camp)}</div>
      ${typeDrawer(camp)}
      <div class="drawer" style="margin-top:16px">
        ${camp.people.map((person) => `
          <div class="person">
            <div><b>${esc(person.name)}</b> · ${person.year} ${esc(person.dept)}</div>
            <div class="meta">${esc(person.role)}, ${esc(person.company)} · ${esc(person.city)}</div>
            <div>
              ${person.hiring ? `<span class="tag tag-hire">Can hire</span>` : ""}
              ${person.city.match(/Tokyo|Yokohama|Osaka|Kobe/) ? `<span class="tag tag-jp">Japan</span>` : ""}
            </div>
          </div>
        `).join("")}
      </div>
      <div class="cta-row">
        <button class="btn btn-ink" type="button" data-action="invite-alumni">Invite the rest of the batch</button>
      </div>
    `;
  }

  function printSheet() {
    const camp = college();
    const batch = currentBatch(camp);
    return `
      <section class="print-sheet">
        <p>Pulse Campus briefing — demo</p>
        <h1>${esc(camp.name)}</h1>
        <p>${esc(state.profile.name)} · ${esc(state.profile.role)}</p>
        <p>${camp.alumni} alumni Pulse can already see · ${camp.japan} in Japan · ${camp.hiringManagers} in hiring/lead roles</p>
        <p>${batch.year} students who started a profile: ${batch.onPulse} / ${batch.intake}</p>
        <p>Employer mix: ${camp.mix.map(([id, pct]) => `${typeMeta(id).name} ${pct}%`).join(" · ")}</p>
      </section>
    `;
  }

  function inviteModal() {
    if (state.overlay !== "invite") return "";
    const camp = college();
    const batch = currentBatch(camp);
    const alumni = state.inviteKind === "alumni";
    return `
      <div class="overlay">
        <div class="modal wide" role="dialog" aria-labelledby="invite-title">
          <h3 id="invite-title">${alumni ? "Invite alumni (optional)" : `Invite the rest of ${batch.year}`}</h3>
          <p>${alumni
            ? "Only if you already have a list. Pulse sends as Pulse. Names show when they join — not in this session. Do not hunt people on LinkedIn."
            : "You already mail this batch. The invite is from the placement office. 2026 is still incomplete — this is 2027."}</p>
          ${alumni ? `
            <label class="field">
              <span>Paste alumni emails</span>
              <textarea id="invite-paste" rows="6" placeholder="one@company.com&#10;two@company.com">${esc(state.invitePaste)}</textarea>
            </label>
            <p class="inspect-ok">Optional. Counts stay until they join.</p>
          ` : `
          <div class="invite-list">
            ${batch.people.map((person) => `
                  <label><input type="checkbox" checked> ${esc(person.name)} · ${esc(person.dept)} · ${batch.year}</label>
                `).join("")}
            <label><input type="checkbox" checked> Remaining ${batch.intake - batch.onPulse} students not yet on Pulse</label>
          </div>
          `}
          <div class="cta-row" style="margin:0">
            <button class="btn btn-ink" type="button" data-action="send-invites">Queue invites</button>
            <button class="btn btn-ghost-dark" type="button" data-action="close-overlay">Not now</button>
          </div>
        </div>
      </div>
    `;
  }

  function principalOverlay() {
    if (state.overlay !== "principal") return "";
    const camp = college();
    const batch = currentBatch(camp);
    const jobs = DATA.jobs.filter((job) => (job.alumni[camp.id] || 0) > 0).slice(0, 3);
    return `
      <div class="overlay">
        <article class="principal" role="dialog" aria-labelledby="principal-title">
          <header>
            <div>
              <div class="letterhead">Pulse Campus · Confidential to the university</div>
              <h2 id="principal-title">${esc(camp.name)}</h2>
            </div>
            <div class="letterhead">${esc(state.profile.name)} · ${esc(state.profile.role)}<br>Demo briefing</div>
          </header>
          <dl>
            <div><dt>Alumni Pulse can already see</dt><dd>${camp.alumni.toLocaleString("en-IN")}</dd></div>
            <div><dt>Working in Japan</dt><dd>${camp.japan}</dd></div>
            <div><dt>Alumni in hiring / lead roles</dt><dd>${camp.hiringManagers}</dd></div>
            <div><dt>${batch.year} students who started a profile</dt><dd>${batch.onPulse} / ${batch.intake}</dd></div>
          </dl>
          <p>Employer mix: ${camp.mix.map(([id, pct]) => `${typeMeta(id).name} ${pct}%`).join(" · ")}.</p>
          <p>Sample of market roles where ${esc(camp.short)} alumni already work: ${jobs.map((job) => `${job.title} at ${job.company}`).join("; ")}.</p>
          <p>This is a count of people and jobs Pulse can see. It is not a guarantee of campus drives or offers.</p>
          <div class="cta-row">
            <button class="btn btn-ink" type="button" data-action="print">Print / save PDF</button>
            <button class="btn btn-ghost-dark" type="button" data-action="close-overlay">Close</button>
          </div>
        </article>
      </div>
    `;
  }

  function workBody() {
    const camp = college();
    const graph = employment();
    const q = state.workQuery.trim().toLowerCase();
    const companies = graph.companies.filter((co) => {
      if (q && !(co.name + " " + co.roles.map((r) => r[0]).join(" ")).toLowerCase().includes(q)) return false;
      return true;
    });
    const positions = graph.positions.filter((p) => !q || p.role.toLowerCase().includes(q));
    const selectedCo = graph.companies.find((co) => co.name === state.workCompany) || null;
    const selectedPos = graph.positions.find((p) => p.role === state.workRole) || null;

    let roster = [];
    let rosterLabel = "";
    let rosterLocked = false;
    if (selectedCo && state.workRole) {
      roster = selectedCo.people.filter((p) => p.role === state.workRole);
      rosterLabel = `${state.workRole} at ${selectedCo.name}`;
      rosterLocked = !isUnlocked(selectedCo.name, state.workRole);
    } else if (selectedPos && state.workCompany) {
      const co = graph.companies.find((c) => c.name === state.workCompany);
      roster = (co?.people || []).filter((p) => p.role === selectedPos.role);
      rosterLabel = `${selectedPos.role} at ${state.workCompany}`;
      rosterLocked = !isUnlocked(state.workCompany, selectedPos.role);
    }

    const stage = selectedCo ? `
      <div class="kicker">${esc(typeMeta(selectedCo.type).name)}${selectedCo.japan ? " · Japan corridor" : ""}</div>
      <h2>${esc(selectedCo.name)}</h2>
      <p class="lede">${selectedCo.n} ${esc(camp.short)} alumni Pulse can see. Positions are free. Names stay faded until you request to see.</p>
      <div class="role-stack">
        ${selectedCo.roles.map(([role, n]) => {
          const open = isUnlocked(selectedCo.name, role);
          const on = state.workRole === role;
          return `
            <button class="emp-role ${on ? "on" : ""}" type="button" data-open-role="${esc(role)}">
              <span class="rn">${esc(role)}</span>
              <span class="rc">${n}</span>
              <span class="cost">${open ? "Visible" : "Request to see"}</span>
            </button>
          `;
        }).join("")}
      </div>
    ` : selectedPos ? `
      <div class="kicker">Position across the campus</div>
      <h2>${esc(selectedPos.role)}</h2>
      <p class="lede">${selectedPos.n} alumni in this role. Companies are free. Names at a company stay faded until you request to see.</p>
      <div class="role-stack">
        ${selectedPos.companies.map((co) => {
          const open = isUnlocked(co.name, selectedPos.role);
          const on = state.workCompany === co.name;
          return `
            <button class="emp-role ${on ? "on" : ""}" type="button" data-company="${esc(co.name)}" data-open-role="${esc(selectedPos.role)}">
              <span class="rn">${window.logoHTML(co.name, "tiny")} ${esc(co.name)}</span>
              <span class="rc">${co.n}</span>
              <span class="cost">${open ? "Visible" : "Request to see"}</span>
            </button>
          `;
        }).join("")}
      </div>
    ` : `
      <div class="kicker">Campus employment graph</div>
      <h2>${graph.companyCount} companies. ${graph.roleCount} positions.</h2>
      <p class="lede">This cut is free: where they work, how many, what they do. People and logos stay faded. Request to see a cut — ${state.looks} requests left today.</p>
      <div class="role-stack">
        ${graph.positions.slice(0, 8).map((p) => `
          <button class="emp-role" type="button" data-position="${esc(p.role)}">
            <span class="rn">${esc(p.role)}</span>
            <span class="rc">${p.n}</span>
            <span class="cost">Across ${p.companies.length} companies</span>
          </button>
        `).join("")}
      </div>
    `;

    return `
      <div class="graph-hero">
        <div>
          <div class="kicker" style="font-family:var(--font-mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--pulse-2)">Where they work</div>
          <h1>${esc(camp.short)} alumni, employed.</h1>
          <p>Company, headcount, position. The briefing you would have built in Excel over a month. Named people are metered.</p>
        </div>
        <div class="chips">
          <button class="chip ${state.workMode === "companies" ? "on" : ""}" type="button" data-action="work-companies">Companies</button>
          <button class="chip ${state.workMode === "positions" ? "on" : ""}" type="button" data-action="work-positions">Positions</button>
        </div>
      </div>
      <div class="graph-well">
        <aside class="emp-col">
          <h3>${state.workMode === "positions" ? "Positions" : "Companies"} · ${state.workMode === "positions" ? graph.roleCount : graph.companyCount}</h3>
          <input class="emp-search" id="work-q" type="search" placeholder="${state.workMode === "positions" ? "Quality, SDE, FAE…" : "Denso, Bosch, Zoho…"}" value="${esc(state.workQuery)}">
          ${state.workMode === "positions"
            ? positions.map((p) => `
                <button class="emp-pos ${state.workRole === p.role && !state.workCompany ? "on" : ""}" type="button" data-position="${esc(p.role)}">
                  <div class="emp-pos-top"><b>${esc(p.role)}</b><span class="emp-n">${p.n}</span></div>
                  <small>${p.companies.length} companies</small>
                </button>
              `).join("")
            : companies.map((co) => `
                <button class="emp-co ${state.workCompany === co.name ? "on" : ""}" type="button" data-company="${esc(co.name)}">
                  <div class="emp-co-top"><b>${window.logoHTML(co.name, "tiny")} ${esc(co.name)}</b><span class="emp-n">${co.n}</span></div>
                  <div class="emp-spark">${co.roles.map(([, n]) => `<i style="width:${Math.max(8, Math.round((n / co.n) * 100))}%"></i>`).join("")}</div>
                  <small>${co.roles.slice(0, 3).map((r) => r[0].replace(" Engineer", "")).join(" · ")}</small>
                </button>
              `).join("")}
        </aside>
        <section class="emp-stage">${stage}</section>
        <aside class="emp-col">
          <h3>${rosterLabel || "Roster"}</h3>
          ${roster.length ? `
            ${rosterLocked ? `<div class="lock-note">Faded until you request to see</div>` : `<div class="lock-note">Request granted · ${roster.length} people</div>`}
            <div class="${rosterLocked ? "roster-locked" : ""}">
              ${roster.map((p) => `
                <div class="roster-card">
                  <span class="person-chip ${rosterLocked ? "faded" : ""}"><i>${esc(window.personInitials(p.name))}</i></span>
                  <div>
                    <b>${rosterLocked ? esc(p.name.split(" ")[0][0]) + "· " + esc(p.name.split(" ").slice(-1)[0][0]) + "." : esc(p.name)}</b>
                    <span>${p.year} ${esc(p.dept)} · ${esc(p.city)}${p.hiring && !rosterLocked ? " · can hire" : ""}</span>
                  </div>
                </div>
              `).join("")}
            </div>
            ${rosterLocked ? `<button class="btn btn-pulse" type="button" data-open-role="${esc(state.workRole || "")}" ${state.workCompany ? `data-company="${esc(state.workCompany)}"` : ""}>Request to see</button>` : ""}
          ` : `<p class="lede">Pick a company, then a position. You will see that people are there. Names wait on a request.</p>`}
        </aside>
      </div>
    `;
  }

  function requestOverlay() {
    if (state.overlay !== "request" || !state.pendingRequest) return "";
    const camp = college();
    const { company, role } = state.pendingRequest;
    const graph = employment();
    const co = graph.companies.find((item) => item.name === company);
    const people = (co?.people || []).filter((p) => p.role === role).slice(0, 6);
    return `
      <div class="overlay">
        <div class="request-card" role="dialog" aria-labelledby="req-title">
          ${window.logoHTML(company, "live")}
          <h3 id="req-title">Request to see ${esc(role)} at ${esc(company)}</h3>
          <p>The office can see that these ${esc(camp.short)} alumni exist. Names stay faded until you send this request. It uses 1 of ${state.looks} remaining today.</p>
          <div class="request-preview">
            ${people.map((p) => `
              <span class="person-chip faded"><i>${esc(window.personInitials(p.name))}</i>${esc(p.name.split(" ")[0][0])}·</span>
            `).join("")}
          </div>
          <div class="cta-row" style="margin:0">
            <button class="btn btn-pulse" type="button" data-action="send-request" style="width:auto">Send request</button>
            <button class="btn btn-ghost" type="button" data-action="close-overlay">Keep faded</button>
          </div>
        </div>
      </div>
    `;
  }

  function emptyLooksOverlay() {
    if (state.overlay !== "empty") return "";
    const camp = college();
    return `
      <div class="overlay">
        <div class="empty-looks" role="dialog" aria-labelledby="empty-title">
          <div class="zero">0</div>
          <h2 id="empty-title">Names left today.</h2>
          <p>${esc(firstName())}, ${LOOKS_MAX} names refill at midnight IST. Live roles stay visible. An Ask may have an answer.</p>
          <div class="empty-log">
            ${(state.today.length ? state.today.map((item) => `${item.name} · ${item.company}${item.status === "asked" ? " · Asked" : item.status === "replied" ? " · Replied" : ""}`) : [`Day ${state.day} · ${esc(camp.short)}`]).map((line) => `<div>${esc(line)}</div>`).join("")}
          </div>
          <div class="cta-row" style="justify-content:center">
            <button class="btn btn-ink" type="button" data-action="close-overlay">See today</button>
            <button class="btn btn-ghost-dark" type="button" data-action="next-day">Next day (demo)</button>
          </div>
        </div>
      </div>
    `;
  }

  function inboxOverlay() {
    if (state.overlay !== "inbox") return "";
    return `
      <div class="overlay">
        <div class="request-card file-sheet" role="dialog">
          <div class="kicker">Inbox · stays after midnight</div>
          <h3>Asks and replies</h3>
          ${state.inbox.length ? `
            <div class="file-today">
              ${state.inbox.map((item) => `
                <button type="button" class="match-row" data-inspect-company="${esc(item.company)}" data-inspect-role="${esc(item.role)}" data-inspect-name="${esc(item.name)}">
                  ${window.logoHTML(item.company)}
                  <span>
                    <b>${esc(item.name)}</b>
                    <small>${esc(item.role)} · ${esc(item.company)} · ${item.status === "replied" ? "Replied" : item.status === "asked" ? "Waiting" : item.status}</small>
                    ${item.reply ? `<small>${esc(item.reply)}</small>` : ""}
                  </span>
                </button>
              `).join("")}
            </div>
          ` : `<p class="inspect-ok">Nothing yet. Ask someone on Pulse — replies land here, not on LinkedIn.</p>`}
          <div class="cta-row" style="margin:16px 0 0">
            <button class="btn btn-ghost" type="button" data-action="close-overlay">Close</button>
          </div>
        </div>
      </div>
    `;
  }

  function briefOverlay() {
    if (state.overlay !== "brief") return "";
    const person = inspectPerson();
    const company = state.inspectCompany;
    if (!person && !company) return "";
    const seat = person ? seatPattern(person) : null;
    return `
      <div class="overlay">
        <div class="request-card" role="dialog">
          <div class="kicker">Brief ${esc(seat ? `${seat.year} ${seat.branch}` : currentBatch(college()).year)} · you send it</div>
          <h3>Four lines for the batch</h3>
          <blockquote class="ask-note">${esc(person ? briefText(person) : briefCompany(company))}</blockquote>
          <p>2026 is still incomplete on Pulse. This brief is ${esc(seat ? seat.year : currentBatch(college()).year)}.</p>
          <div class="cta-row">
            <button class="btn btn-pulse" type="button" data-action="approve-brief" style="width:auto">Copy brief</button>
            <button class="btn btn-ghost" type="button" data-action="invite-students">Invite ${esc(seat ? seat.year : currentBatch(college()).year)} who match</button>
            <button class="btn btn-ghost" type="button" data-action="close-overlay">Keep</button>
          </div>
        </div>
      </div>
    `;
  }

  function fileOverlay() {
    if (state.overlay !== "file") return "";
    const camp = college();
    const coming = [
      ["Japan corridor", `${camp.japan} of yours are in Japan. A request, not a spreadsheet.`],
      ["Principal pack", "Four lines. You approve. Nothing sends itself."]
    ];
    const batch = currentBatch(camp);
    return `
      <div class="overlay">
        <div class="request-card file-sheet" role="dialog">
          <div class="kicker">Office file</div>
          <h3>${esc(camp.short)} · Day ${state.day}</h3>
          <p>${state.looks} name${state.looks === 1 ? "" : "s"} left among people on Pulse. Live LinkedIn roles stay open. Internships are a last Internshala snapshot — that feed is not live. ${batch.year} is the batch to brief.</p>
          ${state.today.length ? `
            <div class="file-today">
              ${state.today.map((item) => `
                <button type="button" class="match-row" data-inspect-company="${esc(item.company)}" data-inspect-role="${esc(item.role)}" data-inspect-name="${esc(item.name)}">
                  ${window.logoHTML(item.company)}
                  <span><b>${esc(item.name)}</b><small>${esc(item.role)} · ${esc(item.company)}${item.status === "asked" ? " · Asked" : item.status === "replied" ? " · Replied" : ""}</small></span>
                </button>
              `).join("")}
            </div>
          ` : `<p class="inspect-ok">No names opened today.</p>`}
          <div class="kicker" style="margin-top:22px">Optional later</div>
          <p class="inspect-ok">Alumni emails, if you have a list. Names appear when they join. Until then, counts stay.</p>
          <button class="btn btn-ghost" type="button" data-action="invite-alumni" style="width:auto;margin:8px 0 0">Invite alumni — paste list</button>
          <div class="kicker" style="margin-top:22px">Coming for this office</div>
          <div class="coming-list">
            ${coming.map(([title, detail]) => `
              <div class="coming-row">
                <b>${esc(title)}</b>
                <small>${esc(detail)}</small>
              </div>
            `).join("")}
          </div>
          <div class="cta-row" style="margin:16px 0 0">
            <button class="btn btn-pulse" type="button" data-action="next-day" style="width:auto">Next day (demo)</button>
            <button class="btn btn-ghost" type="button" data-action="close-overlay">Close</button>
          </div>
        </div>
      </div>
    `;
  }

  function viewCampus() {
    return `
      <div class="scene scene-night">
        <div class="wrap">
          ${chrome()}
          ${pulseBody()}
        </div>
        ${fileOverlay()}
        ${inboxOverlay()}
        ${briefOverlay()}
        ${inviteModal()}
        ${emptyLooksOverlay()}
        ${state.toast ? `<div class="toast">${esc(state.toast)}</div>` : ""}
      </div>
    `;
  }

  function bindLanding() {
    const q = document.getElementById("college-q");
    if (q) {
      q.addEventListener("input", (e) => {
        state.collegeQuery = e.target.value;
        state.searchOpen = true;
        render();
        const again = document.getElementById("college-q");
        if (again) {
          again.focus();
          again.setSelectionRange(state.collegeQuery.length, state.collegeQuery.length);
        }
      });
      q.addEventListener("focus", () => {
        if (state.searchOpen) return;
        state.searchOpen = true;
        render();
        document.getElementById("college-q")?.focus();
      });
    }
  }

  function runScan() {
    const camp = college();
    const people = radarPeople(camp);
    const countEl = document.getElementById("count-num");
    const lineEl = document.getElementById("scan-line");
    const peopleCol = document.getElementById("people-col");
    const personNodes = [...document.querySelectorAll(".radar-person")];
    const dockItems = [...document.querySelectorAll(".dock-item")];

    function finishGhost() {
      personNodes.forEach((el) => {
        el.classList.add("pop");
        el.classList.add("ghost");
      });
      dockItems.forEach((el) => {
        el.classList.add("on");
        el.classList.add("settled");
      });
      if (countEl) countEl.textContent = camp.alumni.toLocaleString("en-IN");
      if (lineEl) lineEl.textContent = `${camp.alumni} on the graph — hover a point or a mark`;
    }

    if (reduceMotion) {
      finishGhost();
      if (!holdScan) later(() => go("campus", { tab: "pulse" }), 2200);
      return;
    }

    const lines = [
      [300, "Opening Pulse records"],
      [900, `Matching ${camp.short} against education history`],
      [1800, "People populating the graph"],
      [2800, "Employer marks arriving — hover to read"],
      [4200, "Japan corridor found"],
      [5400, "Fading to what the office is allowed to see"]
    ];
    lines.forEach(([ms, text]) => later(() => { if (lineEl) lineEl.textContent = text; }, ms));

    personNodes.forEach((el, i) => {
      later(() => el.classList.add("pop"), 480 + i * 85);
      later(() => el.classList.add("ghost"), 2100 + i * 85);
    });

    people.slice(0, 10).forEach((person, i) => {
      later(() => {
        const stamp = document.createElement("div");
        stamp.className = "stamp person-stamp";
        stamp.innerHTML = `<span class="person-chip"><i>${esc(window.personInitials(person.name))}</i><b>${esc(person.name)}</b></span><small>${esc(person.role)} · ${esc(person.company)}</small>`;
        peopleCol?.appendChild(stamp);
        later(() => stamp.classList.add("fading"), 1100);
      }, 600 + i * 220);
    });

    dockItems.forEach((el, i) => {
      later(() => el.classList.add("on"), 900 + i * 120);
      later(() => el.classList.add("settled"), 2000 + i * 120);
    });

    const duration = 5600;
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      if (countEl) countEl.textContent = Math.round(camp.alumni * eased).toLocaleString("en-IN");
      if (t < 1 && state.scene === "scan") requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    later(finishGhost, 6200);
    if (!holdScan) later(() => go("campus", { tab: "pulse" }), 7200);
  }

  function showToast(message) {
    state.toast = message;
    render();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      state.toast = "";
      render();
    }, 2800);
  }

  function bindCampus() {
    const claimName = document.getElementById("claim-name");
    const claimEmail = document.getElementById("claim-email");
    const claimRole = document.getElementById("claim-role");
    const claimForm = document.getElementById("claim-form");
    const syncClaim = () => {
      const btn = claimForm?.querySelector("button[type=submit]");
      if (btn) btn.disabled = !canClaim();
    };
    claimName?.addEventListener("input", (e) => {
      state.profile.name = e.target.value;
      persist();
      syncClaim();
    });
    claimEmail?.addEventListener("input", (e) => {
      state.profile.email = e.target.value;
      persist();
      syncClaim();
    });
    claimRole?.addEventListener("change", (e) => {
      state.profile.role = e.target.value;
      persist();
    });
    claimForm?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!canClaim()) return;
      state.claimStep = "verify";
      persist();
      render();
      runClaimVerify();
    });
    if (state.claimStep === "form") {
      const focusEl = !state.profile.name.trim() ? claimName : claimEmail;
      focusEl?.focus();
    }
    const paste = document.getElementById("invite-paste");
    paste?.addEventListener("input", (e) => {
      state.invitePaste = e.target.value;
    });
    document.getElementById("job-q")?.addEventListener("input", (e) => {
      state.jobQuery = e.target.value;
      persist();
      render();
      const again = document.getElementById("job-q");
      if (again) {
        again.focus();
        again.setSelectionRange(state.jobQuery.length, state.jobQuery.length);
      }
    });
    document.getElementById("work-q")?.addEventListener("input", (e) => {
      state.workQuery = e.target.value;
      persist();
      render();
      const again = document.getElementById("work-q");
      if (again) {
        again.focus();
        again.setSelectionRange(state.workQuery.length, state.workQuery.length);
      }
    });
    document.getElementById("ask-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = (document.getElementById("ask-q")?.value || "").trim();
      state.askQuery = q;
      if (!q) return;
      const hit = routeAsk(q);
      state.askSaid = hit.say;
      persist();
      if (hit.action) {
        tMission(hit.action, hit.company);
        return;
      }
      if (hit.tab) {
        state.tab = hit.tab;
        if (hit.company) {
          state.workCompany = hit.company;
          state.workRole = null;
        }
        persist();
        render();
        return;
      }
      render();
    });
  }

  function tMission(action, company) {
    const fake = { dataset: { action, company: company || "" } };
    const map = {
      "mission-japan": () => {
        completeMission("japan-hire");
        const person = japanHireCut();
        if (person) {
          state.pendingRequest = { company: person.company, role: person.role };
          state.overlay = "request";
        }
        render();
      },
      "mission-dense": () => {
        completeMission("densest");
        const co = employment().companies.find((item) => item.name === company) || densestCompany();
        if (co) {
          state.workCompany = co.name;
          state.pendingRequest = { company: co.name, role: co.roles[0][0] };
          state.overlay = "request";
        }
        render();
      },
      "mission-match": () => {
        completeMission("match");
        state.overlay = "match";
        render();
      },
      "mission-draft": () => {
        state.overlay = "draft";
        render();
      }
    };
    (map[action] || (() => render()))();
    void fake;
  }

  function routeAsk(q) {
    const s = q.toLowerCase();
    const camp = college();
    const graph = employment();
    const named = graph.companies.find((co) => s.includes(co.name.toLowerCase()));
    if (/japan/.test(s)) return { say: `${camp.japan} alumni in Japan. Play the Japan cut — request, don’t export a sheet.`, action: "mission-japan" };
    if (named) return { say: `${named.n} at ${named.name}. Positions are free. Names stay faded until you request.`, action: "mission-dense", company: named.name };
    if (/where|work|who sits|employed/.test(s)) return { say: `${graph.companies[0].name} is densest. That’s the warm path.`, action: "mission-dense" };
    if (/2027|student|batch|invite|video/.test(s)) return { say: "2027 is the hole in the graph. Invite is the move.", tab: "students" };
    if (/principal|dean|brief|four lines/.test(s)) return { say: "I drafted four lines. You approve. Nothing sends itself.", action: "mission-draft" };
    if (/job|market|hiring drive/.test(s)) return { say: "Market is live. Filter to jobs where alumni already work.", tab: "market" };
    if (/hire|hiring manager|can hire/.test(s)) return { say: `${camp.hiringManagers} in hiring or lead roles. Request one roster.`, action: "mission-japan" };
    if (/match|mechanical|warm/.test(s)) return { say: "Matching 2027 to companies they already staff — not a job board.", action: "mission-match" };
    return { say: "I can unblur a roster, match 2027 to alumni seats, or draft the principal. Play a card or say Bosch, Japan, 2027." };
  }

  function onClick(event) {
    if (event.target.classList.contains("overlay")) {
      if (state.overlay === "empty") return;
      state.overlay = null;
      render();
      return;
    }
    const t = event.target.closest("[data-action], [data-pick], [data-tab], [data-type], [data-stream], [data-toggle], [data-job], [data-company], [data-position], [data-open-role], [data-request-company], [data-inspect-company]");
    if (!t) return;

    if (t.dataset.pick) {
      state.collegeId = t.dataset.pick;
      state.collegeQuery = college().short;
      state.searchOpen = false;
      state.scene = "campus";
      state.inspectCompany = null;
      state.inspectName = null;
      state.inspectRole = null;
      state.claimStep = null;
      state.askOpen = false;
      seedCampusPulse();
      persist();
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (t.dataset.tab) {
      state.tab = t.dataset.tab;
      state.openJob = null;
      if (t.dataset.tab === "market") markSeen("market");
      if (t.dataset.tab === "students") markSeen("students");
      if (t.dataset.tab === "work") markSeen("work");
      persist();
      render();
      window.scrollTo(0, 0);
      return;
    }
    if (t.dataset.type) {
      state.typeId = state.typeId === t.dataset.type ? null : t.dataset.type;
      persist();
      render();
      return;
    }
    if (t.dataset.stream) {
      state.jobStream = t.dataset.stream;
      state.openJob = null;
      persist();
      render();
      return;
    }
    if (t.dataset.toggle === "japan") {
      state.japanOnly = !state.japanOnly;
      persist();
      render();
      return;
    }
    if (t.dataset.toggle === "alumni") {
      state.alumniOnly = !state.alumniOnly;
      persist();
      render();
      return;
    }
    if (t.dataset.job) {
      if (!state.claimed) return;
      const job = DATA.jobs.find((item) => item.id === t.dataset.job);
      if (job) state.jobCompany = job.company;
      state.jobsOpen = true;
      state.inspectCompany = null;
      state.askOpen = false;
      persist();
      render();
      return;
    }
    if (t.dataset.inspectCompany) {
      if (state.scene !== "campus") return;
      state.overlay = null;
      state.askOpen = false;
      state.jobsOpen = false;
      if (
        !t.dataset.inspectName
        && state.inspectCompany === t.dataset.inspectCompany
        && !state.claimStep
        && !state.askOpen
      ) {
        state.inspectCompany = null;
        state.inspectName = null;
        state.inspectRole = null;
        persist();
        render();
        return;
      }
      const current = inspectPerson();
      if (
        current
        && t.dataset.inspectName
        && current.company === t.dataset.inspectCompany
        && current.role === t.dataset.inspectRole
        && current.name === t.dataset.inspectName
        && !state.claimStep
      ) {
        state.inspectCompany = null;
        persist();
        render();
        return;
      }
      openInspect(t.dataset.inspectCompany, t.dataset.inspectRole, t.dataset.inspectName);
      return;
    }
    if (t.dataset.requestCompany) {
      if (state.scene !== "campus") return;
      const company = t.dataset.requestCompany;
      const role = t.dataset.requestRole;
      if (!role) {
        state.workCompany = company;
        state.workRole = null;
        state.tab = "work";
        markSeen("work");
        persist();
        render();
        window.scrollTo(0, 0);
        return;
      }
      if (isUnlocked(company, role)) {
        state.workCompany = company;
        state.workRole = role;
        state.tab = "work";
        markSeen("work");
        persist();
        render();
        return;
      }
      state.pendingRequest = { company, role };
      state.overlay = "request";
      render();
      return;
    }
    if (t.dataset.openRole) {
      const company = t.dataset.company || state.workCompany;
      const role = t.dataset.openRole;
      if (!company || !role) return;
      state.workCompany = company;
      state.workRole = role;
      if (isUnlocked(company, role)) {
        persist();
        render();
        return;
      }
      state.pendingRequest = { company, role };
      state.overlay = "request";
      persist();
      render();
      return;
    }
    if (t.dataset.company && !t.dataset.action && !t.dataset.openRole) {
      state.workCompany = t.dataset.company;
      state.workRole = null;
      state.workMode = "companies";
      persist();
      render();
      return;
    }
    if (t.dataset.position) {
      state.workRole = t.dataset.position;
      state.workCompany = null;
      state.workMode = "positions";
      persist();
      render();
      return;
    }

    switch (t.dataset.action) {
      case "claim":
        if (!college()) return;
        state.scene = "campus";
        persist();
        render();
        break;
      case "open-graph":
        go("scan");
        break;
      case "skip-verify":
        go("welcome");
        break;
      case "skip":
        go("campus", { tab: "pulse" });
        break;
      case "close-inspect":
        state.inspectCompany = null;
        state.inspectName = null;
        state.inspectRole = null;
        state.claimStep = null;
        state.askOpen = false;
        persist();
        render();
        break;
      case "inspect-next":
        inspectStep(1);
        break;
      case "inspect-prev":
        inspectStep(-1);
        break;
      case "inspect-jump": {
        const idx = Number(t.dataset.index);
        const list = pulsePeople(state.inspectCompany);
        if (!Number.isFinite(idx) || !list.length) break;
        state.inspectIndex = Math.max(0, Math.min(list.length - 1, idx));
        const jumped = list[state.inspectIndex];
        state.inspectName = jumped.name;
        state.inspectRole = jumped.role;
        persist();
        render();
        break;
      }
      case "reveal-inspect": {
        const person = inspectPerson();
        if (!person) break;
        if (isPersonOpen(person)) break;
        if (!state.claimed) {
          state.claimStep = "form";
          persist();
          render();
          break;
        }
        if (!demandPersonLook(person)) break;
        state.askOpen = true;
        persist();
        render();
        break;
      }
      case "submit-claim":
        if (!canClaim()) break;
        state.claimStep = "verify";
        persist();
        render();
        runClaimVerify();
        break;
      case "skip-claim-verify":
        finishClaim();
        break;
      case "open-ask": {
        const person = inspectPerson();
        if (!person || !isPersonOpen(person)) break;
        state.askOpen = true;
        persist();
        render();
        break;
      }
      case "close-ask":
        state.askOpen = false;
        persist();
        render();
        break;
      case "send-ask": {
        const person = inspectPerson();
        if (!person || !isPersonOpen(person)) break;
        rememberToday(person);
        markAsked(person);
        state.askOpen = false;
        persist();
        showToast("Pulse will deliver this. They choose whether to answer.");
        break;
      }
      case "open-linkedin": {
        const person = inspectPerson();
        if (!person || !isPersonOpen(person)) break;
        const q = encodeURIComponent(`${person.name} ${person.company}`);
        window.open(`https://www.linkedin.com/search/results/people/?keywords=${q}`, "_blank", "noopener");
        break;
      }
      case "open-file":
        if (!state.claimed) break;
        state.overlay = "file";
        render();
        break;
      case "open-jobs":
        if (!state.claimed) break;
        state.overlay = null;
        state.jobsOpen = true;
        state.inspectCompany = null;
        state.askOpen = false;
        persist();
        render();
        break;
      case "close-jobs":
        state.jobsOpen = false;
        persist();
        render();
        break;
      case "jobs-at": {
        if (!state.claimed) break;
        const co = t.dataset.company;
        if (!co) break;
        state.jobCompany = co;
        state.japanOnly = false;
        state.jobsOpen = true;
        state.inspectCompany = null;
        state.askOpen = false;
        state.overlay = null;
        persist();
        render();
        break;
      }
      case "clear-job-company":
        state.jobCompany = null;
        persist();
        render();
        break;
      case "next-day":
        if (!state.claimed) break;
        nextDay();
        break;
      case "clear-college":
        state.collegeId = null;
        state.collegeQuery = "";
        persist();
        render();
        break;
      case "clear-type":
        state.typeId = null;
        persist();
        render();
        break;
      case "to-market":
        state.tab = "market";
        markSeen("market");
        persist();
        render();
        window.scrollTo(0, 0);
        break;
      case "to-alumni":
        state.tab = "alumni";
        persist();
        render();
        window.scrollTo(0, 0);
        break;
      case "to-work":
        state.tab = "work";
        markSeen("work");
        persist();
        render();
        window.scrollTo(0, 0);
        break;
      case "work-companies":
        state.workMode = "companies";
        persist();
        render();
        break;
      case "work-positions":
        state.workMode = "positions";
        persist();
        render();
        break;
      case "restore-looks":
        state.looks = LOOKS_MAX;
        state.overlay = null;
        persist();
        showToast(`${LOOKS_MAX} names restored for this demo.`);
        break;
      case "open-brief":
        if (!inspectPerson() && !state.inspectCompany) break;
        state.overlay = "brief";
        render();
        break;
      case "approve-brief": {
        const person = inspectPerson();
        const text = person ? briefText(person) : (state.inspectCompany ? briefCompany(state.inspectCompany) : "");
        if (!text) break;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).catch(() => {});
        }
        state.overlay = null;
        showToast("Brief copied. You send it to the batch.");
        break;
      }
      case "open-inbox":
        if (!state.claimed) break;
        state.overlay = "inbox";
        render();
        break;
      case "send-request": {
        const pending = state.pendingRequest;
        state.overlay = null;
        state.pendingRequest = null;
        if (!pending) break;
        state.tab = "work";
        state.workCompany = pending.company;
        state.workRole = pending.role;
        markSeen("work");
        if (!demandLook(pending.company, pending.role)) break;
        persist();
        render();
        break;
      }
      case "mission-japan": {
        completeMission("japan-hire");
        const person = japanHireCut();
        if (person) {
          state.pendingRequest = { company: person.company, role: person.role };
          state.overlay = "request";
          render();
        } else {
          state.tab = "work";
          persist();
          render();
        }
        break;
      }
      case "mission-dense": {
        completeMission("densest");
        const name = t.dataset.company || densestCompany()?.name;
        const co = employment().companies.find((item) => item.name === name) || densestCompany();
        if (co) {
          state.workCompany = co.name;
          state.pendingRequest = { company: co.name, role: co.roles[0][0] };
          state.overlay = "request";
          render();
        }
        break;
      }
      case "mission-match":
        completeMission("match");
        state.overlay = "match";
        render();
        break;
      case "mission-draft":
        state.overlay = "draft";
        render();
        break;
      case "approve-draft":
        completeMission("draft");
        state.overlay = "principal";
        markSeen("principal");
        render();
        break;
      case "mission-market":
        completeMission("market-warm");
        state.tab = "market";
        state.alumniOnly = true;
        markSeen("market");
        persist();
        render();
        window.scrollTo(0, 0);
        break;
      case "fuel":
        if (state.looks <= 0) {
          state.overlay = "empty";
          render();
        } else {
          showToast(`${state.looks} request${state.looks === 1 ? "" : "s"} left today. The faded graph is free.`);
        }
        break;
      case "to-students":
        state.tab = "students";
        markSeen("students");
        persist();
        render();
        window.scrollTo(0, 0);
        break;
      case "invite-alumni":
        if (!state.claimed) break;
        state.overlay = "invite";
        state.inviteKind = "alumni";
        render();
        break;
      case "invite-students":
        if (!state.claimed) {
          state.pendingInvite = true;
          state.claimStep = "form";
          persist();
          render();
          break;
        }
        completeMission("invite");
        state.overlay = "invite";
        state.inviteKind = "students";
        render();
        break;
      case "close-overlay":
        state.overlay = null;
        render();
        break;
      case "send-invites":
        if (state.inviteKind === "students") markSeen("inviteStudents");
        else markSeen("inviteAlumni");
        state.overlay = null;
        persist();
        showToast(state.inviteKind === "students"
          ? "2027 invites queued from the placement office."
          : "Alumni invites queued. Names show when they join — not today. Counts stay.");
        break;
      case "principal":
        state.overlay = "principal";
        markSeen("principal");
        render();
        break;
      case "print":
        window.print();
        break;
      case "reset":
        resetDemo();
        break;
      default:
        break;
    }
  }

  function render() {
    const root = document.getElementById("app");
    if (["verify", "welcome", "scan"].includes(state.scene) && college()) {
      state.scene = "campus";
    }
    if (state.scene === "campus" && college()) {
      root.innerHTML = viewCampus();
      bindCampus();
      return;
    }
    state.scene = "landing";
    root.innerHTML = viewLanding();
    bindLanding();
  }

  document.addEventListener("click", onClick);
  document.addEventListener("keydown", (e) => {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (state.scene === "campus" && state.inspectCompany && !state.overlay) {
      if (e.key === "ArrowRight" && !state.claimStep && !state.askOpen) {
        e.preventDefault();
        inspectStep(1);
        return;
      }
      if (e.key === "ArrowLeft" && !state.claimStep && !state.askOpen) {
        e.preventDefault();
        inspectStep(-1);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const person = inspectPerson();
        if (!person || state.claimStep === "verify") return;
        if (state.askOpen) {
          rememberToday(person);
          markAsked(person);
          state.askOpen = false;
          persist();
          showToast("Pulse will deliver this. They choose whether to answer.");
          return;
        }
        if (!isPersonOpen(person)) {
          if (!state.claimed) {
            state.claimStep = "form";
            persist();
            render();
            return;
          }
          if (!demandPersonLook(person)) return;
          persist();
          render();
        }
        return;
      }
    }
    if (e.key === "Escape") {
      state.searchOpen = false;
      if (state.askOpen) {
        state.askOpen = false;
        persist();
        render();
        return;
      }
      if (state.claimStep) {
        state.claimStep = null;
        persist();
        render();
        return;
      }
      if (state.overlay) {
        state.overlay = null;
        persist();
        render();
        return;
      }
      if (state.jobsOpen) {
        state.jobsOpen = false;
        persist();
        render();
        return;
      }
      if (state.inspectCompany) {
        state.inspectCompany = null;
        state.inspectName = null;
        state.inspectRole = null;
      }
      persist();
      render();
    }
  });

  render();
})();
