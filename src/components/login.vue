<template>
  <div id="root">
    <header>
      <img src="../assets/images/login/logo.png" alt="">
    </header>
    <div class="login">
      <div class="login_big">
        <div class="left">
          <img src="../assets/images/login/advertise.jpg" alt="">
        </div>
        <div class="right">
          <!-- 二维码登录 -->
          <div class="form" v-if="loginFlag">
            <img class="tabImage" src="../assets/images/login/qrcode.png" alt="" @click="tabFn">
            <div class="title">账号登录</div>
            <el-input v-model="input1" class="w-50 m-2" size="large" placeholder="请输入账号" :prefix-icon="User" />
            <el-input v-model="input1" class="w-50 m-2" size="large" placeholder="请输入密码" :prefix-icon="Lock" />
            <div class="hint">忘记密码？</div>
            <div class="sub">
              登录
            </div>
          </div>
          <!-- 密码登录 -->
          <div class="form" v-else>
            <img class="tabImage" src="../assets/images/login/password.png" alt="" @click="tabFn">
            <img id="tabHint" src="../assets/images/login/passhit.png" alt="">
            <div class="title">手机扫码 安全登录</div>
            <div class="code">
              <img src="../assets/images/login/code.png" alt="" style="width:140px;height:140px;margin-bottom: 20px;">
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
const input1 = ref('')
// 控制账号登录/二维码登录
let loginFlag = ref(false)
const tabFn = () => {
  loginFlag.value = !loginFlag.value
}

</script>

<style scoped lang="less">
#tabHint {
  position: absolute;
  top: 10px;
  right: 58px;
  display: block;
  width: 99px;
  height: 18px;
  z-index: 999;
  background-size: 100% 100%;
}

#root {
  header {
    height: 88px;
    background-color: #fff;
    display: flex;
    padding: 0 20px;
    align-items: center;
  }

  .login {
    height: 455px;
    background-color: #f7f5f5;
    display: flex;
    padding: 20px;
    justify-content: center;

    .login_big {
      display: flex;

      .left {
        width: 688px;
        margin-right: 100px;

        img {
          height: 100%;
        }
      }

      .right {
        width: 485px;
        background-color: #fff;
        position: relative;

        .tabImage {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 50px;
          height: 50px;
          cursor: pointer;
        }

        .form {
          display: flex;
          justify-content: center;
          flex-direction: column;

          .code {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 30px;

            .wxcode {
              margin: 10px 0;

              span {
                color: #3a7ff2;
                margin: 0 5px;
                cursor: pointer;

              }
            }

            .bottom {
              display: flex;
              align-items: center;
              margin: 10px 0;
              font-size: 12px;
              color: #666;

              .border {
                width: 1px;
                height: 10px;
                background-color: #666;
                margin: 0 5px;
              }
            }
          }
        }

        .title {
          font-size: 20px;
          text-align: center;
          font-weight: 600;
          margin-top: 45px;
          margin-bottom: 20px;
        }

        .hint {
          text-align: right;
          color: #4f86e1;
          font-size: 14px;
          cursor: pointer;
          height: 40px;
          width: 340px;
          margin: 0 auto;
          line-height: 40px;
        }

        .el-input {
          margin: 10px auto;
          width: 340px;
          height: 50px;
        }

        .sub {
          margin-top: 22px;
          background-color: #3b78dd;
          color: #fff;
          font-size: 21px;
          margin: 10px auto;
          text-align: center;
          height: 51px;
          line-height: 51px;
          border-radius: 3px;
          cursor: pointer;
          width: 340px;


        }
      }
    }

  }

}
</style>