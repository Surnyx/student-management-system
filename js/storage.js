'use strict';

// LocalStorage 模块：统一负责学生数据的读取、初始化和保存。
const StudentStorage = (function () {
  const STORAGE_KEY = 'studentManagement.students.v1';
  const DEFAULT_STUDENTS = [
    {
      studentId: '20240001',
      name: '张三',
      gender: '男',
      age: 20,
      major: '软件工程',
      className: '软件2401'
    },
    {
      studentId: '20240002',
      name: '李明',
      gender: '男',
      age: 21,
      major: '计算机科学',
      className: '计科2402'
    },
    {
      studentId: '20240003',
      name: '王雪',
      gender: '女',
      age: 20,
      major: '软件工程',
      className: '软件2401'
    }
  ];

  function getDefaultStudents() {
    return DEFAULT_STUDENTS.map(function (student) {
      return { ...student };
    });
  }

  function saveStudents(studentList) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(studentList));
      return true;
    } catch (error) {
      console.warn('浏览器本地存储不可用，当前修改仅在本次页面中有效。');
      return false;
    }
  }

  function getStudents() {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);

      if (storedData === null) {
        const defaultStudents = getDefaultStudents();
        saveStudents(defaultStudents);
        return defaultStudents;
      }

      const parsedStudents = JSON.parse(storedData);

      if (!Array.isArray(parsedStudents)) {
        throw new Error('LocalStorage 中的学生数据格式不正确。');
      }

      return parsedStudents;
    } catch (error) {
      const defaultStudents = getDefaultStudents();
      saveStudents(defaultStudents);
      console.warn('读取学生数据失败，已恢复为初始演示数据。');
      return defaultStudents;
    }
  }

  return {
    getStudents: getStudents,
    saveStudents: saveStudents
  };
})();
