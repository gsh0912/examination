// 角色添加
export interface IRoleadd {
  id: number;
  name: string;
  menus: Array<IRoleadd1>;
}
export interface IRoleadd1 {
  id: number;
}
// 权限列表
export interface IRoleMenu {
  roleid?: number;
}
// 权限列表返回样式
export interface RootObject {
  id: number;
  name: string;
  ico: string;
  url: string;
  pid: number;
  sort: number;
  checked: number | boolean;
  postion: string;
  children: Child[];
}

export interface Child {
  id: number;
  name: string;
  ico?: any;
  url?: any;
  pid: number;
  sort: number;
  checked: number | boolean;
  postion?: any;
  children?: any;
}
