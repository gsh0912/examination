import { defineStore } from 'pinia';
export const useMainStore = defineStore<any>('dialog', {
  // 1. 定义容器、导出容器
  // 参数1：容器的ID，必须是唯一的，后面Pinia会把所有的容器挂载到根容器
  // 参数2：一些选项对象，也就是state、getter和action
  // 返回值：一个函数，调用即可得到容器实例
  // 类似于Vue2组件中的data，用于存储全局状态数据，但有两个要求
  // 1. 必须是函数，目的是为了在服务端渲染的时候避免交叉请求导致的数据状态污染
  // 2. 必须是箭头函数，这样是为了更好的 TS 类型推导
  state: () => {
    return {
      // 考试模块试题展示弹框
      showTestDialog: false,
      // 学生 可见 阅卷老师弹框
      showSkyDialog: false,
      // 考试模块右侧弹出层
      showDrawer: false,
      drawerData: {} as any,
      // 阅卷模块右侧弹出层 题目
      examDrawer: false,
      examTitle: '',
      examData: [] as any,
      // 创建考试 - 添加题库
      questionDialog: false,
      visibleTeacher: [] as any,
      // 创建考试 添加试题
      createAddTest: false, // 试题弹框
      createTestTitle: '', // 添加 还是修改试题
      testIndex: 0, // 试题修改下标
      // 创建考试数据回显
      createTestData: {} as any,
      // 创建考试批量导入dialog
      showExportDialog: false,
      // 创建考试选择已有试卷或从题库导入
      showTestpaperDialog: false,
      testpaperTitle: '',
      // 从题库导入试题里面的弹框 显示题库试题列表
      showTestpaperList: false,
    };
  },
  getters: {},
  actions: {},
  // persist: {
  //   // 修改存储中使⽤的键名称,默认为当前 store 的 id
  //   key: 'test',
  //   // 修改为存储⽅式,默认为 localStorage
  //   storage: window.sessionStorage,
  //   // 按需持久化部分数据,[]意味着没有状态被持久化(默认为undefined,持久化整个状态)
  //   paths: ['createTestData'],
  // },
});
