import { get, post } from '../utils/request';
// 试卷列表
export const subjectsList = (params: any) => {
  return get('/api/subjects/list', params);
};
// 试卷删除
export const subjectsDel = (params: any) => {
  return get('/api/subjects/delete', params);
};