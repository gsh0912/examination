import { get, post } from '../utils/request';

// 获取题库列表
export const reqList = (params: any = {}) => {
  return get('/api/database/list', params);
};
// 批量删除
export const deleteAllList = (data: any) => {
  return post('/api/database/deleteall', data);
};
// 删除题库
export const deleteList = (params: any) => {
  return get('/api/database/delete', params);
};
// 获取试卷列表
export const databasequestion = (params: any) => {
  return get('/api/databasequestion/list', params);
};
// 试卷删除
export const databasequestionDel = (params: any) => {
  return get('/api/databasequestion/delete', params);
};
// 试卷批量删除
export const databasequestionDelall = (data: any) => {
  return post('/api/databasequestion/deleteall', data);
};
// 
export const exportExcel = (params: any = {}, responseType?: Object) => {
  return get('/api/databasequestion/exportExcel', params, { responseType: 'blob' });
};



// 添加试题 
export const questionAdd = (data: any) => {
  return post('/api/databasequestion/add', data)
}
// 添加题库
export const databaseAdd = (data: any) => {
  return post('/api/database/add', data)
}