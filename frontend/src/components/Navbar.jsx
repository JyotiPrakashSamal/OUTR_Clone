import { useState } from 'react'

export default function Navbar({ onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const toggleDropdown = (name) => {
    if (activeDropdown === name) {
      setActiveDropdown(null)
    } else {
      setActiveDropdown(name)
    }
  }

  const handleNavigation = (view) => {
    if (onNavigate) {
      onNavigate(view)
    }
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/60 select-none shadow-sm transition-all duration-300">
      
      {/* Original Dark Top Bar */}
      <div className="bg-[#0b3c5d] text-[11px] text-blue-200 py-2 px-6 flex justify-between items-center border-b border-white/10 font-sans">
        <div className="flex gap-4">
          <span>📞 0674-2725223</span>
          <span className="hidden md:inline">✉️ registrar@outr.ac.in</span>
        </div>
        <div className="flex gap-5">
          <a href="https://outr.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Tenders / RFQ</a>
          <a href="http://placement.cet.edu.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Placement</a>
          <a href="https://www.cet.edu.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors hidden sm:inline">Old Website</a>
        </div>
      </div>

      {/* Original Red Alert Ticker Marquee Bar */}
      <div className="w-full bg-[#ef4444] text-white text-[11.5px] font-semibold overflow-hidden flex items-center h-[30px] shadow-sm select-none border-b border-rose-500/20">
        <div className="max-w-7xl mx-auto px-5 w-full flex items-center">
          <span className="flex-shrink-0 bg-black/20 px-2 py-0.5 rounded text-[9px] font-black tracking-wider mr-4 uppercase animate-pulse">
            Alert
          </span>
          <div className="relative w-full overflow-hidden whitespace-nowrap">
            <div className="inline-block pl-[100%] animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] cursor-pointer text-xs tracking-wide">
              🔥 Secure React unified Academic Portal is active &bull; Warden Check-in controls and dynamic approvals tracking are online &bull; Supabase authentication integrated.
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Identity */}
        <button 
          onClick={() => handleNavigation('home')}
          className="flex items-center gap-3.5 group text-left focus:outline-none cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center border border-accent/20 group-hover:border-accent/40 transition-colors">
            <img 
              src="https://outr.ac.in/public/uploads/logo_4.png" 
              alt="OUTR Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-[#0b3c5d] text-base md:text-lg tracking-wide leading-none group-hover:text-secondary transition-colors">
              OUTR
            </span>
            <span className="text-[9px] text-muted font-bold tracking-widest uppercase mt-1">
              Techno Campus Portal
            </span>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-8">
          <button 
            onClick={() => handleNavigation('home')}
            className="text-sm font-bold text-primary hover:text-accent cursor-pointer transition-colors focus:outline-none"
          >
            Home
          </button>

          {/* About Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('about')}
              className="text-sm font-bold text-primary hover:text-accent flex items-center gap-1.5 focus:outline-none cursor-pointer transition-colors"
            >
              About <span className="text-[9px]">▼</span>
            </button>
            {activeDropdown === 'about' && (
              <div className="absolute top-full left-0 mt-3 w-56 rounded-2xl bg-white border border-slate-200/80 shadow-xl p-2.5 space-y-1 animate-fade-in text-left">
                <a href="#about" onClick={() => setActiveDropdown(null)} className="block p-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-primary">
                  🏢 About OUTR
                </a>
                <a href="#vision" onClick={() => setActiveDropdown(null)} className="block p-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-primary">
                  🎯 Vision & Mission
                </a>
                <a href="#accreditation" onClick={() => setActiveDropdown(null)} className="block p-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-primary">
                  📜 Accreditation
                </a>
              </div>
            )}
          </div>

          {/* Academics Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('academics')}
              className="text-sm font-bold text-primary hover:text-accent flex items-center gap-1.5 focus:outline-none cursor-pointer transition-colors"
            >
              Academics <span className="text-[9px]">▼</span>
            </button>
            {activeDropdown === 'academics' && (
              <div className="absolute top-full left-0 mt-3 w-56 rounded-2xl bg-white border border-slate-200/80 shadow-xl p-2.5 space-y-1 animate-fade-in text-left">
                <a href="#schools" onClick={() => setActiveDropdown(null)} className="block p-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-primary">
                  💻 Schools & Departments
                </a>
                <a href="#courses" onClick={() => setActiveDropdown(null)} className="block p-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-primary">
                  📋 Course syllabus
                </a>
              </div>
            )}
          </div>

          {/* Student Hub Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('student')}
              className="text-sm font-bold text-primary hover:text-accent flex items-center gap-1.5 focus:outline-none cursor-pointer transition-colors"
            >
              Student Hub <span className="text-[9px]">▼</span>
            </button>
            {activeDropdown === 'student' && (
              <div className="absolute top-full left-0 mt-3 w-56 rounded-2xl bg-white border border-slate-200/80 shadow-xl p-2.5 space-y-1 animate-fade-in text-left">
                <a href="#hostels" onClick={() => setActiveDropdown(null)} className="block p-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-primary">
                  🏢 Hostels Accommodation
                </a>
                <a href="#social" onClick={() => setActiveDropdown(null)} className="block p-3 rounded-xl hover:bg-slate-50 text-xs font-bold text-primary">
                  📣 Social Media Hub
                </a>
              </div>
            )}
          </div>

          {/* Direct File Tracking Link */}
          <button 
            onClick={() => handleNavigation('file-tracking-student')}
            className="text-sm font-bold text-primary hover:text-accent cursor-pointer transition-colors focus:outline-none"
          >
            Applications
          </button>
        </div>

        {/* Action Access Desks Button */}
        <div className="hidden lg:flex items-center">
          <button 
            onClick={() => handleNavigation('auth')}
            className="bg-[#0b3c5d] hover:bg-secondary text-white font-bold text-xs py-2.5 px-6 rounded-full shadow-sm hover:shadow-md cursor-pointer transition-all duration-300"
          >
            Access Desks
          </button>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-primary hover:text-secondary focus:outline-none cursor-pointer"
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
        <div className="lg:hidden bg-white border-t border-slate-100 py-4 px-6 space-y-4 shadow-inner text-left animate-fade-in">
          <button 
            onClick={() => handleNavigation('home')}
            className="block text-sm font-bold text-primary text-left w-full"
          >
            Home
          </button>
          
          <div className="border-t border-slate-50 pt-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">About</span>
            <div className="pl-4 space-y-2.5">
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-primary">About OUTR</a>
              <a href="#vision" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-primary">Vision & Mission</a>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Academics</span>
            <div className="pl-4 space-y-2.5">
              <a href="#schools" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-primary">Schools & Departments</a>
              <a href="#courses" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-primary">Syllabus</a>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Student Hub</span>
            <div className="pl-4 space-y-2.5">
              <a href="#hostels" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-primary">Hostels</a>
              <a href="#social" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold text-primary">Social Media Hub</a>
            </div>
          </div>

          <button 
            onClick={() => handleNavigation('file-tracking-student')}
            className="block text-sm font-bold text-primary text-left w-full border-t border-slate-50 pt-2"
          >
            Academic Applications
          </button>

          <button 
            onClick={() => handleNavigation('auth')}
            className="w-full text-center block bg-primary hover:bg-[#1f5a8a] text-white font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Access Desks
          </button>
        </div>
      )}
    </header>
  )
}
