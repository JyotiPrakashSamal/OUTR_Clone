import { useState, useEffect } from 'react'
import { supabase } from '../../../supabaseClient'
import { capitalizeName, handlePrintAdmitCardFromModal } from '../utils/fileTrackingHelpers'

export default function ExamManagementDesk({ role, sessionUser, applications = [] }) {
  const isAdmin = role === 'controller' || role === 'admin'
  const userProfile = sessionUser

  // Active Tab for Sub-desk (Grades vs Admit Cards)
  const [activeTab, setActiveTab] = useState('grades')

  // Lists & Loading States
  const [gradesList, setGradesList] = useState([])
  const [admitCardsList, setAdmitCardsList] = useState([])
  const [loadingGrades, setLoadingGrades] = useState(false)
  const [loadingAdmitCards, setLoadingAdmitCards] = useState(false)

  // Search States
  const [searchGradesQuery, setSearchGradesQuery] = useState('')
  const [searchAdmitQuery, setSearchAdmitQuery] = useState('')

  // Grade sheet form state
  const [gradeForm, setGradeForm] = useState({
    name: '',
    regd_no: '',
    class_name: '',
    semester: '1st Semester',
    exam_type: 'Regular',
    status: 'PASS'
  })
  const [gradeSubjects, setGradeSubjects] = useState([{ subName: '', subCode: '', credits: 4, secured: 9, total: 10 }])

  // Admit card form state
  const [admitForm, setAdmitForm] = useState({
    name: '',
    regd_no: '',
    branch: 'MCA',
    semester: '1st Semester',
    academic_year: '2025-26',
    exam_type: 'Regular Examinations',
    dob: ''
  })
  const [admitSubjects, setAdmitSubjects] = useState([{ code: '', name: '', date: '', time: '2:00 PM – 5:00 PM' }])
  const [editingAdmitCardId, setEditingAdmitCardId] = useState(null)
  const [showAdmitModal, setShowAdmitModal] = useState(false)

  // Fetch Grades Sheets
  async function fetchGrades() {
    try {
      setLoadingGrades(true)
      let query = supabase.from('student_grades').select('*')
      
      if (!isAdmin) {
        // If student, strictly lock to their registration number prefix
        const regd = userProfile?.email ? userProfile.email.split('@')[0] : (userProfile?.regd_no || '')
        if (!regd) {
          setGradesList([])
          return
        }
        query = query.eq('regd_no', regd)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      if (!error && data) {
        setGradesList(data)
      }
    } catch (e) {
      console.error('Error fetching grades:', e)
    } finally {
      setLoadingGrades(false)
    }
  }

  // Fetch Admit Cards
  async function fetchAdmitCards() {
    try {
      setLoadingAdmitCards(true)
      let query = supabase.from('student_admit_cards').select('*')
      
      if (!isAdmin) {
        const regd = userProfile?.email ? userProfile.email.split('@')[0] : (userProfile?.regd_no || '')
        if (!regd) {
          setAdmitCardsList([])
          return
        }
        query = query.eq('regd_no', regd)
      }
      
      const { data, error } = await query.order('issued_at', { ascending: false })
      if (!error && data) {
        setAdmitCardsList(data)
      }
    } catch (e) {
      console.error('Error fetching admit cards:', e)
    } finally {
      setLoadingAdmitCards(false)
    }
  }

  // Load initial data
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGrades()
    fetchAdmitCards()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, userProfile])

  // Custom Modal/Alert trigger (standard browsers fallback)
  const showAlert = (message, title = 'Notice') => {
    alert(`${title}\n${message}`)
  }

  // Grade sheet save handler
  async function handleSaveGrade(e) {
    e.preventDefault()
    if (!gradeForm.name || !gradeForm.regd_no || !gradeForm.class_name) {
      showAlert('Please fill all student details.', 'Warning')
      return
    }
    const activeSubjects = gradeSubjects.filter(s => s.subName && s.subCode)
    if (activeSubjects.length === 0) {
      showAlert('Please add at least one subject.', 'Warning')
      return
    }

    try {
      const { error } = await supabase
        .from('student_grades')
        .insert([{
          regd_no: gradeForm.regd_no,
          name: gradeForm.name,
          class_name: gradeForm.class_name,
          semester: gradeForm.semester,
          exam_type: gradeForm.exam_type,
          status: gradeForm.status,
          subjects: activeSubjects
        }])

      if (error) throw error
      showAlert('Semester Grade Sheet saved successfully!', 'Success')
      setGradeForm({
        name: '',
        regd_no: '',
        class_name: '',
        semester: '1st Semester',
        exam_type: 'Regular',
        status: 'PASS'
      })
      setGradeSubjects([{ subName: '', subCode: '', credits: 4, secured: 9, total: 10 }])
      fetchGrades()
    } catch (err) {
      showAlert('Error saving grade sheet: ' + err.message, 'Error')
    }
  }

  // Delete Grade record
  async function handleDeleteGrade(id) {
    if (!confirm('Are you sure you want to delete this grade sheet record?')) return
    try {
      const { error } = await supabase
        .from('student_grades')
        .delete()
        .eq('id', id)

      if (error) throw error
      showAlert('Grade record deleted.', 'Success')
      fetchGrades()
    } catch (err) {
      showAlert('Deletion failed: ' + err.message, 'Error')
    }
  }

  // Save Admit card
  async function handleSaveAdmitCard(e) {
    e.preventDefault()
    if (!admitForm.name || !admitForm.regd_no || !admitForm.branch || !admitForm.dob) {
      showAlert('Please fill all student information and Date of Birth.', 'Warning')
      return
    }
    const activeSubjects = admitSubjects.filter(s => s.code && s.name)
    if (activeSubjects.length === 0) {
      showAlert('Please add at least one subject code & name.', 'Warning')
      return
    }

    try {
      const payload = {
        regd_no: admitForm.regd_no,
        name: admitForm.name,
        branch: admitForm.branch,
        semester: admitForm.semester,
        academic_year: admitForm.academic_year,
        exam_type: admitForm.exam_type,
        dob: admitForm.dob,
        subjects: activeSubjects
      }

      if (editingAdmitCardId) {
        const { error } = await supabase
          .from('student_admit_cards')
          .update(payload)
          .eq('id', editingAdmitCardId)

        if (error) throw error
        showAlert('Admit Card updated successfully!', 'Success')
        setEditingAdmitCardId(null)
      } else {
        const { error } = await supabase
          .from('student_admit_cards')
          .insert([payload])

        if (error) throw error
        showAlert('Admit Card generated and published successfully!', 'Success')
      }

      setAdmitForm({
        name: '',
        regd_no: '',
        branch: 'MCA',
        semester: '1st Semester',
        academic_year: '2025-26',
        exam_type: 'Regular Examinations',
        dob: ''
      })
      setAdmitSubjects([{ code: '', name: '', date: '', time: '2:00 PM – 5:00 PM' }])
      setShowAdmitModal(false)
      fetchAdmitCards()
    } catch (err) {
      showAlert('Operation failed: ' + err.message, 'Error')
    }
  }

  // Delete Admit Card
  async function handleDeleteAdmitCard(id) {
    if (!confirm('Are you sure you want to delete this admit card record?')) return
    try {
      const { error } = await supabase
        .from('student_admit_cards')
        .delete()
        .eq('id', id)

      if (error) throw error
      showAlert('Admit card record deleted.', 'Success')
      fetchAdmitCards()
    } catch (err) {
      showAlert('Deletion failed: ' + err.message, 'Error')
    }
  }

  // Print Grade card
  const handlePrintGrade = (grade) => {
    if (!grade) return
    const printSection = document.getElementById('print-area')
    if (printSection) {
      // Calculate GPA
      const activeSubs = grade.subjects || []
      let totalCredits = 0
      let weightedPoints = 0
      activeSubs.forEach(s => {
        const credits = Number(s.credits) || 0
        const secured = Number(s.secured) || 0
        totalCredits += credits
        weightedPoints += (credits * secured)
      })
      const sgpa = totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : '0.00'

      printSection.innerHTML = `
        <div class="print-grade-card" style="font-family:'Times New Roman', serif; color: black; max-width: 800px; margin: 0 auto; padding: 20px; border: 3px double black;">
          <div style="text-align: center; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 20px; display: flex; flex-direction: column; align-items: center;">
            <img src="https://outr.ac.in/public/uploads/logo_4.png" alt="OUTR Seal" style="width: 55px; height: 55px; margin-bottom: 6px; object-fit: contain;" />
            <div style="width: 100%;">
              <div style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">ଓଡ଼ିଶା ବୈଷୟିକ ଓ ଗବେଷଣା ବିଶ୍ୱବିଦ୍ୟାଳୟ</div>
              <div style="font-size: 20px; font-weight: bold; text-transform: uppercase; margin-top: 4px;">Odisha University of Technology and Research</div>
              <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: #555;">Techno Campus, Ghatikia, Mahalaxmi Vihar, Bhubaneswar-751029</div>
              <div style="font-size: 15px; font-weight: bold; text-transform: uppercase; margin-top: 10px; text-decoration: underline; letter-spacing: 1px;">Official Grade Sheet / Results Transcript</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; font-size: 12px; border: 1px solid black; padding: 10px;">
            <div><strong>Student Name:</strong> ${capitalizeName(grade.name)}</div>
            <div><strong>Registration Number:</strong> ${grade.regd_no}</div>
            <div><strong>Programme / Branch:</strong> ${grade.class_name}</div>
            <div><strong>Academic Year:</strong> 2025-2026</div>
            <div><strong>Semester Evaluation:</strong> ${grade.semester || '—'}</div>
            <div><strong>Examination Category:</strong> ${grade.exam_type} Records</div>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
            <thead>
              <tr style="background: #f2f2f2; border-bottom: 2px solid black;">
                <th style="border: 1px solid black; padding: 8px; text-align: center;">Sl. No.</th>
                <th style="border: 1px solid black; padding: 8px; text-align: center;">Subject Code</th>
                <th style="border: 1px solid black; padding: 8px; text-align: left;">Subject Title</th>
                <th style="border: 1px solid black; padding: 8px; text-align: center;">Subject Credits</th>
                <th style="border: 1px solid black; padding: 8px; text-align: center;">Grade Points Secured</th>
                <th style="border: 1px solid black; padding: 8px; text-align: center;">Total Points</th>
              </tr>
            </thead>
            <tbody>
              ${(grade.subjects || []).map((s, idx) => `
                <tr>
                  <td style="border: 1px solid black; padding: 8px; text-align: center;">${idx + 1}</td>
                  <td style="border: 1px solid black; padding: 8px; text-align: center; font-family: monospace;">${s.subCode}</td>
                  <td style="border: 1px solid black; padding: 8px; text-align: left;">${s.subName}</td>
                  <td style="border: 1px solid black; padding: 8px; text-align: center;">${s.credits}</td>
                  <td style="border: 1px solid black; padding: 8px; text-align: center; font-weight: bold;">${Number(s.secured).toFixed(1)}</td>
                  <td style="border: 1px solid black; padding: 8px; text-align: center;">${s.total || 10}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="display: flex; justify-content: space-between; align-items: center; border: 2px solid black; padding: 10px; margin-bottom: 25px; font-size: 13px; background: #fafafa;">
            <div><strong>SGPA / SEMESTER GPA:</strong> <span style="font-size: 16px; font-weight: bold; text-decoration: underline;">${sgpa}</span></div>
            <div><strong>RESULT EVALUATION:</strong> <span style="font-weight: bold; color: ${grade.status === 'PASS' ? 'green' : 'red'}; text-transform: uppercase;">${grade.status}</span></div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 11px; margin-top: 40px; text-align: center;">
            <div>
              <div style="border-top: 1px solid black; width: 140px; margin: 0 auto 5px; padding-top: 5px;"></div>
              Candidate Signature
            </div>
            <div>
              <div style="border-top: 1px solid black; width: 140px; margin: 0 auto 5px; padding-top: 5px; font-weight: bold;"></div>
              Controller of Examinations
            </div>
          </div>
        </div>
      `
      window.print()
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('grades')}
          className={`py-3 px-6 font-serif text-sm font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'grades' ? 'border-[#d4af37] text-[#0b3c5d]' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          📁 Semester Grade Sheets
        </button>
        <button
          onClick={() => setActiveTab('admit_cards')}
          className={`py-3 px-6 font-serif text-sm font-bold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'admit_cards' ? 'border-[#d4af37] text-[#0b3c5d]' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          🎟️ Exam Admit Cards
        </button>
      </div>

      {/* RENDER ADMIN CONSOLE */}
      {isAdmin ? (
        activeTab === 'grades' ? (
          /* Grade Cards Admin Console */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
            {/* Form */}
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-widest">Entry Desk</span>
                <h3 className="font-serif text-lg font-bold text-primary mt-1">Issue Semester Results</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Enter student grades manually</p>
              </div>

              <form onSubmit={handleSaveGrade} className="space-y-4 text-xs font-semibold text-primary">
                <div>
                  <label className="block uppercase tracking-wider text-[10px] mb-1">Student Full Name *</label>
                  <input
                    type="text" required placeholder="e.g. Name"
                    value={gradeForm.name}
                    onChange={e => setGradeForm({ ...gradeForm, name: e.target.value })}
                    className="input-standard font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[10px] mb-1">Registration Roll No. *</label>
                  <input
                    type="text" required placeholder="e.g. 25240012"
                    value={gradeForm.regd_no}
                    onChange={e => setGradeForm({ ...gradeForm, regd_no: e.target.value })}
                    className="input-standard font-medium text-sm"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-wider text-[10px] mb-1">Class / Branch *</label>
                  <input
                    type="text" required placeholder="e.g. MCA"
                    value={gradeForm.class_name}
                    onChange={e => setGradeForm({ ...gradeForm, class_name: e.target.value })}
                    className="input-standard font-medium text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] mb-1">Semester</label>
                    <select
                      value={gradeForm.semester}
                      onChange={e => setGradeForm({ ...gradeForm, semester: e.target.value })}
                      className="input-standard bg-white font-medium text-sm"
                    >
                      {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(sem => (
                        <option key={sem} value={`${sem} Semester`}>{sem} Sem</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block uppercase tracking-wider text-[10px] mb-1">Exam Type</label>
                    <select
                      value={gradeForm.exam_type}
                      onChange={e => setGradeForm({ ...gradeForm, exam_type: e.target.value })}
                      className="input-standard bg-white font-medium text-sm"
                    >
                      <option value="Regular">Regular</option>
                      <option value="Back">Back</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-[10px] mb-1.5 flex justify-between">
                    <span>Subjects &amp; Grades</span>
                    <button
                      type="button"
                      onClick={() => setGradeSubjects([...gradeSubjects, { subName: '', subCode: '', credits: 4, secured: 9, total: 10 }])}
                      className="text-secondary hover:underline lowercase font-bold"
                    >
                      + Add Subject
                    </button>
                  </label>

                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {gradeSubjects.map((s, idx) => (
                      <div key={idx} className="border border-slate-150 p-2.5 rounded-xl bg-slate-50 relative space-y-2">
                        <button
                          type="button"
                          onClick={() => setGradeSubjects(gradeSubjects.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-2 text-rose-500 hover:text-rose-700 text-sm font-bold"
                        >
                          ×
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text" placeholder="Sub Code" required
                            value={s.subCode}
                            onChange={e => {
                              const newSubs = [...gradeSubjects]
                              newSubs[idx].subCode = e.target.value.toUpperCase()
                              setGradeSubjects(newSubs)
                            }}
                            className="p-2 border border-slate-200 rounded-lg text-[10px] font-semibold bg-white outline-none"
                          />
                          <input
                            type="text" placeholder="Sub Name" required
                            value={s.subName}
                            onChange={e => {
                              const newSubs = [...gradeSubjects]
                              newSubs[idx].subName = e.target.value
                              setGradeSubjects(newSubs)
                            }}
                            className="p-2 border border-slate-200 rounded-lg text-[10px] font-semibold bg-white outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-[8px] text-slate-400">Credits</label>
                            <input
                              type="number" min="1" max="6" required
                              value={s.credits}
                              onChange={e => {
                                const newSubs = [...gradeSubjects]
                                newSubs[idx].credits = Number(e.target.value)
                                setGradeSubjects(newSubs)
                              }}
                              className="w-full p-1 border border-slate-200 rounded text-[10px] bg-white text-center font-medium outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] text-slate-400">Secured Pt</label>
                            <input
                              type="number" min="0" max="10" step="0.1" required
                              value={s.secured}
                              onChange={e => {
                                const newSubs = [...gradeSubjects]
                                newSubs[idx].secured = Number(e.target.value)
                                setGradeSubjects(newSubs)
                              }}
                              className="w-full p-1 border border-slate-200 rounded text-[10px] bg-white text-center font-medium outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] text-slate-400">Total Pt</label>
                            <input
                              type="number" min="10" max="10" required
                              value={s.total || 10}
                              onChange={e => {
                                const newSubs = [...gradeSubjects]
                                newSubs[idx].total = Number(e.target.value)
                                setGradeSubjects(newSubs)
                              }}
                              className="w-full p-1 border border-slate-200 rounded text-[10px] bg-white text-center font-medium outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-brand-primary w-full shadow-md uppercase tracking-wider text-xs cursor-pointer py-3"
                >
                  Save Grade Sheet
                </button>
              </form>
            </div>

            {/* Records List */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <div>
                  <span className="text-xs font-bold text-accent uppercase tracking-widest">Controller Archives</span>
                  <h3 className="font-serif text-lg font-bold text-primary mt-1">Grade sheet Records</h3>
                </div>
                <input
                  type="text"
                  placeholder="Search by student name or roll..."
                  value={searchGradesQuery}
                  onChange={e => setSearchGradesQuery(e.target.value)}
                  className="input-standard w-full sm:w-64"
                />
              </div>

              <div className="table-container-responsive">
                <table className="table-brand">
                  <thead>
                    <tr className="table-brand-header">
                      <th className="p-3 pl-4">Name</th>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">Semester</th>
                      <th className="p-3 text-center">Subjects</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingGrades ? (
                      Array(3).fill(0).map((_, idx) => (
                        <tr key={idx} className="table-brand-row animate-pulse">
                          <td className="p-3 pl-4"><div className="h-4 w-28 rounded shimmer-effect"></div></td>
                          <td className="p-3"><div className="h-4 w-16 rounded shimmer-effect"></div></td>
                          <td className="p-3"><div className="h-4 w-20 rounded shimmer-effect"></div></td>
                          <td className="p-3"><div className="h-4 w-12 rounded shimmer-effect"></div></td>
                          <td className="p-3 text-center"><div className="h-4 w-8 rounded shimmer-effect mx-auto"></div></td>
                          <td className="p-3 text-center"><div className="h-5 w-12 rounded-full shimmer-effect mx-auto"></div></td>
                          <td className="p-3 text-center"><div className="h-6 w-16 rounded-xl shimmer-effect mx-auto"></div></td>
                        </tr>
                      ))
                    ) : gradesList.filter(g =>
                      g.name.toLowerCase().includes(searchGradesQuery.toLowerCase()) ||
                      g.regd_no.toLowerCase().includes(searchGradesQuery.toLowerCase())
                    ).length === 0 ? (
                      <tr><td colSpan="7" className="p-10 text-center text-slate-400 font-semibold">No results match your search query.</td></tr>
                    ) : gradesList.filter(g =>
                      g.name.toLowerCase().includes(searchGradesQuery.toLowerCase()) ||
                      g.regd_no.toLowerCase().includes(searchGradesQuery.toLowerCase())
                    ).map(g => (
                      <tr key={g.id} className="table-brand-row">
                        <td className="p-3 pl-4 font-bold text-primary">{capitalizeName(g.name)}</td>
                        <td className="p-3 font-mono text-slate-500">#{g.regd_no}</td>
                        <td className="p-3 text-slate-500">{g.class_name}</td>
                        <td className="p-3 text-slate-500">{g.semester} ({g.exam_type})</td>
                        <td className="p-3 text-center text-slate-500 font-bold">{g.subjects?.length || 0}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${g.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {g.status}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteGrade(g.id)}
                            className="text-rose-500 hover:text-rose-700 text-sm font-bold p-1 hover:bg-rose-50 rounded-lg cursor-pointer"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Admit Cards Admin Console */
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6 text-left">
            <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-widest">Issuing Desk</span>
                <h3 className="font-serif text-lg font-bold text-primary mt-1">Issue Exam Admit Cards</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Issue admit cards for registered university semesters</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditingAdmitCardId(null)
                    setAdmitForm({
                      name: '',
                      regd_no: '',
                      branch: 'MCA',
                      semester: '1st Semester',
                      academic_year: '2025-26',
                      exam_type: 'Regular Examinations',
                      dob: ''
                    })
                    setAdmitSubjects([{ code: '', name: '', date: '', time: '2:00 PM – 5:00 PM' }])
                    setShowAdmitModal(true)
                  }}
                  className="btn-brand-primary text-xs"
                >
                  + Create Admit Card
                </button>
              </div>
            </div>

            {/* Records List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <h4 className="font-serif text-base font-bold text-primary">Issued Admit Cards Archive</h4>
                <input
                  type="text"
                  placeholder="Search by student name or roll..."
                  value={searchAdmitQuery}
                  onChange={e => setSearchAdmitQuery(e.target.value)}
                  className="input-standard w-full sm:w-64"
                />
              </div>

              <div className="table-container-responsive">
                <table className="table-brand">
                  <thead>
                    <tr className="table-brand-header">
                      <th className="p-3 pl-4">Name</th>
                      <th className="p-3">Roll No</th>
                      <th className="p-3">Branch</th>
                      <th className="p-3">Semester</th>
                      <th className="p-3">Exam Category</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingAdmitCards ? (
                      Array(3).fill(0).map((_, idx) => (
                        <tr key={idx} className="table-brand-row animate-pulse">
                          <td className="p-3 pl-4"><div className="h-4 w-28 rounded shimmer-effect"></div></td>
                          <td className="p-3"><div className="h-4 w-16 rounded shimmer-effect"></div></td>
                          <td className="p-3"><div className="h-4 w-20 rounded shimmer-effect"></div></td>
                          <td className="p-3"><div className="h-4 w-12 rounded shimmer-effect"></div></td>
                          <td className="p-3"><div className="h-4 w-24 rounded shimmer-effect"></div></td>
                          <td className="p-3 text-center"><div className="h-6 w-24 rounded-xl shimmer-effect mx-auto"></div></td>
                        </tr>
                      ))
                    ) : admitCardsList.filter(c =>
                      c.name.toLowerCase().includes(searchAdmitQuery.toLowerCase()) ||
                      c.regd_no.toLowerCase().includes(searchAdmitQuery.toLowerCase())
                    ).length === 0 ? (
                      <tr><td colSpan="6" className="p-10 text-center text-slate-400 font-semibold">No results match your search query.</td></tr>
                    ) : admitCardsList.filter(c =>
                      c.name.toLowerCase().includes(searchAdmitQuery.toLowerCase()) ||
                      c.regd_no.toLowerCase().includes(searchAdmitQuery.toLowerCase())
                    ).map(c => (
                      <tr key={c.id} className="table-brand-row">
                        <td className="p-3 pl-4 font-bold text-primary">{capitalizeName(c.name)}</td>
                        <td className="p-3 font-mono text-slate-500">#{c.regd_no}</td>
                        <td className="p-3 text-slate-500">{c.branch}</td>
                        <td className="p-3 text-slate-500">{c.semester}</td>
                        <td className="p-3 text-slate-500">{c.exam_type}</td>
                        <td className="p-3 text-center flex items-center justify-center gap-2">
                          <button
                            onClick={() => handlePrintAdmitCardFromModal(c, applications)}
                            className="bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold p-1 px-2.5 rounded-lg text-[10px]"
                          >
                            🖨️ Print
                          </button>
                          <button
                            onClick={() => {
                              setEditingAdmitCardId(c.id)
                              setAdmitForm({
                                name: c.name,
                                regd_no: c.regd_no,
                                branch: c.branch,
                                semester: c.semester || '1st Semester',
                                academic_year: c.academic_year || '2025-26',
                                exam_type: c.exam_type || 'Regular Examinations',
                                dob: c.dob || ''
                              })
                              setAdmitSubjects(c.subjects || [])
                              setShowAdmitModal(true)
                            }}
                            className="bg-amber-50 text-amber-700 hover:bg-amber-100 font-bold p-1 px-2.5 rounded-lg text-[10px]"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAdmitCard(c.id)}
                            className="bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold p-1 px-2 rounded-lg text-[10px]"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ADMIT CARD EDITOR MODAL */}
            {showAdmitModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
                  <button
                    onClick={() => setShowAdmitModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-lg font-bold"
                  >
                    ×
                  </button>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-primary">
                      {editingAdmitCardId ? 'Edit Student Admit Card' : 'Generate New Admit Card'}
                    </h3>
                    <p className="text-[10px] text-slate-400">Fill in semester schedule and date of birth info</p>
                  </div>

                  <form onSubmit={handleSaveAdmitCard} className="space-y-4 text-xs font-semibold text-primary">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block uppercase tracking-wider text-[10px] mb-1">Student Name *</label>
                        <input
                          type="text" required placeholder="Name"
                          value={admitForm.name}
                          onChange={e => setAdmitForm({ ...admitForm, name: e.target.value })}
                          className="input-standard font-medium text-xs"
                        />
                      </div>
                      <div>
                        <label className="block uppercase tracking-wider text-[10px] mb-1">Roll / Regd No *</label>
                        <input
                          type="text" required placeholder="e.g. 25240012"
                          value={admitForm.regd_no}
                          onChange={e => setAdmitForm({ ...admitForm, regd_no: e.target.value })}
                          className="input-standard font-medium text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block uppercase tracking-wider text-[10px] mb-1">Branch *</label>
                        <input
                          type="text" required placeholder="e.g. MCA, B.Tech CSE"
                          value={admitForm.branch}
                          onChange={e => setAdmitForm({ ...admitForm, branch: e.target.value })}
                          className="input-standard font-medium text-xs"
                        />
                      </div>
                      <div>
                        <label className="block uppercase tracking-wider text-[10px] mb-1">Date of Birth *</label>
                        <input
                          type="date" required
                          value={admitForm.dob}
                          onChange={e => setAdmitForm({ ...admitForm, dob: e.target.value })}
                          className="input-standard font-medium text-xs"
                        />
                      </div>
                      <div>
                        <label className="block uppercase tracking-wider text-[10px] mb-1">Academic Year *</label>
                        <input
                          type="text" required placeholder="e.g. 2025-26"
                          value={admitForm.academic_year}
                          onChange={e => setAdmitForm({ ...admitForm, academic_year: e.target.value })}
                          className="input-standard font-medium text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block uppercase tracking-wider text-[10px] mb-1">Semester</label>
                        <select
                          value={admitForm.semester}
                          onChange={e => setAdmitForm({ ...admitForm, semester: e.target.value })}
                          className="input-standard bg-white font-medium text-xs"
                        >
                          {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'].map(sem => (
                            <option key={sem} value={`${sem} Semester`}>{sem} Sem</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block uppercase tracking-wider text-[10px] mb-1">Exam Type</label>
                        <input
                          type="text" required placeholder="Regular Examinations"
                          value={admitForm.exam_type}
                          onChange={e => setAdmitForm({ ...admitForm, exam_type: e.target.value })}
                          className="input-standard font-medium text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block uppercase tracking-wider text-[10px] flex justify-between">
                        <span>Subjects and Exam Schedule</span>
                        <button
                          type="button"
                          onClick={() => setAdmitSubjects([...admitSubjects, { code: '', name: '', date: '', time: '2:00 PM – 5:00 PM' }])}
                          className="text-secondary hover:underline lowercase font-bold"
                        >
                          + Add Subject
                        </button>
                      </label>
                      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                        {admitSubjects.map((s, idx) => (
                          <div key={idx} className="border border-slate-150 p-2.5 rounded-xl bg-slate-50 relative grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setAdmitSubjects(admitSubjects.filter((_, i) => i !== idx))}
                              className="absolute -top-1.5 -right-1.5 bg-rose-100 hover:bg-rose-200 text-rose-600 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black"
                            >
                              ×
                            </button>
                            <input
                              type="text" placeholder="Sub Code" required
                              value={s.code}
                              onChange={e => {
                                const newSubs = [...admitSubjects]
                                newSubs[idx].code = e.target.value.toUpperCase()
                                setAdmitSubjects(newSubs)
                              }}
                              className="p-2 border border-slate-200 rounded-lg text-[10px] font-semibold bg-white outline-none"
                            />
                            <input
                              type="text" placeholder="Sub Name" required
                              value={s.name}
                              onChange={e => {
                                const newSubs = [...admitSubjects]
                                newSubs[idx].name = e.target.value
                                setAdmitSubjects(newSubs)
                              }}
                              className="p-2 border border-slate-200 rounded-lg text-[10px] font-semibold bg-white outline-none"
                            />
                            <input
                              type="date" required
                              value={s.date}
                              onChange={e => {
                                const newSubs = [...admitSubjects]
                                newSubs[idx].date = e.target.value
                                setAdmitSubjects(newSubs)
                              }}
                              className="p-2 border border-slate-200 rounded-lg text-[10px] font-semibold bg-white outline-none"
                            />
                            <input
                              type="text" required placeholder="Session Time"
                              value={s.time}
                              onChange={e => {
                                const newSubs = [...admitSubjects]
                                newSubs[idx].time = e.target.value
                                setAdmitSubjects(newSubs)
                              }}
                              className="p-2 border border-slate-200 rounded-lg text-[10px] font-semibold bg-white outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn-brand-primary w-full shadow-md py-3 uppercase text-xs"
                    >
                      {editingAdmitCardId ? 'Update Admit Card' : 'Publish Admit Card'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        /* RENDER STUDENT READ-ONLY TRANSCRIPTS VIEW */
        activeTab === 'grades' ? (
          /* Student Grade Sheets viewer */
          <div className="space-y-4 animate-fade-in text-left">
            {loadingGrades ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-48 w-full rounded-3xl border border-slate-100 p-6 space-y-4">
                  <div className="h-6 w-1/3 rounded shimmer-effect"></div>
                  <div className="h-4 w-1/4 rounded shimmer-effect"></div>
                  <div className="space-y-2 mt-6">
                    <div className="h-8 w-full rounded shimmer-effect"></div>
                    <div className="h-8 w-full rounded shimmer-effect"></div>
                  </div>
                </div>
              </div>
            ) : gradesList.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-16 text-center text-muted">
                <span className="text-4xl block mb-2">📋</span>
                <h4 className="font-serif text-base font-bold text-primary">No Grade Sheets Found</h4>
                <p className="text-xs mt-1">No semester grade sheets have been published for your Roll Number.</p>
              </div>
            ) : (
              gradesList.map(grade => {
                const activeSubs = grade.subjects || []
                let totalCredits = 0
                let weightedPoints = 0
                activeSubs.forEach(s => {
                  const credits = Number(s.credits) || 0
                  const secured = Number(s.secured) || 0
                  totalCredits += credits
                  weightedPoints += (credits * secured)
                })
                const sgpa = totalCredits > 0 ? (weightedPoints / totalCredits).toFixed(2) : '0.00'

                return (
                  <div key={grade.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                    <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-100 text-slate-800 tracking-wider">Semester Result Transcript</span>
                        <h3 className="font-serif text-xl font-bold text-primary mt-1">{grade.semester} ({grade.exam_type})</h3>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">Published on: {new Date(grade.created_at).toLocaleDateString()}</p>
                      </div>
                      <button
                        onClick={() => handlePrintGrade(grade)}
                        className="btn-brand-primary text-xs"
                      >
                        🖨️ Print Transcript
                      </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold text-slate-500">
                      <div><strong>Student Name:</strong> <span className="text-slate-800 font-bold">{capitalizeName(grade.name)}</span></div>
                      <div><strong>Registration Roll:</strong> <span className="text-slate-800 font-mono">#{grade.regd_no}</span></div>
                      <div><strong>Course:</strong> <span className="text-slate-800">{grade.class_name}</span></div>
                      <div className="flex gap-4">
                        <div><strong>SGPA:</strong> <span className="text-primary font-black underline text-sm">{sgpa}</span></div>
                        <div><strong>Status:</strong> <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${grade.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{grade.status}</span></div>
                      </div>
                    </div>

                    <div className="table-container-responsive">
                      <table className="table-brand">
                        <thead>
                          <tr className="table-brand-header">
                            <th className="p-3 pl-4">Sl No</th>
                            <th className="p-3">Subject Code</th>
                            <th className="p-3">Subject Title</th>
                            <th className="p-3 text-center">Credits</th>
                            <th className="p-3 text-center">Grade Points Secured</th>
                            <th className="p-3 text-center">Total Points</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeSubs.map((s, idx) => (
                            <tr key={idx} className="table-brand-row font-medium text-xs">
                              <td className="p-3 pl-4 text-slate-400 font-bold">{idx + 1}</td>
                              <td className="p-3 font-mono font-bold text-slate-600">{s.subCode}</td>
                              <td className="p-3 text-slate-800 font-bold">{s.subName}</td>
                              <td className="p-3 text-center text-slate-500 font-bold">{s.credits}</td>
                              <td className="p-3 text-center text-emerald-600 font-bold">{Number(s.secured).toFixed(1)}</td>
                              <td className="p-3 text-center text-slate-400">{s.total || 10}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        ) : (
          /* Student Admit Cards viewer */
          <div className="space-y-4 animate-fade-in text-left">
            {loadingAdmitCards ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-48 w-full rounded-3xl border border-slate-100 p-6 space-y-4">
                  <div className="h-6 w-1/3 rounded shimmer-effect"></div>
                  <div className="h-4 w-1/4 rounded shimmer-effect"></div>
                </div>
              </div>
            ) : admitCardsList.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-16 text-center text-muted">
                <span className="text-4xl block mb-2">🎟️</span>
                <h4 className="font-serif text-base font-bold text-primary">No Admit Cards Published</h4>
                <p className="text-xs mt-1">No exam admit cards have been published for your Roll Number. Please clear pending fees or hostel clearances.</p>
              </div>
            ) : (
              admitCardsList.map(card => (
                <div key={card.id} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-4 border-b border-slate-100 pb-4">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-[#eff6ff] text-[#0b3c5d] tracking-wider">Exam Hall Entry Permit</span>
                      <h3 className="font-serif text-xl font-bold text-primary mt-1">{card.semester} ({card.exam_type})</h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Academic Year: {card.academic_year}</p>
                    </div>
                    <button
                      onClick={() => handlePrintAdmitCardFromModal(card, applications)}
                      className="btn-brand-primary text-xs"
                    >
                      🖨️ Print Admit Card
                    </button>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold text-slate-500">
                    <div><strong>Student Name:</strong> <span className="text-slate-800 font-bold">{capitalizeName(card.name)}</span></div>
                    <div><strong>Registration Roll:</strong> <span className="text-slate-800 font-mono">#{card.regd_no}</span></div>
                    <div><strong>Branch:</strong> <span className="text-slate-800">{card.branch}</span></div>
                    <div><strong>Date of Birth:</strong> <span className="text-slate-800 font-mono">{card.dob || '—'}</span></div>
                  </div>

                  <div className="table-container-responsive">
                    <table className="table-brand">
                      <thead>
                        <tr className="table-brand-header">
                          <th className="p-3 pl-4">Exam Date</th>
                          <th className="p-3">Subject Code</th>
                          <th className="p-3">Subject Name</th>
                          <th className="p-3 text-center">Session Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(card.subjects || []).map((s, idx) => (
                          <tr key={idx} className="table-brand-row font-medium text-xs">
                            <td className="p-3 pl-4 font-bold text-slate-600">{s.date ? new Date(s.date+'T00:00').toLocaleDateString() : '—'}</td>
                            <td className="p-3 font-mono font-bold text-slate-600">{s.code}</td>
                            <td className="p-3 text-slate-800 font-bold">{s.name}</td>
                            <td className="p-3 text-center text-slate-500">{s.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        )
      )}
    </div>
  )
}
