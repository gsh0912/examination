<template>
  <div>
    <div class="title">创建考试</div>
    <div class="basic">
      <div class="one">
        <span class="ones">1</span>
        <span style="padding-left: 17px">基本信息</span>
      </div>
      <div class="from">
        <el-form :model="form">
          <el-form-item label="考试名称:">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="考试说明:">
            <el-input v-model="form.desc" type="textarea" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="Setup">
      <div class="one">
        <span class="ones">2</span>
        <span style="padding-left: 17px">内容设置</span>
      </div>
      <div class="content">
        <el-form :model="form">
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
            <el-select v-model="form.region" placeholder="请选择题库">
              <el-option   v-for="item in questionBank" :label="item.title" :value="item.id"></el-option>
            </el-select>
            <el-button style="font-size: 13px; margin-left: 13px"
              >+ 创建试题库</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="Testset">
      <div class="one">
        <span class="ones">3</span>
        <span style="padding-left: 17px">考试设置</span>
      </div>
      <div class="set">
        <el-form :model="form">
          <el-form-item label="通过分数：">
            <el-input v-model="form.name" style="width: 90px" />
          </el-form-item>
          <el-form-item label="通过分数：">
            <el-radio-group v-model="form.resource">
              <el-radio label="不限时时长" />
              <el-radio label="限时时长" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开放时间" style="width: 600px">
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              :shortcuts="shortcuts"
              range-separator="To"
              start-placeholder="Start date"
              end-placeholder="End date"
            />
            <span class="bu">不填表示永久</span>
          </el-form-item>
          <el-form-item label="答案解析">
            <el-radio-group v-model="form.resource">
              <el-radio label="交卷后显示" />
              <el-radio label="不许查看" />
              <el-radio label="仅可查看对错" />
              <el-radio label="仅查看错题" />
              <el-radio label="考试结束后查看" />
              <el-radio label="不许查看" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="防作弊:">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="试卷顺序打乱" name="type" />
              <el-checkbox
                label="选项顺序打乱(单选题,多选题,判断题)"
                name="type"
              />
            </el-checkbox-group>
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
        <el-form :model="form" label-width="120px">
          <el-form-item label="可见老师：">
            <el-button>+ 选择</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="Teachers">
      <div class="one">
        <span class="ones">5</span>
        <span style="padding-left: 17px">考试学生</span>
      </div>
      <div class="viTeacher">
        <el-form :model="form" label-width="120px">
          <el-form-item label="可见老师：">
            <el-button>+ 选择</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="Teachers">
      <div class="one">
        <span class="ones">6</span>
        <span style="padding-left: 17px">协同设置</span>
      </div>
      <div class="viTeacher">
        <el-form :model="form" label-width="120px">
          <el-form-item label="可见老师：">
            <el-button>+ 选择</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="but">
      <el-button type="primary">发布</el-button>
      <el-button>保存（不发布）</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive,onMounted } from 'vue';
import {reqList} from '../../../api/databaselist'
const form = reactive({
  name: '', //文本框
  desc: '', //文本域
  region: '', //下拉框
  resource: '', //单选框
  type: [], //复选框
});
// 时间
const value2 = ref('');
const shortcuts = [
  {
    text: 'Last week',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: 'Last 3 months',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
// 题库列表
let questionBank =ref<any>([])
const getquestionBank =async()=>{
let res =await reqList()
console.log(res);
questionBank.value =res.data.list
}
onMounted(()=>{
  getquestionBank()
})
</script>

<style scoped lang="less">
.title {
  font-size: 20px;
}
.basic {
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
  .from {
    width: 500px;
    margin-left: 128px;
    margin-top: 10px;
    font-size: 14px;
    .el-input {
      width: 400px;
    }
  }
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
.Testset {
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
  .set {
    margin-left: 109px;
    margin-top: 10px;
    .el-form-item {
      display: flex;
      margin-bottom: 18px;
      .bu {
        font-size: 14px;
        color: #c3c3c3;
        margin-left: 10px;
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
.but{
  padding-left: 228px;
    margin-top: 46px;
    padding-bottom: 100px;
}
</style>
