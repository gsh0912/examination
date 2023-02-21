
import {get,post} from '../utils/request'
// 获取考试列表
export const testList = (params:any={})=>{
 return get('/api/test/list',params)
}
// 删除考题 
export const testDelete = (params:any={})=>{
  return get('/api/test/delete',params)
 }