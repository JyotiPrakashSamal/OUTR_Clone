import { useState } from 'react'
import Layout from './components/Layout'

function App() {
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
          Welcome to the new component-driven secure React portal. Our Phase 1 environment is fully scaffolded and running on Tailwind CSS v4.
        </p>

        {/* Quick Access Portal Modules Grid */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto mb-12">
          {/* Card 1: Warden Portal */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-md shadow-slate-100 flex flex-col justify-between text-left group hover:border-accent/40 transition-all duration-300">
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
              Phase 3 Migration <span>→</span>
            </div>
          </div>

          {/* Card 2: Faculty Adviser Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-md shadow-slate-100 flex flex-col justify-between text-left group hover:border-accent/40 transition-all duration-300">
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
              Phase 4 Migration <span>→</span>
            </div>
          </div>
        </div>

        {/* Phase Checklist Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Phase 1 Layout Shell Setup: Navbar, Footer, and Shell active on Tailwind CSS v4
        </div>
      </div>
    </Layout>
  )
}

export default App
