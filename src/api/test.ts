import { get, post } from '../utils/request';
// 获取考试列表
export const testList = (params: any = {}) => {
  return get('/api/test/list', params);
};
// 删除考题
export const testDelete = (params: any = {}) => {
  return get('/api/test/delete', params);
};
//  批量删除
export const testDeleteAll = (data: any) => {
  return post('/api/test/deleteall', data);
};
//  修改发布状态
export const updateState = (data: any) => {
  return post('/api/test/updateState', data);
};
//  获取考试题目
export const testStart = (params: any = {}) => {
  return get('/api/test/start', params);
};
//  根据id获取单个考试信息
export const testGet = (params: any = {}) => {
  return get('/api/test/get', params);
};
//  根据id下载单个考试试题列表
export const exportExcel = (params: any = {}, responseType?: any) => {
  return get('/api/test/exportExcel', params, { responseType: 'blob' });
};
// 获取考试分析统计
export const getAnalyse = (params: any = {}) => {
  return get('/api/test/analyse', params);
};
// 获取学生列表
export const reqStudent = (params: any = {}) => {
  return get('/api/student/test', params);
};
// 获取学生考试结果
export const getForResult = (parms: any) => {
  return get('/api/test/getForResult', parms);
};
// 获取老师列表 
export const getTeacher = (parms: any = {}) => {
  return get('/api/teacher/list', parms);
};
// 获取考试阅卷老师
export const getMarkTeachers = (parms: any = {}) => {
  return get('/api/test/getmarkteachers', parms);
};