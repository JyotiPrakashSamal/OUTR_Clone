/* ══════════════════════════════════════════
   wardenScript.js  -  OUTR Warden Portal
   All features: login, search, autocomplete,
   student display, stats, logout
══════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. AUTHORIZED WARDEN CREDENTIALS
   (In production these would never be in JS)
───────────────────────────────────────── */
const WARDEN_ACCOUNTS = [
  { username: 'chiefwarden',  password: 'outr@2025',  name: 'Dr. D. P. Satapathy',  role: 'Chief Warden' },
  { username: 'anjansahoo',   password: 'apjkhr@123', name: 'Mr. Anjan Kumar Sahoo', role: 'Warden, APJKHR' },
  { username: 'dipakswain',   password: 'rhr@123',    name: 'Mr. Dipak Ranjan Swain',role: 'Warden, RHR' },
  { username: 'pramodinisahu',password: 'khr@123',    name: 'Ms. Pramodini Sahu',    role: 'Warden, KHR' },
  { username: 'jasminehansda',password: 'kchr@123',   name: 'Ms. Jasmine Hansda',    role: 'Warden, KCHR' },
  { username: 'admin',        password: 'admin123',   name: 'Admin User',            role: 'Administrator' },
];

/* ─────────────────────────────────────────
   2. DUMMY STUDENT DATA
───────────────────────────────────────── */
const STUDENTS = [
  {
    id: 1,
    name: 'Arjun Kumar Patel',
    rollNumber: '2201001',
    department: 'Computer Science & Engineering',
    hostel: 'APJKHR (Boys)',
    roomNumber: 'A-101',
    roommates: 3,
    fatherName: 'Ramesh Kumar Patel',
    contact: '9876543210',
    photo: null,
  },
  {
    id: 2,
    name: 'Sneha Rani Dash',
    rollNumber: '2201002',
    department: 'Electronics & Telecom',
    hostel: 'KHR (Girls)',
    roomNumber: 'B-205',
    roommates: 2,
    fatherName: 'Suresh Chandra Dash',
    contact: '9876543211',
    photo: null,
  },
  {
    id: 3,
    name: 'Rohit Behera',
    rollNumber: '2201003',
    department: 'Mechanical Engineering',
    hostel: 'RHR (Boys)',
    roomNumber: 'C-308',
    roommates: 4,
    fatherName: 'Bikram Behera',
    contact: '9876543212',
    photo: null,
  },
  {
    id: 4,
    name: 'Priya Mishra',
    rollNumber: '2201004',
    department: 'Civil Engineering',
    hostel: 'KCHR (Girls)',
    roomNumber: 'D-110',
    roommates: 2,
    fatherName: 'Anil Kumar Mishra',
    contact: '9876543213',
    photo: null,
  },
  {
    id: 5,
    name: 'Suresh Nayak',
    rollNumber: '2201005',
    department: 'Electrical Engineering',
    hostel: 'APJKHR (Boys)',
    roomNumber: 'A-203',
    roommates: 3,
    fatherName: 'Mahesh Nayak',
    contact: '9876543214',
    photo: null,
  },
  {
    id: 6,
    name: 'Anjali Mohapatra',
    rollNumber: '2201006',
    department: 'Information Technology',
    hostel: 'KHR (Girls)',
    roomNumber: 'B-302',
    roommates: 2,
    fatherName: 'Dinesh Mohapatra',
    contact: '9876543215',
    photo: null,
  },
  {
    id: 7,
    name: 'Deepak Swain',
    rollNumber: '2201007',
    department: 'Computer Science & Engineering',
    hostel: 'RHR (Boys)',
    roomNumber: 'C-101',
    roommates: 4,
    fatherName: 'Ramakant Swain',
    contact: '9876543216',
    photo: null,
  },
  {
    id: 8,
    name: 'Kavita Sahoo',
    rollNumber: '2201008',
    department: 'Biotechnology',
    hostel: 'KCHR (Girls)',
    roomNumber: 'D-214',
    roommates: 3,
    fatherName: 'Harihar Sahoo',
    contact: '9876543217',
    photo: null,
  },
  {
    id: 9,
    name: 'Manoj Jena',
    rollNumber: '2301009',
    department: 'Mechanical Engineering',
    hostel: 'Outside Campus (Boys)',
    roomNumber: 'OC-B12',
    roommates: 2,
    fatherName: 'Pradip Jena',
    contact: '9876543218',
    photo: null,
  },
  {
    id: 10,
    name: 'Ritu Pradhan',
    rollNumber: '2301010',
    department: 'Chemical Engineering',
    hostel: 'Outside Campus (Girls)',
    roomNumber: 'OC-G07',
    roommates: 2,
    fatherName: 'Bijay Pradhan',
    contact: '9876543219',
    photo: null,
  },
  {
    id: 11,
    name: 'Akash Biswal',
    rollNumber: '2101011',
    department: 'Electronics & Telecom',
    hostel: 'APJKHR (Boys)',
    roomNumber: 'A-405',
    roommates: 3,
    fatherName: 'Tapan Biswal',
    contact: '9876500011',
    photo: null,
  },
  {
    id: 12,
    name: 'Soumya Ranjan Das',
    rollNumber: '2101012',
    department: 'Civil Engineering',
    hostel: 'RHR (Boys)',
    roomNumber: 'C-202',
    roommates: 4,
    fatherName: 'Niranjan Das',
    contact: '9876500012',
    photo: null,
  },
];

/* ─────────────────────────────────────────
   3. HOSTEL STATISTICS DATA
───────────────────────────────────────── */
const HOSTEL_STATS = {
  totalStudents: STUDENTS.length,
  totalRooms: 280,
  occupiedRooms: 214,
  totalWardens: 10,
  capacity: 560,
};
HOSTEL_STATS.vacantRooms = HOSTEL_STATS.totalRooms - HOSTEL_STATS.occupiedRooms;

/* ─────────────────────────────────────────
   4. SESSION MANAGEMENT (sessionStorage)
───────────────────────────────────────── */
const SESSION_KEY = 'outr_warden_session';

function saveSession(warden) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(warden));
}

function getSession() {
  try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
  catch { return null; }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

/* ─────────────────────────────────────────
   5. DOM REFERENCES
───────────────────────────────────────── */
const loginScreen      = document.getElementById('loginScreen');
const dashboard        = document.getElementById('dashboard');
const loginForm        = document.getElementById('loginForm');
const usernameInput    = document.getElementById('username');
const passwordInput    = document.getElementById('password');
const usernameError    = document.getElementById('usernameError');
const passwordError    = document.getElementById('passwordError');
const loginError       = document.getElementById('loginError');
const loginErrorMsg    = document.getElementById('loginErrorMsg');
const loginBtn         = document.getElementById('loginBtn');
const loginBtnText     = document.getElementById('loginBtnText');
const loginSpinner     = document.getElementById('loginSpinner');
const togglePw         = document.getElementById('togglePw');
const eyeIcon          = document.getElementById('eyeIcon');
const loggedWardenName = document.getElementById('loggedWardenName');
const logoutBtn        = document.getElementById('logoutBtn');
const searchInput      = document.getElementById('searchInput');
const clearBtn         = document.getElementById('clearBtn');
const searchBtn        = document.getElementById('searchBtn');
const autocompleteList = document.getElementById('autocompleteList');
const resultSection    = document.getElementById('resultSection');
const resultContent    = document.getElementById('resultContent');

/* ─────────────────────────────────────────
   6. INITIALISATION - check existing session
───────────────────────────────────────── */
(function init() {
  const session = getSession();
  if (session) {
    showDashboard(session);
  }
})();

/* ─────────────────────────────────────────
   7. LOGIN LOGIC
───────────────────────────────────────── */
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();

  const uname = usernameInput.value.trim();
  const pword = passwordInput.value.trim();

  let valid = true;

  if (!uname) {
    usernameError.textContent = 'Username is required.';
    valid = false;
  }
  if (!pword) {
    passwordError.textContent = 'Password is required.';
    valid = false;
  }
  if (!valid) return;

  /* Simulate loading */
  loginBtnText.style.display  = 'none';
  loginSpinner.style.display  = 'inline-block';
  loginBtn.disabled = true;

  setTimeout(() => {
    const found = WARDEN_ACCOUNTS.find(
      w => w.username === uname && w.password === pword
    );

    if (found) {
      saveSession(found);
      loginBtnText.style.display = 'inline';
      loginSpinner.style.display = 'none';
      loginBtn.disabled = false;
      showDashboard(found);
    } else {
      loginErrorMsg.textContent = 'Invalid username or password. Please try again.';
      loginError.classList.add('show');
      loginBtnText.style.display = 'inline';
      loginSpinner.style.display = 'none';
      loginBtn.disabled = false;
      passwordInput.value = '';
      passwordInput.focus();
    }
  }, 900);
});

function clearErrors() {
  usernameError.textContent = '';
  passwordError.textContent = '';
  loginError.classList.remove('show');
}

/* ─────────────────────────────────────────
   8. PASSWORD TOGGLE
───────────────────────────────────────── */
togglePw.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  eyeIcon.className = isHidden ? 'bx bx-show' : 'bx bx-hide';
});

/* ─────────────────────────────────────────
   9. SHOW / HIDE SCREENS
───────────────────────────────────────── */
function showDashboard(warden) {
  loginScreen.style.display = 'none';
  dashboard.style.display   = 'flex';
  dashboard.style.flexDirection = 'column';
  loggedWardenName.textContent = warden.name + ' - ' + warden.role;
  populateStats();
}

function showLogin() {
  dashboard.style.display   = 'none';
  loginScreen.style.display = 'flex';
  loginForm.reset();
  clearErrors();
  resultSection.style.display = 'none';
}

/* ─────────────────────────────────────────
   10. LOGOUT
───────────────────────────────────────── */
logoutBtn.addEventListener('click', () => {
  clearSession();
  searchInput.value = '';
  clearBtn.style.display = 'none';
  autocompleteList.classList.remove('open');
  showLogin();
});

/* ─────────────────────────────────────────
   11. STATISTICS POPULATION (animated count)
───────────────────────────────────────── */
function populateStats() {
  animateCount('statTotalStudents', HOSTEL_STATS.totalStudents);
  animateCount('statTotalRooms',    HOSTEL_STATS.totalRooms);
  animateCount('statOccupied',      HOSTEL_STATS.occupiedRooms);
  animateCount('statVacant',        HOSTEL_STATS.vacantRooms);
  animateCount('statWardens',       HOSTEL_STATS.totalWardens);
  animateCount('statCapacity',      HOSTEL_STATS.capacity);

  /* occupancy bar */
  const pct = Math.round((HOSTEL_STATS.occupiedRooms / HOSTEL_STATS.totalRooms) * 100);
  document.getElementById('occPercent').textContent = pct + '%';
  setTimeout(() => {
    document.getElementById('occFill').style.width = pct + '%';
  }, 300);
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current.toLocaleString();
  }, 40);
}

/* ─────────────────────────────────────────
   12. AUTOCOMPLETE
───────────────────────────────────────── */
searchInput.addEventListener('input', () => {
  const q = searchInput.value.trim().toLowerCase();
  clearBtn.style.display = q ? 'flex' : 'none';

  if (!q || q.length < 2) {
    closeAutocomplete();
    return;
  }

  const matches = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.rollNumber.toLowerCase().includes(q)
  ).slice(0, 6);

  if (!matches.length) { closeAutocomplete(); return; }

  autocompleteList.innerHTML = '';
  matches.forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `
      <i class='bx bx-user'></i>
      <span><strong>${highlight(s.name, q)}</strong> &mdash; ${s.rollNumber}</span>
    `;
    li.addEventListener('mousedown', (e) => {
      e.preventDefault();
      searchInput.value = s.rollNumber;
      closeAutocomplete();
      performSearch(s.rollNumber);
    });
    autocompleteList.appendChild(li);
  });
  autocompleteList.classList.add('open');
});

/* Keyboard navigation for autocomplete */
let acActiveIndex = -1;
searchInput.addEventListener('keydown', (e) => {
  const items = autocompleteList.querySelectorAll('li');
  if (!items.length) return;

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    acActiveIndex = (acActiveIndex + 1) % items.length;
    highlightAC(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    acActiveIndex = (acActiveIndex - 1 + items.length) % items.length;
    highlightAC(items);
  } else if (e.key === 'Enter') {
    if (acActiveIndex >= 0 && items[acActiveIndex]) {
      items[acActiveIndex].dispatchEvent(new MouseEvent('mousedown'));
    }
  } else if (e.key === 'Escape') {
    closeAutocomplete();
  }
});

function highlightAC(items) {
  items.forEach((li, i) => {
    li.classList.toggle('active', i === acActiveIndex);
  });
}

function closeAutocomplete() {
  autocompleteList.classList.remove('open');
  autocompleteList.innerHTML = '';
  acActiveIndex = -1;
}

/* Close autocomplete when clicking outside */
document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-input-wrap')) closeAutocomplete();
});

/* Highlight matching substring */
function highlight(text, query) {
  const re = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(re, '<mark style="background:#fef08a;border-radius:2px;">$1</mark>');
}
function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ─────────────────────────────────────────
   13. SEARCH LOGIC
───────────────────────────────────────── */
searchBtn.addEventListener('click', () => {
  performSearch(searchInput.value.trim());
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    closeAutocomplete();
    performSearch(searchInput.value.trim());
  }
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  clearBtn.style.display = 'none';
  closeAutocomplete();
  resultSection.style.display = 'none';
  searchInput.focus();
});

function performSearch(query) {
  if (!query) return;

  resultSection.style.display = 'block';

  /* Show skeleton loader */
  resultContent.innerHTML = buildSkeleton();

  setTimeout(() => {
    const q = query.toLowerCase();
    const found = STUDENTS.find(s =>
      s.rollNumber.toLowerCase() === q ||
      s.name.toLowerCase() === q ||
      s.name.toLowerCase().includes(q)
    );

    if (found) {
      renderStudentCard(found);
    } else {
      renderNotFound(query);
    }

    /* Scroll to result */
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 700);
}

/* Skeleton loader HTML */
function buildSkeleton() {
  return `
    <div style="background:#fff;border-radius:14px;overflow:hidden;border:1px solid #E2E8F0;">
      <div style="background:#e2e8f0;height:110px;padding:28px 32px;display:flex;align-items:center;gap:24px;">
        <div style="width:88px;height:88px;border-radius:50%;background:#cbd5e1;flex-shrink:0;"></div>
        <div style="flex:1;">
          <div class="skeleton" style="width:40%;height:24px;margin-bottom:12px;"></div>
          <div class="skeleton" style="width:22%;height:16px;"></div>
        </div>
      </div>
      <div style="padding:28px 32px;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:18px;">
          ${Array(6).fill('<div class="skeleton" style="height:64px;border-radius:8px;"></div>').join('')}
        </div>
      </div>
    </div>
  `;
}

/* Render student card */
function renderStudentCard(s) {
  const initials = s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  resultContent.innerHTML = `
    <div class="student-card">
      <div class="student-card-header">
        <div class="student-avatar">${initials}</div>
        <div class="student-header-info">
          <h3>${s.name}</h3>
          <span class="roll"><i class='bx bx-hash'></i> ${s.rollNumber}</span>
        </div>
      </div>
      <div class="student-card-body">
        <div class="detail-grid">
          ${detailItem('bx-book-open',       'Department',       s.department)}
          ${detailItem('bxs-building-house', 'Hostel',           s.hostel)}
          ${detailItem('bx-door-open',       'Room Number',      s.roomNumber)}
          ${detailItem('bxs-group',          'Students in Room', s.roommates + ' students')}
          ${detailItem('bxs-user-detail',    "Father's Name",    s.fatherName)}
          ${detailItem('bx-phone',           'Contact',          s.contact)}
        </div>
      </div>
    </div>
  `;
}

function detailItem(icon, label, value) {
  return `
    <div class="detail-item">
      <div class="detail-icon"><i class='bx ${icon}'></i></div>
      <div class="detail-text">
        <span class="label">${label}</span>
        <span class="value">${value}</span>
      </div>
    </div>
  `;
}

/* Not found message */
function renderNotFound(query) {
  resultContent.innerHTML = `
    <div class="not-found">
      <i class='bx bx-search-alt'></i>
      <h3>No Student Found</h3>
      <p>No record matched "<strong>${escapeHtml(query)}</strong>". Try a different name or roll number.</p>
    </div>
  `;
}

function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
