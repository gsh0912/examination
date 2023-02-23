<template>
  <div class="examprepare">
    <div class="exam">
      <div class="top_data">
        <div></div>
        <el-page-header @back="goBack">
          <template #content>
            <span class="text-large font-600 mr-3">sss </span>
          </template>
        </el-page-header>
        <div class="time">
          <span>开放时间</span>
          <span style="margin-top: 10px; font-size: 13px">不限</span>
        </div>
        <div></div>
      </div>
      <div class="bottom_data">
        <div class="exam_info">
          <div class="topic">
            <span>题目数量</span>
            <p>1题</p>
          </div>
          <div class="topic">
            <span>考试时长</span>
            <p>不限</p>
          </div>
          <div class="topic">
            <span>考试总分</span>
            <p>100分</p>
          </div>
          <div class="topic">
            <span>通过分数</span>
            <p>60分</p>
          </div>
        </div>
        <div class="start_exam">
          <el-button type="primary">开始考试</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const goBack = () => {
  console.log('go back');
};
</script>
<style scoped lang="less">
.examprepare {
  width: 100%;
  height: 100vh;
  background: url('../../assets/images/stutest/bg.jpg') no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  .exam {
    width: 780px;
    height: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(255, 255, 255);
    .top_data {
      width: 85%;
      height: 180px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      border-bottom: 1px solid rgb(231, 228, 228);
      .time {
        margin-left: 45px;
        display: flex;
        flex-direction: column;
      }
    }
    .bottom_data {
      width: 80%;
      height: 270px;
      .exam_info {
        width: 100%;
        height: 175px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .topic {
          width: 100px;
          height: 75px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          border-right: 1px solid rgb(231, 228, 228);
          span {
            font-size: 14px;
            color: rgb(153, 155, 157);
          }
          p {
            font-size: 26px;
          }
        }
        .topic:last-of-type {
          border: none;
        }
      }
      .start_exam{
        width: 100%;
        display: flex;
        justify-content: center;
        .el-button{
          width: 240px;
          height: 45px;
        }
      }
    }
  }
}
</style>
