import { useState, useEffect } from 'react'
import { Search, Calendar, BookOpen, FileText, CheckCircle2, X, Download } from 'lucide-react'

export default function SyllabusDesk() {
  const [selectedSchool, setSelectedSchool] = useState('scs')
  const [selectedLevel, setSelectedLevel] = useState('all') // 'all', 'ug', 'pg'
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
      title: "Explore Syllabus & Programs",
      subtitle: "Detailed academic curricula, program scopes, and course duration details for all schools.",
      selectSchool: "Select Your School",
      searchPlaceholder: "Search course code or name...",
      activeCurriculum: "Active Academic Curriculum",
      viewDetails: "View Details & Scope",
      noPrograms: "No Programs Listed",
      noProgramsDesc: "We couldn't find any courses matching your active program levels or search queries.",
      courseDescription: "Course Description & Scope",
      curriculumHighlights: "Curriculum Highlights & Outcomes",
      closeCourse: "Close Course Details",
      duration: "Duration",
      level: "Level",
      syllabusCode: "OUTR Syllabus Code",
      ugDetail: "Undergraduate Program Detail",
      pgDetail: "Postgraduate Program Detail",
      undergraduate: "Undergraduate",
      postgraduate: "Postgraduate",
      
      // Schools mapping
      scs: "Computer Sciences",
      sElectrical: "Electrical Sciences",
      sElectronic: "Electronic Sciences",
      sip: "Infrastructure & Planning",
      sms: "Mechanical Sciences",
      
      // Levels mapping
      all: "All Programs",
      ug: "Undergraduate (UG)",
      pg: "Postgraduate (PG)"
    },
    hi: {
      title: "पाठ्यक्रम और कार्यक्रमों का पता लगाएं",
      subtitle: "सभी स्कूलों के लिए विस्तृत शैक्षणिक पाठ्यक्रम, कार्यक्रम क्षेत्र और पाठ्यक्रम अवधि विवरण।",
      selectSchool: "अपने स्कूल का चयन करें",
      searchPlaceholder: "पाठ्यक्रम कोड या नाम खोजें...",
      activeCurriculum: "सक्रिय शैक्षणिक पाठ्यक्रम",
      viewDetails: "विवरण और कार्यक्षेत्र देखें",
      noPrograms: "कोई कार्यक्रम सूचीबद्ध नहीं",
      noProgramsDesc: "हमें आपके सक्रिय कार्यक्रम स्तरों या खोज प्रश्नों से मेल खाने वाला कोई पाठ्यक्रम नहीं मिला।",
      courseDescription: "पाठ्यक्रम विवरण और क्षेत्र",
      curriculumHighlights: "पाठ्यक्रम की मुख्य विशेषताएं और परिणाम",
      closeCourse: "पाठ्यक्रम विवरण बंद करें",
      duration: "अवधि",
      level: "स्तर",
      syllabusCode: "ओयूटीआर पाठ्यक्रम कोड",
      ugDetail: "स्नातक कार्यक्रम विवरण",
      pgDetail: "स्नातकोत्तर कार्यक्रम विवरण",
      undergraduate: "स्नातक",
      postgraduate: "स्नातकोत्तर",
      
      // Schools mapping
      scs: "कंप्यूटर विज्ञान",
      sElectrical: "इलेक्ट्रिकल विज्ञान",
      sElectronic: "इलेक्ट्रॉनिक्स विज्ञान",
      sip: "बुनियादी ढांचा और योजना",
      sms: "मैकेनिकल विज्ञान",
      
      // Levels mapping
      all: "सभी कार्यक्रम",
      ug: "स्नातक (UG)",
      pg: "स्नातकोत्तर (PG)"
    },
    od: {
      title: "ପାଠ୍ୟକ୍ରମ ଓ ଶିକ୍ଷାଗତ କାର୍ଯ୍ୟକ୍ରମ",
      subtitle: "ସମସ୍ତ ସ୍କୁଲ ପାଇଁ ସମ୍ପୂର୍ଣ୍ଣ ଏକାଡେମିକ୍ ପାଠ୍ୟକ୍ରମ, କାର୍ଯ୍ୟକ୍ରମ ପରିସର ଏବଂ କୋର୍ସ ଅବଧି ବିବରଣୀ |",
      selectSchool: "ଆପଣଙ୍କର ସ୍କୁଲ୍ ଚୟନ କରନ୍ତୁ",
      searchPlaceholder: "କୋର୍ସ କୋଡ୍ କିମ୍ବା ନାମ ଖୋଜନ୍ତୁ...",
      activeCurriculum: "ସକ୍ରିୟ ଏକାଡେମିକ୍ ପାଠ୍ୟକ୍ରମ",
      viewDetails: "ବିବରଣୀ ଏବଂ ସ୍କୋପ୍ ଦେଖନ୍ତୁ",
      noPrograms: "କୌଣସି କାର୍ଯ୍ୟକ୍ରମ ତାଲିକାଭୁକ୍ତ ହୋଇନାହିଁ",
      noProgramsDesc: "ଆପଣଙ୍କର ସକ୍ରିୟ ପ୍ରୋଗ୍ରାମ ସ୍ତର କିମ୍ବା ସର୍ଚ୍ଚ କ୍ଵେରୀ ସହିତ ମେଳ ଖାଉଥିବା କୌଣସି କୋର୍ସ ମିଳିଲା ନାହିଁ ।",
      courseDescription: "କୋର୍ସ ବିବରଣୀ ଏବଂ ପରିସର",
      curriculumHighlights: "ପାଠ୍ୟକ୍ରମର ମୁଖ୍ୟ ଆକର୍ଷଣ ଏବଂ ଫଳାଫଳ",
      closeCourse: "କୋର୍ସ ବିବରଣୀ ବନ୍ଦ କରନ୍ତୁ",
      duration: "ଅବଧି",
      level: "ସ୍ତର",
      syllabusCode: "ଓୟୁଟିଆର୍ ସିଲାବସ୍ କୋଡ୍",
      ugDetail: "ସ୍ନାତକ ପ୍ରୋଗ୍ରାମ୍ ବିବରଣୀ",
      pgDetail: "ସ୍ନାତକୋତ୍ତର ପ୍ରୋଗ୍ରାମ୍ ବିବରଣୀ",
      undergraduate: "ସ୍ନାତକ (UG)",
      postgraduate: "ସ୍ନାତକୋତ୍ତର (PG)",
      
      // Schools mapping
      scs: "କମ୍ପ୍ୟୁଟର ବିଜ୍ଞାନ",
      sElectrical: "ଇଲେକ୍ଟ୍ରିକାଲ୍ ସାଇନ୍ସ",
      sElectronic: "ଇଲେକ୍ଟ୍ରୋନିକ୍ସ ସାଇନ୍ସ",
      sip: "ଇନଫ୍ରାଷ୍ଟ୍ରକଚର୍ ଓ ପ୍ଲାନିଂ",
      sms: "ମେକାନିକାଲ୍ ସାଇନ୍ସ",
      
      // Levels mapping
      all: "ସମସ୍ତ କାର୍ଯ୍ୟକ୍ରମ",
      ug: "ସ୍ନାତକ (UG)",
      pg: "ସ୍ନାତକୋତ୍ତର (PG)"
    }
  }

  const localized = t[lang] || t.en

  const schools = [
    { id: 'scs', name: 'Computer Sciences' },
    { id: 'sElectrical', name: 'Electrical Sciences' },
    { id: 'sElectronic', name: 'Electronic Sciences' },
    { id: 'sip', name: 'Infrastructure & Planning' },
    { id: 'sms', name: 'Mechanical Sciences' }
  ]

  const levels = [
    { id: 'all', name: 'All Programs' },
    { id: 'ug', name: 'Undergraduate (UG)' },
    { id: 'pg', name: 'Postgraduate (PG)' }
  ]

  const courses = [
    // School of Computer Sciences (scs)
    {
      id: 'scs-ug-it',
      schoolId: 'scs',
      level: 'ug',
      name: 'BTech IT',
      fullName: 'Bachelor of Technology in Information Technology',
      description: 'The B.Tech program in Information Technology builds a strong foundation in modern computing, software development, database systems, and networking.',
      duration: '4 Years (8 Semesters)',
      features: [
        'Core programming and systems design',
        'Hands-on projects and industry internships',
        'Preparation for top IT industry roles'
      ]
    },
    {
      id: 'scs-ug-csc',
      schoolId: 'scs',
      level: 'ug',
      name: 'BTech CSC',
      fullName: 'Bachelor of Technology in Computer Science & Engineering',
      description: 'This program focuses on the core principles of computer science, covering algorithms, artificial intelligence, operating systems, and computer architecture.',
      duration: '4 Years (8 Semesters)',
      features: [
        'In-depth study of computer science theories',
        'Focus on emerging tech like AI/ML',
        'Excellent placement opportunities'
      ]
    },
    {
      id: 'scs-pg-mtech-it',
      schoolId: 'scs',
      level: 'pg',
      name: 'MTech IT',
      fullName: 'Master of Technology in Information Technology',
      description: 'The M.Tech program in Information Technology is designed to equip students with advanced technical skills, research methodologies, and industry-oriented practical knowledge in the field of IT.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Advanced computing and software development',
        'Research-focused curriculum with dissertation',
        'Strong industry-academia collaboration'
      ]
    },
    {
      id: 'scs-pg-mtech-csc',
      schoolId: 'scs',
      level: 'pg',
      name: 'MTech CSC',
      fullName: 'Master of Technology in Computer Science & Engineering',
      description: 'This program offers specialized training in advanced concepts of Computer Science, including artificial intelligence, machine learning, data structures, and algorithms to prepare students for research and top-tier industry roles.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Focus on core CS principles and emerging technologies',
        'State-of-the-art laboratory facilities',
        'Placement assistance in leading tech companies'
      ]
    },
    {
      id: 'scs-pg-mtech-it-pt',
      schoolId: 'scs',
      level: 'pg',
      name: 'MTech IT (Part time)',
      fullName: 'Part-Time Master of Technology in Information Technology',
      description: 'Designed for working professionals, this part-time program allows students to pursue an advanced degree while continuing their careers. The curriculum is tailored to bridge the gap between academic research and industry practice.',
      duration: '3 Years (6 Semesters)',
      features: [
        'Flexible class timings for working professionals',
        'Focus on continuous learning and skill upgrade',
        'Opportunity to implement academic learnings at work'
      ]
    },
    {
      id: 'scs-pg-mca',
      schoolId: 'scs',
      level: 'pg',
      name: 'MCA',
      fullName: 'Master of Computer Applications',
      description: 'The MCA program provides a comprehensive foundation in modern software development, enterprise applications, and IT management. It aims to create highly skilled software engineers ready for the dynamic IT landscape.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Extensive software engineering and programming curriculum',
        'Real-world project development and internships',
        'Excellent career prospects in software development and consulting'
      ]
    },

    // School of Electrical Sciences (sElectrical)
    {
      id: 'selec-ug-ee',
      schoolId: 'sElectrical',
      level: 'ug',
      name: 'BTech EE',
      fullName: 'B.Tech in Electrical Engineering',
      description: 'The B.Tech in Electrical Engineering program focuses on electrical systems, power generation, control systems, electrical machines, and modern energy technologies.',
      duration: '4 Years (8 Semesters)',
      features: [
        'Strong foundation in electrical and power systems',
        'Hands-on laboratory and industrial training',
        'Career opportunities in energy and electrical industries'
      ]
    },
    {
      id: 'selec-pg-esm',
      schoolId: 'sElectrical',
      level: 'pg',
      name: 'MTech ESM',
      fullName: 'M.Tech in Energy System and Management',
      description: 'The M.Tech ESM program focuses on renewable energy systems, energy conservation, sustainable power generation, and modern energy management technologies.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Focus on renewable and sustainable energy systems',
        'Research-oriented curriculum and practical learning',
        'Industry applications in energy management'
      ]
    },
    {
      id: 'selec-pg-ped',
      schoolId: 'sElectrical',
      level: 'pg',
      name: 'MTech PED',
      fullName: 'M.Tech in Power Electronics and Drives',
      description: 'This program provides advanced knowledge in power electronics, electrical drives, converters, motor control systems, and industrial automation technologies.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Advanced study of power electronics systems',
        'Hands-on laboratory and project work',
        'Focus on industrial automation and electrical drives'
      ]
    },
    {
      id: 'selec-pg-pse',
      schoolId: 'sElectrical',
      level: 'pg',
      name: 'MTech PSE',
      fullName: 'M.Tech in Power System Engineering',
      description: 'The M.Tech PSE program focuses on electrical power systems, smart grids, transmission systems, power generation, and modern energy distribution technologies.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Specialization in modern electrical power systems',
        'Research and practical training in energy networks',
        'Career opportunities in power and energy industries'
      ]
    },
    {
      id: 'selec-pg-pse-pt',
      schoolId: 'sElectrical',
      level: 'pg',
      name: 'MTech PSE (Part time)',
      fullName: 'Part-Time M.Tech in Power System Engineering',
      description: 'This part-time program is designed for working professionals seeking advanced expertise in electrical power systems, smart grid technologies, and energy management systems.',
      duration: '3 Years (6 Semesters)',
      features: [
        'Flexible class schedule for professionals',
        'Focus on modern power and energy systems',
        'Industry-oriented practical learning approach'
      ]
    },

    // School of Electronic Sciences (sElectronic)
    {
      id: 'selec-ug-ece',
      schoolId: 'sElectronic',
      level: 'ug',
      name: 'BTech ECE',
      fullName: 'B.Tech in Electronics and Communication Engineering',
      description: 'The B.Tech ECE program focuses on electronic systems, communication technologies, signal processing, embedded systems, and modern wireless communication networks.',
      duration: '4 Years (8 Semesters)',
      features: [
        'Focus on electronics and communication systems',
        'Hands-on laboratory and project work',
        'Career opportunities in telecom and electronics industries'
      ]
    },
    {
      id: 'selec-ug-eie',
      schoolId: 'sElectronic',
      level: 'ug',
      name: 'BTech EIE',
      fullName: 'B.Tech in Electronics and Instrumentation Engineering',
      description: 'The B.Tech EIE program provides knowledge in instrumentation systems, industrial automation, control engineering, sensors, and electronic measurement technologies.',
      duration: '4 Years (8 Semesters)',
      features: [
        'Focus on instrumentation and control systems',
        'Practical training in automation technologies',
        'Career opportunities in process and manufacturing industries'
      ]
    },
    {
      id: 'selec-pg-vlsi',
      schoolId: 'sElectronic',
      level: 'pg',
      name: 'MTech VLSI',
      fullName: 'M.Tech in VLSI Design and Embedded System',
      description: 'The M.Tech program in VLSI Design and Embedded System provides advanced knowledge in chip design, embedded systems, microprocessors, digital electronics, and modern hardware technologies.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Focus on VLSI and Embedded System technologies',
        'Hands-on laboratory and project work',
        'Research and industry-oriented curriculum'
      ]
    },
    {
      id: 'selec-pg-ece-m',
      schoolId: 'sElectronic',
      level: 'pg',
      name: 'MTech ECE',
      fullName: 'M.Tech in Electronics and Communication Engineering',
      description: 'This program offers advanced learning in communication systems, signal processing, wireless technology, electronic circuits, and modern communication engineering applications.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Advanced Electronics and Communication concepts',
        'Modern labs and research opportunities',
        'Industry-focused technical training'
      ]
    },
    {
      id: 'selec-pg-ice',
      schoolId: 'sElectronic',
      level: 'pg',
      name: 'MTech ICE',
      fullName: 'M.Tech in Instrumentation and Control Engineering',
      description: 'The M.Tech ICE program focuses on industrial automation, process control, instrumentation systems, sensors, robotics, and advanced control engineering techniques.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Specialization in Instrumentation and Control systems',
        'Practical training with modern equipment',
        'Research and industrial application focus'
      ]
    },
    {
      id: 'selec-pg-ice-pt',
      schoolId: 'sElectronic',
      level: 'pg',
      name: 'MTech ICE (Part-time)',
      fullName: 'Part-Time M.Tech in Instrumentation and Control Engineering',
      description: 'This part-time program is designed for working professionals who want to enhance their expertise in instrumentation, automation, and control engineering while continuing their professional careers.',
      duration: '3 Years (6 Semesters)',
      features: [
        'Flexible schedule for working professionals',
        'Industry-oriented practical learning',
        'Career enhancement opportunities'
      ]
    },

    // School of Infrastructure & Planning (sip)
    {
      id: 'sip-ug-arch',
      schoolId: 'sip',
      level: 'ug',
      name: 'B.Arch',
      fullName: 'Bachelor of Architecture',
      description: 'The B.Arch program focuses on architectural design, construction planning, building technology, urban development, and sustainable architecture practices.',
      duration: '5 Years (10 Semesters)',
      features: [
        'Architectural design and planning studies',
        'Studio-based practical learning',
        'Focus on sustainable and modern architecture'
      ]
    },
    {
      id: 'sip-ug-plan',
      schoolId: 'sip',
      level: 'ug',
      name: 'B.Plan',
      fullName: 'Bachelor of Planning',
      description: 'The B.Plan program provides knowledge in urban planning, regional development, transportation systems, environmental planning, and smart city development.',
      duration: '4 Years (8 Semesters)',
      features: [
        'Focus on urban and regional planning',
        'Training in sustainable infrastructure development',
        'Field studies and planning projects'
      ]
    },
    {
      id: 'sip-ug-ce',
      schoolId: 'sip',
      level: 'ug',
      name: 'BTech CE',
      fullName: 'Bachelor of Technology in Civil Engineering',
      description: 'The B.Tech CE program provides comprehensive knowledge in structural engineering, construction management, transportation systems, environmental engineering, and modern infrastructure development.',
      duration: '4 Years (8 Semesters)',
      features: [
        'Strong foundation in civil and structural engineering',
        'Hands-on fieldwork, surveying, and laboratory training',
        'Career opportunities in construction and infrastructure industries'
      ]
    },
    {
      id: 'sip-pg-mplan',
      schoolId: 'sip',
      level: 'pg',
      name: 'M.Plan',
      fullName: 'M.Plan in Urban and Regional Planning',
      description: 'The M.Plan program focuses on urban development, regional planning, sustainable infrastructure, transportation systems, and smart city planning for modern urban environments.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Focus on urban and regional development',
        'Planning and sustainable infrastructure studies',
        'Fieldwork and project-based learning'
      ]
    },
    {
      id: 'sip-pg-mtech-ge',
      schoolId: 'sip',
      level: 'pg',
      name: 'MTech GE',
      fullName: 'M.Tech in Geotechnical Engineering',
      description: 'This program provides advanced knowledge in soil mechanics, foundation engineering, rock mechanics, ground improvement techniques, and geotechnical analysis.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Advanced study of soil and foundation engineering',
        'Laboratory and field investigation training',
        'Research-oriented technical curriculum'
      ]
    },
    {
      id: 'sip-pg-mtech-se-pt',
      schoolId: 'sip',
      level: 'pg',
      name: 'MTech SE (Part-time)',
      fullName: 'Part-Time Master of Technology in Structural Engineering',
      description: 'This part-time program is designed for professionals seeking expertise in structural analysis, earthquake-resistant design, concrete structures, and advanced construction technologies.',
      duration: '3 Years (6 Semesters)',
      features: [
        'Flexible schedule for working professionals',
        'Focus on modern structural engineering concepts',
        'Industry-oriented practical learning'
      ]
    },
    {
      id: 'sip-pg-mtech-wre',
      schoolId: 'sip',
      level: 'pg',
      name: 'MTech WRE',
      fullName: 'M.Tech in Water Resources Engineering',
      description: 'The program focuses on hydrology, irrigation engineering, water resource management, hydraulic structures, and sustainable water conservation techniques.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Advanced water resource management studies',
        'Focus on irrigation and hydraulic engineering',
        'Research and field-based learning'
      ]
    },
    {
      id: 'sip-pg-mtech-wre-pt',
      schoolId: 'sip',
      level: 'pg',
      name: 'MTech WRE (Part-time)',
      fullName: 'Part-Time Master of Technology in Water Resources Engineering',
      description: 'This part-time program is designed for working professionals interested in advanced knowledge of hydrology, water management systems, irrigation techniques, and sustainable resource planning.',
      duration: '3 Years (6 Semesters)',
      features: [
        'Flexible learning schedule',
        'Focus on practical water management solutions',
        'Industry and research-oriented curriculum'
      ]
    },

    // School of Mechanical Sciences (sms)
    {
      id: 'sms-ug-ai',
      schoolId: 'sms',
      level: 'ug',
      name: 'BTech AI',
      fullName: 'Bachelor of Technology in Artificial Intelligence and Robotics',
      description: 'The B.Tech AI program focuses on artificial intelligence, robotics, machine learning, automation, intelligent systems, and advanced computing technologies.',
      duration: '4 Years (8 Semesters)',
      features: [
        'Focus on AI, robotics, and intelligent systems',
        'Hands-on projects and practical learning',
        'Career opportunities in emerging technology sectors'
      ]
    },
    {
      id: 'sms-ug-me',
      schoolId: 'sms',
      level: 'ug',
      name: 'BTech ME',
      fullName: 'Bachelor of Technology in Mechanical Engineering',
      description: 'The B.Tech ME program provides knowledge in machine design, manufacturing systems, thermodynamics, fluid mechanics, and modern mechanical engineering technologies.',
      duration: '4 Years (8 Semesters)',
      features: [
        'Strong foundation in mechanical engineering concepts',
        'Hands-on laboratory and workshop training',
        'Career opportunities in manufacturing and industrial sectors'
      ]
    },
    {
      id: 'sms-pg-iem',
      schoolId: 'sms',
      level: 'pg',
      name: 'MTech IEM',
      fullName: 'M.Tech in Industrial Engineering and Management',
      description: 'The M.Tech IEM program focuses on industrial systems, production management, quality control, operations research, and optimization techniques for efficient industrial processes.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Focus on industrial operations and management systems',
        'Research and industry-oriented practical learning',
        'Training in production and quality management'
      ]
    },
    {
      id: 'sms-pg-msd',
      schoolId: 'sms',
      level: 'pg',
      name: 'MTech MSD',
      fullName: 'M.Tech in Mechanical System Design',
      description: 'This program provides advanced knowledge in machine design, CAD/CAM, product development, manufacturing systems, and modern mechanical engineering technologies.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Advanced concepts in mechanical system design',
        'Hands-on experience with modern design tools',
        'Research and innovation-focused curriculum'
      ]
    },
    {
      id: 'sms-pg-mml-pt',
      schoolId: 'sms',
      level: 'pg',
      name: 'MTech MML (Part-time)',
      fullName: 'Part-time Master of Technology in Mechatronics and Machine Learning',
      description: 'This part-time program combines mechanical engineering, electronics, computer science, and machine learning to design intelligent automated systems and smart products.',
      duration: '3 Years (6 Semesters)',
      features: [
        'Flexible schedule designed for working professionals',
        'Integration of robotics, control systems, and AI/ML',
        'State-of-the-art laboratory and practical applications'
      ]
    },
    {
      id: 'sms-pg-te-pt',
      schoolId: 'sms',
      level: 'pg',
      name: 'MTech TE (Part-time)',
      fullName: 'Part-time Master of Technology in Thermal Engineering',
      description: 'The part-time M.Tech TE program focuses on thermodynamics, heat transfer, energy systems, fluid mechanics, and modern thermal engineering applications for working professionals.',
      duration: '3 Years (6 Semesters)',
      features: [
        'Flexible schedule for working professionals',
        'Focus on thermal and energy engineering systems',
        'Industry-oriented practical and research learning'
      ]
    },
    {
      id: 'sms-pg-mba',
      schoolId: 'sms',
      level: 'pg',
      name: 'MBA',
      fullName: 'Master of Business Administration',
      description: 'The MBA program develops leadership, management, communication, finance, and strategic decision-making skills for successful careers in business and corporate sectors.',
      duration: '2 Years (4 Semesters)',
      features: [
        'Focus on business management and leadership',
        'Industry exposure through projects and internships',
        'Career opportunities in corporate and entrepreneurial sectors'
      ]
    }
  ]

  const activeSchoolName = schools.find(s => s.id === selectedSchool)?.name || ''

  const filteredCourses = courses.filter(c => {
    const matchesSchool = c.schoolId === selectedSchool
    const matchesLevel = selectedLevel === 'all' || c.level === selectedLevel
    const matchesSearch = searchQuery === '' || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSchool && matchesLevel && matchesSearch
  })

  const activeModalData = courses.find(c => c.id === activeModalId)

  return (
    <div className="bg-slate-50 min-h-screen py-16 animate-fade-in select-none">
      {/* Page Hero */}
      <div className="relative bg-[#0b3c5d] py-16 px-6 text-center shadow-lg border-b-4 border-[#d4af37] mb-12">
        <h1 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight">
          {localized.title}
        </h1>
        <p className="text-white/85 text-xs sm:text-sm font-medium max-w-2xl mx-auto mt-4 leading-relaxed">
          {localized.subtitle}
        </p>
        <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded"></div>
      </div>

      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Academic School Selection Grid */}
        <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm text-left">
          <p className="text-[10px] font-black text-secondary tracking-widest uppercase mb-3.5 px-1 border-b border-slate-100 pb-2">
            {localized.selectSchool}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {schools.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSchool(s.id)
                  setSelectedLevel('all')
                }}
                className={`py-3 px-4 text-xs font-bold rounded-2xl border text-center transition-all cursor-pointer ${
                  selectedSchool === s.id
                    ? 'bg-primary text-white border-primary shadow-md hover:brightness-110'
                    : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100 hover:text-primary'
                }`}
              >
                {localized[s.id] || s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Level Filters + Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Level Tabs */}
          <div className="flex bg-slate-100 border border-slate-200 p-1.5 rounded-full w-full md:w-auto">
            {levels.map(l => (
              <button
                key={l.id}
                onClick={() => setSelectedLevel(l.id)}
                className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  selectedLevel === l.id
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-500 hover:text-primary'
                }`}
              >
                {localized[l.id] || l.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
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

        {/* Active Title Banner */}
        <div className="text-left border-l-4 border-accent pl-4 py-1">
          <h2 className="font-serif text-xl font-bold text-primary">{localized[selectedSchool] || activeSchoolName}</h2>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mt-0.5">{localized.activeCurriculum}</p>
        </div>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-16">
          {filteredCourses.map((c) => (
            <div 
              key={c.id} 
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:border-secondary/40 transition-all duration-300 text-left"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-full uppercase ${
                    c.level === 'ug' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  }`}>
                    {c.level === 'ug' ? localized.undergraduate : localized.postgraduate}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-accent shrink-0" /> {c.duration}
                  </span>
                </div>
                
                <h3 className="font-serif font-black text-primary text-xl leading-snug">{c.name}</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{c.fullName}</p>
                <p className="text-slate-600 text-xs font-medium leading-relaxed max-w-lg pt-1 line-clamp-3">
                  {c.description}
                </p>
              </div>

              <div className="border-t border-slate-100 mt-6 pt-4 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 font-bold">
                  <BookOpen className="w-3.5 h-3.5 text-secondary shrink-0" /> {localized.syllabusCode}
                </span>
                <button 
                  onClick={() => setActiveModalId(c.id)}
                  className="bg-primary hover:bg-secondary text-white text-xs font-bold py-2 px-5 rounded-xl transition-all cursor-pointer"
                >
                  {localized.viewDetails}
                </button>
              </div>
            </div>
          ))}

          {filteredCourses.length === 0 && (
            <div className="col-span-full bg-white border border-slate-200 rounded-3xl p-16 text-center space-y-3">
              <span className="text-4xl block">📚</span>
              <h3 className="font-serif font-bold text-primary text-lg">{localized.noPrograms}</h3>
              <p className="text-slate-400 text-xs max-w-xs mx-auto">{localized.noProgramsDesc}</p>
            </div>
          )}
        </div>

      </div>

      {/* Details Modal */}
      {activeModalData && (
        <div className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-modal-in flex flex-col text-left">
            
            {/* Modal Header */}
            <div className="bg-primary text-white p-6 relative border-b-4 border-accent">
              <button 
                onClick={() => setActiveModalId(null)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-accent text-[9px] font-black tracking-widest uppercase block mb-1">
                {activeModalData.level === 'ug' ? localized.ugDetail : localized.pgDetail}
              </span>
              <h2 className="font-serif text-2xl font-black">{activeModalData.name}</h2>
              <p className="text-blue-100 text-xs font-bold mt-1 uppercase tracking-wider">{activeModalData.fullName}</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* About section */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-secondary tracking-widest uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bold">
                  <FileText className="w-3.5 h-3.5 text-accent shrink-0" /> {localized.courseDescription}
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed font-semibold">{activeModalData.description}</p>
              </div>

              {/* Course Info */}
              <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-600">
                <p className="flex items-center gap-2">{localized.duration}: <span className="text-primary">{activeModalData.duration}</span></p>
                <p className="flex items-center gap-2">{localized.level}: <span className="text-primary uppercase">{activeModalData.level === 'ug' ? localized.undergraduate : localized.postgraduate}</span></p>
              </div>

              {/* Core Features */}
              {activeModalData.features && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-secondary tracking-widest uppercase flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" /> {localized.curriculumHighlights}
                  </h4>
                  <ul className="space-y-2.5">
                    {activeModalData.features.map((feat, idx) => (
                      <li key={idx} className="text-xs text-slate-600 font-semibold flex items-start gap-2.5 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0"></span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Syllabus PDF download link */}
              <div className="pt-2">
                <a 
                  href={`/documents/syllabus-${activeModalData.schoolId}.pdf`}
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#0b3c5d] hover:bg-[#07253a] text-white text-xs font-bold py-3 px-6 rounded-2xl shadow-sm transition-all text-center"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  Download Official Syllabus PDF
                </a>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex justify-end">
              <button 
                onClick={() => setActiveModalId(null)}
                className="bg-primary hover:bg-secondary text-white text-xs font-bold py-2.5 px-6 rounded-xl transition-all cursor-pointer"
              >
                {localized.closeCourse}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
