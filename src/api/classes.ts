import {get,post} from '../utils/request'


export const classeslist = (params:any={})=>{
 return get('/api/classes/list',params)
}

// 班级单个删除
export const classesdelete = (data:any)=>{
  return get('/api/classes/delete',data)
 }
 
// 班级部门管理
export const classesdepartment = (data:any)=>{
  return get('/api/department/list',data)
 }
//  班级添加 / 修改班级
export const addClasses = (data:any)=>{
  return post('/api/classes/add',data)
 }

 
 export const classesides = (ids:any)=>{
  return post('/api/classes/deleteall',{ids})
 }
 