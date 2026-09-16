'use strict';

// 页面渲染模块：只负责把学生数据转换为页面元素。
const StudentRenderer = (function () {
  const tableBody = document.getElementById('student-table-body');
  const tableWrapper = document.querySelector('.table-wrapper');
  const emptyState = document.getElementById('empty-state');
  const emptyStateTitle = emptyState.querySelector('p');
  const emptyStateDescription = emptyState.querySelector('span');
  const studentCount = document.getElementById('student-count');
  const statusMessage = document.getElementById('status-message');
  const validationFields = {
    studentId: {
      input: document.getElementById('student-id'),
      error: document.getElementById('student-id-error')
    },
    name: {
      input: document.getElementById('student-name'),
      error: document.getElementById('student-name-error')
    },
    age: {
      input: document.getElementById('student-age'),
      error: document.getElementById('student-age-error')
    },
    major: {
      input: document.getElementById('student-major'),
      error: document.getElementById('student-major-error')
    },
    className: {
      input: document.getElementById('student-class'),
      error: document.getElementById('student-class-error')
    }
  };

  function createTableCell(value) {
    const cell = document.createElement('td');
    cell.textContent = String(value);
    return cell;
  }

  function createActionButton(text, className, action, studentId) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button ' + className;
    button.textContent = text;
    button.dataset.action = action;
    button.dataset.studentId = studentId;
    button.setAttribute('aria-label', text + '学生 ' + studentId);
    return button;
  }

  function createStudentRow(student) {
    const row = document.createElement('tr');
    row.dataset.studentId = student.studentId;

    const values = [
      student.studentId,
      student.name,
      student.gender,
      student.age,
      student.major,
      student.className
    ];

    values.forEach(function (value) {
      row.appendChild(createTableCell(value));
    });

    const actionCell = document.createElement('td');
    const actionGroup = document.createElement('div');
    actionGroup.className = 'table-actions';
    actionGroup.appendChild(
      createActionButton('编辑', 'button-edit', 'edit', student.studentId)
    );
    actionGroup.appendChild(
      createActionButton('删除', 'button-delete', 'delete', student.studentId)
    );
    actionCell.appendChild(actionGroup);
    row.appendChild(actionCell);

    return row;
  }

  function renderStudents(studentList, emptyContent) {
    // 每次操作后先清空旧内容，再根据最新数组重新生成列表。
    tableBody.replaceChildren();

    studentList.forEach(function (student) {
      tableBody.appendChild(createStudentRow(student));
    });

    const hasStudents = studentList.length > 0;
    tableWrapper.hidden = !hasStudents;
    emptyState.hidden = hasStudents;
    studentCount.textContent = String(studentList.length);

    if (!hasStudents && emptyContent) {
      emptyStateTitle.textContent = emptyContent.title;
      emptyStateDescription.textContent = emptyContent.description;
    }
  }

  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = 'status-message';

    if (type) {
      statusMessage.classList.add('is-' + type);
    }
  }

  function clearFieldError(fieldName) {
    const field = validationFields[fieldName];

    if (!field) {
      return;
    }

    field.input.removeAttribute('aria-invalid');
    field.error.textContent = '';
  }

  function clearValidationErrors() {
    Object.keys(validationFields).forEach(function (fieldName) {
      clearFieldError(fieldName);
    });
  }

  function showValidationErrors(errors) {
    clearValidationErrors();
    let firstInvalidInput = null;

    Object.keys(errors).forEach(function (fieldName) {
      const field = validationFields[fieldName];

      if (!field) {
        return;
      }

      field.input.setAttribute('aria-invalid', 'true');
      field.error.textContent = errors[fieldName];

      if (!firstInvalidInput) {
        firstInvalidInput = field.input;
      }
    });

    if (firstInvalidInput) {
      firstInvalidInput.focus();
    }
  }

  return {
    renderStudents: renderStudents,
    showStatus: showStatus,
    clearFieldError: clearFieldError,
    clearValidationErrors: clearValidationErrors,
    showValidationErrors: showValidationErrors
  };
})();
