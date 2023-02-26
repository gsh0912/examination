<template>
  <div class="common-layout">
    <el-container>
      <el-main>
        <div class="main">

          <el-page-header @back="goBack">
            <template #content>
              <span class="text-large font-600 mr-3">
                {{ examIfon.list.title }}
              </span>
            </template>
          </el-page-header>
          <div class="examList" v-for="(item, index) in examIfon.questions" :key="index" ref="examListRef">
            <div class="questionType">
              <div class="type">
                <div class="num">{{ index + 1 }}</div>
                <div class="typeTitle">{{ item.type }}</div>
              </div>
              <div class="score">分值：{{ item.scores }}</div>
              <div :class="item.studentscores === 0 ? 'getScore' : 'reqScore'">得分：{{ item.studentscores }}</div>
            </div>
            <div class="title">
              <span v-html="item.title">
              </span>
            </div>
            <div class="item" v-if="item.type === '单选题'">
              <div class="options" v-for="data in item.answers">
                <span class="optionContent">{{ data.answerno }}</span>
                <span>{{ data.content }}</span>
              </div>
              <div class="correct">正确答案：<span class="bingoRadio">{{ item.answer }}</span></div>

            </div>
            <div class="item" v-if="item.type === '多选题'">
              <div class="options" v-for="data in item.answers">
                <span class="optionContent">{{ data.answerno }}</span>
                <span>{{ data.content }}</span>
              </div>
              <div class="correct">正确答案：<span class="bingoRadio" v-for="answer in item.answer" :key="answer">{{ answer
              }}</span></div>
            </div>
            <div class="item" v-if="item.type === '填空题'">
              <div class="gapfilling">答：</div>
              <div class="correct">{{ item.studentanswer }}</div>
              <div class="correctCheckbox">正确答案：{{ item.answer }}</div>
              <div class="checkboxBottom">
                <span>答案解析：</span>{{ item.explains }}
              </div>
            </div>
            <div class="item" v-if="item.type === '问答题'">
              <div class="gapfilling">答：</div>
              <div class="correct">{{ item.studentanswer }}</div>
              <div class="checkboxBottom">
                <span>答案解析：</span>{{ item.explains }}
              </div>
            </div>
            <div class="item" v-if="item.type === '判断题'">
              <div class="dotbox"> <span class="dot"></span>正确</div>
              <div class="dotbox"> <span class="dot"></span>错误</div>
              <div class="correct">正确答案：{{ item.answer }}</div>
            </div>
          </div>
        </div>
      </el-main>
      <el-aside width="300px">
        <h2>答题卡</h2>
        <div class="isthat">
          <div class="correct"></div>正确
          <div class="mistake"></div>错误
        </div>
        <div class="answerCard">
          <div @click="examListFn(index)" :class="item.studentscores ? 'correctCard' : 'mistakeCard'"
            v-for="(item, index) in examIfon.questions" :key="item.id">
            {{ index + 1 }}</div>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getForResult } from '../../api/stutest';
let route = useRoute();
let router = useRouter();

// 列表展示数据
const examIfon = reactive<any>({
  list: [],
  questions: [],
});

// 点击回退上一个页面
const goBack = () => {
  router.back()
};

const examListRef = ref() //通过ref 获取每个元素的高度
const examListFn = (index: number) => {
  console.log(examListRef.value[index].offsetTop); //当前元素的高度
  console.log(examListRef.value[index]); //当前元素
  window.scrollTo({
    top: examListRef.value[index].offsetTop - 100,
    left: 0,
    behavior: "smooth"
  });
}
// 获取题目列表
const getExamInfo = async () => {
  let res: any = await getForResult({ testid: route.query.id });
  examIfon.list = res.data;
  examIfon.questions = res.data.questions.map((item: any) => {
    if (item.type === '多选题') {
      item.answer = item.answer.split('|')
    }
    if (item.type === '填空题') {
      console.log(item.title);
      item.title = item.title.replaceAll("[]", `<input type="text" value="${item.studentanswer}" style="width:100px;border:none;border-bottom:1px solid #000;"/>`)
    }
    return item
  })
};
onMounted(() => {
  getExamInfo();
})
</script>
<style scoped lang="less">
/deep/.el-main {
  background-color: #fafbfd;

  .main {
    width: 1000px;
    padding-left: 30px;
  }

}


.el-aside {
  padding-left: 20px;
  position: fixed;
  top: 0;
  right: 0;

  h2 {
    margin-top: 26px;
    margin-bottom: 10px;
    font-size: 20px;
    margin-left: 10px;
  }

  .answerCard {
    display: flex;
    flex-wrap: wrap;
    width: 260px;

    .correctCard {
      width: 35px;
      height: 35px;
      border-radius: 3px;
      background-color: #eefaf5;
      border: 1px solid #e3e3e3;
      color: #97d3af;
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
      background-color: #fcf2f0;
      color: #e9747f;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 6px;
      margin-bottom: 6px;
      font-size: 14px;
    }
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
      background-color: #eefaf5;
      margin: 0 10px;
    }

    .mistake {
      width: 16px;
      height: 16px;
      background-color: #fcf2f0;
      margin: 0 10px;
    }
  }

}

.examList {
  padding-bottom: 30px;
  border-bottom: 1px #f0f0f0 solid;

  .checkboxBottom {
    font-size: 15px;
    padding: 20px 15px;
    display: flex;
  }

  .correctCheckbox {
    background-color: #f0faf6;
    padding: 10px 20px;
    margin-top: 10px;
    font-size: 15px;
    padding: 20px 15px;
    display: flex;

  }

  .item {
    margin-left: 30px;

    .dotbox {
      display: flex;
      margin: 15px 0px;

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
    }


    .correct {
      height: 30px;
      display: flex;
      align-items: center;
      background-color: #f7fbff;
      margin-top: 20px;
      font-size: 15px;
      color: #90adca;
      padding: 10px 20px;

      .bingoRadio {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #4cc0a4;
        font-size: 13px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 10px
      }
    }

    .options {
      display: flex;
      margin-top: 20px;

      .optionContent {
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
    }
  }

  .questionType {
    display: flex;
    align-items: center;
    margin-top: 30px;

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

    .getScore {
      height: 16px;
      font-size: 12px;
      border: #ee0000 solid 1px;
      border-radius: 3px;
      color: #e00;
      padding: 0 5px;
    }

    .reqScore {
      height: 16px;
      font-size: 12px;
      border: #4cc0a4 1px solid;
      border-radius: 3px;
      color: #4cc0a4;
      padding: 0 5px;
    }
  }

  .title {
    font-size: 15px;
    margin: 20px 0;
  }
}
</style>
