const STORAGE_KEY = "xtraChoiceAcademyStateV1";
const SESSION_KEY = "xtraChoiceAcademySessionV1";
const SCHOOL_NAME = "X'TRA 'O' CHOICE ACADEMY";
const TODAY = new Date().toISOString().slice(0, 10);

const CLASSES = [
  "Nursery",
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9"
];

const SUBJECTS = [
  "Literacy",
  "Numeracy",
  "Science",
  "ICT",
  "Creative Arts",
  "Social Studies",
  "French",
  "Physical Education",
  "Moral Education"
];

const NAV = {
  admin: [
    ["dashboard", "Dashboard", "dashboard"],
    ["register", "Online Register", "check"],
    ["fees", "Fees", "wallet"],
    ["assessments", "Assessments", "chart"],
    ["assignments", "Assignments", "book"],
    ["people", "People", "people"],
    ["notices", "Information", "megaphone"],
    ["monitoring", "Monitoring", "monitor"],
    ["portals", "Portals", "shield"]
  ],
  teacher: [
    ["dashboard", "Dashboard", "dashboard"],
    ["register", "My Register", "check"],
    ["assessments", "Assessments", "chart"],
    ["assignments", "Assignments", "book"],
    ["notices", "Information", "megaphone"],
    ["students", "Students", "people"]
  ],
  student: [
    ["dashboard", "Dashboard", "dashboard"],
    ["assignments", "Assignments", "book"],
    ["assessments", "Results", "chart"],
    ["register", "Attendance", "check"],
    ["fees", "Fees", "wallet"],
    ["notices", "Information", "megaphone"]
  ],
  parent: [
    ["dashboard", "Dashboard", "dashboard"],
    ["register", "Attendance", "check"],
    ["fees", "Fees", "wallet"],
    ["assessments", "Results", "chart"],
    ["assignments", "Assignments", "book"],
    ["notices", "Information", "megaphone"]
  ]
};

const icons = {
  dashboard: '<svg viewBox="0 0 24 24"><path d="M3 13h8V3H3v10z"></path><path d="M13 21h8V11h-8v10z"></path><path d="M13 3v6h8V3h-8z"></path><path d="M3 21h8v-6H3v6z"></path></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
  wallet: '<svg viewBox="0 0 24 24"><path d="M20 7H5a2 2 0 0 1 0-4h13"></path><path d="M5 7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1z"></path><path d="M16 14h2"></path></svg>',
  chart: '<svg viewBox="0 0 24 24"><path d="M3 3v18h18"></path><path d="M8 17V9"></path><path d="M13 17V5"></path><path d="M18 17v-6"></path></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15z"></path></svg>',
  people: '<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  megaphone: '<svg viewBox="0 0 24 24"><path d="M3 11v2a2 2 0 0 0 2 2h3l7 4V5L8 9H5a2 2 0 0 0-2 2z"></path><path d="M19 8a4 4 0 0 1 0 8"></path></svg>',
  monitor: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2"></rect><path d="M8 20h8"></path><path d="M12 16v4"></path></svg>',
  shield: '<svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>',
  calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"></rect><path d="M16 2v4"></path><path d="M8 2v4"></path><path d="M3 10h18"></path></svg>'
};

let state = loadState();
let session = loadSession();
let activeView = "dashboard";
let selectedRole = "admin";
let viewState = {
  registerClass: "Grade 3",
  registerDate: TODAY,
  feeClass: "All",
  assessmentClass: "Grade 3",
  assessmentSubject: "All",
  assignmentClass: "Grade 3",
  noticeAudience: "All"
};

document.addEventListener("DOMContentLoaded", init);

function init() {
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("roleTabs").addEventListener("click", handleRoleSelect);
  document.getElementById("logoutButton").addEventListener("click", logout);
  document.getElementById("returnAdmin").addEventListener("click", returnToAdmin);
  document.addEventListener("click", handlePageClick);
  document.addEventListener("change", handlePageChange);
  document.addEventListener("submit", handlePortalSubmit);

  document.querySelectorAll("[data-demo]").forEach((button) => {
    button.addEventListener("click", () => fillDemo(button.dataset.demo));
  });

  fillDemo("admin");

  if (session && getCurrentUser()) {
    showApp();
  } else {
    showLogin();
  }
}

function createDefaultState() {
  const staff = [
    {
      id: "staff-t1",
      name: "Mrs. Grace Adeyemi",
      category: "Teaching",
      role: "Early Years Lead",
      classes: ["Nursery", "Kindergarten"],
      subjects: ["Literacy", "Numeracy", "Creative Arts"],
      phone: "0800 100 200"
    },
    {
      id: "staff-t2",
      name: "Mr. Daniel Bassey",
      category: "Teaching",
      role: "Primary Class Teacher",
      classes: ["Grade 1", "Grade 2", "Grade 3"],
      subjects: ["Literacy", "Numeracy", "Science"],
      phone: "0800 100 201"
    },
    {
      id: "staff-t3",
      name: "Ms. Ife Morgan",
      category: "Teaching",
      role: "Upper Primary Teacher",
      classes: ["Grade 4", "Grade 5", "Grade 6"],
      subjects: ["Science", "ICT", "Social Studies"],
      phone: "0800 100 202"
    },
    {
      id: "staff-t4",
      name: "Mr. Victor Cole",
      category: "Teaching",
      role: "Junior Secondary Teacher",
      classes: ["Grade 7", "Grade 8", "Grade 9"],
      subjects: ["Mathematics", "Science", "ICT"],
      phone: "0800 100 203"
    },
    {
      id: "staff-n1",
      name: "Mrs. Lydia James",
      category: "Non-teaching",
      role: "Bursar",
      classes: [],
      subjects: [],
      phone: "0800 100 204"
    },
    {
      id: "staff-n2",
      name: "Mr. Paul Etim",
      category: "Non-teaching",
      role: "Transport Officer",
      classes: [],
      subjects: [],
      phone: "0800 100 205"
    }
  ];

  const names = [
    "Ariella Okoro",
    "David Mensah",
    "Maya Cole",
    "Ethan Johnson",
    "Zara Peters",
    "Samuel King",
    "Nora Williams",
    "Caleb Adams",
    "Talia Brown",
    "Ibrahim Yusuf",
    "Elena Smith"
  ];

  const parents = [
    "Mrs. Chika Okoro",
    "Mr. Kofi Mensah",
    "Mrs. Helen Cole",
    "Mr. James Johnson",
    "Mrs. Rita Peters",
    "Mr. Alfred King",
    "Mrs. Nora Williams",
    "Mr. Caleb Adams",
    "Mrs. Denise Brown",
    "Mr. Musa Yusuf",
    "Mrs. Anna Smith"
  ];

  const students = CLASSES.map((className, index) => ({
    id: `stu-${String(index + 1).padStart(3, "0")}`,
    admissionNo: `XOC-${String(index + 1).padStart(3, "0")}`,
    name: names[index],
    className,
    parentName: parents[index],
    parentPhone: `0800 20${String(index + 1).padStart(2, "0")}`,
    guardianUserId: index === 4 ? "user-parent-1" : "",
    teacherId: teacherForClass(className),
    status: "Active"
  }));

  const fees = students.map((student, index) => {
    const billed = 850 + index * 75;
    const paid = index % 4 === 0 ? billed : index % 3 === 0 ? Math.round(billed * 0.55) : Math.round(billed * 0.82);
    return {
      id: `fee-${student.id}`,
      studentId: student.id,
      term: "Third Term 2025/2026",
      billed,
      paid,
      dueDate: "2026-06-12",
      note: index % 4 === 0 ? "Cleared" : "Balance pending"
    };
  });

  const attendance = students.map((student, index) => {
    const present = index !== 7 && index !== 10;
    return {
      id: `att-${student.id}-${TODAY}`,
      studentId: student.id,
      className: student.className,
      date: TODAY,
      present,
      arrival: present ? (index % 2 === 0 ? "07:46" : "08:04") : "",
      note: present ? "In school" : "Not marked in"
    };
  });

  const assessments = students.flatMap((student, index) => [
    {
      id: `assess-${student.id}-lit`,
      studentId: student.id,
      className: student.className,
      subject: "Literacy",
      title: "Class Work",
      score: 72 + (index % 5) * 4,
      maxScore: 100,
      date: "2026-05-10",
      teacherId: student.teacherId,
      comment: "Consistent participation"
    },
    {
      id: `assess-${student.id}-num`,
      studentId: student.id,
      className: student.className,
      subject: index > 6 ? "Science" : "Numeracy",
      title: "Weekly Test",
      score: 68 + (index % 4) * 6,
      maxScore: 100,
      date: "2026-05-17",
      teacherId: student.teacherId,
      comment: "Keep practising"
    }
  ]);

  return {
    staff,
    students,
    users: [
      {
        id: "user-admin-1",
        role: "admin",
        name: "Mrs. Rebecca Okoro",
        username: "admin",
        password: "admin123",
        title: "School Administrator"
      },
      {
        id: "user-teacher-1",
        role: "teacher",
        name: "Mr. Daniel Bassey",
        username: "teacher",
        password: "teacher123",
        staffId: "staff-t2"
      },
      {
        id: "user-student-1",
        role: "student",
        name: "Zara Peters",
        username: "student",
        password: "student123",
        studentId: "stu-005"
      },
      {
        id: "user-parent-1",
        role: "parent",
        name: "Mrs. Rita Peters",
        username: "parent",
        password: "parent123",
        children: ["stu-005"]
      }
    ],
    fees,
    attendance,
    assessments,
    assignments: [
      {
        id: "asg-001",
        title: "Reading journal",
        className: "Grade 3",
        subject: "Literacy",
        dueDate: "2026-05-29",
        details: "Read one story and write five new words.",
        createdBy: "staff-t2",
        submissions: [{ studentId: "stu-005", status: "Pending", submittedAt: "" }]
      },
      {
        id: "asg-002",
        title: "Plant observation",
        className: "Grade 5",
        subject: "Science",
        dueDate: "2026-05-31",
        details: "Observe a plant for three days and record changes.",
        createdBy: "staff-t3",
        submissions: []
      },
      {
        id: "asg-003",
        title: "ICT safety poster",
        className: "Grade 8",
        subject: "ICT",
        dueDate: "2026-06-03",
        details: "Design a one-page poster about staying safe online.",
        createdBy: "staff-t4",
        submissions: []
      }
    ],
    announcements: [
      {
        id: "note-001",
        audience: "Teaching staff",
        title: "Assessment scores due",
        body: "Upload continuous assessment scores before Friday closing.",
        date: "2026-05-24",
        author: "Mrs. Rebecca Okoro"
      },
      {
        id: "note-002",
        audience: "Non-teaching staff",
        title: "Transport rota update",
        body: "New morning pickup rotation starts on Monday.",
        date: "2026-05-24",
        author: "Mrs. Rebecca Okoro"
      },
      {
        id: "note-003",
        audience: "Parents",
        title: "Open day",
        body: "Parents can meet class teachers on Thursday from 10:00.",
        date: "2026-05-23",
        author: "Admin Office"
      }
    ],
    activities: [
      {
        id: "act-001",
        time: new Date().toISOString(),
        actor: "Mrs. Rebecca Okoro",
        role: "admin",
        area: "Monitoring",
        action: "Reviewed attendance dashboard"
      },
      {
        id: "act-002",
        time: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
        actor: "Mr. Daniel Bassey",
        role: "teacher",
        area: "Assignments",
        action: "Posted Grade 3 reading journal"
      }
    ],
    timetable: [
      { day: "Monday", className: "Grade 3", period: "08:30", subject: "Literacy", teacherId: "staff-t2" },
      { day: "Tuesday", className: "Grade 3", period: "10:15", subject: "Science", teacherId: "staff-t2" },
      { day: "Wednesday", className: "Grade 6", period: "09:20", subject: "ICT", teacherId: "staff-t3" },
      { day: "Thursday", className: "Grade 9", period: "11:00", subject: "Science", teacherId: "staff-t4" }
    ],
    inventory: [
      { item: "Library books", count: 420, status: "Good" },
      { item: "First aid kits", count: 8, status: "Check monthly" },
      { item: "Tablets", count: 18, status: "ICT lab" }
    ]
  };
}

function teacherForClass(className) {
  if (["Nursery", "Kindergarten"].includes(className)) return "staff-t1";
  if (["Grade 1", "Grade 2", "Grade 3"].includes(className)) return "staff-t2";
  if (["Grade 4", "Grade 5", "Grade 6"].includes(className)) return "staff-t3";
  return "staff-t4";
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.students)) return saved;
  } catch (error) {
    console.warn(error);
  }
  const fresh = createDefaultState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY));
  } catch (error) {
    return null;
  }
}

function saveSession() {
  if (session) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

function handleRoleSelect(event) {
  const button = event.target.closest("[data-role]");
  if (!button) return;
  selectedRole = button.dataset.role;
  document.querySelectorAll(".role-tab").forEach((tab) => tab.classList.toggle("is-active", tab === button));
  fillDemo(selectedRole);
}

function fillDemo(role) {
  selectedRole = role;
  document.querySelectorAll(".role-tab").forEach((tab) => tab.classList.toggle("is-active", tab.dataset.role === role));
  const user = state.users.find((item) => item.role === role);
  if (!user) return;
  document.getElementById("username").value = user.username;
  document.getElementById("password").value = user.password;
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById("username").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const user = state.users.find(
    (item) => item.role === selectedRole && item.username.toLowerCase() === username && item.password === password
  );

  if (!user) {
    showToast("Login details were not accepted.");
    return;
  }

  session = { userId: user.id, role: user.role, adminUserId: null };
  saveSession();
  logActivity(user, "Signed in", "Portal");
  showApp();
}

function showLogin() {
  document.getElementById("loginScreen").hidden = false;
  document.getElementById("appShell").hidden = true;
}

function showApp() {
  document.getElementById("loginScreen").hidden = true;
  document.getElementById("appShell").hidden = false;
  activeView = ensureAllowedView(activeView);
  renderShell();
}

function logout() {
  const user = getCurrentUser();
  if (user) logActivity(user, "Signed out", "Portal");
  session = null;
  saveSession();
  activeView = "dashboard";
  showLogin();
}

function returnToAdmin() {
  if (!session || !session.adminUserId) return;
  const adminId = session.adminUserId;
  session = { userId: adminId, role: "admin", adminUserId: null };
  saveSession();
  activeView = "portals";
  renderShell();
  showToast("Returned to admin control.");
}

function previewPortal(role) {
  const adminUser = getAdminUser();
  const portalUser = state.users.find((user) => user.role === role);
  if (!adminUser || !portalUser) return;
  session = { userId: portalUser.id, role: role, adminUserId: adminUser.id };
  saveSession();
  activeView = "dashboard";
  logActivity(adminUser, `Opened ${role} portal preview`, "Admin");
  renderShell();
}

function getAdminUser() {
  if (session && session.adminUserId) {
    return state.users.find((user) => user.id === session.adminUserId);
  }
  const current = getCurrentUser();
  return current && current.role === "admin" ? current : null;
}

function getCurrentUser() {
  if (!session) return null;
  return state.users.find((user) => user.id === session.userId) || null;
}

function ensureAllowedView(view) {
  const user = getCurrentUser();
  if (!user) return "dashboard";
  return NAV[user.role].some(([id]) => id === view) ? view : "dashboard";
}

function renderShell() {
  const user = getCurrentUser();
  if (!user) {
    showLogin();
    return;
  }

  const nav = NAV[user.role];
  document.getElementById("portalNav").innerHTML = nav
    .map(
      ([id, label, iconName]) => `
        <button type="button" class="nav-item ${activeView === id ? "is-active" : ""}" data-nav="${id}">
          ${icons[iconName]}
          <span>${label}</span>
        </button>
      `
    )
    .join("");

  const pageItem = nav.find(([id]) => id === activeView) || nav[0];
  document.getElementById("pageTitle").textContent = pageItem[1];
  document.getElementById("portalLabel").textContent = `${titleCase(user.role)} Portal`;
  document.getElementById("userBadge").textContent = `${user.name} | ${titleCase(user.role)}`;
  document.getElementById("returnAdmin").hidden = !(session && session.adminUserId);
  renderContent();
}

function renderContent() {
  activeView = ensureAllowedView(activeView);
  const renderers = {
    dashboard: renderDashboard,
    register: renderRegister,
    fees: renderFees,
    assessments: renderAssessments,
    assignments: renderAssignments,
    people: renderPeople,
    notices: renderNotices,
    monitoring: renderMonitoring,
    portals: renderPortals,
    students: renderStudents
  };
  document.getElementById("content").innerHTML = renderers[activeView]();
}

function handlePageClick(event) {
  const navButton = event.target.closest("[data-nav]");
  if (navButton) {
    activeView = navButton.dataset.nav;
    renderShell();
    return;
  }

  const viewButton = event.target.closest("[data-view]");
  if (viewButton) {
    activeView = viewButton.dataset.view;
    renderShell();
    return;
  }

  const action = event.target.closest("[data-action]");
  if (!action) return;

  if (action.dataset.action === "mark-fee-paid") {
    markFeePaid(action.dataset.id);
  }

  if (action.dataset.action === "submit-assignment") {
    submitAssignment(action.dataset.id);
  }

  if (action.dataset.action === "portal-preview") {
    previewPortal(action.dataset.role);
  }

  if (action.dataset.action === "reset-data") {
    resetData();
  }
}

function handlePageChange(event) {
  const filter = event.target.closest("[data-filter]");
  if (!filter) return;
  viewState[filter.dataset.filter] = filter.value;
  renderContent();
}

function handlePortalSubmit(event) {
  const form = event.target.closest("[data-form]");
  if (!form) return;
  event.preventDefault();

  const handlers = {
    attendance: saveAttendance,
    fee: saveFee,
    assessment: saveAssessment,
    assignment: saveAssignment,
    notice: saveNotice,
    student: saveStudent,
    staff: saveStaff
  };

  const handler = handlers[form.dataset.form];
  if (handler) handler(form);
}

function renderDashboard() {
  const user = getCurrentUser();
  if (user.role === "admin") return renderAdminDashboard();
  if (user.role === "teacher") return renderTeacherDashboard();
  if (user.role === "student") return renderStudentDashboard();
  return renderParentDashboard();
}

function renderAdminDashboard() {
  const presentToday = state.attendance.filter((item) => item.date === TODAY && item.present).length;
  const unpaid = state.fees.filter((fee) => fee.billed > fee.paid).length;
  const openAssignments = state.assignments.filter((assignment) => new Date(assignment.dueDate) >= startOfToday()).length;

  return `
    <section class="hero-panel">
      <p class="eyebrow">Admin control center</p>
      <h3>${SCHOOL_NAME}</h3>
      <p>All school activity, teaching updates, parent visibility, payments, class work, and staff information are controlled from here.</p>
      <div class="hero-actions">
        <button class="secondary-button" type="button" data-view="register">Open register</button>
        <button class="secondary-button" type="button" data-view="fees">Manage fees</button>
        <button class="secondary-button" type="button" data-view="portals">View portals</button>
      </div>
    </section>

    <section class="stats-grid">
      ${metric("Students", state.students.length, "Nursery to Grade 9")}
      ${metric("Staff", state.staff.length, "Teaching and non-teaching")}
      ${metric("In school today", presentToday, `${state.students.length - presentToday} not marked present`)}
      ${metric("Fee balances", unpaid, "Accounts needing follow-up")}
    </section>

    <section class="module-grid">
      ${moduleCard("Online register", "Live daily attendance for every class, with parent-facing status.", "check", "register")}
      ${moduleCard("Class assessments", "Scores are grouped by class, subject, pupil, and teacher.", "chart", "assessments")}
      ${moduleCard("Assignments", "Teachers can post work and students can submit from their portal.", "book", "assignments")}
      ${moduleCard("Staff information", "Post updates for teaching staff, non-teaching staff, parents, or students.", "megaphone", "notices")}
      ${moduleCard("Fees", "Track bills, payments, balances, and due dates per child.", "wallet", "fees")}
      ${moduleCard("Monitoring", "See portal logins and school actions in one admin view.", "monitor", "monitoring")}
    </section>

    <section class="split-grid">
      <div class="tool-panel">
        <div class="section-heading">
          <h3>Recent activity</h3>
          <button class="small-button" type="button" data-view="monitoring">Open log</button>
        </div>
        ${activityList(state.activities.slice(0, 5))}
      </div>
      <div class="tool-panel">
        <div class="section-heading">
          <h3>School extras</h3>
        </div>
        <ul class="mini-list">
          <li><span>Timetable entries</span><strong>${state.timetable.length}</strong></li>
          <li><span>Inventory checks</span><strong>${state.inventory.length}</strong></li>
          <li><span>Open assignments</span><strong>${openAssignments}</strong></li>
          <li><span>Staff notices</span><strong>${state.announcements.filter((item) => item.audience.includes("staff")).length}</strong></li>
        </ul>
      </div>
    </section>
  `;
}

function renderTeacherDashboard() {
  const user = getCurrentUser();
  const staff = getTeacherStaff(user);
  const classes = allowedClassesForUser(user);
  const students = state.students.filter((student) => classes.includes(student.className));
  const present = state.attendance.filter(
    (item) => item.date === TODAY && item.present && students.some((student) => student.id === item.studentId)
  ).length;
  const assignments = state.assignments.filter((assignment) => classes.includes(assignment.className));

  return `
    <section class="hero-panel">
      <p class="eyebrow">Teacher workspace</p>
      <h3>${esc(user.name)}</h3>
      <p>${staff ? esc(staff.role) : "Teacher"} | ${classes.join(", ")}</p>
      <div class="hero-actions">
        <button class="secondary-button" type="button" data-view="register">Take register</button>
        <button class="secondary-button" type="button" data-view="assignments">Post assignment</button>
        <button class="secondary-button" type="button" data-view="assessments">Add scores</button>
      </div>
    </section>
    <section class="stats-grid">
      ${metric("My pupils", students.length, classes.join(", "))}
      ${metric("Present today", present, `${students.length - present} not marked present`)}
      ${metric("Assignments", assignments.length, "For my classes")}
      ${metric("Subjects", staff ? staff.subjects.length : 0, staff ? staff.subjects.join(", ") : "Assigned subjects")}
    </section>
    <section class="split-grid">
      <div class="tool-panel">
        <div class="section-heading"><h3>My timetable</h3></div>
        ${timetableTable(state.timetable.filter((item) => classes.includes(item.className)))}
      </div>
      <div class="tool-panel">
        <div class="section-heading"><h3>Staff notices</h3></div>
        ${noticeList(visibleAnnouncements().slice(0, 4))}
      </div>
    </section>
  `;
}

function renderStudentDashboard() {
  const student = getStudentForUser(getCurrentUser());
  const attendance = attendanceForStudent(student.id);
  const fees = feesForStudents([student.id]);
  const assignments = state.assignments.filter((assignment) => assignment.className === student.className);
  const pending = assignments.filter((assignment) => submissionStatus(assignment, student.id) !== "Submitted").length;

  return `
    <section class="hero-panel">
      <p class="eyebrow">Student portal</p>
      <h3>${esc(student.name)}</h3>
      <p>${esc(student.className)} | ${esc(student.admissionNo)}</p>
      <div class="hero-actions">
        <button class="secondary-button" type="button" data-view="assignments">Assignments</button>
        <button class="secondary-button" type="button" data-view="assessments">Results</button>
      </div>
    </section>
    <section class="stats-grid">
      ${metric("Attendance", `${attendance.present}/${attendance.total}`, "Marked present")}
      ${metric("Pending work", pending, "Assignments to submit")}
      ${metric("Fee balance", money(totalBalance(fees)), "Current term")}
      ${metric("Latest score", latestScore(student.id), "Class assessment")}
    </section>
    <section class="split-grid">
      <div class="tool-panel">
        <div class="section-heading"><h3>Assignments</h3></div>
        ${assignmentCards(assignments, [student.id])}
      </div>
      <div class="tool-panel">
        <div class="section-heading"><h3>Recent results</h3></div>
        ${scoreCards(assessmentsForStudents([student.id]).slice(0, 4))}
      </div>
    </section>
  `;
}

function renderParentDashboard() {
  const children = getChildrenForParent(getCurrentUser());
  const child = children[0];
  const todays = state.attendance.find((item) => item.studentId === child.id && item.date === TODAY);
  const fees = feesForStudents(children.map((item) => item.id));
  const assignments = state.assignments.filter((assignment) => children.some((student) => student.className === assignment.className));

  return `
    <section class="hero-panel">
      <p class="eyebrow">Parent portal</p>
      <h3>${esc(child.name)}</h3>
      <p>${esc(child.className)} | Attendance today: ${todays && todays.present ? "In school" : "Not marked present"}</p>
      <div class="hero-actions">
        <button class="secondary-button" type="button" data-view="register">Attendance</button>
        <button class="secondary-button" type="button" data-view="fees">Fees</button>
        <button class="secondary-button" type="button" data-view="assignments">Assignments</button>
      </div>
    </section>
    <section class="stats-grid">
      ${metric("Children", children.length, children.map((item) => item.className).join(", "))}
      ${metric("Today", todays && todays.present ? "Present" : "Absent", todays && todays.arrival ? `Arrived ${todays.arrival}` : "Awaiting mark")}
      ${metric("Fee balance", money(totalBalance(fees)), "All linked children")}
      ${metric("Assignments", assignments.length, "Active class work")}
    </section>
    <section class="split-grid">
      <div class="tool-panel">
        <div class="section-heading"><h3>Attendance snapshot</h3></div>
        ${attendanceSummaryTable(children)}
      </div>
      <div class="tool-panel">
        <div class="section-heading"><h3>Parent notices</h3></div>
        ${noticeList(visibleAnnouncements().slice(0, 4))}
      </div>
    </section>
  `;
}

function renderRegister() {
  const user = getCurrentUser();
  const editable = ["admin", "teacher"].includes(user.role);
  const classes = allowedClassesForUser(user);
  const selectedClass = classes.includes(viewState.registerClass) ? viewState.registerClass : classes[0];
  viewState.registerClass = selectedClass;

  if (!editable) {
    const students = user.role === "student" ? [getStudentForUser(user)] : getChildrenForParent(user);
    return `
      <section class="tool-panel">
        <div class="section-heading"><h3>Attendance</h3></div>
        ${attendanceSummaryTable(students)}
      </section>
    `;
  }

  const classStudents = state.students.filter((student) => student.className === selectedClass);
  const rows = classStudents
    .map((student) => {
      const record = state.attendance.find((item) => item.studentId === student.id && item.date === viewState.registerDate);
      const checked = !record || record.present ? "checked" : "";
      return `
        <div class="student-row">
          <div>
            <strong>${esc(student.name)}</strong>
            <p>${esc(student.admissionNo)} | ${esc(student.parentName)}</p>
          </div>
          <label class="toggle">
            <input type="checkbox" name="present-${student.id}" ${checked}>
            Present
          </label>
          <label class="field">
            <span>Arrival</span>
            <input type="time" name="arrival-${student.id}" value="${record ? esc(record.arrival) : "08:00"}">
          </label>
          <label class="field">
            <span>Note</span>
            <input type="text" name="note-${student.id}" value="${record ? esc(record.note) : ""}" placeholder="Optional">
          </label>
        </div>
      `;
    })
    .join("");

  return `
    <section class="tool-panel">
      <form data-form="attendance">
        <div class="section-heading">
          <h3>Daily online register</h3>
          <button class="primary-button" type="submit">Save register</button>
        </div>
        <div class="filters" style="margin-top:16px">
          <label class="field">
            <span>Class</span>
            <select name="className" data-filter="registerClass">
              ${classes.map((item) => option(item, selectedClass)).join("")}
            </select>
          </label>
          <label class="field">
            <span>Date</span>
            <input type="date" name="date" value="${viewState.registerDate}" data-filter="registerDate">
          </label>
        </div>
        <div class="stack" style="margin-top:16px">
          ${rows || emptyState("No pupils found for this class.")}
        </div>
      </form>
    </section>
    <section class="tool-panel">
      <div class="section-heading"><h3>Parent-facing status</h3></div>
      ${attendanceSummaryTable(classStudents)}
    </section>
  `;
}

function renderFees() {
  const user = getCurrentUser();
  const editable = user.role === "admin";
  const students = visibleStudentsForRole(user);
  const classOptions = ["All", ...CLASSES];
  const selectedClass = classOptions.includes(viewState.feeClass) ? viewState.feeClass : "All";
  const studentIds = students
    .filter((student) => selectedClass === "All" || student.className === selectedClass)
    .map((student) => student.id);
  const fees = feesForStudents(studentIds);

  return `
    ${editable ? renderFeeForm() : ""}
    <section class="tool-panel">
      <div class="section-heading">
        <h3>School fees</h3>
        <label class="field" style="max-width:240px">
          <span>Class</span>
          <select data-filter="feeClass">
            ${classOptions.map((item) => option(item, selectedClass)).join("")}
          </select>
        </label>
      </div>
      <div class="table-wrap" style="margin-top:16px">
        <table>
          <thead>
            <tr>
              <th>Pupil</th>
              <th>Class</th>
              <th>Term</th>
              <th>Billed</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Status</th>
              ${editable ? "<th>Action</th>" : ""}
            </tr>
          </thead>
          <tbody>
            ${fees.map((fee) => feeRow(fee, editable)).join("") || `<tr><td colspan="${editable ? 8 : 7}">No fee records.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderFeeForm() {
  return `
    <section class="tool-panel">
      <form data-form="fee">
        <div class="section-heading">
          <h3>Record fee payment</h3>
          <button class="primary-button" type="submit">Save fee</button>
        </div>
        <div class="form-grid" style="margin-top:16px">
          <label class="field">
            <span>Pupil</span>
            <select name="studentId" required>
              ${state.students.map((student) => `<option value="${student.id}">${esc(student.name)} - ${esc(student.className)}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Term</span>
            <input name="term" value="Third Term 2025/2026" required>
          </label>
          <label class="field">
            <span>Billed</span>
            <input name="billed" type="number" min="0" value="950" required>
          </label>
          <label class="field">
            <span>Paid</span>
            <input name="paid" type="number" min="0" value="0" required>
          </label>
          <label class="field">
            <span>Due date</span>
            <input name="dueDate" type="date" value="2026-06-12" required>
          </label>
          <label class="field">
            <span>Note</span>
            <input name="note" placeholder="Receipt note">
          </label>
        </div>
      </form>
    </section>
  `;
}

function renderAssessments() {
  const user = getCurrentUser();
  const editable = ["admin", "teacher"].includes(user.role);
  const students = visibleStudentsForRole(user);
  const classes = editable ? allowedClassesForUser(user) : [...new Set(students.map((student) => student.className))];
  const selectedClass = classes.includes(viewState.assessmentClass) ? viewState.assessmentClass : classes[0];
  viewState.assessmentClass = selectedClass;
  const selectedSubject = SUBJECTS.includes(viewState.assessmentSubject) ? viewState.assessmentSubject : "All";
  const studentIds = students.filter((student) => student.className === selectedClass).map((student) => student.id);
  const assessments = assessmentsForStudents(studentIds).filter(
    (item) => selectedSubject === "All" || item.subject === selectedSubject
  );

  return `
    ${editable ? renderAssessmentForm(classes, selectedClass) : ""}
    <section class="tool-panel">
      <div class="section-heading">
        <h3>Class assessment</h3>
      </div>
      <div class="filters" style="margin-top:16px">
        <label class="field">
          <span>Class</span>
          <select data-filter="assessmentClass">
            ${classes.map((item) => option(item, selectedClass)).join("")}
          </select>
        </label>
        <label class="field">
          <span>Subject</span>
          <select data-filter="assessmentSubject">
            <option value="All">All subjects</option>
            ${SUBJECTS.map((item) => option(item, selectedSubject)).join("")}
          </select>
        </label>
      </div>
      <div class="list-grid" style="margin-top:16px">
        ${scoreCards(assessments)}
      </div>
    </section>
  `;
}

function renderAssessmentForm(classes, selectedClass) {
  const classStudents = state.students.filter((student) => student.className === selectedClass);
  return `
    <section class="tool-panel">
      <form data-form="assessment">
        <div class="section-heading">
          <h3>Add assessment score</h3>
          <button class="primary-button" type="submit">Save score</button>
        </div>
        <div class="form-grid" style="margin-top:16px">
          <label class="field">
            <span>Class</span>
            <select name="className" data-filter="assessmentClass">
              ${classes.map((item) => option(item, selectedClass)).join("")}
            </select>
          </label>
          <label class="field">
            <span>Subject</span>
            <select name="subject" required>
              ${SUBJECTS.map((item) => `<option>${item}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Pupil</span>
            <select name="studentId" required>
              ${classStudents.map((student) => `<option value="${student.id}">${esc(student.name)}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Title</span>
            <input name="title" value="Class Assessment" required>
          </label>
          <label class="field">
            <span>Score</span>
            <input name="score" type="number" min="0" max="100" value="80" required>
          </label>
          <label class="field">
            <span>Max score</span>
            <input name="maxScore" type="number" min="1" value="100" required>
          </label>
          <label class="field full">
            <span>Comment</span>
            <input name="comment" placeholder="Teacher comment">
          </label>
        </div>
      </form>
    </section>
  `;
}

function renderAssignments() {
  const user = getCurrentUser();
  const editable = ["admin", "teacher"].includes(user.role);
  const students = visibleStudentsForRole(user);
  const classes = editable ? allowedClassesForUser(user) : [...new Set(students.map((student) => student.className))];
  const selectedClass = classes.includes(viewState.assignmentClass) ? viewState.assignmentClass : classes[0];
  viewState.assignmentClass = selectedClass;
  const classStudentIds = students.filter((student) => student.className === selectedClass).map((student) => student.id);
  const assignments = state.assignments.filter((assignment) => assignment.className === selectedClass);

  return `
    ${editable ? renderAssignmentForm(classes, selectedClass) : ""}
    <section class="tool-panel">
      <div class="section-heading">
        <h3>Assignments</h3>
        <label class="field" style="max-width:240px">
          <span>Class</span>
          <select data-filter="assignmentClass">
            ${classes.map((item) => option(item, selectedClass)).join("")}
          </select>
        </label>
      </div>
      <div class="list-grid" style="margin-top:16px">
        ${assignmentCards(assignments, classStudentIds)}
      </div>
    </section>
  `;
}

function renderAssignmentForm(classes, selectedClass) {
  return `
    <section class="tool-panel">
      <form data-form="assignment">
        <div class="section-heading">
          <h3>Give assignment</h3>
          <button class="primary-button" type="submit">Post assignment</button>
        </div>
        <div class="form-grid" style="margin-top:16px">
          <label class="field">
            <span>Class</span>
            <select name="className" data-filter="assignmentClass">
              ${classes.map((item) => option(item, selectedClass)).join("")}
            </select>
          </label>
          <label class="field">
            <span>Subject</span>
            <select name="subject">
              ${SUBJECTS.map((item) => `<option>${item}</option>`).join("")}
            </select>
          </label>
          <label class="field">
            <span>Due date</span>
            <input name="dueDate" type="date" value="2026-06-03" required>
          </label>
          <label class="field">
            <span>Title</span>
            <input name="title" placeholder="Assignment title" required>
          </label>
          <label class="field full">
            <span>Details</span>
            <textarea name="details" required></textarea>
          </label>
        </div>
      </form>
    </section>
  `;
}

function renderPeople() {
  return `
    <section class="class-grid">
      ${CLASSES.map((item) => `<span class="class-chip">${item}</span>`).join("")}
    </section>
    <section class="split-grid">
      <div class="tool-panel">
        <form data-form="student">
          <div class="section-heading">
            <h3>Add pupil</h3>
            <button class="primary-button" type="submit">Save pupil</button>
          </div>
          <div class="form-grid" style="margin-top:16px">
            <label class="field">
              <span>Name</span>
              <input name="name" required>
            </label>
            <label class="field">
              <span>Class</span>
              <select name="className">${CLASSES.map((item) => `<option>${item}</option>`).join("")}</select>
            </label>
            <label class="field">
              <span>Parent name</span>
              <input name="parentName" required>
            </label>
            <label class="field">
              <span>Parent phone</span>
              <input name="parentPhone" required>
            </label>
          </div>
        </form>
      </div>
      <div class="tool-panel">
        <form data-form="staff">
          <div class="section-heading">
            <h3>Add staff</h3>
            <button class="primary-button" type="submit">Save staff</button>
          </div>
          <div class="form-grid" style="margin-top:16px">
            <label class="field">
              <span>Name</span>
              <input name="name" required>
            </label>
            <label class="field">
              <span>Category</span>
              <select name="category">
                <option>Teaching</option>
                <option>Non-teaching</option>
              </select>
            </label>
            <label class="field">
              <span>Role</span>
              <input name="role" required>
            </label>
            <label class="field">
              <span>Class</span>
              <select name="className">
                <option value="">None</option>
                ${CLASSES.map((item) => `<option>${item}</option>`).join("")}
              </select>
            </label>
          </div>
        </form>
      </div>
    </section>
    <section class="split-grid">
      <div class="tool-panel">
        <div class="section-heading"><h3>Pupils</h3></div>
        <div class="list-grid" style="margin-top:16px">
          ${state.students.map(studentCard).join("")}
        </div>
      </div>
      <div class="tool-panel">
        <div class="section-heading"><h3>Staff</h3></div>
        <div class="list-grid" style="margin-top:16px">
          ${state.staff.map(staffCard).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderStudents() {
  const user = getCurrentUser();
  const classes = allowedClassesForUser(user);
  const students = state.students.filter((student) => classes.includes(student.className));
  return `
    <section class="tool-panel">
      <div class="section-heading"><h3>My pupils</h3></div>
      <div class="list-grid" style="margin-top:16px">
        ${students.map(studentCard).join("")}
      </div>
    </section>
  `;
}

function renderNotices() {
  const user = getCurrentUser();
  const editable = user.role === "admin";
  const notices = visibleAnnouncements();
  return `
    ${editable ? renderNoticeForm() : ""}
    <section class="tool-panel">
      <div class="section-heading">
        <h3>Information board</h3>
        ${editable ? `<span class="role-pill">Teaching and non-teaching staff</span>` : ""}
      </div>
      <div class="list-grid" style="margin-top:16px">
        ${noticeCards(notices)}
      </div>
    </section>
  `;
}

function renderNoticeForm() {
  return `
    <section class="tool-panel">
      <form data-form="notice">
        <div class="section-heading">
          <h3>Post information</h3>
          <button class="primary-button" type="submit">Publish</button>
        </div>
        <div class="form-grid" style="margin-top:16px">
          <label class="field">
            <span>Audience</span>
            <select name="audience">
              <option>Teaching staff</option>
              <option>Non-teaching staff</option>
              <option>All staff</option>
              <option>Parents</option>
              <option>Students</option>
              <option>Everyone</option>
            </select>
          </label>
          <label class="field">
            <span>Title</span>
            <input name="title" required>
          </label>
          <label class="field full">
            <span>Information</span>
            <textarea name="body" required></textarea>
          </label>
        </div>
      </form>
    </section>
  `;
}

function renderMonitoring() {
  const teacherActions = state.activities.filter((item) => item.role === "teacher").length;
  const studentActions = state.activities.filter((item) => item.role === "student").length;
  const parentActions = state.activities.filter((item) => item.role === "parent").length;
  return `
    <section class="stats-grid">
      ${metric("Teacher actions", teacherActions, "Portal activity")}
      ${metric("Student actions", studentActions, "Submissions and access")}
      ${metric("Parent actions", parentActions, "Monitoring access")}
      ${metric("Records", state.activities.length, "Full activity log")}
    </section>
    <section class="split-grid">
      <div class="tool-panel">
        <div class="section-heading"><h3>Activity log</h3></div>
        ${activityList(state.activities)}
      </div>
      <div class="tool-panel">
        <div class="section-heading"><h3>Attendance watch</h3></div>
        ${attendanceSummaryTable(state.students)}
      </div>
    </section>
  `;
}

function renderPortals() {
  return `
    <section class="hero-panel">
      <p class="eyebrow">Admin portal access</p>
      <h3>Control and monitor every portal</h3>
      <p>Admin can open each portal view, watch activity, publish notices, update records, and supervise teacher, student, and parent workflows.</p>
      <div class="hero-actions">
        <button class="secondary-button" type="button" data-action="portal-preview" data-role="teacher">Teacher portal</button>
        <button class="secondary-button" type="button" data-action="portal-preview" data-role="student">Student portal</button>
        <button class="secondary-button" type="button" data-action="portal-preview" data-role="parent">Parent portal</button>
      </div>
    </section>
    <section class="module-grid">
      ${moduleCard("Teacher portal", "Registers, assessments, assignments, notices, and pupil lists.", "people", "portals")}
      ${moduleCard("Student portal", "Assignments, submissions, results, attendance, fees, and notices.", "book", "portals")}
      ${moduleCard("Parent portal", "Attendance today, fee balances, results, assignments, and notices.", "shield", "portals")}
    </section>
    <section class="tool-panel">
      <div class="section-heading">
        <h3>Demo data</h3>
        <button class="danger-button" type="button" data-action="reset-data">Reset</button>
      </div>
      <ul class="mini-list" style="margin-top:12px">
        <li><span>Admin</span><strong>admin / admin123</strong></li>
        <li><span>Teacher</span><strong>teacher / teacher123</strong></li>
        <li><span>Student</span><strong>student / student123</strong></li>
        <li><span>Parent</span><strong>parent / parent123</strong></li>
      </ul>
    </section>
  `;
}

function saveAttendance(form) {
  const user = getCurrentUser();
  const data = new FormData(form);
  const className = data.get("className");
  const date = data.get("date");
  const students = state.students.filter((student) => student.className === className);

  state.attendance = state.attendance.filter(
    (record) => !(record.date === date && students.some((student) => student.id === record.studentId))
  );

  students.forEach((student) => {
    const present = data.has(`present-${student.id}`);
    state.attendance.push({
      id: `att-${student.id}-${date}`,
      studentId: student.id,
      className,
      date,
      present,
      arrival: present ? data.get(`arrival-${student.id}`) || "" : "",
      note: data.get(`note-${student.id}`) || (present ? "In school" : "Absent")
    });
  });

  saveState();
  logActivity(user, `Saved ${className} register`, "Online Register");
  showToast("Register saved.");
  renderContent();
}

function saveFee(form) {
  const user = getCurrentUser();
  const data = new FormData(form);
  const studentId = data.get("studentId");
  const term = data.get("term");
  const existing = state.fees.find((fee) => fee.studentId === studentId && fee.term === term);
  const record = {
    id: existing ? existing.id : `fee-${Date.now()}`,
    studentId,
    term,
    billed: Number(data.get("billed")),
    paid: Number(data.get("paid")),
    dueDate: data.get("dueDate"),
    note: data.get("note") || ""
  };

  if (existing) {
    Object.assign(existing, record);
  } else {
    state.fees.unshift(record);
  }

  saveState();
  logActivity(user, "Updated fee record", "Fees");
  showToast("Fee record saved.");
  renderContent();
}

function saveAssessment(form) {
  const user = getCurrentUser();
  const data = new FormData(form);
  const teacher = user.role === "teacher" ? getTeacherStaff(user) : null;
  const record = {
    id: `assess-${Date.now()}`,
    studentId: data.get("studentId"),
    className: data.get("className"),
    subject: data.get("subject"),
    title: data.get("title"),
    score: Number(data.get("score")),
    maxScore: Number(data.get("maxScore")),
    date: TODAY,
    teacherId: teacher ? teacher.id : teacherForClass(data.get("className")),
    comment: data.get("comment") || ""
  };

  state.assessments.unshift(record);
  saveState();
  logActivity(user, `Saved ${record.subject} assessment`, "Assessments");
  showToast("Assessment score saved.");
  renderContent();
}

function saveAssignment(form) {
  const user = getCurrentUser();
  const data = new FormData(form);
  const teacher = user.role === "teacher" ? getTeacherStaff(user) : null;
  const record = {
    id: `asg-${Date.now()}`,
    title: data.get("title"),
    className: data.get("className"),
    subject: data.get("subject"),
    dueDate: data.get("dueDate"),
    details: data.get("details"),
    createdBy: teacher ? teacher.id : teacherForClass(data.get("className")),
    submissions: []
  };

  state.assignments.unshift(record);
  saveState();
  logActivity(user, `Posted assignment for ${record.className}`, "Assignments");
  showToast("Assignment posted.");
  renderContent();
}

function saveNotice(form) {
  const user = getCurrentUser();
  const data = new FormData(form);
  state.announcements.unshift({
    id: `note-${Date.now()}`,
    audience: data.get("audience"),
    title: data.get("title"),
    body: data.get("body"),
    date: TODAY,
    author: user.name
  });
  saveState();
  logActivity(user, `Posted information for ${data.get("audience")}`, "Information");
  showToast("Information published.");
  renderContent();
}

function saveStudent(form) {
  const user = getCurrentUser();
  const data = new FormData(form);
  const id = `stu-${Date.now()}`;
  state.students.push({
    id,
    admissionNo: `XOC-${String(state.students.length + 1).padStart(3, "0")}`,
    name: data.get("name"),
    className: data.get("className"),
    parentName: data.get("parentName"),
    parentPhone: data.get("parentPhone"),
    guardianUserId: "",
    teacherId: teacherForClass(data.get("className")),
    status: "Active"
  });
  saveState();
  logActivity(user, "Added new pupil", "People");
  showToast("Pupil added.");
  renderContent();
}

function saveStaff(form) {
  const user = getCurrentUser();
  const data = new FormData(form);
  state.staff.push({
    id: `staff-${Date.now()}`,
    name: data.get("name"),
    category: data.get("category"),
    role: data.get("role"),
    classes: data.get("className") ? [data.get("className")] : [],
    subjects: [],
    phone: "Not set"
  });
  saveState();
  logActivity(user, "Added staff member", "People");
  showToast("Staff member added.");
  renderContent();
}

function markFeePaid(id) {
  const user = getCurrentUser();
  const fee = state.fees.find((item) => item.id === id);
  if (!fee) return;
  fee.paid = fee.billed;
  fee.note = "Cleared";
  saveState();
  logActivity(user, "Marked fee as paid", "Fees");
  showToast("Fee marked paid.");
  renderContent();
}

function submitAssignment(id) {
  const user = getCurrentUser();
  const student = getStudentForUser(user);
  const assignment = state.assignments.find((item) => item.id === id);
  if (!student || !assignment) return;
  const existing = assignment.submissions.find((item) => item.studentId === student.id);
  if (existing) {
    existing.status = "Submitted";
    existing.submittedAt = new Date().toISOString();
  } else {
    assignment.submissions.push({ studentId: student.id, status: "Submitted", submittedAt: new Date().toISOString() });
  }
  saveState();
  logActivity(user, `Submitted ${assignment.title}`, "Assignments");
  showToast("Assignment submitted.");
  renderContent();
}

function resetData() {
  const user = getCurrentUser();
  state = createDefaultState();
  saveState();
  logActivity(user, "Reset demo data", "Admin");
  showToast("Demo data reset.");
  renderContent();
}

function metric(label, value, detail) {
  return `
    <article class="metric-card">
      <span>${esc(label)}</span>
      <strong>${esc(String(value))}</strong>
      <small>${esc(detail)}</small>
    </article>
  `;
}

function moduleCard(title, text, iconName, view) {
  return `
    <article class="module-card">
      <header>
        <div class="module-icon" aria-hidden="true">${icons[iconName]}</div>
        <button class="small-button" type="button" data-view="${view}">Open</button>
      </header>
      <h4>${esc(title)}</h4>
      <p>${esc(text)}</p>
    </article>
  `;
}

function studentCard(student) {
  const attendance = state.attendance.find((item) => item.studentId === student.id && item.date === TODAY);
  return `
    <article class="person-card">
      <h4>${esc(student.name)}</h4>
      <p>${esc(student.className)} | ${esc(student.admissionNo)}</p>
      <p>${esc(student.parentName)} | ${esc(student.parentPhone)}</p>
      <span class="status-pill ${attendance && attendance.present ? "good" : "warn"}">
        ${attendance && attendance.present ? "In school" : "Not present"}
      </span>
    </article>
  `;
}

function staffCard(staff) {
  return `
    <article class="person-card">
      <h4>${esc(staff.name)}</h4>
      <p>${esc(staff.role)}</p>
      <p>${esc(staff.classes.length ? staff.classes.join(", ") : staff.category)}</p>
      <span class="role-pill">${esc(staff.category)}</span>
    </article>
  `;
}

function feeRow(fee, editable) {
  const student = state.students.find((item) => item.id === fee.studentId);
  const balance = fee.billed - fee.paid;
  const percent = Math.min(100, Math.round((fee.paid / fee.billed) * 100));
  return `
    <tr>
      <td>${esc(student ? student.name : "Unknown")}</td>
      <td>${esc(student ? student.className : "")}</td>
      <td>${esc(fee.term)}</td>
      <td>${money(fee.billed)}</td>
      <td>
        <div class="progress" aria-hidden="true"><span style="width:${percent}%"></span></div>
        ${money(fee.paid)}
      </td>
      <td>${money(balance)}</td>
      <td><span class="status-pill ${balance <= 0 ? "good" : balance < fee.billed / 2 ? "warn" : "bad"}">${balance <= 0 ? "Paid" : "Balance"}</span></td>
      ${editable ? `<td><button class="small-button" type="button" data-action="mark-fee-paid" data-id="${fee.id}">Mark paid</button></td>` : ""}
    </tr>
  `;
}

function scoreCards(items) {
  if (!items.length) return emptyState("No assessment scores yet.");
  return items
    .map((item) => {
      const student = state.students.find((entry) => entry.id === item.studentId);
      const percent = Math.round((item.score / item.maxScore) * 100);
      return `
        <article class="score-card">
          <div class="list-heading">
            <h4>${esc(student ? student.name : "Unknown")}</h4>
            <span class="status-pill ${percent >= 70 ? "good" : percent >= 50 ? "warn" : "bad"}">${percent}%</span>
          </div>
          <p>${esc(item.className)} | ${esc(item.subject)}</p>
          <p>${esc(item.title)}: ${item.score}/${item.maxScore}</p>
          <div class="progress" aria-hidden="true"><span style="width:${percent}%"></span></div>
          <p>${esc(item.comment || "No comment")}</p>
        </article>
      `;
    })
    .join("");
}

function assignmentCards(assignments, studentIds) {
  const user = getCurrentUser();
  if (!assignments.length) return emptyState("No assignments for this class.");
  return assignments
    .map((assignment) => {
      const total = state.students.filter((student) => student.className === assignment.className).length;
      const submitted = assignment.submissions.filter((item) => item.status === "Submitted").length;
      const statusText =
        user.role === "student"
          ? submissionStatus(assignment, getStudentForUser(user).id)
          : studentIds.length === 1
            ? submissionStatus(assignment, studentIds[0])
            : `${submitted}/${total} submitted`;
      const canSubmit = user.role === "student" && submissionStatus(assignment, getStudentForUser(user).id) !== "Submitted";

      return `
        <article class="assignment-card">
          <div class="list-heading">
            <h4>${esc(assignment.title)}</h4>
            <span class="status-pill ${statusText === "Submitted" ? "good" : "warn"}">${esc(statusText)}</span>
          </div>
          <p>${esc(assignment.className)} | ${esc(assignment.subject)} | Due ${formatDate(assignment.dueDate)}</p>
          <p>${esc(assignment.details)}</p>
          ${canSubmit ? `<div class="action-row"><button class="primary-button" type="button" data-action="submit-assignment" data-id="${assignment.id}">Submit</button></div>` : ""}
        </article>
      `;
    })
    .join("");
}

function noticeCards(notices) {
  if (!notices.length) return emptyState("No information posted yet.");
  return notices
    .map(
      (notice) => `
        <article class="notice-card">
          <div class="list-heading">
            <h4>${esc(notice.title)}</h4>
            <span class="role-pill">${esc(notice.audience)}</span>
          </div>
          <p>${esc(notice.body)}</p>
          <p>${esc(notice.author)} | ${formatDate(notice.date)}</p>
        </article>
      `
    )
    .join("");
}

function noticeList(notices) {
  if (!notices.length) return emptyState("No information posted yet.");
  return `
    <ul class="mini-list" style="margin-top:12px">
      ${notices.map((notice) => `<li><span>${esc(notice.title)}</span><strong>${esc(notice.audience)}</strong></li>`).join("")}
    </ul>
  `;
}

function activityList(activities) {
  if (!activities.length) return emptyState("No activity yet.");
  return `
    <div class="table-wrap" style="margin-top:16px">
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>User</th>
            <th>Role</th>
            <th>Area</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${activities
            .map(
              (item) => `
                <tr>
                  <td>${formatDateTime(item.time)}</td>
                  <td>${esc(item.actor)}</td>
                  <td><span class="role-pill">${esc(titleCase(item.role))}</span></td>
                  <td>${esc(item.area)}</td>
                  <td>${esc(item.action)}</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function attendanceSummaryTable(students) {
  if (!students.length) return emptyState("No attendance records found.");
  return `
    <div class="table-wrap" style="margin-top:16px">
      <table>
        <thead>
          <tr>
            <th>Pupil</th>
            <th>Class</th>
            <th>Today</th>
            <th>Arrival</th>
            <th>Parent</th>
          </tr>
        </thead>
        <tbody>
          ${students
            .map((student) => {
              const record = state.attendance.find((item) => item.studentId === student.id && item.date === TODAY);
              return `
                <tr>
                  <td>${esc(student.name)}</td>
                  <td>${esc(student.className)}</td>
                  <td><span class="status-pill ${record && record.present ? "good" : "bad"}">${record && record.present ? "In school" : "Not present"}</span></td>
                  <td>${record && record.arrival ? esc(record.arrival) : "-"}</td>
                  <td>${esc(student.parentName)}</td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function timetableTable(items) {
  if (!items.length) return emptyState("No timetable entries.");
  return `
    <div class="table-wrap" style="margin-top:16px">
      <table>
        <thead>
          <tr><th>Day</th><th>Time</th><th>Class</th><th>Subject</th></tr>
        </thead>
        <tbody>
          ${items
            .map((item) => `<tr><td>${esc(item.day)}</td><td>${esc(item.period)}</td><td>${esc(item.className)}</td><td>${esc(item.subject)}</td></tr>`)
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function visibleStudentsForRole(user) {
  if (user.role === "admin") return state.students;
  if (user.role === "teacher") {
    const classes = allowedClassesForUser(user);
    return state.students.filter((student) => classes.includes(student.className));
  }
  if (user.role === "student") return [getStudentForUser(user)];
  return getChildrenForParent(user);
}

function allowedClassesForUser(user) {
  if (!user || user.role === "admin") return CLASSES;
  if (user.role === "teacher") {
    const staff = getTeacherStaff(user);
    return staff && staff.classes.length ? staff.classes : CLASSES;
  }
  if (user.role === "student") return [getStudentForUser(user).className];
  return getChildrenForParent(user).map((student) => student.className);
}

function getTeacherStaff(user) {
  return state.staff.find((item) => item.id === user.staffId) || null;
}

function getStudentForUser(user) {
  return state.students.find((student) => student.id === user.studentId) || state.students[0];
}

function getChildrenForParent(user) {
  return state.students.filter((student) => (user.children || []).includes(student.id));
}

function attendanceForStudent(studentId) {
  const records = state.attendance.filter((item) => item.studentId === studentId);
  return {
    total: records.length,
    present: records.filter((item) => item.present).length
  };
}

function feesForStudents(studentIds) {
  return state.fees.filter((fee) => studentIds.includes(fee.studentId));
}

function totalBalance(fees) {
  return fees.reduce((sum, fee) => sum + Math.max(0, fee.billed - fee.paid), 0);
}

function assessmentsForStudents(studentIds) {
  return state.assessments.filter((item) => studentIds.includes(item.studentId));
}

function latestScore(studentId) {
  const item = state.assessments.find((assessment) => assessment.studentId === studentId);
  if (!item) return "N/A";
  return `${item.score}/${item.maxScore}`;
}

function submissionStatus(assignment, studentId) {
  const record = assignment.submissions.find((item) => item.studentId === studentId);
  return record && record.status === "Submitted" ? "Submitted" : "Pending";
}

function visibleAnnouncements() {
  const user = getCurrentUser();
  return state.announcements.filter((notice) => {
    if (user.role === "admin") return true;
    if (user.role === "teacher") return ["Teaching staff", "All staff", "Everyone"].includes(notice.audience);
    if (user.role === "student") return ["Students", "Everyone"].includes(notice.audience);
    if (user.role === "parent") return ["Parents", "Everyone"].includes(notice.audience);
    return false;
  });
}

function logActivity(user, action, area) {
  if (!user) return;
  state.activities.unshift({
    id: `act-${Date.now()}`,
    time: new Date().toISOString(),
    actor: user.name,
    role: user.role,
    area,
    action
  });
  state.activities = state.activities.slice(0, 80);
  saveState();
}

function money(value) {
  return `GHS ${Number(value || 0).toLocaleString()}`;
}

function formatDate(value) {
  if (!value) return "";
  return new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatDateTime(value) {
  return new Date(value).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function titleCase(value) {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

function option(value, selected) {
  return `<option value="${esc(value)}" ${value === selected ? "selected" : ""}>${esc(value)}</option>`;
}

function emptyState(message) {
  return `<div class="empty-state">${esc(message)}</div>`;
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
