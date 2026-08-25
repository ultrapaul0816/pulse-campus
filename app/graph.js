window.buildEmployment = function (camp) {
  const JAPAN = new Set(["Tokyo", "Yokohama", "Osaka", "Kobe", "Nagoya"]);
  const NAMES = [
    "Priya N.", "Suresh K.", "Ishita D.", "Rahul V.", "Anjali M.", "Kiran P.",
    "Deepa S.", "Nikhil R.", "Shreya L.", "Amit T.", "Lavanya G.", "Varun B.",
    "Neelima C.", "Harsh A.", "Pooja I.", "Siddharth J.", "Kavya U.", "Manoj E.",
    "Ritika H.", "Abhinav W.", "Sowmya F.", "Pranav Q.", "Tanvi Z.", "Gokul Y.",
    "Meenakshi X.", "Aravind O.", "Bhavana D.", "Yash N.", "Snehal K.", "Irfan S."
  ];
  const ROLE_BOOK = {
    "japan-mfg": [
      ["Production Engineer", 0.30],
      ["Design Engineer", 0.24],
      ["Quality Engineer", 0.18],
      ["Application Engineer", 0.16],
      ["Plant Engineer", 0.12]
    ],
    auto: [
      ["Quality Engineer", 0.28],
      ["Production Engineer", 0.24],
      ["CAE Engineer", 0.18],
      ["Embedded Engineer", 0.16],
      ["Powertrain Engineer", 0.14]
    ],
    semi: [
      ["Field Application Engineer", 0.26],
      ["Validation Engineer", 0.22],
      ["Analog Design Engineer", 0.20],
      ["SoC Design Engineer", 0.18],
      ["Test Engineer", 0.14]
    ],
    core: [
      ["Project Engineer", 0.26],
      ["Electrical Design Engineer", 0.22],
      ["Site Engineer", 0.20],
      ["Engineering Manager", 0.16],
      ["Mechanical Design Engineer", 0.16]
    ],
    energy: [
      ["Process Engineer", 0.36],
      ["Controls Engineer", 0.28],
      ["Reliability Engineer", 0.20],
      ["Operations Engineer", 0.16]
    ],
    it: [
      ["Software Engineer", 0.34],
      ["Backend Engineer", 0.22],
      ["Data Analyst", 0.18],
      ["SDE", 0.16],
      ["QA Engineer", 0.10]
    ],
    startup: [
      ["Software Engineer", 0.32],
      ["Backend Engineer", 0.24],
      ["Product Engineer", 0.22],
      ["SDE", 0.22]
    ]
  };

  function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function splitRoles(type, n) {
    const book = ROLE_BOOK[type] || ROLE_BOOK.it;
    let left = n;
    return book.map((row, i) => {
      if (i === book.length - 1) return [row[0], Math.max(0, left)];
      const c = Math.max(i === 0 ? 1 : 0, Math.round(n * row[1]));
      const use = Math.min(c, left);
      left -= use;
      return [row[0], use];
    }).filter((row) => row[1] > 0);
  }

  function makePeople(company, type, role, count) {
    const named = (camp.people || []).filter((p) => p.company === company && p.role === role);
    const out = named.map((p) => ({ ...p, key: `${company}|${role}|${p.name}` }));
    const depts = camp.departments;
    const cities = type === "japan-mfg"
      ? camp.cities
      : camp.cities.filter((c) => !JAPAN.has(c)).concat(camp.cities);
    for (let i = out.length; i < count; i += 1) {
      const seed = `${camp.id}|${company}|${role}|${i}`;
      const h = hash(seed);
      const dept = depts[h % depts.length][0];
      const city = cities[h % cities.length];
      const year = 2016 + (h % 9);
      out.push({
        name: NAMES[(h + i * 7) % NAMES.length],
        year,
        dept,
        role,
        company,
        city,
        type,
        hiring: h % 7 === 0,
        key: `${company}|${role}|${i}`
      });
    }
    return out;
  }

  const companies = [];
  Object.entries(camp.companies).forEach(([type, list]) => {
    list.forEach(([name, n]) => {
      const roles = splitRoles(type, n);
      const people = [];
      roles.forEach(([role, count]) => {
        people.push(...makePeople(name, type, role, count));
      });
      companies.push({
        name,
        type,
        n,
        roles,
        people,
        japan: type === "japan-mfg" || people.some((p) => JAPAN.has(p.city))
      });
    });
  });
  companies.sort((a, b) => b.n - a.n);

  const posMap = {};
  companies.forEach((co) => {
    co.roles.forEach(([role, c]) => {
      if (!posMap[role]) posMap[role] = { role, n: 0, companies: [] };
      posMap[role].n += c;
      posMap[role].companies.push({ name: co.name, n: c, type: co.type, japan: co.japan });
    });
  });
  const positions = Object.values(posMap).sort((a, b) => b.n - a.n);

  return {
    companies,
    positions,
    companyCount: companies.length,
    roleCount: positions.length,
    japanPeople: companies.reduce((sum, co) => sum + co.people.filter((p) => JAPAN.has(p.city)).length, 0)
  };
};

window.COMPANY_DOMAINS = {
  Denso: "denso.com",
  Bosch: "bosch.com",
  "Mitsubishi Electric": "mitsubishielectric.com",
  Amada: "amada.co.jp",
  Daikin: "daikin.com",
  "DMG Mori": "dmgmori.com",
  "Tata Motors": "tatamotors.com",
  Mahindra: "mahindra.com",
  "TVS Motor": "tvsmotor.com",
  "Texas Instruments": "ti.com",
  Qualcomm: "qualcomm.com",
  "Tata Electronics": "tataelectronics.com",
  "Samsung Semiconductor": "samsung.com",
  "Samsung R&D": "samsung.com",
  "L&T": "larsentoubro.com",
  "L&T Construction": "larsentoubro.com",
  Siemens: "siemens.com",
  ABB: "abb.com",
  Thermax: "thermaxglobal.com",
  Reliance: "ril.com",
  Honeywell: "honeywell.com",
  IOCL: "iocl.com",
  Zoho: "zoho.com",
  Infosys: "infosys.com",
  TCS: "tcs.com",
  Freshworks: "freshworks.com",
  Razorpay: "razorpay.com",
  PhonePe: "phonepe.com",
  Wipro: "wipro.com",
  Cognizant: "cognizant.com",
  Google: "google.com",
  Microsoft: "microsoft.com",
  Amazon: "amazon.com",
  Nvidia: "nvidia.com",
  Intel: "intel.com",
  AMD: "amd.com",
  "SAP Labs": "sap.com",
  Oracle: "oracle.com",
  Adobe: "adobe.com",
  Cisco: "cisco.com",
  Intuit: "intuit.com",
  Fanuc: "fanuc.com",
  Nissan: "nissan-global.com",
  Hyundai: "hyundai.com",
  "Ashok Leyland": "ashokleyland.com",
  "Maruti Suzuki": "marutisuzuki.com",
  "Hero MotoCorp": "heromotocorp.com",
  "Toyota Industries": "toyota-industries.com",
  "Toyota Kirloskar": "toyotabharat.com",
  "Honda Cars": "honda.com",
  Panasonic: "panasonic.com",
  Toshiba: "toshiba.com",
  Sony: "sony.com",
  NXP: "nxp.com",
  Micron: "micron.com",
  "Schneider Electric": "se.com",
  Shell: "shell.com",
  PayPal: "paypal.com",
  Dell: "dell.com",
  Swiggy: "swiggy.com",
  "Ather Energy": "atherenergy.com",
  Groww: "groww.in",
  CRED: "cred.club",
  Meesho: "meesho.com",
  Unacademy: "unacademy.com",
  Persistent: "persistent.com",
  Chargebee: "chargebee.com",
  Yamaha: "yamaha-motor.com",
  YKK: "ykk.com",
  "Bajaj Auto": "bajajauto.com",
  "Force Motors": "forcemotors.com",
  Kirloskar: "kirloskar.com",
  "Lakshmi Machine Works": "lmw.co.in",
  "Mercedes-Benz R&D": "mercedes-benz.com",
  "GE Vernova": "gevernova.com",
  NTPC: "ntpc.co.in",
  Adani: "adani.com",
  FLSmidth: "flsmidth.com",
  "Cummins Electronics": "cummins.com",
  "Bharat Forge": "bharatforge.com",
  Suzlon: "suzlon.com",
  "Jio Platforms": "jio.com",
  Akamai: "akamai.com",
  Ricoh: "ricoh.com",
  "Mitsubishi Heavy": "mhi.com",
  Slice: "sliceit.com",
  "PhysicsWallah": "pw.live",
  CESC: "cesc.co.in",
  Crompton: "crompton.co.in",
  CPCL: "cpcl.co.in",
  "Robert Bosch Energy": "bosch.com",
  "Amrita Technologies": "amrita.edu",
  PWC: "pwc.com",
  ShareChat: "sharechat.com"
};

window.logoSrc = function (domain) {
  const path = String(location.pathname || "").replace(/index\.html$/, "");
  const inApp = /\/app\/?$/.test(path);
  return (inApp ? "./logos/" : "./app/logos/") + domain + ".png";
};

window.companyMark = function (name) {
  const domain = window.COMPANY_DOMAINS[name] || (name.toLowerCase().replace(/[^a-z0-9]+/g, "") + ".com");
  const initials = name.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  let h = 0;
  for (let i = 0; i < name.length; i += 1) h = (h * 31 + name.charCodeAt(i)) | 0;
  const palette = ["#c4452d", "#0f6f7c", "#1f4e79", "#8a5a12", "#2f6b4f", "#5b2d8c", "#8b1e3f", "#0b4f6c"];
  return { domain, initials, bg: palette[Math.abs(h) % palette.length], src: window.logoSrc(domain) };
};

window.logoHTML = function (name, extraClass) {
  const mark = window.companyMark(name);
  const safe = String(name).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const domain = mark.domain;
  return `<span class="co-logo ${extraClass || ""}" title="${safe}">
    <em style="background:${mark.bg}">${mark.initials}</em>
    <img alt="" src="${mark.src}" data-domain="${domain}" decoding="async" onload="if(this.naturalWidth&amp;&amp;this.naturalWidth&lt;24){this.onerror();}else{this.parentNode.classList.add('has-img');}" onerror="var b=this.parentNode;if(!this.dataset.fb){this.dataset.fb=1;this.src='https://www.google.com/s2/favicons?sz=128&amp;domain='+this.dataset.domain;}else{this.remove();b.classList.remove('has-img');}">
  </span>`;
};

window.personInitials = function (name) {
  return String(name || "")
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .replace(/\./g, "")
    .slice(0, 2)
    .toUpperCase();
};
