import { Globe, Mail, CheckCircle2, AlertCircle, Laptop, Music, BookOpen, Heart, Users } from 'lucide-react'

// Helper to get a deterministic gradient based on the club ID
const getGradientStyle = (id) => {
  const gradients = {
    zairza: 'from-[#0b3c5d] to-[#1f5a8a]',
    spectrum: 'from-[#0f172a] to-[#38bdf8]',
    zigbee: 'from-[#059669] to-[#34d399]',
    'sae-bluejay': 'from-[#1e3a8a] to-[#3b82f6]',
    asme: 'from-[#7c2d12] to-[#f97316]',
    aerospace: 'from-[#4c1d95] to-[#8b5cf6]',
    iste: 'from-[#0369a1] to-[#0ea5e9]',
    'energy-club': 'from-[#0f766e] to-[#14b8a6]',
    ewb: 'from-[#15803d] to-[#22c55e]',
    biozo: 'from-[#b45309] to-[#f59e0b]',
    civicon: 'from-[#1e293b] to-[#64748b]',
    cetadel: 'from-[#881337] to-[#f43f5e]',
    amuza: 'from-[#581c87] to-[#a855f7]',
    arpeggio: 'from-[#0284c7] to-[#38bdf8]',
    photofactory: 'from-[#0369a1] to-[#3b82f6]',
    tda: 'from-[#4d1d95] to-[#a855f7]',
    spinneret: 'from-[#0f766e] to-[#0d9488]',
    nss: 'from-[#1e1b4b] to-[#4f46e5]',
  }

  return gradients[id] || 'from-[#1e293b] to-[#475569]'
}

// Helper to get abbreviation for the logo placeholder
const getAbbreviation = (name) => {
  if (name.includes('/')) {
    return name.split('/').map(word => word.trim().charAt(0)).join('')
  }
  return name
    .split(' ')
    .filter(word => word.toLowerCase() !== 'club' && word.toLowerCase() !== 'chapter' && word.toLowerCase() !== 'of' && word.toLowerCase() !== "students'")
    .map(word => word.charAt(0))
    .join('')
    .substring(0, 3)
    .toUpperCase()
}

// Helper to render category icon
const getCategoryIcon = (category) => {
  const props = { className: 'w-3.5 h-3.5 mr-1 text-[#0b3c5d]/70 group-hover:text-[#d4af37]' }
  switch (category.toLowerCase()) {
    case 'technical':
      return <Laptop {...props} />
    case 'cultural':
      return <Music {...props} />
    case 'literary':
      return <BookOpen {...props} />
    case 'social service':
      return <Heart {...props} />
    default:
      return <Users {...props} />
  }
}

export default function ClubCard({ club }) {
  const { id, name, category, description, status, website, instagram, linkedin, github, youtube, facebook, logo, contact } = club

  // Get active website or university/department page fallback
  const getWebsiteInfo = () => {
    if (website) {
      return { url: website, title: 'Official Website', fallback: false }
    }
    
    const fallbacks = {
      'sae-bluejay': { url: 'https://outr.ac.in/schools/mechanical-sciences/', title: 'Mechanical Sciences School (OUTR)' },
      asme: { url: 'https://outr.ac.in/schools/mechanical-sciences/', title: 'Mechanical Sciences School (OUTR)' },
      aerospace: { url: 'https://outr.ac.in/schools/mechanical-sciences/', title: 'Mechanical Sciences School (OUTR)' },
      'energy-club': { url: 'https://outr.ac.in/schools/electrical-sciences/', title: 'Electrical Sciences School (OUTR)' },
      biozo: { url: 'https://outr.ac.in/schools/basic-sciences-and-humanities/', title: 'Basic Sciences & Humanities School (OUTR)' },
      civicon: { url: 'https://outr.ac.in/schools/infrastructure-and-planning/', title: 'Infrastructure & Planning School (OUTR)' },
      spinneret: { url: 'https://outr.ac.in/schools/infrastructure-and-planning/', title: 'Infrastructure & Planning School (OUTR)' }
    }
    
    if (fallbacks[id]) {
      return { url: fallbacks[id].url, title: fallbacks[id].title, fallback: true }
    }
    
    return { url: 'https://outr.ac.in/', title: 'University Portal (OUTR)', fallback: true }
  }

  const webInfo = getWebsiteInfo()
  
  // Primary link for logo and title redirection (prefer official website, then fallback)
  const primaryLink = webInfo.url

  // Check if the club is lacking active links to highlight the Mail contact option
  const activeLinksCount = [website, instagram, linkedin, github, facebook, youtube].filter(Boolean).length
  const isLackingLinks = activeLinksCount <= 1

  return (
    <div className="group relative bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/60 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:translate-y-[-4px] hover:border-[#d4af37]/30 transition-all duration-300 overflow-hidden">
      {/* Decorative Brand Accent (Top border highlight on hover) */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0b3c5d] via-[#d4af37] to-[#1f5a8a] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div>
        {/* Card Header: Logo & Status Tag */}
        <div className="flex items-start justify-between mb-4">
          {/* Logo container */}
          <a 
            href={primaryLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-14 h-14 rounded-xl flex items-center justify-center shadow-inner overflow-hidden select-none hover:scale-[1.05] transition-transform duration-300"
          >
            {logo ? (
              <img src={logo} alt={`${name} Logo`} className="w-full h-full object-contain" />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${getGradientStyle(id)} flex items-center justify-center font-serif text-white font-bold text-sm tracking-wider`}>
                {getAbbreviation(name)}
              </div>
            )}
          </a>

          {/* Status Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/80 border border-slate-200/50 text-[10px] font-bold tracking-wide">
            {status === 'Active' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />
                <span className="text-emerald-700">ACTIVE</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
                <span className="text-amber-700">LIKELY ACTIVE</span>
              </>
            )}
          </div>
        </div>

        {/* Club Category Badge */}
        <div className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#0b3c5d]/5 text-[10.5px] font-semibold text-[#0b3c5d] mb-3 border border-[#0b3c5d]/10 transition-colors duration-300">
          {getCategoryIcon(category)}
          {category}
        </div>

        {/* Title & Description */}
        <h3 className="font-serif font-bold text-lg text-[#0b3c5d] mb-2 leading-snug group-hover:text-[#1f5a8a] transition-colors duration-200">
          <a href={primaryLink} target="_blank" rel="noopener noreferrer" className="no-underline text-inherit hover:underline">
            {name}
          </a>
        </h3>
        <p className="text-slate-500 text-xs md:text-[13px] leading-relaxed line-clamp-3 mb-6 font-medium">
          {description}
        </p>
      </div>

      {/* Footer: Social handles & Contact */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        {/* Social Icons row */}
        <div className="flex gap-2">
          {/* Globe/Website Icon (Always active, either official or fallback) */}
          <a 
            href={webInfo.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`p-2 rounded-lg border transition-all duration-200 hover:scale-[1.05] flex items-center justify-center ${
              webInfo.fallback 
                ? 'bg-slate-50 border-slate-200/50 text-[#0b3c5d]/50 hover:bg-[#0b3c5d]/5 hover:text-[#0b3c5d]' 
                : 'bg-slate-50 border-slate-200/50 hover:bg-[#0b3c5d]/10 hover:border-[#0b3c5d]/20 text-[#0b3c5d]'
            }`}
            title={webInfo.title}
          >
            <Globe className="w-4 h-4" />
          </a>

          {/* Instagram Handle */}
          {instagram ? (
            <a 
              href={instagram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-lg bg-slate-50 border border-slate-200/50 hover:bg-[#e1306c]/10 hover:border-[#e1306c]/20 text-[#e1306c] transition-all duration-200 hover:scale-[1.05] flex items-center justify-center"
              title="Instagram"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          ) : (
            <div 
              className="p-2 rounded-lg bg-slate-50 border border-slate-200/50 text-slate-300 cursor-not-allowed select-none flex items-center justify-center"
              title="Official Instagram not registered"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </div>
          )}

          {/* LinkedIn Page */}
          {linkedin ? (
            <a 
              href={linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-lg bg-slate-50 border border-slate-200/50 hover:bg-[#0077b5]/10 hover:border-[#0077b5]/20 text-[#0077b5] transition-all duration-200 hover:scale-[1.05] flex items-center justify-center"
              title="LinkedIn"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          ) : (
            <div 
              className="p-2 rounded-lg bg-slate-50 border border-slate-200/50 text-slate-300 cursor-not-allowed select-none flex items-center justify-center"
              title="Official LinkedIn page not registered"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
          )}

          {/* GitHub Profile */}
          {github ? (
            <a 
              href={github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-lg bg-slate-50 border border-slate-200/50 hover:bg-slate-900/10 hover:border-slate-900/20 text-slate-800 transition-all duration-200 hover:scale-[1.05] flex items-center justify-center"
              title="GitHub"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          ) : (
            <div 
              className="p-2 rounded-lg bg-slate-50 border border-slate-200/50 text-slate-300 cursor-not-allowed select-none flex items-center justify-center"
              title="Official GitHub account not registered"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
          )}

          {/* Facebook Link (rendered active if present) */}
          {facebook && (
            <a 
              href={facebook} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-lg bg-slate-50 border border-slate-200/50 hover:bg-[#1877f2]/10 hover:border-[#1877f2]/20 text-[#1877f2] transition-all duration-200 hover:scale-[1.05] flex items-center justify-center"
              title="Facebook"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8v-6.9H7.5v-2.9H10V9.5c0-2.5 1.49-3.9 3.77-3.9 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33V21.8c4.56-.93 8-4.96 8-9.8z" />
              </svg>
            </a>
          )}

          {/* YouTube Link (rendered active if present) */}
          {youtube && (
            <a 
              href={youtube} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-lg bg-slate-50 border border-slate-200/50 hover:bg-[#ff0000]/10 hover:border-[#ff0000]/20 text-[#ff0000] transition-all duration-200 hover:scale-[1.05] flex items-center justify-center"
              title="YouTube"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.507a3.003 3.003 0 00-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 002.11 2.11c1.87.507 9.388.507 9.388.507s7.518 0 9.388-.507a3.003 3.003 0 002.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          )}
        </div>

        {/* Contact info overlay */}
        {contact ? (
          <a 
            href={`mailto:${contact}`} 
            className={`p-2 rounded-lg border transition-all duration-200 flex items-center gap-1 text-[11px] font-bold hover:scale-[1.03] ${
              isLackingLinks 
                ? 'bg-[#d4af37] text-white hover:bg-[#c5a030] shadow-sm border-transparent' 
                : 'bg-slate-50 border-slate-200/50 hover:bg-[#d4af37]/10 hover:border-[#d4af37]/20 text-[#d4af37]'
            }`}
            title={`Contact: ${contact}`}
          >
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline">{isLackingLinks ? 'Mail Club' : 'Mail'}</span>
          </a>
        ) : (
          <div className="w-4 h-4"></div>
        )}
      </div>
    </div>
  )
}
