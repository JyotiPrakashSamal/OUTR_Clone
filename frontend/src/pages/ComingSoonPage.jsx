import { useSearchParams, Link } from 'react-router-dom'
import { Clock, ArrowLeft, Home } from 'lucide-react'

export default function ComingSoonPage() {
  const [params] = useSearchParams()
  const title = params.get('title') || params.get('page') || 'This section'

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans p-6 select-none text-center animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-6 text-[#d4af37] border border-[#d4af37]/20">
        <Clock className="w-6 h-6" />
      </div>
      
      <span className="inline-block bg-[#d4af37]/20 text-[#0b3c5d] text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-md mb-3 border border-[#d4af37]/30">
        Section Under Construction
      </span>
      
      <h1 className="font-serif text-3xl font-bold text-[#0b3c5d] mb-3">{title}</h1>
      <p className="text-slate-500 text-sm max-w-md leading-relaxed mb-8 font-medium">
        We are currently preparing and updating this administrative segment of the OUTR portal. Please check back soon or use the links below to return.
      </p>
      
      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href="/home.html"
          className="bg-[#0b3c5d] hover:bg-[#1f5a8a] text-white font-bold text-xs py-3 px-6 rounded-full no-underline transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" /> University Homepage
        </a>
        <Link
          to="/portal"
          className="bg-slate-100 hover:bg-slate-200 text-[#0b3c5d] font-bold text-xs py-3 px-6 rounded-full no-underline transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Services Portal
        </Link>
      </div>
    </div>
  )
}
