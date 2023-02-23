import { get, post } from '../utils/request'

// 获取部门列表
export const reqList = (params: any = {}) => {
  return get('/api/department/list', params)
}
// 添加/修改 部门列表 
export const addDepartment = (data: any) => {
  return post('/api/department/add', data)
}
// 删除部门列表
export const delDepartment = (params: any = {}) => {
  return get('/api/department/delete', params)
}