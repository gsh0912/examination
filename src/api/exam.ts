import { get, post } from '../utils/request';
// 阅卷列表
export const testList = (params: any) => {
  return get('/api/test/list', params);
};
// 获取学生考试列表
export const studentList = (params: any) => {
  return get('/api/student/test', params);
};
// 部门列表 
export const department=(params:any)=>{
  return get("/api/department/list",params)
}
// 判卷 列表
export const question=(params:any)=>{
  return get("/api/question/listforstu",params)
}
// 判卷 
export const questionUpd=(data:any)=>{
  return post("/api/studentanswer/update",data)
} 