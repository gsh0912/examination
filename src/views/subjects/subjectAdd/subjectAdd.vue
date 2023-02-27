<template>
  <div id="root">
    <div class="create">创建试卷</div>
    <div class="item">
      <div class="title">
        <span class="index">1</span>
        <span class="content">基本信息</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref,reactive} from 'vue'

const form = reactive({
  title:''
})

</script>

<style scoped lang="less">
#root {
  padding: 10px;

  .create {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .item {
    display: flex;
    align-items: center;
    background-color: #f9faff;
    padding: 5px 30px;

    .title {
      display: flex;
      align-items: center;

      .index {
        font-size: 35px;
        color: #c7e5ff;
      }

      .content {
        padding-left: 17px
      }
    }


  }
}
</style>