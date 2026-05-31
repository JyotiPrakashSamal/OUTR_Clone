// 1. BOARD OF GOVERNORS / MANAGEMENT
export function BoardOfGovernors() {
  const members = [
    { name: "Prof. Bibhuti Bhusan Biswal", role: "Vice Chancellor, OUTR", isChair: true, photo: "/administration/admin_bom_photo/image.png" },
    { name: "Shri Bhupendra Singh Poonia", role: "Commissioner-Cum-Secretary to Govt, SD&TE Department, Odisha", photo: "/administration/admin_bom_photo/image copy.png" },
    { name: "Sri Sanjeeb Kumar Mishra", role: "Principal Secretary to Govt., Finance Department, Odisha", photo: "/administration/admin_bom_photo/image copy 2.png" },
    { name: "Shri Chakravarti Singh Rathore", role: "Director of Technical Education and Training, Odisha", photo: "/administration/admin_bom_photo/image copy 3.png" },
    { name: "Amiya Kumar Rath", role: "Vice-Chancellor, BPUT, Odisha", photo: "/administration/admin_bom_photo/image copy 4.png" },
    { name: "Prof. Meera Viswavandya", role: "Registrar, OUTR", photo: "/administration/admin_bom_photo/image copy 5.png" },
    { name: "Prof. Aruna Tripathy", role: "Professor, Electronics & Instrumentation Engineering, OUTR", photo: "/administration/admin_bom_photo/image copy 6.png" },
    { name: "Prof. Jibitesh Mishra", role: "Professor, CSA, OUTR", photo: "/administration/admin_bom_photo/image copy 7.png" },
    { name: "Prof. Bhibhu Prasad Dash", role: "Professor, Textile Engineering, OUTR", photo: "/administration/admin_bom_photo/image copy 8.png" },
    { name: "Dr. Prakash Kumar Ray", role: "Associate Professor, Electrical Engineering, OUTR", photo: "/administration/admin_bom_photo/image copy 9.png" },
    { name: "Dr. Subhendu Pattnaik", role: "Former Dy. Director (Tech.), Pathani Samanta Planetarium", photo: "/administration/admin_bom_photo/image copy 10.png" },
    { name: "Dr. M. K. Pradhan", role: "GM (F&B), OSDMA, Odisha", photo: "/administration/admin_bom_photo/image copy 11.png" },
    { name: "Prof. Bijaya Ketan Panigrahi", role: "Professor, IIT Delhi", photo: "/administration/admin_bom_photo/image copy 12.png" },
    { name: "Dr. Mahendra Prasad", role: "Director, SOA, Bhubaneswar", photo: "/administration/admin_bom_photo/image copy 13.png" },
    { name: "Shri Babu Singh", role: "Hon'ble M.L.A, Odisha Legislative Assembly", photo: "/administration/admin_bom_photo/image copy 14.png" },
    { name: "Shri Sanat Kumar Gartia", role: "Hon'ble M.L.A, Odisha Legislative Assembly", photo: "/administration/admin_bom_photo/image copy 15.png" }
  ]

  return (
    <div className="bg-slate-50 min-h-screen py-16 animate-fade-in select-none">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-primary to-secondary py-16 px-6 text-center shadow-lg border-b-4 border-accent mb-12">
        <h1 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight">
          Board of Management
        </h1>
        <p className="text-white/85 text-xs sm:text-sm font-medium max-w-2xl mx-auto mt-4 leading-relaxed">
          Guiding our institution with vision, integrity, and an unwavering commitment to academic excellence.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl font-bold text-primary">Board Members</h2>
          <div className="w-12 h-1 bg-accent mx-auto mt-2 rounded"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {members.map((m, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-accent/40 transition-all duration-300">
              <div className={`h-1.5 ${m.isChair ? 'bg-accent' : 'bg-primary'}`}></div>
              <div className="h-64 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                {m.isChair && <span className="absolute top-3 right-3 bg-accent text-primary text-[9px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase z-10 shadow-sm">Chairman</span>}
                <img 
                  src={m.photo} 
                  alt={m.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop&q=60";
                  }}
                />
              </div>
              <div className="p-6 text-center flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="font-serif font-bold text-primary text-base leading-snug mb-2">{m.name}</h3>
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider leading-relaxed">{m.role}</p>
                </div>
                <div className="w-8 h-0.5 bg-accent/40 mx-auto mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// 2. ANTI-RAGGING COMMITTEE
export function AntiRaggingCommittee() {
  const members = [
    { name: "Dr. Bibhuti Bhusan Biswal", role: "Vice Chancellor, OUTR", tag: "Chairman", avatar: "BBB", phone: "+91-6742386075", email: "registrar@outr.ac.in" },
    { name: "Dr. Dipak Ranjan Swain", role: "Assistant Professor, SES", tag: "Member-Convenor", avatar: "DRS", phone: "+91-9437171236", email: "dipakswain@outr.ac.in" },
    { name: "Dr. Achyutananda Acharya", role: "Dean Academic Affairs", tag: "Member", avatar: "AA" },
    { name: "Dr. Aruna Tripathy", role: "Dean PGS&R", tag: "Member", avatar: "AT" },
    { name: "Dr. Deba Prakash Satapathy", role: "Chief Warden", tag: "Member", avatar: "DPS", phone: "+91-9861761399", email: "dpsatapathy@outr.ac.in" },
    { name: "Dr. Jibitesh Mishra", role: "Dean Student Welfare", tag: "Member", avatar: "JM", phone: "+91-9337832006", email: "jmishra@outr.ac.in" },
    { name: "Dr. Bijay Sasmal", role: "Electrical Engineering", tag: "Member", avatar: "BS" },
    { name: "ADM Bhubaneswar nominee", role: "Additional District Magistrate", tag: "Member", avatar: "ADM" },
    { name: "Officer-in-Charge or Nominee", role: "Bharatpur Police Station", tag: "Member", avatar: "OIC" },
    { name: "Mr. Samarendra Baliarsingh", role: "News@7 Media Representative", tag: "Member", avatar: "SB", phone: "9437232898", email: "sazrbsingh@rediffmail.com" },
    { name: "Mr. Ajit Kumar Nayak", role: "PRADHAN NGO Representative", tag: "Member", avatar: "AKN", phone: "9437647112", email: "ajitnaik@pradan.net" },
    { name: "Dr. Kedar Nath Mohapatra", role: "Professor, Parent Representative", tag: "Member", avatar: "KNM", phone: "9861394876" },
    { name: "Priyanka Behera", role: "Student Representative", tag: "Student Rep", avatar: "PB", phone: "8789355254" },
    { name: "Rudra Pratap Behera", role: "Student Representative", tag: "Student Rep", avatar: "RPB", phone: "+91-9439046081" }
  ]

  return (
    <div className="bg-slate-50 min-h-screen py-16 animate-fade-in select-none">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-red-800 to-rose-950 py-16 px-6 text-center shadow-lg border-b-4 border-accent mb-12">
        <span className="bg-accent/25 text-accent text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full uppercase border border-accent/20">Safe Campus Initiative</span>
        <h1 className="font-serif text-3xl md:text-5xl font-black text-white mt-4 leading-tight">
          Anti-Ragging Committee
        </h1>
        <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded"></div>
        <p className="text-white/85 text-xs sm:text-sm font-medium max-w-2xl mx-auto mt-4 leading-relaxed">
          Committed to maintaining a respectful, inclusive, and ragging-free academic environment for every student on campus.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Mandate */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-accent p-6 md:p-8 rounded-3xl shadow-sm text-left">
          <h2 className="font-serif text-2xl font-bold text-primary mb-3">Our Mandate</h2>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            The Anti-Ragging Committee is constituted as per the directions of the Hon'ble Supreme Court of India and UGC Regulations on Curbing the Menace of Ragging in Higher Educational Institutions, 2009. The committee is responsible for taking immediate and strict action against any act of ragging, ensuring the physical and psychological safety of all students, and fostering a culture of dignity and mutual respect across the institution.
          </p>
        </div>

        {/* Committee Members Grid */}
        <div className="space-y-6 text-left">
          <h2 className="font-serif text-2xl font-bold text-primary">Committee Members</h2>
          <div className="w-12 h-1 bg-accent rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((m, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:border-secondary hover:shadow-lg transition-all duration-300 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white font-serif ${m.tag === 'Chairman' ? 'bg-accent text-primary' : m.tag.includes('Student') ? 'bg-emerald-600' : 'bg-secondary'}`}>
                  {m.avatar}
                </div>
                <div className="flex-grow min-w-0">
                  <span className={`inline-block text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full mb-2 uppercase ${m.tag === 'Chairman' ? 'bg-amber-100 text-amber-800' : m.tag.includes('Student') ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'}`}>
                    {m.tag}
                  </span>
                  <h3 className="font-serif font-bold text-primary text-base truncate mb-1">{m.name}</h3>
                  <p className="text-slate-500 text-xs font-semibold mb-3">{m.role}</p>
                  
                  {m.phone && (
                    <div className="space-y-1 text-xs text-slate-500 font-semibold">
                      <a href={`tel:${m.phone}`} className="flex items-center gap-1.5 hover:text-secondary transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> Phone: {m.phone}
                      </a>
                      {m.email && (
                        <a href={`mailto:${m.email}`} className="flex items-center gap-1.5 hover:text-secondary transition-colors truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> Email: {m.email}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm text-left">
          <div className="bg-secondary p-5 flex items-center gap-3 border-b-2 border-accent">
            <span className="text-xl">📞</span>
            <h3 className="font-serif text-lg font-bold text-white">Emergency Helplines & Contacts</h3>
          </div>
          <div className="divide-y divide-slate-100 font-semibold text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 px-6 gap-2">
              <span className="text-slate-400 text-xs uppercase tracking-wider">Direct Landline</span>
              <span className="sm:col-span-2 text-primary font-bold"><a href="tel:+916742386075" className="hover:underline">+91-6742386075</a></span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 px-6 gap-2">
              <span className="text-slate-400 text-xs uppercase tracking-wider">Office Fax</span>
              <span className="sm:col-span-2 text-primary"><a href="tel:+916742386182" className="hover:underline">+91-6742386182</a></span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 px-6 gap-2">
              <span className="text-slate-400 text-xs uppercase tracking-wider">Registrar Email</span>
              <span className="sm:col-span-2 text-primary"><a href="mailto:registrar@outr.ac.in" className="hover:underline text-secondary">registrar@outr.ac.in</a></span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 px-6 gap-2">
              <span className="text-slate-400 text-xs uppercase tracking-wider">National Helpline</span>
              <span className="sm:col-span-2 text-red-600 font-bold"><a href="tel:18001805522" className="hover:underline">1800-180-5522</a> (Toll-Free, 24x7 Support)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 p-4 px-6 gap-2">
              <span className="text-slate-400 text-xs uppercase tracking-wider">UGC Safety Portal</span>
              <span className="sm:col-span-2 text-primary"><a href="https://www.antiragging.in" target="_blank" rel="noreferrer" className="text-secondary hover:underline">www.antiragging.in</a></span>
            </div>
          </div>
        </div>

        {/* How to Report */}
        <div className="space-y-6 text-left">
          <h2 className="font-serif text-2xl font-bold text-primary">How to Report an Incident</h2>
          <div className="w-12 h-1 bg-accent rounded"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm text-center space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto text-xl font-bold">🚨</div>
              <h4 className="font-serif font-bold text-primary text-base">Call 24/7 Helpline</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Dial the toll-free national UGC portal hotline for instant protection.</p>
              <a href="tel:18001805522" className="text-xs text-secondary font-bold hover:underline block pt-2">1800-180-5522 →</a>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm text-center space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto text-xl font-bold">✉️</div>
              <h4 className="font-serif font-bold text-primary text-base">Send Email</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Send a detailed complaint to the committee convenor. Confidentiality guaranteed.</p>
              <a href="mailto:registrar@outr.ac.in" className="text-xs text-secondary font-bold hover:underline block pt-2">registrar@outr.ac.in →</a>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm text-center space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto text-xl font-bold">💻</div>
              <h4 className="font-serif font-bold text-primary text-base">Online UGC Portal</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Register an official case at the national UGC Anti-Ragging website database.</p>
              <a href="https://www.antiragging.in" target="_blank" rel="noreferrer" className="text-xs text-secondary font-bold hover:underline block pt-2">Visit Website →</a>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm text-center space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto text-xl font-bold">🏢</div>
              <h4 className="font-serif font-bold text-primary text-base">Visit in Person</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Visit the Chief Warden or DSW office directly at the administrative block.</p>
              <a href="https://maps.google.com/?q=Odisha+University+of+Technology+and+Research" target="_blank" rel="noreferrer" className="text-xs text-secondary font-bold hover:underline block pt-2">Get Location →</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// 3. VICE CHANCELLOR DESK
export function VCDesk() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 animate-fade-in select-none">
      {/* Title band */}
      <div className="relative bg-gradient-to-b from-white to-[#F5F3EE] py-12 px-6 text-center border-b border-slate-200 mb-8">
        <span className="text-[10px] font-black text-secondary tracking-widest uppercase block mb-2">Office of the Vice Chancellor</span>
        <h1 className="font-serif text-3xl md:text-5xl font-black text-primary leading-tight">From the VC's Desk</h1>
        <div className="w-48 h-0.5 bg-accent mx-auto mt-4"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-5 text-left">
          
          {/* Left profile */}
          <div className="md:col-span-2 bg-gradient-to-br from-primary to-secondary p-10 flex flex-col items-center justify-start text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-accent/40"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent/40"></div>
            
            <div className="w-48 h-56 rounded-2xl border-2 border-accent/50 overflow-hidden mb-6 bg-secondary/35 shadow-md flex items-center justify-center">
              <img 
                src="/administration/admin_module_photo/director-img.png" 
                alt="Dr. Bibhuti Bhusan Biswal" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&fit=crop&q=80";
                }}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-white text-xl">Dr. Bibhuti Bhusan Biswal</h3>
              <div className="w-20 h-0.5 bg-accent mx-auto"></div>
              <p className="text-accent text-[10px] font-black uppercase tracking-wider">Vice Chancellor</p>
              <p className="text-blue-100 text-xs leading-relaxed font-semibold">Odisha University of Technology & Research<br />Bhubaneswar</p>
            </div>
          </div>

          {/* Right Message */}
          <div className="md:col-span-3 p-10 md:p-12 flex flex-col justify-between">
            <div className="space-y-6 relative">
              <span className="text-[9px] font-black text-secondary uppercase tracking-widest block border-b border-slate-100 pb-3">Message from the Vice Chancellor</span>
              <div className="font-serif text-5xl text-accent/20 absolute -top-4 -left-6 leading-none">“</div>
              
              <div className="space-y-4 text-slate-600 text-sm leading-relaxed font-medium">
                <p className="font-serif text-[#0B3C5D] text-lg leading-snug font-bold">Dear Students, Faculty, Staff, and Well-Wishers,</p>
                <p>
                  Odisha University of Technology and Research has been a pool of meritorious students consistently for many years. 
                  And hence it has always tried to facilitate quality engineering education to equip and enrich young men and women to meet global challenges in development, 
                  innovation and application of technology in the service of humanity.
                </p>
                <p>
                  Ever since its inception, a strong commitment to excellence in teaching and research has made OUTR, 
                  Bhubaneswar one of the top most colleges in Odisha. Its rich academic tradition has always attracted the most talented students who later contribute to the progress of the society.
                </p>
                <p>
                  I would like to acknowledge the students for their consistent hard work due to which this college has been able to become the first and foremost choice of the aspiring engineers of Odisha. 
                  Let me also at the same time acknowledge the great alumni power, 
                  the present and the past faculty members of the institution who have built up this institution to high acclaim.
                </p>
              </div>
            </div>

            {/* Signature */}
            <div className="border-t border-slate-100 pt-6 mt-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div className="space-y-1">
                <p className="font-serif text-primary italic text-xl font-bold">Dr. Bibhuti Bhusan Biswal</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">Vice Chancellor, OUTR Bhubaneswar</p>
              </div>
              
              {/* Virtual Seal */}
              <div className="w-16 h-16 border border-accent/50 rounded-full flex flex-col items-center justify-center text-center p-1.5 flex-shrink-0 border-dashed animate-pulse select-none">
                <span className="text-[6px] font-black text-accent tracking-widest uppercase">OUTR Seal</span>
                <span className="text-[5px] text-slate-400 font-bold">Bhubaneswar</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

// 4. COE OFFICE / DESK
export function COEDesk({ onNavigate }) {
  const notices = [
    { title: "UG 5th Semester Result Published", date: "05 May 2026", type: "Results", isNew: true },
    { title: "Semester Exam Registration - Session now Open", date: "01 May 2026", type: "Registration", isNew: true },
    { title: "Back Paper Exam Schedule — B.Tech 2026", date: "28 Apr 2026", type: "Schedule" },
    { title: "Admit Card Issuance Notice — Even Semester 2026", date: "22 Apr 2026", type: "Admit Card" },
    { title: "Re-evaluation / Rechecking Application Form 2026", date: "18 Apr 2026", type: "Re-evaluation" }
  ]

  return (
    <div className="bg-slate-50 min-h-screen py-16 animate-fade-in select-none">
      {/* Hero section */}
      <div className="bg-[#0b3c5d] text-white py-16 px-6 relative overflow-hidden border-b-4 border-accent mb-12 shadow-md">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center text-left">
          <div className="space-y-6">
            <span className="bg-accent/25 text-accent text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full uppercase border border-accent/20">Academic Integrity & Excellence</span>
            <h1 className="font-serif text-3xl md:text-5xl font-black leading-tight text-white">
              Office of the <br />
              <span className="text-accent">Controller of Management</span>
            </h1>
            <p className="text-blue-100 text-sm md:text-base font-semibold leading-relaxed max-w-lg">
              Managing examinations and academic validations with total transparency, precision, and digital security. Access grades cards, download exam admit schedules, and review notices.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => onNavigate('auth')} 
                className="bg-accent hover:bg-[#b8932a] text-[#0b3c5d] font-bold py-3 px-6 rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Sign In to View Grades / Admit Card
              </button>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-sm h-64 border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl flex items-center justify-center p-6 shadow-2xl">
              <span className="text-8xl">⚖️</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Services */}
        <div className="text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-primary">Examination Services</h2>
          <p className="text-slate-500 text-xs font-semibold max-w-md mx-auto">Access primary examination services and real-time student verification portals.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 text-left">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-accent/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center text-xl mb-4">📄</div>
              <h4 className="font-serif font-bold text-primary text-base mb-1">Clearance Desk</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-4">Check status timelines and submit department clearance files.</p>
              <button onClick={() => onNavigate('auth')} className="text-xs text-secondary font-bold hover:underline">Open Clearance →</button>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-accent/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center text-xl mb-4">📊</div>
              <h4 className="font-serif font-bold text-primary text-base mb-1">Grades &amp; GPA Cards</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-4">Query your public university grade cards and review semester summaries.</p>
              <button onClick={() => onNavigate('auth')} className="text-xs text-secondary font-bold hover:underline">Check Results →</button>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-accent/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center text-xl mb-4">🎟️</div>
              <h4 className="font-serif font-bold text-primary text-base mb-1">Admit Card Downloads</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-4">Download and print your official exam admit schedule card after clearing dues.</p>
              <button onClick={() => onNavigate('auth')} className="text-xs text-secondary font-bold hover:underline">Download Admit →</button>
            </div>
          </div>
        </div>

        {/* Notices Board */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          
          <div className="md:col-span-2 space-y-6">
            <div>
              <span className="text-[10px] font-black text-secondary tracking-widest uppercase block mb-1">Latest Updates</span>
              <h2 className="font-serif text-2xl font-bold text-primary">Notice Board</h2>
              <div className="w-12 h-1 bg-accent rounded mt-2"></div>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden divide-y divide-slate-100">
              {notices.map((n, idx) => (
                <div key={idx} className="p-5 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1.5">
                    <div className="font-semibold text-sm text-primary flex items-center gap-2">
                      {n.title}
                      {n.isNew && <span className="bg-rose-100 text-rose-800 text-[8px] font-black tracking-widest px-2 py-0.5 rounded uppercase">New</span>}
                    </div>
                    <div className="text-[10px] text-slate-400 font-semibold">{n.date} &bull; Category: {n.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact COE */}
          <div className="space-y-6">
            <div>
              <span className="text-[10px] font-black text-secondary tracking-widest uppercase block mb-1">Get in Touch</span>
              <h2 className="font-serif text-2xl font-bold text-primary">Contact Office</h2>
              <div className="w-12 h-1 bg-accent rounded mt-2"></div>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">Office Address</span>
                <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                  Office of the Controller of Examinations<br />
                  OUTR Bhubaneswar, Techno Campus, Ghatikia<br />
                  Mahalaxmi Vihar, Bhubaneswar - 751029
                </p>
              </div>
              <div className="space-y-2 border-t border-slate-100 pt-4">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black block">Hotlines & Support</span>
                <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                  📞 Phone: +91-674-2386075<br />
                  ✉️ Support: registrar@outr.ac.in<br />
                  🕐 Timing: Mon - Sat, 10 AM to 5 PM
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
