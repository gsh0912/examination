import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import 'element-plus/dist/index.css';
import router from './router';
import './assets/font/iconfont.css';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'default-passive-events';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
// import.meta.env.VITE_BASE_URL !== 'development' ? console.log = function () { } : ''

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app');
