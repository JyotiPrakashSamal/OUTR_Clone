import { useState, useEffect } from 'react'

export default function Footer() {
  const [aqiValue, setAqiValue] = useState('--')
  const [aqiStatus, setAqiStatus] = useState('Unavialable')

  // Live AQI mock simulation to avoid heavy network polling in dev, matching legacy home.js AQI task
  useEffect(() => {
    const timer = setTimeout(() => {
      setAqiValue('42')
      setAqiStatus('Good')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <footer className="w-full bg-white border-t border-slate-200/60 pt-16 pb-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        {/* Identity & Shield Column */}
        <div className="flex flex-col text-left space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://outr.ac.in/public/uploads/logo_4.png" 
              alt="OUTR Logo" 
              className="w-10 h-10 object-contain"
            />
            <div className="font-serif font-bold text-primary leading-tight text-sm">
              Odisha University of <br />
              Technology and Research
            </div>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Odisha University of Technology and Research (OUTR) is a premiere public state technical university focused on engineering, basic sciences, and humanities education.
          </p>
          {/* AQI Display Widget */}
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-800 tracking-wide uppercase">
              Live Techno AQI: {aqiValue} ({aqiStatus})
            </span>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="text-left">
          <h4 className="font-serif font-bold text-primary text-base mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold text-muted">
            <li><a href="/" className="hover:text-primary transition-colors">Home Page</a></li>
            <li><a href="#about" className="hover:text-primary transition-colors">About University</a></li>
            <li><a href="#admission" className="hover:text-primary transition-colors">Admissions Portal</a></li>
            <li><a href="#notices" className="hover:text-primary transition-colors">Notices & Circulars</a></li>
          </ul>
        </div>

        {/* Academics Column */}
        <div className="text-left">
          <h4 className="font-serif font-bold text-primary text-base mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent">
            Academics
          </h4>
          <ul className="space-y-2.5 text-xs font-semibold text-muted">
            <li><a href="#schools" className="hover:text-primary transition-colors">Schools & Departments</a></li>
            <li><a href="#courses" className="hover:text-primary transition-colors">Academic Syllabus</a></li>
            <li><a href="#faculty" className="hover:text-primary transition-colors">Faculty Directory</a></li>
            <li><a href="#research" className="hover:text-primary transition-colors">Research Projects</a></li>
          </ul>
        </div>

        {/* Contacts Column */}
        <div className="text-left space-y-4">
          <h4 className="font-serif font-bold text-primary text-base mb-2 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-8 after:h-0.5 after:bg-accent">
            Contact Us
          </h4>
          <div className="space-y-2.5 text-xs text-muted leading-normal font-medium">
            <p>Techno Campus, Mahalaxmi Vihar, Ghatikia, Bhubaneswar, Odisha - 751003, India</p>
            <p>📞 Phone: 0674-2725223</p>
            <p>✉️ Email: registrar@outr.ac.in</p>
          </div>
          {/* Social Icons row */}
          <div className="flex gap-3 pt-2">
            {['facebook', 'twitter', 'linkedin', 'youtube'].map((social) => (
              <a 
                key={social} 
                href={`https://${social}.com`}
                className="w-7 h-7 rounded-lg bg-primary/5 hover:bg-primary hover:text-white flex items-center justify-center text-primary text-xs transition-all duration-300"
              >
                {social[0].toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Underline Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 pt-6 text-center text-xs text-muted">
        <div>&copy; {new Date().getFullYear()} Odisha University of Technology and Research (OUTR). All Rights Reserved.</div>
        <div className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Techno Campus Excellence</div>
      </div>
    </footer>
  )
}
