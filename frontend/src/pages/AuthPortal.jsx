import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function AuthPortal({ onLoginSuccess, initialRole }) {
  const [selectedRole, setSelectedRole] = useState(initialRole || null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // University Roles list
  const roles = [
    { id: 'student', title: 'Student Result Portal', icon: '🎓', desc: 'View academic results and manage details.' },
    { id: 'warden', title: 'Hostel Warden Portal', icon: '🔑', desc: 'Allocate rooms and oversee checked students.' },
    { id: 'adviser', title: 'Faculty Adviser', icon: '📄', desc: 'First level review of student files.' },
    { id: 'hos', title: 'Head of School (HoS)', icon: '🏛️', desc: 'Perform administrative school approvals.' },
    { id: 'controller', title: 'Exam Controller', icon: '⚖️', desc: 'Final release approvals and result publishing.' },
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        throw error
      }

      // Check if user profile matches the selected role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile) {
        // Fallback or custom metadata check if profile wasn't found immediately
        const userMetadataRole = data.user.user_metadata?.role
        if (userMetadataRole !== selectedRole) {
          await supabase.auth.signOut()
          throw new Error('Access denied. Your account does not have authorization for this role.')
        }
      } else if (profile.role !== selectedRole) {
        await supabase.auth.signOut()
        throw new Error(`Access denied. Your account is registered as a ${profile.role}, not a ${selectedRole}.`)
      }

      setSuccessMsg(`Welcome back, ${profile?.name || data.user.email}! Redirecting to dashboard...`)
      
      // Simulate dashboard redirection delay
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess(selectedRole, profile || { role: selectedRole })
        }
      }, 1000)

    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.')
      supabase.auth.signOut() // Guarantee session is cleared on mismatched role
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg font-sans flex flex-col justify-between select-none">
      {/* Top Banner */}
      <div className="bg-primary text-[11px] text-white/80 py-2.5 px-6 flex justify-between items-center border-b border-white/10 shadow-sm">
        <div>Odisha University of Technology and Research — Academic Portal</div>
        <div className="flex gap-4">
          <span>🔒 SSL Encrypted Access</span>
          <span>Bhubaneswar</span>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-100/50 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          
          {/* Left Decorative branding side */}
          <div className="md:w-5/12 bg-primary p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(31,90,138,0.4),transparent)]"></div>
            
            <div className="relative z-10 flex items-center gap-3">
              <img 
                src="https://outr.ac.in/public/uploads/logo_4.png" 
                alt="OUTR Logo" 
                className="w-10 h-10 object-contain invert brightness-200"
              />
              <span className="font-serif font-bold text-lg tracking-wide">OUTR Portal</span>
            </div>

            <div className="relative z-10 my-8">
              <h2 className="font-serif text-3xl font-bold leading-tight mb-4">
                Secure Unified <br />
                Authentication
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Log in to access your customized academic desk, hostel details, or administrative approval pipeline.
              </p>
            </div>

            <div className="relative z-10 text-[11px] text-white/50 border-t border-white/10 pt-4">
              Authorized access only. Activity log will be recorded under university audit guidelines.
            </div>
          </div>

          {/* Right form/selection side */}
          <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white/50">
            
            {!selectedRole ? (
              // Step 1: Role Selection
              <div className="animate-fade-in">
                <h3 className="font-serif text-2xl font-bold text-primary mb-1">Select Your Desk</h3>
                <p className="text-muted text-sm mb-6">Choose your authorized role to access the portal dashboard.</p>
                
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className="w-full text-left p-4 rounded-2xl border border-slate-200 bg-white hover:border-accent/40 hover:shadow-md hover:shadow-slate-100 flex items-center gap-4 transition-all duration-300 group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{role.icon}</span>
                      <div className="flex-grow">
                        <h4 className="font-semibold text-primary text-sm group-hover:text-secondary transition-colors">{role.title}</h4>
                        <p className="text-xs text-muted leading-normal mt-0.5">{role.desc}</p>
                      </div>
                      <span className="text-slate-300 group-hover:text-accent font-semibold text-base transition-all duration-300">→</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Step 2: Credentials Form
              <div className="animate-fade-in">
                {/* Back button */}
                <button 
                  onClick={handleBack}
                  className="text-xs text-secondary hover:text-primary font-semibold flex items-center gap-1 mb-6 transition-colors"
                >
                  ← Back to Desks
                </button>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">
                    {roles.find(r => r.id === selectedRole)?.icon}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-primary">
                    {roles.find(r => r.id === selectedRole)?.title}
                  </h3>
                </div>
                <p className="text-muted text-sm mb-6">
                  Please authenticate with your university credentials.
                </p>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs leading-normal mb-5 animate-shake">
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
                    <label className="block text-xs font-semibold text-primary mb-1.5">University Email</label>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. warden@outr.ac.in"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-primary mb-1.5">Secure Password</label>
                    <input 
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-secondary transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-primary hover:bg-secondary text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/10 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {loading ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : 'Authenticate Securely'}
                  </button>
                </form>
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
