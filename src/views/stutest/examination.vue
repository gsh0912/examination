<template>
  <div id="root">
    <div class="left">
      <div class="content">
        <div class="title">{{ topicList.title }}</div>
        <!-- 每一道题 -->
        <div class="topicbox" v-for="(item, index) in topicList.questions" :key="item.id" ref="examListRef">
          <div class="topictitle">
            <div class="topicindex">
              <div class="num">{{ index + 1 }}</div>
              <div class="typetitle">{{ item.type }}</div>
            </div>
            <div class="topicscore">分值:{{ item.scores }}</div>
          </div>
          <div class="topiccontent" v-html="item.title"></div>
          <div class="radiobox" v-if="item.type === '单选题'">
            <!-- 判断当前选项是否选中 -->
            <div class="radioitembox" :class="item.studentanswer === data.answerno ? 'checkActive' : ''"
              v-for="data in item.answers" @click="radioFn(item, data)">
              <div class="radioitem">
                <div class="itemleft">{{ data.answerno }}</div>
                <div class="itemright">{{ data.content }}</div>
              </div>
            </div>
          </div>
          <div class="checkbox" v-if="item.type === '多选题'">
            <div class="checkboxItem" v-for="data in item.answers" :key="data.id" @click="checkboxFn(item, data)" :class="
              item.studentanswer
                ? item.studentanswer.includes(data.answerno)
                  ? 'checkboxchecked'
                  : ''
                : ''
            ">
              <div class="checkboxleft" :class="
                item.studentanswer
                  ? item.studentanswer.includes(data.answerno)
                    ? 'checkboxleftActive'
                    : ''
                  : ''
              ">
                {{ data.answerno }}
              </div>
              <div class="checkboxright">{{ data.content }}</div>
            </div>
          </div>
          <div class="" v-if="item.type === '填空题'">
          </div>
          <div class="" v-if="item.type === '问答题'">
            <el-input v-model="item.studentanswer" :rows="4" type="textarea" />
          </div>
          <div class="estimatebox" v-if="item.type === '判断题'">
            <div class="estimateitem" :class="item.studentanswer === '正确' ? 'ok' : ''" @click="estimateFn(item, '正确')">
              <span class="dot" :class="item.studentanswer === '正确' ? 'dotActive' : ''"
                v-if="item.studentanswer === '正确'">√</span>
              <span class="dot" v-else></span>
              正确
            </div>
            <div class="estimateitem" :class="item.studentanswer === '错误' ? 'ok' : ''" @click="estimateFn(item, '错误')">
              <span class="dot" :class="item.studentanswer === '错误' ? 'dotActive' : ''"
                v-if="item.studentanswer === '错误'">√</span>
              <span class="dot" v-else></span>
              错误
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="right">
      <h2>答题卡</h2>
      <div class="isthat">
        <div class="correct"></div>
        已答
        <div class="mistake"></div>
        未答
      </div>
      <div class="answerCard">
        <div @click="examListFn(index)" :class="item.studentanswer ? 'correctCard' : 'mistakeCard'"
          v-for="(item, index) in topic.topicList.questions" :key="item.id">
          {{ index + 1 }}
        </div>
      </div>
      <div class="bottom">
        <p>
          共 <span>{{ okDone }}</span>题,剩余<span>{{ okDone - done }}</span>题未完成
        </p>
        <el-popconfirm width="260px" @confirm="testPaper" confirm-button-text="确定" cancel-button-text="取消" :title="
          (unfinished ? `你还有${unfinished}题未完成` : '还未到交卷时间') +
          '，确定提交吗？'
        ">
          <template #reference>
            <el-button class="but" type="primary">交卷</el-button>
          </template>
        </el-popconfirm>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { testStart } from '../../api/test'
import { onMounted, ref, reactive, toRefs, watch, nextTick, watchEffect } from 'vue';
import { studentanswerAdd } from '../../api/stutest'
import { htmlEncodeByRegExp } from '../../utils/htmlUtil'
import router from '../../router';
import { ElMessage } from 'element-plus'
const route = useRoute();
onMounted(() => {
  getTopic();
});
const radioFlag = ref<boolean>(false);
const nums = ref<number>(0);
const datas = ref<any>([]);
const studentid = sessionStorage.getItem('model');
const dialogVisible = ref(false);
// 点击提交试卷
const testPaper = async () => {
  topic.topicList.questions.forEach((item: any) => {
    if (item.type === '多选题' && item.studentanswer) {
      item.studentanswer = item.studentanswer.substring(
        0,
        item.studentanswer.length - 1
      );
    }
    let data = {};
    if (
      item.type === '问答题' ||
      item.type === '判断题' ||
      item.type === '填空题'
    ) {
      data = {
        testid: item.testid,
        studentid: JSON.parse(studentid!).id,
        questionid: item.id,
        answer: item.studentanswer ? item.studentanswer : '',
        scores:
          item.type === '问答题' || item.type === '填空题'
            ? null
            : item.type === '单选题' ||
              item.type === '判断题' ||
              item.type === '多选题'
              ? item.studentanswer === item.answer
                ? item.scores
                : 0
              : !item.studentanswer
                ? 0
                : nums.value === item.answer.split('|').length
                  ? item.scores
                  : 0,
      };
    } else {
      data = {
        testid: item.testid,
        studentid: JSON.parse(studentid!).id,
        questionid: item.answers[0].questionid,
        answer: item.studentanswer ? item.studentanswer : '',
        scores:
          item.type === '问答题' || item.type === '填空题'
            ? null
            : item.type === '单选题' ||
              item.type === '判断题' ||
              item.type === '多选题'
              ? item.studentanswer === item.answer
                ? item.scores
                : 0
              : !item.studentanswer
                ? 0
                : nums.value === item.answer.split('|').length
                  ? item.scores
                  : 0,
      };
    }

    datas.value.push(data);
    console.log(datas.value);
    if (!item.studentanswer) {
      dialogVisible.value = true;
    }
  });
  let res: any = await studentanswerAdd(datas.value);
  console.log(res);
  if (res.errCode === 10000) {
    ElMessage({
      message: '交卷成功',
      type: 'success',
    })
    router.push(`/examresults?id=${topic.topicList.id}`);
  }
};
//判断题点击事件
const estimateFn = (val: any, text: string) => {
  console.log(val);
  val.studentanswer = text
}

// 答题卡点击事件
const examListRef = ref(); //通过ref 获取每个元素的高度
const examListFn = (index: number) => {
  window.scrollTo({
    top: examListRef.value[index].offsetTop - 100,
    left: 0,
    behavior: 'smooth',
  });
};
// 多选框事件
const checkboxFn = (item: any, data: any) => {
  if (!item.studentanswer) {
    item.studentanswer = '';
  }
  item.studentanswer += data.answerno + '|';
};

// 单选框点击事件
const radioFn = (item: any, data: any) => {
  console.log(data);
  item.studentanswer = data.answerno;
  radioFlag.value = !radioFlag.value;
};

interface Item {
  topicList: any;
}
const topic = reactive<Item>({
  topicList: [],
});
const { topicList } = toRefs(topic);

// 获取考试题目
const getTopic = async () => {
  let res = await testStart({
    testid: route.query.id,
  });
  res.data.questions = res.data.questions.map((data: any) => {
    if (data.type === '填空题') {
      data.title = data.title.replaceAll("[]", `<input class="inps" data="${data.id}" type="text"  style="width:100px;border:none;border-bottom:1px solid #000;outline: none;"/>,`)
    }
    htmlEncodeByRegExp(data.title)
    return data
  })
  topic.topicList = res.data
  nextTick(() => {
    let inps: any = document.querySelectorAll('.inps');
    inps.forEach((item: any) => {
      item.oninput = (event: any) => {
        topic.topicList.questions.forEach((data: any) => {
          if (data.id === Number(event?.target.getAttribute('data'))) {
            data.studentanswer ? data.studentanswer : (data.studentanswer = '');
            data.studentanswer = '';
            for (let i = 0; i < inps.length; i++) {
              data.studentanswer += inps[i].value + '|';
            }
          }
        });
        console.log(topic.topicList);
      };
    });
  });
};
// 已完成的数量
const done = ref<number>(0);
const okDone = ref<number>(0);
watch(
  () => topic.topicList,
  (newVal) => {
    done.value = newVal.questions.filter(
      (item: any) => item.studentanswer
    ).length;
    okDone.value = newVal.questions.length;
  },
  { deep: true }
);

const testAll = ref(0); // 题目总数量
const unfinished = ref(0); // 未完成的题目
watchEffect(() => {
  if (!topic.topicList.questions) return;
  testAll.value = topic.topicList.questions.length;
  unfinished.value = topic.topicList.questions.filter(
    (item: any) => !item.studentanswer
  ).length;
});
</script>

<style scoped lang="less">
#root {
  display: flex;

  // 左侧内容区域
  .left {
    flex: 1;
    padding-left: 50px;

    // 单选框选中样式
    .checkActive {
      background-color: #f1f5fb;
      border: 1px solid #0089ff;
    }

    .content {
      width: 1020px;

      .topiccontent {
        font-size: 15px;
        margin: 20px 0;
      }

      .checkbox {
        .checkboxchecked {
          background-color: #f1f5fb;
          border: 1px solid #0089ff;
        }

        .checkboxItem {
          display: flex;
          height: 35px;
          width: 1000px;
          padding: 0 10px;
          align-items: center;
          border-radius: 3px;
          margin-bottom: 10px;
          cursor: pointer;

          .checkboxleft {
            width: 20px;
            height: 20px;
            font-size: 12px;
            border: #d3d4d8 1px solid;
            color: #777f86;
            background-color: #fff;
            margin-right: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .checkboxleftActive {
            border: #0089ff 1px solid;
            color: #fff;
            background-color: #0089ff;
          }

          .checkboxright {
            font-size: 13px;
          }
        }
      }

      .radiobox {
        .radioitembox {
          height: 35px;
          width: 1000px;
          padding: 0 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 3px;
          margin-bottom: 10px;
          cursor: pointer;

          .radioitem {
            display: flex;
            align-items: center;

            .itemleft {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              font-size: 12px;
              border: #d3d4d8 1px solid;
              color: #777f86;
              background-color: #fff;
              margin-right: 5px;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            .itemright {
              font-size: 13px;
            }
          }
        }
      }

      .title {
        height: 50px;
        line-height: 50px;
        font-size: 20px;
      }

      .estimatebox {
        .ok {
          background-color: #f1f5fb;
          border: 1px solid #0089ff;
        }

        .estimateitem {
          height: 35px;
          padding: 0 20px;
          display: flex;
          align-items: center;
          margin: 5px 0;

          .dot {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            font-size: 12px;
            border: #d3d4d8 1px solid;
            color: #777f86;
            background-color: #fff;
            margin-right: 5px;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .dotActive {
            background-color: #0089ff;
            color: #fff;
          }
        }
      }

      .topicbox {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        width: 1020px;
        padding-bottom: 20px;
        border-top: 1px #f0f0f0 solid;
        padding-top: 20px;

        .topictitle {
          display: flex;
          align-items: center;

          .topicindex {
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

            .typetitle {
              flex: 1;
              height: 100%;
              background-color: #f1f5fb;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #3377f9;
            }
          }

          .topicscore {
            font-size: 12px;
            color: #aca4ab;
            margin: 0 10px;
          }
        }
      }
    }
  }

  // 答题卡区域
  .right {
    width: 300px;
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;

    .bottom {
      font-size: 12px;
      color: #989a99;
      width: 100%;

      p {
        margin: 10px 0;

        span {
          color: black;
        }
      }

      .el-button {
        width: 90%;
      }
    }

    h2 {
      padding: 15px 0;
      margin-left: 15px;
      font-weight: 700;
      font-size: 19px;
    }

    .isthat {
      display: flex;
      height: 50px;
      align-items: center;
      font-size: 14px;
      margin-bottom: 5px;

      .correct {
        width: 16px;
        height: 16px;
        background-color: #f0f8ff;
        margin: 0 10px;
      }

      .mistake {
        width: 16px;
        height: 16px;
        border: 1px solid #e9e9e9;
        margin: 0 10px;
      }
    }

    .answerCard {
      display: flex;
      flex-wrap: wrap;
      width: 260px;
      overflow-y: auto;
      .correctCard {
        width: 35px;
        height: 35px;
        border-radius: 3px;
        border: 1px solid #e3e3e3;
        background-color: #f0f8ff;
        color: #aab4fd;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 6px;
        margin-bottom: 6px;
        font-size: 14px;
        cursor: pointer;
      }

      .mistakeCard {
        cursor: pointer;
        width: 35px;
        height: 35px;
        border-radius: 3px;
        border: 1px solid #e3e3e3;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 6px;
        margin-bottom: 6px;
        font-size: 14px;
      }
    }
  }
}


/* IE 10+ */
&::-webkit-scrollbar {
  // chrome safari
  display: none;
}
</style>
