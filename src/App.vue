<script setup lang="ts">
import { defineComponent } from 'vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
let locale = zhCn

</script>

<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<style>
* {
  padding: 0;
  margin: 0;
}
</style>
