import { get, post } from '../utils/request'

// 获取题库列表
export const reqList = (params: any = {}) => {
  return get('/api/database/list', params)
}
// 批量删除 
export const deleteAllList = (data: any) => {
  return post('/api/databasequestion/deleteall', data)
}
