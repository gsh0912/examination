import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import 'element-plus/dist/index.css';
import router from './router';
import './assets/font/iconfont.css';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'default-passive-events';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
// if (import.meta.env.VITE_BASE_URL !== 'development') { // process是Node环境全部变量, 运行时根据敲击的命令不同, 脚手架会取环境变量给env添加属性和值
//   console.log = function () { }
//   console.error = function () { }
//   console.dir = function () { }
// }
createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app');
