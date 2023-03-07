// 登录信息接口

// 题库列表
export interface questionListA {
  page: number;
  psize: number;
  psize: string;
  admin: string;
  ismy: Array;
}

// 题库删除
export  interface Delrule {
  id:number
}

// 题库批量删除
export interface DelArrrule{
  ids:Array<number>
}






  