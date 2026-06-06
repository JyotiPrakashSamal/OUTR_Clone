/* eslint-disable react-hooks/set-state-in-effect, no-unused-vars, no-empty, react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'
import { 
  capitalizeName, 
  SCHOOLS, 
  SCHOOL_MAP, 
  DEFAULT_NAMES, 
  handlePrintOfficialDoc,
  handlePrintAdmitCardFromModal
} from './file-tracking/utils/fileTrackingHelpers'
import ExamManagementDesk from './file-tracking/components/ExamManagementDesk'
import { 
  GraduationCap, 
  LogOut, 
  Search, 
  BarChart3, 
  Ticket, 
  CheckCircle2, 
  AlertTriangle, 
  FolderOpen, 
  Upload, 
  Mail, 
  Phone, 
  ClipboardList, 
  Paperclip, 
  Printer, 
  Eye, 
  FileText, 
  Check, 
  X, 
  Building, 
  ClipboardCheck, 
  RotateCcw, 
  Info 
} from 'lucide-react'

// Simple, highly effective global cache for secure file URLs
const fileUrlCache = new Map()

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
  const [activeFileUrl, setActiveFileUrl] = useState(null)

  // Fetch private or public URL when activeFile is set for previewing
  useEffect(() => {
    async function getFileUrl() {
      if (!activeFile) {
        setActiveFileUrl(null)
        return
      }

      const filePath = activeFile.file_data
      if (!filePath) return

      // 1. Direct local/base64 check
      if (filePath.startsWith('data:') || filePath.startsWith('http')) {
        setActiveFileUrl(filePath)
        return
      }

      // 2. Memory Cache Check
      if (fileUrlCache.has(filePath)) {
        setActiveFileUrl(fileUrlCache.get(filePath))
        return
      }

      // 3. Fast client-side Public CDN URL generation first (0ms latency!)
      try {
        const { data } = supabase.storage
          .from('clearance-letters')
          .getPublicUrl(filePath)
          
        if (data && data.publicUrl) {
          setActiveFileUrl(data.publicUrl)
          fileUrlCache.set(filePath, data.publicUrl)
        }
      } catch (e) {
        console.warn('Public URL generation fallback:', e)
      }

      // 4. Secure signed URL retrieval fallback (runs in background and updates cache to guarantee access if bucket is private)
      try {
        const { data, error } = await supabase.storage
          .from('clearance-letters')
          .createSignedUrl(filePath, 3600) // Cache valid for 1 hour
        if (data && data.signedUrl) {
          fileUrlCache.set(filePath, data.signedUrl)
          setActiveFileUrl(data.signedUrl) // Overwrites with guaranteed secure signed url
        }
      } catch (e) {
        console.error('Signed URL retrieval fallback error:', e)
      }
    }
    getFileUrl()
  }, [activeFile])

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
          // Fetch Auth User and Profiles safely
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
                setUserProfile({
                  ...profile,
                  email: user.email
                })
              } else {
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

  // Supabase Realtime Channels for Live floating push toasts
  useEffect(() => {
    const trackingSubscription = supabase
      .channel('public-file-tracking-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'file_tracking' }, (payload) => {
        let msg = ''
        if (payload.eventType === 'INSERT') {
          msg = `🔔 New Clearance Request submitted by ${payload.new.student_name} (${payload.new.student_regd})!`
          
          const mappedNew = mapDbAppToLocal(payload.new)
          setApplications(prev => {
            if (prev.some(a => a.id === mappedNew.id)) return prev
            const updated = [mappedNew, ...prev]
            localStorage.setItem('OUTR_APPLICATIONS', JSON.stringify(updated))
            return updated
          })
        } else if (payload.eventType === 'UPDATE') {
          if (payload.new.status === 'resolved') {
            msg = `✅ Clearance APPROVED for student ${payload.new.student_name}!`
          } else if (payload.new.status === 'rejected') {
            msg = `❌ Clearance REJECTED for student ${payload.new.student_name}.`
          } else {
            msg = `ℹ️ Timelines updated for student ${payload.new.student_name}.`
          }
          
          const mappedNew = mapDbAppToLocal(payload.new)
          setApplications(prev => {
            const updated = prev.map(app => app.id === mappedNew.id ? { ...app, ...mappedNew } : app)
            localStorage.setItem('OUTR_APPLICATIONS', JSON.stringify(updated))
            return updated
          })
        }

        if (msg) {
          const id = Date.now()
          setToasts(prev => [...prev, { id, text: msg }])
          setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
          }, 4500)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(trackingSubscription)
    }
  }, [role, userProfile])

  // Auto-fill student request form when profile loads
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
        regd = '2201011'
      }
      
      setStudentForm(prev => ({
        ...prev,
        name: userProfile.name || prev.name,
        email: userProfile.email || prev.email,
        school_id: userProfile.school_id || prev.school_id || 'SCS',
        regd_no: regd
      }))
    }
  }, [userProfile, role])

  // Fetch applications
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
        const mappedData = data.map(dbApp => mapDbAppToLocal(dbApp))
        
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
      school_icon: SCHOOL_MAP[dbApp.school_id]?.icon || '',
      program: parsedSubject.program || 'B.Tech',
      semester: parsedSubject.semester || '',
      type: parsedSubject.type || dbApp.subject,
      urgency: parsedSubject.urgency || 'Normal',
      description: parsedSubject.description || 'No description provided.',
      file_name: dbApp.file_url ? 'Attached Letter.pdf' : null,
      file_data: dbApp.file_url || null,
      file_type: dbApp.file_url ? 'application/pdf' : null,
      ctrl_attachments: parsedSubject.ctrl_attachments || [],
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
        school_icon: '',
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
        school_icon: '',
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
        school_icon: '',
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
        school_icon: '',
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

  // Handle File Uploads (Drag & Drop or Selection)
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
      setStudentFile({ name: file.name, data: ev.target.result, type: file.type, rawFile: file })
    }
    reader.readAsDataURL(file)
  }

  // Submit Student Application
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
    const classStr = program + (semester ? ' - ' + semester : '')
    
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
      let fileUrlPath = null
      if (studentFile && studentFile.rawFile) {
        const fileExt = studentFile.name.split('.').pop()
        const filePath = `${appId}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('clearance-letters')
          .upload(filePath, studentFile.rawFile, {
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) throw uploadError
        fileUrlPath = filePath
      }

      const subjectJson = JSON.stringify({
        type: type,
        program: program,
        semester: semester,
        urgency: 'Normal',
        description: description
      })

      const { error } = await supabase
        .from('file_tracking')
        .insert([{
          file_no: appId,
          student_name: name,
          student_regd: regd_no,
          school_id: school_id,
          subject: subjectJson,
          file_url: fileUrlPath || (studentFile ? studentFile.data : null),
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

  // Track Application
  const handleTrackSubmit = (e) => {
    e.preventDefault()
    if (!trackRegd.trim()) return
    setTrackingLoading(true)
    
    setTimeout(() => {
      const matched = applications.filter(
        a => a.regd_no.toLowerCase() === trackRegd.trim().toLowerCase() ||
             a.id.toLowerCase() === trackRegd.trim().toLowerCase()
      )
      setTrackedApps(matched)
      setTrackingLoading(false)
    }, 500)
  }

  // Approve / Decline actions
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

  // Controller Attachments
  const handleCtrlFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    if (file.size > 10 * 1024 * 1024) {
      showAlert('File exceeds 10 MB limit.', 'warning')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      setUploadFile({ name: file.name, data: ev.target.result, type: file.type, rawFile: file })
    }
    reader.readAsDataURL(file)
  }

  const saveControllerAttachment = async () => {
    if (!uploadFile) return
    
    setActionLoading(true)
    try {
      let fileUrlPath = null
      if (uploadFile.rawFile) {
        const fileExt = uploadFile.name.split('.').pop()
        const cleanName = uploadFile.name.replace(/[^a-zA-Z0-9]/g, '_')
        const filePath = `ctrl_${selectedApp.id}_${Date.now()}_${cleanName}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('clearance-letters')
          .upload(filePath, uploadFile.rawFile, {
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) {
          console.error('Controller file upload error:', uploadError)
        } else {
          fileUrlPath = filePath
        }
      }

      const newAtt = { 
        name: uploadFile.name, 
        data: fileUrlPath || uploadFile.data, 
        type: uploadFile.type, 
        desc: uploadDesc || uploadFile.name 
      }

      const currentAtts = selectedApp.ctrl_attachments || []
      const atts = [...currentAtts, newAtt]

      const subjectObj = {
        type: selectedApp.type,
        program: selectedApp.program,
        semester: selectedApp.semester,
        urgency: selectedApp.urgency || 'Normal',
        description: selectedApp.description,
        ctrl_attachments: atts
      }
      const subjectJson = JSON.stringify(subjectObj)

      const { error: dbError } = await supabase
        .from('file_tracking')
        .update({ subject: subjectJson })
        .eq('file_no', selectedApp.id)

      if (dbError) throw dbError

      const updatedList = applications.map(app => {
        if (app.id === selectedApp.id) {
          return { ...app, ctrl_attachments: atts }
        }
        return app
      })
      updateApplicationsState(updatedList)
      setUploadFile(null)
      setUploadDesc('')
      if (document.getElementById('ctrl_file_upload')) {
        document.getElementById('ctrl_file_upload').value = ''
      }
      setSelectedApp(updatedList.find(a => a.id === selectedApp.id))
      showAlert('Attachment saved successfully!', 'success')
    } catch (err) {
      console.warn('Error saving attachment, falling back to local simulation:', err)
      const newAtt = { 
        name: uploadFile.name, 
        data: uploadFile.data, 
        type: uploadFile.type, 
        desc: uploadDesc || uploadFile.name 
      }
      const atts = [...(selectedApp.ctrl_attachments || []), newAtt]
      const updatedList = applications.map(app => {
        if (app.id === selectedApp.id) {
          return { ...app, ctrl_attachments: atts }
        }
        return app
      })
      updateApplicationsState(updatedList)
      setUploadFile(null)
      setUploadDesc('')
      if (document.getElementById('ctrl_file_upload')) {
        document.getElementById('ctrl_file_upload').value = ''
      }
      setSelectedApp(updatedList.find(a => a.id === selectedApp.id))
    } finally {
      setActionLoading(false)
    }
  }

  const removeControllerAttachment = async (idx) => {
    if (!confirm('Remove this attachment?')) return
    
    setActionLoading(true)
    try {
      const currentAtts = selectedApp.ctrl_attachments || []
      const atts = [...currentAtts]
      atts.splice(idx, 1)

      const subjectObj = {
        type: selectedApp.type,
        program: selectedApp.program,
        semester: selectedApp.semester,
        urgency: selectedApp.urgency || 'Normal',
        description: selectedApp.description,
        ctrl_attachments: atts
      }
      const subjectJson = JSON.stringify(subjectObj)

      const { error: dbError } = await supabase
        .from('file_tracking')
        .update({ subject: subjectJson })
        .eq('file_no', selectedApp.id)

      if (dbError) throw dbError

      const updatedList = applications.map(app => {
        if (app.id === selectedApp.id) {
          return { ...app, ctrl_attachments: atts }
        }
        return app
      })
      updateApplicationsState(updatedList)
      setSelectedApp(updatedList.find(a => a.id === selectedApp.id))
      showAlert('Attachment removed successfully.', 'info')
    } catch (err) {
      console.warn('Error removing attachment, falling back to local simulation:', err)
      const atts = [...(selectedApp.ctrl_attachments || [])]
      atts.splice(idx, 1)
      const updatedList = applications.map(app => {
        if (app.id === selectedApp.id) {
          return { ...app, ctrl_attachments: atts }
        }
        return app
      })
      updateApplicationsState(updatedList)
      setSelectedApp(updatedList.find(a => a.id === selectedApp.id))
    } finally {
      setActionLoading(false)
    }
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

    const icons = {
      pending: <RotateCcw className="w-3 h-3 inline mr-1 text-amber-700" />,
      adviser_approved: <CheckCircle2 className="w-3 h-3 inline mr-1 text-sky-700" />,
      adviser_declined: <AlertTriangle className="w-3 h-3 inline mr-1 text-rose-700" />,
      hos_approved: <CheckCircle2 className="w-3 h-3 inline mr-1 text-indigo-700" />,
      hos_declined: <AlertTriangle className="w-3 h-3 inline mr-1 text-rose-700" />,
      resolved: <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-700" />,
      rejected: <AlertTriangle className="w-3 h-3 inline mr-1 text-rose-700" />
    }

    const labels = {
      pending: 'Awaiting Advisor',
      adviser_approved: 'Forwarded to HoS',
      adviser_declined: 'Declined by Advisor',
      hos_approved: 'Forwarded to Cell',
      hos_declined: 'Declined by HoS',
      resolved: 'Resolved / Issued',
      rejected: 'Declined / Closed'
    }

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${badges[status] || ''}`}>
        {icons[status]}
        <span>{labels[status] || status}</span>
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
          <div className="animate-fade-in text-center max-w-5xl mx-auto select-none">
            {/* Header Banner */}
            <div className="bg-white/80 border border-slate-200/80 backdrop-blur-md rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 shadow-sm text-left">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-accent/20 bg-white">
                  <GraduationCap className="w-7 h-7 text-primary" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">OUTR Academics Cell</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mt-1">Student Academic Desk</h2>
                  <p className="text-xs text-muted font-medium mt-1">
                    Logged Student: <span className="font-semibold text-primary">{capitalizeName(userProfile?.name) || 'Academic Student'}</span> {userProfile?.email && `• Roll No: #${userProfile.email.split('@')[0]}`}
                  </p>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="w-full md:w-auto bg-slate-100 hover:bg-slate-200 border border-slate-200 text-primary font-semibold py-2.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>

            <p className="text-muted font-medium text-sm max-w-lg mx-auto mb-10 text-center">
              Track multi-level university letters, request transcripts, fee concessions, or document approvals. Security and audit logged.
            </p>

            {/* Quick Grid links */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12 font-sans">
              <div 
                onClick={() => setCurrentSubView('student-form')}
                className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 hover:border-accent/40 hover:shadow-lg transition-all duration-300 text-left group flex flex-col"
              >
                <GraduationCap className="w-8 h-8 text-primary mb-4 block group-hover:scale-105 transition-transform duration-300" />
                <h4 className="font-serif font-bold text-primary text-base mb-1.5">Submit Application</h4>
                <p className="text-muted text-xs leading-relaxed">
                  Draft request transcripts, upload letters, choose departments, and submit to advisors.
                </p>
              </div>

              <div 
                onClick={() => setCurrentSubView('tracking')}
                className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 hover:border-accent/40 hover:shadow-lg transition-all duration-300 text-left group flex flex-col"
              >
                <Search className="w-8 h-8 text-primary mb-4 block group-hover:scale-105 transition-transform duration-300" />
                <h4 className="font-serif font-bold text-primary text-base mb-1.5">Track Application</h4>
                <p className="text-muted text-xs leading-relaxed">
                  Search by your registration ID and monitor live timeline step clearances.
                </p>
              </div>

              <div 
                onClick={() => setCurrentSubView('my-results')}
                className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 hover:border-accent/40 hover:shadow-lg transition-all duration-300 text-left group flex flex-col"
              >
                <BarChart3 className="w-8 h-8 text-primary mb-4 block group-hover:scale-105 transition-transform duration-300" />
                <h4 className="font-serif font-bold text-primary text-base mb-1.5">My Results &amp; Grades</h4>
                <p className="text-muted text-xs leading-relaxed">
                  View published semester grade sheets and calculate aggregate GPA records.
                </p>
              </div>

              <div 
                onClick={() => setCurrentSubView('my-admit-card')}
                className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 hover:border-accent/40 hover:shadow-lg transition-all duration-300 text-left group flex flex-col"
              >
                <Ticket className="w-8 h-8 text-primary mb-4 block group-hover:scale-105 transition-transform duration-300" />
                <h4 className="font-serif font-bold text-primary text-base mb-1.5">My Admit Cards</h4>
                <p className="text-muted text-xs leading-relaxed">
                  Print official examination admit cards once clearance pipelines are resolved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STUDENT SUBMISSION FORM view */}
        {currentSubView === 'student-form' && (
          <div className="max-w-xl mx-auto text-left animate-fade-in space-y-6">
            <button 
              onClick={() => setCurrentSubView('landing')}
              className="text-xs text-secondary hover:text-primary font-bold flex items-center gap-1.5 mb-6 transition-colors"
            >
              ← Back to Landing
            </button>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-widest font-sans">Application Desk</span>
                <h3 className="font-serif text-2xl font-bold text-primary mt-1">Submit Clearance File</h3>
                <p className="text-xs text-slate-400 mt-1">Submit academic requests and documents directly to authority pipelines.</p>
              </div>

              {studentFormSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 font-sans">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-emerald-800 font-bold text-base">Application Filed Successfully!</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Your request has been successfully queued and assigned file reference tracking code:
                    <strong className="block text-primary text-sm font-mono mt-1 bg-white p-2 rounded-lg border border-emerald-100">{studentFormSuccess}</strong>
                  </p>
                  <div className="flex gap-3 justify-center pt-2">
                    <button 
                      onClick={() => { setTrackRegd(studentFormSuccess); setCurrentSubView('tracking'); setStudentFormSuccess(''); }}
                      className="btn-brand-primary text-xs py-2 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Search className="w-3.5 h-3.5" /> Track Status Now
                    </button>
                    <button 
                      onClick={() => setStudentFormSuccess('')}
                      className="btn-brand-secondary text-xs py-2 cursor-pointer"
                    >
                      Draft Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs font-semibold text-primary font-sans">
                  {studentFormError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-center font-bold flex items-center justify-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" /> {studentFormError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] mb-1.5">Student Full Name *</label>
                      <input 
                        type="text" required placeholder="Name"
                        value={studentForm.name}
                        onChange={e => setStudentForm({...studentForm, name: e.target.value})}
                        className="input-standard font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] mb-1.5">Registration Roll Number *</label>
                      <input 
                        type="text" required placeholder="e.g. 2201011"
                        value={studentForm.regd_no}
                        onChange={e => setStudentForm({...studentForm, regd_no: e.target.value})}
                        className="input-standard font-medium text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] mb-1.5">School *</label>
                      <select 
                        value={studentForm.school_id}
                        onChange={e => setStudentForm({...studentForm, school_id: e.target.value, program: SCHOOL_MAP[e.target.value]?.programmes[0] || ''})}
                        className="input-standard bg-white font-medium text-sm"
                      >
                        {SCHOOLS.map(s => (
                          <option key={s.id} value={s.id}>{s.short}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] mb-1.5">Programme *</label>
                      <select 
                        value={studentForm.program}
                        onChange={e => setStudentForm({...studentForm, program: e.target.value})}
                        className="input-standard bg-white font-medium text-sm"
                      >
                        {(SCHOOL_MAP[studentForm.school_id || 'SCS']?.programmes || []).map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] mb-1.5">Active Semester</label>
                      <select 
                        value={studentForm.semester}
                        onChange={e => setStudentForm({...studentForm, semester: e.target.value})}
                        className="input-standard bg-white font-medium text-sm"
                      >
                        <option value="">None / NA</option>
                        {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(sem => (
                          <option key={sem} value={`${sem} Semester`}>{sem} Sem</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] mb-1.5">Email Address</label>
                      <input 
                        type="email" placeholder="student@outr.ac.in"
                        value={studentForm.email}
                        onChange={e => setStudentForm({...studentForm, email: e.target.value})}
                        className="input-standard font-medium text-sm"
                      />
                    </div>
                    <div>
                      <label className="block uppercase tracking-wider text-[10px] mb-1.5">Clearance Request Type *</label>
                      <select 
                        value={studentForm.type}
                        onChange={e => setStudentForm({...studentForm, type: e.target.value})}
                        className="input-standard bg-white font-medium text-sm"
                      >
                        <option value="">-- Choose Category --</option>
                        <option value="Fee Concession">Fee Concession Request</option>
                        <option value="Exam Re-evaluation">Exam Re-evaluation</option>
                        <option value="Leave of Absence">Leave of Absence</option>
                        <option value="Certificate Request">Certificate Request</option>
                        <option value="Hostel Clearance">Hostel Dues Clearance</option>
                        <option value="Library Clearance">Library Book Clearance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] mb-1.5">Detailed Description *</label>
                    <textarea 
                      required rows="4" placeholder="Briefly explain the rationale and attachments..."
                      value={studentForm.description}
                      onChange={e => setStudentForm({...studentForm, description: e.target.value})}
                      className="input-standard font-medium text-sm resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block uppercase tracking-wider text-[10px] mb-2 block">Upload Clearance Request Letter (PDF/Image max 10MB)</label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-accent/40 rounded-2xl p-6 text-center bg-slate-50 transition-colors relative cursor-pointer group">
                      <input 
                        type="file" accept="application/pdf,image/*"
                        onChange={handleStudentFileSelect}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <FolderOpen className="w-8 h-8 text-slate-400 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                      {studentFile ? (
                        <div className="text-primary font-bold text-[10px] flex items-center justify-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-slate-500" /> Selected: <span className="underline">{studentFile.name}</span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-slate-500 font-semibold block text-[10px]">Drag &amp; drop file or click to select</span>
                          <span className="text-slate-400 text-[8px] block mt-1">Accepts PDF transcripts or JPEG scans</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit" disabled={formSubmitting}
                    className="btn-brand-primary w-full shadow-md py-3.5 uppercase tracking-wider text-xs cursor-pointer disabled:opacity-50"
                  >
                    {formSubmitting ? 'Filing Application...' : 'File clearance application'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* STUDENT TRACKING LIST view */}
        {currentSubView === 'tracking' && (
          <div className="max-w-4xl mx-auto text-left animate-fade-in space-y-6">
            <button 
              onClick={() => setCurrentSubView('landing')}
              className="text-xs text-secondary hover:text-primary font-bold flex items-center gap-1.5 mb-6 transition-colors"
            >
              ← Back to Landing
            </button>

            {/* Tracking Search Input Card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-widest font-sans">Academics Registry</span>
                <h3 className="font-serif text-xl font-bold text-primary mt-1">Track Letter Steppers</h3>
                <p className="text-xs text-slate-400 mt-1">Track submitted files and monitor real-time review stages.</p>
              </div>

              <form onSubmit={handleTrackSubmit} className="flex gap-3 font-sans">
                <input 
                  type="text" required placeholder="Enter student roll or File Ref ID (e.g. APP-...)"
                  value={trackRegd}
                  onChange={e => setTrackRegd(e.target.value)}
                  className="input-standard text-sm w-full"
                />
                <button 
                  type="submit" disabled={trackingLoading}
                  className="btn-brand-primary text-xs shrink-0 py-2.5 px-6 disabled:opacity-50"
                >
                  {trackingLoading ? 'Searching...' : 'Track File'}
                </button>
              </form>
            </div>

            {/* Results */}
            {trackedApps && (
              <div className="space-y-6 font-sans">
                {trackedApps.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center text-slate-400 font-semibold shadow-sm">
                    <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    No active tracking records match "{trackRegd}". Please verify the credentials.
                  </div>
                ) : (
                  trackedApps.map(app => (
                    <div key={app.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                      <div className="flex justify-between items-start flex-wrap gap-4 border-b border-slate-100 pb-4">
                        <div>
                          <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#f1f5f9] text-[#1e293b] tracking-wider">File Tracking Registry</span>
                          <h3 className="font-serif text-lg font-bold text-primary mt-1">File ID: {app.id}</h3>
                          <p className="text-[10px] text-slate-400 font-semibold mt-1">Type: {app.type} • Urgency: {app.urgency}</p>
                        </div>
                        {renderStatusBadge(app.status)}
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold text-slate-500">
                        <div><strong>Student Name:</strong> <span className="text-slate-800 font-bold">{capitalizeName(app.student_name)}</span></div>
                        <div><strong>Registration No:</strong> <span className="text-slate-800 font-mono">#{app.regd_no}</span></div>
                        <div><strong>Program Class:</strong> <span className="text-slate-800 font-medium">{app.program} &bull; {app.semester}</span></div>
                        <div><strong>Submitted Date:</strong> <span className="text-slate-800 font-medium">{new Date(app.submitted_at).toLocaleDateString()}</span></div>
                      </div>

                      {/* Stepper Timeline */}
                      <div className="border-t border-b border-slate-100 py-6 mb-6">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-4">Pipeline Stepper Timeline</span>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div className="text-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold mx-auto text-xs"><Check className="w-4 h-4" /></div>
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
                              {app.status === 'adviser_declined' ? <X className="w-4 h-4" /> : '2'}
                            </div>
                            <span className="text-[10px] font-bold block mt-2 text-primary">Advisor</span>
                          </div>
                          <div className="text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mx-auto text-xs ${
                              ['hos_approved', 'rejected', 'resolved'].includes(app.status)
                                ? 'bg-emerald-500 text-white'
                                : app.status === 'hos_declined'
                                ? 'bg-rose-500 text-white'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              {app.status === 'hos_declined' ? <X className="w-4 h-4" /> : '3'}
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
                              {app.status === 'rejected' ? <X className="w-4 h-4" /> : '4'}
                            </div>
                            <span className="text-[10px] font-bold block mt-2 text-primary">
                              {app.forwarded_to === 'dean_pga' ? 'Dean PGA' : app.forwarded_to === 'dean_academic' ? 'Dean Academic' : 'Exam Controller'}
                            </span>
                          </div>
                          <div className="text-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mx-auto text-xs ${
                              app.status === 'resolved' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}>
                              {app.status === 'resolved' ? <Check className="w-4 h-4" /> : '5'}
                            </div>
                            <span className="text-[10px] font-bold block mt-2 text-primary">Resolved</span>
                          </div>
                        </div>
                      </div>

                      {/* Comments strip */}
                      {app.adviser_comment && (
                        <div className="p-3 bg-sky-50 text-sky-800 text-xs font-semibold rounded-xl mb-2.5 border border-sky-100 flex items-start gap-2">
                          <ClipboardList className="w-4 h-4 mt-0.5 shrink-0 text-sky-700" />
                          <div>Advisor Remarks: "{app.adviser_comment}"</div>
                        </div>
                      )}
                      {app.hos_comment && (
                        <div className="p-3 bg-indigo-50 text-indigo-800 text-xs font-semibold rounded-xl mb-2.5 border border-indigo-100 flex items-start gap-2">
                          <Building className="w-4 h-4 mt-0.5 shrink-0 text-indigo-700" />
                          <div>Head of School Remarks: "{app.hos_comment}"</div>
                        </div>
                      )}
                      {app.dean_comment && (
                        <div className="p-3 bg-purple-50 text-purple-800 text-xs font-semibold rounded-xl mb-2.5 border border-purple-100 flex items-start gap-2">
                          <GraduationCap className="w-4 h-4 mt-0.5 shrink-0 text-purple-700" />
                          <div>{app.forwarded_to === 'dean_pga' ? 'Dean PGA' : 'Dean Academic'} Remarks: "{app.dean_comment}"</div>
                        </div>
                      )}
                      {app.controller_comment && (
                        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl mb-2.5 border border-emerald-100 flex items-start gap-2">
                          <ClipboardCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-700" />
                          <div>Controller Remarks: "{app.controller_comment}"</div>
                        </div>
                      )}

                      {/* Controller Attached Documents */}
                      {app.ctrl_attachments && app.ctrl_attachments.length > 0 && (
                        <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                          <span className="text-xs font-bold text-primary flex items-center gap-1.5 mb-2">
                            <FolderOpen className="w-4 h-4 text-primary" /> Official Attachments from Controller
                          </span>
                          <div className="space-y-2">
                            {app.ctrl_attachments.map((att, idx) => (
                              <div key={idx} className="flex justify-between items-center p-3 bg-white border border-slate-100 hover:border-accent/40 rounded-xl transition-all shadow-sm">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <Paperclip className="w-4 h-4 text-slate-400 shrink-0" />
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-semibold text-primary truncate max-w-[250px] md:max-w-[400px]">
                                      {att.desc || att.name}
                                    </span>
                                    <span className="text-[9px] text-muted truncate mt-0.5">
                                      File: {att.name}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => {
                                    setActiveFile({
                                      file_name: att.name,
                                      file_data: att.data,
                                      file_type: att.type
                                    });
                                    setShowFileModal(true);
                                  }}
                                  className="text-accent hover:text-accent-hover font-bold text-xs flex items-center gap-1 shrink-0 px-3 py-1.5 bg-slate-50 hover:bg-accent/5 rounded-lg transition-all border-none cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" /> View File
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* View document when resolved or rejected */}
                      {(app.status === 'resolved' || app.status === 'rejected') && (
                        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-150">
                          <div>
                            <span className="text-xs font-bold text-primary block">Official Document Issued</span>
                            <span className="text-[10px] text-muted block mt-0.5">The review committee has finalized and stamped your letter.</span>
                          </div>
                          <button
                            onClick={() => { setDocApp(app); setShowDocModal(true); }}
                            className="btn-brand-primary text-xs py-2 flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Document
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

        {/* STUDENT RESULTS & GRADES Tab */}
        {currentSubView === 'my-results' && (
          <div className="max-w-4xl mx-auto text-left animate-fade-in space-y-6">
            <button 
              onClick={() => setCurrentSubView('landing')}
              className="text-xs text-secondary hover:text-primary font-bold flex items-center gap-1.5 mb-6 transition-colors"
            >
              ← Back to Landing
            </button>
            <ExamManagementDesk role="student" sessionUser={userProfile} applications={applications} />
          </div>
        )}

        {/* STUDENT ADMIT CARDS Tab */}
        {currentSubView === 'my-admit-card' && (
          <div className="max-w-4xl mx-auto text-left animate-fade-in space-y-6">
            <button 
              onClick={() => setCurrentSubView('landing')}
              className="text-xs text-secondary hover:text-primary font-bold flex items-center gap-1.5 mb-6 transition-colors"
            >
              ← Back to Landing
            </button>
            <ExamManagementDesk role="student" sessionUser={userProfile} applications={applications} />
          </div>
        )}


        {/* ====================================================================
            FACULTY & COMMITTEE ROLES DASHBOARDS (Adviser, HoS, Deans, Controller)
            ==================================================================== */}
        
        {['adviser', 'hos', 'dean_pga', 'dean_academic', 'controller'].includes(currentSubView) && (
          <div className="space-y-6 text-left">
            {/* Header Banner */}
            <div className="bg-white/80 border border-slate-200/80 backdrop-blur-md rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-accent/20 bg-white">
                  <Building className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">Odisha University of Technology and Research</span>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mt-1">
                    {role === 'adviser' ? 'Faculty Advisor Panel' :
                     role === 'hos' ? 'Head of School Desk' :
                     role === 'dean_pga' ? 'Dean PGA Console' :
                     role === 'dean_academic' ? 'Dean Academic Console' :
                     'Exam Controller Panel'}
                  </h2>
                  <p className="text-xs text-muted font-medium mt-1">
                    Authority Member: <span className="font-semibold text-primary">{capitalizeName(userProfile?.name)}</span> {userProfile?.school_id && `• School: ${userProfile.school_id}`}
                  </p>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="w-full md:w-auto bg-slate-100 hover:bg-slate-200 border border-slate-200 text-primary font-semibold py-2.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>

            {/* Controller specific sub-desk navigator tab */}
            {currentSubView === 'controller' && (
              <div className="flex border-b border-slate-200 mb-6 gap-2">
                <button
                  onClick={() => setControllerTab('clearance')}
                  className={`px-6 py-2.5 font-serif font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    controllerTab === 'clearance'
                      ? 'border-accent text-primary'
                      : 'border-transparent text-slate-400 hover:text-primary hover:border-slate-200'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Clearance Pipeline
                </button>
                <button
                  onClick={() => setControllerTab('grades')}
                  className={`px-6 py-2.5 font-serif font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    controllerTab === 'grades'
                      ? 'border-accent text-primary'
                      : 'border-transparent text-slate-400 hover:text-primary hover:border-slate-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" /> Grade Cards Desk
                </button>
                <button
                  onClick={() => setControllerTab('admit_cards')}
                  className={`px-6 py-2.5 font-serif font-bold text-xs uppercase tracking-wider border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                    controllerTab === 'admit_cards'
                      ? 'border-accent text-primary'
                      : 'border-transparent text-slate-400 hover:text-primary hover:border-slate-200'
                  }`}
                >
                  <Ticket className="w-4 h-4" /> Admit Cards Desk
                </button>
              </div>
            )}

            {/* Clearance Pipeline View */}
            {(currentSubView !== 'controller' || controllerTab === 'clearance') ? (
              <>
                {/* Stats row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-amber-50/50 border border-amber-100 p-5 rounded-2xl text-left">
                    <RotateCcw className="w-5 h-5 text-amber-700" />
                    <div className="text-2xl font-serif font-black text-amber-800 mt-2">{pendingCount}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Awaiting Actions</div>
                  </div>
                  <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl text-left">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <div className="text-2xl font-serif font-black text-emerald-800 mt-2">{approvedCount}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Approved Decisions</div>
                  </div>
                  <div className="bg-rose-50/50 border border-rose-100 p-5 rounded-2xl text-left">
                    <AlertTriangle className="w-5 h-5 text-rose-700" />
                    <div className="text-2xl font-serif font-black text-rose-800 mt-2">{declinedCount}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Declined Decisions</div>
                  </div>
                  <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl text-left">
                    <FolderOpen className="w-5 h-5 text-sky-700" />
                    <div className="text-2xl font-serif font-black text-sky-800 mt-2">{filteredApps.length}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Total Assigned Files</div>
                  </div>
                </div>

                {/* Main applications list */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <h4 className="font-serif text-lg font-bold text-primary">Pending Letter Clearance Approvals</h4>
                  
                  <div className="table-container-responsive">
                    <table className="table-brand text-xs">
                      <thead>
                        <tr className="table-brand-header">
                          <th className="p-3 pl-4">Student</th>
                          <th className="p-3">File ID</th>
                          <th className="p-3">School / Dept</th>
                          <th className="p-3">Category Request</th>
                          <th className="p-3 text-center">Attachment</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3 text-center">Action Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApps.filter(a => {
                          if (role === 'adviser') return a.status === 'pending'
                          if (role === 'hos') return a.status === 'adviser_approved'
                          if (role === 'dean_pga') return a.status === 'hos_approved' && a.forwarded_to === 'dean_pga'
                          if (role === 'dean_academic') return a.status === 'hos_approved' && a.forwarded_to === 'dean_academic'
                          if (role === 'controller') return a.status === 'hos_approved' && (a.forwarded_to === 'controller' || !a.forwarded_to)
                          return false
                        }).length === 0 ? (
                          <tr><td colSpan="7" className="p-10 text-center text-slate-400 font-semibold">No clearance applications are currently awaiting review under your desk.</td></tr>
                        ) : filteredApps.filter(a => {
                          if (role === 'adviser') return a.status === 'pending'
                          if (role === 'hos') return a.status === 'adviser_approved'
                          if (role === 'dean_pga') return a.status === 'hos_approved' && a.forwarded_to === 'dean_pga'
                          if (role === 'dean_academic') return a.status === 'hos_approved' && a.forwarded_to === 'dean_academic'
                          if (role === 'controller') return a.status === 'hos_approved' && (a.forwarded_to === 'controller' || !a.forwarded_to)
                          return false
                        }).map(app => (
                          <tr key={app.id} className="table-brand-row">
                            <td className="p-3 pl-4">
                              <div className="font-bold text-primary">{capitalizeName(app.student_name)}</div>
                              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Roll: #{app.regd_no}</div>
                            </td>
                            <td className="p-3 font-mono font-bold text-slate-500">#{app.id}</td>
                            <td className="p-3">{app.school_short} ({app.program})</td>
                            <td className="p-3 font-semibold">{app.type}</td>
                            <td className="p-3 text-center">
                              {app.file_data ? (
                                <button
                                  onClick={() => {
                                    setActiveFile({
                                      file_name: app.file_name || 'Letter.pdf',
                                      file_data: app.file_data,
                                      file_type: app.file_type || 'application/pdf'
                                    });
                                    setShowFileModal(true);
                                  }}
                                  className="bg-slate-50 hover:bg-[#eff6ff] text-[#0b3c5d] font-bold p-1 px-2.5 rounded-lg border-none text-[10px] inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" /> View File
                                </button>
                              ) : <span className="text-slate-300 font-bold">None</span>}
                            </td>
                            <td className="p-3 text-center">{renderStatusBadge(app.status)}</td>
                            <td className="p-3 text-center">
                              <div className="flex gap-2 justify-center">
                                <button 
                                  onClick={() => triggerReviewAction(app, 'approve')}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-1 px-3 rounded-lg text-[10px] border-none transition-colors inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3 h-3" /> Approve
                                </button>
                                <button 
                                  onClick={() => triggerReviewAction(app, 'decline')}
                                  className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-1 px-3 rounded-lg text-[10px] border-none transition-colors inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <X className="w-3 h-3" /> Decline
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* History list card */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <h4 className="font-serif text-lg font-bold text-primary">Decisions Clearance History</h4>
                  
                  <div className="table-container-responsive">
                    <table className="table-brand text-xs">
                      <thead>
                        <tr className="table-brand-header">
                          <th className="p-3 pl-4">Student</th>
                          <th className="p-3">File ID</th>
                          <th className="p-3">Category Request</th>
                          <th className="p-3 text-center">Attachment</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3 text-center"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApps.filter(a => {
                          if (role === 'adviser') return ['adviser_approved', 'adviser_declined', 'hos_approved', 'hos_declined', 'resolved', 'rejected'].includes(a.status)
                          if (role === 'hos') return ['hos_approved', 'hos_declined', 'resolved', 'rejected'].includes(a.status)
                          if (role === 'dean_pga' || role === 'dean_academic') return (a.status === 'resolved' || a.status === 'rejected') && a.forwarded_to === role
                          if (role === 'controller') return (a.status === 'resolved' || a.status === 'rejected') && (a.forwarded_to === 'controller' || !a.forwarded_to)
                          return false
                        }).length === 0 ? (
                          <tr><td colSpan="6" className="p-10 text-center text-slate-400 font-semibold">No processed application records in your history archive.</td></tr>
                        ) : filteredApps.filter(a => {
                          if (role === 'adviser') return ['adviser_approved', 'adviser_declined', 'hos_approved', 'hos_declined', 'resolved', 'rejected'].includes(a.status)
                          if (role === 'hos') return ['hos_approved', 'hos_declined', 'resolved', 'rejected'].includes(a.status)
                          if (role === 'dean_pga' || role === 'dean_academic') return (a.status === 'resolved' || a.status === 'rejected') && a.forwarded_to === role
                          if (role === 'controller') return (a.status === 'resolved' || a.status === 'rejected') && (a.forwarded_to === 'controller' || !a.forwarded_to)
                          return false
                        }).map(app => (
                          <tr key={app.id} className="table-brand-row">
                            <td className="p-3 pl-4">
                              <div className="font-bold text-primary">{capitalizeName(app.student_name)}</div>
                              <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Roll: #{app.regd_no}</div>
                            </td>
                            <td className="p-3 font-mono font-bold text-slate-500">#{app.id}</td>
                            <td className="p-3 font-semibold">{app.type} ({app.school_short})</td>
                            <td className="p-3 text-center">
                              {app.file_data ? (
                                <button
                                  onClick={() => {
                                    setActiveFile({
                                      file_name: app.file_name || 'Letter.pdf',
                                      file_data: app.file_data,
                                      file_type: app.file_type || 'application/pdf'
                                    });
                                    setShowFileModal(true);
                                  }}
                                  className="bg-slate-50 hover:bg-[#eff6ff] text-[#0b3c5d] font-bold p-1 px-2.5 rounded-lg border-none text-[10px] inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" /> View File
                                </button>
                              ) : <span className="text-slate-300 font-bold">None</span>}
                            </td>
                            <td className="p-3 text-center">{renderStatusBadge(app.status)}</td>
                            <td className="p-3 text-center">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => { setSelectedApp(app); setShowUploadModal(true); }}
                                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-1 px-3 rounded-lg border-none text-[10px] inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Paperclip className="w-3 h-3" /> Attachments ({app.ctrl_attachments?.length || 0})
                                </button>
                                {(app.status === 'resolved' || app.status === 'rejected') && (
                                  <button
                                    onClick={() => handlePrintOfficialDoc(app)}
                                    className="bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold py-1 px-3 rounded-lg border-none text-[10px] inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Printer className="w-3 h-3" /> Print Order
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              /* Controller sub-desk Tab contents */
              <div className="animate-fade-in">
                <ExamManagementDesk role="controller" sessionUser={userProfile} applications={applications} />
              </div>
            )}
          </div>
        )}

      </div>

      {/* ====================================================================
          UNIVERSAL DIALOGS, MODALS, & TOAST FLOATING VIEWS
          ==================================================================== */}

      {/* 1. File Viewer Modal */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-3xl w-full p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => { setShowFileModal(false); setActiveFile(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-lg font-bold text-primary">Document Preview Viewer</h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">File: {activeFile?.file_name}</p>
            
            <div className="h-[60vh] bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-center overflow-hidden relative">
              {activeFileUrl ? (
                activeFile.file_type?.startsWith('image/') || activeFile.file_name?.match(/\.(png|jpe?g|gif|webp)$/i) ? (
                  <img src={activeFileUrl} alt="Preview Document" className="w-full h-full object-contain" />
                ) : (
                  <iframe src={activeFileUrl} title="Document PDF Preview" className="w-full h-full border-none"></iframe>
                )
              ) : (
                <div className="text-center p-6 space-y-4 animate-pulse">
                  <div className="w-10 h-10 border-4 border-t-accent border-slate-200 rounded-full animate-spin mx-auto"></div>
                  <span className="text-slate-400 text-xs font-semibold">Generating dynamic secure file link...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Decision Review Form Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans text-left">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-6">
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div>
              <span className="text-[9px] font-bold text-accent uppercase tracking-widest">Academics Board</span>
              <h3 className="font-serif text-lg font-bold text-primary mt-1">Review Clearance Application</h3>
              <p className="text-[10px] text-slate-400 mt-1">Submit audit evaluative statement regarding student letter ID #{selectedApp?.id}</p>
            </div>

            <div className="space-y-4 text-xs font-semibold text-primary">
              <div>
                <label className="block uppercase tracking-wider text-[10px] mb-1.5">Action Status Decision</label>
                <div className={`p-3 rounded-xl border text-sm font-bold capitalize flex items-center gap-2 ${reviewAction === 'approve' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                  {reviewAction === 'approve' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                      <span>RECOMMENDED &amp; APPROVED</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-800 shrink-0" />
                      <span>REFUSED &amp; DECLINED</span>
                    </>
                  )}
                </div>
              </div>

              {role === 'hos' && reviewAction === 'approve' && (
                <div>
                  <label className="block uppercase tracking-wider text-[10px] mb-1.5">Forward Routing Destination</label>
                  <select 
                    value={forwardRoute}
                    onChange={e => setForwardRoute(e.target.value)}
                    className="input-standard bg-white font-medium text-xs"
                  >
                    <option value="controller">Exam Controller cell</option>
                    <option value="dean_academic">Dean Academics office</option>
                    <option value="dean_pga">Dean Post Graduate Affairs (PGA)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block uppercase tracking-wider text-[10px] mb-1.5">Official Remarks / Comments</label>
                <textarea 
                  required rows="3" placeholder="Enter evaluation reasons..."
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  className="input-standard font-medium text-xs resize-none"
                ></textarea>
              </div>

              <button 
                onClick={handleReviewSubmit} disabled={actionLoading}
                className="btn-brand-primary w-full shadow-md py-3 uppercase text-xs disabled:opacity-50"
              >
                {actionLoading ? 'Saving Decision...' : 'Publish official decision'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Official Stamped Order Document Modal */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto text-left">
            <button 
              onClick={() => { setShowDocModal(false); setDocApp(null); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="border border-slate-200 p-6 rounded-2xl bg-white space-y-6">
              {/* Document Header */}
              <div className="text-center border-b-2 border-slate-800 pb-3 flex flex-col items-center">
                <img src="https://outr.ac.in/public/uploads/logo_4.png" alt="OUTR Seal" className="w-10 h-10 object-contain mb-1" />
                <h4 className="font-serif font-black text-sm uppercase text-slate-800 leading-tight">Odisha University of Technology and Research</h4>
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Techno Campus, Ghatikia, Bhubaneswar - 751003</p>
                <p className="text-[7px] text-[#0b3c5d] font-bold tracking-widest uppercase mt-1">Office of the Academics Resolution Cell</p>
              </div>

              {/* Reference */}
              <div className="flex justify-between items-center text-[8.5px] text-slate-500 font-bold">
                <span>REF NO: OUTR/ARC/2026/{docApp?.id}</span>
                <span>DATE: {new Date(docApp?.resolved_at || docApp?.submitted_at).toLocaleDateString()}</span>
              </div>

              {/* Subject */}
              <h5 className="font-serif font-black text-xs text-center uppercase underline tracking-wide text-primary">
                Subject: Resolution Order regarding {docApp?.type?.toUpperCase()}
              </h5>

              {/* Document Copy */}
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                This official resolution statement is issued to <strong className="font-bold text-primary">{capitalizeName(docApp?.student_name)}</strong>, registration roll number <strong className="font-bold text-slate-800">#{docApp?.regd_no}</strong>, pursuing course work under <strong className="font-bold text-slate-800">{docApp?.program}</strong> in the department of <strong className="font-bold text-slate-800">{docApp?.school_name}</strong>.
              </p>

              <div className="p-3 bg-slate-50 border-l-2 border-slate-400 text-[10px] italic text-slate-500 font-medium leading-relaxed rounded-r-xl">
                "Applicant Statement: {docApp?.description}"
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                The academic approval cell has reviewed the evaluations submitted by the Faculty Advisor and verified by the Head of School. It is hereby resolved that the request for <strong>{docApp?.type}</strong> stands 
                <strong className={`font-black uppercase ml-1 ${docApp?.status === 'resolved' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {docApp?.status === 'resolved' ? 'APPROVED' : 'DECLINED'}
                </strong>.
              </p>

              {docApp?.controller_comment && (
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  <strong>Special Directives / Conditions:</strong> "{docApp.controller_comment}"
                </p>
              )}

              {/* Signatures */}
              <div className="flex justify-between items-end pt-6">
                {/* Stamp */}
                <div className="border border-emerald-500 text-emerald-500 border-dashed rounded-full w-14 h-14 flex flex-col items-center justify-center text-[5px] font-black text-center transform -rotate-12 opacity-85 bg-emerald-50/20">
                  <span>OUTR</span>
                  <span className="border-t border-b border-emerald-500 py-0.5 my-0.5 px-0.5">APPROVED</span>
                  <span>ACADEMICS</span>
                </div>

                {/* Stamped signature */}
                <div className="text-right text-[9px] font-bold text-slate-800">
                  <div className="border-t border-slate-400 w-28 ml-auto mb-1.5"></div>
                  <div>
                    {docApp?.forwarded_to === 'dean_pga' ? 'Dr. Debabrata Dhupal' : docApp?.forwarded_to === 'dean_academic' ? 'Dr. Ranjan Kumar Senapati' : 'Dr. Anupama Rath'}
                  </div>
                  <div className="text-[6.5px] text-slate-500 uppercase font-semibold mt-0.5 leading-none">
                    {docApp?.forwarded_to === 'dean_pga' ? 'Dean, Post Graduate Affairs' : docApp?.forwarded_to === 'dean_academic' ? 'Dean, Academic Affairs' : 'Exam Controller'}
                  </div>
                  <div className="text-[5.5px] text-slate-400">Odisha University of Tech &amp; Research</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => handlePrintOfficialDoc(docApp)}
              className="btn-brand-primary w-full shadow-md py-3.5 uppercase text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Resolution Order
            </button>
          </div>
        </div>
      )}

      {/* 4. Controller Attachments Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans text-left">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative space-y-6">
            <button 
              onClick={() => setShowUploadModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-1">
                <FolderOpen className="w-3.5 h-3.5 text-accent" /> Academics File System
              </span>
              <h3 className="font-serif text-lg font-bold text-primary mt-1">Official Document Attachments</h3>
              <p className="text-[10px] text-slate-400 mt-1">Attach certified clearance documents or signed transcripts for File ID #{selectedApp?.id}</p>
            </div>

            {/* List existing attachments */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Existing Attachments ({selectedApp?.ctrl_attachments?.length || 0})</span>
              {(!selectedApp?.ctrl_attachments || selectedApp.ctrl_attachments.length === 0) ? (
                <span className="text-slate-400 text-xs font-semibold block text-center py-2">No attachments found.</span>
              ) : (
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {selectedApp.ctrl_attachments.map((att, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-150 rounded-xl">
                      <span className="text-xs font-semibold text-primary truncate max-w-[200px]">{att.desc || att.name}</span>
                      <button
                        onClick={() => removeControllerAttachment(idx)}
                        className="text-rose-500 hover:text-rose-700 text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded-lg cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload new attachment form */}
            <div className="border-t border-slate-100 pt-4 space-y-4 text-xs font-semibold text-primary">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Attach New Document</span>
              <div>
                <label className="block uppercase tracking-wider text-[10px] mb-1">Attachment Custom Label / Description *</label>
                <input 
                  type="text" placeholder="e.g. Official Signed Transcript Copy"
                  value={uploadDesc}
                  onChange={e => setUploadDesc(e.target.value)}
                  className="input-standard font-medium text-xs"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-[10px] mb-1.5 block">Select File (PDF/Image max 10MB) *</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50 relative cursor-pointer group">
                  <input 
                    type="file" id="ctrl_file_upload" accept="application/pdf,image/*"
                    onChange={handleCtrlFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {uploadFile ? (
                    <span className="text-primary font-bold text-[10px] flex items-center justify-center gap-1">
                      <Paperclip className="w-3.5 h-3.5 text-slate-500" /> Selected: <span className="underline">{uploadFile.name}</span>
                    </span>
                  ) : (
                    <span className="text-slate-400 font-semibold text-[10px] block flex flex-col items-center gap-1.5">
                      <Upload className="w-5 h-5 text-slate-400 animate-bounce" />
                      <span>Drag &amp; drop or click to select letter</span>
                    </span>
                  )}
                </div>
              </div>

              <button 
                onClick={saveControllerAttachment} disabled={actionLoading || !uploadFile}
                className="btn-brand-primary w-full shadow-md py-3 uppercase text-xs disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" /> {actionLoading ? 'Uploading attachment...' : 'Attach document letter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Custom Reusable Alert/Dialog Modal */}
      {customModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl text-center space-y-4 relative overflow-hidden">
            {customModal.type === 'confirm' ? (
              <>
                <Info className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
                <h4 className="font-serif text-lg font-bold text-primary mt-2">{customModal.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{customModal.message}</p>
                <div className="flex gap-3 justify-center pt-2">
                  <button 
                    onClick={() => { 
                      if (customModal.onConfirm) customModal.onConfirm(); 
                      setCustomModal(prev => ({ ...prev, show: false })); 
                    }}
                    className="btn-brand-primary text-xs py-2 px-5 cursor-pointer"
                  >
                    Confirm Action
                  </button>
                  <button 
                    onClick={() => setCustomModal(prev => ({ ...prev, show: false }))}
                    className="btn-brand-secondary text-xs py-2 px-5 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center">
                  {customModal.type === 'success' ? (
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                  ) : customModal.type === 'error' ? (
                    <AlertTriangle className="w-12 h-12 text-rose-600 animate-bounce" />
                  ) : (
                    <Info className="w-12 h-12 text-[#0b3c5d]" />
                  )}
                </div>
                <h4 className="font-serif text-lg font-bold text-primary mt-2">{customModal.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{customModal.message}</p>
                <button 
                  onClick={() => setCustomModal(prev => ({ ...prev, show: false }))}
                  className="btn-brand-primary w-full text-xs py-2.5 mt-2 cursor-pointer"
                >
                  Close Notice
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 6. Push notifications toast container */}
      <div className="fixed bottom-4 left-4 z-50 space-y-2.5 max-w-sm w-full font-sans select-none pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="p-3.5 bg-slate-900/95 text-white border border-slate-700/80 rounded-2xl shadow-xl flex items-center gap-3 animate-shake pointer-events-auto">
            <span className="text-xs font-semibold leading-snug">{t.text}</span>
          </div>
        ))}
      </div>

    </Layout>
  )
}
