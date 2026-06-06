import { useState, useMemo } from 'react'
import clubsData from '../data/clubs.json'
import ClubCard from '../components/ClubCard'
import { Search, Sparkles, Laptop, Music, Heart, Info, ArrowLeft, Mail } from 'lucide-react'

export default function ClubsSocieties() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('All')

  // Available categories for filtering
  const tabs = [
    { name: 'All', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'Technical', icon: <Laptop className="w-4 h-4" /> },
    { name: 'Cultural', icon: <Music className="w-4 h-4" /> },
    { name: 'Social Service', icon: <Heart className="w-4 h-4" /> }
  ]

  // Filtered and searched clubs list
  const filteredClubs = useMemo(() => {
    return clubsData.filter(club => {
      const matchesSearch = 
        club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.category.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesTab = activeTab === 'All' || club.category === activeTab

      return matchesSearch && matchesTab
    })
  }, [searchQuery, activeTab])

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans pb-16">
      {/* Dynamic Header Banner */}
      <header className="relative bg-gradient-to-r from-[#0b3c5d] via-[#1f5a8a] to-[#0b3c5d] text-white py-16 px-6 text-center select-none overflow-hidden border-b-4 border-[#d4af37]">
        {/* Subtle decorative grid/glow layer */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <div className="absolute top-[-50%] left-[-20%] w-[60%] h-[150%] bg-radial-gradient from-[#d4af37]/10 to-transparent blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/25 text-[#d4af37] text-[10px] font-bold tracking-widest uppercase border border-[#d4af37]/35 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Student Development
          </span>
          <h1 className="font-serif font-black text-4xl md:text-5xl tracking-wide mb-4 leading-tight">
            Clubs &amp; <span className="text-[#d4af37] italic">Societies</span>
          </h1>
          <p className="text-blue-100/90 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Explore active technical communities, creative cultural societies, and volunteer programs fostering growth and leadership beyond academic blocks.
          </p>
        </div>
      </header>

      {/* Main Directory Area */}
      <main className="max-w-7xl mx-auto px-5 mt-10">
        
        {/* Search and Filters Segment */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white/60 backdrop-blur-md border border-slate-200/50 p-4 rounded-3xl shadow-sm">
          
          {/* Dynamic Category Filtering Tabs */}
          <div className="flex flex-wrap gap-2 select-none">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === tab.name
                    ? 'bg-[#0b3c5d] text-white shadow-[0_4px_12px_rgba(11,60,93,0.25)] border-transparent'
                    : 'bg-white text-slate-600 border border-slate-200/60 hover:bg-slate-50 hover:text-[#0b3c5d]'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Search Inputs */}
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 rounded-full text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b3c5d]/20 focus:border-[#0b3c5d] transition-all"
            />
          </div>

        </div>

        {/* Dynamic Cards Grid */}
        {filteredClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredClubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white/50 border border-dashed border-slate-300 rounded-3xl max-w-xl mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
              <Info className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-700 text-lg mb-1">No Clubs Found</h3>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-xs font-medium">
              We couldn't find any organization matching your current search criteria. Try modifying your search term or filtering categories.
            </p>
          </div>
        )}
        {/* Suggest an Edit Section */}
        <section className="max-w-xl mx-auto mt-20 bg-white/60 backdrop-blur-md border border-slate-200/50 p-6 rounded-3xl text-center shadow-sm relative overflow-hidden select-none">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0b3c5d] via-[#d4af37] to-[#1f5a8a]"></div>
          <h3 className="font-serif font-bold text-base text-[#0b3c5d] mb-1.5 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#d4af37]" /> Missing or Inactive Links?
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed mb-4 max-w-sm mx-auto font-medium">
            Are you a coordinator for one of the student clubs? Submit your active website, Instagram handle, or LinkedIn page to keep the directory updated.
          </p>
          <a
            href="mailto:studentaffairs@outr.ac.in?subject=OUTR%20Clubs%20Directory%20Update%20Request"
            className="inline-flex items-center gap-1.5 bg-[#0b3c5d] hover:bg-[#1f5a8a] text-white font-bold text-[11px] py-2 px-5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 no-underline cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" /> Submit Link Update
          </a>
        </section>

      </main>
    </div>
  )
}
