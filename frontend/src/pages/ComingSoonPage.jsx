import { useSearchParams, Link } from 'react-router-dom'

export default function ComingSoonPage() {
  const [params] = useSearchParams()
  const title = params.get('title') || params.get('page') || 'This section'

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans p-6 select-none text-center">
      <span className="inline-block bg-[#d4af37] text-[#0b3c5d] text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
        Coming soon
      </span>
      <h1 className="font-serif text-3xl font-bold text-[#0b3c5d] mb-3">{title}</h1>
      <p className="text-slate-500 text-sm max-w-md leading-relaxed mb-8">
        We are preparing this part of the OUTR website. Check back soon, or return to the university homepage.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <a
          href="/home.html"
          className="bg-[#0b3c5d] hover:bg-[#1f5a8a] text-white font-bold text-xs py-3 px-6 rounded-full no-underline transition-all"
        >
          University homepage
        </a>
        <Link
          to="/portal"
          className="bg-slate-100 hover:bg-slate-200 text-[#0b3c5d] font-bold text-xs py-3 px-6 rounded-full no-underline transition-all"
        >
          Services portal
        </Link>
      </div>
    </div>
  )
}
