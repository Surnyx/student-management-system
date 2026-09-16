'use strict';

// 应用业务模块：负责 CRUD、搜索、表单状态和页面事件绑定。
// 数据存储、表单校验和 DOM 渲染分别交给对应模块处理。

// 页面启动时优先读取当前浏览器已经保存的学生数据。
let students = StudentStorage.getStudents();

const studentForm = document.getElementById('student-form');
const studentIdInput = document.getElementById('student-id');
const studentNameInput = document.getElementById('student-name');
const studentGenderInput = document.getElementById('student-gender');
const studentAgeInput = document.getElementById('student-age');
const studentMajorInput = document.getElementById('student-major');
const studentClassInput = document.getElementById('student-class');
const editingIdInput = document.getElementById('editing-id');
const studentFormTitle = document.getElementById('student-form-title');
const submitButton = document.getElementById('submit-button');
const cancelEditButton = document.getElementById('cancel-edit-button');
const formPanel = document.querySelector('.form-panel');
const studentTableBody = document.getElementById('student-table-body');
const deleteDialog = document.getElementById('delete-dialog');
const deleteStudentName = document.getElementById('delete-student-name');
const cancelDeleteButton = document.getElementById('cancel-delete-button');
const confirmDeleteButton = document.getElementById('confirm-delete-button');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const clearSearchButton = document.getElementById('clear-search-button');

let pendingDeleteStudentId = '';

function getStudentFromForm() {
  const ageValue = studentAgeInput.value.trim();

  return {
    studentId: studentIdInput.value.trim(),
    name: studentNameInput.value.trim(),
    gender: studentGenderInput.value,
    age: ageValue === '' ? null : Number(ageValue),
    major: studentMajorInput.value.trim(),
    className: studentClassInput.value.trim()
  };
}

function addStudent(student) {
  students.push(student);
  const isSaved = saveAndRenderStudents();
  showSaveResult(isSaved, '已新增学生：' + student.name);

  resetStudentForm();
  studentIdInput.focus();
}

function updateStudent(updatedStudent) {
  const originalStudentId = editingIdInput.value;
  const studentIndex = students.findIndex(function (student) {
    return student.studentId === originalStudentId;
  });

  if (studentIndex === -1) {
    resetStudentForm();
    return;
  }

  students[studentIndex] = updatedStudent;
  const isSaved = saveAndRenderStudents();
  showSaveResult(isSaved, '已更新学生：' + updatedStudent.name);
  resetStudentForm();
}

function handleStudentFormSubmit(event) {
  // 阻止表单刷新页面，改为更新数组并重新渲染。
  event.preventDefault();
  const student = getStudentFromForm();
  const validationResult = StudentValidator.validateStudent(
    student,
    students,
    editingIdInput.value
  );

  if (!validationResult.isValid) {
    StudentRenderer.showValidationErrors(validationResult.errors);
    StudentRenderer.showStatus('请检查表单中的错误信息。', 'error');
    return;
  }

  StudentRenderer.clearValidationErrors();

  if (editingIdInput.value) {
    updateStudent(student);
  } else {
    addStudent(student);
  }
}

function startEditingStudent(studentId) {
  const student = students.find(function (item) {
    return item.studentId === studentId;
  });

  if (!student) {
    return;
  }

  StudentRenderer.clearValidationErrors();

  // 使用隐藏字段记录编辑前的学号，允许用户修改学号本身。
  editingIdInput.value = student.studentId;
  studentIdInput.value = student.studentId;
  studentNameInput.value = student.name;
  studentGenderInput.value = student.gender;
  studentAgeInput.value = student.age;
  studentMajorInput.value = student.major;
  studentClassInput.value = student.className;

  studentFormTitle.textContent = '编辑学生';
  submitButton.textContent = '保存修改';
  cancelEditButton.hidden = false;
  formPanel.classList.add('is-editing');
  studentIdInput.focus();
}

function resetStudentForm() {
  studentForm.reset();
  StudentRenderer.clearValidationErrors();
  editingIdInput.value = '';
  studentFormTitle.textContent = '新增学生';
  submitButton.textContent = '新增学生';
  cancelEditButton.hidden = true;
  formPanel.classList.remove('is-editing');
}

function cancelEditingStudent() {
  resetStudentForm();
  StudentRenderer.showStatus('已取消编辑');
  studentIdInput.focus();
}

function openDeleteDialog(studentId) {
  const student = students.find(function (item) {
    return item.studentId === studentId;
  });

  if (!student) {
    return;
  }

  pendingDeleteStudentId = student.studentId;
  deleteStudentName.textContent = student.name + '（' + student.studentId + '）';
  deleteDialog.showModal();
}

function deleteStudent() {
  const student = students.find(function (item) {
    return item.studentId === pendingDeleteStudentId;
  });

  if (!student) {
    deleteDialog.close();
    return;
  }

  students = students.filter(function (item) {
    return item.studentId !== pendingDeleteStudentId;
  });

  if (editingIdInput.value === student.studentId) {
    resetStudentForm();
  }

  const isSaved = saveAndRenderStudents();
  showSaveResult(isSaved, '已删除学生：' + student.name, 'delete');
  deleteDialog.close();
}

function handleTableClick(event) {
  // 使用事件委托处理动态生成的操作按钮。
  const actionButton = event.target.closest('button[data-action]');

  if (!actionButton || !studentTableBody.contains(actionButton)) {
    return;
  }

  if (actionButton.dataset.action === 'edit') {
    startEditingStudent(actionButton.dataset.studentId);
  } else if (actionButton.dataset.action === 'delete') {
    openDeleteDialog(actionButton.dataset.studentId);
  }
}

function clearPendingDeleteStudent() {
  pendingDeleteStudentId = '';
  deleteStudentName.textContent = '';
}

function filterStudents(keyword) {
  if (!keyword) {
    return students;
  }

  const normalizedKeyword = keyword.toLowerCase();

  return students.filter(function (student) {
    const studentId = student.studentId.toLowerCase();
    const studentName = student.name.toLowerCase();
    return studentId.includes(normalizedKeyword) ||
      studentName.includes(normalizedKeyword);
  });
}

function saveAndRenderStudents() {
  const isSaved = StudentStorage.saveStudents(students);
  renderCurrentStudents();
  return isSaved;
}

function showSaveResult(isSaved, successMessage, successType) {
  if (isSaved) {
    StudentRenderer.showStatus(successMessage, successType || 'success');
  } else {
    StudentRenderer.showStatus(
      successMessage + '，但浏览器未能保存本次修改。',
      'error'
    );
  }
}

function renderCurrentStudents() {
  const keyword = searchInput.value.trim();
  const filteredStudents = filterStudents(keyword);
  const emptyContent = keyword
    ? {
        title: '未找到匹配的学生',
        description: '请尝试其他姓名或学号。'
      }
    : {
        title: '暂无学生信息',
        description: '请先在上方录入学生资料。'
      };

  StudentRenderer.renderStudents(filteredStudents, emptyContent);
  return filteredStudents.length;
}

function handleSearch() {
  const keyword = searchInput.value.trim();
  const resultCount = renderCurrentStudents();

  if (keyword) {
    StudentRenderer.showStatus(
      '关键词“' + keyword + '”找到 ' + resultCount + ' 名学生'
    );
  } else {
    StudentRenderer.showStatus('');
  }
}

function handleSearchSubmit(event) {
  event.preventDefault();
  handleSearch();
}

function clearSearch() {
  searchInput.value = '';
  renderCurrentStudents();
  StudentRenderer.showStatus('已显示全部学生');
  searchInput.focus();
}

function handleStudentFormInput(event) {
  const fieldName = event.target.name;

  if (fieldName) {
    StudentRenderer.clearFieldError(fieldName);
  }
}

function initializeApp() {
  renderCurrentStudents();
  studentForm.addEventListener('submit', handleStudentFormSubmit);
  studentForm.addEventListener('input', handleStudentFormInput);
  cancelEditButton.addEventListener('click', cancelEditingStudent);
  studentTableBody.addEventListener('click', handleTableClick);
  searchForm.addEventListener('submit', handleSearchSubmit);
  searchInput.addEventListener('input', handleSearch);
  clearSearchButton.addEventListener('click', clearSearch);
  cancelDeleteButton.addEventListener('click', function () {
    deleteDialog.close();
  });
  confirmDeleteButton.addEventListener('click', deleteStudent);
  deleteDialog.addEventListener('close', clearPendingDeleteStudent);
}

// 页面结构加载完成后，从一个明确入口启动整个应用。
document.addEventListener('DOMContentLoaded', initializeApp);
