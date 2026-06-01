// ====================================================================
// OUTR PORTAL: FILE TRACKING SYSTEM UTILS & CONSTANTS
// ====================================================================

export const capitalizeName = (name) => {
  if (!name) return ''
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const SCHOOLS = [
  {
    id: 'SCS',
    name: 'School of Computer Science',
    short: 'Comp. Science',
    icon: '💻',
    programmes: ['B.Tech CSE', 'B.Tech CSE (AI & ML)', 'B.Tech CSE (Data Science)', 'MCA', 'M.Tech CSE', 'Ph.D CSE']
  },
  {
    id: 'SEE',
    name: 'School of Electrical Science',
    short: 'Electrical Engg.',
    icon: '⚡',
    programmes: ['B.Tech Electrical', 'B.Tech EEE', 'M.Tech Power Systems', 'M.Tech Control Systems', 'Ph.D EE']
  },
  {
    id: 'SME',
    name: 'School of Mechanical Science',
    short: 'Mechanical Engg.',
    icon: '⚙️',
    programmes: ['B.Tech Mechanical', 'B.Tech Automobile', 'M.Tech Thermal', 'M.Tech Manufacturing', 'Ph.D ME']
  },
  {
    id: 'SECE',
    name: 'School of Electronics Science',
    short: 'Electronics & Comm.',
    icon: '🔌',
    programmes: ['B.Tech ECE', 'B.Tech Electronics', 'M.Tech VLSI', 'M.Tech Communication', 'Ph.D ECE']
  },
  {
    id: 'STX',
    name: 'School of Textile Engineering',
    short: 'Textile Technology',
    icon: '🧵',
    programmes: ['B.Tech Textile Technology', 'B.Tech Fashion Technology', 'M.Tech Textile', 'MBA Textile Management', 'Ph.D Textile']
  },
  {
    id: 'SBS',
    name: 'School of Basic Sciences & Humanities',
    short: 'Basic Sciences & Hum.',
    icon: '🧪',
    programmes: ['B.Sc Physics', 'B.Sc Chemistry', 'B.Sc Mathematics', 'M.Sc Physics', 'M.Sc Chemistry', 'M.Sc Mathematics', 'MA English', 'MA Economics', 'Ph.D Sciences']
  },
  {
    id: 'SIP',
    name: 'School of Infrastructure & Planning',
    short: 'Infrastructure & Plan.',
    icon: '🏛️',
    programmes: ['B.Tech Civil', 'B.Tech Architecture', 'M.Tech Structural', 'M.Tech Environmental', 'M.Plan Urban Planning', 'Ph.D Civil']
  },
  {
    id: 'SBM',
    name: 'School of Business Management',
    short: 'Business Management',
    icon: '📈',
    programmes: ['BBA', 'MBA', 'MBA (Finance)', 'MBA (HR)', 'MBA (Marketing)', 'Ph.D Management']
  }
]

export const SCHOOL_MAP = SCHOOLS.reduce((acc, s) => {
  acc[s.id] = s
  return acc
}, {})

export const DEFAULT_NAMES = {
  admin: 'Super Admin Registry',
  warden: 'Mr. Anjan Kumar Sahoo',
  adviser: 'Dr. Debasis Gountia',
  hos: 'Prof. Sangram Mohanty',
  dean_academic: 'Dr. Ranjan Kumar Senapati',
  dean_pga: 'Dr. Debabrata Dhupal',
  controller: 'Dr. Anupama Rath',
  student: 'Student Portal'
}

// Print Handler for Admit Cards
export const handlePrintAdmitCardFromModal = (card, applications = []) => {
  if (!card) return
  const printSection = document.getElementById('print-area')
  if (printSection) {
    const hasCleared = applications.some(app => app.student_regd === card.regd_no && app.status === 'resolved')
    const fmtDate = (d) => { try { return d ? new Date(d+'T00:00').toLocaleDateString() : '—'; } catch(e) { return d||'—'; } }
    printSection.innerHTML = `
      <div class="print-admit-card" style="font-family:'Times New Roman', serif; color: black; max-width: 800px; margin: 0 auto; padding: 20px; border: 2px solid black;">
        <div style="display: flex; flex-direction: column; align-items: center; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 15px; text-align: center;">
          <img src="https://outr.ac.in/public/uploads/logo_4.png" alt="OUTR Seal" style="width: 50px; height: 50px; margin-bottom: 5px; object-fit: contain;" />
          <div style="width: 100%;">
            <div style="font-size: 13px; font-weight: bold; text-transform: uppercase;">ଓଡ଼ିଶା ବୈଷୟିକ ଓ ଗବେଷଣା ବିଶ୍ୱବିଦ୍ୟାଳୟ</div>
            <div style="font-size: 18px; font-weight: bold; text-transform: uppercase; margin-top: 2px;">Odisha University of Technology and Research</div>
            <div style="font-size: 10px; text-transform: uppercase; font-weight: bold; color: #555; margin-top: 2px;">Techno Campus, Ghatikia, Bhubaneswar-751029</div>
            <div style="font-size: 15px; font-weight: bold; text-transform: uppercase; margin-top: 8px; letter-spacing: 2px;">Official Exam Admit Card</div>
          </div>
        </div>

        <div style="background: #f2f2f2; border: 1px solid black; text-align: center; padding: 5px; font-weight: bold; font-size: 12px; margin-bottom: 15px; text-transform: uppercase;">
          ${card.branch} &nbsp;|&nbsp; ${card.semester || '—'} &nbsp;|&nbsp; AY: ${card.academic_year || '—'} &nbsp;|&nbsp; ${card.exam_type || '—'}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 15px; font-size: 12px; border: 1px solid black; padding: 10px;">
          <div><strong>Student Name:</strong> ${capitalizeName(card.name)}</div>
          <div><strong>Registration Number:</strong> ${card.regd_no}</div>
          <div><strong>Branch:</strong> ${card.branch}</div>
          <div><strong>Date of Birth:</strong> ${card.dob || '—'}</div>
          <div><strong>Clearance Status:</strong> ${hasCleared ? 'APPROVED' : 'PENDING APPROVED'}</div>
          <div><strong>Issued At:</strong> ${card.issued_at ? new Date(card.issued_at).toLocaleString() : '—'}</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 11px;">
          <thead>
            <tr style="background: #e6e6e6;">
              <th style="border: 1px solid black; padding: 5px; text-align: center;">Exam Date</th>
              <th style="border: 1px solid black; padding: 5px; text-align: center;">Subject Code</th>
              <th style="border: 1px solid black; padding: 5px; text-align: left;">Subject Name</th>
              <th style="border: 1px solid black; padding: 5px; text-align: center;">Exam Session Time</th>
              <th style="border: 1px solid black; padding: 5px; text-align: center;">Invigilator Signature</th>
            </tr>
          </thead>
          <tbody>
            ${(card.subjects || []).map(s => `
              <tr>
                <td style="border: 1px solid black; padding: 6px; text-align: center;">${fmtDate(s.date)}</td>
                <td style="border: 1px solid black; padding: 6px; text-align: center; font-family: monospace;">${s.code}</td>
                <td style="border: 1px solid black; padding: 6px; text-align: left;">${s.name}</td>
                <td style="border: 1px solid black; padding: 6px; text-align: center;">${s.time}</td>
                <td style="border: 1px solid black; padding: 6px; text-align: center;">_______________</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 12px; margin-top: 30px;">
          <div style="text-align: center; border-top: 1px solid black; padding-top: 5px; margin-top: 20px;">
            Candidate's Signature
          </div>
          <div style="text-align: center; border-top: 1px solid black; padding-top: 5px; margin-top: 20px; font-weight: bold;">
            Controller of Examinations
          </div>
        </div>
      </div>
    `
    window.print()
  }
}

// Print Handler for Official Documents
export const handlePrintOfficialDoc = (app) => {
  if (!app) return
  const printSection = document.getElementById('print-area')
  if (printSection) {
    printSection.innerHTML = `
      <div style="font-family:'Times New Roman', serif; color: black; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid black;">
        <div style="text-align: center; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 15px;">
          <img src="https://outr.ac.in/public/uploads/logo_4.png" alt="OUTR Seal" style="width: 50px; height: 50px; margin: 0 auto 5px; object-fit: contain;" />
          <h2 style="font-size: 16px; font-weight: bold; text-transform: uppercase; margin: 0;">Odisha University of Technology and Research</h2>
          <p style="font-size: 10px; text-transform: uppercase; font-weight: bold; color: #555; margin: 2px 0 0;">Techno Campus, Ghatikia, Bhubaneswar - 751003</p>
          <p style="font-size: 8px; font-weight: bold; color: #777; margin: 2px 0 0;">OFFICE OF THE ACADEMIC RESOLUTION &amp; MANAGEMENT CELL</p>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: bold; margin-bottom: 15px;">
          <span>REF NO: OUTR/AMC/2026/${app.id}</span>
          <span>DATE: ${new Date(app.resolved_at || app.submitted_at).toLocaleDateString()}</span>
        </div>

        <h3 style="text-align: center; font-size: 12px; font-weight: bold; text-decoration: underline; text-transform: uppercase; margin-bottom: 15px;">
          SUBJECT: RESOLUTION ORDER REGARDING ${app.type?.toUpperCase()}
        </h3>

        <p style="font-size: 11px; line-height: 1.5; margin-bottom: 10px;">
          This official resolution statement is issued to <strong>${capitalizeName(app.student_name)}</strong>, registration roll number <strong>#${app.regd_no}</strong>, pursuing course work under <strong>${app.program}</strong> in the department of <strong>${app.school_name || 'School of Computer Science'}</strong>.
        </p>

        <div style="padding-left: 10px; border-left: 2px solid #555; font-style: italic; font-size: 10px; margin-bottom: 15px; color: #444;">
          <strong>Applicant Statement:</strong> "${app.description}"
        </div>

        <p style="font-size: 11px; line-height: 1.5; margin-bottom: 15px;">
          The academic approval cell has reviewed the evaluations submitted by the Faculty Advisor and verified by the Head of School. It is hereby resolved that the request for <strong>${app.type}</strong> stands 
          <strong>${(app.controller_action === 'approved' || app.status === 'resolved') ? 'APPROVED' : 'DECLINED'}</strong>.
        </p>

        ${app.controller_comment ? `
          <p style="font-size: 11px; line-height: 1.5; margin-bottom: 15px;">
            <strong>Special Directives / Conditions:</strong> "${app.controller_comment}"
          </p>
        ` : ''}

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px;">
          <div style="border: 1px solid #10b981; color: #10b981; border-radius: 50%; width: 60px; height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 6px; font-weight: bold; text-align: center; transform: rotate(-12deg); opacity: 0.85; background: rgba(16, 185, 129, 0.05);">
            <span>OUTR</span>
            <span style="border-top: 1px solid #10b981; border-bottom: 1px solid #10b981; padding: 1px 0; margin: 1px 0;">APPROVED</span>
            <span>ACADEMICS</span>
          </div>

          <div style="text-align: center; font-size: 10px; font-weight: bold;">
            <div style="border-top: 1px solid black; width: 120px; padding-top: 5px; margin: 0 auto 3px;"></div>
            <div>
              ${app.forwarded_to === 'dean_pga' ? 'Dr. Debabrata Dhupal' : app.forwarded_to === 'dean_academic' ? 'Dr. Ranjan Kumar Senapati' : 'Dr. Anupama Rath'}
            </div>
            <div style="font-size: 7px; color: #666; text-transform: uppercase; margin-top: 1px;">
              ${app.forwarded_to === 'dean_pga' ? 'Dean, Post Graduate Affairs' : app.forwarded_to === 'dean_academic' ? 'Dean, Academic Affairs' : 'Exam Controller'}
            </div>
            <div style="font-size: 6px; color: #888;">Odisha University of Tech &amp; Research</div>
          </div>
        </div>
      </div>
    `
    window.print()
  }
}
