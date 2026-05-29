/* eslint-disable react-hooks/set-state-in-effect, no-unused-vars, no-empty, react-hooks/exhaustive-deps */
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

const DEFAULT_NAMES = {
  admin: 'Super Admin Registry',
  warden: 'Mr. Anjan Kumar Sahoo',
  adviser: 'Dr. Debasis Gountia',
  hos: 'Prof. Sangram Mohanty',
  dean_academic: 'Dr. Ranjan Kumar Senapati',
  dean_pga: 'Dr. Debabrata Dhupal',
  controller: 'Dr. Anupama Rath',
  student: 'Student Portal'
}

export default function FileTrackingDashboard({ role, onSignOut, onNavigate, sessionUser }) {
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
  const [forwardRoute, setForwardRoute] = useState('controller')
  const [actionLoading, setActionLoading] = useState(false)

  // Document Modal State
  const [showDocModal, setShowDocModal] = useState(false)
  const [docApp, setDocApp] = useState(null)

  // File Viewer Modal State
  const [showFileModal, setShowFileModal] = useState(false)
  const [activeFile, setActiveFile] = useState(null)

  // Reusable Premium Dialog/Confirm Modal State
  const [customModal, setCustomModal] = useState({
    show: false,
    title: '',
    message: '',
    type: 'info', // 'success' | 'error' | 'info' | 'warning' | 'confirm'
    onConfirm: null
  })

  const showAlert = (message, type = 'info', title = '') => {
    let defaultTitle = 'Notice'
    if (type === 'success') defaultTitle = 'Success'
    else if (type === 'error') defaultTitle = 'Error Occurred'
    else if (type === 'warning') defaultTitle = 'Attention Required'
    
    setCustomModal({
      show: true,
      title: title || defaultTitle,
      message,
      type,
      onConfirm: null
    })
  }

  const showConfirm = (message, onConfirm, title = 'Confirm Action') => {
    setCustomModal({
      show: true,
      title,
      message,
      type: 'confirm',
      onConfirm
    })
  }

  // Controller Specific State
  const [ctrlActiveDept, setCtrlActiveDept] = useState('ALL')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadDesc, setUploadDesc] = useState('')
  const [uploadFile, setUploadFile] = useState(null)

  // Controller Sub-Desk State
  const [controllerTab, setControllerTab] = useState('clearance') // 'clearance', 'grades', 'admit_cards'
  const [gradesList, setGradesList] = useState([])
  const [admitCardsList, setAdmitCardsList] = useState([])
  const [loadingGrades, setLoadingGrades] = useState(false)
  const [loadingAdmitCards, setLoadingAdmitCards] = useState(false)

  // Grade sheet form state
  const [gradeForm, setGradeForm] = useState({
    name: '',
    regd_no: '',
    class_name: '',
    semester: '1st Semester',
    exam_type: 'Regular',
    status: 'PASS'
  })
  const [gradeSubjects, setGradeSubjects] = useState([{ subName: '', subCode: '', credits: 4, secured: 9, total: 10 }])
  const [searchGradesQuery, setSearchGradesQuery] = useState('')

  // Admit card form state
  const [admitForm, setAdmitForm] = useState({
    name: '',
    regd_no: '',
    branch: 'MCA',
    semester: '1st Semester',
    academic_year: '2025-26',
    exam_type: 'Regular Examinations',
    dob: ''
  })
  const [admitSubjects, setAdmitSubjects] = useState([{ code: '', name: '', date: '', time: '2:00 PM – 5:00 PM' }])
  const [editingAdmitCardId, setEditingAdmitCardId] = useState(null)
  const [showAdmitModal, setShowAdmitModal] = useState(false)
  const [viewingAdmitCard, setViewingAdmitCard] = useState(null)
  const [searchAdmitQuery, setSearchAdmitQuery] = useState('')

  // Real-time Push Notifications Toast State
  const [toasts, setToasts] = useState([])

  // 1. Sync Role props to internal navigation
  useEffect(() => {
    if (role === 'adviser') setCurrentSubView('adviser')
    else if (role === 'hos') setCurrentSubView('hos')
    else if (role === 'dean_pga') setCurrentSubView('dean_pga')
    else if (role === 'dean_academic') setCurrentSubView('dean_academic')
    else if (role === 'controller') setCurrentSubView('controller')
    else setCurrentSubView('landing')
  }, [role])

  // 2. Fetch user profile & applications
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true)
        
        if (sessionUser && sessionUser.role === role) {
          setUserProfile(sessionUser)
        } else {
          // 2a. Fetch Auth User and Profiles safely with isolated try-catches
          let user = null
          try {
            const res = await supabase.auth.getUser()
            user = res.data?.user
          } catch (e) {}

          if (user) {
            try {
              const { data: profile, error: profileErr } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()
                
              if (!profileErr && profile) {
                setUserProfile(profile)
              } else {
                // Try metadata fallback
                const metaRole = user.user_metadata?.role || role || 'student'
                const metaSchool = user.user_metadata?.school_id || 'SCS'
                const defaultName = DEFAULT_NAMES[metaRole] || 'Academic Authority'
                setUserProfile({
                  name: user.user_metadata?.name || defaultName,
                  role: metaRole,
                  school_id: role === 'controller' ? null : metaSchool
                })
              }
            } catch (profileErr) {
              const metaRole = user.user_metadata?.role || role || 'student'
              const metaSchool = user.user_metadata?.school_id || 'SCS'
              const defaultName = DEFAULT_NAMES[metaRole] || 'Academic Authority'
              setUserProfile({
                name: user.user_metadata?.name || defaultName,
                role: metaRole,
                school_id: role === 'controller' ? null : metaSchool
              })
            }
          } else {
            const metaRole = role || 'student'
            const metaSchool = role === 'controller' ? null : 'SCS'
            setUserProfile({
              name: DEFAULT_NAMES[metaRole] || 'Academic Authority',
              role: metaRole,
              school_id: metaSchool
            })
          }
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
  }, [role, sessionUser])

  // Fetch grades from Supabase
  async function fetchGrades() {
    try {
      setLoadingGrades(true)
      const { data, error } = await supabase
        .from('student_grades')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error && data) {
        setGradesList(data)
      }
    } catch (e) {
      console.error('Error fetching grades:', e)
    } finally {
      setLoadingGrades(false)
    }
  }

  // Fetch admit cards from Supabase
  async function fetchAdmitCards() {
    try {
      setLoadingAdmitCards(true)
      const { data, error } = await supabase
        .from('student_admit_cards')
        .select('*')
        .order('issued_at', { ascending: false })
      if (!error && data) {
        setAdmitCardsList(data)
      }
    } catch (e) {
      console.error('Error fetching admit cards:', e)
    } finally {
      setLoadingAdmitCards(false)
    }
  }

  // Sync databases for active desks
  useEffect(() => {
    if (role === 'controller' || role === 'student') {
      fetchGrades()
      fetchAdmitCards()
    }
  }, [role, userProfile])

  // Grade Card Form Handlers
  async function handleSaveGrade(e) {
    e.preventDefault()
    if (!gradeForm.name || !gradeForm.regd_no || !gradeForm.class_name) {
      showAlert('Please fill all student details.', 'warning')
      return
    }
    const activeSubjects = gradeSubjects.filter(s => s.subName && s.subCode)
    if (activeSubjects.length === 0) {
      showAlert('Please add at least one subject.', 'warning')
      return
    }

    try {
      const { error } = await supabase
        .from('student_grades')
        .insert([{
          regd_no: gradeForm.regd_no,
          name: gradeForm.name,
          class_name: gradeForm.class_name,
          semester: gradeForm.semester,
          exam_type: gradeForm.exam_type,
          status: gradeForm.status,
          subjects: activeSubjects
        }])

      if (error) throw error
      showAlert('Semester Grade Sheet saved successfully!', 'success')
      setGradeForm({
        name: '',
        regd_no: '',
        class_name: '',
        semester: '1st Semester',
        exam_type: 'Regular',
        status: 'PASS'
      })
      setGradeSubjects([{ subName: '', subCode: '', credits: 4, secured: 9, total: 10 }])
      fetchGrades()
    } catch (err) {
      showAlert('Error saving grade sheet: ' + err.message, 'error')
    }
  }

  function handleDeleteGrade(id) {
    showConfirm('Are you sure you want to delete this grade sheet record?', async () => {
      try {
        const { error } = await supabase
          .from('student_grades')
          .delete()
          .eq('id', id)
        if (error) throw error
        showAlert('Record deleted successfully!', 'success')
        fetchGrades()
      } catch (err) {
        showAlert('Error deleting grade record: ' + err.message, 'error')
      }
    })
  }

  // Admit Card Form Handlers
  async function handleSaveAdmitCard() {
    if (!admitForm.name || !admitForm.regd_no || !admitForm.dob) {
      showAlert('Please fill all student details, including Date of Birth.', 'warning')
      return
    }
    const activeSubs = admitSubjects.filter(s => s.code && s.name)
    if (activeSubs.length === 0) {
      showAlert('Please add at least one exam schedule subject.', 'warning')
      return
    }

    try {
      if (editingAdmitCardId) {
        const { error } = await supabase
          .from('student_admit_cards')
          .update({
            name: admitForm.name,
            regd_no: admitForm.regd_no,
            branch: admitForm.branch,
            semester: admitForm.semester,
            academic_year: admitForm.academic_year,
            exam_type: admitForm.exam_type,
            dob: admitForm.dob,
            subjects: activeSubs
          })
          .eq('id', editingAdmitCardId)
        if (error) throw error
        showAlert('Admit Card details updated!', 'success')
      } else {
        const { error } = await supabase
          .from('student_admit_cards')
          .insert([{
            name: admitForm.name,
            regd_no: admitForm.regd_no,
            branch: admitForm.branch,
            semester: admitForm.semester,
            academic_year: admitForm.academic_year,
            exam_type: admitForm.exam_type,
            dob: admitForm.dob,
            subjects: activeSubs
          }])
        if (error) throw error
        showAlert('Admit Card issued successfully!', 'success')
      }
      setShowAdmitModal(false)
      setEditingAdmitCardId(null)
      fetchAdmitCards()
    } catch (err) {
      showAlert('Error saving admit card: ' + err.message, 'error')
    }
  }

  function handleDeleteAdmitCard(id) {
    showConfirm('Are you sure you want to delete this admit card record?', async () => {
      try {
        const { error } = await supabase
          .from('student_admit_cards')
          .delete()
          .eq('id', id)
        if (error) throw error
        showAlert('Record deleted successfully!', 'success')
        fetchAdmitCards()
      } catch (err) {
        showAlert('Error deleting admit card: ' + err.message, 'error')
      }
    })
  }

  // Supabase Realtime Channels for Live floating push toasts
  useEffect(() => {
    const trackingSubscription = supabase
      .channel('public-file-tracking-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'file_tracking' }, (payload) => {
        let msg = ''
        if (payload.eventType === 'INSERT') {
          msg = `🔔 New Clearance Request submitted by ${payload.new.student_name} (${payload.new.student_regd})!`
        } else if (payload.eventType === 'UPDATE') {
          // If status resolved or rejected
          if (payload.new.status === 'resolved') {
            msg = `✅ Clearance APPROVED for student ${payload.new.student_name}!`
          } else if (payload.new.status === 'rejected') {
            msg = `❌ Clearance REJECTED for student ${payload.new.student_name}.`
          } else {
            msg = `ℹ️ Timelines updated for student ${payload.new.student_name}.`
          }
        }

        if (msg) {
          const id = Date.now()
          setToasts(prev => [...prev, { id, text: msg }])
          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
          }, 4500)
        }

        // Auto-refresh applications list to synchronize screen state!
        fetchAllApplications()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(trackingSubscription)
    }
  }, [role, userProfile])

  // 2c. Auto-fill student request form when profile loads
  useEffect(() => {
    if (userProfile && role === 'student') {
      let regd = ''
      if (userProfile.email) {
        const match = userProfile.email.match(/^(\d+)/)
        if (match) regd = match[1]
      }
      if (!regd && userProfile.name) {
        const digits = userProfile.name.match(/\d+/)
        if (digits) regd = digits[0]
      }
      if (!regd) {
        regd = '2201011' // standard fallback
      }
      
      setStudentForm(prev => ({
        ...prev,
        name: userProfile.name || prev.name,
        email: userProfile.email || prev.email,
        school_id: userProfile.school_id || prev.school_id || 'SCS',
        regd_no: prev.regd_no || regd
      }))
    }
  }, [userProfile, role])

  // Fetch applications from Supabase
  async function fetchAllApplications() {
    try {
      const { data, error } = await supabase
        .from('file_tracking')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      const localApps = JSON.parse(localStorage.getItem('OUTR_APPLICATIONS') || '[]')
      
      if (!data || data.length === 0) {
        if (localApps.length > 0) {
          setApplications(localApps)
        } else {
          loadSimulatedData()
        }
      } else {
        // Map database records to stateful app format
        const mappedData = data.map(dbApp => mapDbAppToLocal(dbApp))
        
        // Merge cloud applications with local ones!
        // If a local application has a more advanced status (e.g. approved/forwarded) than the database one,
        // we keep the local state so that local testing works flawlessly!
        const mergedApps = mappedData.map(dbApp => {
          const localMatch = localApps.find(la => la.id === dbApp.id)
          if (localMatch) {
            const statusWeights = {
              'pending': 1,
              'adviser_approved': 2,
              'adviser_declined': 2,
              'hos_approved': 3,
              'hos_declined': 3,
              'resolved': 4,
              'rejected': 4
            }
            const dbWeight = statusWeights[dbApp.status] || 0
            const localWeight = statusWeights[localMatch.status] || 0
            if (localWeight > dbWeight) {
              return { ...dbApp, ...localMatch }
            }
          }
          return dbApp
        })
        
        // Add any purely local applications that are not in the database yet
        const dbIds = new Set(mappedData.map(a => a.id))
        for (const la of localApps) {
          if (!dbIds.has(la.id)) {
            mergedApps.push(la)
          }
        }
        
        setApplications(mergedApps)
        localStorage.setItem('OUTR_APPLICATIONS', JSON.stringify(mergedApps))
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

    let status = 'pending'
    if (dbApp.controller_status !== 'Pending') {
      status = dbApp.controller_status === 'Approved' ? 'resolved' : 'rejected'
    } else if (dbApp.dean_status && dbApp.dean_status !== 'Pending') {
      status = dbApp.dean_status === 'Approved' ? 'resolved' : 'rejected'
    } else if (dbApp.hos_status !== 'Pending') {
      status = dbApp.hos_status === 'Approved' ? 'hos_approved' : 'hos_declined'
    } else if (dbApp.adviser_status !== 'Pending') {
      status = dbApp.adviser_status === 'Approved' ? 'adviser_approved' : 'adviser_declined'
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
      forwarded_to: dbApp.forwarded_to || null,
      adviser_comment: dbApp.adviser_name ? dbApp.adviser_name.split('Comment:')[1] || '' : '',
      hos_comment: dbApp.hos_name ? dbApp.hos_name.split('Comment:')[1] || '' : '',
      controller_comment: dbApp.controller_name ? dbApp.controller_name.split('Comment:')[1] || '' : '',
      dean_comment: dbApp.dean_name ? dbApp.dean_name.split('Comment:')[1] || '' : '',
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
    
    const { name, regd_no, school_id, program, semester, email, type, description } = studentForm
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
      urgency: 'Normal',
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
        urgency: 'Normal',
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
        name: '', regd_no: '', school_id: '', program: '', semester: '', email: '', type: '', description: ''
      })
      setStudentFile(null)
      fetchAllApplications()
    } catch (err) {
      console.warn('Database insert restricted or offline, simulating locally:', err.message)
      const updatedList = [newApp, ...applications]
      updateApplicationsState(updatedList)
      setStudentFormSuccess(appId)
      setStudentForm({
        name: '', regd_no: '', school_id: '', program: '', semester: '', email: '', type: '', description: ''
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
        a => a.regd_no.toLowerCase() === trackRegd.trim().toLowerCase() ||
             a.id.toLowerCase() === trackRegd.trim().toLowerCase()
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
    else if (role === 'dean_pga' || role === 'dean_academic') statusUpdate = reviewAction === 'approve' ? 'resolved' : 'rejected'
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
          hos_name: `Name: ${userProfile?.name} | Comment: ${remarks}`,
          forwarded_to: reviewAction === 'approve' ? forwardRoute : null
        }
      } else if (role === 'dean_pga' || role === 'dean_academic') {
        updatePayload = {
          dean_status: reviewAction === 'approve' ? 'Approved' : 'Rejected',
          dean_name: `Name: ${userProfile?.name} | Comment: ${remarks}`
        }
      } else if (role === 'controller') {
        updatePayload = {
          controller_status: reviewAction === 'approve' ? 'Approved' : 'Rejected',
          controller_name: `Name: ${userProfile?.name} | Comment: ${remarks}`
        }
      }

      const { data, error } = await supabase
        .from('file_tracking')
        .update(updatePayload)
        .eq('file_no', selectedApp.id)
        .select()

      if (error) throw error
      if (!data || data.length === 0) {
        throw new Error('Supabase RLS update block. Custom clearance role permission mismatch.')
      }

      fetchAllApplications()
      setShowReviewModal(false)

      if ((role === 'controller' || role === 'dean_pga' || role === 'dean_academic') && reviewAction === 'approve') {
        // Open generated doc modal
        setDocApp({
          ...selectedApp,
          status: 'resolved',
          controller_action: 'approved',
          controller_comment: remarks,
          dean_comment: remarks,
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
            upd.forwarded_to = reviewAction === 'approve' ? forwardRoute : null
          } else if (role === 'dean_pga' || role === 'dean_academic') {
            upd.dean_comment = remarks
            upd.resolved_at = now
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
      
      if ((role === 'controller' || role === 'dean_pga' || role === 'dean_academic') && reviewAction === 'approve') {
        setDocApp({
          ...selectedApp,
          status: 'resolved',
          controller_action: 'approved',
          controller_comment: remarks,
          dean_comment: remarks,
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
      showAlert('File exceeds 10 MB limit.', 'warning')
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
    // Deans and Controllers have university-wide clearance scopes
    return true
  })

  const pendingCount = filteredApps.filter(a => {
    if (role === 'adviser') return a.status === 'pending'
    if (role === 'hos') return a.status === 'adviser_approved'
    if (role === 'dean_pga') return a.status === 'hos_approved' && a.forwarded_to === 'dean_pga'
    if (role === 'dean_academic') return a.status === 'hos_approved' && a.forwarded_to === 'dean_academic'
    if (role === 'controller') return a.status === 'hos_approved' && (a.forwarded_to === 'controller' || !a.forwarded_to)
    return false
  }).length

  const approvedCount = filteredApps.filter(a => {
    if (role === 'adviser') return ['adviser_approved', 'hos_approved', 'resolved'].includes(a.status)
    if (role === 'hos') return ['hos_approved', 'resolved'].includes(a.status)
    if (role === 'dean_pga' || role === 'dean_academic') return a.status === 'resolved' && a.forwarded_to === role
    if (role === 'controller') return a.status === 'resolved' && (a.forwarded_to === 'controller' || !a.forwarded_to)
    return false
  }).length

  const declinedCount = filteredApps.filter(a => {
    if (role === 'adviser') return a.status === 'adviser_declined'
    if (role === 'hos') return a.status === 'hos_declined'
    if (role === 'dean_pga' || role === 'dean_academic') return a.status === 'rejected' && a.forwarded_to === role
    if (role === 'controller') return a.status === 'rejected' && (a.forwarded_to === 'controller' || !a.forwarded_to)
    return false
  }).length

  return (
    <Layout onNavigate={onNavigate}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* LANDING DESK view */}
        {currentSubView === 'landing' && (
          <div className="animate-fade-in text-center max-w-4xl mx-auto select-none">
            {/* Shield and header */}
            <div className="w-20 h-20 mb-6 rounded-full bg-primary/5 border-2 border-accent/30 flex items-center justify-center mx-auto shadow-md shadow-primary/5 bg-white">
              <img 
                src="https://outr.ac.in/public/uploads/logo_4.png" 
                alt="OUTR Shield" 
                className="w-12 h-12 object-contain"
              />
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
                onClick={() => setCurrentSubView('my-results')}
                className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 hover:border-accent/40 hover:shadow-lg transition-all duration-300 text-left group"
              >
                <div className="text-3xl mb-4 group-hover:scale-105 transition-transform duration-300">📊</div>
                <h4 className="font-serif font-bold text-primary text-base mb-1.5">My Results &amp; Grades</h4>
                <p className="text-muted text-xs leading-relaxed">
                  Query your public university grade cards and review semester GPA summaries.
                </p>
              </div>

              <div 
                onClick={() => setCurrentSubView('my-admit-card')}
                className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 hover:border-accent/40 hover:shadow-lg transition-all duration-300 text-left group"
              >
                <div className="text-3xl mb-4 group-hover:scale-105 transition-transform duration-300">🎟️</div>
                <h4 className="font-serif font-bold text-primary text-base mb-1.5">Download Admit Card</h4>
                <p className="text-muted text-xs leading-relaxed">
                  Download and print your official exam admit schedule card after clearing dues.
                </p>
              </div>

              <div 
                onClick={onSignOut}
                className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 hover:border-accent/40 hover:shadow-lg transition-all duration-300 text-left group"
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
                    {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map((sem, i) => (
                      <option key={i} value={`${sem} Semester`}>{sem} Semester</option>
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
                      setStudentForm({ name:'', regd_no:'', school_id:'', program:'', semester:'', email:'', type:'', description:'' })
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
                              ['adviser_approved', 'hos_approved', 'hos_declined', 'rejected', 'resolved'].includes(app.status)
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
                              ['hos_approved', 'rejected', 'resolved'].includes(app.status)
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
                            <span className="text-[10px] font-bold block mt-2 text-primary">
                              {app.forwarded_to === 'dean_pga' ? 'Dean PGA' : app.forwarded_to === 'dean_academic' ? 'Dean Academic' : 'Exam Controller'}
                            </span>
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
                      {app.dean_comment && (
                        <div className="p-3 bg-purple-50 text-purple-800 text-xs font-semibold rounded-xl mb-2.5 border border-purple-100">
                          🎓 {app.forwarded_to === 'dean_pga' ? 'Dean PGA' : 'Dean Academic'} Remarks: "{app.dean_comment}"
                        </div>
                      )}
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

        {/* STUDENT RESULTS view */}
        {currentSubView === 'my-results' && (
          <div className="max-w-4xl mx-auto text-left animate-fade-in space-y-6">
            <button 
              onClick={() => setCurrentSubView('landing')}
              className="text-xs text-secondary hover:text-primary font-bold flex items-center gap-1.5 mb-6 transition-colors"
            >
              ← Back to Landing
            </button>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4 mb-6">
                <div>
                  <span className="text-xs font-bold text-accent uppercase tracking-widest">Controller registry</span>
                  <h3 className="font-serif text-2xl font-bold text-primary mt-1">My Semester Grade Sheets</h3>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Roll Number..." 
                    value={studentForm.regd_no} 
                    onChange={e => setStudentForm({...studentForm, regd_no: e.target.value})}
                    className="p-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-secondary"
                  />
                  <button 
                    onClick={fetchGrades} 
                    className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-xl text-[10px] uppercase transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {gradesList.filter(g => g.regd_no === studentForm.regd_no).length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-16 text-center text-muted">
                  <span className="text-4xl block mb-2">📋</span>
                  <h4 className="font-serif text-base font-bold text-primary">No Grade Sheets Found</h4>
                  <p className="text-xs mt-1">No semester grade sheets have been published for Roll Number #{studentForm.regd_no || 'N/A'}.</p>
                </div>
              ) : (
                gradesList.filter(g => g.regd_no === studentForm.regd_no).map(grade => {
                  // Calculate GPA
                  const activeSubs = grade.subjects || []
                  let totalCredits = 0
                  let weightedPoints = 0
                  activeSubs.forEach(s => {
                    const credits = Number(s.credits) || 0
                    const secured = Number(s.secured) || 0
                    totalCredits += credits
                    weightedPoints += (credits * secured)
                  })
                  const sgpa = totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : '0.00'

                  const handlePrintGrade = () => {
                    setViewingAdmitCard(null) // Make sure no admit card overlaps
                    const printSection = document.getElementById('print-area')
                    if (printSection) {
                      printSection.innerHTML = `
                        <div class="print-grade-card" style="font-family:'Times New Roman', serif; color: black; max-width: 800px; margin: 0 auto; padding: 20px; border: 3px double black;">
                          <div style="text-align: center; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 20px;">
                            <div style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">ଓଡ଼ିଶା ବୈଷୟିକ ଓ ଗବେଷଣା ବିଶ୍ୱବିଦ୍ୟାଳୟ</div>
                            <div style="font-size: 20px; font-weight: bold; text-transform: uppercase; margin-top: 4px;">Odisha University of Technology and Research</div>
                            <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #555;">Techno Campus, Ghatikia, Mahalaxmi Vihar, Bhubaneswar-751029</div>
                            <div style="font-size: 16px; font-weight: bold; text-transform: uppercase; margin-top: 12px; letter-spacing: 2px; border: 1px solid black; display: inline-block; padding: 4px 16px;">Semester Grade Card</div>
                          </div>

                          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; font-size: 13px;">
                            <div><strong>Student Name:</strong> ${grade.name}</div>
                            <div><strong>Registration Number:</strong> ${grade.regd_no}</div>
                            <div><strong>Course / Branch:</strong> ${grade.class_name}</div>
                            <div><strong>Semester:</strong> ${grade.semester} (${grade.exam_type})</div>
                          </div>

                          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
                            <thead>
                              <tr style="background: #f2f2f2;">
                                <th style="border: 1px solid black; padding: 6px; text-align: left;">Subject Code</th>
                                <th style="border: 1px solid black; padding: 6px; text-align: left;">Subject Name</th>
                                <th style="border: 1px solid black; padding: 6px; text-align: center;">Credits</th>
                                <th style="border: 1px solid black; padding: 6px; text-align: center;">Secured Grade Point</th>
                                <th style="border: 1px solid black; padding: 6px; text-align: center;">Grade</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${activeSubs.map(s => {
                                const pt = Number(s.secured) || 0
                                const ltr = pt >= 10 ? 'O' : pt >= 9 ? 'A+' : pt >= 8 ? 'A' : pt >= 7 ? 'B+' : pt >= 6 ? 'B' : pt >= 5 ? 'C' : 'F'
                                return `
                                  <tr>
                                    <td style="border: 1px solid black; padding: 6px; font-family: monospace;">${s.subCode}</td>
                                    <td style="border: 1px solid black; padding: 6px;">${s.subName}</td>
                                    <td style="border: 1px solid black; padding: 6px; text-align: center;">${s.credits}</td>
                                    <td style="border: 1px solid black; padding: 6px; text-align: center;">${s.secured} / ${s.total || 10}</td>
                                    <td style="border: 1px solid black; padding: 6px; text-align: center; font-weight: bold;">${ltr}</td>
                                  </tr>
                                `
                              }).join('')}
                            </tbody>
                          </table>

                          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid black; padding-top: 15px; margin-top: 20px; font-size: 13px;">
                            <div>
                              <strong>Semester Grade Point Average (SGPA):</strong> 
                              <span style="font-size: 16px; font-weight: bold; border-bottom: 2px solid black;">${sgpa}</span>
                            </div>
                            <div style="text-align: center;">
                              <div style="margin-bottom: 25px; font-style: italic;">Approved Authority</div>
                              <div style="font-size: 10px; font-weight: bold; text-transform: uppercase;">Controller of Examinations</div>
                            </div>
                          </div>
                        </div>
                      `
                      window.print()
                    }
                  }

                  return (
                    <div key={grade.id} className="border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center text-xs font-semibold text-primary">
                        🎓 {grade.class_name.toUpperCase()} &bull; {grade.semester.toUpperCase()} ({grade.exam_type.toUpperCase()}) &bull; STATUS: <span className="text-emerald-600 font-bold">{grade.status}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-primary">
                        <div><strong>Student Name:</strong> <span className="text-slate-500">{grade.name}</span></div>
                        <div><strong>Roll Number:</strong> <span className="text-slate-500 font-mono">#{grade.regd_no}</span></div>
                      </div>

                      <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-55 text-primary border-b border-slate-200">
                              <th className="p-3 pl-4">Code</th>
                              <th className="p-3">Subject Name</th>
                              <th className="p-3 text-center">Credits</th>
                              <th className="p-3 text-center">Grade Point</th>
                              <th className="p-3 text-center">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activeSubs.map((s, i) => {
                              const pt = Number(s.secured) || 0
                              const letter = pt >= 10 ? 'O' : pt >= 9 ? 'A+' : pt >= 8 ? 'A' : pt >= 7 ? 'B+' : pt >= 6 ? 'B' : pt >= 5 ? 'C' : 'F'
                              return (
                                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50">
                                  <td className="p-3 pl-4 font-mono text-slate-500">{s.subCode}</td>
                                  <td className="p-3 font-semibold text-primary">{s.subName}</td>
                                  <td className="p-3 text-center text-slate-500">{s.credits}</td>
                                  <td className="p-3 text-center text-slate-500 font-bold">{s.secured} / {s.total || 10}</td>
                                  <td className="p-3 text-center"><span className="bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">{letter}</span></td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-sm font-semibold text-primary">
                          Semester GPA (SGPA): <span className="text-lg text-secondary font-black underline">{sgpa}</span>
                        </div>
                        <button
                          onClick={handlePrintGrade}
                          className="bg-primary hover:bg-secondary text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          🖨️ Print Grade Sheet
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* STUDENT ADMIT CARD view */}
        {currentSubView === 'my-admit-card' && (
          <div className="max-w-4xl mx-auto text-left animate-fade-in space-y-6">
            <button 
              onClick={() => setCurrentSubView('landing')}
              className="text-xs text-secondary hover:text-primary font-bold flex items-center gap-1.5 mb-6 transition-colors"
            >
              ← Back to Landing
            </button>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4 mb-6">
                <div>
                  <span className="text-xs font-bold text-accent uppercase tracking-widest">Credentials Desk</span>
                  <h3 className="font-serif text-2xl font-bold text-primary mt-1">Download Exam Admit Card</h3>
                </div>
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Roll Number..." 
                    value={studentForm.regd_no} 
                    onChange={e => setStudentForm({...studentForm, regd_no: e.target.value})}
                    className="p-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-secondary"
                  />
                  <button 
                    onClick={fetchAdmitCards} 
                    className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-xl text-[10px] uppercase transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {admitCardsList.filter(ac => ac.regd_no === studentForm.regd_no).length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-16 text-center text-muted">
                  <span className="text-4xl block mb-2">🎟️</span>
                  <h4 className="font-serif text-base font-bold text-primary">No Issued Admit Card</h4>
                  <p className="text-xs mt-1">No exam admit card has been released for Roll Number #{studentForm.regd_no || 'N/A'}.</p>
                  <p className="text-[10px] mt-2 text-slate-400 font-semibold">Important: Admit cards are released by the Controller of Examinations after clearing all hostel &amp; department dues.</p>
                </div>
              ) : (
                admitCardsList.filter(ac => ac.regd_no === studentForm.regd_no).map(card => {
                  const hasCleared = applications.some(app => app.student_regd === studentForm.regd_no && app.status === 'resolved')

                  const handlePrintAdmit = () => {
                    const printSection = document.getElementById('print-area')
                    if (printSection) {
                      printSection.innerHTML = `
                        <div class="print-admit-card" style="font-family:'Times New Roman', serif; color: black; max-width: 800px; margin: 0 auto; padding: 20px; border: 2px solid black;">
                          <div style="display: flex; align-items: center; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 15px;">
                            <div style="flex-grow: 1; text-align: center;">
                              <div style="font-size: 13px; font-weight: bold; text-transform: uppercase;">ଓଡ଼ିଶା ବୈଷୟିକ ଓ ଗବେଷଣା ବିଶ୍ୱବିଦ୍ୟାଳୟ</div>
                              <div style="font-size: 18px; font-weight: bold; text-transform: uppercase; margin-top: 2px;">Odisha University of Technology and Research</div>
                              <div style="font-size: 10px; text-transform: uppercase; font-weight: bold; color: #555;">Techno Campus, Ghatikia, Bhubaneswar-751029</div>
                              <div style="font-size: 15px; font-weight: bold; text-transform: uppercase; margin-top: 8px; letter-spacing: 2px;">Official Exam Admit Card</div>
                            </div>
                          </div>

                          <div style="background: #f2f2f2; border: 1px solid black; text-align: center; padding: 5px; font-weight: bold; font-size: 12px; margin-bottom: 15px; text-transform: uppercase;">
                            ${card.branch} &nbsp;|&nbsp; ${card.semester} &nbsp;|&nbsp; AY: ${card.academic_year} &nbsp;|&nbsp; ${card.exam_type}
                          </div>

                          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 15px; font-size: 12px; border: 1px solid black; padding: 10px;">
                            <div><strong>Student Name:</strong> ${card.name}</div>
                            <div><strong>Registration Number:</strong> ${card.regd_no}</div>
                            <div><strong>Branch:</strong> ${card.branch}</div>
                            <div><strong>Date of Birth:</strong> ${card.dob}</div>
                            <div><strong>Clearance Status:</strong> ${hasCleared ? 'APPROVED' : 'PENDING APPROVED'}</div>
                            <div><strong>Issued At:</strong> ${card.issued_at ? new Date(card.issued_at).toLocaleString() : '—'}</div>
                          </div>

                          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
                            <thead>
                              <tr style="background: #e6e6e6;">
                                <th style="border: 1px solid black; padding: 5px; text-align: center;">Exam Date</th>
                                <th style="border: 1px solid black; padding: 5px; text-align: center;">Subject Code</th>
                                <th style="border: 1px solid black; padding: 5px; text-align: left;">Subject Name</th>
                                <th style="border: 1px solid black; padding: 5px; text-align: center;">Exam Session Time</th>
                                <th style="border: 1px solid black; padding: 5px; text-align: center;">Invigilator Signature</th>
                              </tr>
                            </thead>
                            <tbody>
                              ${(card.subjects || []).map(s => `
                                <tr>
                                  <td style="border: 1px solid black; padding: 6px; text-align: center;">${s.date ? new Date(s.date+'T00:00').toLocaleDateString() : '—'}</td>
                                  <td style="border: 1px solid black; padding: 6px; text-align: center; font-family: monospace;">${s.code}</td>
                                  <td style="border: 1px solid black; padding: 6px; text-align: left;">${s.name}</td>
                                  <td style="border: 1px solid black; padding: 6px; text-align: center;">${s.time}</td>
                                  <td style="border: 1px solid black; padding: 6px; text-align: center;">_______________</td>
                                </tr>
                              `).join('')}
                            </tbody>
                          </table>

                          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 12px; margin-top: 30px;">
                            <div style="text-align: center; border-top: 1px solid black; padding-top: 5px; margin-top: 20px;">
                              Candidate's Signature
                            </div>
                            <div style="text-align: center; border-top: 1px solid black; padding-top: 5px; margin-top: 20px; font-weight: bold;">
                              Controller of Examinations
                            </div>
                          </div>
                        </div>
                      `
                      window.print()
                    }
                  }

                  return (
                    <div key={card.id} className="border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                      
                      {/* Clearance Alert banner */}
                      {hasCleared ? (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl p-4 flex items-center gap-3 text-xs font-semibold">
                          <span>✅</span>
                          <div>
                            <span className="font-bold">Clearance Approved!</span>
                            <p className="text-[10px] mt-0.5 text-emerald-700">Your academic, library, and hostel clearance applications are fully resolved. This Admit Card is active and valid.</p>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 flex items-center gap-3 text-xs font-semibold">
                          <span>⚠️</span>
                          <div>
                            <span className="font-bold">Clearance Dues Pending!</span>
                            <p className="text-[10px] mt-0.5 text-rose-700 font-medium">You must complete approvals from all department desks (Adviser, HoS, Warden, Dean) to validate this Admit Card for the examination hall.</p>
                          </div>
                        </div>
                      )}

                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center text-xs font-semibold text-primary uppercase">
                        🎫 {card.branch} &bull; {card.semester} &bull; AY: {card.academic_year} &bull; {card.exam_type}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-medium text-primary">
                        <div><strong>Student Name:</strong> <span className="text-slate-500">{card.name}</span></div>
                        <div><strong>Registration No:</strong> <span className="text-slate-500 font-mono">#{card.regd_no}</span></div>
                        <div><strong>Date of Birth:</strong> <span className="text-slate-500">{card.dob}</span></div>
                      </div>

                      <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                        <table className="w-full text-xs text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-55 text-primary border-b border-slate-200">
                              <th className="p-3 pl-4">Exam Date</th>
                              <th className="p-3">Code</th>
                              <th className="p-3">Subject Name</th>
                              <th className="p-3 text-center">Timing</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(card.subjects || []).map((s, idx) => (
                              <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                                <td className="p-3 pl-4 font-semibold text-primary">{s.date ? new Date(s.date+'T00:00').toLocaleDateString() : '—'}</td>
                                <td className="p-3 font-mono text-slate-500">{s.code}</td>
                                <td className="p-3 font-semibold text-primary">{s.name}</td>
                                <td className="p-3 text-center text-slate-500">{s.time}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="border-t border-slate-100 pt-6 flex justify-end">
                        <button
                          onClick={handlePrintAdmit}
                          className="bg-primary hover:bg-secondary text-white font-bold py-2.5 px-6 rounded-xl text-xs shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          🖨️ Print Exam Admit Card
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* ROLE PROTECTED PORTAL VIEWS (Adviser, HoS, Dean PGA, Dean Academic, Controller) */}
        {['adviser', 'hos', 'dean_pga', 'dean_academic', 'controller'].includes(currentSubView) && (
          <div className="animate-fade-in">
            {/* Header Banner */}
            <div className="bg-white/80 border border-slate-200/80 backdrop-blur-md rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 shadow-sm text-left">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-accent/20">
                  <span className="text-3xl">
                    {currentSubView === 'adviser' ? '👨‍🏫' : currentSubView === 'hos' ? '🏛️' : currentSubView === 'dean_pga' ? '📜' : currentSubView === 'dean_academic' ? '🏫' : '⚖️'}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">OUTR Academics Cell</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mt-1">
                    {currentSubView === 'adviser' ? 'Faculty Adviser Desk' : currentSubView === 'hos' ? 'Head of School Review' : currentSubView === 'dean_pga' ? 'Dean PGA Clearance Desk' : currentSubView === 'dean_academic' ? 'Dean Academic Clearance Desk' : 'Exam Controller Panel'}
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

            {/* Sub-Desk Navigation Tabs for Controller */}
            {currentSubView === 'controller' && (
              <div className="flex border-b border-slate-200 mb-6 gap-2">
                <button
                  onClick={() => setControllerTab('clearance')}
                  className={`px-6 py-2.5 font-serif font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    controllerTab === 'clearance'
                      ? 'border-accent text-primary'
                      : 'border-transparent text-slate-400 hover:text-primary hover:border-slate-200'
                  }`}
                >
                  📄 Clearance Pipeline
                </button>
                <button
                  onClick={() => setControllerTab('grades')}
                  className={`px-6 py-2.5 font-serif font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    controllerTab === 'grades'
                      ? 'border-accent text-primary'
                      : 'border-transparent text-slate-400 hover:text-primary hover:border-slate-200'
                  }`}
                >
                  📊 Grade Cards Desk
                </button>
                <button
                  onClick={() => setControllerTab('admit_cards')}
                  className={`px-6 py-2.5 font-serif font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    controllerTab === 'admit_cards'
                      ? 'border-accent text-primary'
                      : 'border-transparent text-slate-400 hover:text-primary hover:border-slate-200'
                  }`}
                >
                  🎟️ Admit Cards Desk
                </button>
              </div>
            )}

            {(currentSubView !== 'controller' || controllerTab === 'clearance') && (
              <>
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
                if (currentSubView === 'dean_pga') return app.status === 'hos_approved' && app.forwarded_to === 'dean_pga'
                if (currentSubView === 'dean_academic') return app.status === 'hos_approved' && app.forwarded_to === 'dean_academic'
                if (currentSubView === 'controller') return app.status === 'hos_approved' && (app.forwarded_to === 'controller' || !app.forwarded_to)
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
                  if (currentSubView === 'dean_pga') return app.status === 'hos_approved' && app.forwarded_to === 'dean_pga'
                  if (currentSubView === 'dean_academic') return app.status === 'hos_approved' && app.forwarded_to === 'dean_academic'
                  if (currentSubView === 'controller') return app.status === 'hos_approved' && (app.forwarded_to === 'controller' || !app.forwarded_to)
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
              if (currentSubView === 'dean_pga' || currentSubView === 'dean_academic') return (app.status === 'resolved' || app.status === 'rejected') && app.forwarded_to === currentSubView
              if (currentSubView === 'controller') return (app.status === 'resolved' || app.status === 'rejected') && (app.forwarded_to === 'controller' || !app.forwarded_to)
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
                    if (currentSubView === 'dean_pga' || currentSubView === 'dean_academic') return (app.status === 'resolved' || app.status === 'rejected') && app.forwarded_to === currentSubView
                    if (currentSubView === 'controller') return (app.status === 'resolved' || app.status === 'rejected') && (app.forwarded_to === 'controller' || !app.forwarded_to)
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
          </>
        )}

        {/* CONTROLLER GRADE CARDS SUB-DESK */}
        {currentSubView === 'controller' && controllerTab === 'grades' && (
          <div className="space-y-8 animate-fade-in text-left">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl text-left">
                <span className="text-2xl">📋</span>
                <div className="text-2xl font-serif font-black text-amber-800 mt-2">{gradesList.length}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Total Grade Sheets</div>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl text-left">
                <span className="text-2xl">👤</span>
                <div className="text-2xl font-serif font-black text-emerald-800 mt-2">{new Set(gradesList.map(g => g.regd_no)).size}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Unique Students</div>
              </div>
              <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl text-left">
                <span className="text-2xl">Regular</span>
                <div className="text-2xl font-serif font-black text-sky-800 mt-2">{gradesList.filter(g => g.exam_type === 'Regular').length}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Regular Records</div>
              </div>
              <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl text-left">
                <span className="text-2xl">Back</span>
                <div className="text-2xl font-serif font-black text-rose-800 mt-2">{gradesList.filter(g => g.exam_type === 'Back').length}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Back Records</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-sans">
              {/* Form Card */}
              <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                <div>
                  <span className="text-xs font-bold text-accent uppercase tracking-widest">Entry Desk</span>
                  <h3 className="font-serif text-lg font-bold text-primary mt-1">Issue Semester Results</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">Enter student grades manually</p>
                </div>

                <form onSubmit={handleSaveGrade} className="space-y-4 text-xs font-semibold text-primary">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] mb-1">Student Full Name *</label>
                    <input 
                      type="text" required placeholder="e.g. Priyabrata Mohanty"
                      value={gradeForm.name}
                      onChange={e => setGradeForm({...gradeForm, name: e.target.value})}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] mb-1">Registration Roll No. *</label>
                    <input 
                      type="text" required placeholder="e.g. 2201011"
                      value={gradeForm.regd_no}
                      onChange={e => setGradeForm({...gradeForm, regd_no: e.target.value})}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] mb-1">Class / Branch *</label>
                    <input 
                      type="text" required placeholder="e.g. MCA"
                      value={gradeForm.class_name}
                      onChange={e => setGradeForm({...gradeForm, class_name: e.target.value})}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary font-medium text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] mb-1">Semester</label>
                      <select 
                        value={gradeForm.semester}
                        onChange={e => setGradeForm({...gradeForm, semester: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary bg-white font-medium text-sm"
                      >
                        {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(sem => (
                          <option key={sem} value={`${sem} Semester`}>{sem} Sem</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] mb-1">Exam Type</label>
                      <select 
                        value={gradeForm.exam_type}
                        onChange={e => setGradeForm({...gradeForm, exam_type: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary bg-white font-medium text-sm"
                      >
                        <option value="Regular">Regular</option>
                        <option value="Back">Back</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] mb-1.5 flex justify-between">
                      <span>Subjects &amp; Grades</span>
                      <button 
                        type="button"
                        onClick={() => setGradeSubjects([...gradeSubjects, { subName: '', subCode: '', credits: 4, secured: 9, total: 10 }])}
                        className="text-secondary hover:underline lowercase font-bold"
                      >
                        + Add Subject
                      </button>
                    </label>

                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {gradeSubjects.map((s, idx) => (
                        <div key={idx} className="border border-slate-150 p-2.5 rounded-xl bg-slate-50 relative space-y-2">
                          <button 
                            type="button"
                            onClick={() => setGradeSubjects(gradeSubjects.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-2 text-rose-500 hover:text-rose-700 text-sm font-bold"
                          >
                            ×
                          </button>
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" placeholder="Sub Code" required
                              value={s.subCode}
                              onChange={e => {
                                const newSubs = [...gradeSubjects]
                                newSubs[idx].subCode = e.target.value.toUpperCase()
                                setGradeSubjects(newSubs)
                              }}
                              className="p-2 border border-slate-200 rounded-lg text-[10px] font-semibold bg-white"
                            />
                            <input 
                              type="text" placeholder="Sub Name" required
                              value={s.subName}
                              onChange={e => {
                                const newSubs = [...gradeSubjects]
                                newSubs[idx].subName = e.target.value
                                setGradeSubjects(newSubs)
                              }}
                              className="p-2 border border-slate-200 rounded-lg text-[10px] font-semibold bg-white"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[8px] text-slate-400">Credits</label>
                              <input 
                                type="number" min="1" max="6" required
                                value={s.credits}
                                onChange={e => {
                                  const newSubs = [...gradeSubjects]
                                  newSubs[idx].credits = Number(e.target.value)
                                  setGradeSubjects(newSubs)
                                }}
                                className="w-full p-1 border border-slate-200 rounded text-[10px] bg-white text-center font-medium"
                              />
                            </div>
                            <div>
                              <label className="text-[8px] text-slate-400">Secured Pt</label>
                              <input 
                                type="number" min="0" max="10" step="0.1" required
                                value={s.secured}
                                onChange={e => {
                                  const newSubs = [...gradeSubjects]
                                  newSubs[idx].secured = Number(e.target.value)
                                  setGradeSubjects(newSubs)
                                }}
                                className="w-full p-1 border border-slate-200 rounded text-[10px] bg-white text-center font-medium"
                              />
                            </div>
                            <div>
                              <label className="text-[8px] text-slate-400">Total Pt</label>
                              <input 
                                type="number" min="10" max="10" required
                                value={s.total || 10}
                                onChange={e => {
                                  const newSubs = [...gradeSubjects]
                                  newSubs[idx].total = Number(e.target.value)
                                  setGradeSubjects(newSubs)
                                }}
                                className="w-full p-1 border border-slate-200 rounded text-[10px] bg-white text-center font-medium"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 rounded-xl uppercase tracking-wider text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Save Grade Sheet
                  </button>
                </form>
              </div>

              {/* Browse Lists Card */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center flex-wrap gap-3">
                    <div>
                      <span className="text-xs font-bold text-accent uppercase tracking-widest">Controller Archives</span>
                      <h3 className="font-serif text-lg font-bold text-primary mt-1">Grade sheet Records</h3>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search by student name or roll..."
                      value={searchGradesQuery}
                      onChange={e => setSearchGradesQuery(e.target.value)}
                      className="p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-secondary w-full sm:w-64"
                    />
                  </div>

                  <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-55 text-primary border-b border-slate-200 font-bold">
                          <th className="p-3 pl-4">Name</th>
                          <th className="p-3">Roll No</th>
                          <th className="p-3">Course</th>
                          <th className="p-3">Semester</th>
                          <th className="p-3 text-center">Subjects</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3 text-center"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingGrades ? (
                          <tr><td colSpan="7" className="p-6 text-center text-slate-400 font-semibold">Loading grade database...</td></tr>
                        ) : gradesList.filter(g => 
                          g.name.toLowerCase().includes(searchGradesQuery.toLowerCase()) ||
                          g.regd_no.toLowerCase().includes(searchGradesQuery.toLowerCase())
                        ).length === 0 ? (
                          <tr><td colSpan="7" className="p-10 text-center text-slate-400 font-semibold">No results match your search query.</td></tr>
                        ) : gradesList.filter(g => 
                          g.name.toLowerCase().includes(searchGradesQuery.toLowerCase()) ||
                          g.regd_no.toLowerCase().includes(searchGradesQuery.toLowerCase())
                        ).map(g => (
                          <tr key={g.id} className="border-b border-slate-100 hover:bg-slate-50/50 font-medium">
                            <td className="p-3 pl-4 font-bold text-primary">{g.name}</td>
                            <td className="p-3 font-mono text-slate-500">#{g.regd_no}</td>
                            <td className="p-3 text-slate-500">{g.class_name}</td>
                            <td className="p-3 text-slate-500">{g.semester} ({g.exam_type})</td>
                            <td className="p-3 text-center text-slate-500 font-bold">{g.subjects?.length || 0}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${g.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                {g.status}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <button 
                                type="button"
                                onClick={() => handleDeleteGrade(g.id)}
                                className="text-rose-500 hover:text-rose-700 text-sm font-bold p-1 hover:bg-rose-50 rounded-lg cursor-pointer"
                              >
                                🗑
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* CONTROLLER ADMIT CARDS SUB-DESK */}
        {currentSubView === 'controller' && controllerTab === 'admit_cards' && (
          <div className="space-y-8 animate-fade-in text-left">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl text-left">
                <span className="text-2xl">🎟️</span>
                <div className="text-2xl font-serif font-black text-amber-800 mt-2">{admitCardsList.length}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Total Issued Cards</div>
              </div>
              <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl text-left">
                <span className="text-2xl">⚡</span>
                <div className="text-2xl font-serif font-black text-emerald-800 mt-2">{admitCardsList.filter(c => c.branch === 'MCA').length}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">MCA Issued</div>
              </div>
              <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl text-left">
                <span className="text-2xl">💻</span>
                <div className="text-2xl font-serif font-black text-sky-800 mt-2">{admitCardsList.filter(c => c.branch && c.branch.startsWith('B.Tech CSE')).length}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">B.Tech CSE Issued</div>
              </div>
              <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl text-left">
                <span className="text-2xl">🏛️</span>
                <div className="text-2xl font-serif font-black text-rose-800 mt-2">{admitCardsList.filter(c => c.branch && !c.branch.startsWith('B.Tech CSE') && c.branch !== 'MCA').length}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Other Courses</div>
              </div>
            </div>

            {/* Issued table card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-accent uppercase tracking-widest">Issuing Desk</span>
                  <h3 className="font-serif text-xl font-bold text-primary mt-1">Manage Exam Admit Cards</h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap font-sans">
                  <input 
                    type="text" 
                    placeholder="Search by student name or roll..."
                    value={searchAdmitQuery}
                    onChange={e => setSearchAdmitQuery(e.target.value)}
                    className="p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-secondary w-full sm:w-64"
                  />
                  <button 
                    onClick={() => {
                      setEditingAdmitCardId(null);
                      setAdmitForm({
                        name: '',
                        regd_no: '',
                        branch: 'MCA',
                        semester: '1st Semester',
                        academic_year: '2025-26',
                        exam_type: 'Regular Examinations',
                        dob: ''
                      });
                      setAdmitSubjects([{ code: '', name: '', date: '', time: '2:00 PM – 5:00 PM' }]);
                      setShowAdmitModal(true);
                    }}
                    className="bg-accent hover:bg-[#b8932a] text-[#0b3c5d] font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                  >
                    Issue New Card
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-55 text-primary border-b border-slate-200 font-bold">
                      <th className="p-3 pl-4">Student Name</th>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Branch</th>
                      <th className="p-3">Semester</th>
                      <th className="p-3">Acad. Year</th>
                      <th className="p-3 text-center">Subjects</th>
                      <th className="p-3 text-center">DOB</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingAdmitCards ? (
                      <tr><td colSpan="8" className="p-6 text-center text-slate-400 font-semibold">Loading admit database...</td></tr>
                    ) : admitCardsList.filter(ac => 
                      ac.name.toLowerCase().includes(searchAdmitQuery.toLowerCase()) ||
                      ac.regd_no.toLowerCase().includes(searchAdmitQuery.toLowerCase())
                    ).length === 0 ? (
                      <tr><td colSpan="8" className="p-10 text-center text-slate-400 font-semibold">No results match your search query.</td></tr>
                    ) : admitCardsList.filter(ac => 
                      ac.name.toLowerCase().includes(searchAdmitQuery.toLowerCase()) ||
                      ac.regd_no.toLowerCase().includes(searchAdmitQuery.toLowerCase())
                    ).map(ac => (
                      <tr key={ac.id} className="border-b border-slate-100 hover:bg-slate-50/50 font-medium">
                        <td className="p-3 pl-4 font-bold text-primary">{ac.name}</td>
                        <td className="p-3 font-mono text-slate-500">#{ac.regd_no}</td>
                        <td className="p-3"><span className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-bold">{ac.branch}</span></td>
                        <td className="p-3 text-slate-500">{ac.semester}</td>
                        <td className="p-3 text-slate-500">{ac.academic_year}</td>
                        <td className="p-3 text-center text-slate-500 font-bold">{ac.subjects?.length || 0}</td>
                        <td className="p-3 text-center text-slate-500">{ac.dob}</td>
                        <td className="p-3 text-center flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setViewingAdmitCard(ac);
                              // Build HTML structure inside print area
                              const fmtDate = (d) => { try { return d ? new Date(d+'T00:00').toLocaleDateString() : '—'; } catch(e) { return d||'—'; } }
                              const printSection = document.getElementById('print-area')
                              if (printSection) {
                                printSection.innerHTML = `
                                  <div class="print-admit-card" style="font-family:'Times New Roman', serif; color: black; max-width: 800px; margin: 0 auto; padding: 20px; border: 2px solid black;">
                                    <div style="display: flex; align-items: center; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 15px;">
                                      <div style="flex-grow: 1; text-align: center;">
                                        <div style="font-size: 13px; font-weight: bold; text-transform: uppercase;">ଓଡ଼ିଶା ବୈଷୟିକ ଓ ଗବେଷଣା ବିଶ୍ୱବିଦ୍ୟାଳୟ</div>
                                        <div style="font-size: 18px; font-weight: bold; text-transform: uppercase; margin-top: 2px;">Odisha University of Technology and Research</div>
                                        <div style="font-size: 10px; text-transform: uppercase; font-weight: bold; color: #555;">Techno Campus, Ghatikia, Bhubaneswar-751029</div>
                                        <div style="font-size: 15px; font-weight: bold; text-transform: uppercase; margin-top: 8px; letter-spacing: 2px;">Official Exam Admit Card</div>
                                      </div>
                                    </div>

                                    <div style="background: #f2f2f2; border: 1px solid black; text-align: center; padding: 5px; font-weight: bold; font-size: 12px; margin-bottom: 15px; text-transform: uppercase;">
                                      ${ac.branch} &nbsp;|&nbsp; ${ac.semester} &nbsp;|&nbsp; AY: ${ac.academic_year} &nbsp;|&nbsp; ${ac.exam_type}
                                    </div>

                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 15px; font-size: 12px; border: 1px solid black; padding: 10px;">
                                      <div><strong>Student Name:</strong> ${ac.name}</div>
                                      <div><strong>Registration Number:</strong> ${ac.regd_no}</div>
                                      <div><strong>Branch:</strong> ${ac.branch}</div>
                                      <div><strong>Date of Birth:</strong> ${ac.dob}</div>
                                      <div><strong>Clearance Status:</strong> APPROVED</div>
                                      <div><strong>Issued At:</strong> ${ac.issued_at ? new Date(ac.issued_at).toLocaleString() : '—'}</div>
                                    </div>

                                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
                                      <thead>
                                        <tr style="background: #e6e6e6;">
                                          <th style="border: 1px solid black; padding: 5px; text-align: center;">Exam Date</th>
                                          <th style="border: 1px solid black; padding: 5px; text-align: center;">Subject Code</th>
                                          <th style="border: 1px solid black; padding: 5px; text-align: left;">Subject Name</th>
                                          <th style="border: 1px solid black; padding: 5px; text-align: center;">Exam Session Time</th>
                                          <th style="border: 1px solid black; padding: 5px; text-align: center;">Invigilator Signature</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        ${(ac.subjects || []).map(s => `
                                          <tr>
                                            <td style="border: 1px solid black; padding: 6px; text-align: center;">${fmtDate(s.date)}</td>
                                            <td style="border: 1px solid black; padding: 6px; text-align: center; font-family: monospace;">${s.code}</td>
                                            <td style="border: 1px solid black; padding: 6px; text-align: left;">${s.name}</td>
                                            <td style="border: 1px solid black; padding: 6px; text-align: center;">${s.time}</td>
                                            <td style="border: 1px solid black; padding: 6px; text-align: center;">_______________</td>
                                          </tr>
                                        `).join('')}
                                      </tbody>
                                    </table>

                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 12px; margin-top: 30px;">
                                      <div style="text-align: center; border-top: 1px solid black; padding-top: 5px; margin-top: 20px;">
                                        Candidate's Signature
                                      </div>
                                      <div style="text-align: center; border-top: 1px solid black; padding-top: 5px; margin-top: 20px; font-weight: bold;">
                                        Controller of Examinations
                                      </div>
                                    </div>
                                  </div>
                                `
                              }
                            }}
                            className="bg-white hover:bg-slate-100 border border-slate-200 text-primary font-semibold py-1 px-2.5 rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            🖨️ Print
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAdmitCardId(ac.id);
                              setAdmitForm({
                                name: ac.name,
                                regd_no: ac.regd_no,
                                branch: ac.branch,
                                semester: ac.semester,
                                academic_year: ac.academic_year,
                                exam_type: ac.exam_type,
                                dob: ac.dob
                              });
                              setAdmitSubjects(ac.subjects || [{ code: '', name: '', date: '', time: '2:00 PM – 5:00 PM' }]);
                              setShowAdmitModal(true);
                            }}
                            className="bg-white hover:bg-slate-100 border border-slate-200 text-[#0b3c5d] font-semibold py-1 px-2.5 rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAdmitCard(ac.id)}
                            className="bg-white hover:bg-rose-50 border border-slate-200 text-rose-600 font-semibold py-1 px-2.5 rounded-lg text-[10px] transition-colors cursor-pointer"
                          >
                            🗑 Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ADMIT FORM / EDIT OVERLAY MODAL */}
            {showAdmitModal && (
              <div className="fixed inset-0 z-55 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl animate-fade-in text-left max-h-[90vh] overflow-y-auto font-sans">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-lg font-bold text-primary">
                      {editingAdmitCardId ? '✏️ Edit Admit Card Details' : '🎟️ Issue New Admit Card'}
                    </h3>
                    <button onClick={() => setShowAdmitModal(false)} className="text-slate-400 hover:text-primary text-xl font-bold">&times;</button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-primary mb-4">
                    <div>
                      <label className="block mb-1">Student Full Name *</label>
                      <input 
                        type="text" required placeholder="e.g. Ramakanta Behera"
                        value={admitForm.name}
                        onChange={e => setAdmitForm({...admitForm, name: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Registration Roll No *</label>
                      <input 
                        type="text" required placeholder="e.g. 25240022"
                        value={admitForm.regd_no}
                        onChange={e => setAdmitForm({...admitForm, regd_no: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Course / Branch *</label>
                      <select 
                        value={admitForm.branch}
                        onChange={e => setAdmitForm({...admitForm, branch: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary bg-white font-medium text-sm"
                      >
                        <option value="MCA">MCA - Master of Computer Applications</option>
                        <option value="MBA">MBA - Master of Business Administration</option>
                        <option value="B.Tech CSE">B.Tech - Computer Science &amp; Engg.</option>
                        <option value="B.Tech ECE">B.Tech - Electronics &amp; Comm.</option>
                        <option value="B.Tech Mechanical">B.Tech - Mechanical Engg.</option>
                        <option value="B.Tech Civil">B.Tech - Civil Engg.</option>
                        <option value="BCA">BCA - Bachelor of Computer Applications</option>
                        <option value="BBA">BBA - Bachelor of Business Administration</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">Semester</label>
                      <select 
                        value={admitForm.semester}
                        onChange={e => setAdmitForm({...admitForm, semester: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary bg-white font-medium text-sm"
                      >
                        {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(sem => (
                          <option key={sem} value={`${sem} Semester`}>{sem} Sem</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">Academic Year *</label>
                      <input 
                        type="text" required placeholder="e.g. 2025-26"
                        value={admitForm.academic_year}
                        onChange={e => setAdmitForm({...admitForm, academic_year: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Exam Type</label>
                      <select 
                        value={admitForm.exam_type}
                        onChange={e => setAdmitForm({...admitForm, exam_type: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary bg-white font-medium text-sm"
                      >
                        <option value="Regular Examinations">Regular Examinations</option>
                        <option value="Back Examinations">Back Examinations</option>
                        <option value="Special Examinations">Special Examinations</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block mb-1">Date of Birth *</label>
                      <input 
                        type="date" required
                        value={admitForm.dob}
                        onChange={e => setAdmitForm({...admitForm, dob: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-secondary font-medium text-sm"
                      />
                    </div>
                  </div>

                  {/* Subject Schedules list */}
                  <div className="text-xs font-semibold text-primary mb-6">
                    <label className="block mb-1.5 flex justify-between">
                      <span>Exam Schedule Subject List *</span>
                      <button 
                        type="button"
                        onClick={() => setAdmitSubjects([...admitSubjects, { code: '', name: '', date: '', time: '2:00 PM – 5:00 PM' }])}
                        className="text-secondary hover:underline lowercase font-bold"
                      >
                        + Add Exam Subject
                      </button>
                    </label>

                    <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-100 p-2.5 rounded-2xl bg-slate-50">
                      {admitSubjects.map((s, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-200 relative">
                          <input 
                            type="text" placeholder="Code (e.g. CS612)" required
                            value={s.code}
                            onChange={e => {
                              const newSubs = [...admitSubjects]
                              newSubs[idx].code = e.target.value.toUpperCase()
                              setAdmitSubjects(newSubs)
                            }}
                            className="w-20 p-2 border border-slate-100 rounded-lg text-[10px] font-semibold focus:outline-none bg-slate-50/50"
                          />
                          <input 
                            type="text" placeholder="Subject Name" required
                            value={s.name}
                            onChange={e => {
                              const newSubs = [...admitSubjects]
                              newSubs[idx].name = e.target.value
                              setAdmitSubjects(newSubs)
                            }}
                            className="flex-grow p-2 border border-slate-100 rounded-lg text-[10px] font-semibold focus:outline-none bg-slate-50/50"
                          />
                          <input 
                            type="date" required
                            value={s.date}
                            onChange={e => {
                              const newSubs = [...admitSubjects]
                              newSubs[idx].date = e.target.value
                              setAdmitSubjects(newSubs)
                            }}
                            className="w-28 p-2 border border-slate-100 rounded-lg text-[10px] font-semibold focus:outline-none bg-slate-50/50"
                          />
                          <input 
                            type="text" placeholder="Time" required
                            value={s.time}
                            onChange={e => {
                              const newSubs = [...admitSubjects]
                              newSubs[idx].time = e.target.value
                              setAdmitSubjects(newSubs)
                            }}
                            className="w-32 p-2 border border-slate-100 rounded-lg text-[10px] font-semibold focus:outline-none bg-slate-50/50"
                          />
                          <button 
                            type="button"
                            onClick={() => setAdmitSubjects(admitSubjects.filter((_, i) => i !== idx))}
                            className="text-rose-500 hover:text-rose-700 text-lg font-bold px-1.5"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 text-xs font-bold pt-4 border-t border-slate-100">
                    <button 
                      type="button"
                      onClick={() => setShowAdmitModal(false)}
                      className="border border-slate-200 text-primary hover:bg-slate-50 py-2.5 px-6 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={handleSaveAdmitCard}
                      className="bg-primary hover:bg-secondary text-white py-2.5 px-6 rounded-xl shadow-sm transition-colors cursor-pointer"
                    >
                      {editingAdmitCardId ? 'Save Admit Card Changes' : 'Issue Official Admit Card'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ADMIT PREVIEW AND PRINT MODAL */}
            {viewingAdmitCard && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl animate-fade-in text-left max-h-[90vh] overflow-y-auto font-sans">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif text-lg font-bold text-primary">Admit Card Document Preview</h3>
                    <button onClick={() => setViewingAdmitCard(null)} className="text-slate-400 hover:text-primary text-xl font-bold">&times;</button>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <button 
                      onClick={() => window.print()}
                      className="bg-accent hover:bg-[#b8932a] text-[#0b3c5d] font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-colors cursor-pointer"
                    >
                      🖨️ Print Admit Card
                    </button>
                    <span className="text-[10px] text-slate-400 font-bold leading-normal">
                      Clicking print exports the official black-and-white standard admit sheet using native browser formats.
                    </span>
                  </div>

                  <div className="border-2 border-slate-200 rounded-2xl p-6 text-xs text-primary font-medium font-sans">
                    <div className="text-center border-b-2 border-slate-100 pb-3 mb-4">
                      <div className="font-serif text-[10px] text-slate-400 uppercase tracking-widest leading-none mb-1">ଓଡ଼ିଶା ବୈଷୟିକ ଓ ଗବେଷଣା ବିଶ୍ୱବିଦ୍ୟାଳୟ</div>
                      <div className="font-serif text-base font-bold text-primary leading-none uppercase">Odisha University of Technology and Research</div>
                      <div className="text-[8px] text-slate-400 font-bold mt-1">Techno Campus, Ghatikia, Bhubaneswar-751029</div>
                      <div className="inline-block bg-slate-100 border border-slate-200 px-3 py-1 rounded text-[9px] font-black uppercase mt-3 tracking-widest text-[#0b3c5d]">Official Exam Admit Card</div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200/50">
                      <div><strong>Student Name:</strong> <span className="text-slate-500">{viewingAdmitCard.name}</span></div>
                      <div><strong>Registration Number:</strong> <span className="text-slate-500 font-mono">#{viewingAdmitCard.regd_no}</span></div>
                      <div><strong>Branch:</strong> <span className="text-slate-500">{viewingAdmitCard.branch}</span></div>
                      <div><strong>Date of Birth:</strong> <span className="text-slate-500">{viewingAdmitCard.dob}</span></div>
                      <div><strong>Academic Year:</strong> <span className="text-slate-500">{viewingAdmitCard.academic_year}</span></div>
                      <div><strong>Exam Type:</strong> <span className="text-slate-500">{viewingAdmitCard.exam_type}</span></div>
                    </div>

                    <table className="w-full text-[11px] text-left border-collapse border border-slate-100 rounded-xl overflow-hidden">
                      <thead>
                        <tr className="bg-slate-200 text-primary border-b border-slate-350">
                          <th className="p-2 pl-3">Exam Date</th>
                          <th className="p-2">Code</th>
                          <th className="p-2">Subject Name</th>
                          <th className="p-2 text-center">Timing</th>
                          <th className="p-2 text-center">Invigilator Sig</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(viewingAdmitCard.subjects || []).map((s, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/50">
                            <td className="p-2 pl-3 font-semibold">{s.date ? new Date(s.date+'T00:00').toLocaleDateString() : '—'}</td>
                            <td className="p-2 font-mono text-slate-500">{s.code}</td>
                            <td className="p-2 font-semibold text-primary">{s.name}</td>
                            <td className="p-2 text-center text-slate-500">{s.time}</td>
                            <td className="p-2 text-center text-slate-400">___________</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 text-xs font-bold mt-6">
                    <button onClick={() => setViewingAdmitCard(null)} className="border border-slate-200 text-primary hover:bg-slate-50 py-2 px-4 rounded-xl cursor-pointer">Close Preview</button>
                  </div>
                </div>
              </div>
            )}
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

            {role === 'hos' && reviewAction === 'approve' && (
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-primary uppercase mb-1.5">Forward Clearance Route *</label>
                <select
                  value={forwardRoute}
                  onChange={e => setForwardRoute(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-secondary bg-white font-bold text-primary"
                >
                  <option value="controller">Exam Controller Desk</option>
                  <option value="dean_academic">Dean Academic Clearance Desk</option>
                  <option value="dean_pga">Dean PGA Clearance Desk</option>
                </select>
              </div>
            )}

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
                  <div>
                    {docApp.forwarded_to === 'dean_pga' ? 'Dr. Pravat Kumar Patra' : docApp.forwarded_to === 'dean_academic' ? 'Dr. Bibhuti Bhusan Choudhury' : 'Dr. Anupama Rath'}
                  </div>
                  <div className="text-[7px] text-slate-400 uppercase tracking-widest leading-none mt-0.5">
                    {docApp.forwarded_to === 'dean_pga' ? 'Dean, Post Graduate Affairs' : docApp.forwarded_to === 'dean_academic' ? 'Dean, Academic Affairs' : 'Exam Controller'}
                  </div>
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

      {/* PREMIUM CUSTOM DIALOG & CONFIRMATION MODAL */}
      {customModal.show && (
        <div className="fixed inset-0 z-55 bg-slate-900/65 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-fade-in text-center font-sans">
            <div className="flex justify-center mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${
                customModal.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                customModal.type === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                customModal.type === 'warning' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                customModal.type === 'confirm' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' :
                'bg-sky-50 text-sky-600 border border-sky-200'
              }`}>
                {customModal.type === 'success' ? '✔️' :
                 customModal.type === 'error' ? '❌' :
                 customModal.type === 'warning' ? '⚠️' :
                 customModal.type === 'confirm' ? '❓' : 'ℹ️'}
              </div>
            </div>
            <h3 className="font-serif text-base font-bold text-primary mb-2">
              {customModal.title}
            </h3>
            <p className="text-xs text-muted leading-relaxed mb-6 font-semibold">
              {customModal.message}
            </p>
            {customModal.type === 'confirm' ? (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCustomModal(prev => ({ ...prev, show: false }))
                    if (customModal.onConfirm) customModal.onConfirm()
                  }}
                  className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Yes, Proceed
                </button>
                <button
                  onClick={() => setCustomModal(prev => ({ ...prev, show: false }))}
                  className="flex-grow bg-slate-100 hover:bg-slate-200 text-primary border border-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCustomModal(prev => ({ ...prev, show: false }))}
                className={`w-full font-bold py-2.5 px-6 rounded-xl text-xs shadow-sm hover:shadow transition-all cursor-pointer text-white ${
                  customModal.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-600' :
                  customModal.type === 'error' ? 'bg-rose-500 hover:bg-rose-600' :
                  customModal.type === 'warning' ? 'bg-amber-500 hover:bg-amber-600' :
                  'bg-primary hover:bg-secondary'
                }`}
              >
                Okay, Understood
              </button>
            )}
          </div>
        </div>
      )}

    </Layout>
  )
}
