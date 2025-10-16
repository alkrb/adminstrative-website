// إدارة لوحة التحكم
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

function initializeAdminPanel() {
    // تهيئة نموذج تسجيل الدخول
    initLoginForm();
    
    // تهيئة تبويبات الإدارة
    initAdminTabs();
    
    // تهيئة أزرار الإضافة
    initAddButtons();
    
    // تحميل بيانات الإدارة
    loadManagementData();
}

// تهيئة نموذج تسجيل الدخول
function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    const adminLogin = document.getElementById('admin-login');
    const adminPanel = document.getElementById('admin-panel');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            
            // محاكاة تسجيل الدخول (في التطبيق الحقيقي، استخدم Firebase Auth)
            if (email === 'admin@school.com' && password === 'admin123') {
                adminLogin.classList.add('hidden');
                adminPanel.classList.remove('hidden');
                
                // تحميل بيانات الإدارة
                loadManagementData();
            } else {
                alert('بيانات الدخول غير صحيحة. حاول مرة أخرى.');
            }
        });
    }
}

// تهيئة تبويبات الإدارة
function initAdminTabs() {
    const adminTabs = document.querySelectorAll('.admin-tab');
    const adminTabContents = document.querySelectorAll('.admin-tab-content');
    
    adminTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // إزالة النشاط من جميع التبويبات
            adminTabs.forEach(t => t.classList.remove('active'));
            
            // إضافة النشاط للتبويب المحدد
            this.classList.add('active');
            
            // إخفاء جميع المحتويات
            adminTabContents.forEach(content => content.classList.remove('active'));
            
            // إظهار المحتوى المحدد
            const tabId = this.getAttribute('data-admin-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// تهيئة أزرار الإضافة
function initAddButtons() {
    const addTimetableBtn = document.getElementById('add-timetable');
    const addAssignmentBtn = document.getElementById('add-assignment');
    const addExamBtn = document.getElementById('add-exam');
    
    if (addTimetableBtn) {
        addTimetableBtn.addEventListener('click', function() {
            showTimetableForm();
        });
    }
    
    if (addAssignmentBtn) {
        addAssignmentBtn.addEventListener('click', function() {
            showAssignmentForm();
        });
    }
    
    if (addExamBtn) {
        addExamBtn.addEventListener('click', function() {
            showExamForm();
        });
    }
}

// تحميل بيانات الإدارة
function loadManagementData() {
    loadTimetableManagement();
    loadAssignmentsManagement();
    loadExamsManagement();
}

// تحميل إدارة الجداول
function loadTimetableManagement() {
    const content = document.getElementById('timetable-management-content');
    
    // محاكاة جلب البيانات
    setTimeout(() => {
        const timetables = getSampleTimetablesForManagement();
        
        if (timetables && timetables.length > 0) {
            let html = '';
            
            timetables.forEach(timetable => {
                html += `
                    <div class="management-item">
                        <div>
                            <strong>${timetable.grade} - شعبة ${timetable.section}</strong>
                            <div>${timetable.day} - ${timetable.lessons.length} حصة</div>
                        </div>
                        <div class="management-actions">
                            <button class="btn-edit" data-id="${timetable.id}">تعديل</button>
                            <button class="btn-delete" data-id="${timetable.id}">حذف</button>
                        </div>
                    </div>
                `;
            });
            
            content.innerHTML = html;
            
            // إضافة مستمعات الأحداث للأزرار
            addManagementEventListeners();
        } else {
            content.innerHTML = '<p class="no-data">لا توجد جداول مضافة</p>';
        }
    }, 500);
}

// تحميل إدارة الواجبات
function loadAssignmentsManagement() {
    const content = document.getElementById('assignments-management-content');
    
    // محاكاة جلب البيانات
    setTimeout(() => {
        const assignments = getSampleAssignmentsForManagement();
        
        if (assignments && assignments.length > 0) {
            let html = '';
            
            assignments.forEach(assignment => {
                html += `
                    <div class="management-item">
                        <div>
                            <strong>${assignment.title}</strong>
                            <div>${assignment.subject} - ${assignment.grade} - ${formatDate(assignment.dueDate)}</div>
                        </div>
                        <div class="management-actions">
                            <button class="btn-edit" data-id="${assignment.id}">تعديل</button>
                            <button class="btn-delete" data-id="${assignment.id}">حذف</button>
                        </div>
                    </div>
                `;
            });
            
            content.innerHTML = html;
            
            // إضافة مستمعات الأحداث للأزرار
            addManagementEventListeners();
        } else {
            content.innerHTML = '<p class="no-data">لا توجد واجبات مضافة</p>';
        }
    }, 500);
}

// تحميل إدارة الامتحانات
function loadExamsManagement() {
    const content = document.getElementById('exams-management-content');
    
    // محاكاة جلب البيانات
    setTimeout(() => {
        const exams = getSampleExamsForManagement();
        
        if (exams && exams.length > 0) {
            let html = '';
            
            exams.forEach(exam => {
                html += `
                    <div class="management-item">
                        <div>
                            <strong>${exam.title}</strong>
                            <div>${exam.subject} - ${exam.grade} - ${formatDate(exam.date)}</div>
                        </div>
                        <div class="management-actions">
                            <button class="btn-edit" data-id="${exam.id}">تعديل</button>
                            <button class="btn-delete" data-id="${exam.id}">حذف</button>
                        </div>
                    </div>
                `;
            });
            
            content.innerHTML = html;
            
            // إضافة مستمعات الأحداث للأزرار
            addManagementEventListeners();
        } else {
            content.innerHTML = '<p class="no-data">لا توجد امتحانات مضافة</p>';
        }
    }, 500);
}

// إضافة مستمعات الأحداث لأزرار الإدارة
function addManagementEventListeners() {
    const editButtons = document.querySelectorAll('.btn-edit');
    const deleteButtons = document.querySelectorAll('.btn-delete');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            // محاكاة فتح نموذج التعديل
            alert(`سيتم فتح نموذج تعديل العنصر برقم ${id}`);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
                // محاكاة حذف العنصر
                alert(`سيتم حذف العنصر برقم ${id}`);
            }
        });
    });
}

// عرض نموذج إضافة جدول
function showTimetableForm() {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.querySelector('.modal-body');
    const modalOverlay = document.getElementById('modal-overlay');
    
    modalTitle.textContent = 'إضافة جدول جديد';
    
    modalBody.innerHTML = `
        <form id="timetable-form">
            <div class="form-row">
                <div class="form-group">
                    <label for="timetable-grade">الصف:</label>
                    <select id="timetable-grade" class="form-control" required>
                        <option value="">اختر الصف</option>
                        <option value="grade1">الصف الأول</option>
                        <option value="grade2">الصف الثاني</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="timetable-section">الشعبة:</label>
                    <select id="timetable-section" class="form-control" required>
                        <option value="">اختر الشعبة</option>
                        <option value="A">شعبة A</option>
                        <option value="B">شعبة B</option>
                        <option value="C">شعبة C</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="timetable-day">اليوم:</label>
                <select id="timetable-day" class="form-control" required>
                    <option value="">اختر اليوم</option>
                    <option value="sunday">الأحد</option>
                    <option value="monday">الاثنين</option>
                    <option value="tuesday">الثلاثاء</option>
                    <option value="wednesday">الأربعاء</option>
                    <option value="thursday">الخميس</option>
                </select>
            </div>
            <div id="lessons-container">
                <div class="lesson-form">
                    <h4>الحصة 1</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="lesson-start-1">وقت البدء:</label>
                            <input type="time" id="lesson-start-1" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="lesson-end-1">وقت الانتهاء:</label>
                            <input type="time" id="lesson-end-1" class="form-control" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="lesson-subject-1">المادة:</label>
                            <input type="text" id="lesson-subject-1" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="lesson-teacher-1">المعلم:</label>
                            <input type="text" id="lesson-teacher-1" class="form-control" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="lesson-room-1">القاعة:</label>
                        <input type="text" id="lesson-room-1" class="form-control" required>
                    </div>
                </div>
            </div>
            <button type="button" class="btn-secondary" id="add-lesson">إضافة حصة أخرى</button>
            <div class="form-actions">
                <button type="submit" class="btn-primary">حفظ الجدول</button>
                <button type="button" class="btn-secondary" id="cancel-timetable">إلغاء</button>
            </div>
        </form>
    `;
    
    modalOverlay.classList.remove('hidden');
    
    // إضافة مستمعات الأحداث للنموذج
    document.getElementById('timetable-form').addEventListener('submit', function(e) {
        e.preventDefault();
        // محاكاة حفظ الجدول
        alert('تم حفظ الجدول بنجاح');
        closeModal();
    });
    
    document.getElementById('cancel-timetable').addEventListener('click', closeModal);
    
    document.getElementById('add-lesson').addEventListener('click', function() {
        // محاكاة إضافة حصة جديدة
        alert('سيتم إضافة حصة جديدة');
    });
}

// عرض نموذج إضافة واجب
function showAssignmentForm() {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.querySelector('.modal-body');
    const modalOverlay = document.getElementById('modal-overlay');
    
    modalTitle.textContent = 'إضافة واجب جديد';
    
    modalBody.innerHTML = `
        <form id="assignment-form">
            <div class="form-group">
                <label for="assignment-title">عنوان الواجب:</label>
                <input type="text" id="assignment-title" class="form-control" required>
            </div>
            <div class="form-group">
                <label for="assignment-description">وصف الواجب:</label>
                <textarea id="assignment-description" class="form-control" rows="4" required></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="assignment-subject">المادة:</label>
                    <input type="text" id="assignment-subject" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="assignment-due-date">موعد التسليم:</label>
                    <input type="date" id="assignment-due-date" class="form-control" required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="assignment-grade">الصف:</label>
                    <select id="assignment-grade" class="form-control" required>
                        <option value="">اختر الصف</option>
                        <option value="grade1">الصف الأول</option>
                        <option value="grade2">الصف الثاني</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="assignment-section">الشعبة:</label>
                    <select id="assignment-section" class="form-control">
                        <option value="">جميع الشعب</option>
                        <option value="A">شعبة A</option>
                        <option value="B">شعبة B</option>
                        <option value="C">شعبة C</option>
                    </select>
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-primary">حفظ الواجب</button>
                <button type="button" class="btn-secondary" id="cancel-assignment">إلغاء</button>
            </div>
        </form>
    `;
    
    modalOverlay.classList.remove('hidden');
    
    // إضافة مستمعات الأحداث للنموذج
    document.getElementById('assignment-form').addEventListener('submit', function(e) {
        e.preventDefault();
        // محاكاة حفظ الواجب
        alert('تم حفظ الواجب بنجاح');
        closeModal();
    });
    
    document.getElementById('cancel-assignment').addEventListener('click', closeModal);
}

// عرض نموذج إضافة امتحان
function showExamForm() {
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.querySelector('.modal-body');
    const modalOverlay = document.getElementById('modal-overlay');
    
    modalTitle.textContent = 'إضافة امتحان جديد';
    
    modalBody.innerHTML = `
        <form id="exam-form">
            <div class="form-group">
                <label for="exam-title">عنوان الامتحان:</label>
                <input type="text" id="exam-title" class="form-control" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="exam-date">تاريخ الامتحان:</label>
                    <input type="date" id="exam-date" class="form-control" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="exam-start-time">وقت البدء:</label>
                        <input type="time" id="exam-start-time" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="exam-end-time">وقت الانتهاء:</label>
                        <input type="time" id="exam-end-time" class="form-control" required>
                    </div>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="exam-subject">المادة:</label>
                    <input type="text" id="exam-subject" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="exam-grade">الصف:</label>
                    <select id="exam-grade" class="form-control" required>
                        <option value="">اختر الصف</option>
                        <option value="grade1">الصف الأول</option>
                        <option value="grade2">الصف الثاني</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="exam-section">الشعبة:</label>
                <select id="exam-section" class="form-control">
                    <option value="">جميع الشعب</option>
                    <option value="A">شعبة A</option>
                    <option value="B">شعبة B</option>
                    <option value="C">شعبة C</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-primary">حفظ الامتحان</button>
                <button type="button" class="btn-secondary" id="cancel-exam">إلغاء</button>
            </div>
        </form>
    `;
    
    modalOverlay.classList.remove('hidden');
    
    // إضافة مستمعات الأحداث للنموذج
    document.getElementById('exam-form').addEventListener('submit', function(e) {
        e.preventDefault();
        // محاكاة حفظ الامتحان
        alert('تم حفظ الامتحان بنجاح');
        closeModal();
    });
    
    document.getElementById('cancel-exam').addEventListener('click', closeModal);
}

// إغلاق النافذة المنبثقة
function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

// إضافة مستمع حدث لإغلاق النافذة المنبثقة
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// بيانات تجريبية للإدارة
function getSampleTimetablesForManagement() {
    return [
        {
            id: 1,
            grade: 'الصف الأول',
            section: 'A',
            day: 'الأحد',
            lessons: [
                { start: '08:00', end: '08:45', subject: 'اللغة العربية', teacher: 'أ. أحمد', room: '101' }
            ]
        },
        {
            id: 2,
            grade: 'الصف الأول',
            section: 'B',
            day: 'الأحد',
            lessons: [
                { start: '08:00', end: '08:45', subject: 'الرياضيات', teacher: 'أ. محمد', room: '102' }
            ]
        }
    ];
}

function getSampleAssignmentsForManagement() {
    return [
        {
            id: 1,
            title: 'تمرين في الرياضيات',
            subject: 'الرياضيات',
            grade: 'الصف الأول',
            dueDate: new Date(Date.now() + 86400000)
        },
        {
            id: 2,
            title: 'بحث في العلوم',
            subject: 'العلوم',
            grade: 'الصف الثاني',
            dueDate: new Date(Date.now() + 172800000)
        }
    ];
}

function getSampleExamsForManagement() {
    return [
        {
            id: 1,
            title: 'امتحان منتصف الفصل - الرياضيات',
            subject: 'الرياضيات',
            grade: 'الصف الأول',
            date: new Date(Date.now() + 604800000)
        },
        {
            id: 2,
            title: 'امتحان الفيزياء',
            subject: 'الفيزياء',
            grade: 'الصف الثاني',
            date: new Date(Date.now() + 864000000)
        }
    ];
}