window.PULSE_CAMPUS = {
  demoNote: "Demo counts for this mock. Live Pulse replaces these.",
  companyTypes: [
    {
      id: "japan-mfg",
      name: "Japanese manufacturing",
      blurb: "Capital equipment, auto-ancillary, HVAC, factory electronics — Cognavi's core corridor.",
      accent: "japan"
    },
    {
      id: "auto",
      name: "Automotive",
      blurb: "OEMs and tier-1s hiring mechanical, production, quality, and embedded.",
      accent: "brass"
    },
    {
      id: "semi",
      name: "Semiconductor & electronics",
      blurb: "Design, FAE, test, and packaging roles sitting on ECE/EEE batches.",
      accent: "pulse"
    },
    {
      id: "core",
      name: "Core engineering",
      blurb: "EPC, heavy engineering, electrical, and industrial automation.",
      accent: "slate"
    },
    {
      id: "energy",
      name: "Energy & process",
      blurb: "Refining, power, chemicals, and process control.",
      accent: "ink"
    },
    {
      id: "it",
      name: "IT product & services",
      blurb: "Product companies and services firms absorbing CSE and adjacent branches.",
      accent: "pulse"
    },
    {
      id: "startup",
      name: "Startups & product",
      blurb: "Early teams where alumni often become the hiring node later.",
      accent: "brass"
    }
  ],
  colleges: [
    {
      id: "nitt",
      name: "National Institute of Technology, Tiruchirappalli",
      short: "NIT Trichy",
      city: "Tiruchirappalli",
      nirf: 9,
      alumni: 412,
      japan: 18,
      hiringManagers: 27,
      batches: "2016–2025",
      departments: [
        ["Mechanical", 29],
        ["CSE", 24],
        ["ECE", 21],
        ["EEE", 11],
        ["Civil", 8],
        ["Other", 7]
      ],
      mix: [
        ["japan-mfg", 16],
        ["auto", 18],
        ["semi", 14],
        ["core", 17],
        ["energy", 9],
        ["it", 20],
        ["startup", 6]
      ],
      cities: ["Bengaluru", "Chennai", "Pune", "Hyderabad", "Tokyo", "Yokohama", "Coimbatore"],
      companies: {
        "japan-mfg": [
          ["Denso", 14],
          ["Mitsubishi Electric", 9],
          ["Amada", 6],
          ["Daikin", 5],
          ["DMG Mori", 4]
        ],
        auto: [
          ["Bosch", 16],
          ["Tata Motors", 11],
          ["Mahindra", 8],
          ["TVS Motor", 7]
        ],
        semi: [
          ["Texas Instruments", 12],
          ["Qualcomm", 8],
          ["Tata Electronics", 7],
          ["Samsung Semiconductor", 5]
        ],
        core: [
          ["L&T", 15],
          ["Siemens", 9],
          ["ABB", 7],
          ["Thermax", 5]
        ],
        energy: [
          ["Reliance", 8],
          ["Honeywell", 6],
          ["IOCL", 4]
        ],
        it: [
          ["Zoho", 13],
          ["Infosys", 18],
          ["TCS", 16],
          ["Freshworks", 7]
        ],
        startup: [
          ["Razorpay", 5],
          ["Slice", 3],
          ["Ather Energy", 4]
        ]
      },
      people: [
        { name: "Ananya R.", year: 2019, dept: "Mechanical", role: "Production Engineer", company: "Denso", city: "Bengaluru", type: "japan-mfg", hiring: true },
        { name: "Karthik S.", year: 2018, dept: "Mechanical", role: "Design Engineer", company: "Amada", city: "Pune", type: "japan-mfg", hiring: false },
        { name: "Meera P.", year: 2021, dept: "CSE", role: "Software Engineer", company: "Zoho", city: "Chennai", type: "it", hiring: false },
        { name: "Arjun N.", year: 2020, dept: "ECE", role: "Field Application Engineer", company: "Texas Instruments", city: "Bengaluru", type: "semi", hiring: true },
        { name: "Divya K.", year: 2017, dept: "EEE", role: "Engineering Manager", company: "Siemens", city: "Bengaluru", type: "core", hiring: true },
        { name: "Rohit V.", year: 2022, dept: "Mechanical", role: "Quality Engineer", company: "Bosch", city: "Nashik", type: "auto", hiring: false },
        { name: "Sana I.", year: 2019, dept: "CSE", role: "Backend Engineer", company: "Freshworks", city: "Hyderabad", type: "it", hiring: false },
        { name: "Harish M.", year: 2016, dept: "Mechanical", role: "Plant Engineer", company: "DMG Mori", city: "Yokohama", type: "japan-mfg", hiring: true }
      ]
    },
    {
      id: "vit",
      name: "Vellore Institute of Technology",
      short: "VIT Vellore",
      city: "Vellore",
      nirf: 11,
      alumni: 638,
      japan: 11,
      hiringManagers: 34,
      batches: "2015–2025",
      departments: [
        ["CSE", 38],
        ["ECE", 22],
        ["Mechanical", 16],
        ["IT", 12],
        ["EEE", 7],
        ["Other", 5]
      ],
      mix: [
        ["japan-mfg", 8],
        ["auto", 12],
        ["semi", 16],
        ["core", 10],
        ["energy", 5],
        ["it", 38],
        ["startup", 11]
      ],
      cities: ["Bengaluru", "Chennai", "Hyderabad", "Pune", "Noida", "Tokyo", "Coimbatore"],
      companies: {
        "japan-mfg": [
          ["Denso", 9],
          ["Daikin", 8],
          ["Mitsubishi Electric", 6],
          ["Toshiba", 4]
        ],
        auto: [
          ["Bosch", 14],
          ["Hyundai", 11],
          ["Ashok Leyland", 8]
        ],
        semi: [
          ["Qualcomm", 16],
          ["Samsung R&D", 14],
          ["Intel", 9],
          ["Micron", 7]
        ],
        core: [
          ["L&T", 12],
          ["Schneider Electric", 8],
          ["Siemens", 7]
        ],
        energy: [
          ["Adani", 6],
          ["Honeywell", 5]
        ],
        it: [
          ["TCS", 28],
          ["Infosys", 24],
          ["Zoho", 18],
          ["Wipro", 16],
          ["Cognizant", 14]
        ],
        startup: [
          ["Razorpay", 8],
          ["Freshworks", 9],
          ["PhonePe", 6]
        ]
      },
      people: [
        { name: "Nisha T.", year: 2020, dept: "CSE", role: "SDE-2", company: "PhonePe", city: "Bengaluru", type: "startup", hiring: true },
        { name: "Vignesh A.", year: 2018, dept: "ECE", role: "SoC Design Engineer", company: "Qualcomm", city: "Hyderabad", type: "semi", hiring: false },
        { name: "Priya S.", year: 2021, dept: "IT", role: "Product Engineer", company: "Zoho", city: "Chennai", type: "it", hiring: false },
        { name: "Aditya R.", year: 2017, dept: "Mechanical", role: "Manufacturing Engineer", company: "Denso", city: "Bengaluru", type: "japan-mfg", hiring: true },
        { name: "Keerthana L.", year: 2019, dept: "CSE", role: "Backend Engineer", company: "Freshworks", city: "Chennai", type: "startup", hiring: false },
        { name: "Mohammed F.", year: 2016, dept: "EEE", role: "Controls Engineer", company: "Daikin", city: "Osaka", type: "japan-mfg", hiring: false }
      ]
    },
    {
      id: "bits",
      name: "BITS Pilani",
      short: "BITS Pilani",
      city: "Pilani",
      nirf: 20,
      alumni: 291,
      japan: 9,
      hiringManagers: 22,
      batches: "2016–2025",
      departments: [
        ["CSE", 34],
        ["ECE", 20],
        ["Mechanical", 18],
        ["Chemical", 10],
        ["EEE", 9],
        ["Other", 9]
      ],
      mix: [
        ["japan-mfg", 9],
        ["auto", 11],
        ["semi", 18],
        ["core", 12],
        ["energy", 8],
        ["it", 28],
        ["startup", 14]
      ],
      cities: ["Bengaluru", "Hyderabad", "Mumbai", "Pune", "Tokyo", "Gurugram"],
      companies: {
        "japan-mfg": [
          ["Mitsubishi Electric", 7],
          ["Denso", 5],
          ["Fanuc", 4]
        ],
        auto: [
          ["Bosch", 9],
          ["Tata Motors", 6]
        ],
        semi: [
          ["Texas Instruments", 11],
          ["Qualcomm", 10],
          ["Nvidia", 8]
        ],
        core: [
          ["L&T", 8],
          ["Siemens", 6]
        ],
        energy: [
          ["Reliance", 7],
          ["Shell", 4]
        ],
        it: [
          ["Google", 9],
          ["Microsoft", 8],
          ["Amazon", 10],
          ["Zoho", 6]
        ],
        startup: [
          ["Razorpay", 7],
          ["Groww", 5],
          ["Meesho", 4]
        ]
      },
      people: [
        { name: "Ishaan D.", year: 2019, dept: "CSE", role: "Software Engineer", company: "Google", city: "Bengaluru", type: "it", hiring: false },
        { name: "Ritika M.", year: 2018, dept: "ECE", role: "Hardware Engineer", company: "Nvidia", city: "Bengaluru", type: "semi", hiring: true },
        { name: "Sahil K.", year: 2020, dept: "Mechanical", role: "Robotics Engineer", company: "Fanuc", city: "Hyderabad", type: "japan-mfg", hiring: false }
      ]
    },
    {
      id: "nitk",
      name: "National Institute of Technology Karnataka, Surathkal",
      short: "NITK Surathkal",
      city: "Mangaluru",
      nirf: 12,
      alumni: 356,
      japan: 14,
      hiringManagers: 19,
      batches: "2016–2025",
      departments: [
        ["CSE", 26],
        ["Mechanical", 24],
        ["ECE", 20],
        ["EEE", 12],
        ["Civil", 10],
        ["Other", 8]
      ],
      mix: [
        ["japan-mfg", 13],
        ["auto", 14],
        ["semi", 15],
        ["core", 16],
        ["energy", 8],
        ["it", 26],
        ["startup", 8]
      ],
      cities: ["Bengaluru", "Pune", "Hyderabad", "Chennai", "Tokyo", "Mangaluru"],
      companies: {
        "japan-mfg": [
          ["Denso", 10],
          ["Toyota Industries", 6],
          ["Mitsubishi Electric", 5]
        ],
        auto: [
          ["Bosch", 12],
          ["Mercedes-Benz R&D", 7],
          ["Tata Motors", 6]
        ],
        semi: [
          ["Texas Instruments", 9],
          ["AMD", 7],
          ["Tata Electronics", 6]
        ],
        core: [
          ["L&T", 11],
          ["ABB", 8]
        ],
        energy: [
          ["Shell", 5],
          ["Reliance", 5]
        ],
        it: [
          ["Infosys", 16],
          ["SAP Labs", 9],
          ["Oracle", 8]
        ],
        startup: [
          ["Ather Energy", 6],
          ["Razorpay", 4]
        ]
      },
      people: [
        { name: "Lakshmi P.", year: 2019, dept: "ECE", role: "Analog Design Engineer", company: "Texas Instruments", city: "Bengaluru", type: "semi", hiring: true },
        { name: "Nikhil B.", year: 2017, dept: "Mechanical", role: "Powertrain Engineer", company: "Toyota Industries", city: "Bengaluru", type: "japan-mfg", hiring: false }
      ]
    },
    {
      id: "coep",
      name: "College of Engineering Pune",
      short: "COEP Pune",
      city: "Pune",
      nirf: 73,
      alumni: 188,
      japan: 7,
      hiringManagers: 11,
      batches: "2017–2025",
      departments: [
        ["Mechanical", 32],
        ["CSE", 22],
        ["E&TC", 18],
        ["Electrical", 12],
        ["Civil", 10],
        ["Other", 6]
      ],
      mix: [
        ["japan-mfg", 12],
        ["auto", 24],
        ["semi", 8],
        ["core", 18],
        ["energy", 7],
        ["it", 24],
        ["startup", 7]
      ],
      cities: ["Pune", "Mumbai", "Bengaluru", "Chennai", "Tokyo", "Nashik"],
      companies: {
        "japan-mfg": [
          ["Denso", 6],
          ["Amada", 5],
          ["Mitsubishi Heavy", 3]
        ],
        auto: [
          ["Tata Motors", 14],
          ["Bajaj Auto", 11],
          ["Bosch", 9],
          ["Force Motors", 5]
        ],
        semi: [
          ["Cummins Electronics", 5],
          ["Qualcomm", 4]
        ],
        core: [
          ["Thermax", 8],
          ["Kirloskar", 7],
          ["L&T", 6]
        ],
        energy: [
          ["Bharat Forge", 4],
          ["Suzlon", 3]
        ],
        it: [
          ["Persistent", 9],
          ["Infosys", 11],
          ["TCS", 10]
        ],
        startup: [
          ["Deeptek", 3],
          ["Jio Platforms", 4]
        ]
      },
      people: [
        { name: "Sneha J.", year: 2020, dept: "Mechanical", role: "CAE Engineer", company: "Tata Motors", city: "Pune", type: "auto", hiring: false },
        { name: "Omkar P.", year: 2018, dept: "Mechanical", role: "Application Engineer", company: "Amada", city: "Pune", type: "japan-mfg", hiring: true }
      ]
    },
    {
      id: "dtu",
      name: "Delhi Technological University",
      short: "DTU",
      city: "Delhi",
      nirf: 27,
      alumni: 274,
      japan: 6,
      hiringManagers: 16,
      batches: "2016–2025",
      departments: [
        ["CSE", 30],
        ["ECE", 18],
        ["Mechanical", 18],
        ["Electrical", 14],
        ["Civil", 8],
        ["Other", 12]
      ],
      mix: [
        ["japan-mfg", 6],
        ["auto", 14],
        ["semi", 14],
        ["core", 14],
        ["energy", 8],
        ["it", 32],
        ["startup", 12]
      ],
      cities: ["Delhi NCR", "Bengaluru", "Pune", "Hyderabad", "Tokyo", "Gurugram"],
      companies: {
        "japan-mfg": [
          ["Daikin", 6],
          ["Honda Cars", 5],
          ["Panasonic", 3]
        ],
        auto: [
          ["Maruti Suzuki", 12],
          ["Hero MotoCorp", 8],
          ["Bosch", 6]
        ],
        semi: [
          ["NXP", 7],
          ["Samsung R&D", 9]
        ],
        core: [
          ["Siemens", 8],
          ["Schneider Electric", 6]
        ],
        energy: [
          ["NTPC", 5],
          ["IOCL", 4]
        ],
        it: [
          ["Adobe", 7],
          ["Microsoft", 8],
          ["Amazon", 9],
          ["Infosys", 12]
        ],
        startup: [
          ["Groww", 5],
          ["PhysicsWallah", 4]
        ]
      },
      people: [
        { name: "Aarav G.", year: 2021, dept: "CSE", role: "SDE", company: "Adobe", city: "Noida", type: "it", hiring: false },
        { name: "Tanvi S.", year: 2018, dept: "Mechanical", role: "Quality Lead", company: "Maruti Suzuki", city: "Gurugram", type: "auto", hiring: true }
      ]
    },
    {
      id: "pesu",
      name: "PES University",
      short: "PES University",
      city: "Bengaluru",
      nirf: 101,
      alumni: 221,
      japan: 8,
      hiringManagers: 13,
      batches: "2017–2025",
      departments: [
        ["CSE", 42],
        ["ECE", 22],
        ["Mechanical", 14],
        ["EEE", 10],
        ["Other", 12]
      ],
      mix: [
        ["japan-mfg", 9],
        ["auto", 10],
        ["semi", 18],
        ["core", 8],
        ["energy", 4],
        ["it", 37],
        ["startup", 14]
      ],
      cities: ["Bengaluru", "Hyderabad", "Pune", "Tokyo", "Chennai"],
      companies: {
        "japan-mfg": [
          ["Denso", 7],
          ["Toshiba", 5],
          ["Ricoh", 3]
        ],
        auto: [
          ["Mercedes-Benz R&D", 8],
          ["Bosch", 7]
        ],
        semi: [
          ["Intel", 10],
          ["AMD", 8],
          ["Texas Instruments", 6]
        ],
        core: [
          ["ABB", 5],
          ["L&T", 5]
        ],
        energy: [
          ["Siemens Energy", 4]
        ],
        it: [
          ["SAP Labs", 12],
          ["Oracle", 9],
          ["Infosys", 14],
          ["Akamai", 6]
        ],
        startup: [
          ["Razorpay", 7],
          ["CRED", 4]
        ]
      },
      people: [
        { name: "Bhavya N.", year: 2020, dept: "CSE", role: "Software Engineer", company: "SAP Labs", city: "Bengaluru", type: "it", hiring: false },
        { name: "Ramesh C.", year: 2017, dept: "ECE", role: "Validation Engineer", company: "Intel", city: "Bengaluru", type: "semi", hiring: true }
      ]
    },
    {
      id: "rvce",
      name: "R.V. College of Engineering",
      short: "RVCE Bengaluru",
      city: "Bengaluru",
      nirf: 99,
      alumni: 167,
      japan: 5,
      hiringManagers: 9,
      batches: "2018–2025",
      departments: [
        ["CSE", 36],
        ["ECE", 24],
        ["Mechanical", 16],
        ["IEM", 10],
        ["EEE", 8],
        ["Other", 6]
      ],
      mix: [
        ["japan-mfg", 8],
        ["auto", 12],
        ["semi", 20],
        ["core", 10],
        ["energy", 4],
        ["it", 34],
        ["startup", 12]
      ],
      cities: ["Bengaluru", "Hyderabad", "Pune", "Tokyo"],
      companies: {
        "japan-mfg": [
          ["Denso", 5],
          ["Toyota Kirloskar", 4]
        ],
        auto: [
          ["Bosch", 8],
          ["Mercedes-Benz R&D", 6]
        ],
        semi: [
          ["Texas Instruments", 8],
          ["Samsung R&D", 7]
        ],
        core: [
          ["L&T", 6],
          ["ABB", 4]
        ],
        energy: [
          ["GE Vernova", 3]
        ],
        it: [
          ["Infosys", 12],
          ["Cisco", 7],
          ["Intuit", 5]
        ],
        startup: [
          ["Unacademy", 4],
          ["Razorpay", 5]
        ]
      },
      people: [
        { name: "Pooja H.", year: 2021, dept: "CSE", role: "Frontend Engineer", company: "Intuit", city: "Bengaluru", type: "it", hiring: false }
      ]
    },
    {
      id: "psg",
      name: "PSG College of Technology",
      short: "PSG Tech",
      city: "Coimbatore",
      nirf: 67,
      alumni: 203,
      japan: 10,
      hiringManagers: 12,
      batches: "2016–2025",
      departments: [
        ["Mechanical", 28],
        ["CSE", 22],
        ["ECE", 18],
        ["Textile", 10],
        ["EEE", 12],
        ["Other", 10]
      ],
      mix: [
        ["japan-mfg", 15],
        ["auto", 16],
        ["semi", 10],
        ["core", 18],
        ["energy", 6],
        ["it", 27],
        ["startup", 8]
      ],
      cities: ["Coimbatore", "Chennai", "Bengaluru", "Pune", "Tokyo", "Osaka"],
      companies: {
        "japan-mfg": [
          ["Amada", 7],
          ["Denso", 6],
          ["YKK", 4]
        ],
        auto: [
          ["Bosch", 9],
          ["Hyundai", 7],
          ["TVS Motor", 8]
        ],
        semi: [
          ["Tata Electronics", 6],
          ["Qualcomm", 4]
        ],
        core: [
          ["L&T", 8],
          ["Lakshmi Machine Works", 9]
        ],
        energy: [
          ["Suzlon", 4]
        ],
        it: [
          ["Zoho", 11],
          ["TCS", 12],
          ["Cognizant", 8]
        ],
        startup: [
          ["Freshworks", 5],
          ["Chargebee", 3]
        ]
      },
      people: [
        { name: "Karthika V.", year: 2019, dept: "Mechanical", role: "Application Engineer", company: "Amada", city: "Coimbatore", type: "japan-mfg", hiring: true }
      ]
    },
    {
      id: "srm",
      name: "SRM Institute of Science and Technology",
      short: "SRM IST",
      city: "Chennai",
      nirf: 14,
      alumni: 504,
      japan: 9,
      hiringManagers: 21,
      batches: "2015–2025",
      departments: [
        ["CSE", 40],
        ["ECE", 18],
        ["Mechanical", 14],
        ["IT", 12],
        ["EEE", 8],
        ["Other", 8]
      ],
      mix: [
        ["japan-mfg", 7],
        ["auto", 11],
        ["semi", 12],
        ["core", 10],
        ["energy", 5],
        ["it", 42],
        ["startup", 13]
      ],
      cities: ["Chennai", "Bengaluru", "Hyderabad", "Pune", "Noida", "Tokyo"],
      companies: {
        "japan-mfg": [
          ["Daikin", 8],
          ["Nissan", 6],
          ["Denso", 5]
        ],
        auto: [
          ["Hyundai", 12],
          ["Renault Nissan", 9],
          ["Ashok Leyland", 7]
        ],
        semi: [
          ["Samsung R&D", 11],
          ["Qualcomm", 8]
        ],
        core: [
          ["L&T", 10],
          ["Siemens", 7]
        ],
        energy: [
          ["FLSmidth", 4]
        ],
        it: [
          ["TCS", 32],
          ["Infosys", 24],
          ["Zoho", 14],
          ["Wipro", 18]
        ],
        startup: [
          ["Freshworks", 10],
          ["Ather Energy", 5]
        ]
      },
      people: [
        { name: "Akash R.", year: 2020, dept: "CSE", role: "DevOps Engineer", company: "TCS", city: "Chennai", type: "it", hiring: false }
      ]
    },
    {
      id: "amrita",
      name: "Amrita Vishwa Vidyapeetham",
      short: "Amrita",
      city: "Coimbatore",
      nirf: 23,
      alumni: 246,
      japan: 8,
      hiringManagers: 14,
      batches: "2016–2025",
      departments: [
        ["CSE", 32],
        ["ECE", 20],
        ["Mechanical", 18],
        ["EEE", 12],
        ["Other", 18]
      ],
      mix: [
        ["japan-mfg", 10],
        ["auto", 12],
        ["semi", 14],
        ["core", 14],
        ["energy", 6],
        ["it", 34],
        ["startup", 10]
      ],
      cities: ["Bengaluru", "Coimbatore", "Chennai", "Hyderabad", "Tokyo"],
      companies: {
        "japan-mfg": [
          ["Denso", 6],
          ["Yamaha", 5]
        ],
        auto: [
          ["Bosch", 8],
          ["Tata Motors", 6]
        ],
        semi: [
          ["Texas Instruments", 7],
          ["Qualcomm", 6]
        ],
        core: [
          ["L&T", 7],
          ["ABB", 5]
        ],
        energy: [
          ["Robert Bosch Energy", 4]
        ],
        it: [
          ["Zoho", 10],
          ["Infosys", 12],
          ["Amrita Technologies", 6]
        ],
        startup: [
          ["Freshworks", 6]
        ]
      },
      people: [
        { name: "Neha A.", year: 2021, dept: "CSE", role: "ML Engineer", company: "Zoho", city: "Chennai", type: "it", hiring: false }
      ]
    },
    {
      id: "manipal",
      name: "Manipal Institute of Technology",
      short: "MIT Manipal",
      city: "Manipal",
      nirf: 56,
      alumni: 318,
      japan: 7,
      hiringManagers: 15,
      batches: "2016–2025",
      departments: [
        ["CSE", 34],
        ["ECE", 20],
        ["Mechanical", 16],
        ["IT", 12],
        ["EEE", 8],
        ["Other", 10]
      ],
      mix: [
        ["japan-mfg", 7],
        ["auto", 10],
        ["semi", 16],
        ["core", 10],
        ["energy", 5],
        ["it", 38],
        ["startup", 14]
      ],
      cities: ["Bengaluru", "Hyderabad", "Mumbai", "Pune", "Tokyo", "Manipal"],
      companies: {
        "japan-mfg": [
          ["Denso", 5],
          ["Sony", 4]
        ],
        auto: [
          ["Bosch", 8],
          ["Mercedes-Benz R&D", 6]
        ],
        semi: [
          ["NXP", 7],
          ["Qualcomm", 8],
          ["Intel", 6]
        ],
        core: [
          ["L&T", 7],
          ["Siemens", 5]
        ],
        energy: [
          ["Shell", 4]
        ],
        it: [
          ["Microsoft", 8],
          ["Oracle", 9],
          ["Infosys", 14],
          ["Dell", 7]
        ],
        startup: [
          ["Razorpay", 6],
          ["Swiggy", 5]
        ]
      },
      people: [
        { name: "Devika R.", year: 2019, dept: "IT", role: "Product Analyst", company: "Swiggy", city: "Bengaluru", type: "startup", hiring: false }
      ]
    },
    {
      id: "jadavpur",
      name: "Jadavpur University",
      short: "Jadavpur University",
      city: "Kolkata",
      nirf: 18,
      alumni: 142,
      japan: 4,
      hiringManagers: 8,
      batches: "2016–2025",
      departments: [
        ["CSE", 28],
        ["ETCE", 18],
        ["Mechanical", 20],
        ["Electrical", 16],
        ["Civil", 10],
        ["Other", 8]
      ],
      mix: [
        ["japan-mfg", 6],
        ["auto", 8],
        ["semi", 12],
        ["core", 20],
        ["energy", 10],
        ["it", 34],
        ["startup", 10]
      ],
      cities: ["Kolkata", "Bengaluru", "Hyderabad", "Pune", "Tokyo", "Delhi"],
      companies: {
        "japan-mfg": [
          ["Mitsubishi Electric", 4],
          ["Toshiba", 3]
        ],
        auto: [
          ["Tata Motors", 6],
          ["Bosch", 4]
        ],
        semi: [
          ["AMD", 5],
          ["Intel", 4]
        ],
        core: [
          ["L&T", 8],
          ["Crompton", 5]
        ],
        energy: [
          ["IOCL", 5],
          ["CESC", 3]
        ],
        it: [
          ["TCS", 12],
          ["PWC", 6],
          ["Google", 4]
        ],
        startup: [
          ["ShareChat", 3]
        ]
      },
      people: [
        { name: "Anirban D.", year: 2018, dept: "ETCE", role: "Firmware Engineer", company: "Intel", city: "Bengaluru", type: "semi", hiring: false }
      ]
    },
    {
      id: "anna",
      name: "College of Engineering, Guindy (Anna University)",
      short: "CEG Chennai",
      city: "Chennai",
      nirf: 13,
      alumni: 229,
      japan: 12,
      hiringManagers: 14,
      batches: "2016–2025",
      departments: [
        ["Mechanical", 26],
        ["CSE", 24],
        ["ECE", 20],
        ["EEE", 12],
        ["Civil", 10],
        ["Other", 8]
      ],
      mix: [
        ["japan-mfg", 14],
        ["auto", 18],
        ["semi", 14],
        ["core", 16],
        ["energy", 6],
        ["it", 24],
        ["startup", 8]
      ],
      cities: ["Chennai", "Bengaluru", "Pune", "Hyderabad", "Tokyo", "Yokohama"],
      companies: {
        "japan-mfg": [
          ["Denso", 8],
          ["Nissan", 7],
          ["Mitsubishi Electric", 6]
        ],
        auto: [
          ["Hyundai", 10],
          ["Ashok Leyland", 9],
          ["Renault Nissan", 8]
        ],
        semi: [
          ["Tata Electronics", 7],
          ["Qualcomm", 6]
        ],
        core: [
          ["L&T", 9],
          ["FLSmidth", 5]
        ],
        energy: [
          ["CPCL", 4]
        ],
        it: [
          ["Zoho", 12],
          ["TCS", 11],
          ["PayPal", 5]
        ],
        startup: [
          ["Freshworks", 7],
          ["Ather Energy", 4]
        ]
      },
      people: [
        { name: "Shreya M.", year: 2019, dept: "ECE", role: "Embedded Engineer", company: "Qualcomm", city: "Chennai", type: "semi", hiring: true },
        { name: "Vivek T.", year: 2017, dept: "Mechanical", role: "Production Lead", company: "Nissan", city: "Chennai", type: "japan-mfg", hiring: true }
      ]
    }
  ],
  jobs: [
    {
      id: "j1",
      stream: "engineering",
      title: "Mechanical Design Engineer",
      company: "Denso",
      type: "japan-mfg",
      city: "Bengaluru",
      ctc: "8–12 LPA",
      exp: "0–2 yrs",
      posted: "2d",
      eligibility: "B.E. Mechanical / Production",
      japan: true,
      alumni: { nitt: 14, vit: 9, bits: 5, nitk: 10, coep: 6, dtu: 0, pesu: 7, rvce: 5, psg: 6, srm: 5, amrita: 6, manipal: 5, jadavpur: 0, anna: 8 }
    },
    {
      id: "j2",
      stream: "engineering",
      title: "Application Engineer — Sheet Metal",
      company: "Amada",
      type: "japan-mfg",
      city: "Pune",
      ctc: "7–11 LPA",
      exp: "0–3 yrs",
      posted: "5d",
      eligibility: "B.E. Mechanical; shop-floor exposure a plus",
      japan: true,
      alumni: { nitt: 6, vit: 0, bits: 0, nitk: 0, coep: 5, dtu: 0, pesu: 0, rvce: 0, psg: 7, srm: 0, amrita: 0, manipal: 0, jadavpur: 0, anna: 0 }
    },
    {
      id: "j3",
      stream: "engineering",
      title: "Quality Engineer",
      company: "Bosch",
      type: "auto",
      city: "Nashik",
      ctc: "6–9 LPA",
      exp: "0–2 yrs",
      posted: "1d",
      eligibility: "Mechanical / Automobile / Production",
      japan: false,
      alumni: { nitt: 16, vit: 14, bits: 9, nitk: 12, coep: 9, dtu: 6, pesu: 7, rvce: 8, psg: 9, srm: 0, amrita: 8, manipal: 8, jadavpur: 4, anna: 0 }
    },
    {
      id: "j4",
      stream: "engineering",
      title: "Embedded Systems Engineer",
      company: "Mitsubishi Electric",
      type: "japan-mfg",
      city: "Gurugram",
      ctc: "9–14 LPA",
      exp: "1–3 yrs",
      posted: "3d",
      eligibility: "ECE / EEE / Instrumentation",
      japan: true,
      alumni: { nitt: 9, vit: 6, bits: 7, nitk: 5, coep: 0, dtu: 0, pesu: 0, rvce: 0, psg: 0, srm: 0, amrita: 0, manipal: 0, jadavpur: 4, anna: 6 }
    },
    {
      id: "j5",
      stream: "engineering",
      title: "Manufacturing Engineer",
      company: "DMG Mori",
      type: "japan-mfg",
      city: "Bengaluru",
      ctc: "8–13 LPA",
      exp: "0–2 yrs",
      posted: "6d",
      eligibility: "Mechanical; CNC / CAD exposure",
      japan: true,
      alumni: { nitt: 4, vit: 0, bits: 0, nitk: 0, coep: 0, dtu: 0, pesu: 0, rvce: 0, psg: 0, srm: 0, amrita: 0, manipal: 0, jadavpur: 0, anna: 0 }
    },
    {
      id: "j6",
      stream: "engineering",
      title: "Field Application Engineer",
      company: "Texas Instruments",
      type: "semi",
      city: "Bengaluru",
      ctc: "12–18 LPA",
      exp: "0–2 yrs",
      posted: "4d",
      eligibility: "ECE / EEE; analog fundamentals",
      japan: false,
      alumni: { nitt: 12, vit: 0, bits: 11, nitk: 9, coep: 0, dtu: 0, pesu: 6, rvce: 8, psg: 0, srm: 0, amrita: 7, manipal: 0, jadavpur: 0, anna: 0 }
    },
    {
      id: "j7",
      stream: "engineering",
      title: "Production Engineer",
      company: "Tata Motors",
      type: "auto",
      city: "Pune",
      ctc: "6–10 LPA",
      exp: "0–2 yrs",
      posted: "2d",
      eligibility: "Mechanical / Production / Automobile",
      japan: false,
      alumni: { nitt: 11, vit: 0, bits: 6, nitk: 6, coep: 14, dtu: 0, pesu: 0, rvce: 0, psg: 0, srm: 0, amrita: 6, manipal: 0, jadavpur: 6, anna: 0 }
    },
    {
      id: "j8",
      stream: "engineering",
      title: "Electrical Design Engineer",
      company: "Siemens",
      type: "core",
      city: "Bengaluru",
      ctc: "7–12 LPA",
      exp: "0–3 yrs",
      posted: "8d",
      eligibility: "EEE / Electrical / E&I",
      japan: false,
      alumni: { nitt: 9, vit: 7, bits: 6, nitk: 0, coep: 0, dtu: 8, pesu: 0, rvce: 0, psg: 0, srm: 7, amrita: 0, manipal: 5, jadavpur: 0, anna: 0 }
    },
    {
      id: "j9",
      stream: "engineering",
      title: "Site Engineer — Heavy Civil",
      company: "L&T Construction",
      type: "core",
      city: "Chennai",
      ctc: "5–8 LPA",
      exp: "0–2 yrs",
      posted: "1d",
      eligibility: "Civil; willing to travel to sites",
      japan: false,
      alumni: { nitt: 15, vit: 12, bits: 8, nitk: 11, coep: 6, dtu: 0, pesu: 5, rvce: 6, psg: 8, srm: 10, amrita: 7, manipal: 7, jadavpur: 8, anna: 9 }
    },
    {
      id: "j10",
      stream: "engineering",
      title: "Process Engineer",
      company: "Reliance Industries",
      type: "energy",
      city: "Jamnagar",
      ctc: "8–13 LPA",
      exp: "0–2 yrs",
      posted: "9d",
      eligibility: "Chemical / Mechanical",
      japan: false,
      alumni: { nitt: 8, vit: 0, bits: 7, nitk: 5, coep: 0, dtu: 0, pesu: 0, rvce: 0, psg: 0, srm: 0, amrita: 0, manipal: 0, jadavpur: 0, anna: 0 }
    },
    {
      id: "j11",
      stream: "engineering",
      title: "CAE Engineer — Crash & Durability",
      company: "Mahindra",
      type: "auto",
      city: "Chennai",
      ctc: "7–11 LPA",
      exp: "1–3 yrs",
      posted: "3d",
      eligibility: "Mechanical; HyperMesh / LS-Dyna",
      japan: false,
      alumni: { nitt: 8, vit: 0, bits: 0, nitk: 0, coep: 0, dtu: 0, pesu: 0, rvce: 0, psg: 0, srm: 0, amrita: 0, manipal: 0, jadavpur: 0, anna: 0 }
    },
    {
      id: "j12",
      stream: "engineering",
      title: "HVAC Design Engineer",
      company: "Daikin",
      type: "japan-mfg",
      city: "Neemrana",
      ctc: "7–10 LPA",
      exp: "0–2 yrs",
      posted: "4d",
      eligibility: "Mechanical / Chemical",
      japan: true,
      alumni: { nitt: 5, vit: 8, bits: 0, nitk: 0, coep: 0, dtu: 6, pesu: 0, rvce: 0, psg: 0, srm: 8, amrita: 0, manipal: 0, jadavpur: 0, anna: 0 }
    },
    {
      id: "j13",
      stream: "it",
      title: "Software Engineer",
      company: "Zoho",
      type: "it",
      city: "Chennai",
      ctc: "10–16 LPA",
      exp: "0–2 yrs",
      posted: "1d",
      eligibility: "CSE / IT / ECE; strong DSA",
      japan: false,
      alumni: { nitt: 13, vit: 18, bits: 6, nitk: 0, coep: 0, dtu: 0, pesu: 0, rvce: 0, psg: 11, srm: 14, amrita: 10, manipal: 0, jadavpur: 0, anna: 12 }
    },
    {
      id: "j14",
      stream: "it",
      title: "Backend Engineer",
      company: "Freshworks",
      type: "startup",
      city: "Chennai",
      ctc: "12–20 LPA",
      exp: "1–3 yrs",
      posted: "2d",
      eligibility: "CSE / IT; Java or Python services",
      japan: false,
      alumni: { nitt: 7, vit: 9, bits: 0, nitk: 0, coep: 0, dtu: 0, pesu: 0, rvce: 0, psg: 5, srm: 10, amrita: 6, manipal: 0, jadavpur: 0, anna: 7 }
    },
    {
      id: "j15",
      stream: "it",
      title: "SDE-1",
      company: "Razorpay",
      type: "startup",
      city: "Bengaluru",
      ctc: "16–24 LPA",
      exp: "0–2 yrs",
      posted: "3d",
      eligibility: "CSE / IT; internships a plus",
      japan: false,
      alumni: { nitt: 5, vit: 8, bits: 7, nitk: 4, coep: 0, dtu: 0, pesu: 7, rvce: 5, psg: 0, srm: 0, amrita: 0, manipal: 6, jadavpur: 0, anna: 0 }
    },
    {
      id: "j16",
      stream: "it",
      title: "Software Engineer — Cloud",
      company: "SAP Labs",
      type: "it",
      city: "Bengaluru",
      ctc: "14–22 LPA",
      exp: "0–2 yrs",
      posted: "6d",
      eligibility: "CSE / ISE / IT",
      japan: false,
      alumni: { nitt: 0, vit: 0, bits: 0, nitk: 9, coep: 0, dtu: 0, pesu: 12, rvce: 0, psg: 0, srm: 0, amrita: 0, manipal: 0, jadavpur: 0, anna: 0 }
    },
    {
      id: "j17",
      stream: "it",
      title: "SDE",
      company: "Samsung R&D",
      type: "semi",
      city: "Noida",
      ctc: "13–19 LPA",
      exp: "0–2 yrs",
      posted: "4d",
      eligibility: "CSE / ECE; C++ or Android",
      japan: false,
      alumni: { nitt: 5, vit: 14, bits: 0, nitk: 0, coep: 0, dtu: 9, pesu: 0, rvce: 7, psg: 0, srm: 11, amrita: 0, manipal: 0, jadavpur: 0, anna: 0 }
    },
    {
      id: "j18",
      stream: "it",
      title: "Data Analyst",
      company: "Infosys",
      type: "it",
      city: "Pune",
      ctc: "5–8 LPA",
      exp: "0–1 yr",
      posted: "1d",
      eligibility: "Any engineering; SQL + Python",
      japan: false,
      alumni: { nitt: 18, vit: 24, bits: 0, nitk: 16, coep: 11, dtu: 12, pesu: 14, rvce: 12, psg: 0, srm: 24, amrita: 12, manipal: 14, jadavpur: 0, anna: 0 }
    },
    {
      id: "j19",
      stream: "it",
      title: "Frontend Engineer",
      company: "Intuit",
      type: "it",
      city: "Bengaluru",
      ctc: "18–28 LPA",
      exp: "1–3 yrs",
      posted: "7d",
      eligibility: "CSE / IT; React",
      japan: false,
      alumni: { nitt: 0, vit: 0, bits: 0, nitk: 0, coep: 0, dtu: 0, pesu: 0, rvce: 5, psg: 0, srm: 0, amrita: 0, manipal: 0, jadavpur: 0, anna: 0 }
    },
    {
      id: "j20",
      stream: "it",
      title: "QA Automation Engineer",
      company: "Wipro",
      type: "it",
      city: "Hyderabad",
      ctc: "5–7 LPA",
      exp: "0–2 yrs",
      posted: "2d",
      eligibility: "CSE / IT / ECE",
      japan: false,
      alumni: { nitt: 0, vit: 16, bits: 0, nitk: 0, coep: 0, dtu: 0, pesu: 0, rvce: 0, psg: 0, srm: 18, amrita: 0, manipal: 0, jadavpur: 0, anna: 0 }
    },
    {
      id: "j21",
      stream: "it",
      title: "Embedded Software Engineer",
      company: "Bosch Global Software",
      type: "auto",
      city: "Bengaluru",
      ctc: "9–15 LPA",
      exp: "0–2 yrs",
      posted: "5d",
      eligibility: "ECE / EEE / CSE; C and autosar interest",
      japan: false,
      alumni: { nitt: 16, vit: 14, bits: 9, nitk: 12, coep: 9, dtu: 6, pesu: 7, rvce: 8, psg: 9, srm: 0, amrita: 8, manipal: 8, jadavpur: 4, anna: 0 }
    },
    {
      id: "j22",
      stream: "it",
      title: "Software Engineer — Payments",
      company: "PhonePe",
      type: "startup",
      city: "Bengaluru",
      ctc: "18–30 LPA",
      exp: "0–2 yrs",
      posted: "3d",
      eligibility: "CSE / IT; strong systems",
      japan: false,
      alumni: { nitt: 0, vit: 6, bits: 0, nitk: 0, coep: 0, dtu: 0, pesu: 0, rvce: 0, psg: 0, srm: 0, amrita: 0, manipal: 0, jadavpur: 0, anna: 0 }
    },
    {
      id: "j23",
      stream: "it",
      title: "Full Stack Engineer",
      company: "PayPal",
      type: "it",
      city: "Chennai",
      ctc: "14–22 LPA",
      exp: "1–3 yrs",
      posted: "8d",
      eligibility: "CSE / IT",
      japan: false,
      alumni: { nitt: 0, vit: 0, bits: 0, nitk: 0, coep: 0, dtu: 0, pesu: 0, rvce: 0, psg: 0, srm: 0, amrita: 0, manipal: 0, jadavpur: 0, anna: 5 }
    },
    {
      id: "j24",
      stream: "engineering",
      title: "Robotics Application Engineer",
      company: "Fanuc",
      type: "japan-mfg",
      city: "Hyderabad",
      ctc: "8–12 LPA",
      exp: "0–3 yrs",
      posted: "6d",
      eligibility: "Mechanical / Mechatronics / EEE",
      japan: true,
      alumni: { nitt: 0, vit: 0, bits: 4, nitk: 0, coep: 0, dtu: 0, pesu: 0, rvce: 0, psg: 0, srm: 0, amrita: 0, manipal: 0, jadavpur: 0, anna: 0 }
    },
    {
      id: "j25",
      stream: "engineering",
      title: "Production Intern",
      company: "Bosch",
      type: "auto",
      city: "Nashik",
      ctc: "Stipend",
      exp: "Internship · 2027",
      posted: "1d",
      eligibility: "Mechanical / Production · 2027",
      japan: false,
      intern: true,
      alumni: { nitt: 16, vit: 14, bits: 9, nitk: 12, coep: 9, dtu: 6, pesu: 7, rvce: 8, psg: 9, srm: 0, amrita: 8, manipal: 8, jadavpur: 4, anna: 0 }
    },
    {
      id: "j26",
      stream: "engineering",
      title: "Design Intern — HVAC",
      company: "Daikin",
      type: "japan-mfg",
      city: "Neemrana",
      ctc: "Stipend",
      exp: "Internship · 2027",
      posted: "4d",
      eligibility: "Mechanical · 2027",
      japan: true,
      intern: true,
      alumni: { nitt: 5, vit: 0, bits: 0, nitk: 0, coep: 0, dtu: 0, pesu: 0, rvce: 0, psg: 0, srm: 0, amrita: 0, manipal: 0, jadavpur: 0, anna: 0 }
    },
    {
      id: "j27",
      stream: "engineering",
      title: "Plant Intern",
      company: "Denso",
      type: "japan-mfg",
      city: "Bengaluru",
      ctc: "Stipend",
      exp: "Internship · 2027",
      posted: "2d",
      eligibility: "Mechanical / Production · 2027",
      japan: true,
      intern: true,
      alumni: { nitt: 14, vit: 9, bits: 5, nitk: 10, coep: 6, dtu: 0, pesu: 7, rvce: 5, psg: 6, srm: 5, amrita: 6, manipal: 5, jadavpur: 0, anna: 8 }
    }
  ]
};
