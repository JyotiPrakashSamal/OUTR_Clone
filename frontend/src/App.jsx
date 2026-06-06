import { useState, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Layout from './components/Layout'
import AuthPortal from './pages/AuthPortal'
import WardenDashboard from './pages/WardenDashboard'
import FileTrackingDashboard from './pages/FileTrackingDashboard'
import AdminDashboard from './pages/AdminDashboard'
import { BoardOfGovernors, AntiRaggingCommittee, VCDesk, COEDesk, AboutPage, VisionMissionPage, LocationPage, ARCommittee, LegalCommittee } from './pages/InstitutionalPages'
import DeanDesk from './pages/DeanDesk'
import HODDesk from './pages/HODDesk'
import SyllabusDesk from './pages/SyllabusDesk'
import ComingSoonPage from './pages/ComingSoonPage'
import ClubsSocieties from './pages/ClubsSocieties'
import ErrorBoundary from './components/ErrorBoundary'


function HomeRedirect() {
  useEffect(() => {
    window.location.replace('/home.html')
  }, [])
  return null
}

function ProtectedRoute({ children, allowedRoles, loading, sessionUser }) {
  if (loading) return null
  if (!sessionUser) return <Navigate to="/portal" replace />
  if (allowedRoles && !allowedRoles.includes(sessionUser.role)) {
    return <Navigate to="/portal" replace />
  }
  return children
}

// 404 Fallback Page
function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center font-sans p-6 select-none">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-10 text-center flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle Brand gold border accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0b3c5d] via-[#d4af37] to-[#1f5a8a]"></div>
        
        {/* 404 Graphic */}
        <h1 className="font-serif font-black text-8xl text-[#0b3c5d] tracking-widest mb-2">404</h1>
        <div className="w-12 h-1 bg-[#d4af37] mb-6 rounded-full"></div>
        
        <h2 className="font-serif text-xl font-bold text-[#1e293b] mb-3">Page Not Found</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <button
          onClick={() => navigate('/portal')}
          className="bg-[#0b3c5d] hover:bg-[#1f5a8a] text-white font-bold text-xs py-3 px-6 rounded-full shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
        >
          ↩ Back to Unified Portal
        </button>
      </div>
    </div>
  )
}

function AppContent() {
  const [loading, setLoading] = useState(true)
  const [sessionUser, setSessionUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const loadingRef = useRef(loading)

  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  const redirectBasedOnRole = (role) => {
    if (role === 'admin') navigate('/admin-dashboard', { replace: true })
    else if (role === 'student') navigate('/student-clearance', { replace: true })
    else if (role === 'warden') navigate('/warden-dashboard', { replace: true })
    else if (role === 'adviser') navigate('/adviser-dashboard', { replace: true })
    else if (role === 'hos') navigate('/hos-dashboard', { replace: true })
    else if (role === 'controller') navigate('/controller-dashboard', { replace: true })
    else if (role === 'dean_pga') navigate('/dean-pga-dashboard', { replace: true })
    else if (role === 'dean_academic') navigate('/dean-academic-dashboard', { replace: true })
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
      
      // Auto redirect to dashboard if currently on the portal/auth page
      if (location.pathname === '/portal' || location.pathname === '/auth' || location.pathname === '/') {
        redirectBasedOnRole(profile.role)
      }
    } catch (err) {
      console.warn('Session profile lookup failed:', err.message)
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
        if (location.pathname === '/portal' || location.pathname === '/auth' || location.pathname === '/') {
          redirectBasedOnRole(metaRole)
        }
      }
    }
  }

  // Handle Legacy Query Parameter redirects for backward compatibility
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const viewParam = params.get('view')
    if (viewParam) {
      if (viewParam === 'bom') navigate('/bom', { replace: true })
      else if (viewParam === 'antiragging') navigate('/antiragging', { replace: true })
      else if (viewParam === 'vc-desk') navigate('/vc-desk', { replace: true })
      else if (viewParam === 'coe-desk') navigate('/coe-desk', { replace: true })
      else if (viewParam === 'deans') navigate('/deans', { replace: true })
      else if (viewParam === 'hods') navigate('/hods', { replace: true })
      else if (viewParam === 'syllabus') navigate('/syllabus', { replace: true })
      else if (viewParam === 'about') navigate('/about', { replace: true })
      else if (viewParam === 'mission') navigate('/vision-mission', { replace: true })
      else if (viewParam === 'location') navigate('/location', { replace: true })
      else if (viewParam === 'academic-council') navigate('/academic-council', { replace: true })
      else if (viewParam === 'students-grievance') navigate('/students-grievance', { replace: true })
      else if (viewParam === 'student-clearance') navigate('/student-clearance', { replace: true })
      else if (viewParam === 'clubs' || viewParam === 'societies') navigate('/clubs-societies', { replace: true })
      else if (viewParam === 'warden') navigate('/portal?role=warden', { replace: true })

      else if (viewParam === 'portal') navigate('/portal', { replace: true })
      else if (viewParam === 'auth') {
        const role = params.get('role')
        navigate(role ? `/portal?role=${role}` : '/portal', { replace: true })
      }
      else if (viewParam === 'home') window.location.href = '/home.html'
    }
  }, [location.search, navigate])

  // Session Listener on Mount
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
          await checkSessionRole(session.user.id)
        }
        setLoading(false)
      } else {
        // Reset local session state if logged out
        setSessionUser((currUser) => {
          if (currUser && currUser.isLocal) {
            return currUser
          }
          return null
        })

        const isDashboard = location.pathname.endsWith('-dashboard') || location.pathname === '/student-clearance'
        if (isDashboard) {
          navigate('/portal', { replace: true })
        }
        setLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate])

  const handleLoginSuccess = (role, user) => {
    setSessionUser(user)
    redirectBasedOnRole(role)
  }

  const handleSignOut = async () => {
    setSessionUser(null)
    await supabase.auth.signOut()
    navigate('/portal', { replace: true })
  }

  const handleDashboardNavigation = (view) => {
    if (view === 'home') {
      window.location.href = '/home.html'
    } else if (view === 'auth' || view === 'portal') {
      navigate('/portal')
    } else {
      navigate(`/${view}`)
    }
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

  const initialRoleParam = new URLSearchParams(location.search).get('role')

  return (
    <Routes>
      {/* Public Pages wrapped in Layout */}
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/coming-soon" element={<Layout><ComingSoonPage /></Layout>} />
      <Route path="/bom" element={<Layout><BoardOfGovernors /></Layout>} />
      <Route path="/antiragging" element={<Layout><AntiRaggingCommittee /></Layout>} />
      <Route path="/vc-desk" element={<Layout><VCDesk /></Layout>} />
      <Route path="/coe-desk" element={<Layout><COEDesk onNavigate={handleDashboardNavigation} /></Layout>} />
      <Route path="/deans" element={<Layout><DeanDesk /></Layout>} />
      <Route path="/hods" element={<Layout><HODDesk /></Layout>} />
      <Route path="/syllabus" element={<Layout><SyllabusDesk /></Layout>} />
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/vision-mission" element={<Layout><VisionMissionPage /></Layout>} />
      <Route path="/location" element={<Layout><LocationPage /></Layout>} />
      <Route path="/academic-council" element={<Layout><ARCommittee /></Layout>} />
      <Route path="/students-grievance" element={<Layout><LegalCommittee /></Layout>} />
      <Route path="/clubs-societies" element={<Layout><ClubsSocieties /></Layout>} />

      
      {/* Unified Login Portal */}
      <Route path="/portal" element={
        sessionUser ? (
          <Navigate to={
            sessionUser.role === 'admin' ? '/admin-dashboard' :
            sessionUser.role === 'student' ? '/student-clearance' :
            sessionUser.role === 'warden' ? '/warden-dashboard' :
            sessionUser.role === 'adviser' ? '/adviser-dashboard' :
            sessionUser.role === 'hos' ? '/hos-dashboard' :
            sessionUser.role === 'controller' ? '/controller-dashboard' :
            sessionUser.role === 'dean_pga' ? '/dean-pga-dashboard' :
            sessionUser.role === 'dean_academic' ? '/dean-academic-dashboard' : '/portal'
          } replace />
        ) : (
          <div className="relative">
            <AuthPortal 
              initialRole={initialRoleParam} 
              onLoginSuccess={handleLoginSuccess}
            />
            <button
              onClick={() => { window.location.href = '/home.html' }}
              className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold py-2.5 px-4 rounded-full shadow-lg border border-slate-700/50 hover:scale-105 transition-all duration-300"
            >
              ↩ Return to University Homepage
            </button>
          </div>
        )
      } />

      {/* Role-Based Protected Dashboards */}
      <Route path="/admin-dashboard" element={
        <ProtectedRoute allowedRoles={['admin']} loading={loading} sessionUser={sessionUser}>
          <ErrorBoundary>
            <AdminDashboard 
              sessionUser={sessionUser}
              onSignOut={handleSignOut}
              onNavigate={handleDashboardNavigation}
            />
          </ErrorBoundary>
        </ProtectedRoute>
      } />

      <Route path="/warden-dashboard" element={
        <ProtectedRoute allowedRoles={['warden']} loading={loading} sessionUser={sessionUser}>
          <ErrorBoundary>
            <WardenDashboard 
              sessionUser={sessionUser}
              onSignOut={handleSignOut}
              onNavigate={handleDashboardNavigation}
            />
          </ErrorBoundary>
        </ProtectedRoute>
      } />

      <Route path="/student-clearance" element={
        <ProtectedRoute allowedRoles={['student']} loading={loading} sessionUser={sessionUser}>
          <ErrorBoundary>
            <FileTrackingDashboard 
              role="student"
              sessionUser={sessionUser}
              onSignOut={handleSignOut}
              onNavigate={handleDashboardNavigation}
            />
          </ErrorBoundary>
        </ProtectedRoute>
      } />

      <Route path="/adviser-dashboard" element={
        <ProtectedRoute allowedRoles={['adviser']} loading={loading} sessionUser={sessionUser}>
          <ErrorBoundary>
            <FileTrackingDashboard 
              role="adviser"
              sessionUser={sessionUser}
              onSignOut={handleSignOut}
              onNavigate={handleDashboardNavigation}
            />
          </ErrorBoundary>
        </ProtectedRoute>
      } />

      <Route path="/hos-dashboard" element={
        <ProtectedRoute allowedRoles={['hos']} loading={loading} sessionUser={sessionUser}>
          <ErrorBoundary>
            <FileTrackingDashboard 
              role="hos"
              sessionUser={sessionUser}
              onSignOut={handleSignOut}
              onNavigate={handleDashboardNavigation}
            />
          </ErrorBoundary>
        </ProtectedRoute>
      } />

      <Route path="/dean-academic-dashboard" element={
        <ProtectedRoute allowedRoles={['dean_academic']} loading={loading} sessionUser={sessionUser}>
          <ErrorBoundary>
            <FileTrackingDashboard 
              role="dean_academic"
              sessionUser={sessionUser}
              onSignOut={handleSignOut}
              onNavigate={handleDashboardNavigation}
            />
          </ErrorBoundary>
        </ProtectedRoute>
      } />

      <Route path="/dean-pga-dashboard" element={
        <ProtectedRoute allowedRoles={['dean_pga']} loading={loading} sessionUser={sessionUser}>
          <ErrorBoundary>
            <FileTrackingDashboard 
              role="dean_pga"
              sessionUser={sessionUser}
              onSignOut={handleSignOut}
              onNavigate={handleDashboardNavigation}
            />
          </ErrorBoundary>
        </ProtectedRoute>
      } />

      <Route path="/controller-dashboard" element={
        <ProtectedRoute allowedRoles={['controller']} loading={loading} sessionUser={sessionUser}>
          <ErrorBoundary>
            <FileTrackingDashboard 
              role="controller"
              sessionUser={sessionUser}
              onSignOut={handleSignOut}
              onNavigate={handleDashboardNavigation}
            />
          </ErrorBoundary>
        </ProtectedRoute>
      } />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
