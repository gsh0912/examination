import { get, post } from '../../utils/request';

// 考试列表
const reqTestList = (data: any) => get('/api/test/list', data);
// 删除试题
const reqTestDel = (data: any) => get('/api/test/delete', data);
// 修改发布状态
const reqTestState = (data: any) => post('/api/test/updateState', data);
// 批量删除试题
const reqTestDelall = (data: any) => post('api/test/deleteall', data);
// 根据id获取单个考试信息
const reqTestTopic = (data: any) => get('/api/test/get', data);
// 部门列表
const reqDepartmentList = (data?: any) => get('/api/department/list', data);
// 班级列表
const reqClassesList = (data?: any) => get('/api/classes/list', data);
// 考试学生列表
const reqStudentList = (data?: any) => get('/api/student/list', data);
// 老师列表
const reqTeacherList = (data?: any) => get('/api/teacher/list', data);
// 考试学生添加
const reqStudentAdd = (data: any) => post('/api/teststudents/add', data);
// 考试可见老师添加
const reqVisibleTeache = (data: any) => post('/api/testlimit/add', data);
// 考试阅卷老师添加
const reqCriticizeTeacher = (data: any) =>
  post('/api/testmarkteacher/add', data);
// 考试分析统计
const reqTestAnalyse = (data: any) => get('/api/test/analyse', data);
// 考试学生列表
const reqTestStudent = (data: any) => get('/api/student/test', data);
// 考试学生答题列表(判卷)
const reqTestAnswer = (data: any) => get('/api/question/listforstu', data);
// 考试学生结果
const reqTestForResult = (data: any) => get('/api/test/getForResult', data);
// 老师判卷
const reqAnswerUpdate = (data: any[]) =>
  post('/api/studentanswer/update', data);
// 根据id下载单个考试试题列表
const reqExportExcel = (data: any) =>
  get('/api/test/exportExcel', data, 'blob');
// 导出学生考试结果
const reqTestResult = (data: any) =>
  get('/api/student/exportExcel', data, 'blob');
// 获取题库
const reqDatabaseList = (data?: any) => get('/api/database/list', data);
// 添加题库
const reqDatabaseAdd = (data: any) => post('/api/database/add', data);
// 发布考试
const reqConfirmTest = (data: any) => post('/api/test/add', data);
// 试卷列表
const reqSubjectList = (data: any) => get('/api/subjects/list', data);
// 获取单条试卷数据
const reqSubjectOne = (data: { id: number }) => get('/api/subjects/get', data);
// 根据题库id获取试题列表
const reqDatabasequestion = (data: any) =>
  get('/api/databasequestion/list', data);
// 获取考试题目
const reqTestStart = (data: { testid: number }) => get('/api/test/start', data);
// 学生答题
const reqStudentanswer = (data: any) => post('/api/studentanswer/add', data);
// 修改密码
const reqChangePass = (data: { oldpass: string; pass: string }) =>
  post('/api/student/changepass', data);
export default {
  reqTestList,
  reqTestDel,
  reqTestDelall,
  reqTestState,
  reqTestTopic,
  reqDepartmentList,
  reqClassesList,
  reqStudentList,
  reqStudentAdd,
  reqTeacherList,
  reqVisibleTeache,
  reqCriticizeTeacher,
  reqTestAnalyse,
  reqTestStudent,
  reqTestAnswer,
  reqTestForResult,
  reqAnswerUpdate,
  reqExportExcel,
  reqTestResult,
  reqDatabaseList,
  reqDatabaseAdd,
  reqConfirmTest,
  reqSubjectList,
  reqSubjectOne,
  reqDatabasequestion,
  reqTestStart,
  reqStudentanswer,
  reqChangePass,
};
