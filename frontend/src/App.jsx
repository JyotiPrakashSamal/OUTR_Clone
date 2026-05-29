import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Layout from './components/Layout'
import AuthPortal from './pages/AuthPortal'
import WardenDashboard from './pages/WardenDashboard'
import FileTrackingDashboard from './pages/FileTrackingDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { BoardOfGovernors, AntiRaggingCommittee, VCDesk, COEDesk } from './pages/InstitutionalPages'

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
      setSessionUser(profile)
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
    const checkAuthAndParams = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const params = new URLSearchParams(window.location.search)
        const viewParam = params.get('view')

        if (session) {
          // Retrieving the active user role and displaying dashboard
          await checkSessionRole(session.user.id)
          setLoading(false)
        } else {
          // Guest mode
          if (viewParam) {
            // Allows displaying the requested public/auth view immediately
            setLoading(false)
          } else {
            // No active session and no target view, redirect directly to static designed home.html
            window.location.replace('/home.html')
          }
        }
      } catch (err) {
        console.error("Authentication/Routing initialization failed:", err)
        setLoading(false)
      }
    }

    checkAuthAndParams()

    // Listen to real-time auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await checkSessionRole(session.user.id)
        setLoading(false)
      } else {
        // Reset only if not local profile mode
        setSessionUser((currUser) => {
          if (currUser && currUser.isLocal) {
            return currUser
          }
          setCurrentView((prev) => {
            if (prev.endsWith('-dashboard') || prev === 'file-tracking-student') return 'home'
            return prev
          })
          return null
        })
        setSelectedRoleForPortal(null)
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
          setCurrentView('home')
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
          setCurrentView('home')
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
          setCurrentView('home')
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
          setCurrentView('home')
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
          setCurrentView('home')
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
          setCurrentView('home')
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
          setCurrentView('home')
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
        onSignOut={() => {
          setSessionUser(null)
          setCurrentView('home')
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

  if (currentView === 'auth') {
    return (
      <div className="relative">
        <AuthPortal 
          initialRole={selectedRoleForPortal} 
          onLoginSuccess={handleLoginSuccess}
        />
        {/* Universal Back to Home overlay helper for testing convenience */}
        <button
          onClick={() => {
            setCurrentView('portal')
            setSelectedRoleForPortal(null)
          }}
          className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold py-2.5 px-4 rounded-full shadow-lg border border-slate-700/50 hover:scale-105 transition-all duration-300"
        >
          🏠 Return to Landing Desk
        </button>
      </div>
    )
  }

  if (currentView === 'portal') {
    return (
      <Layout onNavigate={setCurrentView}>
        {/* Main Content Area */}
        <div className="flex flex-col items-center justify-center px-6 py-20 max-w-4xl mx-auto text-center animate-fade-in select-none">
          {/* Logo Shield Placeholder */}
          <div className="w-24 h-24 mb-6 rounded-full bg-primary/5 flex items-center justify-center border-2 border-accent/30 shadow-lg shadow-primary/5">
            <img 
              src="https://outr.ac.in/public/uploads/logo_4.png" 
              alt="OUTR Shield" 
              className="w-16 h-16 object-contain"
            />
          </div>

          {/* Hero Section */}
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary font-bold tracking-tight leading-tight mb-4">
            Odisha University of <br />
            <span className="text-secondary">Technology and Research</span>
          </h1>
          
          <p className="text-muted max-w-xl mx-auto text-lg mb-8 leading-relaxed font-medium">
            Official unified services portal for students, faculty, and administrative departments of OUTR Bhubaneswar.
          </p>

          {/* Quick Access Portal Modules Grid */}
          <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto mb-12">
            {/* Card 1: Warden Portal */}
            <div 
              onClick={() => openPortalForRole('warden')}
              className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/60 shadow-md shadow-slate-100 flex flex-col justify-between text-left group hover:border-accent/40 hover:shadow-lg transition-all duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  🔑
                </div>
                <h3 className="font-serif text-xl font-bold text-primary mb-2">Hostel Warden Portal</h3>
                <p className="text-muted text-sm leading-relaxed mb-4">
                  Secure access control panel for room allocation, student check-in/out records, and live hostel statistics.
                </p>
              </div>
              <div className="text-accent text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                Access Portal <span>→</span>
              </div>
            </div>

            {/* Card 2: Academic Applications Desk */}
            <div 
              onClick={() => setCurrentView('file-tracking-student')}
              className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/60 shadow-md shadow-slate-100 flex flex-col justify-between text-left group hover:border-accent/40 hover:shadow-lg transition-all duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  📄
                </div>
                <h3 className="font-serif text-xl font-bold text-primary mb-2">Academic Applications</h3>
                <p className="text-muted text-sm leading-relaxed mb-4">
                  Submit academic applications, request fee concessions or certificates, and track live review timelines.
                </p>
              </div>
              <div className="text-accent text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                Open Applications Center <span>→</span>
              </div>
            </div>
          </div>

          {/* Global Access Button */}
          <div className="mb-8">
            <button
              onClick={() => setCurrentView('auth')}
              className="bg-primary hover:bg-secondary text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            >
              Go to Dedicated Login Portal
            </button>
          </div>

          {/* Security Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary px-4 py-2 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            🔒 Secured under OUTR Unified Encryption Protocol • Bhubaneswar
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout onNavigate={setCurrentView}>
      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center px-6 py-20 max-w-4xl mx-auto text-center animate-fade-in select-none">
        {/* Logo Shield Placeholder */}
        <div className="w-24 h-24 mb-6 rounded-full bg-primary/5 flex items-center justify-center border-2 border-accent/30 shadow-lg shadow-primary/5">
          <img 
            src="https://outr.ac.in/public/uploads/logo_4.png" 
            alt="OUTR Shield" 
            className="w-16 h-16 object-contain"
          />
        </div>

        {/* Hero Section */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary font-bold tracking-tight leading-tight mb-4">
          Odisha University of <br />
          <span className="text-secondary">Technology and Research</span>
        </h1>
        
        <p className="text-muted max-w-xl mx-auto text-lg mb-8 leading-relaxed font-medium">
          Official unified services portal for students, faculty, and administrative departments of OUTR Bhubaneswar.
        </p>

        {/* Quick Access Portal Modules Grid */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto mb-12">
          {/* Card 1: Warden Portal */}
          <div 
            onClick={() => openPortalForRole('warden')}
            className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/60 shadow-md shadow-slate-100 flex flex-col justify-between text-left group hover:border-accent/40 hover:shadow-lg transition-all duration-300"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                🔑
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-2">Hostel Warden Portal</h3>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Secure access control panel for room allocation, student check-in/out records, and live hostel statistics.
              </p>
            </div>
            <div className="text-accent text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
              Access Portal <span>→</span>
            </div>
          </div>

          {/* Card 2: Academic Applications Desk */}
          <div 
            onClick={() => setCurrentView('file-tracking-student')}
            className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/60 shadow-md shadow-slate-100 flex flex-col justify-between text-left group hover:border-accent/40 hover:shadow-lg transition-all duration-300"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                📄
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-2">Academic Applications</h3>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Submit academic applications, request fee concessions or certificates, and track live review timelines.
              </p>
            </div>
            <div className="text-accent text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
              Open Applications Center <span>→</span>
            </div>
          </div>
        </div>

        {/* Global Access Button */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentView('auth')}
            className="bg-primary hover:bg-secondary text-white font-semibold py-3 px-8 rounded-xl shadow-md hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
          >
            Go to Dedicated Login Portal
          </button>
        </div>

        {/* Security Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/5 border border-primary/10 text-primary px-4 py-2 rounded-full text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          🔒 Secured under OUTR Unified Encryption Protocol • Bhubaneswar
        </div>
      </div>
    </Layout>
  )
}

export default App
