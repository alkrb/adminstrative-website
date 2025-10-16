// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // تهيئة التنقل بين التبويبات
    initNavigation();
    
    // تهيئة نماذج الاختيار
    initSelectionForms();
    
    // تحميل البيانات الأولية
    loadInitialData();
}

// إدارة التنقل
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // النقر على روابط التنقل
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // إزالة النشاط من جميع الروابط
            navLinks.forEach(l => l.classList.remove('active'));
            
            // إضافة النشاط للرابط المحدد
            this.classList.add('active');
            
            // إخفاء جميع المحتويات
            tabContents.forEach(content => content.classList.remove('active'));
            
            // إظهار المحتوى المحدد
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // إغلاق القائمة على الهواتف
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });
    
    // القائمة المنسدلة للهواتف
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');
    });
}

// تهيئة نماذج الاختيار
function initSelectionForms() {
    const gradeSelect = document.getElementById('grade');
    const sectionSelect = document.getElementById('section');
    const daySelect = document.getElementById('day');
    const viewButton = document.getElementById('viewSchedule');
    
    // بيانات الاختيار
    const sectionsData = {
        'grade1': ['A', 'B'],
        'grade2': ['A', 'B', 'C']
    };
    
    // عند تغيير الصف
    gradeSelect.addEventListener('change', function() {
        const selectedGrade = this.value;
        
        // تفريغ وإعادة تعبئة الشعبة
        sectionSelect.innerHTML = '<option value="">اختر الشعبة</option>';
        sectionSelect.disabled = !selectedGrade;
        
        if (selectedGrade && sectionsData[selectedGrade]) {
            sectionsData[selectedGrade].forEach(section => {
                const option = document.createElement('option');
                option.value = section;
                option.textContent = `شعبة ${section}`;
                sectionSelect.appendChild(option);
            });
        }
        
        updateViewButton();
    });
    
    // عند تغيير الشعبة
    sectionSelect.addEventListener('change', function() {
        daySelect.disabled = !this.value;
        updateViewButton();
    });
    
    // عند تغيير اليوم
    daySelect.addEventListener('change', updateViewButton);
    
    // زر عرض الجدول
    viewButton.addEventListener('click', function() {
        const grade = gradeSelect.value;
        const section = sectionSelect.value;
        const day = daySelect.value;
        
        if (grade && section && day) {
            loadTimetable(grade, section, day);
            loadAssignments(grade, section, day);
            
            // الانتقال إلى تبويب الجدول
            document.querySelector('.nav-link[data-tab="timetable"]').click();
        }
    });
    
    function updateViewButton() {
        viewButton.disabled = !(gradeSelect.value && sectionSelect.value && daySelect.value);
    }
}

// تحميل البيانات الأولية
function loadInitialData() {
    // تحميل الامتحانات
    loadExams();
    
    // تحميل الواجبات العامة
    loadGeneralAssignments();
}

// تحميل جدول الحصص
function loadTimetable(grade, section, day) {
    const timetableContent = document.getElementById('timetable-content');
    
    // عرض مؤشر التحميل
    timetableContent.innerHTML = '<p class="no-data">جاري تحميل الجدول...</p>';
    
    // محاكاة جلب البيانات من Firebase
    setTimeout(() => {
        // بيانات تجريبية
        const timetableData = getSampleTimetable(grade, section, day);
        
        if (timetableData && timetableData.lessons && timetableData.lessons.length > 0) {
            let html = `
                <div class="timetable-day">
                    <h3>جدول ${getDayName(day)} - ${grade} شعبة ${section}</h3>
            `;
            
            timetableData.lessons.forEach(lesson => {
                html += `
                    <div class="lesson-card">
                        <div class="lesson-time">${lesson.start} - ${lesson.end}</div>
                        <div class="lesson-details">
                            <div class="lesson-subject">${lesson.subject}</div>
                            <div class="lesson-teacher">${lesson.teacher}</div>
                        </div>
                        <div class="lesson-room">${lesson.room}</div>
                    </div>
                `;
            });
            
            html += `</div>`;
            timetableContent.innerHTML = html;
        } else {
            timetableContent.innerHTML = '<p class="no-data">لا يوجد جدول لهذا اليوم</p>';
        }
    }, 500);
}

// تحميل الواجبات
function loadAssignments(grade, section, day) {
    const assignmentsContent = document.getElementById('assignments-content');
    
    // عرض مؤشر التحميل
    assignmentsContent.innerHTML = '<p class="no-data">جاري تحميل الواجبات...</p>';
    
    // محاكاة جلب البيانات من Firebase
    setTimeout(() => {
        // بيانات تجريبية
        const assignmentsData = getSampleAssignments(grade, section, day);
        
        if (assignmentsData && assignmentsData.length > 0) {
            let html = '';
            
            assignmentsData.forEach(assignment => {
                html += `
                    <div class="assignment-card">
                        <div class="assignment-header">
                            <div class="assignment-title">${assignment.title}</div>
                            <div class="assignment-due">${formatDate(assignment.dueDate)}</div>
                        </div>
                        <div class="assignment-description">${assignment.description}</div>
                        <div class="assignment-meta">
                            <span>المادة: ${assignment.subject}</span>
                            <span>تاريخ النشر: ${formatDate(assignment.postedAt)}</span>
                        </div>
                    </div>
                `;
            });
            
            assignmentsContent.innerHTML = html;
        } else {
            assignmentsContent.innerHTML = '<p class="no-data">لا توجد واجبات لهذا اليوم</p>';
        }
    }, 500);
}

// تحميل الواجبات العامة
function loadGeneralAssignments() {
    const assignmentsContent = document.getElementById('assignments-content');
    
    // إذا كان المستخدم في تبويب الواجبات ولم يختر صف/شعبة
    if (assignmentsContent && document.getElementById('assignments').classList.contains('active')) {
        // محاكاة جلب البيانات من Firebase
        setTimeout(() => {
            // بيانات تجريبية
            const assignmentsData = getSampleGeneralAssignments();
            
            if (assignmentsData && assignmentsData.length > 0) {
                let html = '';
                
                assignmentsData.forEach(assignment => {
                    html += `
                        <div class="assignment-card">
                            <div class="assignment-header">
                                <div class="assignment-title">${assignment.title}</div>
                                <div class="assignment-due">${formatDate(assignment.dueDate)}</div>
                            </div>
                            <div class="assignment-description">${assignment.description}</div>
                            <div class="assignment-meta">
                                <span>المادة: ${assignment.subject}</span>
                                <span>الصف: ${assignment.grade}</span>
                                <span>تاريخ النشر: ${formatDate(assignment.postedAt)}</span>
                            </div>
                        </div>
                    `;
                });
                
                assignmentsContent.innerHTML = html;
            } else {
                assignmentsContent.innerHTML = '<p class="no-data">لا توجد واجبات لعرضها</p>';
            }
        }, 500);
    }
}

// تحميل الامتحانات
function loadExams() {
    const examsContent = document.getElementById('exams-content');
    const examMonth = document.getElementById('examMonth');
    const examGrade = document.getElementById('examGrade');
    
    // عرض مؤشر التحميل
    examsContent.innerHTML = '<p class="no-data">جاري تحميل جدول الامتحانات...</p>';
    
    // محاكاة جلب البيانات من Firebase
    setTimeout(() => {
        // بيانات تجريبية
        const examsData = getSampleExams();
        
        if (examsData && examsData.length > 0) {
            let html = '';
            
            examsData.forEach(exam => {
                html += `
                    <div class="exam-card">
                        <div class="exam-header">
                            <div class="exam-title">${exam.title}</div>
                            <div class="exam-date">${formatDate(exam.date)}</div>
                        </div>
                        <div class="exam-details">
                            <span>المادة: ${exam.subject}</span>
                            <span class="exam-time">${exam.startTime} - ${exam.endTime}</span>
                        </div>
                        <div class="exam-meta">
                            <span>الصف: ${exam.grade}</span>
                            <span>الشعبة: ${exam.section}</span>
                        </div>
                    </div>
                `;
            });
            
            examsContent.innerHTML = html;
        } else {
            examsContent.innerHTML = '<p class="no-data">لا توجد امتحانات لعرضها</p>';
        }
    }, 500);
    
    // إضافة مستمعات الأحداث للمرشحات
    examMonth.addEventListener('change', loadExams);
    examGrade.addEventListener('change', loadExams);
}

// بيانات تجريبية
function getSampleTimetable(grade, section, day) {
    const timetables = {
        'grade1': {
            'A': {
                'sunday': {
                    lessons: [
                        { start: '08:00', end: '08:45', subject: 'اللغة العربية', teacher: 'أ. أحمد', room: '101' },
                        { start: '08:45', end: '09:30', subject: 'الرياضيات', teacher: 'أ. محمد', room: '101' },
                        { start: '09:30', end: '10:15', subject: 'العلوم', teacher: 'أ. فاطمة', room: '102' },
                        { start: '10:15', end: '11:00', subject: 'التربية الإسلامية', teacher: 'أ. خالد', room: '101' }
                    ]
                },
                'monday': {
                    lessons: [
                        { start: '08:00', end: '08:45', subject: 'اللغة الإنجليزية', teacher: 'أ. سارة', room: '103' },
                        { start: '08:45', end: '09:30', subject: 'الاجتماعيات', teacher: 'أ. علي', room: '101' },
                        { start: '09:30', end: '10:15', subject: 'التربية الفنية', teacher: 'أ. ليلى', room: '201' }
                    ]
                }
            },
            'B': {
                'sunday': {
                    lessons: [
                        { start: '08:00', end: '08:45', subject: 'الرياضيات', teacher: 'أ. محمد', room: '102' },
                        { start: '08:45', end: '09:30', subject: 'اللغة العربية', teacher: 'أ. أحمد', room: '102' },
                        { start: '09:30', end: '10:15', subject: 'التربية الإسلامية', teacher: 'أ. خالد', room: '102' }
                    ]
                }
            }
        },
        'grade2': {
            'A': {
                'sunday': {
                    lessons: [
                        { start: '08:00', end: '08:45', subject: 'الفيزياء', teacher: 'أ. يوسف', room: '301' },
                        { start: '08:45', end: '09:30', subject: 'الكيمياء', teacher: 'أ. نورة', room: '302' },
                        { start: '09:30', end: '10:15', subject: 'الرياضيات', teacher: 'أ. سعيد', room: '301' }
                    ]
                }
            }
        }
    };
    
    return timetables[grade] && timetables[grade][section] && timetables[grade][section][day] 
        ? timetables[grade][section][day] 
        : null;
}

function getSampleAssignments(grade, section, day) {
    // محاكاة بيانات الواجبات
    const assignments = [
        {
            title: 'تمرين في الرياضيات',
            description: 'حل التمارين من الصفحة 45 إلى 50 في كتاب الرياضيات',
            dueDate: new Date(Date.now() + 86400000), // غدًا
            subject: 'الرياضيات',
            postedAt: new Date(),
            grade: grade,
            section: section
        },
        {
            title: 'بحث في العلوم',
            description: 'إعداد بحث عن النظام الشمسي يتضمن 3 صفحات على الأقل',
            dueDate: new Date(Date.now() + 172800000), // بعد غد
            subject: 'العلوم',
            postedAt: new Date(Date.now() - 86400000), // أمس
            grade: grade,
            section: section
        }
    ];
    
    return assignments;
}

function getSampleGeneralAssignments() {
    // محاكاة بيانات الواجبات العامة
    const assignments = [
        {
            title: 'قراءة قصة',
            description: 'قراءة القصة من الصفحة 12 إلى 20 والإجابة على الأسئلة',
            dueDate: new Date(Date.now() + 86400000),
            subject: 'اللغة العربية',
            postedAt: new Date(),
            grade: 'الصف الأول'
        },
        {
            title: 'تجربة علمية',
            description: 'إعداد تقرير عن تجربة الذوبان مع الصور',
            dueDate: new Date(Date.now() + 259200000),
            subject: 'العلوم',
            postedAt: new Date(Date.now() - 172800000),
            grade: 'الصف الثاني'
        }
    ];
    
    return assignments;
}

function getSampleExams() {
    // محاكاة بيانات الامتحانات
    const exams = [
        {
            title: 'امتحان منتصف الفصل - الرياضيات',
            date: new Date(Date.now() + 604800000), // بعد أسبوع
            startTime: '09:00',
            endTime: '10:30',
            subject: 'الرياضيات',
            grade: 'الصف الأول',
            section: 'A'
        },
        {
            title: 'امتحان منتصف الفصل - العلوم',
            date: new Date(Date.now() + 691200000), // بعد 8 أيام
            startTime: '10:00',
            endTime: '11:30',
            subject: 'العلوم',
            grade: 'الصف الأول',
            section: 'A'
        },
        {
            title: 'امتحان الفيزياء',
            date: new Date(Date.now() + 864000000), // بعد 10 أيام
            startTime: '08:30',
            endTime: '10:00',
            subject: 'الفيزياء',
            grade: 'الصف الثاني',
            section: 'B'
        }
    ];
    
    return exams;
}

// وظائف مساعدة
function getDayName(day) {
    const days = {
        'sunday': 'الأحد',
        'monday': 'الاثنين',
        'tuesday': 'الثلاثاء',
        'wednesday': 'الأربعاء',
        'thursday': 'الخميس'
    };
    
    return days[day] || day;
}

function formatDate(date) {
    if (!date) return '';
    
    const d = new Date(date);
    return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}