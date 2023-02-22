
import { get, post } from '../utils/request'
// 获取角色列表
export const roleList = (params: any = {}) => {
  return get('/api/role/list', params)
}
// 获取权限列表
export const menuList = (params: any = {}) => {
  return get('/api/menu/list', params)
}
// 添加角色
export const roleAdd = (data: any ) => {
  return post('/api/role/add', data)
}
// 删除角色 
export const roledel = (params: any={} ) => {
  return get('/api/role/delete', params)
}