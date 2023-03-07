// 登录信息接口
export interface ILogin {
  username: string;
  pass: string;
}
// 菜单返回
export interface IMenu {
  id: number;
  name: string;
  ico?: any;
  url?: any;
  pid: number;
  sort: number;
  checked: number;
  postion?: any;
  children?: any;
}
