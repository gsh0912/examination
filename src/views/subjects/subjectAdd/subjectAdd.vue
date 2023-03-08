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
              <div>
                <div class="listItem" v-for="(item, index) in myData.list.content" :key="index">
                  <div class="topTitle">
                    {{ index + 1 }}.{{ item.type }}
                    <span style="margin:0 10px">分值:</span>
                    <el-input style="width:100px" v-model="item.scores"></el-input>
                  </div>
                  <div class="topicTitle" v-html="item.title"></div>
                  <div class="topContent" v-if="item.type === '单选题'">
                    <div class="bottom" :class="item.answer === data.answerno ? 'bottomActive' : ''"
                      v-for="data in item.answers" :key="data">
                      <div class="left">
                        <div class="radioDot"></div>
                        <div class="radioAnswerno">{{ data.answerno }}:</div>
                        <div class="radioContent"> {{ data.content }}</div>
                      </div>
                    </div>
                  </div>
                  <div class="topContent" v-if="item.type === '多选题'">
                    <div class="bottom" :class="item.answer === data.answerno ? 'bottomActive' : ''"
                      v-for="data in item.answers" :key="data">
                      <div class="left">
                        <div class="checkoutDot"></div>
                        <div class="radioAnswerno">{{ data.answerno }}:</div>
                        <div class="radioContent"> {{ data.content }}</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div class="button">
                <el-button @click="addTopic">添加题目</el-button>
                <el-button>批量导入</el-button>
                <el-button>从题库中导入</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="试题存入题库：" style="margin-left: -30px">
            <el-select v-model="myData.list.region" placeholder="请选择题库">
              <el-option v-for="item in myData.questionBank" :label="item.title" :value="item.id"></el-option>
            </el-select>
            <el-button style="font-size: 13px; margin-left: 13px">+ 创建试题库</el-button>
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
            <div class="teacherBtn">
              <el-button @click="transferFn">+ 选择</el-button>
              <span>{{ teacherNum }}</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="but">
      <el-button type="primary" @click="submitFn">提交</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
  <visibleDialog ref="visibleDialogRef" :valueFn="valueFn" />
  <subjectDrawer :addSave="addSave" ref="subjectDrawerRef" />
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { reqList } from '../../../api/databaselist';
import visibleDialog from '../../test/visibleDialog/visibleDialog.vue';
import { subjectsAdd } from '../../../api/subjects'
import subjectDrawer from './subjectDrawer.vue';

const visibleDialogRef = ref()
const teacherNum = ref(0)
// 子传父 传来的选中数据
const valueFn = ((val: any) => {
  teacherNum.value = val.value.length
  val.value = val.value.map((item: number) => {
    return { id: item }
  })
  teachers.value.push(val.value)
})
// 点击选择可见教师
const teachers = ref<Array<{ id: number }>>([])
const transferFn = () => {
  visibleDialogRef.value.formFlag = '可见'
  visibleDialogRef.value.dialogVisible = true
  visibleDialogRef.value.getDepartmentList()
  teacherNum.value = visibleDialogRef.value.value.length
}

const myData = reactive<any>({
  list: {
    title: '', //考试名称
    region: '', //下拉框,
    content: []
  },
  questionBank: '', //题库下拉框

});
// 点击添加试卷
const submitFn = async () => {
  console.log(myData.list);
  console.log(teachers.value[teachers.value.length - 1]);
  let res = await subjectsAdd({
    "id": 0,
    "testid": 0,
    "title": "对vuex中的state说法正确的事",
    "type": "单选题",
    "scores": 2.0,
    "answer": "A",
    "tags": "",
    "explains": "",
    "answers": [
      {
        "id": 0,
        "answerno": "A",
        "questionid": 0,
        "content": "state主要用来存储状态，数据的"
      },
      {
        "id": 0,
        "answerno": "B",
        "questionid": 0,
        "content": "state是修改状态的一个方法"
      },
      {
        "id": 0,
        "answerno": "C",
        "questionid": 0,
        "content": "Actions可以直接修改state"
      },
      {
        "id": 0,
        "answerno": "D",
        "questionid": 0,
        "content": "mapActions可以进行异步操作修改state"
      }
    ]
  })
  console.log(res);
}
// 题库下拉框
const getquestionBank = async () => {
  let res = await reqList();
  console.log(res);
  myData.questionBank = res.data.list;
};
// 考试
const subjectDrawerRef = ref()
const addTopic = () => {
  subjectDrawerRef.value.drawer = true
}
// 点击抽屉 保存 触发父元素方法
const addSave = () => {
  myData.list.content.push(subjectDrawerRef.value.info)
}
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

      .listItem {
        .topTitle {
          color: #6A6A6A;
        }

        .topContent {
          .bottomActive {
            background-color: #eefaf6;
          }

          .bottom {
            margin: 5px 0;

            .left {
              display: flex;
              align-items: center;

              .radioDot {
                width: 19px;
                height: 19px;
                border-radius: 50%;
                border: 1px solid #ccc;
              }

              .radioDot:hover {
                border: 1px solid #409eff;
                cursor: pointer;
              }

              .radioAnswerno {
                margin: 0 8px;
              }

              .radioContent {}
            }
          }
        }
      }

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

      .teacherBtn {
        position: relative;

        span {
          position: absolute;
          top: -8px;
          right: -10px;
          font-size: 12px;
          background-color: #409eff;
          width: 20px;
          height: 20px;
          text-align: center;
          color: white;
          line-height: 20px;
          border-radius: 50%;
        }
      }
    }
  }

  .listItem {
    padding: 10px;
    box-sizing: border-box;
  }

  .but {
    padding-left: 228px;
    margin-top: 46px;
    padding-bottom: 100px;
  }
}
</style>
