import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { ElMessage } from 'element-plus';
import { start, close } from '../utils/nprogress';

// 路由类型:RouteRecordRaw
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    meta: {
      title: '考试系统',
    },
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
        path: '/index/Analyse',
        component: () => import('../views/test/Analyse/Analyse.vue'),
        meta: {
          title: '数据分析',
        },
      },
      {
        path: '/index/testAdd',
        component: () => import('../views/test/testAdd/testAdd.vue'),
        meta: {
          title: '创建考试',
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
        path: '/index/examstudent',
        component: () => import('../views/exam/examstudent.vue'),
        meta: {
          title: '阅卷',
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
        path: '/index/subjectAdd',
        component: () => import('../views/subjects/subjectAdd/subjectAdd.vue'),
        meta: {
          title: '试卷管理',
        },
      },
      {
        path: '/index/databaselist',
        component: () => import('../views/databaselist/databaselist.vue'),
        meta: {
          title: '题库试卷',
        },
      },
      {
        path: '/index/databasequestionlist',
        component: () => import('../views/databaselist/databasequestionlist/databasequestionlist.vue'),
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
      {
        path: '/index/stutest',
        component: () => import('../views/stutest/stutest.vue'),
        meta: {
          title: '考试管理',
        },
      },
      {
        path: '/index/set',
        component: () => import('../views/set/set.vue'),
        meta: {
          title: '设置管理',
        },
      },
    ],
  },
  {
    path: '/examprepare',
    component: () => import('../views/stutest/examprepare.vue'),
    meta: {
      title: '考试管理',
    },
  },
  {
    path: '/examresults',
    component: () => import('../views/stutest/examresults.vue'),
    meta: {
      title: '考试管理',
    },
  },
  {
    path: '/stuexamwrong',
    component: () => import('../views/stutest/stuexamwrong.vue'),
    meta: {
      title: '考试管理',
    },
  },
  {
    path: '/examination',
    component: () => import('../views/stutest/examination.vue'),
    meta: {
      title: '考试管理',
    },
  },
];

const router = createRouter({
  // 路由模式
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  // 获取token
  const token = sessionStorage.getItem('token');
  // 有token
  if (token) {
    // 直接放行
    next();
  } else {
    // 否则是没有
    // 如果去的是登录页
    if (to.path === '/login') {
      // 直接放行
      next();
    } else {
      // 如果去的是其他页,跳转到登录页
      ElMessage.error('请登录以后再操作！');
      // 跳转到登录页
      return next({ path: '/login' });
    }
  }
  start();
});
// 全局后置路由 每次切换路由后更换标题
router.afterEach((to) => {
  document.title = to.meta.title as string;
  close();
});
export default router;
