<template>
  <div id="root">
    <header>
      <img src="../../assets/images/login/logo.png" alt="">
    </header>
    <div class="login">
      <div class="login_big">
        <div class="left">
          <img src="../../assets/images/login/advertise.jpg" alt="">
        </div>
        <div class="right">
          <!-- 二维码登录 -->
          <div class="form" v-if="loginFlag">
            <img class="tabImage" src="../../assets/images/login/qrcode.png" alt="" @click="tabFn">
            <div class="title">账号登录</div>
            <el-input v-model="username" class="w-50 m-2" size="large" placeholder="请输入账号" :prefix-icon="User" @keyup.enter="loginFn"/>
            <el-input v-model="pass" class="w-50 m-2" size="large" type="password" placeholder="请输入密码"
              :prefix-icon="Lock" @keyup.enter="loginFn"/>
            <div class="hint">忘记密码？</div>
            <div class="sub" @click="loginFn">
              登录
            </div>
          </div>
          <!-- 密码登录 -->
          <div class="form" v-else>
            <img class="tabImage" src="../../assets/images/login/password.png" alt="" @click="tabFn">
            <img id="tabHint" src="../../assets/images/login/passhit.png" alt="">
            <div class="title">手机扫码 安全登录</div>
            <div class="code">
              <img src="../../assets/images/login/code.png" alt="" style="width:140px;height:140px;margin-bottom: 20px;">
              <div class="wxcode">打开<span>微信</span>扫一扫登录</div>
              <div class="bottom">密码登录<div class="border"></div>注册新账号</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { debounce } from '../../utils/debounce'
import { login } from '../../api/login'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
// 账号密码文本框
const username = ref<string>('')
const pass = ref<string>('')
// 控制账号登录/二维码登录
let loginFlag = ref<boolean>(true)
const tabFn = () => {
  loginFlag.value = !loginFlag.value
}
// 点击登录 跳转到首页  用到了防抖函数
const loginFn = debounce(async () => {
  if (!username.value) return ElMessage.error('账号不能为空')
  if (!pass.value) return ElMessage.error('密码不能为空')

  let res: any = await login({ username: username.value, pass: pass.value })
  console.log(res);
  if (res.errCode === 10000) {
    if(res.data.type==='student'){
      router.push('/index/stutest')
    }else{
    router.push('/index')
    }
    ElMessage.success(res.errMsg)
    sessionStorage.setItem('token', res.data.token)
    sessionStorage.setItem('menus', JSON.stringify(res.data.menu))
    sessionStorage.setItem("model",JSON.stringify(res.data.model))
    
  } else {
    ElMessage.error(res.errMsg+'密码错误')
  }
}, 300)
</script>

<style scoped lang="less">
   @import url('./login.css');
</style>