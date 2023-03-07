<template>
  <div class="testlist">
    <!-- 头部 -->
    <div class="top">
      <h3>试题列表</h3>
      <div>
        <span>总分：{{ ruleForm.scores }}</span>
        <span>已添加 {{ ruleForm.questions.length }} 题</span>
        <el-button @click="emit('onClear')">清空</el-button>
      </div>
    </div>
    <!-- 左侧 多少到题 每题多少分 -->
    <div class="left-test">
      <div v-for="(item, index) in (subject as any)" :key="index">
        <div
          v-show="ruleForm.questions.some((item1:any) =>item1.type === item.title )"
          class="msg-test"
        >
          <p>{{ item.title + item.num }}道</p>
          <p>
            每题
            <el-input-number
              :min="0"
              :controls="false"
              v-model.number="item.score"
              style="width: 45px; height: 30px"
            />
            分
          </p>
        </div>
      </div>
    </div>
    <!-- 试题列表 -->
    <el-scrollbar
      v-show="ruleForm.questions.length"
      always
      :height="ruleForm.questions.length > 2 ? '60vh' : 'auto'"
      class="list-test"
    >
      <div
        class="item-test"
        v-for="(item, index) in ruleForm.questions"
        :key="index"
      >
        <!-- 题目类型及分值 -->
        <div class="test-top">
          <div>
            <span>{{ index + 1 }}.{{ item.type }}</span>
            <span
              >分值<el-input
                v-model="item.scores"
                style="width: 60px; margin-left: 6px"
              />
            </span>
          </div>
          <div class="text-update">
            <el-icon
              @click="emit('onTestUpdate', item, index)"
              size="22"
              color="#299aff"
              ><EditPen
            /></el-icon>
            <el-icon size="22" color="#299aff"
              ><Delete @click="emit('onTestDel', index)"
            /></el-icon>
          </div>
        </div>
        <!-- 题目 -->
        <div class="title-test">
          <span
            v-html="item.title.replace(/\[\]/g, '______,')"
            v-if="item.type === '填空题'"
          ></span>
          <span v-html="item.title" v-else></span>
        </div>
        <!-- 选项 -->
        <template v-if="item.type === '单选题' || item.type === '多选题'">
          <div
            :class="{
              active: item.answer
                ? item.answer.includes(item1.answerno)
                : false,
            }"
            class="options"
            v-for="(item1, index1) in item.answers"
            :key="index1"
          >
            <el-radio-group v-show="item.type === '单选题'" readonly>
              <el-radio label="1">
                <span>{{ item1.answerno }}：</span>
                <span>{{ item1.content }}</span>
              </el-radio>
            </el-radio-group>
            <el-checkbox-group v-show="item.type === '多选题'">
              <el-checkbox :checked="false">
                <span>{{ item1.answerno }}：</span>
                <span>{{ item1.content }}</span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </template>
        <!-- 判断题 -->
        <template v-else-if="item.type === '判断题'">
          <div class="correct">
            <el-alert
              :title="
                item.answer === '正确' ? '正确答案：正确' : '正确答案：错误'
              "
              type="success"
              :closable="false"
            />
          </div>
        </template>
        <!-- 问答 填空 -->
        <template v-else-if="item.type === '问答题' || item.type === '填空题'">
          <el-alert
            v-show="item.type === '填空题'"
            :title="item.answer"
            type="success"
            :closable="false"
          />
          <div class="explains">答案解析：{{ item.explains }}</div>
        </template>
      </div>
    </el-scrollbar>
    <!-- 底部 -->
    <div class="bottom">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
// <el-icon><Delete /></el-icon>
import { EditPen, Delete } from "@element-plus/icons-vue";
const emit = defineEmits(["onTestDel", "onTestUpdate", "onClear"]);
const props = defineProps({
  subject: {
    type: Array,
    default: () => [],
  },
  ruleForm: {
    type: Object,
    default: () => {},
  },
});
console.log(props);
</script>
<style lang="less" scoped>
.testlist {
  width: 1025px;
  border: 1px solid #dcdfe6;
  position: relative;
  .top {
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dcdfe6;
    div {
      display: flex;
      align-items: center;
      span,
      .el-button {
        margin-left: 30px;
      }
    }
  }
  .left-test {
    background-color: white;
    z-index: 2000;
    width: 120px;
    position: absolute;
    left: -130px;
    .msg-test {
      padding: 10px;
      color: #848484;
      box-sizing: border-box;
      border: solid 1px #ececec;
      :deep(.el-input__inner) {
        text-align: center;
      }
    }
  }
  .list-test {
    .item-test {
      padding: 20px 15px;
      box-sizing: border-box;
      .explains {
        background-color: #f5faff;
        color: #9dadbc;
        display: flex;
        align-items: center;
        padding: 0 20px;
        box-sizing: border-box;
        height: 42px;
        margin: 10px 0;
        span {
          margin-right: 10px;
        }
      }
      .correct {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        height: 42px;
        color: #70d3b2;
        background-color: #eefaf6;
        span {
          margin-right: 10px;
        }
      }
      .options {
        padding: 0 8px;
        box-sizing: border-box;
        height: 42px;
        display: flex;
        align-items: center;
        :deep(.el-radio__inner) {
          width: 20px;
          height: 20px;
        }
        :deep(.el-radio__label) {
          font-weight: normal;
        }
      }
      .title-test {
        padding: 8px 0;
      }
      .test-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #6a6a6a;
        :deep(.el-input__inner) {
          text-align: center;
        }
        div:first-of-type {
          span {
            margin-right: 10px;
          }
        }
        .text-update {
          .el-icon {
            margin-right: 8px;
          }
        }
      }
    }
  }
  .bottom {
    padding: 10px 15px;
    border-top: 1px solid #dcdfe6;
  }
}
.active {
  background-color: #eefaf6;
  margin-bottom: 8px;
  border-radius: 6px;
  color: #70d3b2;
}
</style>
