<template>
  <div>
    <el-drawer
      v-model="drawer"
      :title="title"
      :direction="direction"
      :before-close="handleClose"
    >
      <div class="radioTitle">
        <el-radio-group v-model="radio" class="ml-4">
          <el-radio label="单选题" size="large">单选题</el-radio>
          <el-radio label="多选题" size="large">多选题</el-radio>
          <el-radio label="判断题" size="large">判断题</el-radio>
          <el-radio label="填空题" size="large">填空题</el-radio>
          <el-radio label="问答题" size="large">问答题</el-radio>
        </el-radio-group>
      </div>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="85px"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-form-item label="题干" prop="name">
          <div class="editor">
            <Editor ref="EditorRef" />
          </div>
        </el-form-item>
        <div class="Item" v-show="radio === '单选题' || radio === '多选题'">
          <el-form-item label="选项" prop="name">
            <div
              class="checked"
              v-for="(item, index) in answers"
              :key="item.answerno"
            >
              <span>{{ item.answerno }}:</span>
              <el-input type="textarea" rows="1" v-model="item.content" />
              <span stype="fontSize:12px">
                <CircleClose class="delete" @click="deleteOneFn(index)" />
              </span>
            </div>
            <el-form-item label-width="40px">
              <div class="addChecked">
                <el-icon>
                  <CirclePlus @click="addChecked" />
                </el-icon>
              </div>
            </el-form-item>
          </el-form-item>
          <el-form-item label="正确答案">
            <div class="rightAnswers">
              <div class="radioGroup" v-if="radio === '单选题'">
                <el-radio-group v-model="rightAnswers" class="ml-4">
                  <el-radio
                    :label="item.answerno"
                    size="large"
                    v-for="item in answers"
                    :key="item.answerno"
                    >{{ item.answerno }}</el-radio
                  >
                </el-radio-group>
              </div>
              <div class="checkboxGroup" v-if="radio === '多选题'">
                <el-checkbox-group v-model="rightcehckboxAnswers" class="ml-4">
                  <el-checkbox
                    :label="item.answerno"
                    size="large"
                    v-for="item in answers"
                    :key="item.answerno"
                    >{{ item.answerno }}</el-checkbox
                  >
                </el-checkbox-group>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="Item" v-show="radio === '判断题'">
          <el-form-item label="正确答案">
            <el-radio-group v-model="estimateAnswer" size="large">
              <el-radio-button label="正确" />
              <el-radio-button label="错误" />
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="Item" v-show="radio === '填空题' || radio === '问答题'">
          <el-form-item label="解析">
            <el-input
              type="textarea"
              v-model="gapfilling"
              rows="4"
              style="width: 50%"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="分值" prop="name">
          <div class="score">
            <el-input-number
              v-model="num"
              class="mx-4"
              :min="1"
              :max="10"
              controls-position="right"
              @change="handleChange"
            />
          </div>
        </el-form-item>
      </el-form>
      <div class="btns">
        <el-button @click="save" type="primary">保存</el-button>
        <el-button>保存并继续</el-button>
        <el-button @click="cancel">取消</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, defineExpose, reactive, toRefs } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import Editor from './Editor.vue';
import { CircleClose, CirclePlus } from '@element-plus/icons-vue';
import { questionAdd } from '../../../api/databaselist';
// 表单验证
import type { FormInstance, FormRules } from 'element-plus';
import { number } from 'echarts';
const route = useRoute();
console.log(route.query.id);

const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: 'Hello',
});
const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
});

// 单删选项
const deleteOneFn = (index: number) => {
  if (state.answers.length === 1) {
    return ElMessage.error('至少保留一项');
  }
  if (index < state.answers.length - 1) {
    for (var i = index; i < state.answers.length - 1; i++) {
      state.answers[i].content = state.answers[i + 1].content;
    }
  }
  state.answers.splice(state.answers.length - 1, 1);
};
// 增加选项
const addChecked = () => {
  if (state.answers.length === 0) {
    state.answers.push({ answerno: 'A', content: '' });
  } else if (state.answers.length === 1) {
    state.answers.push({ answerno: 'B', content: '' });
  } else if (state.answers.length === 2) {
    state.answers.push({ answerno: 'C', content: '' });
  } else if (state.answers.length === 3) {
    state.answers.push({ answerno: 'D', content: '' });
  } else if (state.answers.length === 4) {
    state.answers.push({ answerno: 'E', content: '' });
  } else if (state.answers.length === 5) {
    state.answers.push({ answerno: 'F', content: '' });
  } else if (state.answers.length === 6) {
    state.answers.push({ answerno: 'G', content: '' });
  } else if (state.answers.length === 7) {
    state.answers.push({ answerno: 'H', content: '' });
  } else if (state.answers.length === 8) {
    state.answers.push({ answerno: 'I', content: '' });
  } else if (state.answers.length === 9) {
    state.answers.push({ answerno: 'G', content: '' });
  } else if (state.answers.length === 10) {
    state.answers.push({ answerno: 'K', content: '' });
  } else if (state.answers.length === 11) {
    state.answers.push({ answerno: 'L', content: '' });
  } else if (state.answers.length === 12) {
    state.answers.push({ answerno: 'M', content: '' });
  } else if (state.answers.length === 13) {
    state.answers.push({ answerno: 'N', content: '' });
  } else if (state.answers.length === 14) {
    state.answers.push({ answerno: 'O', content: '' });
  } else if (state.answers.length === 15) {
    state.answers.push({ answerno: 'P', content: '' });
  } else if (state.answers.length === 16) {
    state.answers.push({ answerno: 'Q', content: '' });
  } else if (state.answers.length === 17) {
    state.answers.push({ answerno: 'R', content: '' });
  } else if (state.answers.length === 18) {
    state.answers.push({ answerno: 'S', content: '' });
  } else if (state.answers.length === 19) {
    state.answers.push({ answerno: 'T', content: '' });
  } else if (state.answers.length === 20) {
    state.answers.push({ answerno: 'U', content: '' });
  } else if (state.answers.length === 21) {
    state.answers.push({ answerno: 'V', content: '' });
  } else if (state.answers.length === 22) {
    state.answers.push({ answerno: 'W', content: '' });
  } else if (state.answers.length === 23) {
    state.answers.push({ answerno: 'X', content: '' });
  } else if (state.answers.length === 24) {
    state.answers.push({ answerno: 'Y', content: '' });
  } else if (state.answers.length === 25) {
    state.answers.push({ answerno: 'Z', content: '' });
  } else {
    ElMessage({
      message: '只能添加这么几个选项！',
      type: 'warning',
    });
  }
};

// 选项数据
const state = reactive({
  answers: [
    {
      answerno: 'A',
      content: '',
    },
    {
      answerno: 'B',
      content: '',
    },
    {
      answerno: 'C',
      content: '',
    },
    {
      answerno: 'D',
      content: '',
    },
  ],
});
const { answers } = toRefs(state);

// 分值
const num = ref(1);
const handleChange = (value: number) => {
  console.log(value);
};

// 正确答案
const rightAnswers = ref('');
const rightcehckboxAnswers = ref([]);
const radio = ref('单选题');
// 判断题正确答案
const estimateAnswer = ref('');

const drawer = ref<boolean>(false);
const direction = ref<string>('rtl');
const title = ref<string>('');
const EditorRef = ref<any>(''); //富文本
defineExpose({
  drawer,
  title,
});

// 点击旁白或关闭按钮 关闭右侧抽屉
const handleClose = (done: () => void) => {
  done();
};
const gapfilling = ref('');
interface Iinfo {
  title: string;
  type: string;
  answer: any;
  answers: any[];
  scores: number;
  databaseid: number;
}
const info = reactive<Iinfo>({
  title: '',
  type: '',
  answer: [],
  answers: [],
  scores: num.value,
  databaseid: Number(route.query.id),
});

// 提交按钮
const emits = defineEmits(['getChildren']);

const save = async () => {
  info.title = EditorRef.value.valueHtml;
  // console.log(info.list.title);
  // console.log(rightAnswers.value);
  // info.list.answer = rightAnswers.value;
  // console.log(info.list);
  if (radio.value === '单选题') {
    (info.type = radio.value), //类型
      (info.answer = rightAnswers.value), //正确答案
      (info.answers = answers.value); //选项
  } else if (radio.value === '多选题') {
    (info.type = radio.value),
      (info.answer = rightcehckboxAnswers.value.join('|')),
      (info.answers = answers.value);
  } else if (radio.value === '判断题') {
    (info.type = radio.value), (info.answer = estimateAnswer.value);
  } else if (radio.value === '填空题') {
    (info.type = radio.value), (info.answer = gapfilling.value);
  } else if (radio.value === '问答题') {
    (info.type = radio.value), (info.answer = gapfilling.value);
  }
  emits('getChildren', info);
};
const cancel = () => {
  drawer.value = false;
};
</script>

<style scoped lang="less">
:deep(.el-drawer) {
  width: 50% !important;
}

.btns {
  margin-left: 80px;
}

.rightAnswers {
  height: 32px;
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.addChecked {
  width: 400px;
  font-size: 30px;
  color: rgb(89, 160, 255);
}

.delete {
  width: 1.2em;
  height: 1.2em;
  vertical-align: -0.2em;
  fill: currentColor;
  overflow: hidden;
  color: red;
}

:deep(.el-drawer__header) {
  margin: 0;
}

.radioTitle {
  margin-bottom: 20px;
  margin-left: 10px;
}

.checked {
  display: flex;
  width: 51%;
  margin-bottom: 15px;
  justify-content: space-evenly;
  align-items: center;
  height: 30px;
  flex-wrap: wrap;

  .el-textarea {
    width: 80%;
  }
}
</style>
