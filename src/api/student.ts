import {get,post} from '../utils/request'

// 学生列表
export const studentlist = (data:any)=>{
 return get('/api/student/list',data)
}


// 学生单个删除
export const studentdelete = (params:any)=>{
  return get('/api/student/delete',params)
}

// 学生添加和修改
export const studentupdata = (params:any)=>{
  return post('/api/student/add',params)
}

// 部门管理
export const classesdepartment = (params:any)=>{
  return get('/api/department/list',params)
 }
 

 // 学生修改
export const studentuppass = (data:any)=>{
  return post('/api/student/changepass',data)
}


export const classesdes = (ids:any)=>{
  return post('/api/student/deleteall',{ids})
 }
 

