/* eslint-disable no-empty */
import { useState } from 'react'
import { supabase } from '../supabaseClient'

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

  // University Roles list (NO PUBLIC SIGNUP - ALL CREATED BY SUPER ADMIN)
  const roles = [
    { id: 'student', title: 'Student Result Portal', icon: '🎓', desc: 'View academic grades & track clearance files.' },
    { id: 'warden', title: 'Hostel Warden Portal', icon: '🔑', desc: 'Allocate rooms & register checked-in students.' },
    { id: 'adviser', title: 'Faculty Advisor Desk', icon: '📄', desc: 'First level department review of student clearances.' },
    { id: 'hos', title: 'Head of School (HoS)', icon: '🏛️', desc: 'Verify reviews & choose clearance forwarding route.' },
    { id: 'dean_academic', title: 'Dean Academic Desk', icon: '🏫', desc: 'Review & approve academic syllabus clearances.' },
    { id: 'dean_pga', title: 'Dean PGA Desk', icon: '📜', desc: 'Review & approve post-graduate clearances.' },
    { id: 'controller', title: 'Exam Controller Desk', icon: '⚖️', desc: 'Verify clearance certificates & release clearings.' },
    { id: 'admin', title: 'Super Admin Control', icon: '⚙️', desc: 'System administrator account provisioning desk.' },
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
        <div>Odisha University of Technology and Research — Academic Portal</div>
        <div className="flex gap-4">
          <span>🔒 SSL Encrypted Access</span>
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
              <div className="relative z-10 p-3 bg-white/5 border border-white/10 rounded-2xl text-[9px] space-y-1 animate-fade-in">
                <div className="font-bold text-accent uppercase tracking-wider mb-1">⚡ Developer Quick Seed Logins</div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button onClick={() => handleQuickSeed('student')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer">🎓 Student Desk</button>
                  <button onClick={() => handleQuickSeed('admin')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer">⚙️ Super Admin</button>
                  <button onClick={() => handleQuickSeed('warden')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer">🔑 Warden Desk</button>
                  <button onClick={() => handleQuickSeed('adviser')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer">📄 Advisor Desk</button>
                  <button onClick={() => handleQuickSeed('hos')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer">🏛️ HoS Desk</button>
                  <button onClick={() => handleQuickSeed('dean_academic')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer">🏫 Dean Academic</button>
                  <button onClick={() => handleQuickSeed('dean_pga')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer">📜 Dean PGA</button>
                  <button onClick={() => handleQuickSeed('controller')} className="p-1 rounded bg-white/10 hover:bg-[#d4af37]/20 border border-white/10 hover:border-[#d4af37]/30 transition-all font-semibold cursor-pointer">⚖️ Controller</button>
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
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className="w-full text-left p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-accent/40 hover:shadow-md hover:shadow-slate-100 flex items-center gap-4 transition-all duration-300 group cursor-pointer"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform duration-300">{role.icon}</span>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-primary text-xs group-hover:text-secondary transition-colors leading-none">{role.title}</h4>
                        <p className="text-[10.5px] text-muted mt-1 leading-normal">{role.desc}</p>
                      </div>
                      <span className="text-slate-300 group-hover:text-accent font-semibold text-sm transition-all duration-300">→</span>
                    </button>
                  ))}
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
                    {selectedRole.toUpperCase()} DESK
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
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs leading-normal mb-5">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {/* Success Banner */}
                {successMsg && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs leading-normal mb-5 animate-pulse">
                    ✅ {successMsg}
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
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-brand-primary w-full py-3.5"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : 'Authenticate Securely'}
                  </button>
                </form>

                <div className="mt-6 text-center text-[10px] text-slate-400 font-medium">
                  🔒 Notice: Public registrations have been disabled. If you do not have credentials, please contact the Super Admin Console.
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
