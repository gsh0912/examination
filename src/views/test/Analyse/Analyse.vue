<template>
  <div>
    <!-- 标题 -->
    <header>
      <div class="back" @click="goBack"><span>←</span>返回</div>
      <div class="headerBorder"></div>
      <div class="title">数据分析:{{ model.title }}</div>
    </header>
    <!-- 考试信息 -->
    <div class="info">
      总分:{{ model.scores }}
      <div class="infoborder"></div>
      通过分数:{{ model.pastscores }}
      <div class="infoborder"></div>
      考试时长:{{
        model.stuEndTime && model.studentStartTime
          ? model.stuEndTime + '至' + model.studentStartTime
          : '0'
      }}分钟
      <div class="infoborder"></div>
      考试时间:{{
        model.stuEndTime && model.studentStartTime
          ? model.stuEndTime + '至' + model.studentStartTime
          : '不限'
      }}
    </div>
    <!-- 图表 -->
    <div class="chart">
      <div class="left">
        <pieEcharts ref="pieRef" />
      </div>
      <div class="right">
        <columnarEcharts ref="columnarRef" :pieItems="state.pieItems" />
      </div>
    </div>
    <!-- 学员统计 -->
    <div class="tabs">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="学员统计" name="student">
          <div class="serch">
            <el-form :model="studentInfo" label-width="75px">
              <el-form-item label="学员姓名">
                <el-input
                  v-model="student.key"
                  placeholder="考试名称"
                  clearable
                />
              </el-form-item>
              <el-form-item label="部门">
                <el-cascader
                  :options="department"
                  :props="{ emitPath: false, value: 'id', label: 'name' }"
                  v-model="student.depid"
                  @change="getClasses"
                />
              </el-form-item>
              <el-form-item label="班级">
                <el-select
                  v-model="student.classid"
                  class="m-2"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in classes"
                    :key="item.id"
                    :label="item.name"
                    :value="item.depid"
                    clearable
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-select
                  v-model="student.state"
                  placeholder="请选择"
                  clearable
                >
                  <el-option label="已阅卷" value="已阅卷" />
                  <el-option label="未阅卷" value="未阅卷" />
                </el-select>
              </el-form-item>
              <el-button
                @click="search"
                type="primary"
                style="margin-left: 15px"
                >查询</el-button
              >
              <el-button>导出</el-button>
            </el-form>
            <el-table :data="state.studentList" style="width: 100%">
              <el-table-column prop="name" label="学员姓名" />
              <el-table-column prop="depname" label="部门" />
              <el-table-column prop="classname" label="班级" />
              <el-table-column prop="scores" label="分数" />
              <el-table-column prop="state" label="通过情况" />
              <el-table-column prop="" label="用时">
                <template #default="scoped">
                  {{
                    moment(scoped.row.stuEndTime).diff(
                      scoped.row.stuBeginTime,
                      'minute'
                    )
                  }}
                </template>
              </el-table-column>
              <el-table-column label="考试时间">
                <template #default="scoped">
                  {{
                    moment(scoped.row.stuBeginTime).format(
                      'YYYY-MM-DD HH:mm:ss'
                    )
                  }}
                </template>
              </el-table-column>
              <el-table-column label="交卷时间">
                <template #default="scoped">
                  {{
                    moment(scoped.row.stuEndTime).format('YYYY-MM-DD HH:mm:ss')
                  }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scoped">
                  <el-link @click="examine(scoped.row.id)" type="primary"
                    >查看</el-link
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 弹出框 -->
    <el-drawer
      v-model="drawer"
      size="50%"
      title="I am the title"
      :with-header="false"
    >
      <div class="titles">{{ lookOver.data.title }} 的答卷</div>
      <div class="textHeader">
        <span>得分：{{ lookOver.data.studentScores }}</span>
        <span>总分：{{ lookOver.data.scores }}</span>
        <span>通过分数：{{ lookOver.data.pastscores }}</span>
        <span>考试用时：</span>
        <span>交卷时间：{{ lookOver.data.stuEndTime }}</span>
      </div>
      <div class="box"></div>
      <div class="body">
        <div
          class="topic"
          v-for="(item, index) in lookOver.questions"
          :key="item.id"
        >
          <div class="questionType">
            <div class="type">
              <div class="num">{{ index + 1 }}</div>
              <div class="typeTitle">{{ item.type }}</div>
            </div>
            <span class="score">分值：{{ item.scores }}</span>
            <div :class="item.studentscores===0?'zero':'have'">得分:{{ item.studentscores }}</div>
          </div>
          <!-- <span class="typeItem">{{ index + 1 }}.{{ item.type }}</span>
          <span class="scoresItem"
            >分值: <span class="scores">{{ item.scores }}</span>
          </span> -->
          <div class="titleItem" v-html="item.title"></div>
          <div v-if="item.type === '单选题'">
            <!-- 
              :class="data.answerno == item.studentanswer ? item.answer == item.studentanswer:'bg'"

             -->
            <div
              class="radio"
              v-for="data in item.answers"
              :key="data.id"
              :class="
                item.answer === item.studentanswer &&
                item.studentanswer === data.answerno
                  ? 'radioNative'
                  : item.answer !== item.studentanswer &&
                    item.studentanswer === data.answerno
                  ? 'bg'
                  : ''
              "
            >
              <el-radio-group v-model="item.answer">
                <el-radio disabled size="large">
                  <div>
                    {{ data.answerno }} :
                    <span class="radioContent">{{ data.content }}</span>
                  </div>
                  <span
                    style="color: #4cc0a4; font-size: 12px"
                    v-if="
                      item.answer === item.studentanswer &&
                      item.studentanswer === data.answerno
                    "
                  >
                    回答正确
                  </span>
                  <span
                    style="color: #e25e61; font-size: 12px"
                    v-if="
                      item.answer !== item.studentanswer &&
                      item.studentanswer === data.answerno
                    "
                    >回答错误</span
                  >
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div v-if="item.type === '填空题'">
            <div class="fillin correctFillin">正确答案： {{ item.answer }}</div>
            <div class="fillin correctExplain">
              答案解析：{{ item.explains }}
            </div>
          </div>
          <div v-if="item.type === '判断题'">
            <div class="fillin correctFillin">正确答案： {{ item.answer }}</div>
          </div>
          <div v-if="item.type === '多选题'">
            <div
              v-for="data in item.answers"
              :key="data.id"
              class="checkbox"
              :class="
                item.answer.indexOf(data.answerno) !== -1
                  ? 'checkboxNative'
                  : ''
              "
            >
              <el-checkbox :label="data.answerno" disabled>
                {{ data.answerno }} :
                <span class="radioContent">{{ data.content }}</span>
              </el-checkbox>
            </div>
          </div>
          <div v-if="item.type === '问答题'">
            <div class="fillin correctExplain">
              答案解析：{{ item.explains }}
            </div>
          </div>
          <div class="answer">
            <span>正确答案：</span>
            <div v-if="item.type === '单选题'">{{ item.answer }}</div>
            <div
              style="width: 30px; height: 30px"
              v-if="item.type === '判断题'"
            >
              {{ item.answer }}
            </div>
            <div
              v-for="(item2, index2) in item.answer.split('|')"
              :key="index2"
              style="margin-left: 10px"
              v-if="item.type === '多选题'"
            >
              {{ item2 }}
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { getAnalyse, reqStudent, getForResult } from '../../../api/test';
import { ref, reactive, onMounted, nextTick, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import pieEcharts from './pieEcharts.vue';
import columnarEcharts from './columnarEcharts.vue';
import { classesdepartment } from '../../../api/teacher';
import { classeslist } from '../../../api/classes';
import moment from 'moment';
import router from '../../../router';
const goBack = () => {
  router.back();
};
// tabs默认显示学员统计
const activeName = ref('student');
const route = useRoute();
onMounted(() => {
  getInfo();
  getdepartment();
  getStudent();
});
interface Istate {
  passCounts: { pass: number; unpass: number };
  pieItems: any;
  model: any;
  studentInfo: {
    name: string;
  };
  studentList: any[];
}
// 数据分析
const state = reactive<Istate>({
  passCounts: {
    pass: 0,
    unpass: 0,
  },
  pieItems: {},
  model: {},
  studentInfo: {
    name: '',
  },
  studentList: [],
});
const { passCounts, pieItems, model, studentInfo } = toRefs(state);
const columnarRef = ref();
const pieRef = ref();
// 请求图表数据
const getInfo = async () => {
  let res = await getAnalyse({
    testid: route.query.id,
  });
  state.passCounts = res.data.passCounts;
  state.pieItems = res.data.pieItems;
  state.model = res.data.model;
  // console.log(res);
  nextTick(() => {
    // 柱状图
    columnarRef.value.options.xAxis.data = Object.keys(
      state.pieItems as Array<string>
    );
    columnarRef.value.options.series[0].data = Object.values(
      state.pieItems as Array<string>
    );
    columnarRef.value.myChart.setOption(columnarRef.value.options);
    // 饼状图
    pieRef.value.options.series[0].data = [
      { value: state.passCounts.pass, name: '通过' },
      { value: state.passCounts.unpass, name: '未通过' },
    ];
    pieRef.value.myChart.setOption(pieRef.value.options);
  });
};
//部门
let department = ref<any>([]);
const getdepartment = async () => {
  let res = await classesdepartment({});
  // console.log(res);
  department.value = res.data.list;
};
// 请求学员统计
interface Istudent {
  page: number;
  psize: number;
  testid: number;
  key: string;
  depid: number;
  classid: string;
  state: string;
  pass: number;
  pastscores: number;
}
const student = reactive<Istudent>({
  page: 1,
  psize: 10,
  testid: Number(route.query.id),
  key: '',
  depid: 0,
  classid: '',
  state: '',
  pass: 0,
  pastscores: 0,
});
const getStudent = async () => {
  let res = await reqStudent(student);
  // console.log(res);
  state.studentList = res.data.list;
};
// 班级
let classes = ref<any>([]);
const getClasses = async (id: number) => {
  let res = await classeslist({ depid: id });
  // console.log(res);
  classes.value = res.data.list;
};
// 弹出框
const lookOver = reactive<any>({
  data: [],
  questions: [],
});
const drawer = ref(false);
const examine = async (id: number) => {
  drawer.value = true;
  let res = await getForResult({
    testid: Number(route.query.id),
    studentid: id,
  });
  console.log(res);
  lookOver.data = res.data;
  lookOver.questions = res.data.questions;
  console.log(lookOver.questions);
};
//搜索
const search = () => {
  getStudent();
};
</script>

<style scoped lang="less">
header {
  display: flex;

  .back {
    cursor: pointer;

    span {
      margin-right: 10px;
    }
  }

  .title {
    font-size: 20px;
  }

  .headerBorder {
    width: 1px;
    height: 15px;
    margin: 5px 20px 0 20px;
    background-color: #dcdfe6;
  }
}

.info {
  display: flex;
  margin-top: 18px;
  font-size: 14px;

  .infoborder {
    width: 1px;
    height: 20px;
    background-color: #666;
    margin: 0px 20px 0px 20px;
  }
}

.chart {
  display: flex;

  .left {
    margin-left: 200px;
  }

  .right {
    margin-left: 200px;
  }
}
.serch {
  .el-form {
    display: flex;
  }
}
.titles {
  color: #72767b;
  margin-bottom: 50px;
}
.textHeader {
  display: flex;
  font-size: 14px;
  margin-bottom: 15px;
  span {
    margin-left: 10px;
  }
}
.box {
  border-bottom: 1px solid #ececec;
}
.body {
  // overflow: auto;
  height: 500px;

  .topic {
    padding: 15px 10px;

    /deep/ .el-checkbox__input {
      margin: 0 5px 0 15px;
    }

    .checkbox {
      display: flex;
      align-items: center;
      height: 26px;
      margin-bottom: 10px;
      padding: 8px;
    }

    /deep/.checkboxNative {
      background-color: #eefaf6;

      .el-checkbox__label {
        color: #606266;
      }
    }

    .titleItem {
      margin: 10px 0;
      color: #909090;
    }

    .typeItem {
      margin-right: 5px;
    }

    .scoresItem {
      .scores {
        margin: 0 5px;
      }
    }

    .fillin {
      display: flex;
      align-items: center;
      height: 26px;
      margin-bottom: 10px;
      padding: 10px;
    }

    .correctFillin {
      background-color: #eefaf6;
      color: #70d3b2;
      margin-top: 10px;
    }

    .correctExplain {
      color: #9dadbc;
      background-color: #f5faff;
    }

    .radioNative {
      background-color: #f0faf6;
      border: 1px solid #f0faf6;
    }

    .radio {
      .radioContent {
        margin: 0 10px;
      }

      /deep/.el-radio__label {
        width: 740px;
        display: flex;
        color: #606266;
        justify-content: space-between;
      }

      /deep/.el-radio__input {
        margin: 0 5px 0 15px;
      }
    }
  }
}
.answer {
  height: 30px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  width: 100%;
  background-color: #f7fbff;
  span {
    font-size: 15px;
    color: #90adca;
  }
  div {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #4cc0a4;
    font-size: 13px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
  }
}
.bg {
  background-color: #fcf3f3;
  border: 1px solid #0089ff;
}
.questionType {
  display: flex;
  align-items: center;
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
  .have {
    font-size: 12px;
    border: #4cc0a4 1px solid;
    color: #4cc0a4;
    border-radius: 3px;
    padding: 0 5px;
    height: 16px;
  }
  .zero{
    height: 16px;
    font-size: 12px;
    border: #ee0000 solid 1px;
    border-radius: 3px;
    color: #e00;
    padding: 0 5px;
  }
}
</style>
