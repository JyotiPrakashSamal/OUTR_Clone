/* eslint-disable no-empty */
import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { 
  GraduationCap, Key, FileText, Landmark, BookOpen, Scale, Settings, 
  Zap, AlertTriangle, Check, Eye, EyeOff, Lock, UserCheck, ShieldAlert 
} from 'lucide-react'

const capitalizeName = (name) => {
  if (!name) return ''
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function AuthPortal({ onLoginSuccess, initialRole }) {
  const [selectedRole, setSelectedRole] = useState(initialRole || null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [logoClicks, setLogoClicks] = useState(0)
  const [showDevShortcuts, setShowDevShortcuts] = useState(false)

  const handleLogoClick = () => {
    const clicks = logoClicks + 1
    setLogoClicks(clicks)
    if (clicks === 5) {
      setShowDevShortcuts(true)
    }
  }

  // University Roles list using Lucide icons
  const roles = [
    { id: 'student', title: 'Student Result Portal', icon: GraduationCap, desc: 'View academic grades & track clearance files.' },
    { id: 'warden', title: 'Hostel Warden Portal', icon: Key, desc: 'Allocate rooms & register checked-in students.' },
    { id: 'adviser', title: 'Faculty Advisor Desk', icon: FileText, desc: 'First level department review of student clearances.' },
    { id: 'hos', title: 'Head of School (HoS)', icon: Landmark, desc: 'Verify reviews & choose clearance forwarding route.' },
    { id: 'dean_academic', title: 'Dean Academic Desk', icon: BookOpen, desc: 'Review & approve academic syllabus clearances.' },
    { id: 'dean_pga', title: 'Dean PGA Desk', icon: GraduationCap, desc: 'Review & approve post-graduate clearances.' },
    { id: 'controller', title: 'Exam Controller Desk', icon: Scale, desc: 'Verify clearance certificates & release clearings.' },
    { id: 'admin', title: 'Super Admin Control', icon: Settings, desc: 'System administrator account provisioning desk.' },
  ]

  const handleBack = () => {
    setSelectedRole(null)
    setEmail('')
    setPassword('')
    setErrorMsg('')
    setSuccessMsg('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      // Normal Cloud Database Auth Sign-in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) throw error

      // Check if user profile matches the selected role in our Postgres Profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile) {
        // Fallback check on Auth User raw user_metadata in case profile sync was delayed
        const userMetadataRole = data.user.user_metadata?.role
        if (userMetadataRole !== selectedRole) {
          throw new Error(`Access denied. Your account does not have authorization for the ${selectedRole.toUpperCase()} desk.`)
        }
      } else if (profile.role !== selectedRole) {
        throw new Error(`Access denied. Your account is registered as a ${profile.role}, not a ${selectedRole}.`)
      }

      setSuccessMsg(`Welcome back, ${capitalizeName(profile?.name) || data.user.email}! Redirecting to dashboard...`)
      
      const profileWithEmail = {
        ...(profile || { role: selectedRole }),
        email: data.user.email
      }

      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(selectedRole, profileWithEmail)
        }
      }, 300)

    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.')
      // Immediate clean logout if token authentication succeeded but role authorization failed
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          await supabase.auth.signOut()
        }
      } catch {}
    } finally {
      setLoading(false)
    }
  }

  // Developer Fast Presets Auto-filler
  const handleQuickSeed = (roleId) => {
    setSelectedRole(roleId)
    setErrorMsg('')
    setSuccessMsg('')
    if (roleId === 'student') {
      setEmail('2201011@outr.ac.in')
      setPassword('SecureStudent#2026')
    } else if (roleId === 'admin') {
      setEmail('admin.desk@outr.ac.in')
      setPassword('SecureAdmin#2026')
    } else if (roleId === 'warden') {
      setEmail('warden.desk@outr.ac.in')
      setPassword('SecureWarden#2026')
    } else if (roleId === 'adviser') {
      setEmail('adviser.desk@outr.ac.in')
      setPassword('SecureAdviser#2026')
    } else if (roleId === 'hos') {
      setEmail('hos.desk@outr.ac.in')
      setPassword('SecureHos#2026')
    } else if (roleId === 'dean_academic') {
      setEmail('deanacad.desk@outr.ac.in')
      setPassword('SecureDean#2026')
    } else if (roleId === 'dean_pga') {
      setEmail('deanpga.desk@outr.ac.in')
      setPassword('SecureDean#2026')
    } else if (roleId === 'controller') {
      setEmail('controller.desk@outr.ac.in')
      setPassword('SecureController#2026')
    } else {
      setEmail('')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-bg font-sans flex flex-col justify-between select-none animate-fade-in">
      {/* Top Utility Banner */}
      <div className="bg-primary text-[11px] text-white/80 py-2.5 px-6 flex justify-between items-center border-b border-white/10 shadow-sm">
        <div>Odisha University of Technology and Research - Academic Portal</div>
        <div className="flex gap-4 items-center">
          <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-[#d4af37]" /> SSL Encrypted Access</span>
          <span>Bhubaneswar</span>
        </div>
      </div>

      {/* Main Login Card container */}
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-100/50 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          
          {/* Left branding layout column */}
          <div className="md:w-5/12 bg-primary p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden text-left">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(31,90,138,0.4),transparent)]"></div>
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-0.5 shadow-sm active:scale-95 transition-transform duration-200 cursor-pointer">
                <img 
                  src="/OUTR website/images/outrLogo.png" 
                  alt="OUTR Logo" 
                  onClick={handleLogoClick}
                  className="w-full h-full object-contain select-none"
                  title="OUTR Shield Services"
                />
              </div>
              <span className="font-serif font-bold text-lg tracking-wide select-none">OUTR Portal</span>
            </div>

            <div className="relative z-10 my-8 select-none">
              <h2 className="font-serif text-3xl font-bold leading-tight mb-4">
                Secure Unified <br />
                Authentication
              </h2>
              <p className="text-white/70 text-xs leading-relaxed">
                Log in to access your customized academic desk, hostel details, or administrative approval pipeline.
              </p>
            </div>

            {showDevShortcuts && (
              <div className="relative z-10 p-3.5 bg-slate-900/40 border border-white/10 rounded-2xl text-[9px] space-y-1.5 animate-fade-in">
                <div className="font-bold text-accent uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#d4af37]" /> Developer Quick Seed Logins
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button onClick={() => handleQuickSeed('student')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer text-[9px] text-white">Student Desk</button>
                  <button onClick={() => handleQuickSeed('admin')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer text-[9px] text-white">Super Admin</button>
                  <button onClick={() => handleQuickSeed('warden')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer text-[9px] text-white">Warden Desk</button>
                  <button onClick={() => handleQuickSeed('adviser')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer text-[9px] text-white">Advisor Desk</button>
                  <button onClick={() => handleQuickSeed('hos')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer text-[9px] text-white">HoS Desk</button>
                  <button onClick={() => handleQuickSeed('dean_academic')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer text-[9px] text-white">Dean Academic</button>
                  <button onClick={() => handleQuickSeed('dean_pga')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer text-[9px] text-white">Dean PGA</button>
                  <button onClick={() => handleQuickSeed('controller')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer text-[9px] text-white">Controller</button>
                </div>
                <div className="text-white/40 text-[8px] pt-1">Bypasses Supabase cloud blocks for fast local testing.</div>
              </div>
            )}
          </div>

          {/* Right form submission column */}
          <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white/50">
            
            {!selectedRole ? (
              // Step 1: Role Selection
              <div className="animate-fade-in text-left">
                <h3 className="font-serif text-2xl font-bold text-primary mb-1">Select Your Desk</h3>
                <p className="text-muted text-sm mb-6">Choose your authorized role to access the portal dashboard.</p>
                
                <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                  {roles.map((role) => {
                    const IconComponent = role.icon;
                    return (
                      <button
                        key={role.id}
                        onClick={() => setSelectedRole(role.id)}
                        className="w-full text-left p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-[#d4af37]/45 hover:shadow-md hover:shadow-slate-100 flex items-center gap-4 transition-all duration-300 group cursor-pointer"
                      >
                        <span className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-[#0b3c5d]/5 transition-all duration-300">
                          <IconComponent className="w-5 h-5 text-[#0b3c5d] group-hover:text-[#d4af37] transition-colors" />
                        </span>
                        <div className="flex-grow">
                          <h4 className="font-semibold text-primary text-xs group-hover:text-[#d4af37] transition-colors leading-none">{role.title}</h4>
                          <p className="text-[10.5px] text-muted mt-1 leading-normal">{role.desc}</p>
                        </div>
                        <span className="text-slate-300 group-hover:text-[#d4af37] font-semibold text-sm transition-all duration-300">→</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              // Step 2: Credentials Form
              <div className="animate-fade-in text-left">
                {/* Back button */}
                <button 
                  onClick={handleBack}
                  className="text-xs text-secondary hover:text-primary font-semibold flex items-center gap-1 mb-6 transition-colors cursor-pointer border-none bg-transparent"
                >
                  ← Back to Desks
                </button>

                <div className="mb-6">
                  <span className="text-[10px] uppercase font-bold text-accent tracking-widest pl-0.5">
                    {selectedRole.replace('_', ' ').toUpperCase()} DESK
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-primary mt-0.5">
                    Secure Authenticate
                  </h3>
                  <p className="text-muted text-xs font-medium mt-1">
                    Please log in using your university-provided credentials.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs leading-normal mb-5 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Success Banner */}
                {successMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs leading-normal mb-5 animate-pulse flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-primary uppercase mb-1.5 pl-0.5">University Email</label>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={selectedRole === 'student' ? 'e.g. 25240012@outr.ac.in' : `e.g. ${selectedRole}@outr.ac.in`}
                      className="input-standard"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary uppercase mb-1.5 pl-0.5">Secure Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-standard pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary border-none bg-transparent cursor-pointer select-none flex items-center justify-center p-1 rounded-lg hover:bg-slate-50 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-brand-primary w-full py-3.5 flex items-center justify-center"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      <span className="flex items-center gap-1.5"><UserCheck className="w-4 h-4" /> Authenticate Securely</span>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                  <span>Notice: Public registrations are disabled. For credentials, contact the Super Admin.</span>
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-slate-200/60 bg-white/50 text-center text-xs text-muted select-text">
        <div>&copy; {new Date().getFullYear()} Odisha University of Technology and Research. All Rights Reserved.</div>
        <div className="mt-1 text-slate-400">Security Standard: Supabase Auth v2 (Bcrypt Hashed)</div>
      </footer>
    </div>
  )
}
