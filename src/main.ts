import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import './assets/font/iconfont.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'default-passive-events'
createApp(App).use(router).use(ElementPlus, {
  locale: zhCn,
}).mount('#app')
