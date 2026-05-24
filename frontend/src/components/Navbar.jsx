import { useState } from 'react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const toggleDropdown = (name) => {
    if (activeDropdown === name) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(name)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 select-none">
      {/* Top Bar Accent */}
      <div className="bg-primary text-[11px] text-white/80 py-1.5 px-6 flex justify-between items-center">
        <div>Odisha University of Technology and Research (OUTR) — Techno Campus, Ghatikia</div>
        <div className="hidden md:flex gap-4">
          <span>📞 0674-2725223</span>
          <span>✉️ registrar@outr.ac.in</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Identity / Logo */}
        <a href="/" className="flex items-center gap-3.5 group">
          <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center border border-accent/20 group-hover:border-accent/40 transition-colors">
            <img 
              src="https://outr.ac.in/public/uploads/logo_4.png" 
              alt="OUTR Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-primary text-base md:text-lg tracking-wide leading-none group-hover:text-secondary transition-colors">
              OUTR
            </span>
            <span className="text-[10px] text-muted font-semibold tracking-wider uppercase mt-1">
              Techno Campus Portal
            </span>
          </div>
        </a>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="/" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
            Home
          </a>

          {/* Academics Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('academics')}
              className="text-sm font-semibold text-primary hover:text-accent flex items-center gap-1.5 focus:outline-none transition-colors"
            >
              Academics <span className="text-[10px]">▼</span>
            </button>
            {activeDropdown === 'academics' && (
              <div className="absolute top-full left-0 mt-3 w-56 rounded-2xl bg-white border border-slate-200/80 shadow-xl shadow-slate-100 p-2.5 space-y-1 animate-fade-in">
                <a href="#schools" className="block p-3 rounded-xl hover:bg-slate-50 text-xs font-semibold text-primary">
                  Schools & Departments
                </a>
                <a href="#courses" className="block p-3 rounded-xl hover:bg-slate-50 text-xs font-semibold text-primary">
                  Academic Programs
                </a>
              </div>
            )}
          </div>

          {/* Student Hub Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('student')}
              className="text-sm font-semibold text-primary hover:text-accent flex items-center gap-1.5 focus:outline-none transition-colors"
            >
              Student Hub <span className="text-[10px]">▼</span>
            </button>
            {activeDropdown === 'student' && (
              <div className="absolute top-full left-0 mt-3 w-56 rounded-2xl bg-white border border-slate-200/80 shadow-xl shadow-slate-100 p-2.5 space-y-1 animate-fade-in">
                <a href="#societies" className="block p-3 rounded-xl hover:bg-slate-50 text-xs font-semibold text-primary">
                  Societies & Clubs
                </a>
                <a href="#hostels" className="block p-3 rounded-xl hover:bg-slate-50 text-xs font-semibold text-primary">
                  Hostels (Accommodation)
                </a>
                <a href="#campus" className="block p-3 rounded-xl hover:bg-slate-50 text-xs font-semibold text-primary">
                  Campus Facilities
                </a>
              </div>
            )}
          </div>

          <a href="#social" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
            Social Hub
          </a>
        </div>

        {/* Action Button */}
        <div className="hidden lg:flex items-center">
          <a 
            href="#auth"
            className="bg-primary hover:bg-secondary text-white font-semibold text-xs py-2.5 px-5 rounded-full shadow-sm hover:shadow-md hover:shadow-primary/10 transition-all duration-300"
          >
            Access Desks
          </a>
        </div>

        {/* Hamburger Menu Icon (Mobile) */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-primary hover:text-secondary focus:outline-none"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 py-4 px-6 space-y-4 shadow-inner animate-fade-in">
          <a href="/" className="block text-sm font-semibold text-primary">Home</a>
          
          <div className="border-t border-slate-50 pt-2">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Academics</span>
            <div className="pl-4 space-y-2.5">
              <a href="#schools" className="block text-sm font-semibold text-primary">Schools & Departments</a>
              <a href="#courses" className="block text-sm font-semibold text-primary">Academic Programs</a>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-2">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Student Hub</span>
            <div className="pl-4 space-y-2.5">
              <a href="#societies" className="block text-sm font-semibold text-primary">Societies & Clubs</a>
              <a href="#hostels" className="block text-sm font-semibold text-primary">Hostels</a>
              <a href="#campus" className="block text-sm font-semibold text-primary">Campus Life</a>
            </div>
          </div>

          <a href="#social" className="block text-sm font-semibold text-primary">Social Hub</a>
          <a 
            href="#auth"
            className="w-full text-center block bg-primary hover:bg-secondary text-white font-semibold py-2.5 rounded-xl text-xs transition-colors"
          >
            Access Desks
          </a>
        </div>
      )}
    </header>
  )
}
