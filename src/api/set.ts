import { get, post } from '../utils/request';
// 学生修改密码
export const studentUpd = (data: any) => {
  return post('/api/student/changepass', data);
};