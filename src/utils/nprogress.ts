// src/utils/nprogress.ts  路径随意，建个文件就行了，我这里是vue3 ＋ ts，用vue2 + js也一样。

import NProgress from "nprogress";
import "nprogress/nprogress.css";

//全局进度条的配置
NProgress.configure({
  easing: "ease", // 动画方式
  speed: 1000, // 递增进度条的速度
  showSpinner: false, // 是否显示加载icon
  trickleSpeed: 100, // 自动递增间隔
  minimum: 0.3, // 初始化时的最小百分比
});

// 打开进度条
export const start = () => {
  NProgress.start();
};

// 关闭进度条
export const close = () => {
  NProgress.done();
};
