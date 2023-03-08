<template>
  <el-drawer
    v-model="store.createAddTest"
    size="50%"
    :title="'试题' + store.createTestTitle"
    direction="rtl"
    @close="onRefreshs"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="t-content">
      <div class="radio">
        <el-radio-group v-model="types" class="ml-4">
          <el-radio label="单选题" size="large">单选题</el-radio>
          <el-radio label="多选题" size="large">多选题</el-radio>
          <el-radio label="判断题" size="large">判断题</el-radio>
          <el-radio label="填空题" size="large">填空题</el-radio>
          <el-radio label="问答题" size="large">问答题</el-radio>
        </el-radio-group>
      </div>
      <div class="t-test">
        <el-form :model="form" label-width="80px">
          <!-- 不管什么题类型都显示富文本编辑器 -->
          <el-form-item label="题干">
            <MyEditor
              :refreshValue="refreshValue"
              mode="default"
              @BoxValue="handleBoxValue"
            />
          </el-form-item>
          <!-- 如果是单选题或多选题显示选项 -->
          <el-form-item
            v-show="types === '单选题' || types === '多选题'"
            label="选项"
          >
            <div
              class="options"
              v-for="(item, index) in form.answers"
              :key="index"
            >
              <span>{{ optionArr[index] }}：</span>
              <el-input
                type="textarea"
                style="width: 400px; height: 30px"
                v-model="item.content"
              />
              <!-- 删除 -->
              <el-icon @click="testDelete(item.answerno)" size="22"
                ><CircleClose color="red"
              /></el-icon>
            </div>
            <!-- 添加选项 -->
            <div
              v-show="form.answers[form.answers.length - 1].answerno !== 'F'"
            >
              <el-icon size="30" @click="testAdd"
                ><CirclePlus color="#48a2ff"
              /></el-icon>
            </div>
          </el-form-item>
          <!-- 如果是单选题显示单选按钮组 -->
          <el-form-item
            v-show="types === '单选题'"
            class="radio"
            label="正确答案"
          >
            <el-radio-group v-model="form.answer">
              <el-radio
                v-for="(item, index) in form.answers"
                :key="index"
                :label="optionArr[index]"
                size="large"
              ></el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 如果是多选题显示多选按钮组 -->
          <el-form-item
            v-show="types === '多选题'"
            class="radio"
            label="正确答案"
          >
            <el-checkbox-group @change="onSelectAnswer" v-model="checkList">
              <el-checkbox
                v-for="(item, index) in form.answers"
                :key="index"
                :label="optionArr[index]"
              />
            </el-checkbox-group>
          </el-form-item>
          <!-- 判断题选项 -->
          <el-form-item
            v-show="types === '判断题'"
            class="radio"
            label="正确答案"
          >
            <el-radio-group v-model="form.answer">
              <el-radio-button label="正确" />
              <el-radio-button label="错误" />
            </el-radio-group>
          </el-form-item>
          <!-- 如果是填空题需要设置空位 -->
          <el-form-item
            label="正确答案"
            label-width="90px"
            style="max-width: 400px"
            v-show="types == '填空题' && topicArr.length > 0"
          >
            <div class="from">
              <el-input
                v-model="topicArr[index]"
                v-for="(item, index) in topicArr"
                :key="index"
                v-show="types == '填空题'"
              />
            </div>
          </el-form-item>
          <!-- 如果是填空题或者问答题显示答案解析 -->
          <el-form-item
            v-show="types === '填空题' || types === '问答题'"
            class="radio"
            label="解析"
          >
            <el-input
              type="textarea"
              placeholder="答案解析"
              style="width: 400px; height: 30px"
              v-model="form.explains"
            />
          </el-form-item>
          <!-- 分值 -->
          <el-form-item label="分值">
            <el-input-number
              :min="1"
              style="width: 90px"
              :controls="false"
              v-model="form.scores"
            />
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click="onSave('保存')">保存</el-button>
            <el-button @click="onSave('继续')">保存并继续</el-button>
            <el-button @click="onClose">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useMainStore } from '../../../stores/dialog';
import MyEditor from '../../common/MyEditor.vue';
import { CircleClose, CirclePlus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
const store:any = useMainStore();
const types = ref('单选题');
const refreshValue = ref({});
const checkList = ref([]);
const emit = defineEmits(['onSendTest']);
const props = defineProps({
  updateDrawer: {
    type: Object,
    default: () => {},
  },
});
const form: any = ref({
  id: 0,
  answer: null as any,
  type: '单选题',
  scores: 0,
  title: '',
  tags: '',
  explains: '',
  answers: [
    { answerno: 'A', content: '' },
    { answerno: 'B', content: '' },
    { answerno: 'C', content: '' },
    { answerno: 'D', content: '' },
  ],
});
const optionArr = ['A', 'B', 'C', 'D', 'E', 'F'];
const topicArr: any = ref([]);
// 监听types变化，重置表单
watch(types, (newVal) => {
  onRefreshs();
  form.value.type = newVal;
});
// 内容 HTML
watch(
  () => form.value.title,
  (newValue: any) => {
    if (types.value == '填空题') {
      console.log(newValue);
      if (newValue.match(/\[\]/g) !== null) {
        topicArr.value = newValue
          .match(/\[\]/g)
          .map((item: any, index: number) => (item = topicArr.value[index]));
      }
    }
  },
  { immediate: false, deep: true }
);
// 监听数据回显
watch(
  () => props.updateDrawer,
  (newVal) => {
    console.log(newVal);
    if (!Object.keys(newVal).length) return false;
    Object.keys(form.value).forEach((key: string) => {
      form.value[key] = newVal[key];
    });
    types.value = newVal.type;
    refreshValue.value = JSON.parse(JSON.stringify({ value: newVal.title }));
    if (newVal.type === '多选题') checkList.value = newVal.answer.split('|');
    if (newVal.type === '填空题') topicArr.value = newVal.answer.split('|');
  },
  { deep: true, immediate: true }
);
// 重置表单
const onRefreshs = () => {
  form.value = {
    id: 0,
    answer: null as any,
    type: '单选题',
    scores: 0,
    title: '',
    tags: '',
    explains: '',
    answers: [
      { answerno: 'A', content: '' },
      { answerno: 'B', content: '' },
      { answerno: 'C', content: '' },
      { answerno: 'D', content: '' },
    ],
  };
  checkList.value = [];
  topicArr.value = [];
  refreshValue.value = JSON.parse(JSON.stringify({ value: '<p></p>' }));
};
// 富文本自定义事件
const handleBoxValue = (newVal: string) => {
  form.value.title = newVal;
};
interface IOptions {
  answerno: string;
  content: string;
}
// 删除试题选项
const testDelete = (data: string) => {
  if (form.value.answers.length == 2) return ElMessage.error('至少有两个选项');
  // 查找下标
  const index = form.value.answers.findIndex(
    (item: IOptions) => item.answerno == data
  );
  if (index == -1) return;
  // 根据下标删除
  form.value.answers.splice(index, 1);
  // 删除完后由于会改变答案序号顺序，归正一下
  form.value.answers.forEach((item: IOptions, index: number) => {
    item.answerno = optionArr[index];
  });
};
// 添加试题选项
const testAdd = () => {
  // 现有题目
  const index = form.value.answers.length;
  form.value.answers.push({
    answerno: optionArr[index],
    content: '',
  });
};
// 多选题答案
const onSelectAnswer = (answerArr: Array<string>) => {
  form.value.answer = answerArr.join('|');
};
// 保存试题
const onSave = (isSave: string) => {
  const type = form.value.type; // 题目类型
  const title = form.value.title; // 题目
  const answers = form.value.answers; // 选项
  if (!title || title == '<p><br></p>') return ElMessage.error('请填写题干');
  if (type === '单选题' || type === '多选题') {
    const flag = answers.every((item: IOptions) => item.content !== '');
    if (!flag) return ElMessage.error('选项内容不可为空');
  }
  if (type === '判断题' || type === '单选题' || type === '多选题') {
    if (!form.value.answer) return ElMessage.error('请填写正确答案');
  }
  if (type === '填空题') {
    if (
      !topicArr.value.every(
        (item: any) => typeof item !== 'undefined' && item !== ''
      )
    )
      return ElMessage.error('请为填空题填写答案');
    form.value.answer = topicArr.value.join('|');
  }
  if (type === '问答题' || type === '填空题') {
    if (!form.value.explains) return ElMessage.error('请填写答案解析');
  }
  if (!form.value.scores) return ElMessage.error('请输入分值');
  // 将试题传递给父组件
  if (isSave === '保存') {
    emit('onSendTest', form.value, store.createTestTitle);
    onClose();
  } else {
    emit('onSendTest', form.value, store.createTestTitle);
    onRefreshs();
    form.value.type = types.value;
    store.$patch((state:any) => {
      state.createTestTitle = '添加';
    });
  }
};
// 关闭弹框清空数据
const onClose = () => {
  onRefreshs();
  store.$patch((state:any) => {
    state.createAddTest = false;
  });
};
</script>
<style lang="less" scoped>
.t-content {
  margin-top: -30px;
  padding: 0px 10px;
  .t-test {
    margin-top: 10px;
    :deep(.el-radio) {
      height: auto;
    }
    .options {
      margin-bottom: 20px;
      width: 100%;
      display: flex;
      align-items: center;
      span {
        font-weight: bold;
      }
      .el-icon {
        margin-left: 8px;
      }
    }
  }
}
:deep(.el-textarea__inner) {
  height: 100%;
}
</style>
