import { 
  GraduationCap, Mail, Phone, Clock, Scale, FileText, BarChart3, Ticket, 
  Building, Eye, Target, MapPin, Bus, Train, Plane, ShieldAlert, Laptop, Users, User, Briefcase
} from 'lucide-react';

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
      <div className="relative bg-[#0b3c5d] py-16 px-6 text-center shadow-lg border-b-4 border-[#d4af37] mb-12">
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
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z'/%3E%3C/svg%3E";
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
      <div className="relative bg-[#7f1d1d] py-16 px-6 text-center shadow-lg border-b-4 border-[#d4af37] mb-12">
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
            <Phone className="w-5 h-5 text-white" />
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
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-700 flex items-center justify-center mx-auto"><ShieldAlert className="w-5 h-5" /></div>
              <h4 className="font-serif font-bold text-primary text-base">Call 24/7 Helpline</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Dial the toll-free national UGC portal hotline for instant protection.</p>
              <a href="tel:18001805522" className="text-xs text-secondary font-bold hover:underline block pt-2">1800-180-5522 →</a>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm text-center space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto"><Mail className="w-5 h-5" /></div>
              <h4 className="font-serif font-bold text-primary text-base">Send Email</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Send a detailed complaint to the committee convenor. Confidentiality guaranteed.</p>
              <a href="mailto:registrar@outr.ac.in" className="text-xs text-secondary font-bold hover:underline block pt-2">registrar@outr.ac.in →</a>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm text-center space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center mx-auto"><Laptop className="w-5 h-5" /></div>
              <h4 className="font-serif font-bold text-primary text-base">Online UGC Portal</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">Register an official case at the national UGC Anti-Ragging website database.</p>
              <a href="https://www.antiragging.in" target="_blank" rel="noreferrer" className="text-xs text-secondary font-bold hover:underline block pt-2">Visit Website →</a>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm text-center space-y-4 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto"><MapPin className="w-5 h-5" /></div>
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
      <div className="relative bg-[#f8fafc] py-12 px-6 text-center border-b border-slate-200 mb-8">
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
                  e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z'/%3E%3C/svg%3E";
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
    { title: "Back Paper Exam Schedule - B.Tech 2026", date: "28 Apr 2026", type: "Schedule" },
    { title: "Admit Card Issuance Notice - Even Semester 2026", date: "22 Apr 2026", type: "Admit Card" },
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
                onClick={() => onNavigate('portal')} 
                className="bg-accent hover:bg-[#b8932a] text-[#0b3c5d] font-bold py-3 px-6 rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Sign In to View Grades / Admit Card
              </button>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full max-w-sm h-64 border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl flex items-center justify-center p-6 shadow-2xl">
              <Scale className="w-24 h-24 text-white" />
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
              <div className="w-10 h-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-serif font-bold text-primary text-base mb-1">Clearance Desk</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-4">Check status timelines and submit department clearance files.</p>
              <button onClick={() => onNavigate('portal')} className="text-xs text-secondary font-bold hover:underline">Open Clearance →</button>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-accent/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-serif font-bold text-primary text-base mb-1">Grades &amp; GPA Cards</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-4">Query your public university grade cards and review semester summaries.</p>
              <button onClick={() => onNavigate('portal')} className="text-xs text-secondary font-bold hover:underline">Check Results →</button>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-accent/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-4">
                <Ticket className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-serif font-bold text-primary text-base mb-1">Admit Card Downloads</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-4">Download and print your official exam admit schedule card after clearing dues.</p>
              <button onClick={() => onNavigate('portal')} className="text-xs text-secondary font-bold hover:underline">Download Admit →</button>
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
                <p className="text-slate-600 text-xs font-semibold leading-relaxed flex flex-col gap-1.5">
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-primary" /> Phone: +91-674-2386075</span>
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-primary" /> Support: registrar@outr.ac.in</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> Timing: Mon - Sat, 10 AM to 5 PM</span>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

// 5. ABOUT PAGE
export function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 animate-fade-in select-none">
      {/* Page Hero */}
      <div className="relative bg-[#0b3c5d] py-16 px-6 text-center shadow-lg border-b-4 border-[#d4af37] mb-12">
        <h1 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight">
          About <span className="text-accent">OUTR</span>
        </h1>
        <p className="text-white/85 text-xs sm:text-sm font-medium max-w-2xl mx-auto mt-4 leading-relaxed">
          History, overview, and the transformative learning environment of Odisha University of Technology and Research.
        </p>
        <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-stretch">
          {/* Main Description */}
          <div className="lg:col-span-3 bg-white border border-slate-200 border-l-4 border-l-accent p-8 rounded-3xl shadow-sm text-left flex flex-col justify-between">
            <div className="space-y-6 text-slate-600 text-sm leading-relaxed font-semibold">
              <p>
                The State Government established the <strong className="text-primary font-bold">"Odisha University of Technology and Research"</strong> located at Bhubaneswar by upgrading the College of Engineering &amp; Technology, Bhubaneswar through the Odisha University of Technology and Research Act, 2021 (known as Odisha Act 17 of 2021). The University started functioning with effect from 8th October, 2021 through Notification of SD&amp;TE Department, Government of Odisha. The First Statutes 2022 of the University was notified in February 2023. The University is governed by the Odisha University of Technology and Research Act, 2021 and its First Statutes, 2022.
              </p>  
              <p>
                The University is located in the Techno Campus at Kalinga Nagar, Bhubaneswar, about 2.0 km away from Khandagiri-Udayagiri caves. It spreads over 100 acres of green campus with 24x7 Wi-Fi coverage in the whole premises, including hostels. The University is 5 km from the bus stop, 8 km from Biju Patnaik International Airport, and 12 km from Bhubaneswar Railway Station.
              </p>
              <p>
                The meticulously nurtured learning environment in OUTR is stress-free and fear-free. It enables and encourages new ideas to flourish. Students are encouraged to persist in their quest for learning and acquire the requisite skills to excel in the present information-driven globalised world. Our core aspiration is to provide Educational Excellence, in that every student makes a positive difference during their time with us. 
              </p>
              <p>
                We strive to provide a caring, supportive, and challenging environment to students, in which they can grow and flourish. The dream to make a creative, multidisciplinary institution which delivers quality education, original research and practice, is what drives the academic community here.
              </p>
            </div>
            
            <div className="mt-8 border-t border-slate-100 pt-6">
              <p className="text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4" /> SD&amp;TE Department, Govt. of Odisha Approved
              </p>
            </div>
          </div>

          {/* Right Image/Statue Graphic */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Custom Text Card above the Image */}
            <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm text-left border-l-4 border-l-primary">
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-5 h-5 text-primary" />
                <h3 className="font-serif font-black text-sm text-primary">A Legacy of Innovation</h3>
              </div>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                As a premier unitary university, OUTR fosters research-driven education, multidisciplinary programs, and startup incubation to address real-world challenges.
              </p>
            </div>

            {/* Premium Full-Bleed Rectangular Image Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl flex-grow group min-h-[340px]">
              {/* Full-bleed image fills entire card */}
              <img
                src="/OUTR website/images/statue.png"
                alt="OUTR Techno Campus Statue"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 select-none"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&fit=crop&q=85";
                }}
              />
              {/* Gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-accent/60 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-accent/60 rounded-tr-lg" />
              {/* Text overlay at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                <h3 className="font-serif font-black text-xl text-white leading-tight">Techno Campus Statue</h3>
                <div className="w-10 h-0.5 bg-accent my-2" />
                <p className="text-blue-100 text-[11px] font-semibold leading-relaxed">
                  Symbol of wisdom, perseverance &amp; technical excellence - Kalinga Nagar, Bhubaneswar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 6. VISION & MISSION PAGE
export function VisionMissionPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 animate-fade-in select-none">
      {/* Page Hero */}
      <div className="relative bg-[#0b3c5d] py-16 px-6 text-center shadow-lg border-b-4 border-[#d4af37] mb-12">
        <h1 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight">
          Vision &amp; <span className="text-accent">Mission</span>
        </h1>
        <p className="text-white/85 text-xs sm:text-sm font-medium max-w-2xl mx-auto mt-4 leading-relaxed">
          Guiding principles driving the educational ecosystem and academic pursuits at OUTR.
        </p>
        <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
        {/* Vision Card */}
        <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-3xl shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="w-24 h-24 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center flex-shrink-0 shadow-inner border border-amber-100/50">
            <Eye className="w-10 h-10 text-amber-800" />
          </div>
          <div className="space-y-3">
            <h2 className="font-serif text-2xl font-black text-primary">Our Vision</h2>
            <p className="text-slate-800 text-sm md:text-base leading-relaxed font-semibold max-w-3xl">
              To be a leading University that fosters knowledge, provides transformative education, and promotes extraordinary research while creating technocrats and innovators to solve real-world challenges.
            </p>
          </div>
        </div>

        {/* Mission Card */}
        <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-3xl shadow-sm flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 rounded-2xl bg-blue-50 text-primary flex items-center justify-center flex-shrink-0 shadow-inner border border-blue-100/50">
            <Target className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-6 flex-grow">
            <h2 className="font-serif text-2xl font-black text-primary">Our Mission Milestones</h2>
            <ul className="space-y-4">
              {[
                "To create ideators and leaders to develop human resources equipped with creativity, technology and passion for the betterment of humankind by providing an appropriate and conducive ambience.",
                "To provide an education that transforms students through innovative, relevant, and appropriate coursework and makes them future-ready.",
                "To address problems faced by the society through nurturing talent and carrying out purposeful, original research.",
                "To collaborate with other academic institutes, research organizations, and industries across the globe to strengthen the education and research ecosystem.",
                "To encourage teamwork through the development of harmony, tolerance, and active co-operation."
              ].map((milestone, idx) => (
                <li key={idx} className="flex gap-3 text-slate-800 text-sm font-semibold leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2"></span>
                  <span>{milestone}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// 7. LOCATION PAGE
export function LocationPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-16 animate-fade-in select-none">
      {/* Page Hero */}
      <div className="relative bg-[#0b3c5d] py-16 px-6 text-center shadow-lg border-b-4 border-[#d4af37] mb-12">
        <h1 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight">
          Reach <span className="text-accent">OUTR</span>
        </h1>
        <p className="text-white/85 text-xs sm:text-sm font-medium max-w-2xl mx-auto mt-4 leading-relaxed">
          Techno Campus geographic parameters, accessibility routes, and connectivity guides.
        </p>
        <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Intro Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch text-left">
          <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm flex flex-col justify-between border-l-4 border-l-accent">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-primary mb-2">Campus Location Overview</h2>
              <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                Odisha University of Technology and Research (OUTR), Bhubaneswar, is one of Odisha’s leading technical institutions. The campus is well-connected by road, rail, and air transport, ensuring easy accessibility for students, researchers, parents, and global delegates.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed font-semibold">
                Situated in the sprawling educational hub of Ghatikia (Kalinga Nagar), Bhubaneswar, the campus spreads over 100 acres of meticulously nurtured lush green fields. It offers a state-of-the-art secure techno atmosphere.
              </p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl mt-6 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-accent shrink-0" />
              <p className="text-xs text-slate-500 font-bold">
                Techno Campus, Ghatikia, Mahalaxmi Vihar, Bhubaneswar, Odisha - 751029
              </p>
            </div>
          </div>

          {/* Campus Map Graphic */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl group min-h-[360px] bg-slate-100">
            {/* Full-bleed Odisha map image */}
            <img
              src="/OUTR website/images/MAPf.jpg"
              alt="Odisha State Map showing OUTR location"
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 select-none"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&fit=crop&q=80";
              }}
            />
            {/* Subtle gradient overlay to anchor the label */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
            {/* Corner accent */}
            <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-accent/70 rounded-tr-lg" />
            <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-accent/70 rounded-tl-lg" />
            {/* Location pin badge */}
            <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3">
              <MapPin className="w-6 h-6 text-accent shrink-0" />
              <div>
                <p className="text-white font-black text-xs leading-tight">OUTR - Bhubaneswar</p>
                <p className="text-blue-100 text-[10px] font-semibold mt-0.5">Techno Campus, Kalinga Nagar, Odisha</p>
              </div>
            </div>
          </div>
        </div>

        {/* Access methods */}
        <div className="space-y-6 text-left">
          <h2 className="font-serif text-2xl font-bold text-primary">Connectivity Vectors</h2>
          <div className="w-12 h-1 bg-accent rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-primary flex items-center justify-center">
                <Bus className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary">Nearest Bus Stand</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Baramunda Bus Stand is approximately 5 km from the campus, providing regular intrastate and interstate connectivity. 
              </p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-accent flex items-center justify-center">
                <Train className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary">Nearest Railway Station</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Bhubaneswar Railway Station (Master Canteen) is around 10 to 12 km away, connecting BBSR with all major national lines.
              </p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Plane className="w-5 h-5 text-emerald-700" />
              </div>
              <h3 className="font-serif text-lg font-bold text-primary">Nearest Airport</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Biju Patnaik International Airport (BBI) is approximately 8 km from the campus, serving direct daily domestic and international flights.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

// 8. AR COMMITTEE (ACADEMIC COUNCIL)
export function ARCommittee() {
  const members = [
    { name: "Dr. Aruna Tripathy", role: "Professor, Department of Electronics & Instrumentation Engineering and PIC, Accreditation and Ranking", tag: "Chairperson", photo: "/administration/admin_Arcommitee_photo/image.png" },
    { name: "Mr. Bishnu Narayan Mahapatra", role: "Assistant Professor, Department of Mechanical Engineering", tag: "Member", photo: "/administration/admin_Arcommitee_photo/image copy.png" },
    { name: "Mr. Santanu Sen", role: "Assistant Professor & Head, Department of EE", tag: "Member", photo: "/administration/admin_Arcommitee_photo/image copy 2.png" },
    { name: "Mrs Ananya Dastidar", role: "Assistant Professor, Department of Electronics & Instrumentation Engineering", tag: "Member", photo: "/administration/admin_Arcommitee_photo/image copy 2.png" },
    { name: "Mrs. Rosalin Dalai", role: "Assistant Professor, Department of Civil Engg.", tag: "Member", photo: "/administration/admin_Arcommitee_photo/image copy 2.png" },
    { name: "Mrs. Swapna Sarita Swain", role: "Assistant Professor & Head, Department of Planning", tag: "Member", photo: "/administration/admin_Arcommitee_photo/image copy 2.png" }
  ]

  return (
    <div className="bg-slate-50 min-h-screen py-16 animate-fade-in select-none">
      {/* Header */}
      <div className="relative bg-[#0b3c5d] py-16 px-6 text-center shadow-lg border-b-4 border-[#d4af37] mb-12">
        <h1 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight">
          Accreditation &amp; Ranking Committee
        </h1>
        <p className="text-white/85 text-xs sm:text-sm font-medium max-w-2xl mx-auto mt-4 leading-relaxed font-sans">
          The Accreditation and Ranking (A&amp;R) Committee deals with comprehensive assessment, governance tracking, and standard validations of the University as a whole.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
        <h2 className="font-serif text-2xl font-bold text-primary">Committee Members</h2>
        <div className="w-12 h-1 bg-accent rounded"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {members.map((m, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-accent/40 transition-all duration-300">
              <div className={`h-1.5 ${m.tag === 'Chairperson' ? 'bg-accent' : 'bg-primary'}`}></div>
              <div className="h-64 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                {m.tag === 'Chairperson' && <span className="absolute top-3 right-3 bg-accent text-primary text-[9px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase z-10 shadow-sm">Chairperson</span>}
                <img 
                  src={m.photo} 
                  alt={m.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z'/%3E%3C/svg%3E";
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

// 9. LEGAL & GRIEVANCE COMMITTEE
export function LegalCommittee() {
  const members = [
    { name: "Registrar", role: "OUTR University Administration", tag: "Chairman", photo: "/administration/admin_Lcommitee_photo/image copy 2.png" },
    { name: "Dr. Pramod Kumar Parida", role: "Professor, ME", tag: "Member", photo: "/administration/admin_Lcommitee_photo/image.png" },
    { name: "Dr. Ranjan Kumar Jana", role: "Professor, EE", tag: "Member", photo: "/administration/admin_Lcommitee_photo/image copy 2.png" },
    { name: "Dr. Tapas Kumar Patra", role: "Professor, I & E", tag: "Member", photo: "/administration/admin_Lcommitee_photo/image copy 2.png" },
    { name: "Mr. Neelakantha Guru", role: "Asst. Professor, EE", tag: "Coordinator", photo: "/administration/admin_Lcommitee_photo/image copy 2.png" }
  ]

  return (
    <div className="bg-slate-50 min-h-screen py-16 animate-fade-in select-none">
      {/* Header */}
      <div className="relative bg-[#0b3c5d] py-16 px-6 text-center shadow-lg border-b-4 border-[#d4af37] mb-12">
        <h1 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight">
          Legal &amp; Grievance Committee
        </h1>
        <p className="text-white/85 text-xs sm:text-sm font-medium max-w-2xl mx-auto mt-4 leading-relaxed font-sans">
          Formed to ensure smooth management of legal cases, student grievance resolutions, and official legal counsel for the University.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-left">
        <h2 className="font-serif text-2xl font-bold text-primary">Committee Members</h2>
        <div className="w-12 h-1 bg-accent rounded"></div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {members.map((m, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-accent/40 transition-all duration-300">
              <div className={`h-1.5 ${m.tag === 'Chairman' ? 'bg-accent' : 'bg-primary'}`}></div>
              <div className="h-64 bg-slate-50 relative overflow-hidden flex items-center justify-center">
                {m.tag === 'Chairman' && <span className="absolute top-3 right-3 bg-accent text-primary text-[9px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase z-10 shadow-sm">Chairman</span>}
                <img 
                  src={m.photo} 
                  alt={m.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394a3b8'%3E%3Ccircle cx='12' cy='8' r='4'/%3E%3Cpath d='M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z'/%3E%3C/svg%3E";
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
