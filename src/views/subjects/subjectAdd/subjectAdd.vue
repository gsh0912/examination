<template>
  <el-scrollbar height="97vh" class="create-container">
    <headeTitle :title="'创建考试'" />
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="110px"
      class="demo-ruleForm"
      status-icon
    >
      <!-- TODO: 基本信息 -->
      <div class="content">
        <div class="title">
          <span>1</span>
          <span>基本信息</span>
        </div>
        <div class="msg test-name">
          <el-form-item label="考试名称：" prop="title">
            <el-input v-model="ruleForm.title" placeholder="考试名称" />
          </el-form-item>
        </div>
      </div>
      <!-- TODO: 内容设置 -->
      <div class="content">
        <div class="title">
          <span>2</span>
          <span>内容设置</span>
        </div>
        <div class="msg">
          <el-form-item label="考试内容：">
            <!-- 试题列表 -->
            <questionsList
              :subject="subject"
              :ruleForm="ruleForm"
              @onTestDel="handelTestDel"
              @onTestUpdate="handleTestUpdate"
              @onClear="handleClear"
            >
              <template #footer>
                <el-button @click="onAdditionTest">添加试题</el-button>
                <el-button @click="batchExport">批量导入</el-button>
                <el-button @click="onDatabase">从题库中导入</el-button>
                <el-button @click="onAlready">选择已有试卷</el-button>
              </template>
            </questionsList>
          </el-form-item>
          <el-form-item label="存入题库：">
            <el-select v-model="databaseid" placeholder="选择题库">
              <el-option
                :key="index"
                v-for="(item, index) in databaseData"
                :label="item.title"
                :value="item.id"
              />
            </el-select>
            <el-button style="margin-left: 10px" @click="onQuestion"
              >+创建题库</el-button
            >
          </el-form-item>
        </div>
      </div>
      <!-- TODO: 教师范围 -->
      <div class="content">
        <div class="title">
          <span>4</span>
          <span>教师范围</span>
        </div>
        <div class="msg">
          <el-form-item label="可见老师：">
            <div class="choice">
              <el-button @click="handlevisible">
                <span>+选择</span>
              </el-button>
              <span class="counts">{{ ruleForm.limits.length }}</span>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="bottons">
      <el-button type="primary" @click="onAddTest(1)">发布</el-button>
      <el-button @click="onAddTest(2)">保存(不发布)</el-button>
      <el-button @click="onCancel">取消</el-button>
    </div>
    <!-- 添加试题 -->
    <createTestDrawer
      :updateDrawer="updateDrawer"
      @onSendTest="handleSendTest"
    />
    <!-- 批量导入试题 -->
    <batchExportDiog />
    <!-- 选择已有试卷 -->
    <testpaperDialog
      @onTestArr="handleTestArr"
      @exportTest="handleexportTest"
    />
    <!-- 添加题库 -->
    <quertionDialog @openDialog="handleopenDialog" @onRefresh="handleRefresh" />
    <!-- 穿梭框 -->
    <studentText
      @onTransferId="handleTransferId"
      :personType="personType"
      :createTest="true"
    />
    <!-- <TODO: 这里的穿梭框dialog和添加题库里面的穿梭框dialog干扰了,触发创建考试页面的穿梭框dialog会连添加题库页面穿梭框dialog一起触发,
      因为他们都通过pinia触发的
      这样导致dialog页面数据混乱,最终改成题库页面使用自定义事件到考试页面触发穿梭框dialog，公用一个弹框,又由于题库页面是的弹框是可见老师
    创建考试页面也有一个可见老师穿梭框，这样又导致题库页面使用穿梭框会影响创建考试页面；最终在题库自定义事件传值：题库赋值给questionName；在穿梭框dialog触发自定义事件
  返回穿梭框选中数据时判断如果questionName为题库时，通过pinia将数据传递给题库；否则赋值给添加考试页面中的可见老师，最后在创建考试页面打开穿梭框时将questionName清空 -->
  </el-scrollbar>
</template>

<script lang="ts" setup>
import headeTitle from '../../../components/common/headeTitle.vue';
import { reactive, ref, watch, watchEffect } from 'vue';
import moment from 'moment';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { useMainStore } from '../../../stores/dialog';
import { useRouter } from 'vue-router';
import studentText from '../../../components/content/test/studentText.vue';
import quertionDialog from '../../../components/content/test/quertionDialog.vue';
import questionsList from '../../../components/content/test/questionsList.vue';
import createTestDrawer from '../../../components/content/test/createTestDrawer.vue';
import batchExportDiog from '../../../components/content/test/batchExportDiog.vue';
import testpaperDialog from '../../../components/content/test/testpaperDialog.vue';
import Test from '../../../api/test/test';
const store: any = useMainStore();
const router = useRouter();
const databaseid = ref(); // 题库id
const personType = ref(); //可见 学生 阅卷
const duration = ref(1); // 是否限制时长
const updateDrawer = ref({}); // 修改试题
const questionName = ref('');
const databaseData: any = ref([]); // 题库数据
watch(duration, (newVal) => {
  if (newVal === 1) {
    ruleForm.limittime = '';
  } else {
    ruleForm.limittime = 90;
  }
});
const ruleFormRef: any = ref<FormInstance>();
interface IKey {
  [propName: string]: any;
}
// 题目类型
const subject = ref([
  {
    title: '单选题',
    num: 0,
    score: 0,
  },
  {
    title: '填空题',
    num: 0,
    score: 0,
  },
  {
    title: '多选题',
    num: 0,
    score: 0,
  },
  {
    title: '问答题',
    num: 0,
    score: 0,
  },
  {
    title: '判断题',
    num: 0,
    score: 0,
  },
]);
// 考试添加试题模型
const testModel = {
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
// 考试添加信息
const ruleForm: IKey = reactive({
  id: 0,
  title: '', // 标题
  info: '', // 说明
  admin: 'admin', // 登录用户名
  begintime: null, // 开放时间
  endtime: null, //结束时间
  limittime: '' as number | string, // 考试时长
  scores: 0, // 总分
  pastscores: 60, // 通过分数
  qorder: 0, // 防作弊试题打乱
  aorder: 0, // 防作弊
  answershow: 1, // 交卷后显示的类别 1 - 5
  isshow: 1, // 题库是否被他人使用 1 全部 2 不可 3 部分可见
  databaseid: 20, // 当前考试的基础id
  state: 1, // 发布状态 发布 1 不发布 2
  limits: [] as Array<{ id: number }>, // 可见老师id
  markteachers: [] as Array<{ id: number }>, // 阅卷老师id
  students: [] as Array<{ studentid: number }>, // 可见学生id
  questions: [],
  // 试题列表
});
// 监听分值变化
watchEffect(() => {
  // 将所有试题遍历一遍
  ruleForm.questions.forEach((item: any) => {
    // 先将subject里面所有的title取出来放入数组 ['单选题', '填空题', '多选题', '问答题', '判断题']
    let subjects = subject.value.map((s) => s.title);
    // 找到下标
    let index = subjects.findIndex((t) => t === item.type);
    // 如果题目中有当前类型，每个题的分数为题目中的分数
    if (subjects.includes(item.type) && subject.value[index].score !== 0) {
      item.scores = subject.value[index].score;
    }
  });
  // 监听题目变化
  subject.value.forEach((item) => {
    // 同一类型题目数量更新
    item.num = ruleForm.questions.filter(
      (item1: any) => item1.type === item.title
    ).length;
  });
  // 根据所有添加题变化计算出总分数
  ruleForm.scores = ruleForm.questions.reduce((pre: number, item: any) => {
    return pre + Number(item.scores);
  }, 0);
  console.log(ruleForm.scores);
});
// 监听数据回显
watch(
  () => store.createTestData,
  (newVal) => {
    if (Object.keys(newVal).length) {
      Object.keys(ruleForm).forEach((key: string) => {
        ruleForm[key] = JSON.parse(JSON.stringify(newVal))[key];
      });
    }
  },
  { deep: true, immediate: true }
);
// 打开添加试题弹框
const onAdditionTest = () => {
  store.$patch((state: { createAddTest: boolean; createTestTitle: string }) => {
    state.createAddTest = true;
    state.createTestTitle = '添加';
  });
};
// 试题列表 删除
const handelTestDel = (index: number) => {
  ruleForm.questions.splice(index, 1);
};
// 表单校验
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请填写考试名称', trigger: 'blur' }],
});
// 日期相关
const value = ref();
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    },
  },
];
// 获取日期选择器选中时间
const getDate = (dateArr: Array<Object> | null) => {
  if (dateArr === null) {
    ruleForm.begintime = null;
    ruleForm.endtime = null;
    return;
  }
  ruleForm.begintime = moment(dateArr![0]).format('YYYY-MM-DD HH:mm:ss');
  ruleForm.endtime = moment(dateArr![1]).format('YYYY-MM-DD HH:mm:ss');
};
// 学生
const handelStudent = () => {
  personType.value = '学生';
  openDialog();
};
// 可见
const handlevisible = () => {
  personType.value = '可见';
  openDialog();
};
// 阅卷老师
const handlePaper = () => {
  personType.value = '阅卷老师';
  openDialog();
};
// 打开弹框
const openDialog = () => {
  questionName.value = '';
  store.$patch((state: { showSkyDialog: boolean }) => {
    state.showSkyDialog = true;
  });
};
// 穿梭框返回的数据
const handleTransferId = (ids: Array<number>, title?: string) => {
  if (title === '学生考试列表') {
    const arrA = onFilter(ids, 'studentid', 'students');
    ruleForm.students = [...ruleForm.students, ...arrA];
  } else if (title === '可见老师') {
    const arrB = onFilter(ids, 'id', 'limits');
    // 如果是添加题库页面使用，通过pinia传递过去
    if (questionName.value === '题库') {
      store.$patch((state: { visibleTeacher: { [x: string]: number }[] }) => {
        state.visibleTeacher = arrB;
      });
    } else {
      // 如果是创建考试页面使用，直接赋值给添加试题可见老师
      ruleForm.limits = [...ruleForm.limits, ...arrB];
    }
  } else if (title === '阅卷老师') {
    const arrC = onFilter(ids, 'id', 'markteachers');
    ruleForm.markteachers = [...ruleForm.markteachers, ...arrC];
  }
};
// 穿梭框已选过的不在存放
const onFilter = (ids: Array<number>, idName: string, ruleKey: string) => {
  return ids
    .map((item: number) => {
      return {
        [idName]: item,
      };
    })
    .filter(
      (item: any) =>
        !ruleForm[ruleKey].some((item1: any) => item1[idName] === item[idName])
    );
};
// 获取题库
const getDatabaseList = async () => {
  const res: any = await Test.tikList({});
  if (res.errCode === 10000) {
    databaseData.value = res.data.list;
  }
};
getDatabaseList();
// 添加试题
const onAddTest = (state: number) => {
  ruleFormRef.value.validate(async (flag: boolean) => {
    if (flag) {
      ruleForm.state = state;
      if (!ruleForm.questions.length) return ElMessage.error('请添加试题');
      if (!ruleForm.limits.length) return ElMessage.error('请添加可见老师');
      const res: any = await Test.addText(ruleForm);
      if (res.errCode === 10000) {
        ElMessage.success(ruleForm.id ? '修改成功' : '添加成功');
        router.push('/index/subjects');
      }
    }
  });
};
// 创建题库
const onQuestion = () => {
  store.$patch((state: { questionDialog: boolean }) => {
    state.questionDialog = true;
  });
};
// 更新下拉菜单题库列表
const handleRefresh = () => {
  getDatabaseList();
};
// 通过自定义事件打开穿梭框dialog
const handleopenDialog = (title: string) => {
  personType.value = '可见';
  openDialog();
  questionName.value = title;
};
// 接收添加试题页面的数据 存入
const handleSendTest = (data: any, title: string) => {
  if (title === '添加') {
    ruleForm.questions.push(data);
  } else {
    ruleForm.questions[store.testIndex] = data;
  }
};
// 修改试题
const handleTestUpdate = (data: any, index: number) => {
  store.$patch(
    (state: {
      createAddTest: boolean;
      createTestTitle: string;
      testIndex: number;
    }) => {
      state.createAddTest = true;
      state.createTestTitle = '修改';
      state.testIndex = index;
    }
  );
  updateDrawer.value = JSON.parse(JSON.stringify(data));
};
// 取消
const onCancel = () => {
  router.push('/index/subjects');
};
// 批量导入
const batchExport = () => {
  store.$patch((state: { showExportDialog: boolean }) => {
    state.showExportDialog = true;
  });
};
// 选择已有试卷
const onAlready = () => {
  store.$patch(
    (state: { testpaperTitle: string; showTestpaperDialog: boolean }) => {
      state.testpaperTitle = '试卷';
      state.showTestpaperDialog = true;
    }
  );
};
// 从题库导入
const onDatabase = () => {
  store.$patch(
    (state: { testpaperTitle: string; showTestpaperDialog: boolean }) => {
      state.testpaperTitle = '题库';
      state.showTestpaperDialog = true;
    }
  );
};
// 获取选中已有试卷
const handleexportTest = (data: any) => {
  let obj: any = {};
  Object.keys(testModel).forEach((key: any) => {
    obj = { ...obj, ...{ [key]: data[key] } };
  });
  ruleForm.questions.push(obj);
};
// 清空试题
const handleClear = () => {
  ruleForm.questions = [];
};
// 通过自定义事件获取从题库导出来的试题
const handleTestArr = (data: any) => {
  console.log(data);
  let obj: any = {};
  data.forEach((item: any) => {
    Object.keys(testModel).forEach((key: any) => {
      obj[key] = item[key];
    });
    ruleForm.questions.push(obj);
  });
};
</script>
<style lang="less" scoped>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}
.create-container {
  .bottons {
    margin: 40px 0;
    padding: 0 20%;
  }
  .content {
    .title {
      margin: 20px 0;
      height: 56px;
      background-color: #f9faff;
      padding: 5px 30px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      span:first-of-type {
        font-size: 36px;
        color: #c7e5ff;
        margin-right: 20px;
      }
    }
    .choice {
      position: relative;
      .counts {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: rgba(64, 158, 255);
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(40%, -40%);
        text-align: center;
        line-height: 20px;
        color: white;
      }
    }
    .msg {
      padding: 0 8%;
    }
    .test-name {
      width: 500px;
    }
    .set {
      :deep(.el-form-item) {
        display: flex;
        align-items: center;
      }
      .date {
        display: flex;
        align-items: center;
        width: 560px !important;
        .notfill {
          color: #c3c3c3;
          margin-left: 10px;
        }
      }
      .duration {
        margin-left: 20px;
        span {
          margin-left: 5px;
        }
      }
    }
  }
}
:deep(.el-checkbox.el-checkbox--large) {
  height: auto;
}
</style>
