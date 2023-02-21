import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// 路由类型:RouteRecordRaw
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: "/login",
    component: () => import("../views/login/login.vue"),
  },
  {
    path: "/index",
    component: () => import("../views/index/index.vue"),
    children: [
      {
        path: "/index",
        redirect: '/index/test'
      },
      {
        path: "/index/test",
        component: () => import("../views/test/test.vue"),
        meta:{
          title:'考试管理'
        }
      },
      {
        path: "/index/exam",
        component: () => import("../views/exam/exam.vue"),
        meta:{
          title:'阅卷管理'
        }
      }
    ]
  }
];

const router = createRouter({
  // 路由模式
  history: createWebHistory(),
  routes,
});

export default router;