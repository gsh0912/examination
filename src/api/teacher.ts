import {get,post} from '../utils/request'
// 师资列表
export const teacherList = (params:any={})=>{
  return get('/api/teacher/list',params)
 }
//  删除老师信息
export const deleteList = (params:any={})=>{
  return get('/api/teacher/delete',params)
 }
//  修改老师密码
export const changePassList = (params:any={})=>{
  return get('/api/teacher/changePass',params)
 }
 //  添加老师
export const addList = (params:any={})=>{
  return post('/api/teacher/add',params)
 }
 // 部门管理
export const classesdepartment = (data:any)=>{
  return get('/api/department/list',data)
 }
 