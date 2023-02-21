<template>
  <div class="common-layout">
    <el-container>
      <el-aside>
        <div class="user">
          <img src="../../assets/images/index/userImg.png" alt="">
        </div>
        <div class="menu" v-for="item in data.menuList" :key="item.id" :class="route.path ==='/index'+item.url ? 'menuActive' : ''"
          @click="menuFn(item)">
          <i :class="item.ico" class="iconfont"></i>
          <p>{{ item.name }}</p>
        </div>
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
// 获取左侧菜单
const data = reactive({
  menuList: JSON.parse(sessionStorage.getItem('menus')!).filter((item: any) => item.postion === 'left')
})
console.log(data.menuList);

interface Imenu {
  checked: boolean,
  children?: [],
  ico: string,
  id: number,
  name: string,
  pid: number,
  postion: string,
  sort: number,
  url: string
}
// 点击单个菜单 显示高亮and跳转页面
const menuFn = (val: Imenu) => {
  router.push('/index' + val.url)
}


</script>

<style scoped>
@import url('./index.wxss');
</style>