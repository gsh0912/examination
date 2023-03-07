import {get,post} from '../utils/request'

// 列表
export const classeslist = (params:any={})=>{
 return get('/api/classes/list',params)
}

// 单个删除
export const classesdelete = (data:any)=>{
  return get('/api/classes/delete',data)
 }
 
// 部门管理
export const classesdepartment = (data:any)=>{
  return get('/api/department/list',data)
 }
//  添加 / 修改班级
export const addClasses = (data:any)=>{
  return post('/api/classes/add',data)
 }

 