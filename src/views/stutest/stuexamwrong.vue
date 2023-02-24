<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <el-page-header @back="goBack">
          <template #content>
            <span class="text-large font-600 mr-3">
              {{ examIfon.list.title }}
            </span>
          </template>
        </el-page-header>
        <div
          class="examList"
          v-for="(item, index) in examIfon.questions"
          :key="index"
        >
          <div class="questionType">
            <div class="type">
              <div class="num">{{ index + 1 }}</div>
              <div class="typeTitle">{{ item.type }}</div>
            </div>
            <div class="score">分值：{{ item.scores }}</div>
            <div class="getScore">得分：{{ item.studentscores }}</div>
          </div>
          <div class="title" v-html="item.title"></div>
        </div>
      </el-main>
      <el-aside width="200px">Aside</el-aside>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getForResult } from '../../api/stutest';
let route = useRoute();
let router = useRouter();
console.log(route.query.id);
const examIfon = reactive<any>({
  list: [],
  questions: [],
});
const goBack = () => {
  console.log('go back');
};
const getExamInfo = async () => {
  let res: any = await getForResult({ testid: route.query.id });
  console.log(res);
  examIfon.list = res.data;
  examIfon.questions = res.data.questions;
  console.log(examIfon.list);
  console.log(examIfon.questions);
};
getExamInfo();
</script>
<style scoped lang="less">
.examList {
  .questionType {
    display: flex;
    align-items: center;
    margin-top: 30px;
    .type {
      height: 20px;
      width: 80px;
      border: 1px #3377f9 solid;
      display: flex;
      border-radius: 5px;
      overflow: hidden;
      font-size: 13px;
      .num {
        width: 30%;
        height: 100%;
        background-color: #3377f9;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .typeTitle {
        flex: 1;
        height: 100%;
        background-color: #f1f5fb;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #3377f9;
      }
    }
    .score {
      font-size: 12px;
      color: #aca4ab;
      margin: 0 10px;
    }
    .getScore {
      height: 16px;
      font-size: 12px;
      border: #ee0000 solid 1px;
      border-radius: 3px;
      color: #e00;
      padding: 0 5px;
    }
  }
  .title{
    font-size: 15px;
    margin: 20px 0;
  }
}
</style>
