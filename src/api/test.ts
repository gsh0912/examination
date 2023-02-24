
import {get,post} from '../utils/request'
// 获取考试列表
export const testList = (params:any={})=>{
 return get('/api/test/list',params)
}
// 删除考题 
export const testDelete = (params:any={})=>{
  return get('/api/test/delete',params)
 }
//  批量删除 
export const testDeleteAll = (data:any)=>{
  return post('/api/test/deleteall',data)
 }
//  修改发布状态 
export const updateState = (data:any)=>{
  return post('/api/test/updateState',data)
 }
//  获取考试题目 
export const testStart = (params:any={})=>{
  return get('/api/test/start',params)
 }
//  根据id获取单个考试信息
export const testGet = (params:any={})=>{
  return get('/api/test/get',params)
 }
