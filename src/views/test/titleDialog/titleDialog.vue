<template>
  <div class="titleBox">
    <el-dialog v-model="dialogVisible" :title="titleData.title" width="80%" :close-on-click-modal="false">
      <div class="title">
        <div class="left">
          <div class="info">
            <p>总分</p>
            <p>{{ titleData.scores }}</p>
          </div>
          <div class="info">
            <p>通过分数</p>
            <p>{{ titleData.pastscores }}</p>
          </div>
          <div class="info">
            <p>考试时长</p>
            <p>{{ titleData.stuEndTime ? titleData.stuEndTime : '不限时' }}</p>
          </div>
          <div class="info">
            <p>开放时间</p>
            <p>{{ titleData.begintime && titleData.endtime ? titleData.begintime - titleData.endtime : '时间不限' }}</p>
          </div>
        </div>
        <div class="right">
          <el-button @click="exportFn">导出excel</el-button>
        </div>
      </div>
      <div class="body">
        <div class="topic" v-for="(item, index) in titleData.questions" :key="item.id">
          <span class="typeItem">{{ index + 1 }}.{{ item.type }}</span>
          <span class="scoresItem">分值: <span class="scores">{{ item.scores }}</span> </span>
          <div class="titleItem" v-html="item.title"></div>
          <div v-if="item.type === '单选题'">
            <div class="radio" v-for="data in item.answers" :key="data.id"
              :class="data.answerno === item.answer ? 'radioNative' : ''">
              <el-radio-group v-model="item.answer">
                <el-radio disabled :label="data.answerno" size="large">{{ data.answerno }} : <span class="radioContent">{{
                  data.content }}</span> </el-radio>
              </el-radio-group>
            </div>
          </div>
          <div v-if="item.type === '填空题'">
            <div class="fillin correctFillin">正确答案： {{ item.answer }}</div>
            <div class="fillin correctExplain">答案解析：{{ item.explains }}</div>
          </div>
          <div v-if="item.type === '判断题'">
            <div class="fillin correctFillin">正确答案： {{ item.answer }}</div>
          </div>
          <div v-if="item.type === '多选题'">
            <el-checkbox-group v-model="item.answer">
              <div v-for="data in item.answers" :key="data.id" class="checkbox"
                :class="item.answer.indexOf(data.answerno) !== -1 ? 'checkboxNative' : ''">
                <el-checkbox :label="data.answerno" disabled>
                  {{ data.answerno }} : <span class="radioContent">{{
                    data.content }}</span>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
          <div v-if="item.type === '问答题'">
            <div class="fillin correctExplain">答案解析：{{ item.explains }}</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>                                                                                                                                                                                                                             
<script setup lang="ts">
import { ref, defineProps, defineExpose, onMounted, watch } from 'vue'
import { ElMessageBox } from 'element-plus'
import { exportExcel } from '../../../api/test'

const dialogVisible = ref(false)
const checkList = ref(['A', 'B', 'C', 'D'])
// 导出excel表格
const exportFn = async () => {
  let res: any = await exportExcel({
    id: props.testNameId,
    responseType: 'blob'
    
  }, )
  let blob = new Blob([res], { type: 'application/vnd.ms-excel' });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.setAttribute('download', '123.xlsx');
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

}

const props = defineProps({
  titleData: {
    type: Object,
    required: true
  },
  testNameId: {
    type: Number,
    required: true
  }
})
defineExpose({
  dialogVisible
})
const titleData = ref({})

watch(() => props.titleData, (newVal) => {
  newVal.questions.forEach((item: any) => {
    if (item.type === '多选题') {
      item.answer = item.answer.split('|')
    }
    return item
  })
  titleData.value = newVal
  console.log(titleData.value);
})


</script>

<style scoped lang="less">
.titleBox {
  /deep/ .el-dialog__body {
    padding: 10px 20px;
  }

  .title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    align-items: center;
    height: 80px;

    .left {
      display: flex;
      width: 30%;
      justify-content: space-between;
      align-items: center;

      .info {
        height: 50px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }

  /deep/ .el-dialog__body {
    padding-bottom: 100px;
  }

  /deep/.el-dialog {
    --el-dialog-margin-top: 6vh;
  }

  .body {
    overflow: auto;
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
        background-color: #eefaf6;
      }



      .radio {
        .radioContent {
          margin: 0 10px;
        }

        /deep/.el-radio__label {
          color: #606266;
        }

        /deep/.el-radio__input {
          margin: 0 5px 0 15px;
        }
      }
    }
  }
}
</style>