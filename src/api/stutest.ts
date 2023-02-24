import { get, post } from '../utils/request';
// 获取学生考试列表
export const stutesList = (params: any) => {
  return get('/api/test/list', params);
};
// 获取考试信息
export const examInfo = (params: any) => {
  return get('/api/test/get', params);
};
// 获取学生考试结果
export const getForResult = (params: any) => {
  return get('/api/test/getForResult', params);
};
