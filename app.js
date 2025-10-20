// إعدادات Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCctRA8GcMlYNvk6nBE1YXeYruQwkawcHA",
    authDomain: "daily-tasks-a69ab.firebaseapp.com",
    databaseURL: "https://daily-tasks-a69ab-default-rtdb.firebaseio.com",
    projectId: "daily-tasks-a69ab",
    storageBucket: "daily-tasks-a69ab.firebasestorage.app",
    messagingSenderId: "799210899623",
    appId: "1:799210899623:web:2cc09163c30bdd1db4b382",
    measurementId: "G-0B95KRGK2S"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// بيانات المستخدمين (يمكن إضافة المزيد من الطلاب هنا)
const users = {
    students: [
        {
            username: "student1",
            password: "2009",
            grade: "grade5",
            class: "هـ",
            name: "يوسف حيدر عبد الائمه"
        },
        {
            username: "student2",
            password: "2009",
            grade: "grade5",
            class: "هـ",
            name: "يوسف سيف هاشم"
        },
        {
            username: "student3",
            password: "1234",
            grade: "grade5",
            class: "هـ",
            name: "مهدي باسم صالح"
        }
    ],
    admin: {
        username: "yr9_v",
        password: "2009",
        name: "مدير النظام"
    }
};

// عناصر DOM
const loginSection = document.getElementById('login-section');
const studentDashboard = document.getElementById('student-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');
const loginForm = document.getElementById('login-form');
const userTypeSelect = document.getElementById('user-type');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const studentLogoutBtn = document.getElementById('student-logout');
const adminLogoutBtn = document.getElementById('admin-logout');
const studentWelcome = document.getElementById('student-welcome');
const studentInfo = document.getElementById('student-info');
const examsBtn = document.getElementById('exams-btn');
const lessonsBtn = document.getElementById('lessons-btn');
const absenceBtn = document.getElementById('absence-btn');
const examsSection = document.getElementById('exams-section');
const lessonsSection = document.getElementById('lessons-section');
const absenceSection = document.getElementById('absence-section');
const backFromExamsBtn = document.getElementById('back-from-exams');
const backFromLessonsBtn = document.getElementById('back-from-lessons');
const backFromAbsenceBtn = document.getElementById('back-from-absence');
const examsList = document.getElementById('exams-list');
const lessonsList = document.getElementById('lessons-list');
const absenceList = document.getElementById('absence-list');
const examsTitle = document.getElementById('exams-title');
const lessonsTitle = document.getElementById('lessons-title');
const absenceTitle = document.getElementById('absence-title');
const totalAbsenceDays = document.getElementById('total-absence-days');
const monthAbsenceDays = document.getElementById('month-absence-days');
const manageLessonsBtn = document.getElementById('manage-lessons');
const manageExamsBtn = document.getElementById('manage-exams');
const manageAbsenceBtn = document.getElementById('manage-absence');
const lessonsManagement = document.getElementById('lessons-management');
const examsManagement = document.getElementById('exams-management');
const absenceManagement = document.getElementById('absence-management');
const addLessonForm = document.getElementById('add-lesson-form');
const addExamForm = document.getElementById('add-exam-form');
const addAbsenceForm = document.getElementById('add-absence-form');
const lessonsTableBody = document.getElementById('lessons-table-body');
const examsTableBody = document.getElementById('exams-table-body');
const absenceTableBody = document.getElementById('absence-table-body');
const absenceStudentSelect = document.getElementById('absence-student');
const loading = document.getElementById('loading');

// المتغيرات الحالية
let currentUser = null;
let currentUserType = null;

// أيام الأسبوع
const daysOfWeek = [
    { id: 'sunday', name: 'الأحد' },
    { id: 'monday', name: 'الاثنين' },
    { id: 'tuesday', name: 'الثلاثاء' },
    { id: 'wednesday', name: 'الأربعاء' },
    { id: 'thursday', name: 'الخميس' }
];

// تهيئة التطبيق
function initApp() {
    setupEventListeners();
    checkExistingLogin();
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // تسجيل الدخول
    loginForm.addEventListener('submit', handleLogin);
    
    // تسجيل الخروج
    studentLogoutBtn.addEventListener('click', handleLogout);
    adminLogoutBtn.addEventListener('click', handleLogout);
    
    // التنقل في واجهة الطالب
    examsBtn.addEventListener('click', showExams);
    lessonsBtn.addEventListener('click', showLessons);
    absenceBtn.addEventListener('click', showAbsence);
    backFromExamsBtn.addEventListener('click', () => hideSection(examsSection));
    backFromLessonsBtn.addEventListener('click', () => hideSection(lessonsSection));
    backFromAbsenceBtn.addEventListener('click', () => hideSection(absenceSection));
    
    // التنقل في واجهة الإدارة
    manageLessonsBtn.addEventListener('click', () => showManagementSection(lessonsManagement, examsManagement, absenceManagement));
    manageExamsBtn.addEventListener('click', () => showManagementSection(examsManagement, lessonsManagement, absenceManagement));
    manageAbsenceBtn.addEventListener('click', () => showManagementSection(absenceManagement, lessonsManagement, examsManagement));
    
    // إضافة بيانات جديدة
    addLessonForm.addEventListener('submit', addLesson);
    addExamForm.addEventListener('submit', addExam);
    addAbsenceForm.addEventListener('submit', addAbsence);
}

// التحقق من وجود تسجيل دخول سابق
function checkExistingLogin() {
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('currentUserType');
    
    if (savedUser && savedUserType) {
        currentUser = JSON.parse(savedUser);
        currentUserType = savedUserType;
        showDashboard();
    }
}

// معالجة تسجيل الدخول
function handleLogin(e) {
    e.preventDefault();
    
    const userType = userTypeSelect.value;
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    if (!userType || !username || !password) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    // التحقق من بيانات المستخدم
    if (userType === 'student') {
        const student = users.students.find(s => s.username === username && s.password === password);
        if (student) {
            currentUser = student;
            currentUserType = 'student';
        } else {
            alert('بيانات الدخول غير صحيحة للطالب');
            return;
        }
    } else if (userType === 'admin') {
        if (username === users.admin.username && password === users.admin.password) {
            currentUser = users.admin;
            currentUserType = 'admin';
        } else {
            alert('بيانات الدخول غير صحيحة للإدارة');
            return;
        }
    }
    
    // حفظ حالة تسجيل الدخول
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('currentUserType', currentUserType);
    
    showDashboard();
}

// معالجة تسجيل الخروج
function handleLogout() {
    currentUser = null;
    currentUserType = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserType');
    
    loginSection.classList.remove('hidden');
    studentDashboard.classList.add('hidden');
    adminDashboard.classList.add('hidden');
    examsSection.classList.add('hidden');
    lessonsSection.classList.add('hidden');
    absenceSection.classList.add('hidden');
    
    // إعادة تعيين نموذج تسجيل الدخول
    loginForm.reset();
}

// عرض لوحة التحكم المناسبة
function showDashboard() {
    loginSection.classList.add('hidden');
    
    if (currentUserType === 'student') {
        studentDashboard.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
        
        // تحديث معلومات الطالب
        studentWelcome.textContent = `مرحباً، ${currentUser.name || currentUser.username}`;
        const gradeName = getGradeName(currentUser.grade);
        studentInfo.textContent = `${gradeName} - ${currentUser.class}`;
    } else if (currentUserType === 'admin') {
        studentDashboard.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        
        // تحميل بيانات الإدارة
        loadAdminData();
    }
}

// تحميل بيانات الإدارة
function loadAdminData() {
    loadLessonsTable();
    loadExamsTable();
    loadAbsenceTable();
    populateStudentSelect();
}

// تعبئة قائمة الطلاب في إدارة الغياب
function populateStudentSelect() {
    absenceStudentSelect.innerHTML = '<option value="">-- اختر الطالب --</option>';
    
    users.students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.username;
        option.textContent = `${student.name} - ${getGradeName(student.grade)} ${student.class}`;
        absenceStudentSelect.appendChild(option);
    });
}

// عرض جدول الامتحانات للطالب
function showExams() {
    showLoading(true);
    
    // جلب البيانات من Firebase
    database.ref('exams').once('value')
        .then(snapshot => {
            showLoading(false);
            const exams = snapshot.val();
            renderExamsList(exams);
            const gradeName = getGradeName(currentUser.grade);
            examsTitle.textContent = `جدول الامتحانات - ${gradeName} ${currentUser.class}`;
            examsSection.classList.remove('hidden');
        })
        .catch(error => {
            showLoading(false);
            console.error('Error fetching exams:', error);
            renderExamsList(null, true);
            examsSection.classList.remove('hidden');
        });
}

// عرض جدول الدروس للطالب
function showLessons() {
    showLoading(true);
    
    // جلب البيانات من Firebase
    database.ref('lessons').once('value')
        .then(snapshot => {
            showLoading(false);
            const lessons = snapshot.val();
            renderLessonsList(lessons);
            const gradeName = getGradeName(currentUser.grade);
            lessonsTitle.textContent = `جدول الدروس - ${gradeName} ${currentUser.class}`;
            lessonsSection.classList.remove('hidden');
        })
        .catch(error => {
            showLoading(false);
            console.error('Error fetching lessons:', error);
            renderLessonsList(null, true);
            lessonsSection.classList.remove('hidden');
        });
}

// عرض سجل الغياب للطالب
function showAbsence() {
    showLoading(true);
    
    // جلب البيانات من Firebase
    database.ref('absence').once('value')
        .then(snapshot => {
            showLoading(false);
            const absenceRecords = snapshot.val();
            renderAbsenceList(absenceRecords);
            const gradeName = getGradeName(currentUser.grade);
            absenceTitle.textContent = `سجل الغياب - ${gradeName} ${currentUser.class}`;
            absenceSection.classList.remove('hidden');
        })
        .catch(error => {
            showLoading(false);
            console.error('Error fetching absence records:', error);
            renderAbsenceList(null, true);
            absenceSection.classList.remove('hidden');
        });
}

// عرض قائمة الامتحانات
function renderExamsList(exams, isError = false) {
    examsList.innerHTML = '';
    
    if (isError) {
        examsList.innerHTML = `
            <li class="data-item">
                <h3>خطأ في تحميل البيانات</h3>
                <p>تعذر تحميل جدول الامتحانات. يرجى المحاولة مرة أخرى.</p>
            </li>
        `;
        return;
    }
    
    if (!exams) {
        examsList.innerHTML = `
            <li class="data-item">
                <h3>لا توجد امتحانات</h3>
                <p>لا توجد امتحانات مسجلة حالياً.</p>
            </li>
        `;
        return;
    }
    
    // تصفية الامتحانات الخاصة بالطالب الحالي
    const studentGrade = currentUser.grade;
    const studentClass = currentUser.class;
    const filteredExams = Object.entries(exams)
        .map(([id, exam]) => ({ id, ...exam }))
        .filter(exam => exam.grade === studentGrade && exam.class === studentClass);
    
    if (filteredExams.length === 0) {
        examsList.innerHTML = `
            <li class="data-item">
                <h3>لا توجد امتحانات</h3>
                <p>لا توجد امتحانات مسجلة للصف والشعبة الحالية.</p>
            </li>
        `;
        return;
    }
    
    // عرض كل امتحان
    filteredExams.forEach((exam, index) => {
        const examItem = document.createElement('li');
        examItem.className = 'data-item';
        examItem.style.animationDelay = `${index * 0.1}s`;
        
        examItem.innerHTML = `
            <h3>${exam.subject || 'بدون عنوان'}</h3>
            <p><strong>التاريخ:</strong> ${exam.date || 'غير محدد'}</p>
            <p><strong>الوقت:</strong> ${exam.time || 'غير محدد'}</p>
            <p><strong>المدة:</strong> ${exam.duration || 'غير محدد'}</p>
        `;
        
        examsList.appendChild(examItem);
    });
}

// عرض قائمة الدروس
function renderLessonsList(lessons, isError = false) {
    lessonsList.innerHTML = '';
    
    if (isError) {
        lessonsList.innerHTML = `
            <div class="data-item">
                <h3>خطأ في تحميل البيانات</h3>
                <p>تعذر تحميل جدول الدروس. يرجى المحاولة مرة أخرى.</p>
            </div>
        `;
        return;
    }
    
    if (!lessons) {
        lessonsList.innerHTML = `
            <div class="data-item">
                <h3>لا توجد دروس</h3>
                <p>لا توجد دروس مسجلة حالياً.</p>
            </div>
        `;
        return;
    }
    
    // تصفية الدروس الخاصة بالطالب الحالي
    const studentGrade = currentUser.grade;
    const studentClass = currentUser.class;
    const filteredLessons = Object.entries(lessons)
        .map(([id, lesson]) => ({ id, ...lesson }))
        .filter(lesson => lesson.grade === studentGrade && lesson.class === studentClass);
    
    if (filteredLessons.length === 0) {
        lessonsList.innerHTML = `
            <div class="data-item">
                <h3>لا توجد دروس</h3>
                <p>لا توجد دروس مسجلة للصف والشعبة الحالية.</p>
            </div>
        `;
        return;
    }
    
    // تجميع الدروس حسب اليوم
    daysOfWeek.forEach(day => {
        const dayLessons = filteredLessons.filter(lesson => lesson.day === day.id);
        
        if (dayLessons.length > 0) {
            const dayGroup = document.createElement('div');
            dayGroup.className = 'day-group';
            
            dayGroup.innerHTML = `<h3>${day.name}</h3>`;
            
            dayLessons.forEach(lesson => {
                const lessonItem = document.createElement('div');
                lessonItem.className = 'data-item';
                
                lessonItem.innerHTML = `
                    <h4>${lesson.subject || 'بدون عنوان'}</h4>
                    <p><strong>الوقت:</strong> ${lesson.time || 'غير محدد'}</p>
                    <p><strong>المعلم:</strong> ${lesson.teacher || 'غير محدد'}</p>
                `;
                
                dayGroup.appendChild(lessonItem);
            });
            
            lessonsList.appendChild(dayGroup);
        }
    });
}

// عرض سجل الغياب
function renderAbsenceList(absenceRecords, isError = false) {
    absenceList.innerHTML = '';
    
    if (isError) {
        absenceList.innerHTML = `
            <div class="data-item">
                <h3>خطأ في تحميل البيانات</h3>
                <p>تعذر تحميل سجل الغياب. يرجى المحاولة مرة أخرى.</p>
            </div>
        `;
        return;
    }
    
    if (!absenceRecords) {
        absenceList.innerHTML = `
            <div class="data-item">
                <h3>لا توجد سجلات غياب</h3>
                <p>لا توجد سجلات غياب مسجلة حالياً.</p>
            </div>
        `;
        return;
    }
    
    // تصفية سجلات الغياب الخاصة بالطالب الحالي
    const studentUsername = currentUser.username;
    const filteredAbsence = Object.entries(absenceRecords)
        .map(([id, record]) => ({ id, ...record }))
        .filter(record => record.studentUsername === studentUsername);
    
    if (filteredAbsence.length === 0) {
        absenceList.innerHTML = `
            <div class="data-item">
                <h3>لا توجد سجلات غياب</h3>
                <p>لا توجد سجلات غياب مسجلة للطالب الحالي.</p>
            </div>
        `;
        totalAbsenceDays.textContent = '0';
        monthAbsenceDays.textContent = '0';
        return;
    }
    
    // ترتيب السجلات من الأحدث إلى الأقدم
    filteredAbsence.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // حساب الإحصائيات
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const totalDays = filteredAbsence.length;
    const monthDays = filteredAbsence.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    }).length;
    
    totalAbsenceDays.textContent = totalDays;
    monthAbsenceDays.textContent = monthDays;
    
    // عرض كل سجل غياب
    filteredAbsence.forEach((record, index) => {
        const absenceItem = document.createElement('div');
        absenceItem.className = 'absence-item';
        absenceItem.style.animationDelay = `${index * 0.1}s`;
        
        const recordDate = new Date(record.date);
        const formattedDate = recordDate.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        absenceItem.innerHTML = `
            <h4>غياب بتاريخ: ${formattedDate}</h4>
            <div class="absence-details">
                <div class="absence-detail">
                    <span>سبب الغياب:</span>
                    <span>${record.reason || 'غير محدد'}</span>
                </div>
                <div class="absence-detail">
                    <span>ملاحظات:</span>
                    <span>${record.notes || 'لا توجد ملاحظات'}</span>
                </div>
                <div class="absence-detail">
                    <span>مسجل بواسطة:</span>
                    <span>الإدارة</span>
                </div>
            </div>
        `;
        
        absenceList.appendChild(absenceItem);
    });
}

// إخفاء قسم
function hideSection(section) {
    section.classList.add('hidden');
}

// عرض قسم إدارة مع إخفاء الأقسام الأخرى
function showManagementSection(showSection, hideSection1, hideSection2) {
    showSection.classList.remove('hidden');
    hideSection1.classList.add('hidden');
    hideSection2.classList.add('hidden');
}

// إضافة درس جديد
function addLesson(e) {
    e.preventDefault();
    
    const grade = document.getElementById('lesson-grade').value;
    const classValue = document.getElementById('lesson-class').value;
    const day = document.getElementById('lesson-day').value;
    const time = document.getElementById('lesson-time').value;
    const subject = document.getElementById('lesson-subject').value;
    const teacher = document.getElementById('lesson-teacher').value;
    
    if (!grade || !classValue || !day || !time || !subject || !teacher) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    const newLesson = {
        grade,
        class: classValue,
        day,
        time,
        subject,
        teacher,
        createdAt: new Date().toISOString()
    };
    
    // إضافة إلى Firebase
    database.ref('lessons').push(newLesson)
        .then(() => {
            alert('تم إضافة الدرس بنجاح');
            addLessonForm.reset();
            loadLessonsTable();
        })
        .catch(error => {
            console.error('Error adding lesson:', error);
            alert('حدث خطأ أثناء إضافة الدرس');
        });
}

// إضافة امتحان جديد
function addExam(e) {
    e.preventDefault();
    
    const grade = document.getElementById('exam-grade').value;
    const classValue = document.getElementById('exam-class').value;
    const date = document.getElementById('exam-date').value;
    const time = document.getElementById('exam-time').value;
    const subject = document.getElementById('exam-subject').value;
    const duration = document.getElementById('exam-duration').value;
    
    if (!grade || !classValue || !date || !time || !subject || !duration) {
        alert('يرجى ملء جميع الحقول');
        return;
    }
    
    const newExam = {
        grade,
        class: classValue,
        date,
        time,
        subject,
        duration,
        createdAt: new Date().toISOString()
    };
    
    // إضافة إلى Firebase
    database.ref('exams').push(newExam)
        .then(() => {
            alert('تم إضافة الامتحان بنجاح');
            addExamForm.reset();
            loadExamsTable();
        })
        .catch(error => {
            console.error('Error adding exam:', error);
            alert('حدث خطأ أثناء إضافة الامتحان');
        });
}

// إضافة سجل غياب جديد
function addAbsence(e) {
    e.preventDefault();
    
    const studentUsername = document.getElementById('absence-student').value;
    const date = document.getElementById('absence-date').value;
    const reason = document.getElementById('absence-reason').value;
    const notes = document.getElementById('absence-notes').value;
    
    if (!studentUsername || !date || !reason) {
        alert('يرجى ملء جميع الحقول المطلوبة');
        return;
    }
    
    // البحث عن بيانات الطالب
    const student = users.students.find(s => s.username === studentUsername);
    if (!student) {
        alert('الطالب المحدد غير موجود');
        return;
    }
    
    const newAbsence = {
        studentUsername,
        studentName: student.name,
        grade: student.grade,
        class: student.class,
        date,
        reason,
        notes: notes || '',
        recordedAt: new Date().toISOString(),
        recordedBy: 'الإدارة'
    };
    
    // إضافة إلى Firebase
    database.ref('absence').push(newAbsence)
        .then(() => {
            alert('تم تسجيل الغياب بنجاح');
            addAbsenceForm.reset();
            loadAbsenceTable();
        })
        .catch(error => {
            console.error('Error adding absence record:', error);
            alert('حدث خطأ أثناء تسجيل الغياب');
        });
}

// تحميل جدول الدروس للإدارة
function loadLessonsTable() {
    database.ref('lessons').once('value')
        .then(snapshot => {
            const lessons = snapshot.val();
            renderLessonsTable(lessons);
        })
        .catch(error => {
            console.error('Error loading lessons:', error);
            renderLessonsTable(null, true);
        });
}

// تحميل جدول الامتحانات للإدارة
function loadExamsTable() {
    database.ref('exams').once('value')
        .then(snapshot => {
            const exams = snapshot.val();
            renderExamsTable(exams);
        })
        .catch(error => {
            console.error('Error loading exams:', error);
            renderExamsTable(null, true);
        });
}

// تحميل جدول الغياب للإدارة
function loadAbsenceTable() {
    database.ref('absence').once('value')
        .then(snapshot => {
            const absenceRecords = snapshot.val();
            renderAbsenceTable(absenceRecords);
        })
        .catch(error => {
            console.error('Error loading absence records:', error);
            renderAbsenceTable(null, true);
        });
}

// عرض جدول الدروس للإدارة
function renderLessonsTable(lessons, isError = false) {
    lessonsTableBody.innerHTML = '';
    
    if (isError) {
        lessonsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">خطأ في تحميل البيانات</td>
            </tr>
        `;
        return;
    }
    
    if (!lessons) {
        lessonsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">لا توجد دروس مسجلة</td>
            </tr>
        `;
        return;
    }
    
    // تحويل كائن الدروس إلى مصفوفة
    const lessonsArray = Object.entries(lessons).map(([id, lesson]) => ({
        id,
        ...lesson
    }));
    
    // عرض كل درس في الجدول
    lessonsArray.forEach(lesson => {
        const row = document.createElement('tr');
        
        const gradeNames = {
            'grade4': 'الصف الرابع علمي',
            'grade5': 'الصف الخامس علمي',
            'grade6': 'الصف السادس علمي'
        };
        
        const dayNames = {
            'sunday': 'الأحد',
            'monday': 'الاثنين',
            'tuesday': 'الثلاثاء',
            'wednesday': 'الأربعاء',
            'thursday': 'الخميس'
        };
        
        row.innerHTML = `
            <td>${gradeNames[lesson.grade] || lesson.grade}</td>
            <td>${lesson.class}</td>
            <td>${dayNames[lesson.day] || lesson.day}</td>
            <td>${lesson.time}</td>
            <td>${lesson.subject}</td>
            <td>${lesson.teacher}</td>
            <td class="action-buttons">
                <button class="btn btn-secondary" onclick="editLesson('${lesson.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteLesson('${lesson.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        lessonsTableBody.appendChild(row);
    });
}

// عرض جدول الامتحانات للإدارة
function renderExamsTable(exams, isError = false) {
    examsTableBody.innerHTML = '';
    
    if (isError) {
        examsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">خطأ في تحميل البيانات</td>
            </tr>
        `;
        return;
    }
    
    if (!exams) {
        examsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">لا توجد امتحانات مسجلة</td>
            </tr>
        `;
        return;
    }
    
    // تحويل كائن الامتحانات إلى مصفوفة
    const examsArray = Object.entries(exams).map(([id, exam]) => ({
        id,
        ...exam
    }));
    
    // عرض كل امتحان في الجدول
    examsArray.forEach(exam => {
        const row = document.createElement('tr');
        
        const gradeNames = {
            'grade4': 'الصف الرابع علمي',
            'grade5': 'الصف الخامس علمي',
            'grade6': 'الصف السادس علمي'
        };
        
        row.innerHTML = `
            <td>${gradeNames[exam.grade] || exam.grade}</td>
            <td>${exam.class}</td>
            <td>${exam.date}</td>
            <td>${exam.time}</td>
            <td>${exam.subject}</td>
            <td>${exam.duration}</td>
            <td class="action-buttons">
                <button class="btn btn-secondary" onclick="editExam('${exam.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteExam('${exam.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        examsTableBody.appendChild(row);
    });
}

// عرض جدول الغياب للإدارة
function renderAbsenceTable(absenceRecords, isError = false) {
    absenceTableBody.innerHTML = '';
    
    if (isError) {
        absenceTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">خطأ في تحميل البيانات</td>
            </tr>
        `;
        return;
    }
    
    if (!absenceRecords) {
        absenceTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">لا توجد سجلات غياب</td>
            </tr>
        `;
        return;
    }
    
    // تحويل كائن الغياب إلى مصفوفة
    const absenceArray = Object.entries(absenceRecords).map(([id, record]) => ({
        id,
        ...record
    }));
    
    // ترتيب السجلات من الأحدث إلى الأقدم
    absenceArray.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // عرض كل سجل غياب في الجدول
    absenceArray.forEach(record => {
        const row = document.createElement('tr');
        
        const gradeNames = {
            'grade4': 'الصف الرابع علمي',
            'grade5': 'الصف الخامس علمي',
            'grade6': 'الصف السادس علمي'
        };
        
        const recordDate = new Date(record.date);
        const formattedDate = recordDate.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        row.innerHTML = `
            <td>${record.studentName}</td>
            <td>${gradeNames[record.grade] || record.grade}</td>
            <td>${record.class}</td>
            <td>${formattedDate}</td>
            <td>${record.reason}</td>
            <td>${record.notes || 'لا توجد'}</td>
            <td class="action-buttons">
                <button class="btn btn-secondary" onclick="editAbsence('${record.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-danger" onclick="deleteAbsence('${record.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        absenceTableBody.appendChild(row);
    });
}

// حذف درس
function deleteLesson(lessonId) {
    if (confirm('هل أنت متأكد من حذف هذا الدرس؟')) {
        database.ref(`lessons/${lessonId}`).remove()
            .then(() => {
                alert('تم حذف الدرس بنجاح');
                loadLessonsTable();
            })
            .catch(error => {
                console.error('Error deleting lesson:', error);
                alert('حدث خطأ أثناء حذف الدرس');
            });
    }
}

// حذف امتحان
function deleteExam(examId) {
    if (confirm('هل أنت متأكد من حذف هذا الامتحان؟')) {
        database.ref(`exams/${examId}`).remove()
            .then(() => {
                alert('تم حذف الامتحان بنجاح');
                loadExamsTable();
            })
            .catch(error => {
                console.error('Error deleting exam:', error);
                alert('حدث خطأ أثناء حذف الامتحان');
            });
    }
}

// حذف سجل غياب
function deleteAbsence(absenceId) {
    if (confirm('هل أنت متأكد من حذف سجل الغياب هذا؟')) {
        database.ref(`absence/${absenceId}`).remove()
            .then(() => {
                alert('تم حذف سجل الغياب بنجاح');
                loadAbsenceTable();
            })
            .catch(error => {
                console.error('Error deleting absence record:', error);
                alert('حدث خطأ أثناء حذف سجل الغياب');
            });
    }
}

// الحصول على اسم الصف
function getGradeName(gradeId) {
    const gradeNames = {
        'grade4': 'الصف الرابع علمي',
        'grade5': 'الصف الخامس علمي',
        'grade6': 'الصف السادس علمي'
    };
    return gradeNames[gradeId] || gradeId;
}

// الحصول على معرف الصف
function getGradeId(gradeName) {
    const gradeMap = {
        'الصف الرابع علمي': 'grade4',
        'الصف الخامس علمي': 'grade5',
        'الصف السادس علمي': 'grade6'
    };
    return gradeMap[gradeName] || gradeName;
}

// تعديل درس (وظيفة تجريبية)
function editLesson(lessonId) {
    alert('وظيفة التعديل قيد التطوير. معرف الدرس: ' + lessonId);
}

// تعديل امتحان (وظيفة تجريبية)
function editExam(examId) {
    alert('وظيفة التعديل قيد التطوير. معرف الامتحان: ' + examId);
}

// تعديل سجل غياب (وظيفة تجريبية)
function editAbsence(absenceId) {
    alert('وظيفة التعديل قيد التطوير. معرف سجل الغياب: ' + absenceId);
}

// عرض/إخفاء مؤشر التحميل
function showLoading(show) {
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

// بدء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', initApp);
