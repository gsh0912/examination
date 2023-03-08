<template>
  <div class="common-layout">
    <el-container>
      <el-aside>
        <div class="user" @click="infobox">
          <img src="../../assets/images/index/userImg.png" alt="" />
        </div>
        <!-- 信息框 -->
        <div v-if="flag" class="infobox">
          <div class="box"></div>
          <div class="editerBox">
            <div class="editer">
              <img src="../../assets/images/index/userImg.png" />
            </div>
          </div>
          <div class="name">{{ infoData.info.name }}</div>
          <div class="name">部门：{{ infoData.info.depname }}</div>
          <div class="butBox">
            <el-button @click="logout">退出登录</el-button>
          </div>
          <div class="accountBox">
            <div class="account">
              <img
                style="width: 20px"
                src="../../assets/images/index/userImg.png"
              />
              <span class="title">账号</span>
            </div>
            <div style="font-size: 13px">{{ infoData.info.username }}</div>
          </div>
          <div class="accountBox">
            <div class="account">
              <img
                style="width: 20px"
                src="../../assets/images/index/userImg.png"
              />
              <span class="title">密码</span>
            </div>
            <div class="accountName" @click="set">设置</div>
          </div>
          <div class="accountBox">
            <div class="account">
              <img
                style="width: 20px"
                src="../../assets/images/index/userImg.png"
              />
              <span class="title">微信</span>
            </div>
            <div class="accountName">未绑定</div>
          </div>
        </div>
        <div
          class="menu"
          v-for="item in data.menuList"
          :key="item.id"
          :class="route.path === '/index' + item.url ? 'menuActive' : ''"
          @click="menuFn(item)"
        >
          <i :class="item.ico" class="iconfont"></i>
          <p>{{ item.name }}</p>
        </div>
      </el-aside>
      <el-main @click="close">
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();
// 获取左侧菜单
const data = reactive({
  menuList: JSON.parse(sessionStorage.getItem('menus')!).filter(
    (item: any) => item.postion === 'left'
  ),
});
// console.log(data.menuList);

interface Imenu {
  checked: boolean;
  children?: [];
  ico: string;
  id: number;
  name: string;
  pid: number;
  postion: string;
  sort: number;
  url: string;
}
// 点击单个菜单 显示高亮and跳转页面
const menuFn = (val: Imenu) => {
  router.push('/index' + val.url);
};
// 隐藏 开启 菜单框
let flag = ref(false);
const infobox = () => {
  flag.value = !flag.value;
};
// 关闭菜单栏
const close = () => {
  flag.value = false;
};
// 从缓存中读取数据
const infoData = reactive({
  info: JSON.parse(sessionStorage.getItem('model')!),
});
// 退出登录
const logout = () => {
  window.onbeforeunload = function (e) {
    var storage = window.sessionStorage;
    storage.clear();
  };
  ElMessage({
    message: '退出成功',
    type: 'success',
  });
  setTimeout(() => {
    router.push('/login');
  }, 500);
};
const set = () => {
  router.push('/index/set');
};
</script>

<style scoped>
@import url('./index.css');
</style>
