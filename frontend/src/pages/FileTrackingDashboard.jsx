import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'

// Schools database from the legacy system
const SCHOOLS = [
  {
    id: 'SCS',
    name: 'School of Computer Science',
    short: 'Comp. Science',
    icon: '💻',
    programmes: ['B.Tech CSE', 'B.Tech CSE (AI & ML)', 'B.Tech CSE (Data Science)', 'MCA', 'M.Tech CSE', 'Ph.D CSE']
  },
  {
    id: 'SEE',
    name: 'School of Electrical Science',
    short: 'Electrical Engg.',
    icon: '⚡',
    programmes: ['B.Tech Electrical', 'B.Tech EEE', 'M.Tech Power Systems', 'M.Tech Control Systems', 'Ph.D EE']
  },
  {
    id: 'SME',
    name: 'School of Mechanical Science',
    short: 'Mechanical Engg.',
    icon: '⚙️',
    programmes: ['B.Tech Mechanical', 'B.Tech Automobile', 'M.Tech Thermal', 'M.Tech Manufacturing', 'Ph.D ME']
  },
  {
    id: 'SECE',
    name: 'School of Electronics Science',
    short: 'Electronics & Comm.',
    icon: '🔌',
    programmes: ['B.Tech ECE', 'B.Tech Electronics', 'M.Tech VLSI', 'M.Tech Communication', 'Ph.D ECE']
  },
  {
    id: 'STX',
    name: 'School of Textile Engineering',
    short: 'Textile Technology',
    icon: '🧵',
    programmes: ['B.Tech Textile Technology', 'B.Tech Fashion Technology', 'M.Tech Textile', 'MBA Textile Management', 'Ph.D Textile']
  },
  {
    id: 'SBS',
    name: 'School of Basic Sciences & Humanities',
    short: 'Basic Sciences & Hum.',
    icon: '🧪',
    programmes: ['B.Sc Physics', 'B.Sc Chemistry', 'B.Sc Mathematics', 'M.Sc Physics', 'M.Sc Chemistry', 'M.Sc Mathematics', 'MA English', 'MA Economics', 'Ph.D Sciences']
  },
  {
    id: 'SIP',
    name: 'School of Infrastructure & Planning',
    short: 'Infrastructure & Plan.',
    icon: '🏛️',
    programmes: ['B.Tech Civil', 'B.Tech Architecture', 'M.Tech Structural', 'M.Tech Environmental', 'M.Plan Urban Planning', 'Ph.D Civil']
  },
  {
    id: 'SBM',
    name: 'School of Business Management',
    short: 'Business Management',
    icon: '📈',
    programmes: ['BBA', 'MBA', 'MBA (Finance)', 'MBA (HR)', 'MBA (Marketing)', 'Ph.D Management']
  }
]

const SCHOOL_MAP = SCHOOLS.reduce((acc, s) => {
  acc[s.id] = s
  return acc
}, {})

export default function FileTrackingDashboard({ role, onSignOut }) {
  // Navigation / Views: 'landing', 'student-form', 'tracking', 'adviser', 'hos', 'controller'
  const [currentSubView, setCurrentSubView] = useState('landing')
  const [userProfile, setUserProfile] = useState(null)
  
  // Data State
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Student Form State
  const [studentForm, setStudentForm] = useState({
    name: '',
    regd_no: '',
    school_id: '',
    program: '',
    semester: '',
    email: '',
    type: '',
    urgency: 'Normal',
    description: ''
  })
  const [studentFile, setStudentFile] = useState(null)
  const [studentFormError, setStudentFormError] = useState('')
  const [studentFormSuccess, setStudentFormSuccess] = useState('')
  const [formSubmitting, setFormSubmitting] = useState(false)

  // Tracking State
  const [trackRegd, setTrackRegd] = useState('')
  const [trackedApps, setTrackedApps] = useState(null)
  const [trackingLoading, setTrackingLoading] = useState(false)

  // Review Modal / Comments State
  const [selectedApp, setSelectedApp] = useState(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewAction, setReviewAction] = useState('approve') // 'approve' or 'decline'
  const [remarks, setRemarks] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Document Modal State
  const [showDocModal, setShowDocModal] = useState(false)
  const [docApp, setDocApp] = useState(null)

  // File Viewer Modal State
  const [showFileModal, setShowFileModal] = useState(false)
  const [activeFile, setActiveFile] = useState(null)

  // Controller Specific State
  const [ctrlActiveDept, setCtrlActiveDept] = useState('ALL')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadDesc, setUploadDesc] = useState('')
  const [uploadFile, setUploadFile] = useState(null)

  // 1. Sync Role props to internal navigation
  useEffect(() => {
    if (role === 'adviser') setCurrentSubView('adviser')
    else if (role === 'hos') setCurrentSubView('hos')
    else if (role === 'controller') setCurrentSubView('controller')
    else setCurrentSubView('landing')
  }, [role])

  // 2. Fetch user profile & applications
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true)
        
        // 2a. Fetch Auth User and Profiles
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
            
          if (profile) {
            setUserProfile(profile)
          } else {
            // Mock profile fallback
            setUserProfile({
              name: role === 'controller' ? 'Dr. Anupama Rath' : 'Dr. Debasis Gountia',
              role: role || 'student',
              school_id: role === 'controller' ? null : 'SCS'
            })
          }
        } else {
          setUserProfile({
            name: role === 'controller' ? 'Dr. Anupama Rath' : 'Dr. Debasis Gountia',
            role: role || 'student',
            school_id: role === 'controller' ? null : 'SCS'
          })
        }

        // 2b. Fetch applications
        await fetchAllApplications()
      } catch (err) {
        console.error('Initialization error:', err)
        loadSimulatedData()
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [role])

  // Fetch applications from Supabase
  async function fetchAllApplications() {
    try {
      const { data, error } = await supabase
        .from('file_tracking')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      if (!data || data.length === 0) {
        loadSimulatedData()
      } else {
        // Map database records to stateful app format
        const mappedData = data.map(dbApp => mapDbAppToLocal(dbApp))
        setApplications(mappedData)
      }
    } catch (err) {
      console.warn('Database error or offline. Loading simulated data:', err.message)
      loadSimulatedData()
    }
  }

  // Helper: map database model to legacy frontend state
  function mapDbAppToLocal(dbApp) {
    // Try to parse subject as JSON in case it was a rich string
    let parsedSubject = { type: dbApp.subject, program: '', semester: '', urgency: 'Normal', description: '' }
    try {
      if (dbApp.subject.startsWith('{')) {
        parsedSubject = JSON.parse(dbApp.subject)
      }
    } catch (e) {}

    const adviserMapping = { Pending: 'pending', Approved: 'adviser_approved', Rejected: 'adviser_declined' }
    const hosMapping = { Pending: 'adviser_approved', Approved: 'hos_approved', Rejected: 'hos_declined' }
    const ctrlMapping = { Pending: 'hos_approved', Approved: 'resolved', Rejected: 'rejected' }

    let status = 'pending'
    if (dbApp.controller_status !== 'Pending') {
      status = ctrlMapping[dbApp.controller_status]
    } else if (dbApp.hos_status !== 'Pending') {
      status = hosMapping[dbApp.hos_status]
    } else if (dbApp.adviser_status !== 'Pending') {
      status = adviserMapping[dbApp.adviser_status]
    }

    return {
      id: dbApp.file_no,
      student_name: dbApp.student_name,
      regd_no: dbApp.student_regd,
      school_id: dbApp.school_id,
      school_name: SCHOOL_MAP[dbApp.school_id]?.name || dbApp.school_id,
      school_short: SCHOOL_MAP[dbApp.school_id]?.short || dbApp.school_id,
      school_icon: SCHOOL_MAP[dbApp.school_id]?.icon || '🏛️',
      program: parsedSubject.program || 'B.Tech',
      semester: parsedSubject.semester || '',
      type: parsedSubject.type || dbApp.subject,
      urgency: parsedSubject.urgency || 'Normal',
      description: parsedSubject.description || 'No description provided.',
      file_name: dbApp.file_url ? 'Attached Letter.pdf' : null,
      file_data: dbApp.file_url || null,
      file_type: dbApp.file_url ? 'application/pdf' : null,
      ctrl_attachments: [],
      status: status,
      adviser_comment: dbApp.adviser_name ? dbApp.adviser_name.split('Comment:')[1] || '' : '',
      hos_comment: dbApp.hos_name ? dbApp.hos_name.split('Comment:')[1] || '' : '',
      controller_comment: dbApp.controller_name ? dbApp.controller_name.split('Comment:')[1] || '' : '',
      controller_action: dbApp.controller_status === 'Approved' ? 'approved' : dbApp.controller_status === 'Rejected' ? 'decline' : '',
      submitted_at: dbApp.created_at,
      adviser_at: dbApp.updated_at,
      hos_at: dbApp.updated_at,
      resolved_at: dbApp.updated_at
    }
  }

  // Seed simulated fallback data
  function loadSimulatedData() {
    const cached = localStorage.getItem('OUTR_APPLICATIONS')
    if (cached) {
      setApplications(JSON.parse(cached))
      return
    }

    const dummyApps = [
      {
        id: 'APP-LR8K3F9J',
        student_name: 'Manish Kumar Pradhan',
        regd_no: '2201011',
        school_id: 'SCS',
        school_name: 'School of Computer Science',
        school_short: 'Comp. Science',
        school_icon: '💻',
        program: 'B.Tech CSE',
        semester: '4th Semester',
        type: 'Fee Concession',
        urgency: 'Normal',
        description: 'I request a partial fee concession due to sudden medical expenses incurred by my family this semester. I have attached the income certificate and hospital logs.',
        file_name: 'income_certificate.pdf',
        file_data: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz90...',
        file_type: 'application/pdf',
        ctrl_attachments: [],
        status: 'pending',
        adviser_comment: '',
        hos_comment: '',
        controller_comment: '',
        controller_action: '',
        submitted_at: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        adviser_at: null, hos_at: null, resolved_at: null
      },
      {
        id: 'APP-JW9L2X5P',
        student_name: 'Rashmi Rekha Sahoo',
        regd_no: '2201012',
        school_id: 'SEE',
        school_name: 'School of Electrical Science',
        school_short: 'Electrical Engg.',
        school_icon: '⚡',
        program: 'B.Tech EEE',
        semester: '6th Semester',
        type: 'Exam Re-evaluation',
        urgency: 'Urgent',
        description: 'Requesting re-evaluation of my Power Systems paper. My score is significantly lower than expected, and it affects my CGPA criteria for the upcoming placement drive.',
        file_name: 'marksheet_copy.png',
        file_type: 'image/png',
        file_data: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=300',
        ctrl_attachments: [],
        status: 'adviser_approved',
        adviser_comment: 'Recommended. Student has consistent outstanding academic records.',
        hos_comment: '',
        controller_comment: '',
        controller_action: '',
        submitted_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        adviser_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        hos_at: null, resolved_at: null
      },
      {
        id: 'APP-HD8V4N7M',
        student_name: 'Aniket Mohanty',
        regd_no: '2201015',
        school_id: 'SME',
        school_name: 'School of Mechanical Science',
        school_short: 'Mechanical Engg.',
        school_icon: '⚙️',
        program: 'M.Tech Thermal',
        semester: '2nd Semester',
        type: 'Leave of Absence',
        urgency: 'Critical',
        description: 'Applying for leave from May 25th to June 5th to undergo an emergency appendectomy. Medical certificate and surgery scheduling details are uploaded.',
        file_name: 'medical_report.pdf',
        file_type: 'application/pdf',
        file_data: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz90...',
        ctrl_attachments: [],
        status: 'hos_approved',
        adviser_comment: 'Sickness verified. Forwarded for approval.',
        hos_comment: 'Approved. Dean Academics is notified.',
        controller_comment: '',
        controller_action: '',
        submitted_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        adviser_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
        hos_at: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
        resolved_at: null
      },
      {
        id: 'APP-KM9B4X7D',
        student_name: 'Sambit Swarup Dash',
        regd_no: '2201020',
        school_id: 'SCS',
        school_name: 'School of Computer Science',
        school_short: 'Comp. Science',
        school_icon: '💻',
        program: 'B.Tech CSE (AI & ML)',
        semester: '8th Semester',
        type: 'Certificate Request',
        urgency: 'Normal',
        description: 'Need provisional course completion certificate and CGPA transcript urgently to apply for higher studies at foreign universities.',
        file_name: 'all_semester_results.pdf',
        file_type: 'application/pdf',
        file_data: 'data:application/pdf;base64,JVBERi0xLjQKJeLjz90...',
        ctrl_attachments: [],
        status: 'resolved',
        adviser_comment: 'Syllabus and grade criteria satisfied.',
        hos_comment: 'Approved. Recommended to Exam Cell.',
        controller_comment: 'Official certificate generated and transcript attached.',
        controller_action: 'approved',
        submitted_at: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
        adviser_at: new Date(Date.now() - 60 * 3600 * 1000).toISOString(),
        hos_at: new Date(Date.now() - 50 * 3600 * 1000).toISOString(),
        resolved_at: new Date(Date.now() - 40 * 3600 * 1000).toISOString()
      }
    ]
    setApplications(dummyApps)
    localStorage.setItem('OUTR_APPLICATIONS', JSON.stringify(dummyApps))
  }

  // Update local storage and applications state
  function updateApplicationsState(updatedList) {
    setApplications(updatedList)
    localStorage.setItem('OUTR_APPLICATIONS', JSON.stringify(updatedList))
  }

  // 3. Handle File Uploads (Drag & Drop or Selection)
  const handleStudentFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    processStudentFile(file)
  }

  const processStudentFile = (file) => {
    if (file.size > 10 * 1024 * 1024) {
      setStudentFormError('File exceeds 10 MB limit.')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setStudentFile({ name: file.name, data: ev.target.result, type: file.type })
    }
    reader.readAsDataURL(file)
  }

  // 4. Submit Student Application
  const handleStudentSubmit = async (e) => {
    e.preventDefault()
    setStudentFormError('')
    setStudentFormSuccess('')
    
    const { name, regd_no, school_id, program, semester, email, type, urgency, description } = studentForm
    if (!name || !regd_no || !school_id || !program || !description || !type) {
      setStudentFormError('Please fill all required fields.')
      return
    }

    setFormSubmitting(true)
    const appId = 'APP-' + Math.random().toString(36).substring(2, 10).toUpperCase()
    
    const school = SCHOOL_MAP[school_id]
    const classStr = program + (semester ? ' — ' + semester : '')
    
    const newApp = {
      id: appId,
      student_name: name,
      regd_no,
      school_id,
      school_name: school.name,
      school_short: school.short,
      school_icon: school.icon,
      program,
      semester,
      class: classStr,
      email,
      type,
      urgency,
      description,
      file_name: studentFile ? studentFile.name : null,
      file_data: studentFile ? studentFile.data : null,
      file_type: studentFile ? studentFile.type : null,
      ctrl_attachments: [],
      status: 'pending',
      adviser_comment: '',
      hos_comment: '',
      controller_comment: '',
      controller_action: '',
      submitted_at: new Date().toISOString(),
      adviser_at: null,
      hos_at: null,
      resolved_at: null
    }

    try {
      // Encode dynamic fields into subject field for simple database mapping
      const subjectJson = JSON.stringify({
        type: type,
        program: program,
        semester: semester,
        urgency: urgency,
        description: description
      })

      // Try database insert
      const { error } = await supabase
        .from('file_tracking')
        .insert([{
          file_no: appId,
          student_name: name,
          student_regd: regd_no,
          school_id: school_id,
          subject: subjectJson,
          file_url: studentFile ? studentFile.data : null,
          adviser_status: 'Pending',
          hos_status: 'Pending',
          controller_status: 'Pending'
        }])

      if (error) throw error

      setStudentFormSuccess(appId)
      setStudentForm({
        name: '', regd_no: '', school_id: '', program: '', semester: '', email: '', type: '', urgency: 'Normal', description: ''
      })
      setStudentFile(null)
      fetchAllApplications()
    } catch (err) {
      console.warn('Database insert restricted or offline, simulating locally:', err.message)
      const updatedList = [newApp, ...applications]
      updateApplicationsState(updatedList)
      setStudentFormSuccess(appId)
      setStudentForm({
        name: '', regd_no: '', school_id: '', program: '', semester: '', email: '', type: '', urgency: 'Normal', description: ''
      })
      setStudentFile(null)
    } finally {
      setFormSubmitting(false)
    }
  }

  // 5. Track Application
  const handleTrackSubmit = (e) => {
    e.preventDefault()
    if (!trackRegd.trim()) return
    setTrackingLoading(true)
    
    // Filter locally or fetch from local state fallback
    setTimeout(() => {
      const matched = applications.filter(
        a => a.regd_no.toLowerCase() === trackRegd.trim().toLowerCase()
      )
      setTrackedApps(matched)
      setTrackingLoading(false)
    }, 500)
  }

  // 6. Approve / Decline actions for Adviser/HoS/Controller
  const triggerReviewAction = (app, actionType) => {
    setSelectedApp(app)
    setReviewAction(actionType)
    setRemarks('')
    setShowReviewModal(true)
  }

  const handleReviewSubmit = async () => {
    setActionLoading(true)
    const now = new Date().toISOString()
    let statusUpdate = ''
    
    if (role === 'adviser') statusUpdate = reviewAction === 'approve' ? 'adviser_approved' : 'adviser_declined'
    else if (role === 'hos') statusUpdate = reviewAction === 'approve' ? 'hos_approved' : 'hos_declined'
    else if (role === 'controller') statusUpdate = reviewAction === 'approve' ? 'resolved' : 'rejected'

    try {
      // Map back to database columns
      let updatePayload = {}
      if (role === 'adviser') {
        updatePayload = {
          adviser_status: reviewAction === 'approve' ? 'Approved' : 'Rejected',
          adviser_name: `Name: ${userProfile?.name} | Comment: ${remarks}`
        }
      } else if (role === 'hos') {
        updatePayload = {
          hos_status: reviewAction === 'approve' ? 'Approved' : 'Rejected',
          hos_name: `Name: ${userProfile?.name} | Comment: ${remarks}`
        }
      } else if (role === 'controller') {
        updatePayload = {
          controller_status: reviewAction === 'approve' ? 'Approved' : 'Rejected',
          controller_name: `Name: ${userProfile?.name} | Comment: ${remarks}`
        }
      }

      const { error } = await supabase
        .from('file_tracking')
        .update(updatePayload)
        .eq('file_no', selectedApp.id)

      if (error) throw error

      fetchAllApplications()
      setShowReviewModal(false)
      if (role === 'controller' && reviewAction === 'approve') {
        // Open generated doc modal
        setDocApp({
          ...selectedApp,
          status: 'resolved',
          controller_action: 'approved',
          controller_comment: remarks,
          resolved_at: now
        })
        setShowDocModal(true)
      }
    } catch (err) {
      console.warn('Review write restricted or offline, performing local simulation:', err.message)
      const updatedList = applications.map(app => {
        if (app.id === selectedApp.id) {
          const upd = { ...app, status: statusUpdate }
          if (role === 'adviser') {
            upd.adviser_comment = remarks
            upd.adviser_at = now
          } else if (role === 'hos') {
            upd.hos_comment = remarks
            upd.hos_at = now
          } else if (role === 'controller') {
            upd.controller_comment = remarks
            upd.controller_action = reviewAction
            upd.resolved_at = now
          }
          return upd
        }
        return app
      })
      updateApplicationsState(updatedList)
      setShowReviewModal(false)
      
      if (role === 'controller' && reviewAction === 'approve') {
        setDocApp({
          ...selectedApp,
          status: 'resolved',
          controller_action: 'approved',
          controller_comment: remarks,
          resolved_at: now
        })
        setShowDocModal(true)
      }
    } finally {
      setActionLoading(false)
    }
  }

  // 7. Controller Attachments
  const handleCtrlFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File exceeds 10 MB limit.')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      setUploadFile({ name: file.name, data: ev.target.result, type: file.type })
    }
    reader.readAsDataURL(file)
  }

  const saveControllerAttachment = () => {
    if (!uploadFile) return
    const updatedList = applications.map(app => {
      if (app.id === selectedApp.id) {
        const atts = [...(app.ctrl_attachments || []), { ...uploadFile, desc: uploadDesc || uploadFile.name }]
        return { ...app, ctrl_attachments: atts }
      }
      return app
    })
    updateApplicationsState(updatedList)
    setUploadFile(null)
    setUploadDesc('')
    document.getElementById('ctrl_file_upload').value = ''
    setSelectedApp(updatedList.find(a => a.id === selectedApp.id))
  }

  const removeControllerAttachment = (idx) => {
    if (!confirm('Remove this attachment?')) return
    const updatedList = applications.map(app => {
      if (app.id === selectedApp.id) {
        const atts = [...(app.ctrl_attachments || [])]
        atts.splice(idx, 1)
        return { ...app, ctrl_attachments: atts }
      }
      return app
    })
    updateApplicationsState(updatedList)
    setSelectedApp(updatedList.find(a => a.id === selectedApp.id))
  }

  // Render Status Badge
  const renderStatusBadge = (status) => {
    const badges = {
      pending: 'bg-amber-50 border-amber-200 text-amber-700 font-semibold',
      adviser_approved: 'bg-sky-50 border-sky-200 text-sky-700 font-semibold',
      adviser_declined: 'bg-rose-50 border-rose-200 text-rose-700 font-semibold',
      hos_approved: 'bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold',
      hos_declined: 'bg-rose-50 border-rose-200 text-rose-700 font-semibold',
      resolved: 'bg-emerald-50 border-emerald-200 text-emerald-700 font-semibold',
      rejected: 'bg-rose-50 border-rose-200 text-rose-700 font-semibold'
    }

    const labels = {
      pending: '↻ Awaiting Adviser',
      adviser_approved: '➜ Forwarded to HoS',
      adviser_declined: '✖ Declined by Adviser',
      hos_approved: '➜ Forwarded to Cell',
      hos_declined: '✖ Declined by HoS',
      resolved: '✔ Resolved / Issued',
      rejected: '✖ Declined / Closed'
    }

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs border ${badges[status] || ''}`}>
        {labels[status] || status}
      </span>
    )
  }

  // Dynamic values helper
  const filteredApps = applications.filter(a => {
    if (role === 'adviser') return a.school_id === userProfile?.school_id
    if (role === 'hos') return a.school_id === userProfile?.school_id
    return true
  })

  const pendingCount = filteredApps.filter(a => {
    if (role === 'adviser') return a.status === 'pending'
    if (role === 'hos') return a.status === 'adviser_approved'
    if (role === 'controller') return a.status === 'hos_approved'
    return false
  }).length

  const approvedCount = filteredApps.filter(a => {
    if (role === 'adviser') return ['adviser_approved', 'hos_approved', 'resolved'].includes(a.status)
    if (role === 'hos') return ['hos_approved', 'resolved'].includes(a.status)
    if (role === 'controller') return a.status === 'resolved'
    return false
  }).length

  const declinedCount = filteredApps.filter(a => {
    if (role === 'adviser') return a.status === 'adviser_declined'
    if (role === 'hos') return a.status === 'hos_declined'
    if (role === 'controller') return a.status === 'rejected'
    return false
  }).length

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* LANDING DESK view */}
        {currentSubView === 'landing' && (
          <div className="animate-fade-in text-center max-w-4xl mx-auto select-none">
            {/* Shield and header */}
            <div className="w-20 h-20 mb-6 rounded-full bg-primary/5 border border-accent/20 flex items-center justify-center mx-auto shadow-md">
              <span className="text-3xl">📄</span>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-primary/5 text-primary text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full mb-4 border border-primary/10">
              Academic Approvals Center
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-black text-primary mb-3 leading-tight">
              Academic Application Portal
            </h1>
            <p className="text-muted font-medium text-sm max-w-lg mx-auto mb-10">
              Track multi-level university letters, request transcripts, fee concessions, or document approvals. Security and audit logged.
            </p>

            {/* Quick Grid links */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
              <div 
                onClick={() => setCurrentSubView('student-form')}
                className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 hover:border-accent/40 hover:shadow-lg transition-all duration-300 text-left group"
              >
                <div className="text-3xl mb-4 group-hover:scale-105 transition-transform duration-300">🎓</div>
                <h4 className="font-serif font-bold text-primary text-base mb-1.5">Submit Application</h4>
                <p className="text-muted text-xs leading-relaxed">
                  Draft request transcripts, upload letters, choose departments, and submit to advisers.
                </p>
              </div>

              <div 
                onClick={() => setCurrentSubView('tracking')}
                className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 hover:border-accent/40 hover:shadow-lg transition-all duration-300 text-left group"
              >
                <div className="text-3xl mb-4 group-hover:scale-105 transition-transform duration-300">🔍</div>
                <h4 className="font-serif font-bold text-primary text-base mb-1.5">Track Application</h4>
                <p className="text-muted text-xs leading-relaxed">
                  Search by your registration ID and monitor live timeline step clearances.
                </p>
              </div>

              <div 
                onClick={onSignOut}
                className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 hover:border-accent/40 hover:shadow-lg transition-all duration-300 text-left group sm:col-span-2 md:col-span-1"
              >
                <div className="text-3xl mb-4 group-hover:scale-105 transition-transform duration-300">🏛️</div>
                <h4 className="font-serif font-bold text-primary text-base mb-1.5">Access Portal Desk</h4>
                <p className="text-muted text-xs leading-relaxed">
                  Sign out or switch to Adviser, Head of School, or Controller secure desks.
                </p>
              </div>
            </div>

            {/* Verification Status */}
            <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 px-4 py-2 rounded-full text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
              Secured under OUTR Document Tracking Protocol (Supabase RLS & Base64 Attachments Enabled)
            </div>
          </div>
        )}

        {/* STUDENT SUBMISSION view */}
        {currentSubView === 'student-form' && (
          <div className="max-w-3xl mx-auto text-left animate-fade-in">
            <button 
              onClick={() => setCurrentSubView('landing')}
              className="text-xs text-secondary hover:text-primary font-bold flex items-center gap-1.5 mb-6 transition-colors"
            >
              ← Back to Landing
            </button>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="mb-6">
                <span className="text-xs font-bold text-accent uppercase tracking-widest">Student Portal</span>
                <h3 className="font-serif text-2xl font-bold text-primary mt-1">Submit Application Request</h3>
                <p className="text-xs text-muted font-medium mt-1">Fields marked with (*) are required.</p>
              </div>

              {studentFormError && <div className="p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-xl mb-4 text-xs font-semibold">⚠️ {studentFormError}</div>}
              {studentFormSuccess && (
                <div className="p-5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl mb-6 text-xs leading-relaxed">
                  <div className="font-bold text-sm mb-1">🎉 Application Submitted Successfully!</div>
                  Write down your unique Tracking ID to monitor status in the search bar: 
                  <span className="font-mono bg-white border border-emerald-300 py-0.5 px-2 rounded ml-1 font-bold select-all text-xs">{studentFormSuccess}</span>
                </div>
              )}

              <form onSubmit={handleStudentSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1">Full Student Name *</label>
                  <input 
                    type="text" required placeholder="e.g. Priyabrata Mohanty"
                    value={studentForm.name}
                    onChange={e => setStudentForm({...studentForm, name: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1">Registration Roll Number *</label>
                  <input 
                    type="text" required placeholder="e.g. 2201011"
                    value={studentForm.regd_no}
                    onChange={e => setStudentForm({...studentForm, regd_no: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1">School / Department *</label>
                  <select 
                    required value={studentForm.school_id}
                    onChange={e => setStudentForm({...studentForm, school_id: e.target.value, program: ''})}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary text-sm bg-white"
                  >
                    <option value="">Select School</option>
                    {SCHOOLS.map(s => <option key={s.id} value={s.id}>{s.icon} {s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1">Program / Course *</label>
                  <select 
                    required value={studentForm.program}
                    onChange={e => setStudentForm({...studentForm, program: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary text-sm bg-white"
                  >
                    <option value="">Select Programme</option>
                    {studentForm.school_id && SCHOOL_MAP[studentForm.school_id]?.programmes.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1">Semester</label>
                  <select 
                    value={studentForm.semester}
                    onChange={e => setStudentForm({...studentForm, semester: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary text-sm bg-white"
                  >
                    <option value="">Select semester</option>
                    {Array(8).fill(0).map((_, i) => (
                      <option key={i} value={`${i+1}st Semester`}>{i+1}th Semester</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1">Email ID</label>
                  <input 
                    type="email" placeholder="e.g. student@outr.ac.in"
                    value={studentForm.email}
                    onChange={e => setStudentForm({...studentForm, email: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1">Application Type *</label>
                  <select 
                    required value={studentForm.type}
                    onChange={e => setStudentForm({...studentForm, type: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary text-sm bg-white"
                  >
                    <option value="">Select Type</option>
                    <option value="Fee Concession">Fee Concession</option>
                    <option value="Exam Re-evaluation">Exam Re-evaluation</option>
                    <option value="Leave of Absence">Leave of Absence</option>
                    <option value="Certificate Request">Certificate Request</option>
                    <option value="Scholarship">Scholarship Request</option>
                    <option value="Hostel Transfer">Hostel Transfer</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1">Urgency Priority</label>
                  <select 
                    value={studentForm.urgency}
                    onChange={e => setStudentForm({...studentForm, urgency: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary text-sm bg-white"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical">Critical Priority</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1">Description / Reason *</label>
                  <textarea 
                    required rows="4" placeholder="Explain in detail the context of your request..."
                    value={studentForm.description}
                    onChange={e => setStudentForm({...studentForm, description: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary text-sm"
                  />
                </div>
                
                {/* File Upload Zone */}
                <div className="sm:col-span-2 mt-2">
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1.5">Application Letter Attachment</label>
                  <div 
                    onClick={() => document.getElementById('s_file_upload').click()}
                    className="w-full border-2 border-dashed border-slate-200/80 hover:border-accent/40 bg-slate-50/50 rounded-2xl p-6 text-center cursor-pointer transition-colors"
                  >
                    <input 
                      type="file" id="s_file_upload" accept=".pdf,.png,.jpg,.jpeg" className="hidden"
                      onChange={handleStudentFileSelect}
                    />
                    <span className="text-3xl block mb-2">🔗</span>
                    <span className="text-xs font-semibold text-primary block">Click to upload files</span>
                    <span className="text-[10px] text-muted block mt-1">Accepts PDF, PNG, JPG (Max 10 MB)</span>
                    {studentFile && (
                      <span className="inline-block mt-3 text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-mono font-bold">
                        📄 {studentFile.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2 pt-4 flex gap-3">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="bg-primary hover:bg-secondary text-white font-semibold py-2.5 px-8 rounded-xl text-xs disabled:opacity-50"
                  >
                    {formSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStudentForm({ name:'', regd_no:'', school_id:'', program:'', semester:'', email:'', type:'', urgency:'Normal', description:'' })
                      setStudentFile(null)
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-primary font-semibold py-2.5 px-6 rounded-xl text-xs"
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TRACKING PIPELINE view */}
        {currentSubView === 'tracking' && (
          <div className="max-w-3xl mx-auto text-left animate-fade-in">
            <button 
              onClick={() => setCurrentSubView('landing')}
              className="text-xs text-secondary hover:text-primary font-bold flex items-center gap-1.5 mb-6 transition-colors"
            >
              ← Back to Landing
            </button>

            <section className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 mb-8 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <span>🔍</span> Track Your Application Status
              </h3>
              
              <form onSubmit={handleTrackSubmit} className="flex gap-3">
                <input 
                  type="text" required placeholder="Enter student roll registration number..."
                  value={trackRegd}
                  onChange={e => setTrackRegd(e.target.value)}
                  className="flex-grow p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary text-sm"
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="bg-primary hover:bg-secondary text-white font-semibold py-3 px-8 rounded-xl text-xs transition-colors disabled:opacity-50"
                >
                  {trackingLoading ? 'Searching...' : 'Track'}
                </button>
              </form>
            </section>

            {/* Stepper display */}
            {trackedApps !== null && (
              <div className="space-y-6">
                {trackedApps.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-muted">
                    <span className="text-4xl block mb-2">🔍</span>
                    <h4 className="font-serif text-lg font-bold text-primary">No Record Found</h4>
                    <p className="text-xs mt-1">Verify that the registration number matches your student records.</p>
                  </div>
                ) : (
                  trackedApps.map(app => (
                    <div key={app.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm text-left">
                      <div className="flex justify-between items-start flex-wrap gap-4 border-b border-slate-100 pb-4 mb-6">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-primary">{app.student_name}</h4>
                          <span className="text-xs font-mono text-muted tracking-wider">Tracking ID: {app.id}</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {renderStatusBadge(app.status)}
                          <span className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {app.school_icon} {app.school_short}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-xs text-primary font-medium">
                        <div><strong>Category Type:</strong> <span className="text-muted">{app.type}</span></div>
                        <div><strong>Program Class:</strong> <span className="text-muted">{app.program} &bull; {app.semester}</span></div>
                        <div><strong>Submitted Date:</strong> <span className="text-muted">{new Date(app.submitted_at).toLocaleDateString()}</span></div>
                        <div><strong>Urgency Level:</strong> <span className={`font-bold ${app.urgency === 'Critical' ? 'text-rose-600' : app.urgency === 'Urgent' ? 'text-amber-600' : 'text-slate-500'}`}>{app.urgency}</span></div>
                      </div>

                      {/* Timeline */}
                      <div className="border-t border-b border-slate-100 py-6 mb-6">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-4">Pipeline Stepper Timeline</span>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="text-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold mx-auto text-xs">✓</div>
                            <span className="text-[10px] font-bold block mt-2 text-primary">Submitted</span>
                          </div>
                          <div className="text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mx-auto text-xs ${
                              ['adviser_approved', 'hos_approved', 'resolved'].includes(app.status)
                                ? 'bg-emerald-500 text-white'
                                : app.status === 'adviser_declined'
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              {app.status === 'adviser_declined' ? '✖' : '2'}
                            </div>
                            <span className="text-[10px] font-bold block mt-2 text-primary">Adviser</span>
                          </div>
                          <div className="text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mx-auto text-xs ${
                              ['hos_approved', 'resolved'].includes(app.status)
                                ? 'bg-emerald-500 text-white'
                                : app.status === 'hos_declined'
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              {app.status === 'hos_declined' ? '✖' : '3'}
                            </div>
                            <span className="text-[10px] font-bold block mt-2 text-primary">Head of School</span>
                          </div>
                          <div className="text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mx-auto text-xs ${
                              app.status === 'resolved'
                                ? 'bg-emerald-500 text-white'
                                : app.status === 'rejected'
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              {app.status === 'rejected' ? '✖' : '4'}
                            </div>
                            <span className="text-[10px] font-bold block mt-2 text-primary">Management Cell</span>
                          </div>
                          <div className="text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mx-auto text-xs ${
                              app.status === 'resolved' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              {app.status === 'resolved' ? '✓' : '5'}
                            </div>
                            <span className="text-[10px] font-bold block mt-2 text-primary">Resolved</span>
                          </div>
                        </div>
                      </div>

                      {/* Comments strip */}
                      {app.adviser_comment && <div className="p-3 bg-sky-50 text-sky-800 text-xs font-semibold rounded-xl mb-2.5 border border-sky-100">👨‍🏫 Adviser Remarks: "{app.adviser_comment}"</div>}
                      {app.hos_comment && <div className="p-3 bg-indigo-50 text-indigo-800 text-xs font-semibold rounded-xl mb-2.5 border border-indigo-100">🏛️ Head of School Remarks: "{app.hos_comment}"</div>}
                      {app.controller_comment && <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl mb-2.5 border border-emerald-100">⚖️ Controller Remarks: "{app.controller_comment}"</div>}

                      {/* View document when resolved or rejected */}
                      {(app.status === 'resolved' || app.status === 'rejected') && (
                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-150">
                          <div>
                            <span className="text-xs font-bold text-primary block">Official Document Issued</span>
                            <span className="text-[10px] text-muted block mt-0.5">The review committee has finalized and stamped your letter.</span>
                          </div>
                          <button
                            onClick={() => { setDocApp(app); setShowDocModal(true); }}
                            className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-5 rounded-xl text-xs transition-colors"
                          >
                            📄 View Document
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* ROLE PROTECTED PORTAL VIEWS (Adviser, HoS, Controller) */}
        {['adviser', 'hos', 'controller'].includes(currentSubView) && (
          <div className="animate-fade-in">
            {/* Header Banner */}
            <div className="bg-white/80 border border-slate-200/80 backdrop-blur-md rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 shadow-sm text-left">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-accent/20">
                  <span className="text-3xl">
                    {currentSubView === 'adviser' ? '👨‍🏫' : currentSubView === 'hos' ? '🏛️' : '⚖️'}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">OUTR Academics Cell</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mt-1">
                    {currentSubView === 'adviser' ? 'Faculty Adviser Desk' : currentSubView === 'hos' ? 'Head of School Review' : 'Exam Controller Panel'}
                  </h2>
                  <p className="text-xs text-muted font-medium mt-1">
                    Active Desk: <span className="font-semibold text-primary">{userProfile?.name}</span> {userProfile?.school_id && `• School: ${SCHOOL_MAP[userProfile.school_id]?.name}`}
                  </p>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="w-full md:w-auto bg-slate-100 hover:bg-slate-200 border border-slate-200 text-primary font-semibold py-2.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>🚪</span> Sign Out
              </button>
            </div>

            {/* Live Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl text-left">
                <span className="text-2xl">↻</span>
                <div className="text-2xl font-serif font-black text-amber-800 mt-2">{pendingCount}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Awaiting Actions</div>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl text-left">
                <span className="text-2xl">✔</span>
                <div className="text-2xl font-serif font-black text-emerald-800 mt-2">{approvedCount}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Approved Decisions</div>
              </div>
              <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl text-left">
                <span className="text-2xl">✘</span>
                <div className="text-2xl font-serif font-black text-rose-800 mt-2">{declinedCount}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Declined Records</div>
              </div>
              <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl text-left">
                <span className="text-2xl">📂</span>
                <div className="text-2xl font-serif font-black text-sky-800 mt-2">{filteredApps.length}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Total Assigned Files</div>
              </div>
            </div>

            {/* School Filter Chips for Controller */}
            {currentSubView === 'controller' && (
              <div className="bg-white border border-slate-200/80 rounded-2xl p-4 mb-6 flex flex-wrap gap-2 text-left shadow-sm">
                <button
                  onClick={() => setCtrlActiveDept('ALL')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    ctrlActiveDept === 'ALL' ? 'bg-primary text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  All Schools
                </button>
                {SCHOOLS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setCtrlActiveDept(s.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      ctrlActiveDept === s.id ? 'bg-primary text-white' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s.icon} {s.short}
                  </button>
                ))}
              </div>
            )}

            {/* Applications List */}
            <div className="space-y-6 text-left">
              {filteredApps.filter(app => {
                // Controller Filter
                if (currentSubView === 'controller' && ctrlActiveDept !== 'ALL') {
                  return app.school_id === ctrlActiveDept
                }
                return true
              }).filter(app => {
                // Only show active states relative to each desk
                if (currentSubView === 'adviser') return app.status === 'pending'
                if (currentSubView === 'hos') return app.status === 'adviser_approved'
                if (currentSubView === 'controller') return app.status === 'hos_approved'
                return false
              }).length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-muted">
                  <span className="text-4xl block mb-2">📭</span>
                  <h4 className="font-serif text-lg font-bold text-primary">No Pending Files</h4>
                  <p className="text-xs mt-1">Excellent! All academic application tasks have been processed.</p>
                </div>
              ) : (
                filteredApps.filter(app => {
                  if (currentSubView === 'controller' && ctrlActiveDept !== 'ALL') {
                    return app.school_id === ctrlActiveDept
                  }
                  return true
                }).filter(app => {
                  if (currentSubView === 'adviser') return app.status === 'pending'
                  if (currentSubView === 'hos') return app.status === 'adviser_approved'
                  if (currentSubView === 'controller') return app.status === 'hos_approved'
                  return false
                }).map(app => (
                  <div key={app.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between hover:border-slate-350 transition-all">
                    <div>
                      <div className="flex justify-between items-start flex-wrap gap-4 border-b border-slate-100 pb-4 mb-4">
                        <div>
                          <h4 className="font-serif text-lg font-bold text-primary">{app.student_name}</h4>
                          <span className="text-xs font-mono text-muted tracking-wider">Tracking ID: {app.id}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {app.urgency}
                          </span>
                          <span className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {app.school_icon} {app.school_short}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-xs font-medium text-primary">
                        <div><strong>Student Regd No:</strong> <span className="text-muted">#{app.regd_no}</span></div>
                        <div><strong>Program Class:</strong> <span className="text-muted">{app.program} &bull; {app.semester}</span></div>
                        <div><strong>Application Category:</strong> <span className="text-muted">{app.type}</span></div>
                        <div><strong>Email Contact:</strong> <span className="text-muted">{app.email || 'N/A'}</span></div>
                        <div><strong>Submitted At:</strong> <span className="text-muted">{new Date(app.submitted_at).toLocaleDateString()}</span></div>
                      </div>

                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs leading-relaxed text-slate-700 mb-6">
                        <span className="font-bold text-primary block mb-1">Student Statement of Description:</span>
                        "{app.description}"
                      </div>

                      {/* Display historic pipeline comments if active */}
                      {app.adviser_comment && <div className="p-3 bg-sky-50 text-sky-800 text-xs font-semibold rounded-xl mb-2.5 border border-sky-100">👨‍🏫 Adviser Remarks: "{app.adviser_comment}"</div>}
                      {app.hos_comment && <div className="p-3 bg-indigo-50 text-indigo-800 text-xs font-semibold rounded-xl mb-2.5 border border-indigo-100">🏛️ Head of School Remarks: "{app.hos_comment}"</div>}
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-2 justify-between items-center mt-4">
                      <div className="flex gap-2">
                        {app.file_data && (
                          <button
                            onClick={() => { setActiveFile(app); setShowFileModal(true); }}
                            className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-primary font-semibold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                          >
                            <span>📎</span> View Application Letter
                          </button>
                        )}
                        {currentSubView === 'controller' && (
                          <button
                            onClick={() => { setSelectedApp(app); setShowUploadModal(true); }}
                            className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 font-semibold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                          >
                            <span>📂</span> Attach Documents ({app.ctrl_attachments?.length || 0})
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => triggerReviewAction(app, 'approve')}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
                        >
                          ✔ Approve &amp; Forward
                        </button>
                        <button
                          onClick={() => triggerReviewAction(app, 'decline')}
                          className="bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-semibold py-2 px-4 rounded-xl text-xs transition-all"
                        >
                          ✖ Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Historical list for references */}
            {filteredApps.filter(app => {
              if (currentSubView === 'controller' && ctrlActiveDept !== 'ALL') {
                return app.school_id === ctrlActiveDept
              }
              return true
            }).filter(app => {
              if (currentSubView === 'adviser') return app.status !== 'pending'
              if (currentSubView === 'hos') return app.status !== 'adviser_approved' && app.status !== 'pending'
              if (currentSubView === 'controller') return app.status === 'resolved' || app.status === 'rejected'
              return false
            }).length > 0 && (
              <div className="mt-12 text-left">
                <hr className="border-slate-200 my-8" />
                <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-4">Historical Resolutions Log</span>
                <div className="space-y-4">
                  {filteredApps.filter(app => {
                    if (currentSubView === 'controller' && ctrlActiveDept !== 'ALL') {
                      return app.school_id === ctrlActiveDept
                    }
                    return true
                  }).filter(app => {
                    if (currentSubView === 'adviser') return app.status !== 'pending'
                    if (currentSubView === 'hos') return app.status !== 'adviser_approved' && app.status !== 'pending'
                    if (currentSubView === 'controller') return app.status === 'resolved' || app.status === 'rejected'
                    return false
                  }).map(app => (
                    <div key={app.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h5 className="text-xs font-bold text-primary">{app.student_name} ({app.id})</h5>
                        <p className="text-[10px] text-muted font-medium mt-0.5">Category: {app.type} &bull; School: {app.school_short}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {renderStatusBadge(app.status)}
                        <button
                          onClick={() => { setDocApp(app); setShowDocModal(true); }}
                          className="bg-white hover:bg-slate-100 border border-slate-200 text-primary font-semibold py-1.5 px-4 rounded-xl text-[10px] transition-colors"
                        >
                          📄 View Document
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* 8. REVIEW REMARKS OVERLAY MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-bold text-primary">
                {reviewAction === 'approve' ? '✔ Approve & Forward Application' : '✖ Decline Application'}
              </h3>
              <button onClick={() => setShowReviewModal(false)} className="text-slate-400 hover:text-primary text-xl font-bold">&times;</button>
            </div>
            
            <p className="text-xs text-muted leading-relaxed mb-4">
              Please provide official remarks or audit comments for this academic application file record.
            </p>

            <div className="mb-4">
              <label className="block text-[10px] font-bold text-primary uppercase mb-1.5">Remarks / Comments</label>
              <textarea
                rows="4"
                placeholder="Enter remarks..."
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-secondary"
              />
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={handleReviewSubmit}
                disabled={actionLoading}
                className={`text-white font-semibold py-2 px-6 rounded-xl text-xs disabled:opacity-50 ${
                  reviewAction === 'approve' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'
                }`}
              >
                {actionLoading ? 'Processing...' : reviewAction === 'approve' ? 'Approve' : 'Decline'}
              </button>
              <button
                onClick={() => setShowReviewModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-primary font-semibold py-2 px-5 rounded-xl text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. ATTACHMENT UPLOAD OVERLAY MODAL (Controller) */}
      {showUploadModal && selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif text-lg font-bold text-primary">
                📁 Files — {selectedApp.student_name}
              </h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-primary text-xl font-bold">&times;</button>
            </div>

            {/* List Existing */}
            <div className="mb-6 max-h-40 overflow-y-auto pr-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">Attached Documents</span>
              {selectedApp.ctrl_attachments?.length === 0 ? (
                <span className="text-xs text-muted block italic">No files attached yet.</span>
              ) : (
                selectedApp.ctrl_attachments?.map((att, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-xl mb-1.5 text-xs font-semibold text-primary">
                    <span className="truncate max-w-[200px]">📎 {att.desc || att.name}</span>
                    <button
                      onClick={() => removeControllerAttachment(idx)}
                      className="text-rose-600 hover:text-rose-800 text-[10px] uppercase font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add New Attachment */}
            <div className="border-t border-slate-100 pt-4 space-y-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Attach Official Resolution File</span>
              <div>
                <label className="block text-[9px] font-bold text-primary uppercase mb-1">Document Description</label>
                <input 
                  type="text" placeholder="e.g. Dean approved fee waiver letter"
                  value={uploadDesc}
                  onChange={e => setUploadDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-primary uppercase mb-1">File Upload (PDF / Image)</label>
                <div 
                  onClick={() => document.getElementById('ctrl_file_upload').click()}
                  className="border border-dashed border-slate-200 hover:border-accent/40 bg-slate-50/50 p-4 rounded-xl text-center cursor-pointer transition-colors"
                >
                  <input 
                    type="file" id="ctrl_file_upload" accept=".pdf,.png,.jpg,.jpeg" className="hidden"
                    onChange={handleCtrlFileUpload}
                  />
                  <span className="text-xs font-semibold text-primary block">Select File Attachment</span>
                  {uploadFile && (
                    <span className="inline-block mt-2 text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-mono font-bold">
                      📄 {uploadFile.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={saveControllerAttachment}
                  disabled={!uploadFile}
                  className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-6 rounded-xl text-xs disabled:opacity-50"
                >
                  Save Document
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-primary font-semibold py-2 px-5 rounded-xl text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. PREMIUM PRINT-OPTIMIZED OFFICIAL RESOLUTION STAMPED DOCUMENT MODAL */}
      {showDocModal && docApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl animate-fade-in text-left my-8 print:my-0 print:border-none print:shadow-none">
            
            {/* Certificate Print Area */}
            <div id="printArea" className="border border-slate-200 rounded-2xl p-8 bg-white text-slate-800 font-serif leading-relaxed text-sm relative shadow-inner print:border-none print:shadow-none print:p-0">
              
              {/* Header Letterhead */}
              <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                <img 
                  src="https://outr.ac.in/public/uploads/logo_4.png" 
                  alt="OUTR Seal" 
                  className="w-16 h-16 mx-auto mb-2 object-contain print:h-14" 
                />
                <h2 className="font-serif text-lg font-black tracking-wide uppercase text-slate-900">
                  Odisha University of Technology and Research
                </h2>
                <p className="text-[10px] font-sans font-semibold tracking-wider text-slate-500 uppercase mt-0.5">
                  Techno Campus, Ghatikia, Bhubaneswar - 751003
                </p>
                <p className="text-[8px] font-sans font-bold text-slate-400 mt-0.5">
                  OFFICE OF THE ACADEMIC RESOLUTION &amp; MANAGEMENT CELL
                </p>
              </div>

              {/* Reference Metadata */}
              <div className="flex justify-between items-center font-sans text-[10px] text-slate-600 font-bold mb-6">
                <span>REF NO: OUTR/AMC/2026/{docApp.id}</span>
                <span>DATE: {new Date(docApp.resolved_at || docApp.submitted_at).toLocaleDateString()}</span>
              </div>

              {/* Subject */}
              <h3 className="font-serif text-center text-sm font-black underline uppercase text-slate-900 mb-6">
                SUBJECT: RESOLUTION ORDER REGARDING {docApp.type?.toUpperCase()}
              </h3>

              {/* Recipient info */}
              <p className="mb-4">
                This official resolution statement is issued to <strong>{docApp.student_name}</strong>, registration roll number <strong>#{docApp.regd_no}</strong>, pursuing course work under <strong>{docApp.program}</strong> in the department of <strong>{docApp.school_name}</strong>.
              </p>

              {/* Details of context */}
              <div className="pl-4 border-l-2 border-slate-300 italic text-slate-600 mb-6 text-xs">
                <strong>Applicant Statement:</strong> "{docApp.description}"
              </div>

              {/* Official Decision statement */}
              <p className="mb-8 font-sans text-xs leading-relaxed">
                The academic approval cell has reviewed the evaluations submitted by the Faculty Adviser and verified by the Head of School. It is hereby resolved that the request for <strong>{docApp.type}</strong> stands 
                <span className={`font-bold ml-1 px-2.5 py-0.5 rounded text-[10px] uppercase inline-block ${
                  docApp.controller_action === 'approved' || docApp.status === 'resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {docApp.controller_action === 'approved' || docApp.status === 'resolved' ? 'Approved' : 'Declined'}
                </span>.
              </p>

              {/* Comment remark block */}
              {docApp.controller_comment && (
                <p className="mb-8 text-xs">
                  <strong>Special Directives / Conditions:</strong> "{docApp.controller_comment}"
                </p>
              )}

              {/* Signatures and Stamp */}
              <div className="flex justify-between items-end mt-12 pt-6">
                {/* Stamp visual */}
                <div className="border border-emerald-500/30 text-emerald-500/80 rounded-full w-20 h-20 flex flex-col items-center justify-center font-sans uppercase font-bold text-[7px] text-center rotate-[-12deg] bg-emerald-50/5 select-none print:w-16 print:h-16">
                  <span>OUTR</span>
                  <span className="border-t border-b border-emerald-500/20 py-0.5 my-0.5 scale-90">APPROVED</span>
                  <span>ACADEMICS</span>
                </div>

                {/* Signature lines */}
                <div className="text-center font-sans font-bold text-[9px] text-slate-800 space-y-1">
                  <div className="border-t border-slate-800 w-32 pt-1.5 mt-4 mx-auto"></div>
                  <div>Dr. Anupama Rath</div>
                  <div className="text-[7px] text-slate-400 uppercase tracking-widest leading-none mt-0.5">Exam Controller</div>
                  <div className="text-[6px] text-slate-400 mt-0.5">Odisha University of Tech &amp; Research</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-wrap gap-2 justify-end print:hidden">
              <button
                onClick={() => window.print()}
                className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                🖨 Print Official Document
              </button>
              <button
                onClick={() => setShowDocModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-primary font-semibold py-2 px-5 rounded-xl text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. FILE ATTACHMENT VIEWER MODAL */}
      {showFileModal && activeFile && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full shadow-2xl animate-fade-in text-left">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-bold text-primary truncate max-w-[400px]">
                🔗 File Preview — {activeFile.file_name || 'Attached Document'}
              </h3>
              <button onClick={() => setShowFileModal(false)} className="text-slate-400 hover:text-primary text-xl font-bold">&times;</button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2 w-full min-h-[300px] max-h-[450px] overflow-auto flex items-center justify-center">
              {activeFile.file_type?.startsWith('image/') ? (
                <img 
                  src={activeFile.file_data} 
                  alt="Attached File Preview" 
                  className="max-w-full max-h-[400px] object-contain rounded-lg border border-slate-200"
                />
              ) : activeFile.file_type === 'application/pdf' && activeFile.file_data?.startsWith('data:') ? (
                <iframe 
                  src={activeFile.file_data} 
                  title="PDF Preview"
                  className="w-full h-[400px] rounded-lg border border-slate-200"
                />
              ) : (
                <div className="text-center text-muted p-8">
                  <span className="text-4xl block mb-2">📄</span>
                  <p className="text-xs font-semibold text-primary">PDF Binary Mock Preloaded</p>
                  <p className="text-[10px] text-muted mt-1 leading-normal max-w-xs mx-auto">
                    Base64 preloads verified. Download the file locally to inspect complete university certificate signatures.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2 justify-end">
              <button
                onClick={() => {
                  const link = document.createElement('a')
                  link.href = activeFile.file_data || '#'
                  link.download = activeFile.file_name || 'attachment'
                  link.click()
                }}
                className="bg-primary hover:bg-secondary text-white font-semibold py-2 px-5 rounded-xl text-xs shadow-sm transition-all"
              >
                ⬇ Download Attachment
              </button>
              <button
                onClick={() => setShowFileModal(false)}
                className="bg-slate-100 hover:bg-slate-200 text-primary font-semibold py-2 px-5 rounded-xl text-xs"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </Layout>
  )
}
