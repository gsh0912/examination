<template>
  <publicDialog
    @onCloseDialog="onClose"
    :dialogVisible="store.showTestpaperDialog"
    :title="store.testpaperTitle + '列表'"
    :width="'80%'"
  >
    <!-- TODO: 这个弹框是 “选择已有试卷”和“从题库导入”公用的弹框 -->
    <template #content>
      <el-form
        style="margin-top: -20px"
        :inline="true"
        :model="config"
        class="demo-form-inline"
      >
        <el-form-item label="名称">
          <el-input
            @keyup.enter="onSubmit"
            v-model="config.key"
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item label="创建人">
          <el-input
            @keyup.enter="onSubmit"
            v-model="config.admin"
            placeholder="请输入创建人昵称"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="config.ismy" :true-label="1" :false-label="0"
            >只看我创建的</el-checkbox
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <TableConfig
        v-if="store.showTestpaperDialog"
        @onSelectRadio="handleSelectRadio"
        @on-page="handelPage"
        @on-psize="handlePsize"
        :tableConfig="tableConfig"
        :tableData="tableData"
      />
    </template>
    <template #button>
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" @click="onConfirm"> 确定 </el-button>
    </template>
  </publicDialog>
  <publicDialog
    @onCloseDialog="onClose1"
    :dialogVisible="store.showTestpaperList"
    :title="databaseTitle ? databaseTitle : '题库试题列表'"
    :width="'80%'"
  >
    <!-- TODO: 这个弹框是选中题库时，打开试题弹框 -->
    <template #content>
      <el-form
        style="margin-top: -20px"
        :inline="true"
        :model="config1"
        class="demo-form-inline"
      >
        <el-form-item label="试题名称">
          <el-input
            @keyup.enter="onSubmit1"
            v-model="config1.key"
            placeholder="试题名称"
          />
        </el-form-item>
        <el-form-item label="题目类型">
          <el-select clearable v-model="config1.type" placeholder="请选择">
            <el-option
              :label="item"
              :key="index"
              v-for="(item, index) in typeArr"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit1">查询</el-button>
        </el-form-item>
      </el-form>
      <TableConfig
        v-if="store.showTestpaperList"
        @onSelectMsg="handleSelectMsg"
        :tableConfig="tableConfig1"
        :tableData="tableData1"
      />
    </template>
    <template #button>
      <el-button @click="onClose1">取消</el-button>
      <el-button type="primary" @click="onConfirm1"> 确定 </el-button>
    </template>
  </publicDialog>
</template>

<script lang="ts" setup>
import publicDialog from "../../../components/common/publicDialog.vue";
import Test from "../../../api/test/test";
import TableConfig from "../../common/TableConfig.vue";
import { reactive, ref, watch } from "vue";
import { useMainStore } from "../../../stores/dialog";
const store:any = useMainStore();
const emit = defineEmits(["exportTest", "onTestArr"]);
const databaseTitle = ref("");
const testpaperId = ref(0);
const testArr = ref([]);
const typeArr = ["单选题", "多选题", "问答题", "填空题", "判断题"];
// 列表过滤数据
const config = reactive({
  key: "", // 关键字
  admin: "", // 创建人
  ismy: 0, // 我创建的
  page: 1,
  psize: 10,
});
// 列表过滤数据
const config1 = reactive({
  databaseid: 0,
  type: "",
  key: "",
  page: 1,
  psize: 10,
});
// 表格配置
const tableConfig = reactive({
  tableData: [], // 表格数据
  isCheck: false, // 是否显示多选框
  height: 50,
  total: 0,
});
// 表格展示数据key
const tableData = [
  { label: "名称", prop: "questionB", width: 200 },
  { label: "题目数量", prop: "counts" },
  { label: "创建时间", prop: "addtime" },
  { label: "创建人", prop: "admin" },
];

// 表格配置
const tableConfig1 = reactive({
  tableData: [], // 表格数据
  isCheck: true, // 是否显示多选框
  height: 50,
  total: 0,
  flag: true,
});
// 表格展示数据key
const tableData1 = [
  { label: "题目", prop: "title" },
  { label: "题目类型", prop: "type" },
  { label: "分数", prop: "scores" },
];
// 监听store.testpaperTitle来请求不同的数据类别
watch(
  () => store.testpaperTitle,
  (newVal) => {
    if (newVal === "试卷") {
      getSubjectList();
    } else if (newVal === "题库") {
      getDatabaseList();
    }
  },
  { deep: true }
);
watch(
  () => config1.type,
  () => {
    getTestpaperList();
  },
  { deep: true }
);
const onSubmit = () => {
  if (store.testpaperTitle === "试卷") {
    getSubjectList();
  } else if (store.testpaperTitle === "题库") {
    getDatabaseList();
  }
};
// 试卷列表
const getSubjectList = async () => {
  const res:any = await Test.reqSubjectList(config);
  if (res.errCode === 10000) {
    tableConfig.tableData = res.data.list;
    tableConfig.total = res.data.counts;
  }
};
const handelPage = (val: number) => {
  config.page = val;
  if (store.testpaperTitle === "试卷") {
    getSubjectList();
  } else if (store.testpaperTitle === "题库") {
    getDatabaseList();
  }
};
const handlePsize = (val: number) => {
  config.psize = val;
  if (store.testpaperTitle === "试卷") {
    getSubjectList();
  } else if (store.testpaperTitle === "题库") {
    getDatabaseList();
  }
};
// 题库列表
const getDatabaseList = async () => {
  const res:any = await Test.reqDatabaseList(config);
  if (res.errCode === 10000) {
    tableConfig.tableData = res.data.list;
    tableConfig.total = res.data.counts;
  }
};
// 获取选择试卷id
const handleSelectRadio = (id: number) => {
  testpaperId.value = id;
};
// 关闭弹框
const onClose = () => {
  store.$patch((state:any) => {
    state.showTestpaperDialog = false;
  });
  config.key = "";
  config.admin = "";
  config.ismy = 0;
  config.page = 1;
  config.psize = 10;
  getSubjectList();
};
// 关闭弹框,试题弹框
const onClose1 = () => {
  store.$patch((state:any) => {
    state.showTestpaperList = false;
  });
};
// 点击确定获取试卷单体信息传递给父组件
const onConfirm = async () => {
  // 点击试卷题库公用dialog确定时判断，如 果时试卷直接将那个试卷习题传递过去
  if (store.testpaperTitle === "试卷") {
    const res:any = await Test.reqSubjectOne({ id: testpaperId.value });
    if (res.errCode === 10000) {
      res.data.questions.forEach((item: any) => {
        emit("exportTest", item);
      });
      onClose();
    }
    // 如果是题库 关闭当前dialog，打开新的dialog（题库试题列表）
  } else if (store.testpaperTitle === "题库") {
    store.$patch((state:any) => {
      state.showTestpaperList = true;
      state.showTestpaperDialog = false;
    });
    getTestpaperList();
  }
};
const getTestpaperList = async () => {
  config1.databaseid = testpaperId.value;
  const res:any = await Test.reqDatabasequestion(config1);
  if (res.errCode === 10000) {
    if (res.data.database) databaseTitle.value = res.data.database.title;
    tableConfig1.tableData = res.data.list;
    tableConfig1.total = res.data.counts;
  }
};
const onSubmit1 = () => {
  getTestpaperList();
};
// 获取选中的题目
const handleSelectMsg = (val: any) => {
  testArr.value = val;
};
const onConfirm1 = () => {
  emit("onTestArr", testArr.value);
  onClose1();
};
</script>
<style lang="less" scoped></style>
