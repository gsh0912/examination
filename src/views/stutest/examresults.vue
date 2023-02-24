<template>
  <div class="examresults">
    <div class="exam">
      <div
        class="stampBox"
        style="border: 2px solid #14bd83"
        v-show="resultData.list.result === '已通过'"
      >
        <div class="stamp" style="color: #14bd83; border: #14bd8229 solid 4px">
          已通过
        </div>
      </div>
      <div class="stampBox" v-show="resultData.list.result === '未通过'">
        <div class="stamp">未通过</div>
      </div>
      <div class="top_data">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <el-page-header @back="goBack">
          <template #content>
            <span class="text-large font-600 mr-3">{{
              resultData.list.title
            }}</span>
          </template>
        </el-page-header>
        <div class="info">
          <!-- minute用于从当前时间获取的分钟或设置分钟 -->
          <span
            >用时:{{
              moment(resultData.list.stuEndTime).diff(
                resultData.list.studentStartTime,
                'minute'
              )
            }}分钟</span
          >
          <span>|</span>
          <span>交卷时间:{{ resultData.list.stuEndTime }}</span>
          <span>|</span>
          <span>试卷总分:{{ resultData.list.scores }}</span>
          <span>|</span>
          <span>通过分数:{{ resultData.list.pastscores }}</span>
        </div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="examination" v-if="resultData.list.result === '待阅卷'">
        待阅卷
      </div>
      <div class="center_data" v-else>
        <span></span>
        <span></span>
        <span></span>
        <p :class="resultData.list.studentScores >= 60 ? 'pass' : 'fail'">
          {{ resultData.list.studentScores }}
        </p>
        <p>
          <span v-if="resultData.list.studentScores >= 60">恭喜，通过考试</span>
          <span v-else>很可惜，未通过</span>
        </p>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="bottom_data">
        <table border>
          <tr>
            <td align="center"></td>
            <td align="center">
              单选题{{ radioCounts ? `(${radioCounts})` : '' }}
            </td>
            <td align="center">
              多选题{{ multipleCounts ? `(${multipleCounts})` : '' }}
            </td>
            <td align="center">
              判断题{{ judgeCounts ? `(${judgeCounts})` : '' }}
            </td>
            <td align="center">
              填空题{{ gapfilling ? `(${gapfilling})` : '' }}
            </td>
            <td align="center">问答题{{ question ? `(${question})` : '' }}</td>
          </tr>
          <tr>
            <td align="center">正确数</td>
            <td align="center">
              {{ radioscussCounts ? `${radioscussCounts}` : '--' }}
            </td>
            <td align="center">
              {{ studentscores ? `${studentscores}` : '--' }}
            </td>
            <td align="center">
              {{ judgescusCounts ? `${judgescusCounts}` : '--' }}
            </td>
            <td
              align="center"
              v-if="resultData.list.result === '待阅卷'"
              rowspan="2"
              :style="resultData.list.result === '待阅卷' ? 'color:red' : ''"
            >
              {{
                resultData.list.result === '待阅卷'
                  ? '等待阅卷'
                  : gapfillingScuss
                  ? `${gapfillingScuss}`
                  : '--'
              }}
            </td>
            <td
              align="center"
              v-if="resultData.list.result === '待阅卷'"
              rowspan="2"
              :style="resultData.list.result === '待阅卷' ? 'color:red' : ''"
            >
              {{
                resultData.list.result === '待阅卷'
                  ? '等待阅卷'
                  : questionScuss
                  ? `${questionScuss}`
                  : '--'
              }}
            </td>
            <!--  -->
            <td
              align="center"
              v-if="resultData.list.result === '已通过'"
              :style="resultData.list.result === '待阅卷' ? 'color:red' : ''"
            >
              {{
                resultData.list.result === '待阅卷'
                  ? '等待阅卷'
                  : gapfillingScuss
                  ? `${gapfillingScuss}`
                  : '--'
              }}
            </td>
            <td
              align="center"
              v-if="resultData.list.result === '已通过'"
              :style="resultData.list.result === '待阅卷' ? 'color:red' : ''"
            >
              {{
                resultData.list.result === '待阅卷'
                  ? '等待阅卷'
                  : questionScuss
                  ? `${questionScuss}`
                  : '--'
              }}
            </td>
            <td
              align="center"
              v-if="resultData.list.result === '未通过'"
              :style="resultData.list.result === '待阅卷' ? 'color:red' : ''"
            >
              {{
                resultData.list.result === '待阅卷'
                  ? '等待阅卷'
                  : gapfillingScuss
                  ? `${gapfillingScuss}`
                  : '--'
              }}
            </td>
            <td
              align="center"
              v-if="resultData.list.result === '未通过'"
              :style="resultData.list.result === '待阅卷' ? 'color:red' : ''"
            >
              {{
                resultData.list.result === '待阅卷'
                  ? '等待阅卷'
                  : questionScuss
                  ? `${questionScuss}`
                  : '--'
              }}
            </td>
          </tr>
          <tr>
            <td align="center">错误数</td>
            <td align="center">
              {{
                radioCounts - radioscussCounts
                  ? `${radioCounts - radioscussCounts}题`
                  : '--'
              }}
            </td>
            <td align="center">
              {{
                multipleCounts - studentscores
                  ? `${multipleCounts - studentscores}题`
                  : '--'
              }}
            </td>
            <td align="center">
              {{
                judgeCounts - judgescusCounts
                  ? `${judgeCounts - judgescusCounts}题`
                  : '--'
              }}
            </td>
            <td
              align="center"
              :style="resultData.list.result === '待阅卷' ? 'display:none' : ''"
            >
              {{
                gapfilling - gapfillingScuss
                  ? `${gapfilling - gapfillingScuss}题`
                  : '--'
              }}
            </td>
            <td
              align="center"
              :style="resultData.list.result === '待阅卷' ? 'display:none' : ''"
            >
              {{
                question - questionScuss
                  ? `${question - questionScuss}题`
                  : '--'
              }}
            </td>
          </tr>
        </table>
      </div>
      <el-button
        style="background-color: rgb(20, 189, 131)"
        v-show="resultData.list.result === '已通过'"
        type="success"
        >查看考卷</el-button
      >
      <el-button
        style="background-color: rgb(255, 0, 0)"
        v-show="resultData.list.result === '未通过'"
        type="danger"
        @click="examine(resultData.list.id)"
        >查看考卷</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, toRefs } from 'vue';
import { getForResult } from '../../api/stutest';
import { useRoute,useRouter } from 'vue-router';
import moment from 'moment';
let route = useRoute();
let router=useRouter()
let radioCounts = ref(0); //单选题
let radioscussCounts = ref(0); //单选题正确数
let multipleCounts = ref(0); //多选题
let studentscores = ref(0); //多选题正确数
let judgeCounts = ref(0); //判断题
let judgescusCounts = ref(0); //判断题正确数
let gapfilling = ref(0); //填空题
let gapfillingScuss = ref(0); //填空题正确数
let question = ref(0); //问答题
let questionScuss = ref(0); //问答题正确数

const resultData = reactive<any>({
  list: [],
  questions: [],
});
onMounted(() => {
  getResult();
});
const goBack = () => {
  router.push("/index/stutest")
};
// 列表
const getResult = async () => {
  let res = await getForResult({ testid: route.query.id });
  console.log(res);
  resultData.list = res.data;
  resultData.questions = res.data.questions;
  // console.log(resultData.questions);
  resultData.questions.forEach((item: any) => {
    // console.log(item.type);
    if (item.type === '单选题') {
      radioCounts.value = radioCounts.value + 1;
      // console.log(radioCounts.value);
      if (item.studentscores !== 0) {
        radioscussCounts.value = radioscussCounts.value + 1;
        // console.log(radioscussCounts.value);
      }
    } else if (item.type === '多选题') {
      multipleCounts.value = multipleCounts.value + 1;
      if (item.studentscores !== 0) {
        studentscores.value = studentscores.value + 1;
      }
    } else if (item.type === '判断题') {
      judgeCounts.value = judgeCounts.value + 1;
      if (item.studentscores !== 0) {
        judgescusCounts.value = judgescusCounts.value + 1;
      }
    } else if (item.type === '填空题') {
      gapfilling.value = gapfilling.value + 1;
      if (item.studentscores !== 0) {
        gapfillingScuss.value = gapfillingScuss.value + 1;
      }
    } else if (item.type === '问答题') {
      question.value = question.value + 1;
      if (item.studentscores !== 0) {
        questionScuss.value = questionScuss.value + 1;
      }
    }
  });
};
// 查看考卷
const examine=(id:any)=>{
  // console.log(id);
  router.push({path:"/stuexamwrong",query:{id:id}})
}
</script>
<style scoped lang="less">
.examresults {
  width: 100%;
  height: 100vh;
  background: url('../../assets/images/stutest/bg.jpg') no-repeat;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;

  .exam {
    width: 800px;
    height: 550px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;

    .stampBox {
      position: absolute;
      right: 70px;
      top: 50px;
      border: 2px solid rgb(255, 81, 81);
      border-radius: 50%;
      width: 96px;
      height: 96px;
      display: flex;
      justify-content: center;
      align-items: center;
      transform: rotate(340deg);
      .stamp {
        width: 86px;
        height: 86px;
        border-radius: 50%;
        border: rgb(255, 212, 212) solid 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 17px;
        color: rgb(255, 81, 81);
      }
    }

    .top_data {
      width: 88%;
      height: 120px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      border-bottom: 1px solid rgb(241, 241, 241);
      .info {
        display: flex;
        span {
          display: block;
          margin-left: 10px;
          font-size: 12px;
          color: rgb(153, 155, 157);
        }
      }
    }
    .examination {
      font-size: 70px;
      font-weight: 700;
      color: #f39134;
      margin-top: 20px;
      margin-bottom: 30px;
    }
    .center_data {
      width: 100%;
      height: 170px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      .fail {
        font-size: 65px;
        color: rgb(255, 0, 0);
      }
      .pass {
        font-size: 65px;
        color: rgb(20, 189, 131);
      }
      p:last-of-type {
        font-size: 22px;
      }
    }
    .bottom_data {
      width: 100%;
      height: 155px;
      table {
        width: 80%;
        height: 100%;
        border-collapse: collapse;
        border-spacing: 0;
        margin: auto;
        border: 1px solid rgb(241, 241, 241);
      }
    }
    .el-button {
      width: 240px;
      height: 45px;
      margin-top: 20px;
    }
  }
}
</style>
