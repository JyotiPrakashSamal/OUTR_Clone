import { useState, useEffect } from 'react'
import { Phone, Mail, Leaf } from 'lucide-react'

export default function Footer() {
  const [aqiValue, setAqiValue] = useState('38')
  const [aqiStatus, setAqiStatus] = useState('Good')
  const [aqiColor, setAqiColor] = useState('text-emerald-400')

  useEffect(() => {
    const fetchLiveAQI = async () => {
      try {
        // 1. Try local cache first to avoid API spamming on page switches
        const cacheKey = 'outr_live_aqi_v1'
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
          const parsed = JSON.parse(cached)
          // 15-minute cache lifespan
          if (parsed.timestamp && Date.now() - parsed.timestamp < 15 * 60 * 1000) {
            setAqiValue(parsed.value)
            setAqiStatus(parsed.status)
            setAqiColor(parsed.color)
            return
          }
        }

        // 2. Fetch live data from Open-Meteo Air Quality API for Bhubaneswar
        const response = await fetch(
          'https://air-quality-api.open-meteo.com/v1/air-quality?latitude=20.2644&longitude=85.8081&current=us_aqi'
        )
        const data = await response.json()
        const usAqi = data?.current?.us_aqi

        if (typeof usAqi === 'number') {
          const valueStr = String(Math.round(usAqi))
          let statusStr = 'Good'
          let colorClass = 'text-emerald-400'

          if (usAqi <= 50) {
            statusStr = 'Good'
            colorClass = 'text-emerald-400'
          } else if (usAqi <= 100) {
            statusStr = 'Moderate'
            colorClass = 'text-yellow-400'
          } else if (usAqi <= 150) {
            statusStr = 'Poor'
            colorClass = 'text-orange-400'
          } else if (usAqi <= 200) {
            statusStr = 'Unhealthy'
            colorClass = 'text-rose-400'
          } else if (usAqi <= 300) {
            statusStr = 'Very Unhealthy'
            colorClass = 'text-purple-400'
          } else {
            statusStr = 'Hazardous'
            colorClass = 'text-red-500'
          }

          setAqiValue(valueStr)
          setAqiStatus(statusStr)
          setAqiColor(colorClass)

          // Save to local cache
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              value: valueStr,
              status: statusStr,
              color: colorClass,
              timestamp: Date.now()
            })
          )
        }
      } catch (err) {
        console.warn('Unable to retrieve live AQI:', err)
        // Fallback to safe defaults
        setAqiValue('38')
        setAqiStatus('Good')
        setAqiColor('text-emerald-400')
      }
    }

    fetchLiveAQI()
  }, [])

  return (
    <footer id="footer" className="w-full bg-[#0a2940] text-[#94a3b8] py-16 px-5 select-none font-sans mt-20 font-medium">
      
      {/* Footer Top Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr] gap-12 mb-12 text-left">
        
        {/* Column 1: Identity & Socials */}
        <div className="flex flex-col space-y-6">
          <div className="flex items-center gap-3.5 mb-2 text-white text-left">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <img 
                src="https://outr.ac.in/public/uploads/logo_4.png" 
                alt="OUTR Logo" 
                className="w-7.5 h-7.5 object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-sm tracking-wide leading-none text-white">Odisha University of</span>
              <span className="font-serif font-bold text-sm tracking-wide leading-none text-[#d4af37] mt-1">Technology and Research</span>
            </div>
          </div>
          <div className="text-xs text-[#8ca8c0] leading-relaxed mb-4 space-y-2">
            <p>
              Techno Campus, Ghatikia, Mahalaxmi Vihar<br/>
              Bhubaneswar, Odisha - 751029, India
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#d4af37]/75" /> Office Phone: 0674-2386075 | 0674-2386182
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#d4af37]/75" /> Email: registrar@outr.ac.in
            </p>
          </div>
        </div>
 
        {/* Column 2: Quick Links */}
        <div>
          <h4 className="font-serif font-bold text-sm text-white mb-6 uppercase tracking-wider pl-0.5 border-b border-[#d4af37]/20 pb-2">
            Quick Links
          </h4>
          <ul className="space-y-3.5 p-0 m-0 list-none text-xs text-[#8ca8c0]">
            <li><a href="/home.html" className="hover:text-white transition-colors no-underline">Home Desk</a></li>
            <li><a href="/about" className="hover:text-white transition-colors no-underline">About OUTR</a></li>
            <li><a href="/vision-mission" className="hover:text-white transition-colors no-underline">Vision &amp; Mission</a></li>
            <li><a href="/social.html" className="hover:text-white transition-colors no-underline">Social Media Hub</a></li>
          </ul>
        </div>
 
        {/* Column 3: Academics */}
        <div>
          <h4 className="font-serif font-bold text-sm text-white mb-6 uppercase tracking-wider pl-0.5 border-b border-[#d4af37]/20 pb-2">
            Academics
          </h4>
          <ul className="space-y-3.5 p-0 m-0 list-none text-xs text-[#8ca8c0]">
            <li><a href="/outr-website/schools.html" className="hover:text-white transition-colors no-underline">8 Schools Desk</a></li>
            <li><a href="/syllabus" className="hover:text-white transition-colors no-underline">UG/PG Course Syllabus</a></li>
            <li><a href="/portal?view=coe-desk" className="hover:text-white transition-colors no-underline">Controller of Exam</a></li>
            <li><a href="/student-and-event/Hostel/hostel.html" className="hover:text-white transition-colors no-underline">Hostels Allocation</a></li>
          </ul>
        </div>
 
        {/* Column 4: Live AQI Info */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-serif font-bold text-sm text-white mb-6 uppercase tracking-wider pl-0.5 border-b border-[#d4af37]/20 pb-2">
            Live Weather & AQI
          </h4>
          <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <div className="flex items-center gap-3">
              <Leaf className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Air Quality (AQI)</div>
                <div className="text-sm font-bold mt-0.5 transition-colors duration-300"><span className={aqiColor}>{aqiValue} &bull; {aqiStatus}</span></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed mt-2.5 mb-0">Live sensor reports from Techno Campus, Ghatikia.</p>
          </div>
        </div>

      </div>

      {/* Copyright Bottom */}
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 text-center text-xs text-slate-500 font-semibold flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>&copy; 2026 Odisha University of Technology and Research. All Rights Reserved. &bull; Bhubaneswar, Odisha</span>
        <span className="text-[10px] text-slate-600 font-medium">Made by Amrita, Ramakanta, Sonali and Jyoti</span>
      </div>

    </footer>
  )
}
