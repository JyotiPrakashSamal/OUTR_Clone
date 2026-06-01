import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { createClient } from '@supabase/supabase-js'
import Layout from '../components/Layout'

// Initialize secondary client that DOES NOT persist or overwrite local storage session!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const provisionClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
})

const capitalizeName = (name) => {
  if (!name) return ''
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function AdminDashboard({ onSignOut, onNavigate, sessionUser }) {
  const [adminProfile, setAdminProfile] = useState(sessionUser)
  const [profiles, setProfiles] = useState([])
  const [loadingProfiles, setLoadingProfiles] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Form State
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedRole, setSelectedRole] = useState('student')
  const [schoolId, setSchoolId] = useState('SCS')
  const [regdNo, setRegdNo] = useState('')
  const [provisioning, setProvisioning] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleRoleChange = (role) => {
    setSelectedRole(role)
    if (role === 'warden') {
      setSchoolId('APJKHR') // default hostel
    } else if (role === 'student' || role === 'adviser' || role === 'hos') {
      setSchoolId('SCS') // default academic school
    } else {
      setSchoolId('') // Dean/Controller/Admin
    }
    setRegdNo('')
  }

  const handleRegdNoChange = (val) => {
    setRegdNo(val)
    if (val) {
      setEmail(`${val.trim()}@outr.ac.in`)
    } else {
      setEmail('')
    }
  }

  useEffect(() => {
    if (sessionUser) {
      setAdminProfile(sessionUser)
    }
    fetchAllProfiles()
  }, [sessionUser])

  async function fetchAllProfiles() {
    setLoadingProfiles(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setProfiles(data || [])
    } catch (err) {
      console.warn('Could not load database profiles:', err.message)
      setErrorMsg('Failed to load registered accounts from the database.')
    } finally {
      setLoadingProfiles(false)
    }
  }

  const handleProvisionUser = async (e) => {
    e.preventDefault()
    setProvisioning(true)
    setErrorMsg('')
    setSuccessMsg('')

    try {
      // 1. Create standard Auth User via secondary provisionClient to protect current Super Admin Session
      const { data, error } = await provisionClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: selectedRole,
            school_id: schoolId
          }
        }
      })

      if (error) throw error



      setSuccessMsg(`User account successfully provisioned for ${name} as ${selectedRole.toUpperCase()}!`)
      setName('')
      setEmail('')
      setPassword('')
      setRegdNo('')
      
      // Refresh registry list
      await fetchAllProfiles()
    } catch (err) {
      console.error('Provisioning error:', err)
      setErrorMsg(`Failed to provision user: ${err.message}`)
    } finally {
      setProvisioning(false)
    }
  }

  const filteredProfiles = profiles.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.school_id?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Layout onNavigate={onNavigate} transparentOnTop={false}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Dashboard Header */}
        <div className="bg-white/80 border border-slate-200/80 backdrop-blur-md rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-accent/20">
              <span className="text-3xl">⚙️</span>
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">OUTR Core Registry</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mt-1">Super Admin Console</h2>
              <p className="text-xs text-muted font-medium mt-1">
                Authorized Super Admin: <span className="font-semibold text-primary">{capitalizeName(adminProfile?.name)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="px-6 py-2.5 bg-rose-50 border border-rose-100 hover:bg-rose-100/50 text-rose-700 font-bold text-xs rounded-xl shadow-sm transition-all duration-300 cursor-pointer"
          >
            🚪 Sign Out of Admin Desk
          </button>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Column 1: Provisioning Form (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200/85 rounded-3xl p-6 shadow-sm">
              <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-1">Provisioning Desk</span>
              <h3 className="font-serif text-xl font-bold text-primary mb-4">Create New Account</h3>
              
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl mb-4 text-xs font-semibold">
                  ⚠️ {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl mb-4 text-xs font-semibold">
                  ✅ {successMsg}
                </div>
              )}

              <form onSubmit={handleProvisionUser} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1">Full Name</label>
                  <input 
                    type="text" required 
                    placeholder={
                      selectedRole === 'student' ? 'e.g. Name' :
                      selectedRole === 'hos' ? 'e.g. HoS Name' :
                      selectedRole === 'adviser' ? 'e.g. Advisor Name' :
                      selectedRole === 'warden' ? 'e.g. Warden Name' :
                      selectedRole === 'controller' ? 'e.g. Controller Name' :
                      selectedRole?.startsWith('dean_') ? 'e.g. Dean Name' :
                      'e.g. Name'
                    }
                    value={name} onChange={(e) => setName(e.target.value)}
                    className="input-standard text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1">University Email</label>
                  <input 
                    type="email" required placeholder="e.g. registrar@outr.ac.in"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="input-standard text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-primary uppercase mb-1">Secure Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} required placeholder="••••••••" minLength="6"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="input-standard pl-4 pr-12 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary border-none bg-transparent cursor-pointer select-none flex items-center justify-center p-1 rounded-lg hover:bg-slate-50 transition-colors"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-primary uppercase mb-1">System Role</label>
                    <select 
                      value={selectedRole} onChange={(e) => handleRoleChange(e.target.value)}
                      className="input-standard text-xs font-semibold text-primary"
                    >
                      <option value="student">Student</option>
                      <option value="warden">Hostel Warden</option>
                      <option value="adviser">Faculty Advisor</option>
                      <option value="hos">Head of School (HoS)</option>
                      <option value="dean_academic">Dean Academic</option>
                      <option value="dean_pga">Dean PGA</option>
                      <option value="controller">Exam Controller</option>
                      <option value="admin">Super Admin</option>
                    </select>
                  </div>

                  {selectedRole === 'warden' ? (
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase mb-1">Assigned Hostel</label>
                      <select 
                        value={schoolId} onChange={(e) => setSchoolId(e.target.value)}
                        className="input-standard text-xs font-semibold text-primary"
                      >
                        <option value="APJKHR">APJKHR (Kalam Hall)</option>
                        <option value="KHR">KHR (Kharavela Hall)</option>
                        <option value="RHR">RHR (Ramanujan Hall)</option>
                        <option value="KCHR">KCHR (Chawla Hall)</option>
                      </select>
                    </div>
                  ) : (selectedRole === 'student' || selectedRole === 'adviser' || selectedRole === 'hos') ? (
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase mb-1">School ID</label>
                      <select 
                        value={schoolId} onChange={(e) => setSchoolId(e.target.value)}
                        className="input-standard text-xs font-semibold text-primary"
                      >
                        <option value="SCS">SCS (Computer Sci)</option>
                        <option value="SMS">SMS (Mechanical)</option>
                        <option value="SIP">SIP (Civil/Infra)</option>
                        <option value="SEEC">SEEC (Electronics)</option>
                        <option value="SEEE">SEEE (Electrical)</option>
                        <option value="Biotech">Biotech Dept</option>
                        <option value="SBSH">SBSH (Humanities)</option>
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold text-primary uppercase mb-1">Affiliation ID</label>
                      <select 
                        value={schoolId} onChange={(e) => setSchoolId(e.target.value)}
                        className="input-standard text-xs font-semibold text-primary"
                      >
                        <option value="">Global / All</option>
                        <option value="SCS">SCS (Computer Sci)</option>
                        <option value="SMS">SMS (Mechanical)</option>
                        <option value="SIP">SIP (Civil/Infra)</option>
                        <option value="SEEC">SEEC (Electronics)</option>
                        <option value="SEEE">SEEE (Electrical)</option>
                        <option value="Biotech">Biotech Dept</option>
                        <option value="SBSH">SBSH (Humanities)</option>
                      </select>
                    </div>
                  )}
                </div>

                {selectedRole === 'student' && (
                  <div>
                    <label className="block text-[10px] font-bold text-primary uppercase mb-1">Student Registration Number</label>
                    <input 
                      type="text" required placeholder="e.g. 25240012"
                      value={regdNo} onChange={(e) => handleRegdNoChange(e.target.value)}
                      className="input-standard text-xs font-semibold"
                    />
                  </div>
                )}

                <button
                  type="submit" disabled={provisioning}
                  className="w-full btn-brand-primary py-3 text-xs disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  {provisioning ? 'Syncing with Supabase...' : 'Create Account & Sync Database'}
                </button>
              </form>
            </div>
          </div>

          {/* Column 2: User Registry Directory (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200/85 rounded-3xl p-6 shadow-sm flex flex-col min-h-[460px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest block mb-1">Core Database Directory</span>
                  <h3 className="font-serif text-xl font-bold text-primary">Registered Accounts</h3>
                </div>
                <input 
                  type="text" placeholder="Search registry..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-standard py-2 text-xs w-full sm:w-48"
                />
              </div>

              {loadingProfiles ? (
                <div className="flex-grow flex flex-col items-center justify-center py-20 space-y-4">
                  <span className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                  <span className="text-xs text-muted font-medium">Fetching verified records...</span>
                </div>
              ) : filteredProfiles.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-4xl mb-4">📭</span>
                  <span className="text-sm font-semibold text-primary">No matched users found</span>
                  <span className="text-xs text-muted mt-1">Try expanding your search query or provision a new one.</span>
                </div>
              ) : (
                <div className="flex-grow table-container-responsive">
                  <table className="table-brand text-xs">
                    <thead>
                      <tr className="table-brand-header text-[10px]">
                        <th className="pb-3 pl-2">Name</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Affiliation</th>
                        <th className="pb-3 pr-2 text-right">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProfiles.map((p) => (
                        <tr key={p.id} className="table-brand-row">
                          <td className="py-3 pl-2 font-bold text-[#0b3c5d]">{capitalizeName(p.name) || 'Anonymous User'}</td>
                          <td className="py-3 font-semibold">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              p.role === 'admin' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                              p.role === 'warden' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                              p.role === 'adviser' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                              p.role === 'hos' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                              p.role?.startsWith('dean_') ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                              p.role === 'controller' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                              'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}>
                              {p.role === 'adviser' ? 'ADVISOR' : p.role?.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 font-bold text-slate-500">{p.school_id || 'Global'}</td>
                          <td className="py-3 pr-2 text-right text-slate-400 font-medium">{new Date(p.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </Layout>
  )
}
