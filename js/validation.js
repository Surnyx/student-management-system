'use strict';

// 表单校验模块：只判断数据是否合法，不负责修改数据或操作表格。
const StudentValidator = (function () {
  function isStudentIdDuplicate(studentId, studentList, originalStudentId) {
    return studentList.some(function (student) {
      return student.studentId === studentId &&
        student.studentId !== originalStudentId;
    });
  }

  function validateStudent(student, studentList, originalStudentId) {
    const errors = {};

    if (!student.studentId) {
      errors.studentId = '请输入学号。';
    } else if (
      isStudentIdDuplicate(student.studentId, studentList, originalStudentId)
    ) {
      errors.studentId = '该学号已存在，请更换学号。';
    }

    if (!student.name) {
      errors.name = '请输入学生姓名。';
    }

    if (student.age === null) {
      errors.age = '请输入年龄。';
    } else if (
      !Number.isInteger(student.age) ||
      student.age < 15 ||
      student.age > 100
    ) {
      errors.age = '年龄必须是 15 到 100 之间的整数。';
    }

    if (!student.major) {
      errors.major = '请输入专业。';
    }

    if (!student.className) {
      errors.className = '请输入班级。';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors
    };
  }

  return {
    validateStudent: validateStudent
  };
})();
