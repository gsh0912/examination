<template>
  <el-drawer v-model="showDrawer" :with-header="false" size="50%">
    <div class="box">
      <header>
        <div class="title">试卷名称：{{ drawerData.title }}</div>
        <div class="testmsg">
          <span
            >得分:<span
              :style="{
                color:
                  drawerData.studentScores >= 60 ? 'rgba(76, 192, 164)' : 'red',
              }"
              >{{ drawerData.studentScores }}</span
            >
          </span>
          <span>总分：{{ drawerData.scores }}</span>
          <span>通过分数：{{ drawerData.pastscores }}</span>
          <span
            >考试用时(分钟)：{{
              moment(drawerData.stuEndTime).diff(
                drawerData.studentStartTime,
                "minute"
              )
            }}</span
          >
          <span>交卷时间：{{ drawerData.stuEndTime }}</span>
        </div>
      </header>
      <el-scrollbar height="100%">
        <!-- 遍历所有试题 -->
        <div
          class="questions"
          v-for="(item, index) in drawerData.questions"
          :key="index"
        >
          <!-- 题类型，分值，对错-->
          <div class="title-type">
            <!-- 题目类型 -->
            <div class="type">
              <div>{{ index + 1 }}</div>
              <div>{{ item.type }}</div>
            </div>
            <!-- 分值 -->
            <div class="scores">分值：{{ item.scores }}</div>
            <!-- 得分 -->
            <div class="goal" :class="item.studentscores ? 'correct' : 'error'">
              得分：{{ item.studentscores }}
            </div>
          </div>
          <!-- 题目及内容 -->
          <div class="title-content">
            <!-- 题目 -->
            <div class="topic"><span v-html="rep(item.title)"></span></div>
            <template v-if="item.type === '单选题'">
              <div
                v-for="(item1, index1) in item.answers"
                :key="index1"
                class="item"
                :class="
                  item1.answerno === item.studentanswer
                    ? item.studentanswer === item.answer
                      ? 'active'
                      : 'close'
                    : ''
                "
              >
                <div class="option">
                  <div class="left">{{ item1.answerno }}</div>
                  <div class="right">{{ item1.content }}</div>
                </div>
                <div class="corr">
                  {{
                    item1.answerno === item.studentanswer
                      ? item.studentanswer === item.answer
                        ? "回答正确"
                        : "回答错误"
                      : ""
                  }}
                </div>
              </div>
              <!-- 正确答案 -->
              <div class="anser">
                <span>正确答案：</span>
                <span class="correct-option">{{ item.answer }}</span>
              </div>
            </template>
            <template v-else-if="item.type === '多选题'">
              <div
                v-for="(item1, index1) in item.answers"
                :key="index1"
                class="item"
                :class="
                  item.studentanswer.includes(item1.answerno)
                    ? item.answer.includes(item1.answerno)
                      ? 'active'
                      : 'close'
                    : ''
                "
              >
                <div class="option">
                  <div class="left">{{ item1.answerno }}</div>
                  <div class="right">{{ item1.content }}</div>
                </div>
                <div class="corr">
                  {{
                    item.studentanswer.includes(item1.answerno)
                      ? item.answer.includes(item1.answerno)
                        ? "回答正确"
                        : "回答错误"
                      : ""
                  }}
                </div>
              </div>
              <!-- 正确答案 -->
              <div class="anser">
                <span>正确答案：</span>
                <span
                  style="margin: 0 5px"
                  :class="{ 'correct-option': item2 }"
                  v-for="(item2, index2) in item.answer.split('|')"
                  :key="index2"
                  >{{ item2 }}</span
                >
              </div>
            </template>
            <template
              v-else-if="item.type === '问答题' || item.type === '填空题'"
            >
              <div class="short">
                <div>
                  答：
                  {{ item.studentanswer }}
                </div>
                <div class="coranswer">
                  正确答案：{{ item.answer ? item.answer : "没有附带正确答案" }}
                </div>
                <el-alert
                  title="答案解析"
                  type="info"
                  :closable="false"
                  :description="item.explains"
                  show-icon
                />
              </div>
            </template>
            <template v-else-if="item.type === '判断题'">
              <div class="judge">
                <div
                  :class="
                    item3 === item.studentanswer
                      ? item.studentanswer === item.answer
                        ? 'active'
                        : 'close'
                      : ''
                  "
                  class="item"
                  v-for="(item3, index3) in ['正确', '错误']"
                  :key="index3"
                >
                  <div>
                    <span
                      class="iconfont"
                      :class="item3 == '正确' ? 'icon-duigoux' : ' icon-cuo'"
                    ></span>
                    <span>{{ item3 }}</span>
                  </div>
                  <div class="corr">
                    {{
                      item3 === item.studentanswer
                        ? item.studentanswer === item.answer
                          ? "回答正确"
                          : "回答错误"
                        : ""
                    }}
                  </div>
                </div>
              </div>
              <div class="cor">
                <span>正确答案：{{ item.answer }}</span>
              </div>
            </template>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { useMainStore } from "../../../stores/dialog";
import moment from "moment";
import { storeToRefs } from "pinia";
const store:any = useMainStore();
const { showDrawer, drawerData } = storeToRefs(store);
// 替换方法
const rep = (str: string) => {
  return str.replace(/&lt;[a-zA-Z]+&gt;|&lt;\/[a-zA-Z]+&gt;/g, "");
};
// 弹出层开关
</script>
<style lang="less" scoped>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.vertical-center {
  display: flex;
  align-items: center;
}
.box {
  height: 100%;
  display: flex;
  flex-direction: column;
}
header {
  height: 70px;
  display: flex;
  flex-direction: column;
  background-color: white;
  z-index: 9999999999999999;
  justify-content: space-between;
  .title {
    font-weight: bold;
  }
  .testmsg {
    font-size: 14px;
    padding: 10px 0;
    border-bottom: 1px solid #ececec;
    box-sizing: border-box;
    span {
      margin: 0 10px;
    }
  }
}
:deep(.el-scrollbar) {
  flex: 1;
}
.questions {
  padding: 20px 0;
  border-bottom: 1px solid #ececec;
  .title-type {
    height: 20px;
    font-size: 12px;
    display: flex;
    align-items: center;
    div:first-of-type {
      display: flex;
    }
    .type,
    .scores {
      margin-right: 10px;
    }
    .scores {
      color: #aca4ab;
    }
    .type {
      height: 100%;
      border: 1px solid rgba(0, 112, 255);
      border-radius: 5px;
      div:first-of-type {
        width: 24px;
        height: 100%;
        // @extend .center;
        color: white;
        background-color: rgba(0, 112, 255);
      }
      div:last-of-type {
        width: 56px;
        height: 100%;
        // @extend .center;
        color: rgba(0, 112, 255);
      }
    }
  }
  .title-content {
    font-size: 15px;
    .topic {
      margin: 16px 0;
    }
    .item {
      margin: 10px 0;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
    }
    .option {
      height: 35px;
      display: flex;
      align-items: center;
      .left {
        width: 22px;
        height: 22px;
        font-size: 12px;
        color: #777f86;
        border-radius: 50%;
        // @extend .center;
        margin-right: 10px;
        border: 1px solid #d3d4d8;
      }
      .right {
        font-size: 16px;
      }
    }
    .anser {
      font-size: 15px;
      height: 30px;
      padding: 0 10px;
      box-sizing: border-box;
      background-color: #f7fbff;
      color: #90adca;
      display: flex;
      align-items: center;
      span {
        display: inline-block;
      }
      .correct-option {
        height: 22px;
        width: 22px;
        border-radius: 50%;
        background-color: rgba(76, 192, 164);
        // @extend .center;
        color: white;
      }
    }
    .short {
      div:first-of-type {
        height: 50px;
        padding: 0 20px;
        border: 1px solid #d3d4d8;
        border-radius: 10px;
        // @extend .vertical-center;
        margin-bottom: 10px;
      }
      .coranswer {
        height: 50px;
        padding: 0 20px;
        background-color: #f0faf6;
        color: #4cc0a4;
        margin-bottom: 10px;
        // @extend .vertical-center;
      }
    }
    .judge {
      div {
        height: 35px;
        padding: 0 10px;
        // @extend .vertical-center;
        span:first-of-type {
          display: inline-block;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px solid #aca4ab;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #777f86;
          margin-right: 10px;
        }
      }
    }
    .cor {
      font-size: 14px;
      height: 30px;
      padding: 0 10px;
      background-color: rgba(247, 251, 255);
      color: #90adca;
      // @extend .vertical-center;
    }
    .active {
      background-color: rgba(240, 250, 246);
      .corr {
        color: #4cc0a4;
        font-size: 12px;
      }
    }
    .close {
      background-color: rgba(252, 243, 243);
      border: 1px solid rgba(0, 137, 255);
      .corr {
        color: rgba(226, 94, 97);
        font-size: 12px;
      }
    }
  }
}
.goal {
  height: 100%;
  border-radius: 5px;
  padding: 0 6px;
  box-sizing: border-box;
}
.correct {
  color: rgba(76, 192, 164);
  border: 1px solid rgba(76, 192, 164);
}
.error {
  color: red;
  border: 1px solid red;
}
</style>
