import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import Layout from '../components/Layout'

export default function WardenDashboard({ onSignOut }) {
  const [warden, setWarden] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchedStudent, setSearchedStudent] = useState(null)
  const [searching, setSearching] = useState(false)
  const [stats, setStats] = useState({
    totalStudents: 0,
    occupiedRooms: 0,
    vacantRooms: 0,
    capacity: 560
  })

  // CRUD Operations states
  const [showAddForm, setShowAddForm] = useState(false)
  const [newStudent, setNewStudent] = useState({
    regd_no: '',
    name: '',
    hostel: '',
    room: '',
    email: '',
    phone: '',
    status: 'Active'
  })
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')

  // Load Warden Profile & Student Records
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // 1. Get authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          // Mock warden for local preview testing if not signed in, matching the authorized WARDEN_ACCOUNTS
          setWarden({
            name: 'Mr. Anjan Kumar Sahoo',
            role: 'Warden',
            hostel: 'APJKHR'
          })
          fetchStudents('APJKHR')
          return
        }

        // 2. Fetch profile role & hostel assignment
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError || !profile) {
          throw new Error('Warden profile not found.')
        }

        // Map role descriptions
        const wardenProfile = {
          name: profile.name,
          role: profile.role === 'admin' ? 'Chief Warden' : 'Warden',
          hostel: profile.school_id || 'APJKHR' // using school_id field to store assigned hostel
        }
        setWarden(wardenProfile)
        fetchStudents(wardenProfile.hostel)

      } catch (err) {
        console.error(err)
        // Fallback mockup
        setWarden({
          name: 'Mr. Anjan Kumar Sahoo',
          role: 'Warden',
          hostel: 'APJKHR'
        })
        fetchStudents('APJKHR')
      }
    }
    loadData()
  }, [])

  // Fetch hostel students with role-based filtering
  async function fetchStudents(assignedHostel) {
    try {
      setLoading(true)
      let query = supabase.from('students_hostel').select('*')
      
      // If warden has a specific hostel assignment, filter query (Chief Warden / Admin sees all)
      if (assignedHostel && assignedHostel !== 'All') {
        query = query.eq('hostel', assignedHostel)
      }

      const { data, error } = await query

      if (error) throw error

      // If database is empty, load the legacy dummy records as initial seeds
      if (!data || data.length === 0) {
        const dummyRecords = [
          { id: '1', regd_no: '2201001', name: 'Arjun Kumar Patel', hostel: 'APJKHR', room: 'A-101', email: 'arjun@outr.ac.in', phone: '9876543210', status: 'Active' },
          { id: '2', regd_no: '2201002', name: 'Sneha Rani Dash', hostel: 'KHR', room: 'B-205', email: 'sneha@outr.ac.in', phone: '9876543211', status: 'Active' },
          { id: '3', regd_no: '2201003', name: 'Rohit Behera', hostel: 'RHR', room: 'C-308', email: 'rohit@outr.ac.in', phone: '9876543212', status: 'Active' },
          { id: '4', regd_no: '2201004', name: 'Priya Mishra', hostel: 'KCHR', room: 'D-110', email: 'priya@outr.ac.in', phone: '9876543213', status: 'Active' },
          { id: '5', regd_no: '2201005', name: 'Suresh Nayak', hostel: 'APJKHR', room: 'A-203', email: 'suresh@outr.ac.in', phone: '9876543214', status: 'Active' },
          { id: '6', regd_no: '2201006', name: 'Anjali Mohapatra', hostel: 'KHR', room: 'B-302', email: 'anjali@outr.ac.in', phone: '9876543215', status: 'Active' }
        ]
        
        // Filter dummy records by assigned hostel locally for preview
        const filteredDummy = assignedHostel && assignedHostel !== 'All' 
          ? dummyRecords.filter(s => s.hostel === assignedHostel)
          : dummyRecords
          
        setStudents(filteredDummy)
        calculateStats(filteredDummy)
      } else {
        setStudents(data)
        calculateStats(data)
      }

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Calculate dynamic stats
  const calculateStats = (records) => {
    const total = records.length
    // Unique occupied rooms
    const occupied = new Set(records.filter(r => r.room && r.status === 'Active').map(r => r.room)).size
    const totalRooms = 280
    setStats({
      totalStudents: total,
      occupiedRooms: occupied,
      vacantRooms: totalRooms - occupied,
      capacity: 560
    })
  }

  // Live search and autocomplete matches
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([])
      return
    }
    const q = searchQuery.toLowerCase()
    const matches = students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.regd_no.toLowerCase().includes(q)
    ).slice(0, 6)
    setSearchResults(matches)
  }, [searchQuery, students])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    executeSearch(searchQuery.trim())
  }

  const executeSearch = (queryStr) => {
    setSearching(true)
    setSearchResults([])
    
    // Simulate loading for authentic skeleton loader experience
    setTimeout(() => {
      const q = queryStr.toLowerCase()
      const found = students.find(s =>
        s.regd_no.toLowerCase() === q ||
        s.name.toLowerCase().includes(q)
      )
      setSearchedStudent(found || null)
      setSearching(false)
    }, 600)
  }

  // CRUD: Add new Student check-in
  const handleAddStudent = async (e) => {
    e.preventDefault()
    setActionLoading(true)
    setActionError('')
    setActionSuccess('')

    // Auto assign warden's hostel if not admin
    const studentData = {
      ...newStudent,
      hostel: warden.hostel !== 'All' ? warden.hostel : newStudent.hostel
    }

    if (!studentData.hostel) {
      setActionError('Hostel assignment is required.')
      setActionLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('students_hostel')
        .insert([studentData])
        .select()

      if (error) throw error

      setActionSuccess('Student record added successfully!')
      setShowAddForm(false)
      setNewStudent({ regd_no: '', name: '', hostel: '', room: '', email: '', phone: '', status: 'Active' })
      fetchStudents(warden.hostel)

    } catch (err) {
      // Local preview simulation if offline/placeholder URL
      console.warn('Supabase insert failed or offline, performing local state simulation:', err.message)
      const simulatedRecord = {
        id: String(Date.now()),
        ...studentData
      }
      const updatedList = [...students, simulatedRecord]
      setStudents(updatedList)
      calculateStats(updatedList)
      
      setActionSuccess('Student check-in successfully simulated locally!')
      setShowAddForm(false)
      setNewStudent({ regd_no: '', name: '', hostel: '', room: '', email: '', phone: '', status: 'Active' })
    } finally {
      setActionLoading(false)
    }
  }

  // CRUD: Toggle Student Status
  const handleToggleStatus = async (studentId, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Checked Out' : 'Active'
    try {
      const { error } = await supabase
        .from('students_hostel')
        .update({ status: nextStatus })
        .eq('id', studentId)

      if (error) throw error
      fetchStudents(warden.hostel)
      if (searchedStudent && searchedStudent.id === studentId) {
        setSearchedStudent(prev => ({ ...prev, status: nextStatus }))
      }
    } catch (err) {
      console.warn('Update failed, simulating locally:', err.message)
      const updatedList = students.map(s => s.id === studentId ? { ...s, status: nextStatus } : s)
      setStudents(updatedList)
      calculateStats(updatedList)
      if (searchedStudent && searchedStudent.id === studentId) {
        setSearchedStudent(prev => ({ ...prev, status: nextStatus }))
      }
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      if (onSignOut) {
        onSignOut()
      } else {
        window.location.reload()
      }
    } catch (err) {
      console.error('Sign out error:', err)
      if (onSignOut) onSignOut()
    }
  }

  return (
    <Layout onNavigate={onSignOut}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Dashboard Header Banner */}
        <div className="bg-white/80 border border-slate-200/80 backdrop-blur-md rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center border border-accent/20">
              <span className="text-3xl">🔑</span>
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">OUTR Hostels Portal</span>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary mt-1">Warden Control Desk</h2>
              <p className="text-xs text-muted font-medium mt-1">
                Authorized Warden: <span className="font-semibold text-primary">{warden?.name}</span> &bull; Assigned: <span className="font-semibold text-primary">{warden?.hostel} Hostel</span>
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-full sm:w-auto bg-primary hover:bg-secondary text-white font-semibold py-2.5 px-6 rounded-xl text-xs hover:shadow-md hover:shadow-primary/5 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>➕</span> Register Student Check-in
            </button>
            <button
              onClick={handleSignOut}
              className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 border border-slate-200 text-primary font-semibold py-2.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 transition-all duration-300"
            >
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>

        {/* Action Form: Register Check-in */}
        {showAddForm && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 mb-8 shadow-md shadow-slate-100/50 animate-fade-in text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl font-bold text-primary">New Student Check-in Registration</h3>
              <button 
                onClick={() => setShowAddForm(false)}
                className="text-muted hover:text-primary font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {actionError && <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl mb-4 border border-red-200">⚠️ {actionError}</div>}
            {actionSuccess && <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl mb-4 border border-emerald-200">✅ {actionSuccess}</div>}

            <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-primary mb-1">Registration Number</label>
                <input 
                  type="text" required placeholder="e.g. 2201009"
                  value={newStudent.regd_no}
                  onChange={e => setNewStudent({...newStudent, regd_no: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-1">Full Name</label>
                <input 
                  type="text" required placeholder="e.g. Priyabrata Mohanty"
                  value={newStudent.name}
                  onChange={e => setNewStudent({...newStudent, name: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-1">Allocated Room</label>
                <input 
                  type="text" placeholder="e.g. A-302"
                  value={newStudent.room}
                  onChange={e => setNewStudent({...newStudent, room: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-secondary"
                />
              </div>
              {warden?.hostel === 'All' && (
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Hostel Block</label>
                  <select 
                    value={newStudent.hostel}
                    onChange={e => setNewStudent({...newStudent, hostel: e.target.value})}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-secondary"
                  >
                    <option value="">Select Hostel</option>
                    <option value="APJKHR">APJKHR</option>
                    <option value="RHR">RHR</option>
                    <option value="KHR">KHR</option>
                    <option value="KCHR">KCHR</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-primary mb-1">Contact Phone</label>
                <input 
                  type="tel" placeholder="e.g. 9876543210"
                  value={newStudent.phone}
                  onChange={e => setNewStudent({...newStudent, phone: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-secondary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-1">University Email</label>
                <input 
                  type="email" placeholder="e.g. student@outr.ac.in"
                  value={newStudent.email}
                  onChange={e => setNewStudent({...newStudent, email: e.target.value})}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="md:col-span-2 pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-primary hover:bg-secondary text-white font-semibold py-2.5 px-8 rounded-xl text-xs disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Register Check-in'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-primary font-semibold py-2.5 px-6 rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar Section */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 mb-8 shadow-sm text-left">
          <h3 className="font-serif text-lg font-bold text-primary mb-4 flex items-center gap-2">
            <span>🔍</span> Student Records Search
          </h3>
          
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3 relative">
            <div className="flex-grow relative">
              <input 
                type="text"
                placeholder="Search by Registration Number or Student Name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-secondary"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => { setSearchQuery(''); setSearchResults([]); setSearchedStudent(null); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary text-base font-bold"
                >
                  &times;
                </button>
              )}

              {/* Autocomplete Dropdown */}
              {searchResults.length > 0 && (
                <ul className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-100/50 overflow-hidden z-20 p-2 space-y-0.5">
                  {searchResults.map(s => (
                    <li 
                      key={s.id}
                      onClick={() => { setSearchQuery(s.name); executeSearch(s.regd_no); }}
                      className="p-3 rounded-xl hover:bg-slate-50 cursor-pointer text-xs font-semibold text-primary flex justify-between items-center"
                    >
                      <span>👤 {s.name}</span>
                      <span className="text-[10px] text-muted tracking-wider">#{s.regd_no}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <button
              type="submit"
              className="bg-primary hover:bg-secondary text-white font-semibold py-3 px-8 rounded-xl text-sm transition-colors"
            >
              Search
            </button>
          </form>
        </section>

        {/* Search Results Display Area */}
        {(searching || searchedStudent !== null) && (
          <section className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 mb-8 shadow-sm text-left animate-fade-in">
            <h3 className="font-serif text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <span>👤</span> Student Detail Card
            </h3>

            {searching ? (
              // Skeleton Loading State
              <div className="border border-slate-100 rounded-2xl overflow-hidden animate-pulse">
                <div className="bg-slate-100 h-28 p-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-slate-200"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-5 bg-slate-200 w-1/3 rounded-lg"></div>
                    <div className="h-4 bg-slate-200 w-1/4 rounded-lg"></div>
                  </div>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className="h-16 bg-slate-100 rounded-xl"></div>
                  ))}
                </div>
              </div>
            ) : searchedStudent ? (
              // Active Student Card Display
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                {/* Header Banner */}
                <div className="bg-slate-50 border-b border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif text-xl font-bold border-2 border-accent/20">
                      {searchedStudent.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-primary">{searchedStudent.name}</h4>
                      <span className="text-xs text-muted tracking-wider font-semibold">Regd No: #{searchedStudent.regd_no}</span>
                    </div>
                  </div>

                  {/* CRUD Toggle Action */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleToggleStatus(searchedStudent.id, searchedStudent.status)}
                      className={`w-full sm:w-auto font-semibold py-2 px-5 rounded-xl text-xs transition-colors ${
                        searchedStudent.status === 'Active' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {searchedStudent.status === 'Active' ? '🔴 Mark Checkout' : '🟢 Mark Check-in'}
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Item 1 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                    <span className="text-xl">🏢</span>
                    <div>
                      <div className="text-[10px] text-muted font-bold uppercase tracking-wider">Hostel block</div>
                      <div className="text-xs font-bold text-primary mt-0.5">{searchedStudent.hostel}</div>
                    </div>
                  </div>
                  {/* Item 2 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                    <span className="text-xl">🚪</span>
                    <div>
                      <div className="text-[10px] text-muted font-bold uppercase tracking-wider">Room Allocation</div>
                      <div className="text-xs font-bold text-primary mt-0.5">{searchedStudent.room || 'Not Assigned'}</div>
                    </div>
                  </div>
                  {/* Item 3 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                    <span className="text-xl">🚦</span>
                    <div>
                      <div className="text-[10px] text-muted font-bold uppercase tracking-wider">Status</div>
                      <div className="text-xs font-bold text-primary mt-0.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          searchedStudent.status === 'Active' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-rose-50 border border-rose-200 text-rose-700'
                        }`}>
                          {searchedStudent.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Item 4 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                    <span className="text-xl">✉️</span>
                    <div>
                      <div className="text-[10px] text-muted font-bold uppercase tracking-wider">University Email</div>
                      <div className="text-xs font-bold text-primary mt-0.5 break-all">{searchedStudent.email || 'N/A'}</div>
                    </div>
                  </div>
                  {/* Item 5 */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                    <span className="text-xl">📞</span>
                    <div>
                      <div className="text-[10px] text-muted font-bold uppercase tracking-wider">Contact Number</div>
                      <div className="text-xs font-bold text-primary mt-0.5">{searchedStudent.phone || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Student not found feedback
              <div className="p-10 border border-dashed border-slate-200 rounded-2xl text-center text-muted">
                <span className="text-4xl block mb-2">👤</span>
                <h4 className="font-serif text-lg font-bold text-primary">No Student Record Matches "{searchQuery}"</h4>
                <p className="text-xs mt-1">Please double check spelling or roll registration numbers.</p>
              </div>
            )}
          </section>
        )}

        {/* Dynamic Statistics Grid */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm text-left">
          <h3 className="font-serif text-lg font-bold text-primary mb-6 flex items-center gap-2">
            <span>📊</span> Hostel Occupancy Statistics
          </h3>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Stat 1 */}
            <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-100 flex items-center gap-4">
              <span className="text-2xl">👥</span>
              <div>
                <div className="text-2xl font-serif font-black text-sky-800">{stats.totalStudents}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Total Students</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center gap-4">
              <span className="text-2xl">🚪</span>
              <div>
                <div className="text-2xl font-serif font-black text-amber-800">{stats.occupiedRooms}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Occupied Rooms</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center gap-4">
              <span className="text-2xl">🔑</span>
              <div>
                <div className="text-2xl font-serif font-black text-rose-800">{stats.vacantRooms}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Vacant Rooms</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center gap-4">
              <span className="text-2xl">🏛️</span>
              <div>
                <div className="text-2xl font-serif font-black text-emerald-800">{stats.capacity}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Total Capacity</div>
              </div>
            </div>
          </div>

          {/* Occupancy bar */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
            <div className="flex justify-between items-center text-xs font-bold text-primary mb-2">
              <span>Overall Occupancy Rate</span>
              <span className="text-accent">{Math.round((stats.occupiedRooms / 280) * 100)}%</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
              <div 
                className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.round((stats.occupiedRooms / 280) * 100)}%` }}
              ></div>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  )
}
