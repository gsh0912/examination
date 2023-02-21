import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 路由类型:RouteRecordRaw
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: () => import('../views/login/login.vue'),
  },
  {
    path: '/index',
    component: () => import('../views/index/index.vue'),
    children: [
      {
        path: '/index',
        redirect: '/index/test',
      },
      {
        path: '/index/test',
        component: () => import('../views/test/test.vue'),
        meta: {
          title: '考试管理',
        },
      },
      {
        path: '/index/exam',
        component: () => import('../views/exam/exam.vue'),
        meta: {
          title: '阅卷管理',
        },
      },
      {
        path: '/index/subjects',
        component: () => import('../views/subjects/subjects.vue'),
        meta: {
          title: '试卷管理',
        },
      },
      {
        path: '/index/databaselist',
        component: () => import('../views/databaselist/databaselist.vue'),
        meta: {
          title: '题库管理',
        },
      },
      {
        path: '/index/department',
        component: () => import('../views/department/department.vue'),
        meta: {
          title: '部门管理',
        },
      },
      {
        path: '/index/teacher',
        component: () => import('../views/teacher/teacher.vue'),
        meta: {
          title: '师资管理',
        },
      },
      {
        path: '/index/classes',
        component: () => import('../views/classes/classes.vue'),
        meta: {
          title: '班级管理',
        },
      },
      {
        path: '/index/student',
        component: () => import('../views/student/student.vue'),
        meta: {
          title: '学员管理',
        },
      },
      {
        path: '/index/role',
        component: () => import('../views/role/role.vue'),
        meta: {
          title: '角色管理',
        },
      },
    ],
  },
];

const router = createRouter({
  // 路由模式
  history: createWebHistory(),
  routes,
});

export default router;
