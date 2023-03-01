<template>
  <div>
    <!-- 标题 -->
    <header>
      <div class="back"><span>←</span>返回</div>
      <div class="headerBorder"></div>
      <div class="title">数据分析:{{ model.title }}</div>
    </header>
    <!-- 考试信息 -->
    <div class="info">
      总分:{{ model.scores }}
      <div class="infoborder"></div>
      通过分数:{{ model.pastscores }}
      <div class="infoborder"></div>
      考试时长:{{ model.stuEndTime && model.studentStartTime ? model.stuEndTime + '至' + model.studentStartTime : '0' }}分钟
      <div class="infoborder"></div>
      考试时间:{{ model.stuEndTime && model.studentStartTime ? model.stuEndTime + '至' + model.studentStartTime : '不限' }}
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
        <el-tab-pane label="User" name="student">
          <div class="serch">
            <el-form :model="studentInfo" label-width="120px">
              <el-form-item label="学员姓名">
                <el-input v-model="studentInfo.name" />
              </el-form-item>
              <el-form-item label="学员姓名">
                <el-input v-model="studentInfo.name" />
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAnalyse, reqStudent } from '../../../api/test'
import { ref, reactive, onMounted, nextTick, toRefs } from 'vue';
import { useRoute } from 'vue-router';
import pieEcharts from './pieEcharts.vue'
import columnarEcharts from './columnarEcharts.vue'
// tabs默认显示学员统计
const activeName = ref('student')
const route = useRoute()
onMounted(() => {
  getInfo()
  getStudent()
})
interface Istate {
  passCounts: { pass: number, unpass: number }
  pieItems: any
  model: any,
  studentInfo: {
    name: string
  },
  studentList: []
}
// 数据分析
const state = reactive<Istate>({
  passCounts: {
    pass: 0,
    unpass: 0
  },
  pieItems: {},
  model: {},
  studentInfo: {
    name: ''
  },
  studentList: []
})
const { passCounts, pieItems, model, studentInfo } = toRefs(state)
const columnarRef = ref()
const pieRef = ref()
// 请求图表数据
const getInfo = async () => {
  let res = await getAnalyse({
    testid: route.query.id
  })
  state.passCounts = res.data.passCounts
  state.pieItems = res.data.pieItems
  state.model = res.data.model
  console.log(res);
  nextTick(() => {
    // 柱状图
    columnarRef.value.options.xAxis.data = Object.keys(state.pieItems as Array<string>)
    columnarRef.value.options.series[0].data = Object.values(state.pieItems as Array<string>)
    columnarRef.value.myChart.setOption(columnarRef.value.options);
    // 饼状图
    pieRef.value.options.series[0].data = [
      { value: state.passCounts.pass, name: '通过' },
      { value: state.passCounts.unpass, name: '未通过' }
    ]
    pieRef.value.myChart.setOption(pieRef.value.options);
  })
}

// 请求学员统计
const getStudent = async () => {
  let res = await reqStudent({
    testid: route.query.id
  })
  console.log(res);
  state.studentList = res.data.list
}

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
</style>