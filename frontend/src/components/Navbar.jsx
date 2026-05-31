/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'

export default function Navbar({ onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Listen to window scroll to trigger top-bar display identically to static sub-pages
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigation = (view) => {
    if (onNavigate) {
      onNavigate(view)
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
      {/* TOP UTILITY BAR */}
      <div id="top-bar" className={scrolled ? 'hide' : ''}>
        <div className="max-w-7xl mx-auto px-5 w-full flex justify-between items-center select-none font-sans">
          <div className="flex gap-5">
            <a href="#" className="text-blue-200 hover:text-white transition-colors text-[11px] no-underline">Careers</a>
            <a href="#" className="text-blue-200 hover:text-white transition-colors text-[11px] no-underline">RTI</a>
            <a href="/administration/pic_officers.html" className="text-blue-200 hover:text-white transition-colors text-[11px] no-underline">PIC Officers</a>
            <a href="http://placement.cet.edu.in/" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors text-[11px] no-underline">Placement</a>
          </div>
          <div className="flex gap-5">
            <a href="https://www.cet.edu.in/" target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:text-white transition-colors text-[11px] no-underline">Old Website</a>
            <span className="text-blue-200 text-[11px]">✉️ registrar@outr.ac.in</span>
          </div>
        </div>
      </div>

      {/* MAIN NAVBAR */}
      <nav id="navbar" className="flex flex-col font-sans select-none scrolled" style={{ top: scrolled ? '0px' : '34px' }}>
        <div className="nav-bar-inner">
          <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
            {/* Brand Logo + Identity */}
            <button 
              onClick={() => handleNavigation('home')}
              className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer no-underline bg-transparent border-none p-0"
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center border border-[#d4af37]/30 bg-[#0b3c5d]/5 transition-colors">
                <img src="https://outr.ac.in/public/uploads/logo_4.png" alt="OUTR Logo" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-sm md:text-base tracking-wide leading-none text-[#0b3c5d] group-hover:text-[#d4af37] transition-colors logo-text" style={{ color: scrolled ? '#0b3c5d' : undefined }}>Odisha University of Technology and Research</span>
                <span className="text-[8.5px] font-bold tracking-widest uppercase mt-1 logo-sub" style={{ color: scrolled ? '#64748b' : undefined }}>Bhubaneswar, Odisha</span>
              </div>
            </button>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-8" id="nav-links">
              <button onClick={() => handleNavigation('home')} className="nav-link font-sans bg-transparent border-none p-0 cursor-pointer">Home</button>

              {/* About Dropdown */}
              <div className="nav-item relative">
                <button className="nav-link font-sans bg-transparent border-none p-0 cursor-pointer flex items-center gap-1 focus:outline-none">
                  About <span className="text-[7px]">▼</span>
                </button>
                <div className="dropdown">
                  <div className="flex flex-col gap-2">
                    <a href="/OUTR website/about.html" className="dd-card">
                      <div className="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-2"></use></svg></div>
                      <div>
                        <div className="dd-title">About OUTR</div>
                        <div className="dd-sub">History &amp; overview</div>
                      </div>
                    </a>
                    <a href="/OUTR website/mission&vission.html" className="dd-card">
                      <div className="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-3"></use></svg></div>
                      <div>
                        <div className="dd-title">Vision and Mission</div>
                        <div className="dd-sub">Core values &amp; goals</div>
                      </div>
                    </a>
                    <a href="/OUTR website/schools.html" className="dd-card">
                      <div className="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-4"></use></svg></div>
                      <div>
                        <div className="dd-title">Accreditation</div>
                        <div className="dd-sub">NAAC, NBA, UGC recognition</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Academic Dropdown */}
              <div className="nav-item relative">
                <button className="nav-link font-sans bg-transparent border-none p-0 cursor-pointer flex items-center gap-1 focus:outline-none">
                  Academic <span className="text-[7px]">▼</span>
                </button>
                <div className="dropdown wide">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10.5px] font-semibold text-[#94a3b8] tracking-widest uppercase mb-2.5 px-1">Schools &amp; Departments</p>
                      <div className="grid grid-cols-1 gap-1 max-h-[280px] overflow-y-auto pr-1">
                        <a href="/OUTR website/schools/scs.html" className="dd-card">
                          <div className="dd-icon bg-[#eff6ff]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-2"></use></svg></div>
                          <div className="dd-title text-[12px]">School of Computer Sciences</div>
                        </a>
                        <a href="/OUTR website/schools/sms.html" className="dd-card">
                          <div className="dd-icon bg-[#fff7ed]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-9"></use></svg></div>
                          <div className="dd-title text-[12px]">School of Mechanical Sciences</div>
                        </a>
                        <a href="/OUTR website/schools/sIp.html" className="dd-card">
                          <div className="dd-icon bg-[#f0fdf4]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-10"></use></svg></div>
                          <div className="dd-title text-[12px]">School of Infrastructure &amp; Planning</div>
                        </a>
                        <a href="/OUTR website/schools/sElectronics.html" className="dd-card">
                          <div className="dd-icon bg-[#fff1f2]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-11"></use></svg></div>
                          <div className="dd-title text-[12px]">School of Electronic Sciences</div>
                        </a>
                        <a href="/OUTR website/schools/sElectricals.html" className="dd-card">
                          <div className="dd-icon bg-[#fffbeb]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-12"></use></svg></div>
                          <div className="dd-title text-[12px]">School of Electrical Sciences</div>
                        </a>
                        <a href="/OUTR website/schools/sbsh.html" className="dd-card">
                          <div className="dd-icon bg-[#f5f3ff]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-13"></use></svg></div>
                          <div className="dd-title text-[12px]">School of Basic Sciences &amp; Humanities</div>
                        </a>
                        <a href="/OUTR website/schools/btd.html" className="dd-card">
                          <div className="dd-icon bg-[#ecfdf5]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-14"></use></svg></div>
                          <div className="dd-title text-[12px]">Biotechnology Department</div>
                        </a>
                        <a href="/OUTR website/schools/ted.html" className="dd-card">
                          <div className="dd-icon bg-[#fff0f6]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-15"></use></svg></div>
                          <div className="dd-title text-[12px]">Textile Engineering Department</div>
                        </a>
                      </div>
                    </div>
                    <div className="border-l border-slate-100 pl-4 text-left">
                      <p className="text-[10.5px] font-semibold text-[#94a3b8] tracking-widest uppercase mb-2.5 px-1">Other Academic Boards</p>
                      <div className="flex flex-col gap-2">
                        <a href="/administration/SA_commitee.html" className="dd-card">
                          <div className="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-6"></use></svg></div>
                          <div>
                            <div className="dd-title">Committees</div>
                            <div className="dd-sub">Academic boards &amp; groups</div>
                          </div>
                        </a>
                        <button onClick={() => handleNavigation('syllabus')} className="dd-card bg-transparent border-none text-left w-full font-sans cursor-pointer">
                          <div className="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-7"></use></svg></div>
                          <div>
                            <div className="dd-title">Syllabus</div>
                            <div className="dd-sub">UG and PG course syllabi</div>
                          </div>
                        </button>
                        <a href="#" className="dd-card">
                          <div className="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-2"></use></svg></div>
                          <div>
                            <div className="dd-title">Academic Calendar</div>
                            <div className="dd-sub">Schedule &amp; important dates</div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Administration Dropdown */}
              <div className="nav-item relative">
                <button className="nav-link font-sans bg-transparent border-none p-0 cursor-pointer flex items-center gap-1 focus:outline-none">
                  Administration <span className="text-[7px]">▼</span>
                </button>
                <div className="dropdown wide">
                  <p className="text-[10.5px] font-semibold text-[#94a3b8] tracking-widest uppercase mb-2.5 px-1">Administration &amp; Governance</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleNavigation('vc-desk')} className="dd-card bg-transparent border border-[#e8eef4] w-full text-left font-sans">
                      <div className="dd-icon bg-[#eff6ff]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-2"></use></svg></div>
                      <div className="dd-title text-[12.5px]">VC Desk</div>
                    </button>
                    <button onClick={() => handleNavigation('bom')} className="dd-card bg-transparent border border-[#e8eef4] w-full text-left font-sans">
                      <div className="dd-icon bg-[#fff7ed]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-13"></use></svg></div>
                      <div className="dd-title text-[12.5px]">Board of Management</div>
                    </button>
                    <button onClick={() => handleNavigation('deans')} className="dd-card bg-transparent border border-[#e8eef4] w-full text-left font-sans cursor-pointer">
                      <div className="dd-icon bg-[#f0fdf4]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-4"></use></svg></div>
                      <div className="dd-title text-[12.5px]">Dean</div>
                    </button>
                    <button onClick={() => handleNavigation('hods')} className="dd-card bg-transparent border border-[#e8eef4] w-full text-left font-sans cursor-pointer">
                      <div className="dd-icon bg-[#fff1f2]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-5"></use></svg></div>
                      <div className="dd-title text-[12.5px]">HODs</div>
                    </button>
                    <button onClick={() => handleNavigation('antiragging')} className="dd-card bg-transparent border border-[#e8eef4] w-full text-left font-sans">
                      <div className="dd-icon bg-[#fffbeb]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-6"></use></svg></div>
                      <div className="dd-title text-[12.5px]">Anti-Ragging</div>
                    </button>
                    <a href="/administration/AR_commitee.html" className="dd-card">
                      <div className="dd-icon bg-[#f5f3ff]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-7"></use></svg></div>
                      <div className="dd-title text-[12.5px]">Academic Council</div>
                    </a>
                    <a href="/administration/L_commitee.html" className="dd-card">
                      <div className="dd-icon bg-[#ecfdf5]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-16"></use></svg></div>
                      <div className="dd-title text-[12.5px]">Students Grievance</div>
                    </a>
                    <button onClick={() => handleNavigation('coe-desk')} className="dd-card bg-transparent border border-[#e8eef4] w-full text-left font-sans">
                      <div className="dd-icon bg-[#fff0f6]"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-17"></use></svg></div>
                      <div className="dd-title text-[12.5px]">Controller of Exam</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Student Dropdown */}
              <div className="nav-item relative">
                <button className="nav-link font-sans bg-transparent border-none p-0 cursor-pointer flex items-center gap-1 focus:outline-none">
                  Student <span className="text-[7px]">▼</span>
                </button>
                <div className="dropdown">
                  <div className="flex flex-col gap-2">
                    <a href="#notices" className="dd-card">
                      <div className="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-2"></use></svg></div>
                      <div>
                        <div className="dd-title">Event</div>
                        <div className="dd-sub">Fests &amp; campus activities</div>
                      </div>
                    </a>
                    <a href="/administration/SA_commitee.html" className="dd-card">
                      <div className="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-1"></use></svg></div>
                      <div>
                        <div className="dd-title">Society / Clubs</div>
                        <div className="dd-sub">Join student organizations</div>
                      </div>
                    </a>
                    <a href="/Student and Event/Hostel/hostel.html" className="dd-card">
                      <div className="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-2"></use></svg></div>
                      <div>
                        <div className="dd-title">Hostels</div>
                        <div className="dd-sub">Accommodation details</div>
                      </div>
                    </a>
                    <a href="/Student and Event/Campus_Facilities/CampusLife.html" className="dd-card">
                      <div className="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-3"></use></svg></div>
                      <div>
                        <div className="dd-title">Campus Life</div>
                        <div className="dd-sub">Experience life at OUTR</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Dropdown */}
              <div className="nav-item relative">
                <button className="nav-link font-sans bg-transparent border-none p-0 cursor-pointer flex items-center gap-1 focus:outline-none">
                  Contact <span className="text-[7px]">▼</span>
                </button>
                <div className="dropdown">
                  <div className="flex flex-col gap-2">
                    <a href="/OUTR website/location.html" className="dd-card">
                      <div className="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-16"></use></svg></div>
                      <div>
                        <div className="dd-title">Address &amp; Map</div>
                        <div className="dd-sub">Techno Campus, Ghatikia, BBSR</div>
                      </div>
                    </a>
                    <a href="#footer" className="dd-card">
                      <div className="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-17"></use></svg></div>
                      <div>
                        <div className="dd-title">Phone &amp; Email</div>
                        <div className="dd-sub">Get in touch with us</div>
                      </div>
                    </a>
                    <a href="/social.html" className="dd-card">
                      <div className="dd-icon"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0B3C5D" strokeWidth="2"><use href="#icon-18"></use></svg></div>
                      <div>
                        <div className="dd-title">Social Media Hub</div>
                        <div className="dd-sub">Follow us on all platforms</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>


            </div>

            {/* Header Right: Access Desks & Mobile Toggle */}
            <div className="flex items-center gap-4 relative">
              <div className="hidden lg:block ml-2">
                <button 
                  onClick={() => handleNavigation('auth')}
                  className="font-bold text-xs py-2 px-5 rounded-full shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 border bg-[#0b3c5d] hover:bg-[#1f5a8a] text-white border-transparent"
                >
                  Access Desks
                </button>
              </div>

              {/* Hamburger Button (Mobile) */}
              <button 
                id="mobile-btn" 
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-[#0b3c5d] bg-transparent border-none cursor-pointer"
                aria-label="Open mobile menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <use href="#icon-21"></use>
                </svg>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER OVERLAY & PANEL */}
      {mobileMenuOpen && (
        <>
          <div 
            id="mobile-overlay" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(11,60,93,0.6)', backdropFilter: 'blur(4px)', zIndex: 950 }}
          />
          <div 
            id="mobile-menu" 
            style={{ position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '320px', height: '100vh', background: 'white', zIndex: 960, boxShadow: '-10px 0 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', fontFamily: '"DM Sans",sans-serif' }}
          >
            <div id="mob-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: '#0B3C5D', flexShrink: 0, minHeight: '60px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="https://outr.ac.in/public/uploads/logo_4.png" alt="OUTR Logo" style={{ height: '32px', width: 'auto' }} />
                <div style={{ color: 'white', fontWeight: 600, fontSize: '14px', lineHeight: 1.3 }}>OUTR<br />Bhubaneswar</div>
              </div>
              <button 
                id="mob-close" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', background: '#D4AF37', border: 'none', borderRadius: '8px', cursor: 'pointer', color: 'white' }}
                aria-label="Close mobile menu"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 text-left">
              <button onClick={() => { handleNavigation('home'); setMobileMenuOpen(false); }} className="text-[17px] font-medium text-[#1E293B] bg-transparent border-none text-left w-full cursor-pointer">Home</button>
              <div className="h-px w-full bg-slate-200"></div>

              <details className="group">
                <summary className="flex justify-between items-center text-[17px] font-medium text-[#1E293B] cursor-pointer list-none">
                  <span>About OUTR</span>
                  <svg className="transition-transform group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><use href="#icon-1"></use></svg>
                </summary>
                <div className="mt-4 flex flex-col gap-4 pl-4 border-l-2 border-slate-100">
                  <a href="/OUTR website/about.html" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-slate-600 no-underline">About OUTR</a>
                  <a href="/OUTR website/mission&vission.html" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-slate-600 no-underline">Vision and Mission</a>
                  <a href="/OUTR website/schools.html" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-slate-600 no-underline">Accreditation</a>
                </div>
              </details>
              <div className="h-px w-full bg-slate-200"></div>

              <details className="group">
                <summary className="flex justify-between items-center text-[17px] font-medium text-[#1E293B] cursor-pointer list-none">
                  <span>Academic</span>
                  <svg className="transition-transform group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><use href="#icon-1"></use></svg>
                </summary>
                <div className="mt-4 flex flex-col gap-4 pl-4 border-l-2 border-slate-100">
                  <a href="/OUTR website/schools.html" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-slate-600 no-underline">Schools &amp; Departments</a>
                  <a href="/administration/SA_commitee.html" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-slate-600 no-underline">Committees</a>
                  <button onClick={() => { handleNavigation('syllabus'); setMobileMenuOpen(false); }} className="text-[15px] text-slate-600 bg-transparent border-none text-left w-full cursor-pointer">Syllabus</button>
                </div>
              </details>
              <div className="h-px w-full bg-slate-200"></div>

              <details className="group">
                <summary className="flex justify-between items-center text-[17px] font-medium text-[#1E293B] cursor-pointer list-none">
                  <span>Administration</span>
                  <svg className="transition-transform group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><use href="#icon-1"></use></svg>
                </summary>
                <div className="mt-4 flex flex-col gap-4 pl-4 border-l-2 border-slate-100">
                  <button onClick={() => { handleNavigation('vc-desk'); setMobileMenuOpen(false); }} className="text-[15px] text-slate-600 bg-transparent border-none text-left w-full cursor-pointer">VC Desk</button>
                  <button onClick={() => { handleNavigation('bom'); setMobileMenuOpen(false); }} className="text-[15px] text-slate-600 bg-transparent border-none text-left w-full cursor-pointer">Board of Management</button>
                  <button onClick={() => { handleNavigation('deans'); setMobileMenuOpen(false); }} className="text-[15px] text-slate-600 bg-transparent border-none text-left w-full cursor-pointer">Dean</button>
                  <button onClick={() => { handleNavigation('hods'); setMobileMenuOpen(false); }} className="text-[15px] text-slate-600 bg-transparent border-none text-left w-full cursor-pointer">HODs</button>
                  <button onClick={() => { handleNavigation('antiragging'); setMobileMenuOpen(false); }} className="text-[15px] text-slate-600 bg-transparent border-none text-left w-full cursor-pointer">Anti-Ragging</button>
                  <a href="/administration/AR_commitee.html" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-slate-600 no-underline">Academic Council</a>
                  <a href="/administration/L_commitee.html" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-slate-600 no-underline">Students Grievance</a>
                  <button onClick={() => { handleNavigation('coe-desk'); setMobileMenuOpen(false); }} className="text-[15px] text-slate-600 bg-transparent border-none text-left w-full cursor-pointer">Controller of Exam</button>
                </div>
              </details>
              <div className="h-px w-full bg-slate-200"></div>

              <details className="group">
                <summary className="flex justify-between items-center text-[17px] font-medium text-[#1E293B] cursor-pointer list-none">
                  <span>Student</span>
                  <svg className="transition-transform group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><use href="#icon-1"></use></svg>
                </summary>
                <div className="mt-4 flex flex-col gap-4 pl-4 border-l-2 border-slate-100">
                  <a href="#notices" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-slate-600 no-underline">Event</a>
                  <a href="/administration/SA_commitee.html" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-slate-600 no-underline">Society / Clubs</a>
                  <a href="/Student and Event/Hostel/hostel.html" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-slate-600 no-underline">Hostels</a>
                  <a href="/Student and Event/Campus_Facilities/CampusLife.html" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-slate-600 no-underline">Campus Life</a>
                </div>
              </details>
              <div className="h-px w-full bg-slate-200"></div>

              <details className="group">
                <summary className="flex justify-between items-center text-[17px] font-medium text-[#1E293B] cursor-pointer list-none">
                  <span>Contact &amp; Map</span>
                  <svg className="transition-transform group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><use href="#icon-1"></use></svg>
                </summary>
                <div className="mt-4 flex flex-col gap-4 pl-4 border-l-2 border-slate-100">
                  <a href="/OUTR website/location.html" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-slate-600 no-underline">Address &amp; Map</a>
                  <a href="#footer" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-slate-600 no-underline">Phone &amp; Email</a>
                  <a href="/social.html" onClick={() => setMobileMenuOpen(false)} className="text-[15px] text-slate-600 no-underline">Social Media Hub</a>
                </div>
              </details>
              <div className="h-px w-full bg-slate-200"></div>



              <button 
                onClick={() => { handleNavigation('auth'); setMobileMenuOpen(false); }}
                className="w-full text-center block bg-[#0B3C5D] hover:bg-[#1f5a8a] text-white font-semibold py-3 rounded-xl text-sm transition-colors cursor-pointer border-none font-sans"
              >
                Access Desks
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
