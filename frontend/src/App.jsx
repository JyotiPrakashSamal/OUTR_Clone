import { useState } from 'react'
import Layout from './components/Layout'
import AuthPortal from './pages/AuthPortal'

function App() {
  const [currentView, setCurrentView] = useState('home') // 'home' or 'auth'
  const [selectedRoleForPortal, setSelectedRoleForPortal] = useState(null)

  const openPortalForRole = (role) => {
    setSelectedRoleForPortal(role)
    setCurrentView('auth')
  }

  if (currentView === 'auth') {
    return (
      <div className="relative">
        <AuthPortal />
        {/* Universal Back to Home overlay helper for testing convenience */}
        <button
          onClick={() => setCurrentView('home')}
          className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold py-2.5 px-4 rounded-full shadow-lg border border-slate-700/50 hover:scale-105 transition-all duration-300"
        >
          🏠 Return to Landing Desk
        </button>
      </div>
    )
  }

  return (
    <Layout>
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
          Welcome to the new component-driven secure React portal. Our setup branch is fully scaffolded and running on Tailwind CSS v4.
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

          {/* Card 2: Faculty Adviser Panel */}
          <div 
            onClick={() => openPortalForRole('adviser')}
            className="cursor-pointer bg-white p-6 rounded-2xl border border-slate-200/60 shadow-md shadow-slate-100 flex flex-col justify-between text-left group hover:border-accent/40 hover:shadow-lg transition-all duration-300"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                📄
              </div>
              <h3 className="font-serif text-xl font-bold text-primary mb-2">Faculty Adviser Panel</h3>
              <p className="text-muted text-sm leading-relaxed mb-4">
                Multi-level academic file tracking pipeline for student document approval and secure storage integration.
              </p>
            </div>
            <div className="text-accent text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
              Access Portal <span>→</span>
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

        {/* Phase Checklist Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Phase 2 Complete: Reusable Layout frames & Dedicated Supabase Auth Portal active
        </div>
      </div>
    </Layout>
  )
}

export default App
