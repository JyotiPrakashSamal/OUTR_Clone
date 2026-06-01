import { useState, useEffect } from 'react'

export default function HODDesk() {
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeModalId, setActiveModalId] = useState(null)
  const [lang, setLang] = useState(() => localStorage.getItem('selectedLanguage') || 'en')

  useEffect(() => {
    const handleStorageChange = () => {
      setLang(localStorage.getItem('selectedLanguage') || 'en')
    }
    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(handleStorageChange, 1000)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const t = {
    en: {
      title: "Head of",
      titleSpan: "Schools",
      subtitle: "Meet the academic leaders guiding and inspiring each school at OUTR, Bhubaneswar.",
      searchPlaceholder: "Search by name, role, school...",
      all: "All Schools",
      cs: "Computer Science",
      mech: "Mechanical",
      elec: "Electrical",
      electronics: "Electronics",
      textile: "Textile",
      basic: "Basic Sciences",
      biotech: "Biotechnology",
      infra: "Infra. & Planning",
      viewProfile: "View Complete Profile",
      closeProfile: "Close Profile",
      noLeaders: "No Leaders Found",
      noLeadersDesc: "We couldn't find any HODs matching your active school filter or search queries.",
      about: "About",
      contact: "Direct Contact",
      locationLabel: "Location",
      qualifications: "Academic Qualifications",
      researchInterests: "Research Interests",
      keyPublications: "Key Publications",
      patents: "Patents & Designs",
      experience: "Professional Experience",
      guidance: "Research Guidance",
      phone: "Phone",
      email: "Email",
      selectSchool: "Select Your School",
      // Dynamic Role & HOD info translations
      "Head of the School": "Head of the School",
      "Associate Head of the School": "Associate Head of the School",
      "Professor": "Professor",
      "Associate Professor, Mechanical": "Associate Professor, Mechanical",
      "Associate Professor, E & I Engg.": "Associate Professor, E & I Engg.",
      "Associate Professor, Civil": "Associate Professor, Civil",
      "Associate Professor, Chemistry": "Associate Professor, Chemistry",
      "Assistant Professor, Biotech": "Assistant Professor, Biotech",
      "Associate Professor, Mathematics": "Associate Professor, Mathematics",
      "School of Computer Science & Engineering": "School of Computer Science & Engineering",
      "School of Mechanical Engineering": "School of Mechanical Engineering",
      "School of Electrical Science": "School of Electrical Science",
      "School of Electronics": "School of Electronics",
      "School of Textile Engineering": "School of Textile Engineering",
      "School of Basic Sciences & Humanities": "School of Basic Sciences & Humanities",
      "School of Biotechnology": "School of Biotechnology",
      "School of Infrastructure & Planning": "School of Infrastructure & Planning"
    },
    hi: {
      title: "स्कूलों के",
      titleSpan: "प्रमुख",
      subtitle: "ओयूटीआर, भुवनेश्वर में प्रत्येक स्कूल का मार्गदर्शन और प्रेरणा देने वाले अकादमिक नेताओं से मिलें।",
      searchPlaceholder: "नाम, भूमिका, स्कूल द्वारा खोजें...",
      all: "सभी स्कूल",
      cs: "कंप्यूटर विज्ञान",
      mech: "मैकेनिकल",
      elec: "इलेक्ट्रिकल",
      electronics: "इलेक्ट्रॉनिक्स",
      textile: "टेक्सटाइल",
      basic: "बुनियादी विज्ञान",
      biotech: "बायोटेक्नोलॉजी",
      infra: "इन्फ्रा और योजना",
      viewProfile: "पूर्ण प्रोफ़ाइल देखें",
      closeProfile: "प्रोफ़ाइल बंद करें",
      noLeaders: "कोई नेता नहीं मिला",
      noLeadersDesc: "हमें आपके सक्रिय स्कूल फ़िल्टर या खोज प्रश्नों से मेल खाने वाला कोई भी विभागाध्यक्ष नहीं मिला।",
      about: "के बारे में",
      contact: "सीधा संपर्क",
      locationLabel: "स्थान",
      qualifications: "अकादमिक योग्यताएं",
      researchInterests: "अनुसंधान रुचि",
      keyPublications: "प्रमुख प्रकाशन",
      patents: "पेटेंट और डिजाइन",
      experience: "व्यावसायिक अनुभव",
      guidance: "अनुसंधान मार्गदर्शन",
      phone: "फ़ोन",
      email: "ईमेल",
      selectSchool: "अपने स्कूल का चयन करें",
      "Head of the School": "स्कूल के प्रमुख",
      "Associate Head of the School": "स्कूल के एसोसिएट प्रमुख",
      "Professor": "प्रोफेसर",
      "Associate Professor, Mechanical": "एसोसिएट प्रोफेसर, मैकेनिकल",
      "Associate Professor, E & I Engg.": "एसोसिएट प्रोफेसर, ई एंड आई इंजी.",
      "Associate Professor, Civil": "एसोसिएट प्रोफेसर, सिविल",
      "Associate Professor, Chemistry": "एसोसिएट प्रोफेसर, रसायन शास्त्र",
      "Assistant Professor, Biotech": "सहायक प्रोफेसर, बायोटेक",
      "Associate Professor, Mathematics": "एसोसिएट प्रोफेसर, गणित",
      "School of Computer Science & Engineering": "कंप्यूटर विज्ञान और इंजीनियरिंग स्कूल",
      "School of Mechanical Engineering": "मैकेनिकल इंजीनियरिंग स्कूल",
      "School of Electrical Science": "इलेक्ट्रिकल विज्ञान स्कूल",
      "School of Electronics": "इलेक्ट्रॉनिक्स स्कूल",
      "School of Textile Engineering": "टेक्सटाइल इंजीनियरिंग स्कूल",
      "School of Basic Sciences & Humanities": "बुनियादी विज्ञान और मानविकी स्कूल",
      "School of Biotechnology": "बायोटेक्नोलॉजी स्कूल",
      "School of Infrastructure & Planning": "बुनियादी ढांचा और योजना स्कूल"
    },
    od: {
      title: "ସ୍କୁଲ୍",
      titleSpan: "ମୁଖ୍ୟମାନେ",
      subtitle: "ଓୟୁଟିଆର୍, ଭୁବନେଶ୍ୱରର ପ୍ରତ୍ୟେକ ସ୍କୁଲକୁ ମାର୍ଗଦର୍ଶନ ଏବଂ ଅନୁପ୍ରେରିତ କରୁଥିବା ଏକାଡେମିକ୍ ନେତାମାନଙ୍କୁ ଭେଟନ୍ତୁ |",
      searchPlaceholder: "ନାମ, ଭୂମିକା, କିମ୍ବା ସ୍କୁଲ୍ ଦ୍ୱାରା ଖୋଜନ୍ତୁ...",
      all: "ସମସ୍ତ ସ୍କୁଲ୍",
      cs: "କମ୍ପ୍ୟୁଟର ବିଜ୍ଞାନ",
      mech: "ମେକାନିକାଲ୍",
      elec: "ଇଲେକ୍ଟ୍ରିକାଲ୍",
      electronics: "ଇଲେକ୍ଟ୍ରୋନିକ୍ସ",
      textile: "ଟେକ୍ସଟାଇଲ୍",
      basic: "ମୌଳିକ ବିଜ୍ଞାନ",
      biotech: "ବାୟୋଟେକ୍ନୋଲୋଜି",
      infra: "ଇନଫ୍ରା ଏବଂ ପ୍ଲାନିଂ",
      viewProfile: "ସମ୍ପୂର୍ଣ୍ଣ ପ୍ରୋଫାଇଲ୍ ଦେଖନ୍ତୁ",
      closeProfile: "ପ୍ରୋଫାଇଲ୍ ବନ୍ଦ କରନ୍ତୁ",
      noLeaders: "କୌଣସି ନେତା ମିଳିଲେ ନାହିଁ",
      noLeadersDesc: "ଆପଣଙ୍କର ସ୍କୁଲ୍ ଫିଲ୍ଟର୍ କିମ୍ବା ସର୍ଚ୍ଚ କ୍ଵେରୀ ସହିତ ମେଳ ଖାଉଥିବା କୌଣସି HOD ମିଳିଲା ନାହିଁ ।",
      about: "ବିଷୟରେ",
      contact: "ସିଧାସଳଖ ଯୋଗାଯୋଗ",
      locationLabel: "ସ୍ଥାନ",
      qualifications: "ଶିକ୍ଷାଗତ ଯୋଗ୍ୟତା",
      researchInterests: "ଗବେଷଣା ବିଷୟ",
      keyPublications: "ମୁଖ୍ୟ ପ୍ରକାଶନ",
      patents: "ପେଟେଣ୍ଟ ଏବଂ ଡିଜାଇନ",
      experience: "ପେସାଦାର ଅଭିଜ୍ଞତା",
      guidance: "ଗବେଷଣା ମାର୍ଗଦର୍ଶନ",
      phone: "ଫୋନ",
      email: "ଇମେଲ",
      selectSchool: "ଆପଣଙ୍କର ସ୍କୁଲ୍ ଚୟନ କରନ୍ତୁ",
      "Head of the School": "ସ୍କୁଲ୍ ମୁଖ୍ୟ",
      "Associate Head of the School": "ସ୍କୁଲ୍ ର ସହଯୋଗୀ ମୁଖ୍ୟ",
      "Professor": "ପ୍ରଫେସର",
      "Associate Professor, Mechanical": "ଏସୋସିଏଟ୍ ପ୍ରଫେସର, ମେକାନିକାଲ୍",
      "Associate Professor, E & I Engg.": "ଏସୋସିଏଟ୍ ପ୍ରଫେସର, E & I ଇଞ୍ଜି.",
      "Associate Professor, Civil": "ଏସୋସିଏଟ୍ ପ୍ରଫେସର, ସିଭିଲ୍",
      "Associate Professor, Chemistry": "ଏସୋସିଏଟ୍ ପ୍ରଫେସର, ରସାୟନ ବିଜ୍ଞାନ",
      "Assistant Professor, Biotech": "ଆସିଷ୍ଟାଣ୍ଟ ପ୍ରଫେସର, ବାୟୋଟେକ୍",
      "Associate Professor, Mathematics": "ଏସୋସିଏଟ୍ ପ୍ରଫେସର, ଗଣିତ",
      "School of Computer Science & Engineering": "କମ୍ପ୍ୟୁଟର ବିଜ୍ଞାନ ଓ ଇଞ୍ଜିନିୟରିଂ ସ୍କୁଲ୍",
      "School of Mechanical Engineering": "ମେକାନିକାଲ୍ ଇଞ୍ଜିନିୟରିଂ ସ୍କୁଲ୍",
      "School of Electrical Science": "ଇଲେକ୍ଟ୍ରିକାଲ୍ ସାଇନ୍ସ ସ୍କୁଲ୍",
      "School of Electronics": "ଇଲେକ୍ଟ୍ରୋନିକ୍ସ ସ୍କୁଲ୍",
      "School of Textile Engineering": "ଟେକ୍ସଟାଇଲ୍ ଇଞ୍ଜିନିୟରିଂ ସ୍କୁଲ୍",
      "School of Basic Sciences & Humanities": "ମୌଳିକ ବିଜ୍ଞାନ ଓ ମାନବିକ ସ୍କୁଲ୍",
      "School of Biotechnology": "ବାୟୋଟେକ୍ନୋଲୋଜି ସ୍କୁଲ୍",
      "School of Infrastructure & Planning": "ଇନଫ୍ରାଷ୍ଟ୍ରକଚର୍ ଓ ପ୍ଲାନିଂ ସ୍କୁଲ୍"
    }
  }

  const localized = t[lang] || t.en

  const schools = [
    { id: 'all', name: 'All Schools' },
    { id: 'cs', name: 'Computer Science' },
    { id: 'mech', name: 'Mechanical' },
    { id: 'elec', name: 'Electrical' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'textile', name: 'Textile' },
    { id: 'basic', name: 'Basic Sciences' },
    { id: 'biotech', name: 'Biotechnology' },
    { id: 'infra', name: 'Infra. & Planning' }
  ]

  const hods = [
    {
      id: 'cs',
      schoolId: 'cs',
      schoolName: 'School of Computer Science & Engineering',
      type: 'Head of the School',
      name: 'Dr. Ranjan Kumar Dash',
      role: 'Professor',
      phone: '+91-9437360517',
      email: 'rkdash@outr.ac.in',
      photo: '/administration/admin_hod_photo/image.png',
      location: 'CS Department Block',
      about: 'He is currently a Professor in the Department of Computer Science and Application. He has a genuine passion for learning and actively mentors students in project and research work. He has more than 50 publications in different international journals/conferences.',
      education: ['Ph.D.', 'M.Tech', 'B.Tech'],
      publications: [
        'Network reliability optimization problem of interconnection network under node-edge failure model (2012)',
        'An efficient method based on self-generating disjoint minimal cut-sets for evaluating reliability measures of interconnection networks (2014)',
        'A dynamic programming approach for layout optimization of interconnection networks (2015)'
      ],
      researchInterests: ['Network Reliability', 'Graph Theory', 'Interconnection Networks'],
      experience: '23 years of teaching experience out of which 15 years of teaching experience at CET/OUTR',
      researchGuidance: 'Ph.D. - 3 students (awarded) and 1 student (ongoing); M.Tech – 10 students (awarded) and 1 student (ongoing)'
    },
    {
      id: 'mech',
      schoolId: 'mech',
      schoolName: 'School of Mechanical Engineering',
      type: 'Head of the School',
      name: 'Dr. Sudhansu Sekhar Sahoo',
      role: 'Associate Professor, Mechanical',
      phone: '+91-9337645056',
      email: 'sudhansu@outr.ac.in',
      photo: '/administration/admin_hod_photo/image copy.png',
      location: 'Mechanical Department Block',
      about: "Dr. Sudhansu Sekhar Sahoo, presently working as Professor in the School of Mechanical Sciences at Odisha University of Technology and Research (OUTR), Bhubaneswar. He obtained his B.E. in Mechanical Engineering from UCE Burla, M.Tech in Thermal Engineering from IIT Delhi under GATE Fellowship, and PhD in Renewable Energy from IIT Bombay under QIP Fellowship. His PhD work was related to modelling and analysis of linear Fresnel reflector-based solar thermal power plants.\n\nHe was the recipient of the prestigious Bhaskara Advanced Solar Energy (BASE) Fellowship Program-2017, sponsored by DST and IUSSTF. He has received various awards including Best International Faculty Award (2017), Green Award by NALCO India (2019), Faculty Research Awards from BPUT Odisha (2019) and OUTR (2023, 2024). He has secured a spot among the world's top 2% of Scientists recognized by Stanford University for the year 2024. He has published more than 90 papers in International Journals and more than 15 books/book chapters. The Indian Patent Office has granted him over 35 Patents/Designs.",
      education: [
        'Ph.D. – Renewable Energy, IIT Bombay',
        'M.Tech – Thermal Engineering, IIT Delhi',
        'B.E. – Mechanical Engineering, UCE Burla (VSSUT)'
      ],
      publications: [
        'Impact of wind velocity and angle of attack on restricting input heat flow for solar-assisted thermoelectric power generator with plate heat sink with cylindrical fins (2026)',
        'A review on Linear Fresnel Reflector (LFR) as a solar line concentrator in polygeneration for low-medium temperature applications (2025)',
        'Hydrothermal analysis of the absorber tubes used in linear Fresnel reflector solar thermal system (2011)'
      ],
      researchInterests: ['Fluid & Thermal Engineering', 'CFD & Energy Systems', 'Renewable Energy', 'Solar Thermal', 'Energy Management', 'Waste Management'],
      patents: [
        'App. No. 202231010295 - Energy-efficient composite brick and method of preparation thereof',
        'App. No. 202231030402 - Composite solar panel cover and method of formation thereof'
      ]
    },
    {
      id: 'elec',
      schoolId: 'elec',
      schoolName: 'School of Electrical Science',
      type: 'Head of the School',
      name: 'Prof. Lokanath Tripathy',
      role: 'Professor',
      phone: '+91-9438324244',
      email: 'lokanath@outr.ac.in',
      photo: '/administration/admin_hod_photo/image copy 2.png',
      location: 'Electrical Department Block',
      about: 'Dr. Lokanath Tripathy is currently serving as Professor & Head, School of Electrical Sciences, OUTR, Bhubaneswar since 2018. He completed his PhD from IIT Bhubaneswar in Power System Protection (2014), M.Tech from IISc Bangalore in Computer Aided Power System Analysis (2005), and B.Tech from IGIT Sarang (1993). He has 25 years of teaching experience and 4 years of industry experience. He has published more than 55 research papers and guided 20 M.Tech students and 2 PhD students, with 4 more PhD students currently under his guidance.\n\nHe has received the Best Performance Award from Reliance Filament Ltd. (1996), the Best Engineer Award from Petrofils Cooperatives (1997) and the prestigious POSOCO-2016 Award for Doctoral Category from Power System Operation Corporation, Govt. of India. He is an executive member of IEEE, Life member of ISTE New Delhi, and fellow of Institute of Engineers.',
      education: [
        'Ph.D. – Power System Protection, IIT Bhubaneswar, 2014',
        'M.Tech – Computer Aided Power System Analysis, IISc Bangalore, 2005',
        'B.Tech – Electrical, IGIT Sarang, 1993'
      ],
      publications: [
        'An efficient robust optimized functional link broad learning system for solar irradiance prediction (2022)',
        'Optimal control of PV-WS battery-based microgrid using an adaptive water cycle technique (2020)',
        'A Critical Fault Detection Analysis & Fault Time in an UPFC transmission line (2019)'
      ],
      researchInterests: ['Power System Protection', 'Digital Protection', 'PMU & Microgrid Protection', 'FACTs Devices', 'Power Signal Processing', 'AI & ML in Power Systems'],
      awards: [
        'Best Performance Award, Reliance Filament Ltd., 1996',
        'Best Engineer Award, Petrofils Co-operative Ltd., Gujarat, 1997',
        'Prestigious POSOCO-2016 Award for Doctoral Category, Govt. of India'
      ]
    },
    {
      id: 'electronics',
      schoolId: 'electronics',
      schoolName: 'School of Electronics',
      type: 'Head of the School',
      name: 'Prof. Madhab Chandra Tripathy',
      role: 'Associate Professor, E & I Engg.',
      phone: '+91-9437295015',
      email: 'mctripathy@outr.ac.in',
      photo: '/administration/admin_hod_photo/image copy 3.png',
      location: 'Electronics Department Block',
      about: 'Dr. Madhab Chandra Tripathy is currently serving as Professor & Head, School of Electronic Sciences, OUTR, Bhubaneswar. He completed his Ph.D. from IIT Kharagpur (Electrical Engineering, 2014), M.Tech from IIEST West Bengal (Electronics & Communication), and B.Tech from College of Engineering & Technology, Bhubaneswar (1996). He has 27 years of teaching experience. He received the Armen H. Zemanin Best Paper Award in circuits and systems (2013) and three IEEE Best Paper Awards (ICDCECE 2022, SSITCON 2024, iCONNECT 2025). He is a Life member of ISTE, member of IEEE, and fellow of Institute of Engineers. He has published more than 45 research papers and guided 22 M.Tech and 3 PhD students, with 5 more PhD students ongoing.',
      education: [
        'Ph.D. – Electrical Engineering, IIT Kharagpur, 2014',
        'M.Tech – Electronics & Communication Engineering, IIEST, West Bengal',
        'B.Tech – Electronics Engineering, CET Bhubaneswar, 1996'
      ],
      publications: [
        'FOPID-Based Soft-Switching Boost Converter for Improved Power Factor, EMI Reduction, and Enhanced System Stability (2026)',
        'Modeling and optimal analysis of lung cancer cell growth and apoptosis with fractional-order dynamics (2025)'
      ],
      researchInterests: ['Fractional-Order Circuits', 'Signal Processing', 'Sensors & Instrumentation Systems'],
      patents: [
        'Electromagnetic thin film propulsion – Patent No. 435958',
        'Design: Water efficient sensor cum mechanical based commode'
      ]
    },
    {
      id: 'textile',
      schoolId: 'textile',
      schoolName: 'School of Textile Engineering',
      type: 'Head of the School',
      name: 'Dr. Asimananda Khandual',
      role: 'Professor',
      phone: '+91-9658728145',
      email: 'asimte@outr.ac.in',
      photo: '/administration/admin_hod_photo/image copy 4.png',
      location: 'Textile Block',
      about: 'HOD, Textile Engineering. Innovation Ambassador, IIC-MHRD. SPOC, ICT Sophisticated Lab.',
      education: ['Ph.D.', 'M.Tech', 'B.Tech'],
      publications: [
        'Fabrication and characterization of natural fiber reinforced cowpea resin-based green composites: an approach towards agro-waste valorization (2024)'
      ],
      researchInterests: ['Applied Color Science', 'Textile Chemical Processing', 'Nano-Textiles', 'Image Processing', 'Functional Textiles']
    },
    {
      id: 'basic',
      schoolId: 'basic',
      schoolName: 'School of Basic Sciences & Humanities',
      type: 'Head of the School',
      name: 'Dr. Bijnyan Ranjan Das',
      role: 'Professor, Chemistry',
      phone: '+91-9437182654',
      email: 'brdas@cet.edu.in',
      photo: '/administration/admin_hod_photo/image copy 5.png',
      location: 'Basic Sciences & Humanities Block',
      about: 'Head, School of Basic Sciences and Humanities. Professor in the Department of Chemistry at OUTR, Bhubaneswar.',
      education: ['Ph.D.', 'M.Tech', 'B.Tech'],
      publications: [
        'Bio-valorization of Tagetes floral waste extract in fabrication of self-healing Schiff-base nanocomposite hydrogels for colon cancer remedy (2024)',
        'One-pot synthesis of nano-EMD for effective adsorption of toxic dyes (2023)'
      ],
      researchInterests: ['Physical Chemistry', 'Materials Chemistry'],
      researchGuidance: 'Awarded: 1, Continuing: 1',
      patents: [
        'Reduction of Viscosity of Crude Oil-Water Emulsion Using a Natural Dispersant - Patent No. 353623, App. No. 201731036767, Granted: 14/12/2020'
      ]
    },
    {
      id: 'bs-s1',
      schoolId: 'basic',
      schoolName: 'School of Basic Sciences & Humanities',
      type: 'Associate Head',
      name: 'Dr. Babita Ojha',
      role: 'Associate Professor, Physics',
      phone: '+91-9861387760',
      email: 'babitaojhacet@gmail.com',
      photo: '/administration/admin_hod_photo/profile-picture.png',
      location: 'Basic Sciences & Humanities Block',
      about: 'Dr. Babita Ojha is currently an Associate Professor of Physics at the School of Basic Sciences & Humanities, Odisha University of Technology and Research, Bhubaneswar. She obtained her M.Sc. from Utkal University and PhD degrees in Physics from Sambalpur University, Odisha, India.',
      researchInterests: ['Dielectric', 'Optical', 'Magnetic', 'Condensed Matter Physics of Nanomaterials (Spinel Ferrites & Perovskites)'],
      publications: [
        'Optimization of Structural, Optical, Dielectric and Magnetic Properties of Gd3+ substituted Mg-Mn Mixed Spinel Ferrite Ceramics (2024)'
      ]
    },
    {
      id: 'bs-s3',
      schoolId: 'basic',
      schoolName: 'School of Basic Sciences & Humanities',
      type: 'Associate Head',
      name: 'Dr. Minakshi Prasad Mishra',
      role: 'Assistant Professor, English',
      phone: '+91-9861089261',
      email: 'mpmishra@cet.edu.in',
      photo: '/administration/admin_hod_photo/profile-picture.png',
      location: 'Basic Sciences & Humanities Block',
      about: 'Minakshi Prasad Mishra completed his Post Graduation in English from Berhampur University in the year 2000 and later completed his Ph.D in English Literature from Berhampur University. He has nearly 20 years of teaching experience in institutions of repute. He is working in the Department of Humanities, School of Basic Sciences and Humanities since 2013.\n\nHe has been a visiting faculty to Institute of Management Technology, Nagpur and adjunct faculty to IISER, Berhampur. He teaches courses like English for Communication, English for Technical Writing, Communication and Report Writing, English for Research Paper Writing as well as Research and Publication Ethics to Ph.D students of the University.',
      researchInterests: [
        'Indian English Fiction, English Language Teaching as well as Soft Skills.',
        'He has published more than 10 research articles in various journals, book chapters and conference proceedings.',
        'He has also published a book titled "Marginals in the twentieth century Indian English Fiction".',
        'He has presented his research in many national and international conferences in India and abroad.',
        'He participated in the prestigious Institute for World Literature program conducted by Harvard University in the year 2014.'
      ]
    },
    {
      id: 'bs-s2',
      schoolId: 'basic',
      schoolName: 'School of Basic Sciences & Humanities',
      type: 'Associate Head',
      name: 'Dr. Prasana Kumar Mishra',
      role: 'Assistant Professor, Mathematics',
      phone: '+91-9437211153',
      email: 'mishrapkdr@gmail.com',
      photo: '/administration/admin_hod_photo/image copy 6.png',
      location: 'Basic Sciences & Humanities Block',
      about: 'Associate Head in the School of Basic Sciences & Humanities, Assistant Professor of Mathematics.',
      designation: 'Assistant Professor, Mathematics'
    },
    {
      id: 'biotech',
      schoolId: 'biotech',
      schoolName: 'School of Biotechnology',
      type: 'Head of the School',
      name: 'Dr. Ranjan Kumar Pradhan',
      role: 'Associate Professor',
      phone: '+91-8917558334',
      email: 'rkpradhan@outr.ac.in',
      photo: '/administration/admin_hod_photo/image copy 7.png',
      location: 'Biotechnology Block',
      about: 'Dr. Ranjan Kumar Pradhan is serving as Head, School of Biotechnology & Biomedical Engineering, OUTR, Bhubaneswar. Associate Professor, School of Biotechnology & Biomedical Engineering.'
    },
    {
      id: 'infra',
      schoolId: 'infra',
      schoolName: 'School of Infrastructure & Planning',
      type: 'Head of the School',
      name: 'Prof. Sabita Dash',
      role: 'Associate Professor',
      phone: '+91-9437374185',
      email: 'sdash@outr.ac.in',
      photo: '/administration/admin_hod_photo/image copy 8.png',
      location: 'Infrastructure & Planning Block',
      about: 'Prof. Sabita Dash is serving as Head, School of Infrastructure & Planning, OUTR, Bhubaneswar. She is an Associate Professor in the School of Infrastructure & Planning.',
      education: [
        'Ph.D. - IIT Kharagpur',
        'M.Tech - NIT Rourkela (Gold Medalist)',
        'B.Tech - CET (now OUTR), Bhubaneswar'
      ],
      researchInterests: [
        'Characterisation of Concrete Structural Elements',
        'Micromechanics & Durability of Concrete',
        'Sustainable Construction Materials',
        'Composites',
        'Vibration Analysis of Structures'
      ]
    },
    {
      id: 'infra-s1',
      schoolId: 'infra',
      schoolName: 'School of Infrastructure & Planning',
      type: 'Associate Head',
      name: 'Mr. Sangram Mohanty',
      role: 'Asst. Professor, Architecture',
      phone: '+91-7873999555',
      email: 'sangramm@gmail.com',
      photo: '/administration/admin_hod_photo/profile-picture.png',
      location: 'Infrastructure & Planning Block',
      about: 'Associate Head in the School of Infrastructure & Planning, Assistant Professor of Architecture.'
    },
    {
      id: 'infra-s2',
      schoolId: 'infra',
      schoolName: 'School of Infrastructure & Planning',
      type: 'Associate Head',
      name: 'Mr. Bhabani Sankar Sa',
      role: 'Asst. Professor, Planning',
      phone: '+91-8249242624',
      email: 'bhabaniplanning@outr.ac.in',
      photo: '/administration/admin_hod_photo/image copy 9.png',
      location: 'Infrastructure & Planning Block',
      about: 'Associate Head in the School of Infrastructure & Planning. Assistant Professor, Planning.'
    }
  ]

  const filteredHods = hods.filter(h => {
    const matchesSchool = selectedSchool === 'all' || h.schoolId === selectedSchool
    const matchesSearch = searchQuery === '' || 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.role.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSchool && matchesSearch
  })

  const activeModalData = hods.find(h => h.id === activeModalId)

  return (
    <div className="bg-slate-50 min-h-screen py-16 animate-fade-in select-none">
      {/* Page Hero */}
      <div className="relative bg-gradient-to-r from-primary to-secondary py-16 px-6 text-center shadow-lg border-b-4 border-accent mb-12">
        <h1 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight">
          {localized.title} <span className="text-accent">{localized.titleSpan}</span>
        </h1>
        <p className="text-white/85 text-xs sm:text-sm font-medium max-w-2xl mx-auto mt-4 leading-relaxed">
          {localized.subtitle}
        </p>
        <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded"></div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Controls Layout */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm text-left">
          <p className="text-[10px] font-black text-secondary tracking-widest uppercase mb-3.5 px-1 border-b border-slate-100 pb-2">
            {localized.selectSchool}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2">
            {schools.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedSchool(s.id)}
                className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                  selectedSchool === s.id
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-slate-50 text-slate-500 border-slate-200/60 hover:bg-slate-100 hover:text-primary'
                }`}
              >
                {localized[s.id] || s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full"></div>
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              type="text"
              placeholder={localized.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Dynamic List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 pb-16">
          {filteredHods.map((h) => (
            <div key={h.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md hover:border-secondary/40 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row gap-6 text-left items-stretch">
              
              {/* Photo */}
              <div className="w-full sm:w-44 h-48 rounded-2xl overflow-hidden border border-slate-100 flex-shrink-0 bg-slate-50 relative group">
                <img 
                  src={h.photo} 
                  alt={h.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&fit=crop&q=60";
                  }}
                />
              </div>

              {/* Summary details */}
              <div className="flex-grow flex flex-col justify-between items-start py-1">
                <div className="space-y-2">
                  <span className={`inline-block text-[8px] font-black tracking-widest px-2.5 py-1 rounded uppercase ${
                    h.type === 'Head of the School' 
                      ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                      : 'bg-sky-100 text-sky-800 border border-sky-200'
                  }`}>
                    {localized[h.type] || h.type}
                  </span>
                  <h3 className="font-serif font-black text-primary text-lg leading-snug">{h.name}</h3>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">{localized[h.role] || h.role}</p>
                  <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-sm mt-1">{localized[h.schoolName] || h.schoolName}</p>
                </div>

                <div className="space-y-1.5 w-full border-t border-slate-100 pt-4 mt-4">
                  <a href={`tel:${h.phone}`} className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-secondary transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>{h.phone}</span>
                  </a>
                  <a href={`mailto:${h.email}`} className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-secondary transition-colors truncate max-w-xs">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span>{h.email}</span>
                  </a>
                  
                  <button 
                    onClick={() => setActiveModalId(h.id)}
                    className="w-full text-center py-2 border border-primary hover:bg-primary hover:text-white text-primary text-xs font-bold rounded-xl transition-all cursor-pointer mt-3"
                  >
                    {localized.viewProfile}
                  </button>
                </div>
              </div>

            </div>
          ))}
          {filteredHods.length === 0 && (
            <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-3">
              <span className="text-4xl block">🔍</span>
              <h3 className="font-serif font-bold text-primary text-lg">{localized.noLeaders}</h3>
              <p className="text-slate-400 text-xs max-w-xs mx-auto">{localized.noLeadersDesc}</p>
            </div>
          )}
        </div>

      </div>

      {/* Details Modal */}
      {activeModalData && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-modal-in flex flex-col text-left">
            
            {/* Modal Header */}
            <div className="bg-primary text-white p-6 relative border-b-4 border-accent">
              <button 
                onClick={() => setActiveModalId(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <span className="text-accent text-[9px] font-black tracking-widest uppercase block mb-1">{localized[activeModalData.type] || activeModalData.type}</span>
              <h2 className="font-serif text-2xl font-black">{activeModalData.name}</h2>
              <p className="text-blue-100 text-xs font-bold mt-1 uppercase tracking-wider">{localized[activeModalData.schoolName] || activeModalData.schoolName}</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* About section */}
              {activeModalData.about && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-secondary tracking-widest uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bold">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg> {localized.about}
                  </h4>
                  <p className="text-slate-600 text-xs leading-relaxed font-semibold whitespace-pre-line">{activeModalData.about}</p>
                </div>
              )}

              {/* Contact section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-secondary tracking-widest uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bold">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg> {localized.contact}
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-600 font-bold">
                    <p className="flex items-center gap-2">{localized.phone}: <span className="text-primary">{activeModalData.phone}</span></p>
                    <p className="flex items-center gap-2">{localized.email}: <span className="text-primary">{activeModalData.email}</span></p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-secondary tracking-widest uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bold">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {localized.locationLabel}
                  </h4>
                  <p className="text-slate-600 text-xs font-bold flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> {activeModalData.location || 'University Campus'}
                  </p>
                </div>
              </div>

              {/* Education section */}
              {activeModalData.education && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-secondary tracking-widest uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bold">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> {localized.qualifications}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeModalData.education.map((edu, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Research Interests */}
              {activeModalData.researchInterests && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-secondary tracking-widest uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bold">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 17 22 12"/></svg> {localized.researchInterests}
                  </h4>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {activeModalData.researchInterests.map((interest, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-slate-200/50">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Publications */}
              {activeModalData.publications && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-secondary tracking-widest uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bold">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> {localized.keyPublications}
                  </h4>
                  <ul className="space-y-2.5">
                    {activeModalData.publications.map((pub, idx) => (
                      <li key={idx} className="text-xs text-slate-600 font-semibold flex items-start gap-2.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0"></span>
                        <span>{pub}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Patents */}
              {activeModalData.patents && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-secondary tracking-widest uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bold">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> {localized.patents}
                  </h4>
                  <ul className="space-y-2.5">
                    {activeModalData.patents.map((pat, idx) => (
                      <li key={idx} className="text-xs text-slate-600 font-semibold flex items-start gap-2.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0"></span>
                        <span>{pat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Guidance or Experience */}
              {(activeModalData.researchGuidance || activeModalData.experience) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeModalData.experience && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-secondary tracking-widest uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bold">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg> {localized.experience}
                      </h4>
                      <p className="text-slate-600 text-xs font-semibold leading-relaxed">{activeModalData.experience}</p>
                    </div>
                  )}
                  {activeModalData.researchGuidance && (
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black text-secondary tracking-widest uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bold">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg> {localized.guidance}
                      </h4>
                      <p className="text-slate-600 text-xs font-semibold leading-relaxed">{activeModalData.researchGuidance}</p>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end">
              <button 
                onClick={() => setActiveModalId(null)}
                className="bg-primary hover:bg-secondary text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer"
              >
                {localized.closeProfile}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
