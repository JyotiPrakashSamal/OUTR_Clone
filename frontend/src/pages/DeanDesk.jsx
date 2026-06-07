import { useState, useEffect } from 'react'

export default function DeanDesk() {
  const [lang, setLang] = useState(() => localStorage.getItem('selectedLanguage') || 'en')

  useEffect(() => {
    const handleStorageChange = () => {
      setLang(localStorage.getItem('selectedLanguage') || 'en')
    }
    window.addEventListener('storage', handleStorageChange)
    const interval = setInterval(handleStorageChange, 1000)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const t = {
    en: {
      title: "Deans of Faculties & Schools",
      subtitle: "Academic leadership driving excellence and innovation at OUTR, Bhubaneswar.",
      breadcrumbHome: "Home",
      breadcrumbAdmin: "Administration",
      breadcrumbDeans: "Deans",
      emailLabel: "Email Address",
      "Dean, Faculty and Planning": "Dean, Faculty and Planning",
      "Dean, Sponsored Research & Industrial Consultancy": "Dean, Sponsored Research & Industrial Consultancy",
      "Dean, Post Graduate Studies & Research": "Dean, Post Graduate Studies & Research",
      "Dean, Students Welfare": "Dean, Students Welfare",
      "Dean, Centre for Distance & Continuing Education": "Dean, Centre for Distance & Continuing Education",
      "Dean, Academic Affairs": "Dean, Academic Affairs",
      "Professor, Mechanical Engineering": "Professor, Mechanical Engineering",
      "Professor, Electrical Engineering": "Professor, Electrical Engineering",
      "Professor, Electronics & Instrumentation Engineering": "Professor, Electronics & Instrumentation Engineering",
      "Professor, Computer Science & Application": "Professor, Computer Science & Application"
    },
    hi: {
      title: "संकायों और स्कूलों के डीन",
      subtitle: "ओयूटीआर, भुवनेश्वर में अकादमिक नेतृत्व उत्कृष्टता और नवाचार को बढ़ावा देता है।",
      breadcrumbHome: "मुख्य पृष्ठ",
      breadcrumbAdmin: "प्रशासन",
      breadcrumbDeans: "डीन",
      emailLabel: "ईमेल पता",
      "Dean, Faculty and Planning": "डीन, संकाय और योजना",
      "Dean, Sponsored Research & Industrial Consultancy": "डीन, प्रायोजित अनुसंधान और औद्योगिक परामर्श",
      "Dean, Post Graduate Studies & Research": "डीन, स्नातकोत्तर अध्ययन और अनुसंधान",
      "Dean, Students Welfare": "डीन, छात्र कल्याण",
      "Dean, Centre for Distance & Continuing Education": "डीन, दूरस्थ और सतत शिक्षा केंद्र",
      "Dean, Academic Affairs": "डीन, शैक्षणिक मामले",
      "Professor, Mechanical Engineering": "प्रोफेसर, मैकेनिकल इंजीनियरिंग",
      "Professor, Electrical Engineering": "प्रोफेसर, इलेक्ट्रिकल इंजीनियरिंग",
      "Professor, Electronics & Instrumentation Engineering": "प्रोफेसर, इलेक्ट्रॉनिक्स और इंस्ट्रूमेंटेशन इंजीनियरिंग",
      "Professor, Computer Science & Application": "प्रोफेसर, कंप्यूटर विज्ञान और अनुप्रयोग"
    },
    od: {
      title: "ଫ୍ୟାକଲ୍ଟି ଏବଂ ସ୍କୁଲର ଡିନ୍‌",
      subtitle: "ଓୟୁଟିଆର୍, ଭୁବନେଶ୍ୱରରେ ଉତ୍କୃଷ୍ଟତା ଏବଂ ନୂତନତ୍ୱକୁ ଆଗେଇ ନେଉଥିବା ଏକାଡେମିକ୍ ନେତୃତ୍ୱ |",
      breadcrumbHome: "ମୁଖ୍ୟ ପୃଷ୍ଠା",
      breadcrumbAdmin: "ପ୍ରଶାସନ",
      breadcrumbDeans: "ଡିନ୍",
      emailLabel: "ଇମେଲ୍ ଠିକଣା",
      "Dean, Faculty and Planning": "ଡିନ୍, ଫ୍ୟାକଲ୍ଟି ଏବଂ ଯୋଜନା",
      "Dean, Sponsored Research & Industrial Consultancy": "ଡିନ୍, ପ୍ରାୟୋଜିତ ଅନୁସନ୍ଧାନ ଏବଂ ଶିଳ୍ପ ପରାମର୍ଶ",
      "Dean, Post Graduate Studies & Research": "ଡିନ୍, ସ୍ନାତକୋତ୍ତର ଅଧ୍ୟୟନ ଏବଂ ଅନୁସନ୍ଧାନ",
      "Dean, Students Welfare": "ଡିନ୍, ଛାତ୍ର କଲ୍ୟାଣ",
      "Dean, Centre for Distance & Continuing Education": "ଡିନ୍, ଦୂରନିରନ୍ତର ଶିକ୍ଷା କେନ୍ଦ୍ର",
      "Dean, Academic Affairs": "ଡିନ୍, ଶିକ୍ଷାଗତ ବ୍ୟାପାର",
      "Professor, Mechanical Engineering": "ପ୍ରଫେସର, ମେକାନିକାଲ୍ ଇଞ୍ଜିନିୟରିଂ",
      "Professor, Electrical Engineering": "ପ୍ରଫେସର, ଇଲେକ୍ଟ୍ରିକାଲ୍ ଇଞ୍ଜିନିୟରିଂ",
      "Professor, Electronics & Instrumentation Engineering": "ପ୍ରଫେସର, ଇଲେକ୍ଟ୍ରୋନିକ୍ସ ଏବଂ ଇନଷ୍ଟ୍ରୁମେଣ୍ଟେସନ ଇଞ୍ଜିନିୟରିଂ",
      "Professor, Computer Science & Application": "ପ୍ରଫେସର, କମ୍ପ୍ୟୁଟର ବିଜ୍ଞାନ ଏବଂ ପ୍ରୟୋଗ"
    }
  }

  const localized = t[lang] || t.en

  const deans = [
    {
      name: "Dr. Pramod K. Parida",
      role: "Dean, Faculty and Planning",
      dept: "Professor, Mechanical Engineering",
      email: "pkparida@outr.ac.in",
      photo: "/administration/admin-module-photo/PKP-removebg-preview.jpg",
      initial: "P"
    },
    {
      name: "Prof. Ajit Kumar Barisal",
      role: "Dean, Sponsored Research & Industrial Consultancy",
      dept: "Professor, Electrical Engineering",
      email: "akbarisal@outr.ac.in",
      photo: "/administration/admin-module-photo/AKB.jpg",
      initial: "A"
    },
    {
      name: "Prof. Aruna Tripathy",
      role: "Dean, Post Graduate Studies & Research",
      dept: "Professor, Electronics & Instrumentation Engineering",
      email: "atripathy@outr.ac.in",
      photo: "/administration/admin-module-photo/AT-removebg-preview.png",
      initial: "A"
    },
    {
      name: "Prof. Jibitesh Mishra",
      role: "Dean, Students Welfare",
      dept: "Professor, Computer Science & Application",
      email: "jmishra@outr.ac.in",
      photo: "/administration/admin-module-photo/J_Mishra-removebg-preview_2.png",
      initial: "J"
    },
    {
      name: "Prof. Tapas Kumar Patra",
      role: "Dean, Centre for Distance & Continuing Education",
      dept: "Professor, Electronics & Instrumentation Engineering",
      email: "tkpatra@outr.ac.in",
      photo: "/administration/admin-module-photo/TKP-removebg-preview.jpg",
      initial: "T"
    },
    {
      name: "Prof. Ranjan Kumar Jena",
      role: "Dean, Academic Affairs",
      dept: "Professor, Electrical Engineering",
      email: "rkjena@outr.ac.in",
      photo: "/administration/admin-module-photo/Ranjan Kumar Jena_1.jpg",
      initial: "R"
    }
  ]

  return (
    <div className="bg-slate-50 min-h-screen py-16 animate-fade-in select-none">
      {/* Page Hero */}
      <div className="relative bg-gradient-to-r from-primary to-secondary py-16 px-6 text-center shadow-lg border-b-4 border-accent mb-12">
        <h1 className="font-serif text-3xl md:text-5xl font-black text-white leading-tight">
          {localized.title}
        </h1>
        <p className="text-white/85 text-xs sm:text-sm font-medium max-w-2xl mx-auto mt-4 leading-relaxed">
          {localized.subtitle}
        </p>
        <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded"></div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 mb-8 text-xs font-semibold text-slate-400 flex gap-2 items-center">
        <span className="text-secondary cursor-pointer hover:underline">{localized.breadcrumbHome}</span>
        <span>&gt;</span>
        <span className="text-secondary cursor-pointer hover:underline">{localized.breadcrumbAdmin}</span>
        <span>&gt;</span>
        <span className="text-slate-600 font-bold">{localized.breadcrumbDeans}</span>
      </div>

      {/* Deans Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {deans.map((d, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-accent/40 transition-all duration-300">
              <div className="h-1.5 bg-primary"></div>
              
              <div className="h-72 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                <img 
                  src={d.photo} 
                  alt={d.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&fit=crop&q=60`;
                  }}
                />
              </div>

              <div className="p-6 text-left flex flex-col justify-between flex-grow">
                <div>
                  <span className="inline-block text-[9px] font-bold tracking-wider px-2.5 py-1 bg-primary/10 text-primary border-l-2 border-accent rounded-md uppercase mb-3">
                    {localized[d.role] || d.role}
                  </span>
                  <h3 className="font-serif font-bold text-primary text-xl mb-1.5">{d.name}</h3>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    {localized[d.dept] || d.dept}
                  </p>
                </div>
                
                <div className="border-t border-slate-100 mt-6 pt-4">
                  <a 
                    href={`mailto:${d.email}`} 
                    className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors border-b-2 border-accent pb-0.5"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    {d.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
