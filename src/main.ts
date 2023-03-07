import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import router from './router';
import './assets/font/iconfont.css';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import 'default-passive-events';
const pinia = createPinia();
createApp(App)
  .use(router)
  .use(pinia)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app');
