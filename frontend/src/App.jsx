import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'
import Layout from './components/Layout'
import AuthPortal from './pages/AuthPortal'
import WardenDashboard from './pages/WardenDashboard'
import FileTrackingDashboard from './pages/FileTrackingDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { BoardOfGovernors, AntiRaggingCommittee, VCDesk, COEDesk } from './pages/InstitutionalPages'
import DeanDesk from './pages/DeanDesk'
import HODDesk from './pages/HODDesk'
import SyllabusDesk from './pages/SyllabusDesk'


function App() {
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const viewParam = params.get('view')
    if (viewParam) {
      if (viewParam === 'bom') return 'bom'
      if (viewParam === 'antiragging') return 'antiragging'
      if (viewParam === 'vc-desk') return 'vc-desk'
      if (viewParam === 'coe-desk') return 'coe-desk'
      if (viewParam === 'deans') return 'deans'
      if (viewParam === 'hods') return 'hods'
      if (viewParam === 'syllabus') return 'syllabus'
      if (viewParam === 'student-clearance') return 'file-tracking-student'
      if (viewParam === 'warden' || viewParam === 'auth') return 'auth'
      if (viewParam === 'portal') return 'portal'
    }
    return 'home'
  })
  const [selectedRoleForPortal, setSelectedRoleForPortal] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const viewParam = params.get('view')
    if (viewParam === 'warden') return 'warden'
    if (viewParam === 'auth') {
      return params.get('role') || null
    }
    return null
  })
  const [sessionUser, setSessionUser] = useState(null)

  const currentViewRef = useRef(currentView)
  useEffect(() => {
    currentViewRef.current = currentView
  }, [currentView])

  const redirectBasedOnRole = (role) => {
    if (role === 'admin') {
      setCurrentView('admin-dashboard')
    } else if (role === 'student') {
      setCurrentView('file-tracking-student')
    } else if (role === 'warden') {
      setCurrentView('warden-dashboard')
    } else if (role === 'adviser') {
      setCurrentView('adviser-dashboard')
    } else if (role === 'hos') {
      setCurrentView('hos-dashboard')
    } else if (role === 'controller') {
      setCurrentView('controller-dashboard')
    } else if (role === 'dean_pga') {
      setCurrentView('dean-pga-dashboard')
    } else if (role === 'dean_academic') {
      setCurrentView('dean-academic-dashboard')
    }
  }

  const checkSessionRole = async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      const { data: { user } } = await supabase.auth.getUser()
      const profileWithEmail = {
        ...profile,
        email: user?.email || ''
      }
      setSessionUser(profileWithEmail)
      redirectBasedOnRole(profile.role)
    } catch (err) {
      console.warn('Session profile lookup failed:', err.message)
      // Check user metadata as fallback
      const user = (await supabase.auth.getUser()).data.user
      const metaRole = user?.user_metadata?.role
      if (metaRole) {
        const fallbackProfile = {
          id: userId,
          role: metaRole,
          name: user?.user_metadata?.name || user?.email || 'Authenticated User',
          school_id: user?.user_metadata?.school_id || 'SCS',
          email: user?.email
        }
        setSessionUser(fallbackProfile)
        redirectBasedOnRole(metaRole)
      }
    }
  }

  // Unified Session and URL Query Parameters Checker on Mount
  useEffect(() => {
    // Listen to real-time auth changes (GoTrue fires INITIAL_SESSION synchronously on mount)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const params = new URLSearchParams(window.location.search)
      const viewParam = params.get('view')

      if (session) {
        // Retrieving the active user role and displaying dashboard on initial load or token refresh.
        // Active logins are handled directly by handleLoginSuccess to avoid race conditions.
        if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
          await checkSessionRole(session.user.id)
        }
        setLoading(false)
      } else {
        const prevView = currentViewRef.current
        const isDashboard = prevView.endsWith('-dashboard') || prevView === 'file-tracking-student' || prevView === 'portal'

        // Reset only if not local profile mode
        setSessionUser((currUser) => {
          if (currUser && currUser.isLocal) {
            return currUser
          }
          return null
        })
        setSelectedRoleForPortal(null)

        if (isDashboard) {
          setCurrentView('portal')
          setLoading(false)
        } else if (viewParam) {
          setLoading(false)
        } else {
          window.location.replace('/home.html')
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // If currentView is set to 'home' (such as upon logout or home click), redirect back to designed home.html
  useEffect(() => {
    if (currentView === 'home') {
      window.location.replace('/home.html')
    }
  }, [currentView])

  // Synchronize state changes dynamically back to the URL query parameters
  useEffect(() => {
    if (loading) return

    const params = new URLSearchParams(window.location.search)
    let targetView = null
    let targetRole = null

    if (currentView === 'portal') {
      targetView = 'portal'
    } else if (currentView === 'auth') {
      if (selectedRoleForPortal === 'warden') {
        targetView = 'warden'
      } else {
        targetView = 'auth'
        if (selectedRoleForPortal) {
          targetRole = selectedRoleForPortal
        }
      }
    } else if (currentView === 'bom') {
      targetView = 'bom'
    } else if (currentView === 'antiragging') {
      targetView = 'antiragging'
    } else if (currentView === 'vc-desk') {
      targetView = 'vc-desk'
    } else if (currentView === 'coe-desk') {
      targetView = 'coe-desk'
    } else if (currentView === 'deans') {
      targetView = 'deans'
    } else if (currentView === 'hods') {
      targetView = 'hods'
    } else if (currentView === 'syllabus') {
      targetView = 'syllabus'
    } else if (currentView === 'file-tracking-student') {
      targetView = 'student-clearance'
    }

    if (targetView) {
      const newParams = new URLSearchParams()
      newParams.set('view', targetView)
      if (targetRole) {
        newParams.set('role', targetRole)
      }
      const newSearch = newParams.toString()
      const currentSearch = window.location.search.replace(/^\?/, '')
      if (newSearch !== currentSearch) {
        window.history.pushState(null, '', `/?${newSearch}`)
      }
    } else if (currentView !== 'home') {
      // Clean up search query params for logged-in dashboards or other non-sync views
      if (window.location.search) {
        window.history.pushState(null, '', '/')
      }
    }
  }, [currentView, selectedRoleForPortal, loading])

  const handleLoginSuccess = (role, user) => {
    setSessionUser(user)
    if (role === 'admin') {
      setCurrentView('admin-dashboard')
    } else if (role === 'student') {
      setCurrentView('file-tracking-student')
    } else if (role === 'warden') {
      setCurrentView('warden-dashboard')
    } else if (role === 'adviser') {
      setCurrentView('adviser-dashboard')
    } else if (role === 'hos') {
      setCurrentView('hos-dashboard')
    } else if (role === 'controller') {
      setCurrentView('controller-dashboard')
    } else if (role === 'dean_pga') {
      setCurrentView('dean-pga-dashboard')
    } else if (role === 'dean_academic') {
      setCurrentView('dean-academic-dashboard')
    } else {
      console.log(`Authenticated successfully as ${role}!`)
      setCurrentView('home')
    }
  }

  const openPortalForRole = (role) => {
    setSelectedRoleForPortal(role)
    setCurrentView('auth')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b3c5d] flex flex-col items-center justify-center text-white select-none">
        <div className="w-16 h-16 border-4 border-t-[#d4af37] border-white/20 rounded-full animate-spin mb-4"></div>
        <p className="font-serif text-lg tracking-wider font-bold">Odisha University of Technology and Research</p>
        <p className="text-white/60 text-xs mt-2 uppercase tracking-widest">Unified Services Portal</p>
      </div>
    )
  }

  if (currentView === 'admin-dashboard') {
    return (
      <AdminDashboard 
        sessionUser={sessionUser}
        onSignOut={async () => {
          setSessionUser(null)
          await supabase.auth.signOut()
          setCurrentView('portal')
        }}
        onNavigate={(view) => setCurrentView(view)}
      />
    )
  }

  if (currentView === 'warden-dashboard') {
    return (
      <WardenDashboard 
        sessionUser={sessionUser}
        onSignOut={async () => {
          setSessionUser(null)
          await supabase.auth.signOut()
          setCurrentView('portal')
        }} 
        onNavigate={(view) => setCurrentView(view)}
      />
    )
  }

  if (currentView === 'adviser-dashboard') {
    return (
      <FileTrackingDashboard 
        role="adviser" 
        sessionUser={sessionUser}
        onSignOut={async () => {
          setSessionUser(null)
          await supabase.auth.signOut()
          setCurrentView('portal')
        }} 
        onNavigate={(view) => setCurrentView(view)}
      />
    )
  }

  if (currentView === 'hos-dashboard') {
    return (
      <FileTrackingDashboard 
        role="hos" 
        sessionUser={sessionUser}
        onSignOut={async () => {
          setSessionUser(null)
          await supabase.auth.signOut()
          setCurrentView('portal')
        }} 
        onNavigate={(view) => setCurrentView(view)}
      />
    )
  }

  if (currentView === 'dean-pga-dashboard') {
    return (
      <FileTrackingDashboard 
        role="dean_pga" 
        sessionUser={sessionUser}
        onSignOut={async () => {
          setSessionUser(null)
          await supabase.auth.signOut()
          setCurrentView('portal')
        }} 
        onNavigate={(view) => setCurrentView(view)}
      />
    )
  }

  if (currentView === 'dean-academic-dashboard') {
    return (
      <FileTrackingDashboard 
        role="dean_academic" 
        sessionUser={sessionUser}
        onSignOut={async () => {
          setSessionUser(null)
          await supabase.auth.signOut()
          setCurrentView('portal')
        }} 
        onNavigate={(view) => setCurrentView(view)}
      />
    )
  }

  if (currentView === 'controller-dashboard') {
    return (
      <FileTrackingDashboard 
        role="controller" 
        sessionUser={sessionUser}
        onSignOut={async () => {
          setSessionUser(null)
          await supabase.auth.signOut()
          setCurrentView('portal')
        }} 
        onNavigate={(view) => setCurrentView(view)}
      />
    )
  }

  if (currentView === 'file-tracking-student') {
    return (
      <FileTrackingDashboard 
        role="student" 
        sessionUser={sessionUser}
        onSignOut={async () => {
          setSessionUser(null)
          await supabase.auth.signOut()
          setCurrentView('portal')
        }} 
        onNavigate={(view) => setCurrentView(view)}
      />
    )
  }

  if (currentView === 'bom') {
    return (
      <Layout onNavigate={setCurrentView}>
        <BoardOfGovernors />
      </Layout>
    )
  }

  if (currentView === 'antiragging') {
    return (
      <Layout onNavigate={setCurrentView}>
        <AntiRaggingCommittee />
      </Layout>
    )
  }

  if (currentView === 'vc-desk') {
    return (
      <Layout onNavigate={setCurrentView}>
        <VCDesk />
      </Layout>
    )
  }

  if (currentView === 'coe-desk') {
    return (
      <Layout onNavigate={setCurrentView}>
        <COEDesk onNavigate={setCurrentView} />
      </Layout>
    )
  }

  if (currentView === 'deans') {
    return (
      <Layout onNavigate={setCurrentView}>
        <DeanDesk />
      </Layout>
    )
  }

  if (currentView === 'hods') {
    return (
      <Layout onNavigate={setCurrentView}>
        <HODDesk />
      </Layout>
    )
  }

  if (currentView === 'syllabus') {
    return (
      <Layout onNavigate={setCurrentView}>
        <SyllabusDesk />
      </Layout>
    )
  }

  if (currentView === 'portal' || currentView === 'auth') {
    return (
      <div className="relative">
        <AuthPortal 
          initialRole={selectedRoleForPortal} 
          onLoginSuccess={handleLoginSuccess}
        />
        {/* Universal Back to Homepage helper */}
        <button
          onClick={() => {
            setCurrentView('home')
          }}
          className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold py-2.5 px-4 rounded-full shadow-lg border border-slate-700/50 hover:scale-105 transition-all duration-300"
        >
          ↩ Return to University Homepage
        </button>
      </div>
    )
  }

  // Fallback default return: unified login gateway
  return (
    <div className="relative">
      <AuthPortal 
        initialRole={selectedRoleForPortal} 
        onLoginSuccess={handleLoginSuccess}
      />
      {/* Universal Back to Homepage helper */}
      <button
        onClick={() => {
          setCurrentView('home')
        }}
        className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold py-2.5 px-4 rounded-full shadow-lg border border-slate-700/50 hover:scale-105 transition-all duration-300"
      >
        ↩ Return to University Homepage
      </button>
    </div>
  )
}

export default App
