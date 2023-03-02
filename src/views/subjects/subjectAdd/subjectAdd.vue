<template>
  <div id="root">
    <div class="create">创建试卷</div>
    <div class="item">
      <div class="title">
        <span class="index">1</span>
        <span class="content">基本信息</span>
      </div>
    </div>
    <div class="form">
      <el-form :model="myData" label-width="120px">
        <el-form-item label="考试名称:">
          <el-input v-model="myData.list.title" />
        </el-form-item>
      </el-form>
    </div>
    <div class="Setup">
      <div class="one">
        <span class="ones">2</span>
        <span style="padding-left: 17px">内容设置</span>
      </div>
      <div class="content">
        <el-form :model="myData">
          <el-form-item label="考试内容：">
            <div class="god">
              <div class="godTop">
                <h3>试卷列表</h3>
                <div class="right">
                  <span>总分:0</span>
                  <span class="ad">已添加0题</span>
                  <el-button>清空</el-button>
                </div>
              </div>
              <div class="button">
                <el-button>添加题目</el-button>
                <el-button>批量导入</el-button>
                <el-button>从题库中导入</el-button>
                <el-button>选择已有试卷</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="试题存入题库：" style="margin-left: -30px">
            <el-select
              v-model="myData.list.region"
              placeholder="请选择题库"
            >
              <el-option
                v-for="item in myData.list.questionBank"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button style="font-size: 13px; margin-left: 13px"
              >+ 创建试题库</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="Teachers">
      <div class="one">
        <span class="ones">4</span>
        <span style="padding-left: 17px">教师范围</span>
      </div>
      <div class="viTeacher">
        <el-form :model="myData.list" label-width="130px">
          <el-form-item label="可见老师：">
            <el-button>+ 选择</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="but">
      <el-button type="primary">提交</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { reqList } from '../../../api/databaselist';
const myData = reactive<any>({
  list: {
    title: '', //考试名称
    region: '', //下拉框
    questionBank: '', //题库下拉框
  },
});
// 题库下拉框
const getquestionBank = async () => {
  let res = await reqList();
  console.log(res); 
  myData.list.questionBank = res.data.list;
};
onMounted(() => {
  getquestionBank();
});
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
        padding-left: 17px;
      }
    }
  }
  .form {
    width: 500px;
    margin-left: 78px;
    margin-top: 10px;
    font-size: 14px;
  }
  .Setup {
    margin-top: 20px;
    .one {
      height: 40px;
      display: flex;
      align-items: center;
      background-color: #f9faff;
      padding: 5px 30px;
      .ones {
        font-size: 35px;
        color: #c7e5ff;
      }
    }
    .content {
      margin-left: 119px;
      margin-top: 10px;
      .god {
        width: 1025px;
        border: 1px solid #dcdfe6;
        .godTop {
          padding: 10px 15px;
          border-bottom: 1px solid #dcdfe6;
          display: flex;
          justify-content: space-between;
          .right {
            display: flex;
            color: #90909e;
            .ad {
              padding: 0 40px;
            }
          }
        }
        .button {
          padding: 10px 15px;
          font-size: 12px;
          border-top: 2px solid #dcdfe6;
        }
      }
    }
  }
  .Teachers {
    margin-top: 20px;
    .one {
      height: 40px;
      display: flex;
      align-items: center;
      background-color: #f9faff;
      padding: 5px 30px;
      .ones {
        font-size: 35px;
        color: #c7e5ff;
      }
    }
    .viTeacher {
      margin-left: 70px;
      margin-top: 10px;
    }
  }
  .but {
    padding-left: 228px;
    margin-top: 46px;
    padding-bottom: 100px;
  }
}
</style>
