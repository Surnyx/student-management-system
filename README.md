# 学生信息管理系统

## 项目简介

一个使用 HTML、CSS、原生 JavaScript 和 LocalStorage 开发的前端学生信息管理项目。

项目实现了学生信息的新增、查询、修改、删除、实时搜索和表单校验。所有数据保存在当前浏览器的 LocalStorage 中，不依赖服务器、数据库、Node.js 或任何前端框架，可直接打开运行，也适合部署到 GitHub Pages。

## 在线体验

- 在线访问地址：[打开学生信息管理系统](https://surnyx.github.io/student-management-system/)
- GitHub 仓库地址：[Surnyx/student-management-system](https://github.com/Surnyx/student-management-system)

## 项目截图

截图计划存放位置：

```text
docs/screenshots/student-management-system.png
```

> 项目完成公开部署后补充正式截图。

## 技术栈

- HTML5
- CSS3
- 原生 JavaScript
- LocalStorage

项目没有使用 Vue、React、TypeScript、Bootstrap、Tailwind CSS、Node.js、npm、后端接口或数据库。

## 功能介绍

- 展示全部学生信息
- 新增学生
- 编辑已有学生
- 删除学生并进行自定义确认
- 按姓名或学号实时搜索
- 清空搜索并恢复全部数据
- 校验必填字段
- 校验重复学号
- 校验合理年龄范围
- 使用 LocalStorage 持久化数据
- 无刷新更新学生列表
- 适配桌面、平板和手机屏幕

学生信息包含以下字段：

- 学号
- 姓名
- 性别
- 年龄
- 专业
- 班级

## 项目结构

```text
student-management-system/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── storage.js
│   ├── validation.js
│   ├── render.js
│   └── app.js
├── .gitignore
└── README.md
```

## 如何运行

本项目不需要安装依赖，也不需要启动本地服务器。

1. 下载或克隆项目。
2. 进入项目目录。
3. 直接双击 `index.html`。
4. 使用现代浏览器打开页面。

也可以将整个目录放到任意静态网站托管平台中运行。

## 核心实现思路

页面中的学生数据没有写死在 HTML 表格中。应用启动后先读取 LocalStorage，再通过 JavaScript 创建表格行和单元格。

主要数据流程：

```text
读取 LocalStorage
        ↓
恢复 students 数组
        ↓
renderStudents() 动态渲染
        ↓
用户执行新增、修改、删除或搜索
        ↓
更新数组并重新渲染
```

表格渲染使用 `document.createElement()` 和 `textContent`，没有使用 `innerHTML` 拼接学生输入内容。

## CRUD 实现方式

### 新增

监听表单的 `submit` 事件，调用 `preventDefault()` 阻止页面刷新。表单通过校验后，使用 `push()` 将新学生加入数组，然后保存并重新渲染。

### 查询

页面加载时读取完整学生数组，并调用 `renderStudents()` 展示全部数据。

### 修改

点击编辑按钮后，通过学号找到目标学生，并把原数据回填到同一个表单。隐藏字段保存编辑前的学号，提交后使用 `findIndex()` 定位并替换原记录。

### 删除

点击删除按钮后打开自定义确认弹窗。确认删除时使用 `filter()` 生成不包含目标学生的新数组，再保存并重新渲染。

### 搜索

监听搜索框的 `input` 事件，使用 `filter()` 和 `includes()` 按姓名或学号实时筛选。搜索过程不刷新页面，也不会修改原始学生数组。

## 数据校验

表单提交前会检查：

- 学号不能为空
- 姓名不能为空
- 学号不能重复
- 年龄必须是 15 到 100 之间的整数
- 专业不能为空
- 班级不能为空

校验失败时，错误信息显示在对应输入框下方，并通过 `aria-invalid` 标记错误状态。用户重新输入后，对应错误会自动清除。

## LocalStorage 实现方式

项目使用以下存储键保存学生数组：

```text
studentManagement.students.v1
```

保存时使用：

```javascript
localStorage.setItem(
  STORAGE_KEY,
  JSON.stringify(studentList)
);
```

读取时使用：

```javascript
const studentList = JSON.parse(
  localStorage.getItem(STORAGE_KEY)
);
```

首次访问时会初始化三条演示数据。新增、修改和删除后都会重新保存，因此刷新页面后数据仍然存在。

LocalStorage 数据只保存在当前浏览器和当前网站来源中：

- 不同浏览器之间不共享数据
- 不同设备之间不共享数据
- 不同访问者之间不共享数据
- 清除浏览器网站数据后记录会消失

## 模块化设计

项目通过多个普通 JavaScript 文件进行职责拆分，同时避免 ES Module 在部分 `file://` 环境中的加载限制。

### `storage.js`

- 初始化演示数据
- 读取 LocalStorage
- 保存 LocalStorage
- 处理存储异常

### `validation.js`

- 检查必填字段
- 检查重复学号
- 检查年龄范围和整数格式
- 返回统一校验结果

### `render.js`

- 动态创建学生表格
- 更新学生数量
- 显示空状态
- 显示操作结果
- 显示和清除字段错误

### `app.js`

- 管理学生数组
- 完成新增、修改和删除
- 完成实时搜索
- 管理新增和编辑表单状态
- 绑定页面事件
- 协调存储、校验和渲染模块

脚本按照以下依赖顺序加载：

```text
storage.js → validation.js → render.js → app.js
```

## 页面设计

页面参考 Apple 和 iOS 的简洁设计语言：

- 使用浅灰背景和系统字体
- 使用充足留白和清晰信息层级
- 主要容器使用轻量 Liquid Glass 效果
- 输入框和按钮采用柔和圆角
- 使用系统蓝作为主要强调色
- 删除操作使用低调的系统红
- 表格只使用浅色分割线
- 动画保持轻微和克制
- 支持 `prefers-reduced-motion`

玻璃效果只用于主要容器、搜索区和确认弹窗，没有应用到每一个表格单元格，以免影响内容清晰度。

## 测试情况

已经检查：

- JavaScript 语法
- 新增、修改、删除业务链路
- 姓名和学号搜索
- 清空搜索
- 重复学号校验
- 年龄边界校验
- LocalStorage 初始化、保存和读取
- 空数组持久化
- 损坏数据恢复
- DOM 动态渲染
- 自定义删除确认
- 响应式布局
- 静态资源相对路径
- 禁用技术栈和敏感信息

## 部署说明

本项目适合使用 GitHub Pages 部署：

1. 将项目上传到 GitHub 仓库。
2. 打开仓库的 Pages 设置。
3. 选择包含 `index.html` 的分支和根目录。
4. 等待 GitHub 生成公开访问地址。
5. 将生成的地址补充到本 README 的“在线体验”部分。

项目部署后不需要登录、安装软件或下载源码，访问者打开 URL 即可使用。

## 项目说明

这是一个适合软件工程专业学生进行课程实践和简历展示的纯前端项目，重点展示以下能力：

- 原生 JavaScript DOM 操作
- 完整 CRUD 流程
- 表单事件和数据校验
- 数组查询与筛选
- LocalStorage 持久化
- 前端代码模块化
- 响应式页面设计
- 静态网站部署兼容性
