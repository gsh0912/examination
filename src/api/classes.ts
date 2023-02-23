import {get,post} from '../utils/request'

// 列表
export const classeslist = (data:any)=>{
 return get('/api/classes/list',data)
}

// 单个删除
export const classesdelete = (data:any)=>{
  return get('/api/classes/delete',data)
 }
 
// 部门管理
export const classesdepartment = (data:any)=>{
  return get('/api/department/list',data)
 }
 