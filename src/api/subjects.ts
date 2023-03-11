import { get, post } from '../utils/request';
// 试卷列表
export const subjectsList = (params: any) => {
  return get('/api/subjects/list', params);
};
// 试卷删除
export const subjectsDel = (params: any) => {
  return get('/api/subjects/delete', params);
};
// 添加试卷
export const subjectsAdd = (data: any) => {
  return post('/api/subjects/add', data);
};
// 获取单条试卷信息 
export const subjectsGet = (params: any) => {
  return get('/api/subjects/get', params);
};
// 根据id下载单个试卷试题列表 
export const subjectsExcel = (params: any) => {
  return get('/api/subjects/exportExcel', params);
};