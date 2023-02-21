 import {get,post} from '../utils/request'

 export const login = (data:any)=>{
  return post('/api/teacher/checklogin',data)
 }