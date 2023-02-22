import {get,post} from '../utils/request'

// 学生列表
export const studentlist = (data:any)=>{
 return get('/api/student/list',data)
}


// 学生单个删除
export const studentdelete = (data:any)=>{
  return get('/api/student/delete',data)
}

// 学生修改
export const studentupdata = (data:any)=>{
  return post('/api/student/add',data)
}

// 部门管理
export const classesdepartment = (data:any)=>{
  return get('/api/department/list',data)
 }
 

 // 学生修改
export const studentuppass = (data:any)=>{
  return post('/api/student/changepass',data)
}


