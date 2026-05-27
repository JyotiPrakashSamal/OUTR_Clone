import { useState, useEffect } from 'react'

export default function Navbar({ onNavigate, transparentOnTop }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  // Listen to window scroll to trigger original transparency transition
  useEffect(() => {
    if (!transparentOnTop) {
      setScrolled(true)
      return
    }

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    // Run once on mount
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [transparentOnTop])

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

  // Determine dynamic classes based on scroll state
  const isSolid = !transparentOnTop || scrolled
  const headerBg = isSolid 
    ? 'bg-white shadow-[0_2px_24px_rgba(11,60,93,0.13)] border-b border-slate-200/60' 
    : 'bg-transparent border-transparent'
  const textColor = isSolid ? 'text-[#0b3c5d]' : 'text-white'
  const logoSubColor = isSolid ? 'text-slate-500' : 'text-white/65'
  const logoBorderColor = isSolid ? 'border-[#d4af37]/30' : 'border-white/20'

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[900] w-full font-sans transition-all duration-350 select-none ${headerBg}`}
    >
      
      {/* Original Dark Top Bar */}
      <div className="bg-[#0b3c5d] text-[11px] text-blue-200 py-2 px-6 flex justify-between items-center border-b border-white/10">
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
      <div className="w-full bg-[#ef4444] text-white text-[11.5px] font-semibold overflow-hidden flex items-center h-[30px] border-b border-rose-500/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 w-full flex items-center">
          <span className="flex-shrink-0 bg-black/20 px-2 py-0.5 rounded text-[9px] font-black tracking-wider mr-4 uppercase animate-pulse">
            Alert
          </span>
          <div className="relative w-full overflow-hidden whitespace-nowrap">
            <div className="inline-block pl-[100%] animate-marquee hover:[animation-play-state:paused] cursor-pointer text-xs tracking-wide">
              🔥 Secure React unified Academic Portal is active &bull; Warden Check-in controls and dynamic approvals tracking are online &bull; Supabase authentication integrated.
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <nav className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">
        
        {/* Brand Logo & Identity */}
        <button 
          onClick={() => handleNavigation('home')}
          className="flex items-center gap-3.5 group text-left focus:outline-none cursor-pointer"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${logoBorderColor} ${isSolid ? 'bg-[#0b3c5d]/5' : 'bg-white/10'}`}>
            <img 
              src="https://outr.ac.in/public/uploads/logo_4.png" 
              alt="OUTR Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className={`font-serif font-bold text-base md:text-lg tracking-wide leading-none transition-colors group-hover:text-accent ${textColor}`}>
              OUTR
            </span>
            <span className={`text-[9px] font-bold tracking-widest uppercase mt-1 transition-colors ${logoSubColor}`}>
              Techno Campus Portal
            </span>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-8">
          <button 
            onClick={() => handleNavigation('home')}
            className={`text-sm font-bold cursor-pointer transition-colors focus:outline-none hover:text-accent ${textColor}`}
          >
            Home
          </button>

          {/* About Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('about')}
              className={`text-sm font-bold flex items-center gap-1.5 focus:outline-none cursor-pointer transition-colors hover:text-accent ${textColor}`}
            >
              About <span className="text-[9px]">▼</span>
            </button>
            {activeDropdown === 'about' && (
              <div className="absolute top-full left-50 -translate-x-50 mt-3 w-72 rounded-2xl bg-white border-t-[3px] border-t-[#d4af37] border-x border-b border-slate-200/80 shadow-[0_24px_64px_rgba(11,60,93,0.18)] p-3.5 space-y-1.5 animate-fade-in text-left">
                <a href="#about" onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-[#0b3c5d]/5 hover:border-[#0b3c5d]/20 transition-all text-xs font-bold text-[#0b3c5d] group">
                  <span className="text-lg">🏢</span>
                  <div>
                    <div className="group-hover:text-[#1f5a8a] transition-colors">About OUTR</div>
                    <div className="text-[10px] text-slate-400 font-medium">History &amp; overview</div>
                  </div>
                </a>
                <a href="#vision" onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-[#0b3c5d]/5 hover:border-[#0b3c5d]/20 transition-all text-xs font-bold text-[#0b3c5d] group">
                  <span className="text-lg">🎯</span>
                  <div>
                    <div className="group-hover:text-[#1f5a8a] transition-colors">Vision &amp; Mission</div>
                    <div className="text-[10px] text-slate-400 font-medium">Core values &amp; goals</div>
                  </div>
                </a>
                <a href="#accreditation" onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-[#0b3c5d]/5 hover:border-[#0b3c5d]/20 transition-all text-xs font-bold text-[#0b3c5d] group">
                  <span className="text-lg">📜</span>
                  <div>
                    <div className="group-hover:text-[#1f5a8a] transition-colors">Accreditation</div>
                    <div className="text-[10px] text-slate-400 font-medium">NAAC, NBA, UGC recognition</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Academics Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('academics')}
              className={`text-sm font-bold flex items-center gap-1.5 focus:outline-none cursor-pointer transition-colors hover:text-accent ${textColor}`}
            >
              Academics <span className="text-[9px]">▼</span>
            </button>
            {activeDropdown === 'academics' && (
              <div className="absolute top-full left-50 -translate-x-50 mt-3 w-72 rounded-2xl bg-white border-t-[3px] border-t-[#d4af37] border-x border-b border-slate-200/80 shadow-[0_24px_64px_rgba(11,60,93,0.18)] p-3.5 space-y-1.5 animate-fade-in text-left">
                <a href="#schools" onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-[#0b3c5d]/5 hover:border-[#0b3c5d]/20 transition-all text-xs font-bold text-[#0b3c5d] group">
                  <span className="text-lg">💻</span>
                  <div>
                    <div className="group-hover:text-[#1f5a8a] transition-colors">Schools &amp; Departments</div>
                    <div className="text-[10px] text-slate-400 font-medium">Undergraduate &amp; Postgrad</div>
                  </div>
                </a>
                <a href="#courses" onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-[#0b3c5d]/5 hover:border-[#0b3c5d]/20 transition-all text-xs font-bold text-[#0b3c5d] group">
                  <span className="text-lg">📋</span>
                  <div>
                    <div className="group-hover:text-[#1f5a8a] transition-colors">Course Syllabus</div>
                    <div className="text-[10px] text-slate-400 font-medium">Download academic syllabus</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Student Hub Dropdown */}
          <div className="relative">
            <button 
              onClick={() => toggleDropdown('student')}
              className={`text-sm font-bold flex items-center gap-1.5 focus:outline-none cursor-pointer transition-colors hover:text-accent ${textColor}`}
            >
              Student Hub <span className="text-[9px]">▼</span>
            </button>
            {activeDropdown === 'student' && (
              <div className="absolute top-full left-50 -translate-x-50 mt-3 w-72 rounded-2xl bg-white border-t-[3px] border-t-[#d4af37] border-x border-b border-slate-200/80 shadow-[0_24px_64px_rgba(11,60,93,0.18)] p-3.5 space-y-1.5 animate-fade-in text-left">
                <a href="#hostels" onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-[#0b3c5d]/5 hover:border-[#0b3c5d]/20 transition-all text-xs font-bold text-[#0b3c5d] group">
                  <span className="text-lg">🏢</span>
                  <div>
                    <div className="group-hover:text-[#1f5a8a] transition-colors">Hostels Accommodation</div>
                    <div className="text-[10px] text-slate-400 font-medium">Room allocation desk</div>
                  </div>
                </a>
                <a href="#social" onClick={() => setActiveDropdown(null)} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-[#0b3c5d]/5 hover:border-[#0b3c5d]/20 transition-all text-xs font-bold text-[#0b3c5d] group">
                  <span className="text-lg">📣</span>
                  <div>
                    <div className="group-hover:text-[#1f5a8a] transition-colors">Social Media Hub</div>
                    <div className="text-[10px] text-slate-400 font-medium">Campus announcements</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Direct File Tracking Link */}
          <button 
            onClick={() => handleNavigation('file-tracking-student')}
            className={`text-sm font-bold cursor-pointer transition-colors focus:outline-none hover:text-accent ${textColor}`}
          >
            Applications
          </button>
        </div>

        {/* Action Access Desks Button */}
        <div className="hidden lg:flex items-center">
          <button 
            onClick={() => handleNavigation('auth')}
            className={`font-bold text-xs py-2.5 px-6 rounded-full shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 border ${
              isSolid 
                ? 'bg-[#0b3c5d] hover:bg-secondary text-white border-transparent' 
                : 'bg-white/10 hover:bg-white text-white hover:text-[#0b3c5d] border-white/30'
            }`}
          >
            Access Desks
          </button>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`lg:hidden focus:outline-none cursor-pointer transition-colors ${textColor}`}
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
        <div className="lg:hidden bg-white border-t border-slate-100 py-4 px-6 space-y-4 shadow-inner text-left animate-fade-in text-[#0b3c5d]">
          <button 
            onClick={() => handleNavigation('home')}
            className="block text-sm font-bold text-left w-full"
          >
            Home
          </button>
          
          <div className="border-t border-slate-50 pt-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">About</span>
            <div className="pl-4 space-y-2.5">
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold">About OUTR</a>
              <a href="#vision" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold">Vision &amp; Mission</a>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Academics</span>
            <div className="pl-4 space-y-2.5">
              <a href="#schools" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold">Schools &amp; Departments</a>
              <a href="#courses" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold">Syllabus</a>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Student Hub</span>
            <div className="pl-4 space-y-2.5">
              <a href="#hostels" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold">Hostels</a>
              <a href="#social" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-bold">Social Media Hub</a>
            </div>
          </div>

          <button 
            onClick={() => handleNavigation('file-tracking-student')}
            className="block text-sm font-bold text-left w-full border-t border-slate-50 pt-2"
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
