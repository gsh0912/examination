<template>
  <div>
    <div class="title">创建考试</div>
    <div class="basic">
      <div class="one">
        <span class="ones">1</span>
        <span style="padding-left: 17px">基本信息</span>
      </div>
      <div class="from">
        <el-form :model="formData">
          <el-form-item label="考试名称:">
            <el-input v-model="formData.title" />
          </el-form-item>
          <el-form-item label="考试说明:">
            <el-input v-model="formData.info" type="textarea" />
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
        <el-form :model="formData">
          <el-form-item label="考试内容：">
            <div class="god">
              <div class="godTop">
                <h3>试卷列表</h3>
                <div class="right">
                  <span>总分:{{ num }}</span>
                  <span class="ad">已添加{{ count }}题</span>
                  <el-button @click="empty">清空</el-button>
                </div>
              </div>
              <div class="testPaper" v-if="answers.length > 0">
                <div
                  v-for="(item, index) in answers"
                  :key="index"
                  class="infinite-list-item"
                >
                  <div class="gotContent">
                    <div class="gotTop">
                      <div class="gotLeft">
                        <span>{{ index + 1 }} {{ item.type }}</span>
                        <span style="padding-left: 10px">分值：</span>
                        <el-input v-model="item.scores" />
                      </div>
                      <div class="gotRight">
                        <span>
                          <el-icon @click="edit(item)">
                            <Edit />
                          </el-icon>
                        </span>
                        <span style="padding-left: 10px">
                          <el-icon @click="del(item)"><DeleteFilled /></el-icon>
                        </span>
                      </div>
                    </div>
                    <div style="padding: 7px 0px">
                      <p v-html="item.title"></p>
                    </div>
                    <div
                      class="options"
                      v-for="(items, index) in item.answers"
                      :key="index"
                      :class="
                        item.answer.includes(items.answerno) ? 'highlight' : ''
                      "
                    >
                      <span style="padding-left: 15px"
                        >{{ items.answerno }}:
                      </span>
                      <span style="padding-left: 5px">{{ items.content }}</span>
                    </div>
                    <div class="judge" v-if="item.type === '判断题'">
                      正确答案
                      <span style="margin-left: 20px">{{ item.answer }}</span>
                    </div>
                    <div v-if="item.type === '填空题'">
                      <div class="judge">正确答案</div>
                      <div class="jud">
                        <span style="margin-left: 20px"
                          >答案解析：{{ item.answer }}</span
                        >
                      </div>
                    </div>
                    <div v-if="item.type === '问答题'">
                      <div class="jud">
                        <span style="margin-left: 20px"
                          >答案解析：{{ item.answer }}</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="button">
                <el-button @click="topicAdd">添加题目</el-button>
                <el-button>批量导入</el-button>
                <el-button>从题库中导入</el-button>
                <el-button>选择已有试卷</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="试题存入题库：" style="margin-left: -30px">
            <el-select v-model="formData.question" placeholder="请选择题库">
              <el-option
                v-for="item in questionBank"
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
    <div class="Testset">
      <div class="one">
        <span class="ones">3</span>
        <span style="padding-left: 17px">考试设置</span>
      </div>
      <div class="set">
        <el-form :model="formData">
          <el-form-item label="通过分数：">
            <el-input v-model="formData.pastscores" style="width: 90px" />
          </el-form-item>
          <el-form-item label="通过分数：">
            <el-radio-group v-model="formData.duration">
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
            <el-radio-group v-model="formData.analysis">
              <el-radio label="交卷后显示" />
              <el-radio label="不许查看" />
              <el-radio label="仅可查看对错" />
              <el-radio label="仅查看错题" />
              <el-radio label="考试结束后查看" />
              <el-radio label="不许查看" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="防作弊:">
            <el-checkbox-group v-model="formData.antiCheating">
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
        <el-form :model="formData" label-width="120px">
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
        <el-form :model="formData" label-width="120px">
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
        <el-form :model="formData" label-width="120px">
          <el-form-item label="可见老师：">
            <el-button>+ 选择</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="but">
      <el-button type="primary" @click="submit">发布</el-button>
      <el-button>保存（不发布）</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
  <drawer ref="leftDrawer" @getChildren="save" v-if="flag"></drawer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, toRefs, nextTick, computed } from 'vue';
import { reqList } from '../../../api/databaselist';
import { Edit, DeleteFilled } from '@element-plus/icons-vue';
import drawer from './drawer.vue';
import { includes } from 'lodash';
// 提交按钮
const submit = () => {};
// 表单数据
const formState = reactive({
  formData: {
    title: '',
    info: '',
    question: '',
    pastscores: 60,
    duration: '',
    analysis: '',
    antiCheating: [],
  },
});
const { formData } = toRefs(formState);
let flag = ref<boolean>(false);
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
let questionBank = ref<any>([]);
const getquestionBank = async () => {
  let res = await reqList();
  console.log(res);
  questionBank.value = res.data.list;
};
// 添加题目
const leftDrawer = ref();
const topicAdd = () => {
  flag.value = true;
  nextTick(() => {
    leftDrawer.value.drawer = true;
  });
};
const answers = ref<any>([]);
const count = ref<number>(0); //添加题目数量
const num = ref<number>(0);
const save = (val: any) => {
  console.log(val);
  answers.value.push(val);
  console.log(answers.value);
  flag.value = false;
  count.value = answers.value.length;
  num.value += val.scores;
};
// 删除
const del = (val: any) => {
  console.log(val);
  const index = answers.value.findIndex((item: any) => item === val);
  answers.value.splice(index, 1);
  count.value -= 1;
  num.value -= val.scores;
};
// 清空
const empty = () => {
  answers.value = [];
  count.value = 0;
  num.value=0
};
// 编辑
const edit = (data: any) => {
  flag.value = true;
  nextTick(() => {
    leftDrawer.value.drawer = true;
    leftDrawer.value.radio = data.type;
    nextTick(() => {
      leftDrawer.value.EditorRef.valueHtml = data.title;
    });
    // // 选项
    data.answers.forEach((element: any) => {
      leftDrawer.value.state.answers.forEach((item: any) => {
        if (item.answerno === element.answerno) {
          item.content = element.content;
        }
      });
    });
    // 分值
    leftDrawer.value.scores = data.scores;
    if (data.type === '多选题') {
      leftDrawer.value.rightcehckboxAnswers = data.answer.split('|');
    }
    if (data.type === '单选题') {
      leftDrawer.value.rightAnswers = data.answer;
      console.log(data);
    }
    if (data.type === '判断题') {
      leftDrawer.value.estimateAnswer = data.answer;
    }
    if (data.type === '填空题' || data.type === '问答题') {
      leftDrawer.value.tags = data.tags;
    }
  });
  console.log(data.title);
};
onMounted(() => {
  getquestionBank();
});
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

.but {
  padding-left: 228px;
  margin-top: 46px;
  padding-bottom: 100px;
}
.testPaper {
  height: 35vh;
  overflow-y: scroll;
}
.infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
}

.gotContent {
  width: 100%;
  padding: 20px 15px;
  overflow-y: auto;
  .gotTop {
    display: flex;
    color: #6a6a6a;
    justify-content: space-between;
    .gotLeft {
      display: flex;
      .el-input {
        width: 80px;
      }
    }
    .gotRight {
      display: flex;
      font-size: 20px;
      color: #299aff;
    }
  }
  .options {
    line-height: 32px;
    margin-top: 10px;
  }
  .highlight {
    background-color: #eefaf6;
  }
}

.judge {
  background-color: #eefaf6;
  color: #5acda6;
  padding: 8px;
}
.jud {
  background-color: #f5faff;
  color: #9dadbc;
  padding: 8px;
  margin-top: 10px;
}
</style>
