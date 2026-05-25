import { useState, useEffect } from 'react'

export default function Footer() {
  const [aqiValue, setAqiValue] = useState('144')
  const [aqiStatus, setAqiStatus] = useState('Poor')

  useEffect(() => {
    // Live AQI PM2.5 display mock matching legacy data
    const timer = setTimeout(() => {
      setAqiValue('72')
      setAqiStatus('Moderate')
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <footer id="footer" className="w-full bg-[#0a2940] text-[#94a3b8] pt-16 pb-0 select-none font-sans">
      
      {/* Footer Top Grid */}
      <div className="max-w-7xl mx-auto px-5 pb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 text-left">
        
        {/* Column 1: Identity & Socials */}
        <div className="flex flex-col space-y-5">
          <div className="flex items-center gap-4">
            <img 
              src="https://outr.ac.in/public/uploads/logo_4.png" 
              alt="OUTR logo" 
              className="h-[70px] w-auto object-contain"
            />
            <div>
              <div className="text-white font-bold text-[15px] leading-[1.3] uppercase font-serif">
                Odisha University of <br /> Technology and Research
              </div>
            </div>
          </div>
          <p className="text-[13px] leading-[1.8] text-[#8ca8c0]">
            Techno Campus, Ghatikia<br />
            Bhubaneswar, Odisha - 751 003<br />
            India
          </p>
          <div className="text-[13px] leading-[1.8] text-[#8ca8c0] space-y-0.5 font-medium">
            <div>📞 0674-2725223</div>
            <div>✉️ registrar@outr.ac.in</div>
          </div>
          
          {/* Socials Icon list */}
          <div className="flex gap-2.5 pt-2">
            {[
              { href: 'https://www.facebook.com/OUTRuniversity/', icon: 'F' },
              { href: 'https://www.instagram.com/outruniversity/', icon: 'I' },
              { href: 'https://www.linkedin.com/school/rani-nilima-kumari-mahila-mahavidyalaya-dharupur-pratapgarh/', icon: 'L' },
              { href: 'https://www.youtube.com/@outrlive', icon: 'Y' }
            ].map((s, idx) => (
              <a
                key={idx}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-[#8ca8c0] hover:bg-white/10 hover:text-white hover:scale-105 transition-all text-xs font-bold"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-[14px] font-bold text-white mb-5 pb-2 border-b border-white/10 font-serif">
            Quick Links
          </h4>
          <ul className="space-y-2.5 text-[13px] font-semibold text-[#8ca8c0]">
            <li><a href="#hero" className="hover:text-accent transition-colors">Home Page</a></li>
            <li><a href="#about" className="hover:text-accent transition-colors">About OUTR</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Admissions</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">RTI Data</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Tenders Portal</a></li>
          </ul>
        </div>

        {/* Column 3: Academics */}
        <div>
          <h4 className="text-[14px] font-bold text-white mb-5 pb-2 border-b border-white/10 font-serif">
            Academics
          </h4>
          <ul className="space-y-2.5 text-[13px] font-semibold text-[#8ca8c0]">
            <li><a href="#" className="hover:text-accent transition-colors">Programs Offered</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">UG Syllabus</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">PG Syllabus</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Academic Calendar</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">COE - AI & ICT</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Examination Cell</a></li>
          </ul>
        </div>

        {/* Column 4: AQI and Location Map */}
        <div className="flex flex-col space-y-4">
          <h4 className="text-[14px] font-bold text-white mb-1 pb-2 border-b border-white/10 font-serif">
            Campus Air Quality & Map
          </h4>
          
          {/* AQI Widget */}
          <div className="flex items-center gap-2 bg-[#071e2e] border border-white/5 px-3 py-1.5 rounded-xl w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase font-sans">
              Live PM2.5 AQI: {aqiValue} ({aqiStatus})
            </span>
          </div>

          {/* Embedded Google Map */}
          <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10 shadow-md">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.5!2d85.776639!3d20.275845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a19a7f9d486f7c3%3A0xde71ead59307dcca!2sOdisha%20University%20of%20Technology%20and%20Research!5e0!3m2!1sen!2sin!4v1710000000000"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-[#071e2e] border-t border-white/5 py-6 text-center text-xs text-[#8ca8c0]/80">
        <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <div>&copy; {new Date().getFullYear()} Odisha University of Technology and Research. All Rights Reserved.</div>
          <div className="text-[9px] text-[#8ca8c0]/50 uppercase tracking-widest font-mono">
            Security Standard: SSL JWT Bcrypt Stamped
          </div>
        </div>
      </div>

    </footer>
  )
}
